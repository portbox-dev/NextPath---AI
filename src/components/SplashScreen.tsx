import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Compass, Layers } from 'lucide-react';
import { nextPathIcon } from '../assets/brandAssets';

interface SplashScreenProps {
  onDismiss: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 5;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      id="splash-screen-container"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07090e] px-4 text-center overflow-hidden animate-in fade-in duration-300"
    >
      {/* Subtle background ambient lighting */}
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" 
      />

      <div className="relative z-10 max-w-md w-full flex flex-col items-center">
        {/* Official NextPath AI Icon Asset */}
        <div id="splash-logo-wrapper" className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#090d16] border border-indigo-500/25 p-3 flex items-center justify-center shadow-xl shadow-indigo-950/40 overflow-hidden">
            <img
              src={nextPathIcon}
              alt="NextPath AI Icon"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        </div>

        {/* Title */}
        <h1 
          id="splash-title"
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2.5"
        >
          NextPath <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">AI</span>
        </h1>

        {/* Tagline */}
        <p 
          id="splash-tagline"
          className="text-base sm:text-lg font-medium text-slate-300 mb-2 max-w-sm"
        >
          Your AI guide for career and skill development.
        </p>

        {/* Target audience subtext */}
        <p className="text-xs text-slate-400 mb-6 max-w-xs leading-relaxed">
          Empowering students to explore career trajectories, master in-demand skills, and build structured roadmaps.
        </p>

        {/* Feature badges preview */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-7">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Skill Roadmaps</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Career Discovery</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Personalized Memory</span>
          </div>
        </div>

        {/* Progress Bar & Enter Button */}
        <div className="w-full max-w-xs flex flex-col items-center gap-3.5">
          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/40">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            id="splash-enter-btn"
            onClick={onDismiss}
            className="w-full py-2.5 px-5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 active:scale-[0.98] transition duration-200 shadow-md shadow-indigo-950/50 flex items-center justify-center gap-2 cursor-pointer border border-indigo-400/20"
          >
            <span>Enter NextPath AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-5 text-[11px] text-slate-400">
          Tailored for high school, college & university students
        </div>
      </div>
    </div>
  );
};
