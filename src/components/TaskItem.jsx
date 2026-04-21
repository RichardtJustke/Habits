import { THEME } from '../constants.js';

export default function TaskItem({ task, isChecked, todayDone, onToggle, onToggleSubtask, onDeleteSubtask, onDelete }) {
  const hasSubtasks = !!(task.subtasks && task.subtasks.length > 0);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: THEME.spacing.md,
        marginBottom: THEME.spacing.lg,
        padding: `${THEME.spacing.md}px ${THEME.spacing.md + 2}px`,
        borderRadius: THEME.radius.md,
        background: isChecked ? '#0a0a0a' : 'transparent',
        transition: 'background 0.2s',
        cursor: hasSubtasks ? 'default' : 'pointer', // se tem subtasks, clica nas subtasks
        position: 'relative',
      }}
      onClick={() => {
        if (!hasSubtasks) onToggle();
      }}
    >
      <span
        style={{
          color: isChecked ? THEME.colors.success : THEME.colors.textTertiary,
          fontSize: 13,
          minWidth: 20,
          marginTop: 1,
        }}
      >
        {isChecked ? '[✓]' : '[ ]'}
      </span>

      <div style={{ flex: 1 }}>
        <span
          style={{
            color: isChecked ? THEME.colors.textSecondary : THEME.colors.text,
            textDecoration: isChecked ? 'line-through' : 'none',
          }}
        >
          {task.name}
        </span>
        {task.note && (
          <div
            style={{
              color: THEME.colors.textMuted,
              fontSize: THEME.typography.fontSizeSmall,
              marginTop: THEME.spacing.sm,
            }}
          >
            {task.note}
          </div>
        )}

        {hasSubtasks && (
          <div style={{ marginTop: THEME.spacing.md, display: 'flex', flexDirection: 'column', gap: THEME.spacing.sm }}>
            {task.subtasks.map((sub) => {
              const isSubDone = todayDone.includes(sub.id);
              return (
                <div
                  key={sub.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: THEME.spacing.md,
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    color: isSubDone ? THEME.colors.textSecondary : THEME.colors.textTertiary,
                    textDecoration: isSubDone ? 'line-through' : 'none',
                    fontSize: 13,
                  }}
                >
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: THEME.spacing.md, flex: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSubtask(sub.id);
                    }}
                  >
                    <span style={{ color: isSubDone ? THEME.colors.success : THEME.colors.border }}>
                      {isSubDone ? '[✓]' : '[ ]'}
                    </span>
                    {sub.name}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSubtask(sub.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: THEME.colors.textMuted,
                      cursor: 'pointer',
                      fontSize: THEME.typography.fontSizeSmall,
                      fontFamily: THEME.typography.fontFamily,
                      padding: 0,
                    }}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: THEME.spacing.md, alignItems: 'center' }}>
        {task.streak > 0 && (
          <span style={{ color: THEME.colors.primary, fontSize: THEME.typography.fontSizeSmall }}>
            🔥{task.streak}
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: THEME.colors.textMuted,
            cursor: 'pointer',
            fontSize: THEME.typography.fontSizeSmall,
            fontFamily: THEME.typography.fontFamily,
            padding: 0,
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
