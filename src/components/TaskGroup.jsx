import { THEME } from '../constants.js';
import TaskItem from './TaskItem.jsx';

export default function TaskGroup({ group, tasks, todayDone, onToggle, onDelete }) {
  const done = tasks.filter((t) => todayDone.includes(t.id)).length;

  return (
    <div style={{ marginBottom: THEME.spacing.xxxl }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: THEME.spacing.md,
          paddingBottom: THEME.spacing.md,
          borderBottom: `1px solid ${THEME.colors.borderLight}`,
        }}
      >
        <div style={{ display: 'flex', gap: THEME.spacing.md }}>
          <span>{group.icon}</span>
          <span style={{ color: THEME.colors.primary, fontWeight: 700 }}>{group.label}</span>
        </div>
        <span style={{ color: THEME.colors.textTertiary, fontSize: THEME.typography.fontSizeSmall }}>
          [{done}/{tasks.length}]
        </span>
      </div>

      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isChecked={todayDone.includes(task.id)}
          onToggle={() => onToggle(task.id)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </div>
  );
}
