import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware for JSON body parsing
  app.use(express.json({ limit: "1mb" }));

  // Initialize GoogleGenAI client lazily / securely with User-Agent telemetry
  const getAIClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Helper to determine if an error is transient and eligible for retry
  const isRetryableError = (err: any): boolean => {
    if (!err) return false;

    const status = Number(err.status || err.statusCode || err.response?.status || err.error?.code);
    if (status === 503 || status === 429 || status === 500 || status === 502 || status === 504) {
      return true;
    }

    const message = String(err.message || err.toString() || "").toLowerCase();
    const errorStatus = String(err.error?.status || err.code || "").toLowerCase();

    // Check for explicit non-retryable 4xx client errors
    if (status === 400 || status === 401 || status === 403 || status === 404) {
      return false;
    }
    if (
      message.includes("api key not valid") ||
      message.includes("invalid api key") ||
      message.includes("permission_denied") ||
      message.includes("unauthenticated")
    ) {
      return false;
    }

    // Check for common transient / high demand error indicators
    return (
      message.includes("503") ||
      message.includes("429") ||
      message.includes("unavailable") ||
      message.includes("high demand") ||
      message.includes("resource_exhausted") ||
      message.includes("overloaded") ||
      message.includes("temporarily") ||
      message.includes("econnreset") ||
      message.includes("etimedout") ||
      message.includes("timeout") ||
      message.includes("fetch failed") ||
      message.includes("socket hang up") ||
      errorStatus.includes("unavailable") ||
      errorStatus.includes("resource_exhausted")
    );
  };

  const isTemporaryBusyError = (err: any): boolean => {
    if (!err) return false;
    const status = Number(err.status || err.statusCode || err.response?.status || err.error?.code);
    if (status === 503 || status === 429) return true;
    const message = String(err.message || err.toString() || "").toLowerCase();
    const errorStatus = String(err.error?.status || err.code || "").toLowerCase();
    return (
      message.includes("503") ||
      message.includes("429") ||
      message.includes("unavailable") ||
      message.includes("high demand") ||
      message.includes("resource_exhausted") ||
      message.includes("overloaded") ||
      message.includes("temporarily") ||
      errorStatus.includes("unavailable") ||
      errorStatus.includes("resource_exhausted")
    );
  };

  // Helper sleep for backoff delays
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Health check endpoint
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Gemini Chat Endpoint with Exponential Backoff Retry (Max 3 attempts: ~1s, ~2s, ~4s)
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, history, memory } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required." });
      }

      const ai = getAIClient();
      if (!ai) {
        return res.status(503).json({
          error: "NextPath AI is temporarily unavailable. Please try again in a moment.",
          fallback: true,
        });
      }

      // Format Student Memory Context
      let memoryContextText = "";
      if (Array.isArray(memory) && memory.length > 0) {
        const memoryLines = memory
          .filter((item: any) => item && item.label && item.value)
          .map((item: any) => `- ${item.label} (${item.category || "General"}): ${item.value}`);

        if (memoryLines.length > 0) {
          memoryContextText = `\n\n[STUDENT MEMORY & PROFILE CONTEXT - REFERENCE WHEN RELEVANT]\n${memoryLines.join("\n")}\n`;
        }
      }

      const systemInstruction = `You are "NextPath AI", your tagline is "Your AI guide for career and skill development."
You are an expert, encouraging, objective, and highly practical AI career and skill development guide built specifically for students.

Your primary mission is to help students with:
- Career discovery and exploration
- Skill gap analysis and personalized learning roadmaps
- Clear, optimal learning order from fundamentals to advanced concepts
- Practical, portfolio-ready project ideas tailored to their current skill level
- Tech internship and job preparation (resumes, portfolios, mock behavioral/technical interviews)
- Education, degree options, and academic pathways
- Honest, realistic tech career guidance

========================================
STRICT CORE RULES & BEHAVIORAL PROTOCOLS
========================================

1. ABSOLUTE MANDATE: ZERO PERSONAL DATA INVENTIONS
   - You must never invent personal information about the student. Treat only the supplied conversation and explicitly supplied My Memory data as facts. If a personal detail is not supplied, do not claim to know it.
   - Do NOT invent, assume, or hallucinate:
     * Student name (if the user's name is not explicitly in the active conversation or saved memory, NEVER make up a name like "Alex", "John", etc. Address them warmly without a name).
     * Degree, college, university name, academic year, semester, or GPA.
     * Programming languages known, technical skills, or frameworks (e.g. do not assume they know React, Python, or JavaScript unless they explicitly stated it).
     * Work experience, internships, or previous project history.
     * Interests, target careers, or geographic location.
   - Use ONLY information that is explicitly stated in the active conversation or explicitly listed in the provided [STUDENT MEMORY & PROFILE CONTEXT].
   - Never reference imaginary "background notes", hidden profiles, or unmentioned facts.

2. SKILL-GAP REASONING & LOGICAL LEARNING ORDER
   - Always evaluate the progression:
     CURRENT KNOWLEDGE → TARGET CAREER → MISSING SKILLS → LEARNING ORDER → PRACTICE → PROJECTS → INTERNSHIP/CAREER PREPARATION
   - Never provide a generic roadmap that ignores what the student has already mastered.
   - Build from fundamentals to advanced topics. Never skip prerequisites (e.g. do NOT recommend advanced frameworks like React/Next.js before HTML, CSS, JavaScript, DOM, and asynchronous programming fundamentals are mastered).
   - If a student knows a foundational technology (e.g. C++ or HTML), identify the exact next logical step without making them repeat what they know.

3. DIVERSE CAREER FIELDS & GOAL CLARIFICATION
   - Do NOT default or assume every student wants web development.
   - Students work across diverse tech areas: systems programming, backend engineering, cloud/DevOps, mobile development (iOS/Android/Flutter), data science/AI/ML, cybersecurity, game development, embedded systems, QA/testing, and product/UI engineering.
   - If a student asks a general question (e.g. "I know C++ and want to become a software developer"), briefly outline the distinct specialization paths (e.g. systems/embedded, backend, game development, high-performance computing) and ask which direction interests them, or tailor to the target they specify.

4. REALISTIC RESOURCE GUIDELINES (NO FABRICATIONS)
   - Do NOT fabricate or hallucinate specific URLs, YouTube links, course links, live ratings, view counts, subscriber counts, or claims that a specific tutorial is "the #1 highest rated course today".
   - Suggest reputable resource CATEGORIES and LEARNING MATERIAL TYPES (e.g. official language/framework documentation, interactive browser-based coding platforms, standard university lecture archives, standard textbooks, open-source repositories, and community project prompts).

5. BALANCED DEGREE & FORMAL EDUCATION GUIDANCE
   - When discussing degrees and formal education, explain that degree and credential requirements vary widely across companies, industries, and countries.
   - Outline viable options realistically: relevant degree majors, postgraduate studies, industry certifications where genuinely recognized, alongside strong self-taught / portfolio routes.
   - Never claim that a specific university degree is universally mandatory unless legally/strictly required for that licensed profession.

6. STRUCTURED ROADMAP FORMAT
   - When answering roadmap or learning pathway requests, structure your response using these clear, scannable sections:
     1. **Where You Are Now** (based strictly on verified user background)
     2. **Your Target** (the role or direction being pursued)
     3. **Skills You Already Have** (explicitly acknowledged skills)
     4. **Skills You Still Need** (identified skill gaps)
     5. **Recommended Learning Order** (step-by-step phased progression)
     6. **Practice & Projects** (concrete hands-on project ideas with increasing complexity)
     7. **Career Preparation** (Git/GitHub, portfolio presentation, resume, internship readiness)
     8. **Suggested Next Step** (an immediate, actionable first task)
   - Keep responses student-friendly, actionable, and appropriately concise without unnecessary filler text.

7. INTELLECTUAL HONESTY & NO FALSE CLAIMS
   - Never pretend to live-browse the internet or search live job portals.
   - Never claim: "I checked current job listings", "I found the most popular course today", "I checked YouTube engagement", or "I looked at GitHub projects".
   - If current live data is not available, state clearly what standard industry practice is.

8. LEARNING STAGE EXPLORATION & PROJECT GUIDANCE PROTOCOL
   - When a student asks to explore a specific roadmap stage, concept, or project idea:
     1. Clearly explain **Why This Stage Matters** for their target career.
     2. Provide the **Recommended Step-by-Step Learning Order & Core Subtopics** (skipping what is already verified in My Memory).
     3. Suggest **Concrete Practice Exercises & Problem Types** to test their understanding.
     4. Offer **Realistic Student Project Ideas** (Beginner, Intermediate, and Advanced) with clear practical scope.
     5. Highlight **Common Pitfalls & Mistakes to Avoid**.
     6. Give an **Immediate Actionable First Step**.
   - Ensure project recommendations are hands-on, realistic, and educational for students.
   - Do not claim the student has completed any stage or built any project unless they explicitly stated it.
${memoryContextText}`;

      // Build conversation contents for multi-turn chat (keep last 8 turns for token efficiency)
      const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history) && history.length > 0) {
        const recentHistory = history.slice(-8);
        for (const turn of recentHistory) {
          if (turn && turn.content && turn.role) {
            const role = turn.role === "assistant" || turn.role === "model" ? "model" : "user";
            contents.push({
              role,
              parts: [{ text: String(turn.content) }],
            });
          }
        }
      }

      // Append current user message
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      // Execute with Exponential Backoff Retry (Max 3 attempts: ~1s, ~2s, ~4s)
      const maxAttempts = 3;
      const backoffDelays = [1000, 2000, 4000];
      let lastError: any = null;
      let response = null;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });
          // Successful generation
          break;
        } catch (err: any) {
          lastError = err;
          const retryable = isRetryableError(err);
          console.warn(`[Gemini API] Attempt ${attempt}/${maxAttempts} failed:`, err?.message || err);

          // If not retryable (e.g., 400, 401, 403) or reached last attempt, stop retrying
          if (!retryable || attempt >= maxAttempts) {
            break;
          }

          // Backoff delay before next attempt (approx 1s, 2s)
          const delayMs = backoffDelays[attempt - 1] || 1000;
          await sleep(delayMs);
        }
      }

      if (!response) {
        throw lastError || new Error("Failed to generate response after retries.");
      }

      const responseText = response.text || "I'm ready to guide your career path. Could you share more details about your goals or current skills?";

      return res.json({
        reply: responseText,
      });
    } catch (err: any) {
      console.error("Gemini API Final Error in /api/chat:", err?.message || err);

      if (isTemporaryBusyError(err)) {
        return res.status(503).json({
          error: "NextPath AI is temporarily unavailable. Please try again in a moment.",
        });
      }

      return res.status(500).json({
        error: "Sorry, I couldn't connect to NextPath AI right now. Please try again in a moment.",
      });
    }
  });

  // Setup Vite middleware for development, or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NextPath AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
