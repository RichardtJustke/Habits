import { useState } from 'react';
import { THEME, GROUPS } from '../constants.js';
import { fmt, genWeekDays, today } from '../utils/helpers.js';
import TerminalHeader from '../components/TerminalHeader.jsx';
import WeekStrip from '../components/WeekStrip.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import TaskGroup from '../components/TaskGroup.jsx';
import AddTaskForm from '../components/AddTaskForm.jsx';
import AddTaskButton from '../components/AddTaskButton.jsx';

export default function HabitsTab({
  rotatingMsg,
  tasks,
  completions,
  dayLog,
  currentStreak,
  onToggle,
  onAddTask,
  onDeleteTask,
  onDeleteSubtask,
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);

  const todayStr = today();
  const weekDays = genWeekDays(todayStr);
  const todayDone = completions[todayStr] || [];
  const todayPct = tasks.length ? Math.round((todayDone.length / tasks.length) * 100) : 0;

  // Group tasks
  const groupedTasks = tasks.reduce((acc, t) => {
    if (!acc[t.group]) {
      acc[t.group] = { label: GROUPS[t.group]?.label || t.group, icon: GROUPS[t.group]?.icon || '📌', tasks: [] };
    }
    acc[t.group].tasks.push(t);
    return acc;
  }, {});

  return (
    <div>
      <TerminalHeader rotatingMsg={rotatingMsg} />

      {/* date + streak */}
      <div style={{ marginBottom: THEME.spacing.xl }}>
        <div
          style={{
            display: 'flex',
            gap: THEME.spacing.md,
            alignItems: 'center',
            color: THEME.colors.textSecondary,
            marginBottom: THEME.spacing.md,
          }}
        >
          <span>📅</span>
          <span style={{ color: THEME.colors.text }}>{fmt(todayStr)}</span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: THEME.spacing.lg,
            alignItems: 'center',
            color: THEME.colors.textSecondary,
          }}
        >
          <span>🔥 {currentStreak} dias</span>
          <span>*</span>
          <span>🛡️ {Object.keys(dayLog).filter((d) => dayLog[d] >= 1).length}</span>
        </div>
      </div>

      {/* week strip */}
      <WeekStrip weekDays={weekDays} dayLog={dayLog} weekOffset={weekOffset} onWeekChange={setWeekOffset} />

      {/* progress */}
      <ProgressBar pct={todayPct} todayDone={todayDone.length} totalTasks={tasks.length} />

      {/* groups */}
      {Object.entries(groupedTasks).map(([groupKey, group]) => (
        <TaskGroup
          key={groupKey}
          group={group}
          tasks={group.tasks}
          todayDone={todayDone}
          onToggle={onToggle}
          onDelete={(taskId, subtaskId) => {
            if (subtaskId) {
              onDeleteSubtask(taskId, subtaskId);
              return;
            }

            onDeleteTask(taskId);
          }}
        />
      ))}

      {/* adicionar tarefa */}
      {showAddForm ? (
        <AddTaskForm onAdd={onAddTask} onCancel={() => setShowAddForm(false)} />
      ) : (
        <AddTaskButton onClick={() => setShowAddForm(true)} />
      )}
    </div>
  );
}
