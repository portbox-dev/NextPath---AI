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
  freshChatTrigger?: number;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isThinking = false,
  onSendMessage,
  onClearChat,
  onConfirmSaveMemory,
  onDismissMemoryPrompt,
  freshChatTrigger = 0,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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

  const scrollToTop = (behavior: ScrollBehavior = 'auto') => {
    // 1. Immediate synchronous reset
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    // 2. Browser paint cycle reset
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: 0,
          behavior,
        });
      }
      // 3. Post-render layout settling safety check
      setTimeout(() => {
        if (scrollContainerRef.current && messages.length === 0) {
          scrollContainerRef.current.scrollTop = 0;
        }
      }, 50);
    });
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior,
        });
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior });
      }
    });
  };

  // Scroll position controller:
  // - On fresh/empty chat (messages.length === 0 or freshChatTrigger): always ensure viewport starts at top (scrollTop = 0).
  // - On active conversations with messages: auto-scroll to latest message at the bottom.
  useEffect(() => {
    if (messages.length === 0) {
      scrollToTop('auto');
    } else {
      scrollToBottom('smooth');
    }
  }, [messages, isThinking, freshChatTrigger]);

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
    <div className="flex-1 flex flex-col h-full bg-[#07090e] relative overflow-hidden min-w-0 min-h-0 w-full">
      {/* Subtle Background Atmospheric Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-blue-600/8 via-indigo-600/8 to-purple-600/8 blur-[120px] pointer-events-none" />

      {/* Main Scrollable Area */}
      <div
        ref={scrollContainerRef}
        id="chat-messages-scroll-area"
        className="flex-1 overflow-y-auto overflow-x-hidden px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10 min-w-0 min-h-0 w-full overscroll-y-contain [overflow-anchor:none]"
      >
        <div className="max-w-4xl mx-auto flex flex-col min-h-full min-w-0 w-full">
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

              {/* Exact Semantic Primary Heading & Taglines */}
              <div className="mb-6 max-w-xl">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                  NextPath <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">AI</span>
                </h1>
                <p className="text-base sm:text-lg font-semibold text-slate-200 mb-1">
                  Free AI Career Roadmap for Students
                </p>
                <p className="text-sm font-medium text-indigo-300/90 mb-2">
                  Your AI guide for career and skill development.
                </p>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Get clear guidance about careers, skills, learning paths and your next steps in software engineering and technology.
                </p>
              </div>

              {/* Student Focus Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-indigo-300 mb-7 shadow-sm">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Tailored for students exploring careers, coding skills, and roadmaps</span>
              </div>

              {/* Starter Exploration Prompts Grid */}
              <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-6">
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
            <div id="messages-container" className="space-y-5 pb-4 min-w-0 w-full">
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
                  className={`flex gap-3 sm:gap-4 min-w-0 w-full ${
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
                    className={`max-w-[85%] sm:max-w-xl min-w-0 rounded-2xl p-4 text-sm leading-relaxed [overflow-wrap:anywhere] [word-break:break-word] ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-950/40 rounded-tr-none'
                        : 'bg-[#0d1322] border border-slate-800/90 text-slate-200 shadow-sm rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/10 gap-4 min-w-0">
                      <span className="text-[11px] font-semibold opacity-80 truncate">
                        {msg.role === 'user' ? 'You' : 'NextPath AI'}
                      </span>
                      <span className="text-[10px] opacity-60 shrink-0">
                        {msg.timestamp}
                      </span>
                    </div>
                    {msg.role === 'assistant' ? (
                      <div className="min-w-0 w-full">
                        <div className="markdown-body space-y-2 text-sm leading-relaxed text-slate-200 min-w-0 w-full [overflow-wrap:anywhere] [word-break:break-word] [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_li]:leading-relaxed [&_li]:[overflow-wrap:anywhere] [&_strong]:text-white [&_strong]:font-semibold">
                          <Markdown
                            components={{
                              pre: ({ children, ...props }) => (
                                <div className="my-2.5 max-w-full overflow-hidden rounded-xl border border-slate-800/80 bg-[#060911]">
                                  <pre
                                    className="overflow-x-auto p-3 text-xs font-mono text-slate-200 max-w-full scrollbar-thin"
                                    {...props}
                                  >
                                    {children}
                                  </pre>
                                </div>
                              ),
                              code: ({ node, className, children, ...props }) => {
                                const isMultiLine = String(children).includes('\n');
                                const isBlock = Boolean(className?.includes('language-')) || isMultiLine;
                                if (!isBlock) {
                                  return (
                                    <code
                                      className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800/80 text-indigo-300 font-mono text-xs [overflow-wrap:anywhere] [word-break:break-word]"
                                      {...props}
                                    >
                                      {children}
                                    </code>
                                  );
                                }
                                return (
                                  <code className="font-mono text-xs text-indigo-200 block" {...props}>
                                    {children}
                                  </code>
                                );
                              },
                              p: ({ children, ...props }) => (
                                <p className="mb-2 last:mb-0 [overflow-wrap:anywhere] [word-break:break-word] leading-relaxed" {...props}>
                                  {children}
                                </p>
                              ),
                              ul: ({ children, ...props }) => (
                                <ul className="list-disc pl-5 space-y-1 mb-2 [overflow-wrap:anywhere] [word-break:break-word]" {...props}>
                                  {children}
                                </ul>
                              ),
                              ol: ({ children, ...props }) => (
                                <ol className="list-decimal pl-5 space-y-1 mb-2 [overflow-wrap:anywhere] [word-break:break-word]" {...props}>
                                  {children}
                                </ol>
                              ),
                              li: ({ children, ...props }) => (
                                <li className="leading-relaxed [overflow-wrap:anywhere] [word-break:break-word]" {...props}>
                                  {children}
                                </li>
                              ),
                              table: ({ children, ...props }) => (
                                <div className="my-2.5 max-w-full overflow-x-auto rounded-lg border border-slate-800">
                                  <table className="min-w-full divide-y divide-slate-800 text-left text-xs" {...props}>
                                    {children}
                                  </table>
                                </div>
                              ),
                              a: ({ href, children, ...props }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 [overflow-wrap:anywhere] [word-break:break-word]"
                                  {...props}
                                >
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {msg.content}
                          </Markdown>
                        </div>

                        {/* Smart Memory Confirmation Box */}
                        {msg.proposedMemories && msg.proposedMemories.length > 0 && (
                          <div className="mt-3.5 pt-3 border-t border-slate-800/80 min-w-0">
                            {msg.memoryPromptStatus === 'pending' || !msg.memoryPromptStatus ? (
                              <div
                                id={`memory-confirmation-${msg.id}`}
                                className="p-3 sm:p-3.5 rounded-xl bg-[#080c16]/95 border border-indigo-500/30 text-xs text-slate-300 shadow-sm transition-all min-w-0"
                              >
                                <div className="flex items-start gap-2.5 mb-2.5 min-w-0">
                                  <div className="w-5 h-5 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                                    <Brain className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-semibold text-slate-200 text-xs leading-snug">
                                      Would you like me to remember this for future conversations?
                                    </div>
                                    <div className="mt-1.5 flex flex-wrap gap-1.5 min-w-0">
                                      {msg.proposedMemories.map((fact, idx) => (
                                        <span
                                          key={idx}
                                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-950/70 border border-indigo-500/20 text-[11px] text-indigo-200 max-w-full"
                                        >
                                          <span className="font-medium text-slate-400 shrink-0">{fact.category}:</span>
                                          <span className="font-semibold text-indigo-100 truncate">{fact.value}</span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 pt-1">
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
                      <div className="whitespace-pre-wrap [overflow-wrap:anywhere] [word-break:break-word] min-w-0">
                        {msg.content}
                      </div>
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
                <div className="flex gap-3 sm:gap-4 justify-start animate-in fade-in duration-200 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#090d16] border border-indigo-500/30 p-1 flex items-center justify-center shrink-0 shadow-sm overflow-hidden mt-0.5">
                    <img
                      src={nextPathIcon}
                      alt="NextPath AI"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain rounded"
                    />
                  </div>

                  <div className="rounded-2xl rounded-tl-none p-3.5 bg-[#0d1322] border border-slate-800 text-slate-300 text-xs flex items-center gap-2.5 shadow-sm min-w-0">
                    <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin shrink-0" />
                    <span className="font-medium text-slate-300 truncate">NextPath AI is thinking</span>
                    <div className="flex items-center gap-1 ml-0.5 shrink-0">
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
      <div className="shrink-0 border-t border-slate-800/80 bg-[#07090e]/95 backdrop-blur-md p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] relative z-20 min-w-0 w-full">
        <div className="max-w-4xl mx-auto min-w-0 w-full">
          <div
            id="chat-input-container"
            className="relative flex items-end bg-[#0b101c] border border-slate-800 focus-within:border-indigo-500/60 rounded-2xl shadow-lg shadow-black/40 transition duration-200 p-2 sm:p-2.5 gap-2 min-w-0"
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
              className="w-full py-2 bg-transparent text-sm text-slate-100 placeholder:text-xs sm:placeholder:text-sm placeholder-slate-400 focus:outline-none resize-none max-h-32 min-h-[38px] leading-relaxed min-w-0"
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
