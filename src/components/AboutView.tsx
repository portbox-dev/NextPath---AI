import React from 'react';
import { Sparkles, Target, Award, BookOpen, ArrowRight, Compass, GraduationCap, Code2, ShieldAlert } from 'lucide-react';
import { nextPathIcon, nextPathLogo } from '../assets/brandAssets';

interface AboutViewProps {
  onGoToChat: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onGoToChat }) => {
  return (
    <div id="about-view-container" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#07090e]">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Hero Branding Section */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#090d16] border border-indigo-500/30 p-2.5 mb-4 shadow-xl shadow-indigo-950/40">
            <img
              src={nextPathIcon}
              alt="NextPath AI App Icon"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            NextPath <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">AI</span>
          </h1>
          <p className="text-lg font-semibold text-slate-200 mb-1">
            Free AI Career Roadmap for Students
          </p>
          <p className="text-base font-medium text-slate-300 mb-2">
            Your AI guide for career and skill development.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Get clear guidance about careers, skills, learning paths and your next steps in software engineering and technology.
          </p>
        </div>

        {/* Full Branding Banner Preview */}
        <div className="p-4 sm:p-6 rounded-2xl bg-[#090d16] border border-slate-800/80 flex flex-col items-center justify-center text-center">
          <div className="max-w-md w-full overflow-hidden rounded-xl bg-black/40 border border-slate-800 p-3 mb-3">
            <img
              src={nextPathLogo}
              alt="NextPath AI Official Logo — Career and Skill Development Guide"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain rounded"
            />
          </div>
          <p className="text-xs text-slate-400">
            Official Brand Identity • Designed specifically for student career acceleration
          </p>
        </div>

        {/* What NextPath AI Does */}
        <div className="p-6 rounded-2xl bg-[#0b101c] border border-slate-800/80 space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Target className="w-4 h-4" />
            </div>
            <span>What NextPath AI Does</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            NextPath AI is an interactive career discovery and skill planning platform designed specifically for students, beginners, and BCA learners. It breaks down complex technical careers—such as Full-Stack Web Development, Frontend Engineering, Backend Systems, Cloud, Data Science, and Cybersecurity—into structured, actionable learning milestones.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            With personalized contextual memory, NextPath AI remembers your degree, semester, current skills, and interests to tailor suggestions, recommend suitable projects, and guide you through real-world interview preparation.
          </p>
        </div>

        {/* Mission & Core Pillars */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>Core Pillars of Student Success</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#0b101c] border border-slate-800/80 hover:border-indigo-500/30 transition">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">
                Career Exploration
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Demystify emerging tech roles, understand daily job responsibilities, and evaluate which field fits your strengths.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0b101c] border border-slate-800/80 hover:border-indigo-500/30 transition">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">
                Custom Skill Trees
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Step-by-step learning roadmaps tailored to your current experience level, curriculum, and semester availability.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0b101c] border border-slate-800/80 hover:border-indigo-500/30 transition">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">
                Internship Readiness
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Actionable advice on impactful portfolio projects, resume tailoring, and behavioral and technical interview strategies.
              </p>
            </div>
          </div>
        </div>

        {/* Who Can Benefit from NextPath AI */}
        <div className="p-6 rounded-2xl bg-[#0b101c] border border-slate-800/80 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span>Who Can Benefit from NextPath AI</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <h3 className="font-semibold text-slate-100 mb-1">College &amp; University Students</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Plan semester goals, college capstone milestones, and prepare early for tech internships and junior developer placements.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <h3 className="font-semibold text-slate-100 mb-1">BCA &amp; Computer Science Undergraduates</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Bridge theoretical degree syllabus gaps with modern, in-demand developer stacks, libraries, and frameworks.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <h3 className="font-semibold text-slate-100 mb-1">Absolute Beginners</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Discover friendly entry points into programming without confusing jargon or overwhelming roadmaps.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <h3 className="font-semibold text-slate-100 mb-1">Self-Taught Learners &amp; Switchers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Transition into software engineering with realistic timelines, structured checklists, and project portfolios.</p>
            </div>
          </div>
        </div>

        {/* How to Create a Career or Skill Roadmap */}
        <div className="p-6 rounded-2xl bg-[#0b101c] border border-slate-800/80 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Compass className="w-4 h-4" />
            </div>
            <span>How to Create a Career or Skill Roadmap</span>
          </h2>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <strong className="text-white block mb-0.5">Tell NextPath AI Your Background</strong>
                <p className="text-xs text-slate-400">Mention your degree, year of study, familiar languages (e.g. C, Python, JavaScript), and what you want to achieve.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <strong className="text-white block mb-0.5">Explore Your Personalized Roadmap</strong>
                <p className="text-xs text-slate-400">Navigate to the "My Roadmap" tab to see staged milestones with clear estimated durations and practice advice.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
              <div>
                <strong className="text-white block mb-0.5">Customize Pace &amp; Build Real Projects</strong>
                <p className="text-xs text-slate-400">Tune your weekly commitment hours, toggle completion status, and build practical projects for your resume.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Steps and Practical Project Ideas */}
        <div className="p-6 rounded-2xl bg-[#0b101c] border border-slate-800/80 space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Code2 className="w-4 h-4" />
            </div>
            <span>Learning Steps &amp; Practical Project Ideas</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            NextPath AI encourages building real portfolio applications at each learning stage:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-400 list-disc list-inside">
            <li><strong className="text-slate-200">Stage 1 (Fundamentals):</strong> Git version control, HTML5 semantic structure, CSS styling, JavaScript/TypeScript, logic building.</li>
            <li><strong className="text-slate-200">Stage 2 (Full-Stack Engineering):</strong> REST APIs, relational databases (PostgreSQL/SQL), user authentication, React components, and responsive design.</li>
            <li><strong className="text-slate-200">Stage 3 (Portfolio Showcase Projects):</strong> Student course portals, personal finance managers, task collaboration tools, and API mashups.</li>
            <li><strong className="text-slate-200">Stage 4 (Cloud &amp; Deployment):</strong> Docker containerization, CI/CD automated deployment, server configurations, and system monitoring.</li>
          </ul>
        </div>

        {/* Platform Scope and Important Limitations */}
        <div className="p-6 rounded-2xl bg-[#0b101c] border border-amber-500/25 space-y-2.5">
          <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span>Platform Scope and Important Limitations</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            NextPath AI is an educational advisory tool designed to accelerate self-directed learning. To maintain transparency, please keep in mind:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
            <li>NextPath AI does not guarantee employment, placements, or campus interview selections.</li>
            <li>The platform does not issue accredited university degrees or formal government certifications.</li>
            <li>Always cross-reference company-specific hiring guidelines, regional job boards, and official academic prerequisites.</li>
          </ul>
        </div>

        {/* Action Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/30 via-indigo-950/30 to-purple-950/30 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>NextPath AI Career &amp; Skill Companion</span>
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              NextPath AI is structured for students with responsive navigation, roadmap visualizers, and memory contextualization.
            </p>
          </div>

          <button
            onClick={onGoToChat}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Start Exploring</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

