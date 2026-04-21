import { useState, useEffect } from 'react';
import { THEME, ROTATING_MSGS } from './constants.js';
import { useHabits } from './hooks/useHabits.js';
import { buildHeatmap, calculateCurrentStreak, getRotatingMessage } from './utils/helpers.js';
import TabBar from './components/TabBar.jsx';
import FlashMessage from './components/FlashMessage.jsx';
import HabitsTab from './tabs/HabitsTab.jsx';
import StatsTab from './tabs/StatsTab.jsx';
import ProfileTab from './tabs/ProfileTab.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('habits');
  const [flashMsg, setFlashMsg] = useState('');
  const habits = useHabits();

  const rotatingMsg = getRotatingMessage(ROTATING_MSGS);
  const currentStreak = calculateCurrentStreak(habits.dayLog);

  const handleToggle = (taskId) => {
    habits.toggle(taskId);
    setFlashMsg('committed ✓');
    setTimeout(() => setFlashMsg(''), 1200);
  };

  const handleAddTask = ({ group, name, note }) => {
    habits.addTask({ group, name, note });
    setFlashMsg('tarefa adicionada ✓');
    setTimeout(() => setFlashMsg(''), 1200);
  };

  const handleDeleteTask = (taskId) => {
    habits.deleteTask(taskId);
  };

  const handleResetAll = () => {
    habits.resetAllData();
    setFlashMsg('dados resetados ✓');
    setTimeout(() => setFlashMsg(''), 1200);
  };

  if (!habits.loaded) {
    return (
      <div style={{ minHeight: '100vh', background: THEME.colors.bg, color: THEME.colors.text }}>
        <div style={{ padding: THEME.spacing.xxxl, textAlign: 'center' }}>carregando...</div>
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
      }}
    >
      <FlashMessage message={flashMsg} />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: `0 ${THEME.spacing.max}px ${THEME.spacing.xxxl * 4}px` }}>
        {/* TABS */}
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} tabs={['habits', 'stats', 'profile']} />

        {/* ── HABITS TAB ── */}
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

        {/* ── STATS TAB ── */}
        {activeTab === 'stats' && (
          <StatsTab rotatingMsg={rotatingMsg} tasks={habits.tasks} dayLog={habits.dayLog} />
        )}

        {/* ── PROFILE TAB ── */}
        {activeTab === 'profile' && (
          <ProfileTab
            tasks={habits.tasks}
            dayLog={habits.dayLog}
            completions={habits.completions}
            onResetAll={handleResetAll}
          />
        )}
      </div>
    </div>
  );
}
