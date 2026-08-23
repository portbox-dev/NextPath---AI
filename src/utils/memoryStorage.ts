import { MemoryItem, ProposedMemoryFact } from '../types';

export const STORAGE_KEY = 'nextpath_memory';

export const DEFAULT_MEMORY_ITEMS: MemoryItem[] = [];

/**
 * List of known sample/fabricated strings to purge from legacy browser storage.
 */
const KNOWN_FABRICATED_VALUES = [
  'alex chen',
  'alex',
  'b.s. in computer science',
  'computer science & engineering',
  '2nd year undergraduate',
  'sophomore',
  'javascript, typescript, react',
  'python fundamentals',
  'summer 2026 software engineer internship',
  'full-stack & frontend development',
  'available 15 hours per week',
  'sample template',
];

const KNOWN_FABRICATED_IDS = [
  'mem-name',
  'mem-edu',
  'mem-year',
  'mem-skills',
  'mem-interests',
  'mem-goal',
  'mem-field',
  'mem-pref',
  'mem-notes',
  'sample-edu',
  'sample-skills',
  'sample-goal',
];

/**
 * Checks if a stored item is one of the legacy fabricated/sample records.
 */
function isFabricatedSampleItem(item: any): boolean {
  if (!item || typeof item !== 'object') return true;
  if (!item.value || !item.label) return true;

  const id = String(item.id || '').toLowerCase();
  if (KNOWN_FABRICATED_IDS.some((sampleId) => id === sampleId || id.startsWith('sample-'))) {
    return true;
  }

  const val = String(item.value).toLowerCase();
  const label = String(item.label).toLowerCase();

  return KNOWN_FABRICATED_VALUES.some(
    (sample) => val.includes(sample) || label.includes(sample)
  );
}

/**
 * Loads the memory profile from browser localStorage.
 * Initializes to empty array for real students.
 * Automatically cleans up any previously seeded fabricated/sample records.
 */
export function loadMemory(): MemoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null || raw === '' || raw === '[]') {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Clean out any legacy mock/fabricated sample items
      const cleaned = parsed.filter((item: any) => !isFabricatedSampleItem(item));
      
      // If we filtered out any legacy sample records, update localStorage immediately
      if (cleaned.length !== parsed.length) {
        saveMemory(cleaned);
      }
      return cleaned;
    }
    return [];
  } catch (err) {
    console.error('Error loading NextPath memory from localStorage:', err);
    return [];
  }
}

/**
 * Saves memory items to browser localStorage synchronously.
 */
export function saveMemory(items: MemoryItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving NextPath memory to localStorage:', err);
  }
}

/**
 * Clears all memory from browser localStorage.
 */
export function clearAllMemory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.error('Error clearing NextPath memory from localStorage:', err);
  }
}

/**
 * Format helper for capital words & known technical acronyms
 */
