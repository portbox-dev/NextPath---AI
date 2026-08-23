import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  Sparkles, 
  Send, 
  Target, 
  GraduationCap, 
  ArrowUpRight,
  User,
  RotateCcw,
  Compass,
  Zap,
  Loader2,
  Brain,
  Check,
  CheckCircle2
} from 'lucide-react';
import { ChatMessage, QuickPrompt, ProposedMemoryFact } from '../types';
import { nextPathIcon } from '../assets/brandAssets';

interface ChatAreaProps {
  messages: ChatMessage[];
  isThinking?: boolean;
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  onConfirmSaveMemory?: (messageId: string, proposed: ProposedMemoryFact[]) => void;
  onDismissMemoryPrompt?: (messageId: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isThinking = false,
  onSendMessage,
  onClearChat,
  onConfirmSaveMemory,
  onDismissMemoryPrompt,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const placeholderText = isMobile
    ? 'Ask about your career or roadmap...'
    : 'Ask about your career, skills or roadmap...';

  const starterPrompts: QuickPrompt[] = [
    {
      id: 'p1',
      category: 'Career Path',
      title: 'Web Dev vs AI Engineering',
      prompt: 'Which career path is better for a beginner in 2026: Frontend Web Development or AI Engineering?',
      iconName: 'Compass',
    },
    {
      id: 'p2',
      category: 'Skill Roadmap',
      title: '6-Month Tech Learning Plan',
      prompt: 'Create a realistic 6-month skill roadmap for a student wanting to become a Software Developer.',
      iconName: 'Target',
    },
    {
      id: 'p3',
      category: 'Internships',
      title: 'First Tech Internship Prep',
      prompt: 'What core projects and skills do I need to land my first software engineering internship?',
      iconName: 'GraduationCap',
    },
    {
      id: 'p4',
      category: 'Industry Skills',
      title: 'High-Demand 2026 Skills',
      prompt: 'What are the top 5 high-demand technical and soft skills for university graduates in 2026?',
      iconName: 'Sparkles',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = () => {
    const trimmed = inputPrompt.trim();
    if (!trimmed || isThinking) return;
    onSendMessage(trimmed);
    setInputPrompt('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputPrompt(e.target.value);
    // Auto-resize textarea up to max-height
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handlePromptClick = (promptText: string) => {
    onSendMessage(promptText);
  };

  const getPromptIcon = (iconName: QuickPrompt['iconName']) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-4 h-4 text-blue-400" />;
      case 'Target':
        return <Target className="w-4 h-4 text-purple-400" />;
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4 text-indigo-400" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#07090e] relative overflow-hidden">
      {/* Subtle Background Atmospheric Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-blue-600/8 via-indigo-600/8 to-purple-600/8 blur-[120px] pointer-events-none" />

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col min-h-full">
          {messages.length === 0 ? (
            /* Empty Chat State */
            <div id="empty-chat-state" className="flex-1 flex flex-col items-center justify-center text-center my-auto py-6">
              
              {/* Official Icon Badge */}
              <div className="relative mb-5">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-[#090d16] border border-indigo-500/25 p-2.5 flex items-center justify-center shadow-xl shadow-indigo-950/40 overflow-hidden">
                  <img
                    src={nextPathIcon}
                    alt="NextPath AI Icon"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              </div>

              {/* Exact Headings & Taglines */}
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
                NextPath <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">AI</span>
              </h1>

              <p className="text-base sm:text-lg font-medium text-slate-200 mb-2 max-w-xl">
                Your AI guide for career and skill development.
              </p>

              <p className="text-sm text-slate-400 mb-6 max-w-lg">
                Get clear guidance about careers, skills, learning paths and your next steps.
              </p>

              {/* Student Focus Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-indigo-300 mb-7">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Tailored for students exploring careers and skills</span>
              </div>

              {/* Starter Exploration Prompts Grid */}
              <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {starterPrompts.map((p) => (
                  <button
                    key={p.id}
                    id={`starter-prompt-${p.id}`}
                    onClick={() => handlePromptClick(p.prompt)}
                    className="p-4 rounded-xl bg-[#0b101c]/80 hover:bg-[#101728] border border-slate-800/90 hover:border-indigo-500/40 transition duration-200 group flex flex-col justify-between cursor-pointer text-left shadow-sm hover:shadow-md hover:shadow-indigo-950/30"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          {p.category}
                        </span>
                        <div className="p-1 rounded-md bg-slate-800/80 group-hover:bg-indigo-500/20 transition">
                          {getPromptIcon(p.iconName)}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition mb-1">
                        {p.title}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-2">
                        {p.prompt}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-indigo-400/80 group-hover:text-indigo-300">
                      <span>Explore prompt</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Active Messages Conversation View */
            <div id="messages-container" className="space-y-5 pb-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">
                    Session Conversation ({messages.length} {messages.length === 1 ? 'message' : 'messages'})
                  </span>
                </div>
                <button
                  onClick={onClearChat}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Conversation</span>
                </button>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 sm:gap-4 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-[#090d16] border border-indigo-500/30 p-1 flex items-center justify-center shrink-0 shadow-sm overflow-hidden mt-0.5">
                      <img
                        src={nextPathIcon}
                        alt="NextPath AI"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain rounded"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-950/40 rounded-tr-none'
                        : 'bg-[#0d1322] border border-slate-800/90 text-slate-200 shadow-sm rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/10 gap-4">
                      <span className="text-[11px] font-semibold opacity-80">
                        {msg.role === 'user' ? 'You' : 'NextPath AI'}
                      </span>
                      <span className="text-[10px] opacity-60 shrink-0">
                        {msg.timestamp}
                      </span>
                    </div>
                    {msg.role === 'assistant' ? (
                      <div>
                        <div className="markdown-body space-y-2 text-sm leading-relaxed text-slate-200 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_li]:leading-relaxed [&_strong]:text-white [&_strong]:font-semibold [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:bg-slate-900 [&_code]:rounded [&_code]:text-indigo-300 [&_code]:text-xs">
                          <Markdown>{msg.content}</Markdown>
                        </div>

                        {/* Smart Memory Confirmation Box */}
                        {msg.proposedMemories && msg.proposedMemories.length > 0 && (
                          <div className="mt-3.5 pt-3 border-t border-slate-800/80">
                            {msg.memoryPromptStatus === 'pending' || !msg.memoryPromptStatus ? (
                              <div
                                id={`memory-confirmation-${msg.id}`}
                                className="p-3 sm:p-3.5 rounded-xl bg-[#080c16]/95 border border-indigo-500/30 text-xs text-slate-300 shadow-sm transition-all"
                              >
                                <div className="flex items-start gap-2.5 mb-2.5">
                                  <div className="w-5 h-5 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                                    <Brain className="w-3.5 h-3.5" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-slate-200 text-xs leading-snug">
                                      Would you like me to remember this for future conversations?
                                    </div>
                                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                                      {msg.proposedMemories.map((fact, idx) => (
                                        <span
                                          key={idx}
                                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-950/70 border border-indigo-500/20 text-[11px] text-indigo-200"
                                        >
                                          <span className="font-medium text-slate-400">{fact.category}:</span>
                                          <span className="font-semibold text-indigo-100">{fact.value}</span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                  <button
                                    id={`save-memory-btn-${msg.id}`}
                                    onClick={() => onConfirmSaveMemory?.(msg.id, msg.proposedMemories!)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition shadow-sm cursor-pointer active:scale-95"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Save to My Memory</span>
                                  </button>

                                  <button
                                    id={`dismiss-memory-btn-${msg.id}`}
                                    onClick={() => onDismissMemoryPrompt?.(msg.id)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition cursor-pointer"
                                  >
                                    Not now
                                  </button>
                                </div>
                              </div>
                            ) : msg.memoryPromptStatus === 'saved' ? (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Saved to My Memory.</span>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {/* AI Thinking / Loading Indicator */}
              {isThinking && (
                <div className="flex gap-3 sm:gap-4 justify-start animate-in fade-in duration-200">
                  <div className="w-8 h-8 rounded-xl bg-[#090d16] border border-indigo-500/30 p-1 flex items-center justify-center shrink-0 shadow-sm overflow-hidden mt-0.5">
                    <img
                      src={nextPathIcon}
                      alt="NextPath AI"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain rounded"
                    />
                  </div>

                  <div className="rounded-2xl rounded-tl-none p-3.5 bg-[#0d1322] border border-slate-800 text-slate-300 text-xs flex items-center gap-2.5 shadow-sm">
                    <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin shrink-0" />
                    <span className="font-medium text-slate-300">NextPath AI is thinking</span>
                    <div className="flex items-center gap-1 ml-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Message Input Bottom Bar */}
      <div className="border-t border-slate-800/80 bg-[#07090e]/95 backdrop-blur-md p-3.5 sm:p-4 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div
            id="chat-input-container"
            className="relative flex items-end bg-[#0b101c] border border-slate-800 focus-within:border-indigo-500/60 rounded-2xl shadow-lg shadow-black/40 transition duration-200 p-2 sm:p-2.5 gap-2"
          >
            {/* Input icon */}
            <div className="pl-2 pb-2.5 flex items-center shrink-0">
              <div className="w-6 h-6 rounded-lg bg-[#090d16] border border-indigo-500/20 p-0.5 overflow-hidden flex items-center justify-center">
                <img
                  src={nextPathIcon}
                  alt="NextPath"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded"
                />
              </div>
            </div>

            {/* Input Textarea for multiline & Enter support */}
            <textarea
              ref={textareaRef}
              id="message-input-field"
              rows={1}
              value={inputPrompt}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={placeholderText}
              className="w-full py-2 bg-transparent text-sm text-slate-100 placeholder:text-xs sm:placeholder:text-sm placeholder-slate-400 focus:outline-none resize-none max-h-32 min-h-[38px] leading-relaxed"
            />

            {/* Send Action */}
            <div className="pb-1 pr-1 flex items-center shrink-0">
              <button
                id="message-send-btn"
                onClick={handleSend}
                disabled={!inputPrompt.trim() || isThinking}
                aria-label="Send message"
                className={`p-2.5 rounded-xl transition flex items-center justify-center cursor-pointer ${
                  inputPrompt.trim() && !isThinking
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/30 active:scale-95'
                    : 'bg-slate-800/50 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Footer Metadata & Creator Credit */}
          <div className="mt-2 flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] px-1.5 sm:px-2 gap-2">
            <div className="flex items-center gap-1.5 text-slate-400/70">
              <span>NextPath AI • Career & skill guide</span>
              <span className="hidden sm:inline opacity-40">•</span>
              <span className="hidden sm:inline opacity-70">Press Enter to send, Shift+Enter for new line</span>
            </div>
            {/* Creator Credit */}
            <div 
              id="creator-credit" 
              className="text-[10px] sm:text-[11px] text-slate-400/40 font-normal tracking-normal select-none"
            >
              Created by Portbox
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
