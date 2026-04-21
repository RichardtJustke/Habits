# 📋 Habits Tracker — Arquitetura

```
src/
│
├─ main.jsx ........................ React DOM entry
├─ App.jsx ......................... Orquestrador principal
├─ constants.js .................... THEME, GROUPS, DEFAULT_TASKS, ROTATING_MSGS
│
├─ utils/
│  └─ helpers.js ................... Funções pures
│     • today(), fmt(), genWeekDays()
│     • buildHeatmap(), heatColor()
│     • calculateCurrentStreak(), calculateStats()
│     • getMonthLabels(), buildProgressBar()
│     • getRotatingMessage()
│
├─ hooks/
│  ├─ useHabits.js ................. State machine
│  │  • tasks, completions, dayLog
│  │  • toggle(), addTask(), deleteTask(), resetAllData()
│  │  • localStorage integration (load/save)
│  │
│  └─ useStorage.js ................ (não utilizado atualmente)
│
├─ components/ (10 arquivos)
│  ├─ TabBar.jsx ................... Abas (habits/stats/profile)
│  ├─ TerminalHeader.jsx ........... Header com rotating msg
│  ├─ WeekStrip.jsx ................ Semana + navegação
│  ├─ ProgressBar.jsx .............. Barra de progresso diária
│  ├─ FlashMessage.jsx ............. Toast de feedback
│  ├─ TaskItem.jsx ................. Item de tarefa (checkbox)
│  ├─ TaskGroup.jsx ................ Grupo de tarefas
│  ├─ AddTaskForm.jsx .............. Formulário para nova tarefa
│  ├─ AddTaskButton.jsx ............ Botão "+ nova tarefa"
│  └─ HeatMap.jsx .................. Heatmap de contribuições
│
└─ tabs/ (3 arquivos)
   ├─ HabitsTab.jsx ................ Tarefas diárias
   ├─ StatsTab.jsx ................. Heatmap + estatísticas
   └─ ProfileTab.jsx ............... Perfil + config
```

## 📊 Data Flow

```
App
├─ useHabits() ..................... State + Actions
│  ├─ tasks, completions, dayLog
│  └─ toggle, addTask, deleteTask, resetAllData
│
├─ [HabitsTab] ..................... Tarefas + Week view + Progress
├─ [StatsTab] ...................... Heatmap + Streaks
└─ [ProfileTab] .................... Profile + Reset

Components (stateless)
└─ Recebem props + disparam callbacks
```

## 🎨 Styling

```
THEME (constants.js)
├─ colors .......................... 15 cores + semantics
├─ typography ...................... familia, size
├─ spacing ......................... 8 valores (xs → max)
└─ radius .......................... 3 tamanhos

Inline styles em todos os componentes
├─ Sem CSS Modules
├─ Sem Tailwind
└─ Zero dependencies CSS
```

## ⚡ Lógica Principal

```
toggle(taskId)
  → Atualiza completions[today]
  → Recalcula dayLog[today] (percentual)
  → Atualiza streaks
  → Salva no localStorage

addTask({ group, name, note })
  → Gera ID único
  → Cria com streak: 0
  → Salva no localStorage

calculateStats()
  → totalDays, avgPct, perfectDays
  → A partir de dayLog
```

## 🔄 localStorage

```json
{
  "habits:state": {
    "tasks": [...],
    "completions": { "2026-04-21": ["t1", "t3"] },
    "dayLog": { "2026-04-21": 0.67 }
  }
}
```

Auto-save via useEffect quando estado muda.

---

**Total de arquivos**: 21  
**Linhas de código**: ~1200  
**Zero externa UI libraries**
