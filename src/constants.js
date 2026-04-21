// ── THEME TOKENS ──────────────────────────────────────────────────────────────
export const THEME = {
  colors: {
    bg: '#0d0f1a',
    bgSecondary: '#11131f',
    bgTertiary: '#1a1d2e',
    border: '#21262d',
    borderLight: '#1e2230',
    text: '#c9d1d9',
    textSecondary: '#8b949e',
    textTertiary: '#556',
    textMuted: '#334',
    primary: '#f0b429',
    success: '#4ade80',
    danger: '#e06c75',
    warning: '#d97706',
  },
  typography: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    fontSize: 14,
    fontSizeSmall: 12,
    fontSizeXSmall: 11,
  },
  spacing: {
    xs: 4,
    sm: 6,
    md: 10,
    lg: 12,
    xl: 16,
    xxl: 20,
    xxxl: 24,
    max: 32,
  },
  radius: {
    sm: 2,
    md: 4,
    lg: 6,
  },
};

// ── ROTATING MESSAGES ──────────────────────────────────────────────────────────
export const ROTATING_MSGS = [
  "task list loaded. enthusiasm not included.",
  "git commit -m 'got things done'",
  "initializing productivity daemon...",
  "// TODO: change the world",
  "no tests failing. yet.",
  "pushing to main. no regrets.",
  "rm -rf procrastination",
  "merge conflict: brain vs to-do list",
];

// ── HABIT GROUPS ───────────────────────────────────────────────────────────────
export const GROUPS = {
  morning: {
    label: 'Morning',
    icon: '🌅',
  },
  deepwork: {
    label: 'Deep Work',
    icon: '💻',
  },
  health: {
    label: 'Saúde',
    icon: '💪',
  },
  evening: {
    label: 'Wind Down',
    icon: '🌙',
  },
  learning: {
    label: 'Learning',
    icon: '📚',
  },
};

// ── DEFAULT TASKS ──────────────────────────────────────────────────────────────
export const DEFAULT_TASKS = [
  {
    id: 't1',
    group: 'morning',
    name: 'Acordar cedo',
    note: '// sem snooze',
    streak: 0,
  },
  {
    id: 't2',
    group: 'morning',
    name: 'Meditação',
    note: '// 10 min',
    streak: 0,
  },
  {
    id: 't3',
    group: 'deepwork',
    name: 'Bloco de foco',
    note: '// 90 min',
    streak: 0,
  },
  {
    id: 't4',
    group: 'deepwork',
    name: 'Inbox zero',
    note: '',
    streak: 0,
  },
  {
    id: 't5',
    group: 'health',
    name: 'Exercício',
    note: '// 30 min',
    streak: 0,
  },
  {
    id: 't6',
    group: 'evening',
    name: 'Leitura',
    note: '// 30 min',
    streak: 0,
  },
];
