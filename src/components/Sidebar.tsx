import React, { useState } from 'react';
import { 
  PlusCircle, 
  Map, 
  Brain, 
  Info, 
  Settings, 
  X, 
  Sparkles, 
  MessageSquare,
  ChevronRight,
  GraduationCap,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { ActiveTab, ChatSession } from '../types';
import { nextPathIcon } from '../assets/brandAssets';
import { formatChatRelativeTime } from '../utils/chatStorage';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onClose: () => void;
  savedChats: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string, e: React.MouseEvent) => void;
  onClearAllChats: () => void;
  memoriesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onNewChat,
  isOpen,
  onClose,
  savedChats,
  activeChatId,
  onSelectChat,
  onDeleteChat,
  onClearAllChats,
  memoriesCount,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const navItems = [
    {
      id: 'chat' as ActiveTab,
      label: 'New Chat',
      icon: PlusCircle,
      action: onNewChat,
      badge: 'Advisor',
    },
    {
      id: 'roadmap' as ActiveTab,
      label: 'My Roadmap',
      icon: Map,
      action: () => onSelectTab('roadmap'),
      badge: 'Path',
    },
    {
      id: 'memory' as ActiveTab,
      label: 'My Memory',
      icon: Brain,
      action: () => onSelectTab('memory'),
      badge: memoriesCount > 0 ? `${memoriesCount}` : 'Context',
    },
    {
      id: 'about' as ActiveTab,
      label: 'About',
      icon: Info,
      action: () => onSelectTab('about'),
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings',
      icon: Settings,
      action: () => onSelectTab('settings'),
    },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#090d16] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl shadow-indigo-950/60' : '-translate-x-full'
        }`}
      >
        {/* Top & Middle Content (scrollable if needed) */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Brand Header */}
          <div className="p-4 border-b border-slate-800/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {/* Official Icon mark */}
              <div className="w-9 h-9 rounded-xl bg-[#0b0f19] border border-indigo-500/30 p-1 flex items-center justify-center shadow-md overflow-hidden shrink-0">
                <img
                  src={nextPathIcon}
                  alt="NextPath AI Icon"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base text-white tracking-tight">
                    NextPath
                  </span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Student Career Guide
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              id="sidebar-close-btn"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action: New Chat Primary Button */}
          <div className="p-3 shrink-0">
            <button
              id="sidebar-new-chat-button"
              onClick={() => {
                onNewChat();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 transition shadow-md shadow-indigo-950/40 cursor-pointer border border-indigo-400/20 active:scale-[0.99]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Exploration</span>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 py-1 space-y-1 shrink-0">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isCurrent = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isCurrent ? 'text-indigo-400' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        isCurrent
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Recent Chats Section */}
          <div className="flex-1 min-h-0 flex flex-col px-3 py-2 mt-1 border-t border-slate-800/60 overflow-hidden">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1.5 flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3 h-3 text-indigo-400" />
                <span>Recent Chats</span>
              </span>
              {savedChats.length > 0 && (
                <button
                  id="sidebar-clear-chats-btn"
                  onClick={() => setShowClearConfirm(true)}
                  title="Clear all saved chats"
                  className="text-[10px] text-slate-400 hover:text-rose-400 transition cursor-pointer flex items-center gap-1 font-normal"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Chats List or Clean Empty State */}
            <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {savedChats.length === 0 ? (
                <div
                  id="sidebar-empty-chats"
                  className="px-3 py-4 text-center rounded-xl bg-slate-900/30 border border-slate-800/60 my-1"
                >
                  <Sparkles className="w-4 h-4 text-indigo-400/60 mx-auto mb-1.5" />
                  <p className="text-[11px] text-slate-400 font-medium leading-tight">
                    No recent chats yet
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Start a conversation to save your history locally.
                  </p>
                </div>
              ) : (
                savedChats.map((chat) => {
                  const isActive = activeChatId === chat.id && activeTab === 'chat';
                  return (
                    <div
                      key={chat.id}
                      id={`chat-item-${chat.id}`}
                      onClick={() => {
                        onSelectChat(chat.id);
                        onClose();
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition flex items-center justify-between group cursor-pointer border ${
                        isActive
                          ? 'bg-indigo-600/15 text-indigo-200 border-indigo-500/30 font-medium'
                          : 'text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-800/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1 mr-1">
                        <MessageSquare
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400'
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-medium">
                            {chat.title}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {formatChatRelativeTime(chat.updatedAt || chat.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* Delete individual chat button */}
                      <button
                        id={`delete-chat-${chat.id}`}
                        onClick={(e) => onDeleteChat(chat.id, e)}
                        title="Delete chat"
                        className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer: Student Profile / Memory pill */}
        <div className="p-3 border-t border-slate-800/80 bg-[#07090e]/60 shrink-0">
          <div 
            onClick={() => {
              onSelectTab('memory');
              onClose();
            }}
            className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate">
                Student Context
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {memoriesCount > 0
                  ? `${memoriesCount} memory ${memoriesCount === 1 ? 'item' : 'items'} saved`
                  : 'No memory stored yet'}
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </aside>

      {/* Clear All Chats Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            id="clear-chats-modal"
            className="w-full max-w-sm rounded-2xl bg-[#0b0f19] border border-slate-700/80 p-5 shadow-2xl shadow-black/80 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Clear All Chats?</h4>
                <p className="text-xs text-slate-400">
                  This will delete all saved conversation history.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
              Your saved <strong className="text-indigo-300">My Memory</strong> profile will remain intact and will not be deleted.
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearAllChats();
                  setShowClearConfirm(false);
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete All</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