export function cleanAndCapitalize(text: string): string {
  const trimmed = text.trim().replace(/^[,;\.\s\-:]+|[,;\.\s\-:]+$/g, '');
  if (!trimmed) return '';
  
  return trimmed
    .split(' ')
    .map((word) => {
      const lower = word.toLowerCase();
      // Tech acronyms & special cases
      if (['bca', 'mca', 'btech', 'b.tech', 'bsc', 'b.sc', 'cse', 'it', 'cs', 'html', 'css', 'sql', 'dsa', 'api', 'apis', 'ai', 'ml', 'ui', 'ux', 'oop'].includes(lower)) {
        return word.toUpperCase();
      }
      if (lower === 'c++') return 'C++';
      if (lower === 'c#') return 'C#';
      if (lower === 'javascript' || lower === 'js') return 'JavaScript';
      if (lower === 'typescript' || lower === 'ts') return 'TypeScript';
      if (lower === 'nodejs' || lower === 'node.js') return 'Node.js';
      if (lower === 'react' || lower === 'reactjs' || lower === 'react.js') return 'React';
      if (lower === 'nextjs' || lower === 'next.js') return 'Next.js';
      if (lower === 'vue' || lower === 'vuejs') return 'Vue';
      if (lower === 'postgresql' || lower === 'postgres') return 'PostgreSQL';
      if (lower === 'mysql') return 'MySQL';
      if (lower === 'mongodb' || lower === 'mongo') return 'MongoDB';
      if (lower === 'github') return 'GitHub';
      if (lower === 'git') return 'Git';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Recognizes when a user clearly provides important personal career information
 * during normal conversation (e.g. "I am a BCA student and I know C and C++. I want to become a software developer.")
 * Returns extracted facts for confirmation without automatically saving them.
 */
export function extractImplicitCareerFacts(
  userInput: string,
  existingMemories: MemoryItem[] = []
): ProposedMemoryFact[] {
  const trimmed = userInput.trim();
  if (!trimmed) return [];
  const lower = trimmed.toLowerCase();

  // Skip explicit command messages ("Remember that...", "Save that...") which are handled directly
  const explicitKeywords = [
    'remember that',
    'remember i',
    'remember my',
    'remember ',
    'save that',
    'save this',
    'save to memory',
  ];
  if (explicitKeywords.some((kw) => lower.startsWith(kw))) {
    return [];
  }

  // Skip pure questions with no personal declarative statement
  if (
    trimmed.endsWith('?') &&
    !lower.includes('i am') &&
    !lower.includes("i'm") &&
    !lower.includes('i know') &&
    !lower.includes('i already know') &&
    !lower.includes('i want to') &&
    !lower.includes('my goal')
  ) {
    return [];
  }

  const proposed: ProposedMemoryFact[] = [];

  // Helper to check if value already exists in saved memory
  const isAlreadyKnown = (cat: MemoryItem['category'], val: string) => {
    const norm = val.toLowerCase().trim();
    return existingMemories.some(
      (m) => m.category === cat && m.value.toLowerCase().trim() === norm
    );
  };

  // 1. Education / Degree Extraction
  // Matches: "I am a BCA student", "I'm in BCA", "I study BCA", "I am a 2nd year CS student", "studying B.Tech CSE"
  const eduPatterns = [
    /(?:i am|i'm)\s+(?:a|an)?\s*([a-z0-9\.\s\+\#\-]+?\s+student)\b/i,
    /(?:i am|i'm)\s+(?:studying|pursuing|enrolled in|doing)\s+([a-z0-9\.\s\+\#\-]+?)(?=[,\.\!]|\s+and\b|\s+i\b|$)/i,
    /(?:i am|i'm)\s+(?:in\s+)?(1st|2nd|3rd|4th|first|second|third|fourth|final)\s+year\s+([a-z0-9\.\s\+\#\-]+?)(?=[,\.\!]|\s+and\b|\s+i\b|$)/i,
    /(?:i am|i'm)\s+(?:in\s+)?([a-z0-9\.\s\+\#\-]+?)\s+(?:branch|course|department|degree)/i,
  ];

  for (const pattern of eduPatterns) {
    const match = trimmed.match(pattern);
    if (match) {
      let rawVal = '';
      if (match[2]) {
        rawVal = `${match[1]} Year ${match[2]}`.trim();
      } else if (match[1]) {
        rawVal = match[1].trim();
      }

      if (
        rawVal.length > 2 &&
        rawVal.length < 50 &&
        !rawVal.toLowerCase().includes('good') &&
        !rawVal.toLowerCase().includes('bad')
      ) {
        // Expand BCA -> Bachelor of Computer Applications (BCA) or formatted
        let formatted = cleanAndCapitalize(rawVal);
        if (formatted.toLowerCase() === 'bca') {
          formatted = 'Bachelor of Computer Applications (BCA)';
        }
        if (!isAlreadyKnown('Education', formatted) && !proposed.some((p) => p.category === 'Education')) {
          proposed.push({
            category: 'Education',
            label: 'Current Degree / Education',
            value: formatted,
          });
        }
        break;
      }
    }
  }

  // 2. Technical Skills & Languages Extraction
  // Matches: "I know C and C++", "I already know HTML", "I have learned Python and SQL", "proficient in React"
  const skillPatterns = [
    /(?:i know|i already know|i've learned|i have learned|i learned|i have skills in|proficient in|experience with|working with)\s+([a-z0-9\.\s\+\#\,\/\-]+?)(?=[,\.\!]|\s+and i\b|\s+i want\b|\s+i'm\b|\s+my goal\b|\s+i am\b|$)/i,
    /(?:my skills are|my technical skills include)\s+([a-z0-9\.\s\+\#\,\/\-]+?)(?=[,\.\!]|\s+and i\b|\s+i want\b|$)/i,
  ];

  for (const pattern of skillPatterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      let rawSkills = match[1].trim();
      rawSkills = rawSkills.replace(/\s+and\s+/gi, ', ');
      
      const skillTokens = rawSkills
        .split(/[,;\/]+/)
        .map((s) => s.trim())
        .filter(
          (s) =>
            s.length > 0 &&
            !['some', 'basics', 'basics of', 'a bit of', 'the', 'well', 'good at', 'also'].includes(
              s.toLowerCase()
            )
        );

      if (skillTokens.length > 0) {
        const formattedSkills = skillTokens.map((s) => cleanAndCapitalize(s)).join(', ');
        if (
          formattedSkills.length >= 1 &&
          !isAlreadyKnown('Skills', formattedSkills) &&
          !proposed.some((p) => p.category === 'Skills')
        ) {
          proposed.push({
            category: 'Skills',
            label: 'Known Languages & Skills',
            value: formattedSkills,
          });
        }
      }
      break;
    }
  }

  // 3. Career Goals & Target Role Extraction
  // Matches: "I want to become a software developer", "My goal is to be a frontend developer", "aspiring software engineer"
  const goalPatterns = [
    /(?:i want to become|i want to be|aiming to become|aiming to be|my goal is to become|my goal is to be|my target is to become|my target is to be|aspiring to be|aspiring|want to work as)\s+(?:a|an)?\s*([a-z0-9\s\/\-]+?)(?=[,\.\!]|\s+and\b|\s+i\b|$)/i,
    /(?:want to get|aiming for|target is)\s+(?:a|an)?\s*([a-z0-9\s\/\-]+?\s+(?:internship|job|role|position))\b/i,
  ];

  for (const pattern of goalPatterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      const rawGoal = match[1].trim();
      if (
        rawGoal.length > 2 &&
        rawGoal.length < 60 &&
        !rawGoal.toLowerCase().includes('better') &&
        !rawGoal.toLowerCase().includes('good')
      ) {
        const formatted = cleanAndCapitalize(rawGoal);
        if (!isAlreadyKnown('Goals', formatted) && !proposed.some((p) => p.category === 'Goals')) {
          proposed.push({
            category: 'Goals',
            label: 'Target Career Goal',
            value: formatted,
          });
        }
        break;
      }
    }
  }

  // 4. Interests Extraction
  // Matches: "I am interested in frontend development", "passionate about AI and ML"
  const interestPatterns = [
    /(?:i am interested in|i'm interested in|interested in|passionate about|keen on)\s+([a-z0-9\s\/\-\#\+]+?)(?=[,\.\!]|\s+and i\b|\s+my goal\b|\s+i want\b|$)/i,
  ];

  for (const pattern of interestPatterns) {
    const match = trimmed.match(interestPatterns[0]);
    if (match && match[1]) {
      const rawInterest = match[1].trim();
      if (rawInterest.length > 2 && rawInterest.length < 60) {
        const formatted = cleanAndCapitalize(rawInterest);
        if (!isAlreadyKnown('Interests', formatted) && !proposed.some((p) => p.value === formatted)) {
          proposed.push({
            category: 'Interests',
            label: 'Area of Interest',
            value: formatted,
          });
        }
        break;
      }
    }
  }

  // 5. Learning Preferences & Time
  // Matches: "I have 15 hours per week", "I prefer project-based learning"
  const timeMatch = trimmed.match(/(?:i have|available)\s+(\d+\s*(?:hours|hrs)(?:\s*per\s*week|\/week)?)/i);
  if (timeMatch && timeMatch[1]) {
    const formatted = cleanAndCapitalize(timeMatch[1]);
    if (!isAlreadyKnown('Preferences', formatted) && !proposed.some((p) => p.category === 'Preferences')) {
      proposed.push({
        category: 'Preferences',
        label: 'Weekly Study Availability',
        value: formatted,
      });
    }
  }

  return proposed;
}

/**
 * Recognition for explicit memory commands in chat (e.g. "Remember that I know C++", "Save that I want to become a software developer")
 */
export function detectMemoryCommand(input: string): {
  isCommand: boolean;
  item?: MemoryItem;
  confirmationMessage?: string;
} {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  // Pattern prefixes (sorted by length descending for greedy match)
  const prefixes = [
    'save that i want to become a ',
    'save that i want to become ',
    'save that i want to be a ',
    'save that i want to be ',
    'save that i want to ',
    'save that i am a ',
    'save that i am ',
    'save that i know ',
    'save that i have ',
    'save that i ',
    'save that ',
    'save this to memory: ',
    'save this: ',
    'save this ',
    'remember that i want to become a ',
    'remember that i want to become ',
    'remember that i want to be a ',
    'remember that i want to be ',
    'remember that i want to ',
    'remember that i am a ',
    'remember that i am ',
    'remember that i know ',
    'remember that i have ',
    'remember that i ',
    'remember that ',
    'remember i want to become a ',
    'remember i want to become ',
    'remember i want to be a ',
    'remember i want to be ',
    'remember i want to ',
    'remember i am a ',
    'remember i am ',
    'remember i know ',
    'remember i have ',
    'remember i ',
    'remember my ',
    'please remember that ',
    'please remember ',
    'remember ',
  ];

  let matchedPrefix = '';
  for (const p of prefixes) {
    if (lower.startsWith(p)) {
      matchedPrefix = p;
      break;
    }
  }

  if (!matchedPrefix) {
    return { isCommand: false };
  }

  let rawFact = trimmed.slice(matchedPrefix.length).trim();
  // Strip trailing periods or punctuation
  rawFact = rawFact.replace(/^[:\s]+|[\.\!\s]+$/g, '');
  if (!rawFact || rawFact.length < 1) {
    return { isCommand: false };
  }

  // Determine appropriate category and label based on content keywords & matched prefix
  const factLower = rawFact.toLowerCase();
  let category: MemoryItem['category'] = 'Notes';
  let label = 'Saved Note';
  let formattedValue = cleanAndCapitalize(rawFact);

  if (
    matchedPrefix.includes('know') ||
    factLower.includes('know') ||
    factLower.includes('learn') ||
    factLower.includes('skill') ||
    factLower.includes('proficient') ||
    factLower.includes('c++') ||
    factLower.includes('python') ||
    factLower.includes('react') ||
    factLower.includes('java') ||
    factLower.includes('html') ||
    factLower.includes('css') ||
    factLower.includes('javascript') ||
    factLower.includes('sql')
  ) {
    category = 'Skills';
    label = 'Known Languages & Skills';
    formattedValue = cleanAndCapitalize(rawFact.replace(/^(?:i know|i have learned|i learned|that i know)\s+/i, ''));
  } else if (
    matchedPrefix.includes('want to') ||
    matchedPrefix.includes('become') ||
    factLower.includes('goal') ||
    factLower.includes('internship') ||
    factLower.includes('job') ||
    factLower.includes('aim') ||
    factLower.includes('target') ||
    factLower.includes('developer') ||
    factLower.includes('engineer')
  ) {
    category = 'Goals';
    label = 'Target Career Goal';
    formattedValue = cleanAndCapitalize(rawFact.replace(/^(?:a|an)\s+/i, ''));
  } else if (
    factLower.includes('interest') ||
    factLower.includes('like') ||
    factLower.includes('love') ||
    factLower.includes('passionate')
  ) {
    category = 'Interests';
    label = 'Area of Interest';
    formattedValue = cleanAndCapitalize(rawFact.replace(/^(?:interested in|passionate about)\s+/i, ''));
  } else if (
    matchedPrefix.includes('am a') ||
    matchedPrefix.includes('am ') ||
    factLower.includes('student') ||
    factLower.includes('bca') ||
    factLower.includes('mca') ||
    factLower.includes('btech') ||
    factLower.includes('b.tech') ||
    factLower.includes('university') ||
    factLower.includes('college') ||
    factLower.includes('year') ||
    factLower.includes('degree') ||
    factLower.includes('semester')
  ) {
    category = 'Education';
    label = 'Current Degree / Education';
    if (factLower === 'bca') {
      formattedValue = 'Bachelor of Computer Applications (BCA)';
    } else {
      formattedValue = cleanAndCapitalize(rawFact.replace(/^(?:a|an)\s+/i, ''));
    }
  }

  const newMemoryItem: MemoryItem = {
    id: `mem-${Date.now()}`,
    category,
    label,
    value: formattedValue,
    updatedAt: 'Saved via Chat',
  };

  const confirmationMessage = `I've saved that to your memory profile:\n\n• [${category}] ${label}: "${formattedValue}"\n\nYour memory is stored locally in this browser and will be used to personalize your NextPath AI guidance and Roadmap. You can view or edit this anytime in the "My Memory" section.`;

  return {
    isCommand: true,
    item: newMemoryItem,
    confirmationMessage,
  };
}
