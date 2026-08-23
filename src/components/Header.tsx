import React from 'react';
import { Menu, Plus, Eye, Sparkles } from 'lucide-react';
import { ActiveTab } from '../types';
import { nextPathIcon } from '../assets/brandAssets';

interface HeaderProps {
  activeTab: ActiveTab;
  onOpenMobileMenu: () => void;
  onNewChat: () => void;
  onShowSplash: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileMenu,
  onNewChat,
  onShowSplash,
}) => {
  const getTabLabel = (tab: ActiveTab) => {
    switch (tab) {
      case 'chat':
        return 'Career & Skill Advisor';
      case 'roadmap':
        return 'Your Career Roadmap';
      case 'memory':
        return 'My Memory & Context';
      case 'about':
        return 'About NextPath AI';
      case 'settings':
        return 'Settings & Preferences';
    }
  };

  return (
    <header
      id="main-app-header"
      className="h-16 border-b border-slate-800/80 bg-[#07090e]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20 shrink-0"
    >
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          id="mobile-menu-toggle-btn"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Small Official Logo for Mobile / Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#090d16] border border-indigo-500/30 p-1 flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={nextPathIcon}
              alt="NextPath AI"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base tracking-tight text-white">
                NextPath <span className="text-indigo-400">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Student
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden md:block">
              {getTabLabel(activeTab)}
            </span>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <button
          id="header-view-splash-btn"
          onClick={onShowSplash}
          title="View Welcome Splash Screen"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60 transition cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Splash</span>
        </button>

        <button
          id="header-new-chat-btn"
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>

        <div className="hidden sm:flex items-center pl-2 border-l border-slate-800 ml-1">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </header>
  );
};
