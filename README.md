# Habits Tracker

```
 _   _       _     _ _       _______ 
| | | |     | |   (_) |     |__   __|
| |_| | __ _| |__  _| |_ ___   | |   
|  _  |/ _` | '_ \| | __/ __|  | |   
| | | | (_| | |_) | | |_\__ \  | |   
|_| |_|\__,_|_.__/|_|\__|___/  |_|   
```

**Daily habit tracker** com interface terminal-like, persistência em localStorage e heatmap de contribuições.

## 🚀 Stack

- **Vite 5** + **React 18**
- JavaScript puro (sem TypeScript)
- Inline styles com tokens centralizados
- localStorage para persistência

## 📦 Setup

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`

## 🏗️ Estrutura

```
src/
├── App.jsx                 # Orquestrador principal
├── constants.js            # THEME, GROUPS, DEFAULT_TASKS, ROTATING_MSGS
├── utils/
│   └── helpers.js          # Funções puras (datas, heatmap, stats)
├── hooks/
│   ├── useHabits.js        # Lógica de estado (toggle, add, delete)
│   └── useStorage.js       # localStorage (não usado no hook principal)
├── components/
│   ├── TabBar.jsx
│   ├── TerminalHeader.jsx
│   ├── WeekStrip.jsx
│   ├── ProgressBar.jsx
│   ├── FlashMessage.jsx
│   ├── TaskItem.jsx
│   ├── TaskGroup.jsx
│   ├── AddTaskForm.jsx
│   ├── AddTaskButton.jsx
│   └── HeatMap.jsx
└── tabs/
    ├── HabitsTab.jsx       # Tab principal com tarefas diárias
    ├── StatsTab.jsx        # Heatmap e estatísticas
    └── ProfileTab.jsx      # Perfil e configurações
```

## 🎯 Features

✅ **Tarefas organizadas por grupos** (Morning, Deep Work, Saúde, Wind Down, Learning)  
✅ **Streaks** — contador de dias consecutivos por tarefa  
✅ **Heatmap de contribuições** — último ano de atividade  
✅ **Estatísticas** — dias rastreados, média de conclusão, dias perfeitos  
✅ **Persistência local** — tudo salvo no localStorage  
✅ **UI terminal-like** — dark mode com paleta Dracula-inspired  

## 🎨 Customizar Tema

Edit `src/constants.js` → `THEME` para cores, espaçamento, tipografia:

```js
export const THEME = {
  colors: { bg: '#0d0f1a', primary: '#f0b429', ... },
  spacing: { xs: 4, sm: 6, md: 10, ... },
  ...
}
```

## 📝 Adicionar Tarefas Default

Edit `src/constants.js` → `DEFAULT_TASKS`:

```js
export const DEFAULT_TASKS = [
  { id: 't1', group: 'morning', name: 'Acordar cedo', note: '// sem snooze', streak: 0 },
  ...
]
```

## 🧠 Lógica Principal

- **`useHabits()`** — gerencia tasks, completions, dayLog + ações
- **Helpers pures** — cálculos de datas, heatmap, streaks
- **Componentes stateless** — recebem props, disparam callbacks
- **localStorage** — auto-save via useEffect

## 🏃 Build para Produção

```bash
npm run build
npm run preview
```

Saída em `dist/`

---

Made with ❤️ em JavaScript puro.
