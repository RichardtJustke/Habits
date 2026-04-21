// ── THEME TOKENS ──────────────────────────────────────────────────────────────
export const THEME = {
  colors: {
    bg: '#000000',
    bgSecondary: '#0a0a0a',
    bgTertiary: '#141414',
    border: '#1a1a1a',
    borderLight: '#0f0f0f',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    textTertiary: '#666666',
    textMuted: '#333333',
    primary: '#00ff88',      // Neon green
    success: '#00ffff',      // Cyan
    danger: '#ff0055',       // Hot pink
    warning: '#ffaa00',      // Orange
    accent: '#aa00ff',       // Magenta
    info: '#00aaff',         // Light blue
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

// ── BIO STATUS MESSAGES ──────────────────────────────────────────────────────────
export const BIO_MSGS = [
  "// focado na evolução constante",
  "// building the future, one habit at a time",
  "// consistência vence a intensidade",
  "// codando a própria vida",
  "// 1% melhor todos os dias",
  "// debugando processos diários",
  "// não conte os dias, faça os dias contarem",
  "// transformando rotina em algoritmo"
];

// ── ROTATING MESSAGES ──────────────────────────────────────────────────────────
export const ROTATING_MSGS = [
  "lista de tarefas carregada. entusiasmo não incluído.",
  "git commit -m 'coisa feita'",
  "inicializando daemon de produtividade...",
  "// TODO: mudar o mundo",
  "sem testes falhando. ainda.",
  "empurrando para main. sem arrependimentos.",
  "rm -rf procrastinação",
  "conflito de merge: cérebro vs lista de tarefas",
];

// ── HABIT GROUPS ───────────────────────────────────────────────────────────────
export const GROUPS = {
  morning: {
    label: 'Manhã',
    icon: '🌅',
  },
  deepwork: {
    label: 'Trabalho Profundo',
    icon: '💻',
  },
  health: {
    label: 'Saúde',
    icon: '💪',
  },
  evening: {
    label: 'Descompressão',
    icon: '🌙',
  },
  learning: {
    label: 'Aprendizado',
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
