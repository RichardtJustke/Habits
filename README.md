# TrackerDay

```text
  _____               _             _____             
 |_   _|             | |           |  __ \            
   | | _ __ __ _  ___| | _____ _ __| |  | |__ _ _   _ 
   | || '__/ _` |/ __| |/ / _ \ '__| |  | / _` | | | |
   | || | | (_| | (__|   <  __/ |  | |__| \__, | |_| |
   \_/|_|  \__,_|\___|_|\_\___|_|  |_____/ \__,_|\__, |
                                                  __/ |
                                                 |___/ 
```

**TrackerDay** (anteriormente Habits Tracker) começou como uma releitura minimalista de projeto, focada em construir uma interface _terminal-like_ para rastreamento diário de hábitos utilizando Vite + React 18, persistência local e um design agressivamente verde-neon/magenta num fundo preto.

Quem sabe esse experimento inicial não seja a semente para uma aplicação mais robusta no futuro? Por enquanto, é apenas você, seus hábitos e o terminal.

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
✅ **Subtasks** — cada tarefa pode carregar subitens e você pode removê-los individualmente  
✅ **Streaks** — contador de dias consecutivos por tarefa  
✅ **Heatmap de contribuições** — último ano de atividade  
✅ **Estatísticas** — dias rastreados, média de conclusão, dias perfeitos  
✅ **Persistência local** — tudo salvo automaticamente no localStorage  
✅ **Backup JSON** — exporte e importe seus dados pelo Perfil para não perder nada  
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
- **Backup manual** — exportação/importação JSON na aba Perfil

## 💾 Como os dados são salvos

O app usa o localStorage do navegador com a chave `habits:state` para salvar automaticamente tarefas, subtasks, completions e estatísticas.

Se quiser uma proteção extra contra perda de dados, use os botões de **exportar backup JSON** e **importar backup JSON** na aba Perfil. Assim você pode guardar uma cópia fora do navegador e restaurar depois, mesmo se limpar os dados locais.

## 🏃 Build para Produção

```bash
npm run build
npm run preview
```

Saída em `dist/`

---

Made with ❤️ em JavaScript puro.
