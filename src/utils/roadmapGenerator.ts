import { MemoryItem, MilestoneStatus, RoadmapMilestone, StageGuidance } from '../types';

export interface RoadmapCustomization {
  targetRole?: string;
  focusArea?: string;
  weeklyHours?: string;
}

const ROADMAP_OVERRIDES_KEY = 'nextpath_roadmap_status_overrides';
const PROGRESS_TRACKING_KEY = 'nextpath_roadmap_track_progress';

/**
 * Loads whether progress tracking is explicitly enabled by the student (Default: false / OFF)
 */
export function loadProgressTrackingEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(PROGRESS_TRACKING_KEY);
    return raw === 'true';
  } catch {
    return false;
  }
}

/**
 * Saves progress tracking toggle preference
 */
export function saveProgressTrackingEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROGRESS_TRACKING_KEY, enabled ? 'true' : 'false');
  } catch {
    // Ignore storage errors
  }
}

/**
 * Loads student's manual status overrides from localStorage
 */
export function loadRoadmapStatusOverrides(): Record<string, MilestoneStatus> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(ROADMAP_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Saves student's manual status overrides to localStorage
 */
export function saveRoadmapStatusOverrides(overrides: Record<string, MilestoneStatus>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ROADMAP_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Clears student's manual status overrides
 */
export function clearRoadmapStatusOverrides(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ROADMAP_OVERRIDES_KEY);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Helper to check if a student has indicated knowledge of a specific skill or keyword
 */
function studentKnows(knownSkillsText: string, keywords: string[]): boolean {
  const text = knownSkillsText.toLowerCase();
  return keywords.some((kw) => {
    const k = kw.toLowerCase();
    const regex = new RegExp(`(^|[^a-z0-9#+])${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^a-z0-9#+])`, 'i');
    return regex.test(text) || text.includes(k);
  });
}

/**
 * Generates a tailored, personalized learning sequence based on what the student already knows,
 * their interests, and their career goal.
 */
export function generatePersonalizedRoadmap(
  memories: MemoryItem[],
  customization?: RoadmapCustomization,
  statusOverrides: Record<string, MilestoneStatus> = {}
): RoadmapMilestone[] {
  // Extract verified student profile from My Memory
  const allSkills = memories
    .filter((m) => m.category === 'Skills')
    .map((m) => m.value)
    .join(' ')
    .toLowerCase();

  const allInterests = memories
    .filter((m) => m.category === 'Interests')
    .map((m) => m.value)
    .join(' ')
    .toLowerCase();

  const allGoals = memories
    .filter((m) => m.category === 'Goals')
    .map((m) => m.value)
    .join(' ')
    .toLowerCase();

  // Target role determination
  let targetRole = customization?.targetRole || 'Software Developer';
  if (!customization?.targetRole && allGoals) {
    if (allGoals.includes('frontend') || allGoals.includes('front-end') || allGoals.includes('web dev')) {
      targetRole = 'Frontend Web Developer';
    } else if (allGoals.includes('backend') || allGoals.includes('back-end') || allGoals.includes('systems')) {
      targetRole = 'Backend Systems Developer';
    } else if (allGoals.includes('ai') || allGoals.includes('machine learning') || allGoals.includes('data sci')) {
      targetRole = 'AI / ML Engineer';
    } else if (allGoals.includes('full stack') || allGoals.includes('fullstack')) {
      targetRole = 'Full-Stack Developer';
    } else if (allGoals.includes('mobile') || allGoals.includes('android') || allGoals.includes('ios')) {
      targetRole = 'Mobile Application Developer';
    }
  }

  // Detect skills the student explicitly mentioned knowing
  const knowsCpp = studentKnows(allSkills, ['c++', 'cpp']);
  const knowsC = studentKnows(allSkills, ['c']) && !knowsCpp;
  const knowsPython = studentKnows(allSkills, ['python', 'py']);
  const knowsJava = studentKnows(allSkills, ['java']) && !studentKnows(allSkills, ['javascript']);
  const knowsJs = studentKnows(allSkills, ['javascript', 'js', 'typescript', 'ts']);
  const knowsHtml = studentKnows(allSkills, ['html', 'html5']);
  const knowsCss = studentKnows(allSkills, ['css', 'css3', 'tailwind']);
  const knowsGit = studentKnows(allSkills, ['git', 'github']);
  const knowsDsa = studentKnows(allSkills, ['dsa', 'data structures', 'algorithms', 'leetcode']);
  const knowsReact = studentKnows(allSkills, ['react', 'next.js', 'vue']);
  const knowsSql = studentKnows(allSkills, ['sql', 'postgres', 'postgresql', 'mysql', 'mongodb', 'database']);

  const hasProgLanguage = knowsCpp || knowsC || knowsPython || knowsJava || knowsJs;

  const primaryLang = knowsCpp
    ? 'C++'
    : knowsC
    ? 'C / C++'
    : knowsPython
    ? 'Python'
    : knowsJava
    ? 'Java'
    : knowsJs
    ? 'JavaScript / TypeScript'
    : 'C++ or Python';

  const stages: RoadmapMilestone[] = [];
  let stageNumber = 1;

  // 1. Core Programming / Syntax
  // If the student already knows a core language, we do not recommend basic syntax from scratch.
  if (!hasProgLanguage) {
    const id = `s-${stageNumber}`;
    const guidance: StageGuidance = {
      whyItMatters: 'Foundational programming syntax and algorithmic thinking are essential prerequisites before learning data structures, frameworks, or backend systems.',
      learningOrder: [
        '1. Variables, Primitive Data Types & Operators',
        '2. Conditionals, Logical Operators & Control Flow',
        '3. Loops (for, while) & Iteration Patterns',
        '4. Functions, Parameter Passing, Return Values & Scope',
        '5. Object-Oriented Fundamentals (Classes, Objects, Methods)'
      ],
      subtopics: [
        'Data Types & Variables',
        'If / Else / Switch Logic',
        'For / While Loops & Nested Loops',
        'Functions, Arguments & Recursion Basics',
        'Classes, Structs & Encapsulation'
      ],
      practiceIdeas: [
        'Number guessing game with attempts counter',
        'Palindrome and anagram string verification',
        'Matrix arithmetic and 2D grid manipulation',
        'Simple command-line calculator'
      ],
      projects: {
        beginner: 'Command-Line Student Gradebook & GPA Calculator',
        intermediate: 'Bank Account Transaction Simulation with File I/O',
        advanced: 'Console-based Inventory & Billing Management System'
      },
      commonMistakes: [
        'Memorizing code snippets rather than understanding problem-solving logic',
        'Neglecting to test edge cases (zero, negative inputs, empty strings)',
        'Ignoring compiler warnings and syntax diagnostics'
      ],
      suggestedNextAction: 'Choose one primary language (e.g. C++ or Python) and build 3 small command-line utilities to master control flow.'
    };

    stages.push({
      id,
      number: stageNumber++,
      title: 'Programming Fundamentals & Syntax',
      description: 'Master core programming constructs: variables, data types, loops, conditionals, functions, scope, and object-oriented programming (recommended in C++ or Python).',
      skills: ['Variables & Types', 'Control Flow & Loops', 'Functions & Scope', 'OOP Fundamentals'],
      status: statusOverrides[id] || 'Not Started',
      estimatedTime: 'Weeks 1 - 4',
      guidance,
    });
  }

  // 2. Data Structures & Algorithms
  // If they know a language (e.g. C/C++), this is their immediate #1 recommendation.
  if (!knowsDsa) {
    const id = `s-${stageNumber}`;
    const guidance: StageGuidance = {
      whyItMatters: 'DSA is the foundation of efficient software engineering and technical problem-solving. It teaches you how data is organized, accessed, and transformed with optimal time and space efficiency.',
      learningOrder: [
        '1. Asymptotic Analysis (Big-O Time & Space Complexity)',
        '2. Arrays, Strings, Two Pointers & Sliding Window',
        '3. Linked Lists (Singly, Doubly) & Pointer Mechanics',
        '4. Stacks, Queues & Monotonic Data Structures',
        '5. Recursion & Backtracking Fundamentals',
        '6. Sorting Algorithms & Binary Search Variations',
        '7. Binary Trees, Binary Search Trees & Tree Traversals',
        '8. Hash Maps & Hash Sets (O(1) lookups & frequency counters)',
        '9. Graphs (BFS, DFS, Shortest Paths) & Dynamic Programming Intro'
      ],
      subtopics: [
        'Big-O Time and Space Analysis',
        'Two Pointers & Sliding Window Patterns',
        'Dynamic Memory Pointers & Dynamic Arrays',
        'Stack/Queue Implementations & Applications',
        'Tree Traversals (Inorder, Preorder, Postorder, Level-Order)',
        'Graph Traversal (Breadth-First Search, Depth-First Search)',
        'Custom Hash Table & Collision Resolution'
      ],
      practiceIdeas: [
        'Reverse a linked list & detect cycles (Floyd\'s Algorithm)',
        'Valid parentheses & Expression evaluation using Stack',
        'Longest Substring Without Repeating Characters (Sliding Window)',
        'Binary Search in a rotated sorted array',
        'Lowest Common Ancestor in Binary Search Tree',
        'Number of Islands / Connected Components (BFS / DFS)'
      ],
      projects: {
        beginner: 'Contact Management Directory with Custom Linked List & Binary Search',
        intermediate: 'Library Book Indexing System using Custom Hash Table & Trie Search',
        advanced: 'In-Memory Key-Value Cache with LRU Eviction & O(1) Access'
      },
      commonMistakes: [
        'Rushing to difficult competitive programming problems before mastering pointer/array basics',
        'Focusing only on time complexity while ignoring auxiliary space memory',
        'Memorizing specific solutions instead of recognizing general algorithmic patterns'
      ],
      suggestedNextAction: 'Implement a Singly Linked List and a Stack from scratch in your primary language without using standard library containers.'
    };

    stages.push({
      id,
      number: stageNumber++,
      title: hasProgLanguage ? `Data Structures & Algorithms in ${primaryLang}` : 'Data Structures & Algorithms',
      description: hasProgLanguage
        ? `Building upon your foundation in ${primaryLang}, develop deep algorithmic problem-solving. Focus on arrays, linked lists, trees, graphs, sorting, and Big-O efficiency analysis.`
        : 'Develop algorithmic problem-solving skills with core data structures (arrays, linked lists, trees, hash maps) and Big-O complexity analysis.',
      skills: ['Arrays & Strings', 'Linked Lists & Stacks', 'Trees & Graphs', 'Sorting & Binary Search', 'Big-O Analysis'],
      status: statusOverrides[id] || 'Not Started',
      estimatedTime: 'Weeks 5 - 10',
      guidance,
    });
  }

  // 3. Web UI / Foundations (adapted according to known HTML/CSS)
  if (knowsHtml && !knowsCss) {
    const id = `s-${stageNumber}`;
    const guidance: StageGuidance = {
      whyItMatters: 'CSS transforms semantic HTML markup into responsive, accessible, polished user interfaces that look consistent across all device screens.',
      learningOrder: [
        '1. The CSS Box Model (Margins, Borders, Padding, Content)',
        '2. Flexbox for 1D Layouts & Responsive Alignments',
        '3. CSS Grid for 2D Multi-Column Page Architectures',
        '4. Media Queries & Mobile-First Breakpoints',
        '5. Utility-First Styling with Tailwind CSS'
      ],
      subtopics: [
        'Box-Sizing: border-box & Resets',
        'Flex Direction, Justify-Content, Align-Items & Flex-Wrap',
        'Grid Template Columns, Rows & Grid Gap',
        'Responsive Breakpoints (Mobile, Tablet, Desktop)',
        'CSS Custom Properties (Variables) & Theme Switching'
      ],
      practiceIdeas: [
        'Building a responsive multi-column pricing card grid',
        'Responsive navigation header with mobile drawer toggle',
        'Hero section with responsive typography and card layout',
        'Dark and light color scheme with CSS custom variables'
      ],
      projects: {
        beginner: 'Responsive Personal Developer Portfolio Page',
        intermediate: 'Multi-Device Product Landing Page with Interactive Grid Showcase',
        advanced: 'Complete Responsive UI Component Library (Buttons, Badges, Modals, Cards)'
      },
      commonMistakes: [
        'Using fixed pixel widths instead of responsive percentages, rem units, or flex/grid containers',
        'Overusing absolute positioning for layout instead of Flexbox/Grid',
        'Designing only for desktop without verifying on mobile viewport sizes'
      ],
      suggestedNextAction: 'Build a 3-section responsive portfolio layout using Flexbox and CSS Grid, and test it at different screen widths.'
    };

    stages.push({
      id,
      number: stageNumber++,
      title: 'CSS3 & Responsive Web Design',
      description: 'Since you already know HTML, advance to modern CSS styling, responsive flex/grid layouts, mobile-first design, and utility frameworks like Tailwind CSS.',
      skills: ['CSS3 Styling & Box Model', 'Flexbox & CSS Grid', 'Responsive Media Queries', 'Tailwind CSS'],
      status: statusOverrides[id] || 'Not Started',
      estimatedTime: 'Weeks 11 - 13',
      guidance,
    });
  } else if (!knowsHtml && !knowsCss && !targetRole.includes('Backend')) {
    const id = `s-${stageNumber}`;
    const guidance: StageGuidance = {
      whyItMatters: 'HTML5 and CSS3 are the fundamental building blocks of all web interfaces, ensuring proper document structure, accessibility, and visual presentation.',
      learningOrder: [
        '1. Semantic HTML5 Elements (header, nav, main, section, footer)',
        '2. Accessible Web Forms, Input Controls & Validations',
        '3. CSS Box Model & Cascading Specificity Rules',
        '4. Modern Layouts with Flexbox & CSS Grid',
        '5. Responsive Media Queries & Mobile-First Styling'
      ],
      subtopics: [
        'Semantic Document Structure & Heading Hierarchy',
        'Accessible Forms, Labels & ARIA Basics',
        'CSS Selectors, Specificity & Box Model',
        'Flexbox Layouts & CSS Grid Systems',
        'Responsive Design & Viewport Meta Configuration'
      ],
      practiceIdeas: [
        'Semantic student registration form with validation messages',
        'Clean blog post layout with responsive sidebar',
        'Responsive photo gallery grid with hover effects',
        'Feature showcase card grid'
      ],
      projects: {
        beginner: 'Semantic Student Resume & Profile Page',
        intermediate: 'Responsive University Club / Event Portal Homepage',
        advanced: 'E-Commerce Product Showcase Catalog'
      },
      commonMistakes: [
        'Using generic <div> elements for everything instead of semantic HTML5 tags',
        'Omitting <label> tags for form inputs, hurting accessibility',
        'Hardcoding fixed dimensions that break on smaller mobile screens'
      ],
      suggestedNextAction: 'Write semantic HTML5 for a personal resume page, then style it with responsive CSS Flexbox.'
    };

    stages.push({
      id,
      number: stageNumber++,
      title: 'Web UI & Markup Fundamentals',
      description: 'Learn the foundational building blocks of the web: semantic HTML5 markup, responsive CSS3 styling, and layout principles.',
      skills: ['Semantic HTML5', 'CSS3 & Responsive Design', 'Flexbox & Grid', 'Web Accessibility (a11y)'],
      status: statusOverrides[id] || 'Not Started',
      estimatedTime: 'Weeks 11 - 14',
      guidance,
    });
  }

  // 4. Dynamic JavaScript / Client Scripting
  if (!knowsJs && !targetRole.includes('AI / ML')) {
    const id = `s-${stageNumber}`;
    const guidance: StageGuidance = {
      whyItMatters: 'JavaScript brings static web pages to life with client-side interactivity, state management, asynchronous API communications, and modern web application logic.',
      learningOrder: [
        '1. Modern ES6+ Syntax (let/const, Arrow Functions, Destructuring, Spread)',
        '2. Array Methods & Functional Patterns (map, filter, reduce, find)',
        '3. DOM Tree Navigation, Element Creation & Event Listeners',
        '4. Asynchronous JavaScript (Promises, Async/Await, Microtask Queue)',
        '5. Fetch API, JSON Parsing, Error Handling & LocalStorage'
      ],
      subtopics: [
        'Scope, Closures & Execution Context',
        'Higher-Order Array Methods',
        'DOM Manipulation & Event Delegation',
        'Async/Await & Promise Chaining',
        'Fetch API & Client-Side LocalStorage'
      ],
      practiceIdeas: [
        'Interactive Todo List with LocalStorage persistence',
        'Live search filter over a list of student records',
        'Weather forecast dashboard consuming a free JSON API',
        'Interactive quiz app with timer and score calculation'
      ],
      projects: {
        beginner: 'Interactive Task & Habit Tracker with LocalStorage',
        intermediate: 'Live Weather & Forecast App using Open-Meteo REST API',
        advanced: 'Interactive Kanban Board with Drag-and-Drop & Category Filtering'
      },
      commonMistakes: [
        'Directly mutating state objects without creating immutable copies',
        'Omitting try/catch error handling around network Fetch requests',
        'Attaching excessive individual event listeners instead of using event delegation'
      ],
      suggestedNextAction: 'Build a vanilla JavaScript app that fetches records from a public JSON API and renders interactive search cards.'
    };

    stages.push({
      id,
      number: stageNumber++,
      title: 'Modern JavaScript (ES6+) & DOM',
      description: 'Add dynamic interactivity and logic to web applications using modern JavaScript (ES6+), asynchronous fetching, and DOM events.',
      skills: ['JavaScript ES6+ Syntax', 'DOM Events & Manipulation', 'Async/Await & Promises', 'Fetch API & JSON Handling'],
      status: statusOverrides[id] || 'Not Started',
      estimatedTime: 'Weeks 15 - 18',
      guidance,
    });
  }

  // 5. Version Control with Git & GitHub
  if (!knowsGit) {
    const id = `s-${stageNumber}`;
    const guidance: StageGuidance = {
      whyItMatters: 'Git is the industry standard for tracking code changes, managing branches, collaborating in developer teams, and showcasing your code portfolio publicly on GitHub.',
      learningOrder: [
        '1. Git Foundations: git init, git status, git add, git commit, git log',
        '2. Branching & Merging: git branch, git checkout / switch, git merge',
        '3. Remote Repositories: git remote, git push, git pull, git clone',
        '4. GitHub Workflow: Pull Requests, Forking, Issue Tracking & Code Reviews',
        '5. Documentation: Writing Professional README.md files & .gitignore'
      ],
      subtopics: [
        'Staging Area vs Working Directory',
        'Fast-Forward vs 3-Way Merges & Conflict Resolution',
        'GitHub Pull Requests & Branch Protection',
        'Crafting Atomic, Clear Commit Messages',
        'Repository Documentation with Markdown'
      ],
      practiceIdeas: [
        'Initialize a repository and make 10 atomic feature commits',
        'Create a feature branch, create an intentional merge conflict, and resolve it cleanly',
        'Write a professional README with project architecture and setup instructions',
        'Submit a pull request on a sample repository'
      ],
      projects: {
        beginner: 'Personal Open-Source Utility Repository with Complete Documentation',
        intermediate: 'Collaborative Multi-Contributor Repository with Branching & PR Templates',
        advanced: 'GitHub Actions Automated CI Workflow for Linting & Build Verification'
      },
      commonMistakes: [
        'Writing vague commit messages like "fix" or "update code" instead of imperative action summaries',
        'Committing sensitive credentials, API keys, or large node_modules directories',
        'Pushing breaking changes directly to the main branch without code review'
      ],
      suggestedNextAction: 'Create a GitHub account, set up SSH keys, and push your first practice project with a detailed README.'
    };

    stages.push({
      id,
      number: stageNumber++,
      title: 'Version Control with Git & GitHub',
      description: 'Learn industry-standard version control to manage code history, maintain branches, collaborate on repositories, and create pull requests.',
      skills: ['Git CLI Essentials', 'Branching & Merging', 'GitHub Repositories', 'Pull Requests & Code Reviews'],
      status: statusOverrides[id] || 'Not Started',
      estimatedTime: 'Weeks 19 - 20',
      guidance,
    });
  }

  // 6. Frontend Frameworks / Component Architecture (React)
  if (!knowsReact && (targetRole.includes('Frontend') || targetRole.includes('Full-Stack') || targetRole.includes('Software') || allInterests.includes('frontend') || allInterests.includes('web'))) {
    const id = `s-${stageNumber}`;
    const guidance: StageGuidance = {
      whyItMatters: 'React enables building scalable, modular user interfaces with reactive state, custom hooks, and reusable component hierarchies.',
      learningOrder: [
        '1. JSX Syntax & Component Decomposition',
        '2. State & Props Management with useState',
        '3. Side Effects, Lifecycles & API Fetching with useEffect',
        '4. Custom Hooks & Logic Extraction',
        '5. Global State & Context Management',
        '6. Client-Side Routing (React Router)'
      ],
      subtopics: [
        'Virtual DOM & Declarative UI',
        'Unidirectional Data Flow & Lifting State Up',
        'Custom Hooks for Reusable Logic',
        'Effect Dependencies & Cleanup Functions',
        'Component Memoization & Performance'
      ],
      practiceIdeas: [
        'E-Commerce shopping cart with live price calculations and modal checkout',
        'Recipe finder with debounced search and category tags',
        'Multi-step student application form with client-side validation',
        'Anime / Movie watchlist with favorites stored in local storage'
      ],
      projects: {
        beginner: 'Student Flashcard Study App with Quiz Mode & Score Tracker',
        intermediate: 'Tech Jobs & Internship Explorer with Search, Filters & Bookmarking',
        advanced: 'Full Productivity Workspace with Kanban Boards & Markdown Note Editor'
      },
      commonMistakes: [
        'Mutating state directly instead of returning new state copies',
        'Missing dependency variables in useEffect causing infinite loops or stale closures',
        'Prop-drilling data through 10 component layers instead of using React Context'
      ],
      suggestedNextAction: 'Build a multi-component React app with live search filtering and state management.'
    };

    stages.push({
      id,
      number: stageNumber++,
      title: 'Modern Frontend & Component Architecture (React)',
      description: 'Construct scalable, interactive user interfaces with React, JSX components, custom hooks, reactive state, and client-side routing.',
      skills: ['React Components & Props', 'State & Custom Hooks', 'Client Routing', 'Component Lifecycle & Fetching'],
      status: statusOverrides[id] || 'Not Started',
      estimatedTime: 'Weeks 21 - 25',
      guidance,
    });
  }

  // 7. Backend APIs & Database Architecture
  if (!knowsSql || targetRole.includes('Backend') || targetRole.includes('Full-Stack') || targetRole.includes('Software')) {
    const id = `s-${stageNumber}`;
    const guidance: StageGuidance = {
      whyItMatters: 'Backend systems handle core business logic, secure authentication, data validation, and reliable persistent storage in databases.',
      learningOrder: [
        '1. HTTP Protocol, Status Codes & RESTful Design Principles',
        '2. Server Frameworks (Node.js / Express or Python / FastAPI)',
        '3. Relational Databases & SQL Queries (PostgreSQL / MySQL)',
        '4. Database Schema Design, Primary/Foreign Keys & Migrations',
        '5. Authentication & Authorization (Password Hashing & JWTs)',
        '6. Input Validation, Middleware & Error Handling'
      ],
      subtopics: [
        'RESTful API Conventions (GET, POST, PUT, DELETE)',
        'SQL Joins, Indexing & Aggregations',
        'Password Security with bcrypt & JWT Token Verification',
        'Database Relational Modelling & Normalization',
        'CORS, Rate Limiting & Security Best Practices'
      ],
      practiceIdeas: [
        'RESTful API for student task management with appropriate HTTP status codes',
        'Relational database schema for an e-commerce order system with foreign keys',
        'User registration and login endpoint with encrypted passwords and JWT tokens',
        'Search query endpoint with SQL filtering and pagination'
      ],
      projects: {
        beginner: 'RESTful Student Notes & Task API with PostgreSQL Database',
        intermediate: 'User Authentication & Role-Based Access Control (RBAC) Service',
        advanced: 'Full-Featured Discussion Platform API with Comment Threads & Moderation'
      },
      commonMistakes: [
        'Storing plaintext passwords instead of salted bcrypt hashes',
        'Vulnerability to SQL injection by concatenating raw user strings into queries',
        'Returning 200 OK for server errors instead of standard 4xx/5xx HTTP codes'
      ],
      suggestedNextAction: 'Create a lightweight Express or FastAPI server that connects to a database and handles complete CRUD operations.'
    };

    stages.push({
      id,
      number: stageNumber++,
      title: 'Backend Services & Database Architecture',
      description: 'Design and integrate server endpoints, RESTful APIs, relational databases (PostgreSQL/SQL), CRUD operations, and authentication fundamentals.',
      skills: ['RESTful API Architecture', 'Relational Databases & SQL', 'CRUD Operations & Queries', 'Authentication & Security'],
      status: statusOverrides[id] || 'Not Started',
      estimatedTime: 'Weeks 26 - 29',
      guidance,
    });
  }

  // 8. Flagship Portfolio Projects
  {
    const id = `s-${stageNumber}`;
    const guidance: StageGuidance = {
      whyItMatters: 'Flagship full-stack projects prove that you can bridge user interfaces, backend APIs, and cloud databases into working production applications.',
      learningOrder: [
        '1. Problem Definition, User Flow & Architecture Diagramming',
        '2. Database Schema Modeling & REST API Specification',
        '3. Frontend UI Development & API Integration',
        '4. Comprehensive Error Handling, Loading States & Edge Case Testing',
        '5. Production Deployment to Cloud (Cloud Run / Vercel) with Live URLs',
        '6. Technical Documentation in GitHub README'
      ],
      subtopics: [
        'End-to-End System Architecture',
        'Cloud Deployment & Environment Variable Security',
        'Responsive UI & Error Boundaries',
        'Performance Optimization & Lighthouse Audits',
        'Writing Technical Project Case Studies'
      ],
      practiceIdeas: [
        'Deploying a full-stack web application to cloud hosting',
        'Setting up cloud database instances and secure connections',
        'Writing an architectural overview diagram and feature walkthrough in README',
        'Implementing comprehensive form validation and user feedback states'
      ],
      projects: {
        beginner: 'Full-Stack Student Collaboration Hub with Real-Time Q&A',
        intermediate: 'Campus Event Booking & Ticketing Platform with QR Codes',
        advanced: 'AI-Powered Career & Resume Optimization Assistant with Cloud Persistence'
      },
      commonMistakes: [
        'Building 5 unfinished tutorial copies instead of 2 polished, original projects',
        'Leaving broken links, dummy text, or missing test login credentials in live demos',
        'Failing to document project architecture and setup instructions in the README'
      ],
      suggestedNextAction: 'Pick one domain problem you want to solve, sketch the database schema and UI screens, and begin building Sprint 1.'
    };

    stages.push({
      id,
      number: stageNumber++,
      title: 'Build Flagship Real-World Projects',
      description: 'Combine all learned technologies into 2 complete, non-trivial applications solving real problems. Deploy them live to the cloud with full source code on GitHub.',
      skills: ['2 Full-Stack Applications', 'Cloud Production Deployment', 'Live Demo & Documentation', 'Architecture Diagrams'],
      status: statusOverrides[id] || 'Not Started',
      estimatedTime: 'Weeks 30 - 33',
      guidance,
    });
  }

  // 9. Internship & Interview Preparation
  {
    const id = `s-${stageNumber}`;
    const guidance: StageGuidance = {
      whyItMatters: 'Turns your technical competencies into interview invitations and job offers through clear communication, polished portfolios, and structured problem-solving.',
      learningOrder: [
        '1. 1-Page Action-Verb Tech Resume Polish (Google XYZ Formula)',
        '2. GitHub Profile & Pinned Project Showcase Curation',
        '3. Technical Problem Solving & Live Coding Communication',
        '4. Behavioral Interview Preparation using the STAR Method',
        '5. Strategic Internship Applications & University Career Fair Outreach'
      ],
      subtopics: [
        'Action-Verb Impact Statements (XYZ Formula)',
        'GitHub Pinned Projects & Live Demos',
        'Thinking Out Loud in Live Technical Interviews',
        'STAR Method (Situation, Task, Action, Result)',
        'Student Tech Resume Polish'
      ],
      practiceIdeas: [
        'Rewriting resume project bullets to highlight measurable outcomes and specific technologies',
        'Conducting a 45-minute timed mock coding session with a peer',
        'Practicing STAR behavioral stories for handling deadlines, technical bugs, and teamwork',
        'Reviewing top fundamental interview concepts for your target career'
      ],
      projects: {
        beginner: 'Personal Developer Showcase Portfolio Website with Live Demos',
        intermediate: 'Curated Technical Interview Cheatsheet & Pattern Reference',
        advanced: 'Open-Source Contribution with Merged Pull Request to an Active Repository'
      },
      commonMistakes: [
        'Submitting multi-page resumes with generic objectives instead of concise 1-page impact summaries',
        'Going silent during coding interviews instead of explaining your thought process clearly',
        'Mass-applying without tailoring your resume to the specific position requirements'
      ],
      suggestedNextAction: 'Polish your 1-page tech resume, pin your 2 best projects on GitHub with live URLs, and practice 1 timed technical mock interview.'
    };

    stages.push({
      id,
      number: stageNumber++,
      title: `Internship & ${targetRole} Career Preparation`,
      description: `Tailor your student resume for ${targetRole} positions, polish your project showcase, practice live problem solving, and apply for student internships.`,
      skills: ['1-Page Tech Resume Polish', 'GitHub Showcase Portfolio', 'STAR Behavioral Preparation', 'Technical Mock Interviews'],
      status: statusOverrides[id] || 'Not Started',
      estimatedTime: 'Weeks 34 - 36',
      guidance,
    });
  }

  return stages;
}
