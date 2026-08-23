/**
 * NextPath AI Mock Responses for Front-End Chat Experience (Step 3)
 * Provides realistic pre-defined responses for student career exploration
 * without connecting to external AI APIs.
 */

export function getMockAIResponse(userInput: string): string {
  const query = userInput.toLowerCase().trim();

  // 1. Exact / Closely matching common career questions requested in Step 3
  if (
    query.includes('become a software developer') ||
    query.includes('software engineer') ||
    query.includes('software dev') ||
    query.includes('software development')
  ) {
    return "That's a great goal. Let's first understand your current skills, then we can create a step-by-step roadmap covering programming, DSA, projects and internships.";
  }

  if (
    query.includes('web development') ||
    query.includes('learn for web') ||
    query.includes('web dev') ||
    query.includes('frontend') ||
    query.includes('front end')
  ) {
    return "For a beginner, start with HTML, CSS and JavaScript. After building a few projects, you can move toward a frontend framework and backend development.";
  }

  if (
    query.includes("don't know what career") ||
    query.includes('dont know what career') ||
    query.includes('choose a career') ||
    query.includes('career to choose') ||
    query.includes('confused about career') ||
    query.includes('undecided')
  ) {
    return "That's completely fine. We can explore your interests, strengths and preferred type of work before choosing a career path.";
  }

  // 2. Starter Card / Prompt matching
  if (query.includes('web dev vs ai') || query.includes('ai engineering') || query.includes('which career path is better')) {
    return "Both career paths offer immense growth in 2026!\n\n• Web Development: Faster time-to-market for personal projects, visual feedback, and abundant junior roles.\n• AI Engineering: Focuses on model integration, Python, data pipelines, and prompt architectures.\n\nFor a student, starting with strong programming fundamentals and building web projects first gives a great foundation before diving deep into AI.";
  }

  if (query.includes('6-month') || query.includes('learning plan') || query.includes('realistic 6-month')) {
    return "Here is a high-level 6-month roadmap:\n\n• Months 1-2: Core Programming (TypeScript or Python) & DSA fundamentals.\n• Months 3-4: Build 2-3 fullstack web applications with modern frameworks.\n• Month 5: Integrate databases, APIs, and cloud deployments.\n• Month 6: Polish your GitHub portfolio, tailor your resume, and practice mock technical interviews.\n\nTake a look at the 'My Roadmap' tab for the full visual milestone tracker!";
  }

  if (query.includes('internship') || query.includes('first tech internship') || query.includes('resume')) {
    return "To land your first tech internship as a student:\n\n1. Build 2 flagship projects that solve real problems (not just tutorial clones).\n2. Showcase them on a clean GitHub with good README documentation and live demo links.\n3. Create a concise 1-page resume highlighting technical stack and impact.\n4. Practice fundamental DSA problems (arrays, trees, maps) and participate in campus hackathons.";
  }

  if (query.includes('high-demand') || query.includes('skills in 2026') || query.includes('top 5')) {
    return "Top high-demand skills for students graduating in 2026:\n\n1. Modern Full-Stack Development (TypeScript, React, Next/Node)\n2. Cloud & Containerization (Docker, Serverless, Cloud Run)\n3. AI & LLM System Integration (Prompt design, vector search, API agents)\n4. Database Architecture (PostgreSQL & NoSQL)\n5. Collaborative Engineering (Git workflows, testing, clear technical communication)";
  }

  // 3. Milestone-specific questions
  if (query.includes('milestone 1') || query.includes('computer fundamentals')) {
    return "For Computer Fundamentals: Focus on command line basics (cd, ls, grep, piping), how memory and CPU cache function, and basic HTTP/networking protocols. Spending 2-3 weeks here makes debugging much easier later!";
  }

  if (query.includes('milestone 2') || query.includes('programming fundamentals')) {
    return "For Programming Fundamentals: Focus on writing clean functions, understanding scope, control flow, loops, and Object-Oriented Principles. Practice breaking down small logic problems before jumping to large frameworks.";
  }

  if (query.includes('milestone 3') || query.includes('dsa') || query.includes('data structures') || query.includes('algorithms')) {
    return "For Data Structures & Algorithms: Start with Arrays, Hash Maps, and Strings. Then move to Linked Lists, Binary Trees, and fundamental searching/sorting algorithms. Analyze the Time and Space complexity (Big-O) of every solution.";
  }

  if (query.includes('milestone 4') || query.includes('git') || query.includes('github')) {
    return "For Git & GitHub: Master git init, add, commit, push, pull, branch, and merge. Practice opening clean Pull Requests on GitHub with descriptive PR summaries and atomic commits.";
  }

  if (query.includes('milestone 6') || query.includes('build real projects') || query.includes('flagship project')) {
    return "When building real projects: Aim for 2 polished applications that solve specific problems (e.g., student task planner, campus event finder). Include user authentication, database persistence, responsive styling, and a live hosted demo link!";
  }

  if (query.includes('milestone 7') || query.includes('internship preparation')) {
    return "For Internship Preparation: Keep your resume to 1 page, put your best 2 projects right below education/skills, add GitHub/LinkedIn links, and practice explaining your architectural choices using the STAR method.";
  }

  if (query.includes('milestone 8') || query.includes('job preparation')) {
    return "For Job Preparation: Focus on communicating your thought process aloud during technical interviews, practicing behavioral scenarios, and understanding high-level system design patterns (caching, database indexing, client-server load).";
  }

  // 4. General student questions

  if (query.includes('roadmap') || query.includes('path') || query.includes('milestone')) {
    return "A structured roadmap helps break down intimidating goals into actionable weekly targets. You can inspect your customized milestone tracker in the 'My Roadmap' section!";
  }

  if (query.includes('what do you remember') || query.includes('my memory') || query.includes('show my memory') || query.includes('stored memory')) {
    return "I reference all the career details, skills, and goals stored in your 'My Memory' section. You can view, add, edit, or clear any stored details anytime by navigating to 'My Memory' in the navigation menu!";
  }

  // 4. Default generic response specified in prompt
  return "I'm still in foundation mode. Once AI integration is added, I'll be able to provide personalized career and skill guidance.";
}
