export const FLAGSMITH_FLAG_KEY = 'placement_dashboard_experiment'

export const EXPERIMENT_VARIATIONS = {
  DAILY_PRACTICE: 'daily_practice',
  PERSONALIZED_ROADMAP: 'personalized_roadmap',
}

export const EVENT_NAMES = {
  DASHBOARD_VIEWED: 'dashboard_viewed',
  PRACTICE_STARTED: 'practice_started',
  PRACTICE_COMPLETED: 'practice_completed',
  ROADMAP_VIEWED: 'roadmap_viewed',
  LEARNING_GOAL_COMPLETED: 'learning_goal_completed',
}

export const STORAGE_KEYS = {
  DASHBOARD_VIEWED_SESSION: 'placementpilot_dashboard_viewed',
  EXPERIMENT_ASSIGNMENT: 'placementpilot_experiment_assignment',
}

export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  ADMIN_ANALYTICS: '/admin/analytics',
}

export const PRACTICE_TYPES = {
  CODING: 'coding',
  APTITUDE: 'aptitude',
  LEARNING_GOAL: 'learning_goal',
}

export const MOCK_PRACTICE_DATA = {
  coding: [
    { id: 'coding-1', title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays', estimatedTime: '15 min' },
    { id: 'coding-2', title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stack', estimatedTime: '10 min' },
    { id: 'coding-3', title: 'Merge Two Sorted Lists', difficulty: 'Easy', topic: 'Linked List', estimatedTime: '20 min' },
    { id: 'coding-4', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', topic: 'Arrays', estimatedTime: '15 min' },
    { id: 'coding-5', title: 'Valid Anagram', difficulty: 'Easy', topic: 'Hash Map', estimatedTime: '10 min' },
  ],
  aptitude: [
    { id: 'apt-1', title: 'Percentage Problems', difficulty: 'Medium', topic: 'Arithmetic', estimatedTime: '10 min' },
    { id: 'apt-2', title: 'Time and Work', difficulty: 'Medium', topic: 'Algebra', estimatedTime: '15 min' },
    { id: 'apt-3', title: 'Profit and Loss', difficulty: 'Easy', topic: 'Arithmetic', estimatedTime: '10 min' },
    { id: 'apt-4', title: 'Ratio and Proportion', difficulty: 'Easy', topic: 'Algebra', estimatedTime: '10 min' },
    { id: 'apt-5', title: 'Simple Interest', difficulty: 'Easy', topic: 'Arithmetic', estimatedTime: '8 min' },
  ],
}

export const MOCK_ROADMAP_DATA = {
  weeks: [
    {
      week: 1,
      title: 'Foundation Building',
      description: 'Master core programming concepts and data structures',
      goals: [
        { id: 'w1-g1', title: 'Arrays & Strings', type: 'coding', completed: false },
        { id: 'w1-g2', title: 'Linked Lists Basics', type: 'coding', completed: false },
        { id: 'w1-g3', title: 'Stacks & Queues', type: 'coding', completed: false },
        { id: 'w1-g4', title: 'Basic Math for Placements', type: 'aptitude', completed: false },
      ],
    },
    {
      week: 2,
      title: 'Core Data Structures',
      description: 'Deep dive into essential data structures',
      goals: [
        { id: 'w2-g1', title: 'Trees & Binary Search Trees', type: 'coding', completed: false },
        { id: 'w2-g2', title: 'Heaps & Priority Queues', type: 'coding', completed: false },
        { id: 'w2-g3', title: 'Hash Maps & Sets', type: 'coding', completed: false },
        { id: 'w2-g4', title: 'Percentages & Ratios', type: 'aptitude', completed: false },
      ],
    },
    {
      week: 3,
      title: 'Algorithms & Problem Solving',
      description: 'Learn fundamental algorithms and techniques',
      goals: [
        { id: 'w3-g1', title: 'Sorting Algorithms', type: 'coding', completed: false },
        { id: 'w3-g2', title: 'Searching Algorithms', type: 'coding', completed: false },
        { id: 'w3-g3', title: 'Two Pointer Technique', type: 'coding', completed: false },
        { id: 'w3-g4', title: 'Time & Work Problems', type: 'aptitude', completed: false },
      ],
    },
    {
      week: 4,
      title: 'Advanced Topics',
      description: 'Tackle advanced concepts for top-tier companies',
      goals: [
        { id: 'w4-g1', title: 'Dynamic Programming Intro', type: 'coding', completed: false },
        { id: 'w4-g2', title: 'Graph Algorithms Basics', type: 'coding', completed: false },
        { id: 'w4-g3', title: 'Sliding Window Technique', type: 'coding', completed: false },
        { id: 'w4-g4', title: 'Profit, Loss & Interest', type: 'aptitude', completed: false },
      ],
    },
  ],
}

export const DAILY_GOALS = [
  { id: 'dg-1', type: 'coding', title: 'Solve 1 coding problem', target: 1, unit: 'problem' },
  { id: 'dg-2', type: 'aptitude', title: 'Practice 5 aptitude questions', target: 5, unit: 'questions' },
  { id: 'dg-3', type: 'reading', title: 'Read 1 technical article', target: 1, unit: 'article' },
  { id: 'dg-4', type: 'mock', title: 'Take 1 mini mock test', target: 1, unit: 'test' },
]