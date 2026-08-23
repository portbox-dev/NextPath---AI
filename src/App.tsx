import React, { useState, useRef, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { RoadmapView } from './components/RoadmapView';
import { MemoryView } from './components/MemoryView';
import { AboutView } from './components/AboutView';
import { SettingsView } from './components/SettingsView';
import { ActiveTab, ChatMessage, ChatSession, MemoryItem, ProposedMemoryFact } from './types';
import { 
  loadMemory, 
  saveMemory, 
  clearAllMemory, 
  detectMemoryCommand, 
  extractImplicitCareerFacts,
  DEFAULT_MEMORY_ITEMS 
} from './utils/memoryStorage';
import {
  loadSavedChats,
  saveStoredChats,
  generateChatTitle,
  clearAllStoredChats,
} from './utils/chatStorage';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  
  // Persistent Chat Sessions
  const [savedChats, setSavedChats] = useState<ChatSession[]>(() => loadSavedChats());
  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    const initialChats = loadSavedChats();
    return initialChats.length > 0 ? initialChats[0].id : null;
  });
  
  // Active conversation messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const initialChats = loadSavedChats();
    return initialChats.length > 0 ? initialChats[0].messages : [];
  });

  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [memories, setMemories] = useState<MemoryItem[]>(() => loadMemory());
  const thinkingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync memory changes to localStorage
  useEffect(() => {
    saveMemory(memories);
  }, [memories]);

  // Sync chat sessions to localStorage
  useEffect(() => {
    saveStoredChats(savedChats);
  }, [savedChats]);

  const handleAddMemory = (item: Omit<MemoryItem, 'id' | 'updatedAt'>) => {
    const newItem: MemoryItem = {
      ...item,
      id: `mem-${Date.now()}`,
      updatedAt: 'Recently added',
    };
    setMemories((prev) => [newItem, ...prev]);
  };

  const handleUpdateMemory = (id: string, updated: Partial<MemoryItem>) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updated, updatedAt: 'Updated just now' } : m))
    );
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const handleClearAllMemory = () => {
    clearAllMemory();
    setMemories([]);
  };

  // Smart Memory Confirmation: Save recognized personal facts upon explicit user click
  const handleConfirmSaveMemory = (messageId: string, proposed: ProposedMemoryFact[]) => {
    if (!proposed || proposed.length === 0) return;

    const newItems: MemoryItem[] = proposed.map((fact, idx) => ({
      id: `mem-${Date.now()}-${idx}`,
      category: fact.category,
      label: fact.label,
      value: fact.value,
      updatedAt: 'Saved via Chat Confirmation',
    }));

    setMemories((prevMemories) => {
      // Deduplicate new items against existing items
      const nonDuplicateNewItems = newItems.filter(
        (newItem) =>
          !prevMemories.some(
            (existing) =>
              existing.category === newItem.category &&
              existing.value.toLowerCase().trim() === newItem.value.toLowerCase().trim()
          )
      );
      const updated = [...nonDuplicateNewItems, ...prevMemories];
      saveMemory(updated);
      return updated;
    });

    // Update message state in UI and persisted chat sessions
    const updateMessagesState = (msgList: ChatMessage[]) =>
      msgList.map((m) =>
        m.id === messageId ? { ...m, memoryPromptStatus: 'saved' as const } : m
      );

    setMessages((prev) => updateMessagesState(prev));
    if (activeChatId) {
      setSavedChats((chats) =>
        chats.map((c) =>
          c.id === activeChatId
            ? {
                ...c,
                updatedAt: new Date().toISOString(),
                messages: updateMessagesState(c.messages),
              }
            : c
        )
      );
    }
  };

  // Smart Memory Confirmation: User selected "Not now"
  const handleDismissMemoryPrompt = (messageId: string) => {
    const updateMessagesState = (msgList: ChatMessage[]) =>
      msgList.map((m) =>
        m.id === messageId ? { ...m, memoryPromptStatus: 'dismissed' as const } : m
      );

    setMessages((prev) => updateMessagesState(prev));
    if (activeChatId) {
      setSavedChats((chats) =>
        chats.map((c) =>
          c.id === activeChatId
            ? {
                ...c,
                updatedAt: new Date().toISOString(),
                messages: updateMessagesState(c.messages),
              }
            : c
        )
      );
    }
  };

  // Chat selection and management
  const handleSelectChat = (chatId: string) => {
    if (thinkingTimeoutRef.current) {
      clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }
    setIsThinking(false);
    isSendingRef.current = false;

    const targetChat = savedChats.find((c) => c.id === chatId);
    if (targetChat) {
      setActiveChatId(targetChat.id);
      setMessages(targetChat.messages);
    } else {
      setActiveChatId(null);
      setMessages([]);
    }
    setActiveTab('chat');
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedChats = savedChats.filter((c) => c.id !== chatId);
    setSavedChats(updatedChats);

    // If the active chat is deleted, switch to the next available chat or empty
    if (activeChatId === chatId) {
      if (updatedChats.length > 0) {
        setActiveChatId(updatedChats[0].id);
        setMessages(updatedChats[0].messages);
      } else {
        setActiveChatId(null);
        setMessages([]);
      }
    }
  };

  const handleClearAllChats = () => {
    clearAllStoredChats();
    setSavedChats([]);
    setActiveChatId(null);
    setMessages([]);
  };

  const isSendingRef = useRef<boolean>(false);

  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Request lock: prevent duplicate overlapping requests while processing
    if (isSendingRef.current || isThinking) {
      return;
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: trimmed,
      timestamp,
    };

    // Determine target chat session
    let currentChatId = activeChatId;
    const existingChat = currentChatId ? savedChats.find((c) => c.id === currentChatId) : null;

    let updatedHistoryForAPI: ChatMessage[] = [];

    if (!existingChat || !currentChatId) {
      // 1. Create a brand new chat session
      const newChatId = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newTitle = generateChatTitle(trimmed);
      const newChatSession: ChatSession = {
        id: newChatId,
        title: newTitle,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [userMsg],
      };

      currentChatId = newChatId;
      setActiveChatId(newChatId);
      setMessages([userMsg]);
      setSavedChats((prev) => [newChatSession, ...prev]);
      updatedHistoryForAPI = []; // First turn, no prior history in this new chat
    } else {
      // 2. Append to existing active chat session
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setSavedChats((prev) =>
        prev.map((c) =>
          c.id === currentChatId
            ? {
                ...c,
                updatedAt: new Date().toISOString(),
                messages: newMessages,
              }
            : c
        )
      );
      updatedHistoryForAPI = messages; // Pass only current chat's previous messages
    }

    setIsThinking(true);
    isSendingRef.current = true;

    // 3. Check if the message is a local memory save command (e.g. "Remember that I know C++")
    const memoryCommand = detectMemoryCommand(trimmed);
    if (memoryCommand.isCommand && memoryCommand.item) {
      const recognizedItem = memoryCommand.item;
      const updatedMemories = [recognizedItem, ...memories];
      setMemories(updatedMemories);

      // Respond directly with confirmation
      setTimeout(() => {
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-a`,
          role: 'assistant',
          content: memoryCommand.confirmationMessage || "I've updated your memory profile.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => {
          const combined = [...prev, assistantMsg];
          // Update chat session
          if (currentChatId) {
            setSavedChats((chats) =>
              chats.map((c) =>
                c.id === currentChatId
                  ? { ...c, updatedAt: new Date().toISOString(), messages: combined }
                  : c
              )
            );
          }
          return combined;
        });

        setIsThinking(false);
        isSendingRef.current = false;
      }, 400);
      return;
    }

    // 4. Send request to secure server-side Gemini endpoint
    // strictly isolated to current chat's history and explicit memories
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          history: updatedHistoryForAPI, // ONLY the messages belonging to this current chat
          memory: memories, // ONLY the explicitly stored My Memory items
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');

      if (!response.ok) {
        let errorText =
          response.status === 503 || response.status === 429
            ? 'NextPath AI is temporarily unavailable. Please try again in a moment.'
            : "Sorry, I couldn't connect to NextPath AI right now. Please try again in a moment.";

        if (isJson) {
          try {
            const errorData = await response.json();
            if (errorData && typeof errorData.error === 'string' && errorData.error.trim()) {
              errorText = errorData.error;
            }
          } catch {
            // Ignore JSON parsing failure on error responses
          }
        }

        const errorMsg: ChatMessage = {
          id: `msg-${Date.now()}-err`,
          role: 'assistant',
          content: errorText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => {
          const combined = [...prev, errorMsg];
          if (currentChatId) {
            setSavedChats((chats) =>
              chats.map((c) =>
                c.id === currentChatId
                  ? { ...c, updatedAt: new Date().toISOString(), messages: combined }
                  : c
              )
            );
          }
          return combined;
        });
        return;
      }

      if (!isJson) {
        const errorMsg: ChatMessage = {
          id: `msg-${Date.now()}-err`,
          role: 'assistant',
          content: 'NextPath AI is temporarily unavailable. Please try again in a moment.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => {
          const combined = [...prev, errorMsg];
          if (currentChatId) {
            setSavedChats((chats) =>
              chats.map((c) =>
                c.id === currentChatId
                  ? { ...c, updatedAt: new Date().toISOString(), messages: combined }
                  : c
              )
            );
          }
          return combined;
        });
        return;
      }

      const data = await response.json();
      const replyContent =
        data && typeof data.reply === 'string' && data.reply.trim()
          ? data.reply
          : "I'm ready to guide your career path. Could you share more details about your goals or current skills?";

      // Detect if the user shared personal career information during conversation
      const implicitFacts = extractImplicitCareerFacts(trimmed, memories);

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...(implicitFacts.length > 0
          ? {
              proposedMemories: implicitFacts,
              memoryPromptStatus: 'pending' as const,
            }
          : {}),
      };

      setMessages((prev) => {
        const combined = [...prev, assistantMsg];
        if (currentChatId) {
          setSavedChats((chats) =>
            chats.map((c) =>
              c.id === currentChatId
                ? { ...c, updatedAt: new Date().toISOString(), messages: combined }
                : c
            )
          );
        }
        return combined;
      });
    } catch (err) {
      console.error('Error connecting to NextPath AI Gemini backend:', err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: 'assistant',
        content: 'NextPath AI is temporarily unavailable. Please try again in a moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => {
        const combined = [...prev, errorMsg];
        if (currentChatId) {
          setSavedChats((chats) =>
            chats.map((c) =>
              c.id === currentChatId
                ? { ...c, updatedAt: new Date().toISOString(), messages: combined }
                : c
            )
          );
        }
        return combined;
      });
    } finally {
      setIsThinking(false);
      isSendingRef.current = false;
    }
  };

  const handleNewChat = () => {
    if (thinkingTimeoutRef.current) {
      clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }
    setIsThinking(false);
    isSendingRef.current = false;
    setActiveChatId(null);
    setMessages([]);
    setActiveTab('chat');
  };

  const handleClearChat = () => {
    if (thinkingTimeoutRef.current) {
      clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }
    setIsThinking(false);
    isSendingRef.current = false;
    setMessages([]);

    if (activeChatId) {
      setSavedChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? { ...c, updatedAt: new Date().toISOString(), messages: [] }
            : c
        )
      );
    }
  };

  const handleStartChatWithTopic = (topic: string) => {
    handleNewChat();
    setTimeout(() => {
      handleSendMessage(topic);
    }, 50);
  };

  return (
    <div id="nextpath-app-root" className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen onDismiss={() => setShowSplash(false)} />
      )}

      {/* Main App Container */}
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          onNewChat={handleNewChat}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          savedChats={savedChats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onClearAllChats={handleClearAllChats}
          memoriesCount={memories.length}
        />

        {/* Main Application Area */}
        <div className="flex-1 flex flex-col h-full min-w-0 bg-[#07090e]">
          {/* Header */}
          <Header
            activeTab={activeTab}
            onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
            onNewChat={handleNewChat}
            onShowSplash={() => setShowSplash(true)}
          />

          {/* Active View Container */}
          <main id="app-main-viewport" className="flex-1 flex flex-col overflow-hidden relative">
            {activeTab === 'chat' && (
              <ChatArea
                messages={messages}
                isThinking={isThinking}
                onSendMessage={handleSendMessage}
                onClearChat={handleClearChat}
                onConfirmSaveMemory={handleConfirmSaveMemory}
                onDismissMemoryPrompt={handleDismissMemoryPrompt}
              />
            )}

            {activeTab === 'roadmap' && (
              <RoadmapView
                memories={memories}
                onStartChatWithTopic={handleStartChatWithTopic}
              />
            )}

            {activeTab === 'memory' && (
              <MemoryView
                memories={memories}
                onAddMemory={handleAddMemory}
                onUpdateMemory={handleUpdateMemory}
                onDeleteMemory={handleDeleteMemory}
                onClearAllMemory={handleClearAllMemory}
              />
            )}

            {activeTab === 'about' && (
              <AboutView onGoToChat={() => setActiveTab('chat')} />
            )}

            {activeTab === 'settings' && (
              <SettingsView />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

