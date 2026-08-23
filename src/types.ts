export type ActiveTab = 'chat' | 'roadmap' | 'memory' | 'about' | 'settings';

export interface ProposedMemoryFact {
  category: MemoryItem['category'];
  label: string;
  value: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  proposedMemories?: ProposedMemoryFact[];
  memoryPromptStatus?: 'pending' | 'saved' | 'dismissed';
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface QuickPrompt {
  id: string;
  title: string;
  category: string;
  prompt: string;
  iconName: 'Compass' | 'Sparkles' | 'Briefcase' | 'Code' | 'GraduationCap' | 'Target';
}

export type MilestoneStatus = 'Completed' | 'In Progress' | 'Not Started' | 'Locked';

export interface StageProjectIdeas {
  beginner: string;
  intermediate: string;
  advanced?: string;
}

export interface StageGuidance {
  whyItMatters: string;
  learningOrder: string[];
  subtopics: string[];
  practiceIdeas: string[];
  projects: StageProjectIdeas;
  commonMistakes: string[];
  suggestedNextAction: string;
}

export interface RoadmapMilestone {
  id: string;
  number: number;
  title: string;
  description: string;
  skills: string[];
  status: MilestoneStatus;
  estimatedTime?: string;
  guidance?: StageGuidance;
}

export interface RoadmapStep {
  id: string;
  title: string;
  period: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  description: string;
  skills: string[];
}

export interface MemoryItem {
  id: string;
  category: 'Personal' | 'Education' | 'Skills' | 'Interests' | 'Goals' | 'Preferences' | 'Notes';
  label: string;
  value: string;
  updatedAt: string;
}

export interface StudentMemoryProfile {
  name: string;
  education: string;
  yearOrLevel: string;
  skills: string[];
  interests: string[];
  careerGoal: string;
  preferredField: string;
  learningPreferences: string;
  additionalNotes: string[];
}

export interface StudentMemoryItem {
  id: string;
  category: 'Target Roles' | 'Current Skills' | 'Interests' | 'Education';
  value: string;
  updatedAt: string;
}
