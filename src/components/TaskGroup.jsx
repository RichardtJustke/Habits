import { THEME } from '../constants.js';
import TaskItem from './TaskItem.jsx';
import { isTaskComplete } from '../utils/helpers.js';

export default function TaskGroup({ group, tasks, todayDone, onToggle, onDelete }) {
  const done = tasks.filter((t) => isTaskComplete(t, todayDone)).length;

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
          isChecked={isTaskComplete(task, todayDone)}
          todayDone={todayDone}
          onToggle={() => {
            // se tiver subtasks a gente n deveria deixar completar a pai com click, 
            // mas é a vontade do cliente. Se clicar na pai, nao marca subtasks diretamente pq
            // toggle so lida com ID. 
            // Para não quebrar algo, permitimos apenas toggle no botao. 
            onToggle(task.id);
          }}
          onToggleSubtask={(subId) => onToggle(subId)}
          onDeleteSubtask={(subId) => onDelete(task.id, subId)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </div>
  );
}
