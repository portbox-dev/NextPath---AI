import React from 'react';
import { Sparkles, Target, Award, BookOpen, ArrowRight, Compass } from 'lucide-react';
import { nextPathIcon, nextPathLogo } from '../assets/brandAssets';

interface AboutViewProps {
  onGoToChat: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onGoToChat }) => {
  return (
    <div id="about-view-container" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#07090e]">
      <div className="max-w-4xl mx-auto">
        {/* Hero Branding Section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#090d16] border border-indigo-500/30 p-2.5 mb-4 shadow-xl shadow-indigo-950/40">
            <img
              src={nextPathIcon}
              alt="NextPath AI"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            NextPath <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">AI</span>
          </h2>
          <p className="text-base font-medium text-slate-300 mb-2">
            Your AI guide for career and skill development.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Get clear guidance about careers, skills, learning paths and your next steps.
          </p>
        </div>

        {/* Full Branding Banner Preview */}
        <div className="mb-10 p-4 sm:p-6 rounded-2xl bg-[#090d16] border border-slate-800/80 flex flex-col items-center justify-center text-center">
          <div className="max-w-md w-full overflow-hidden rounded-xl bg-black/40 border border-slate-800 p-3 mb-3">
            <img
              src={nextPathLogo}
              alt="NextPath AI Official Logo"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain rounded"
            />
          </div>
          <p className="text-xs text-slate-400">
            Official Brand Identity • Designed specifically for student career acceleration
          </p>
        </div>

        {/* Mission & Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
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

        {/* Action Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/30 via-indigo-950/30 to-purple-950/30 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>NextPath AI Career & Skill Companion</span>
            </h4>
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
