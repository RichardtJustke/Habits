import { useState, useEffect } from 'react';
import { THEME, ROTATING_MSGS } from './constants.js';
import { useHabits } from './hooks/useHabits.js';
import { buildHeatmap, calculateCurrentStreak, getRotatingMessage } from './utils/helpers.js';
import TerminalWindow from './components/TerminalWindow.jsx';
import TerminalMenu from './components/TerminalMenu.jsx';
import TerminalOutput from './components/TerminalOutput.jsx';
import CommandPrompt from './components/CommandPrompt.jsx';
import FlashMessage from './components/FlashMessage.jsx';
import HabitsTab from './tabs/HabitsTab.jsx';
import StatsTab from './tabs/StatsTab.jsx';
import ProfileTab from './tabs/ProfileTab.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('habits');
  const [command, setCommand] = useState('');
  const [flashMsg, setFlashMsg] = useState('');
  const habits = useHabits();

  const rotatingMsg = getRotatingMessage(ROTATING_MSGS);
  const currentStreak = calculateCurrentStreak(habits.dayLog);

  const menuOptions = [
    { id: 'habits', label: 'Hábitos', icon: '📋' },
    { id: 'stats', label: 'Estatísticas', icon: '📊' },
    { id: 'profile', label: 'Perfil', icon: '👤' },
  ];

  const handleToggle = (taskId) => {
    habits.toggle(taskId);
    setFlashMsg('✓ task committed');
    setTimeout(() => setFlashMsg(''), 1200);
  };

  const handleAddTask = ({ group, name, note }) => {
    habits.addTask({ group, name, note });
    setFlashMsg('✓ task added');
    setTimeout(() => setFlashMsg(''), 1200);
  };

  const handleDeleteTask = (taskId) => {
    habits.deleteTask(taskId);
    setFlashMsg('✓ task removed');
    setTimeout(() => setFlashMsg(''), 1200);
  };

  const handleResetAll = () => {
    habits.resetAllData();
    setFlashMsg('✓ data reset');
    setTimeout(() => setFlashMsg(''), 1200);
  };

  const handleCommandSubmit = () => {
    const cmd = command.toLowerCase().trim();
    if (!cmd) return;

    const cmdMap = {
      'habits': () => setActiveTab('habits'),
      'stats': () => setActiveTab('stats'),
      'profile': () => setActiveTab('profile'),
      'help': () => console.log('help'),
      'clear': () => setCommand(''),
    };

    if (cmdMap[cmd]) {
      cmdMap[cmd]();
      setFlashMsg(`$ ${cmd}`);
      setTimeout(() => setFlashMsg(''), 800);
    }

    setCommand('');
  };

  if (!habits.loaded) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: THEME.colors.bg,
          color: THEME.colors.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: THEME.typography.fontFamily,
        }}
      >
        <div style={{ textAlign: 'center', fontSize: THEME.typography.fontSize }}>
          <div style={{ color: THEME.colors.primary, fontWeight: 'bold', marginBottom: 10 }}>
            ❯ initializing...
          </div>
          <div style={{ color: THEME.colors.textTertiary, fontSize: THEME.typography.fontSizeSmall }}>
            loading habits terminal
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: THEME.colors.bg,
        color: THEME.colors.text,
        fontFamily: THEME.typography.fontFamily,
        fontSize: THEME.typography.fontSize,
        padding: THEME.spacing.xl,
      }}
    >
      <FlashMessage message={flashMsg} />

      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <TerminalWindow title="RASTREADOR DE HÁBITOS v1.0">
          {/* Mensagem de boas-vindas */}
          <TerminalOutput title="Bem-vindo" type="accent">
            <div style={{ marginBottom: THEME.spacing.md }}>
              Bem-vindo ao <strong>Terminal de Hábitos</strong> • {rotatingMsg}
            </div>
            <div style={{ color: THEME.colors.textTertiary, fontSize: THEME.typography.fontSizeSmall }}>
              Digite 'habitos', 'stats' ou 'perfil' para navegar • Pressione ↵ para executar
            </div>
          </TerminalOutput>

          {/* Menu */}
          <TerminalMenu
            options={menuOptions}
            activeOption={activeTab}
            onSelect={(tab) => {
              setActiveTab(tab);
              setFlashMsg(`$ ${tab}`);
              setTimeout(() => setFlashMsg(''), 800);
            }}
          />

          {/* Input de comando */}
          <CommandPrompt
            command={command}
            onCommandChange={setCommand}
            onCommandSubmit={handleCommandSubmit}
            placeholder="habitos | stats | perfil"
          />

          {/* Conteúdo */}
          {activeTab === 'habits' && (
            <HabitsTab
              rotatingMsg={rotatingMsg}
              tasks={habits.tasks}
              completions={habits.completions}
              dayLog={habits.dayLog}
              currentStreak={currentStreak}
              onToggle={handleToggle}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {activeTab === 'stats' && (
            <StatsTab rotatingMsg={rotatingMsg} tasks={habits.tasks} dayLog={habits.dayLog} />
          )}

          {activeTab === 'profile' && (
            <ProfileTab
              tasks={habits.tasks}
              dayLog={habits.dayLog}
              completions={habits.completions}
              onResetAll={handleResetAll}
            />
          )}
        </TerminalWindow>
      </div>
    </div>
  );
}
