import { ChatSession } from '../types';

export const CHATS_STORAGE_KEY = 'nextpath_chats';

/**
 * Loads all saved chat sessions from browser localStorage.
 */
export function loadSavedChats(): ChatSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CHATS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Error loading NextPath saved chats from localStorage:', err);
    return [];
  }
}

/**
 * Saves all chat sessions to browser localStorage.
 */
export function saveStoredChats(chats: ChatSession[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
  } catch (err) {
    console.error('Error saving NextPath chats to localStorage:', err);
  }
}

/**
 * Generates a clean, concise, student-friendly chat title from the first message.
 */
export function generateChatTitle(firstMessage: string): string {
  if (!firstMessage || typeof firstMessage !== 'string') return 'New Conversation';
  
  // Clean special characters and multi-line breaks
  const cleaned = firstMessage
    .replace(/^["']|["']$/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return 'New Conversation';

  // If message starts with "Remember that...", create a memory note title
  if (cleaned.toLowerCase().startsWith('remember ')) {
    return 'Saved Note: ' + cleaned.slice(9, 35) + (cleaned.length > 35 ? '...' : '');
  }

  // Truncate to reasonable length (max 38 chars)
  if (cleaned.length <= 38) {
    return cleaned;
  }

  // Find word break near 36 chars
  const truncated = cleaned.slice(0, 36);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > 18) {
    return truncated.slice(0, lastSpace) + '...';
  }
  return truncated + '...';
}

/**
 * Formats a timestamp / ISO string into a brief relative date label.
 */
export function formatChatRelativeTime(dateString: string): string {
  if (!dateString) return 'Recent';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recent';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return 'Recent';
  }
}

/**
 * Clears all chat history from browser localStorage.
 */
export function clearAllStoredChats(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CHATS_STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing NextPath chats from localStorage:', err);
  }
}
