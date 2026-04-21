import { THEME } from '../constants.js';

export default function TaskItem({ task, isChecked, onToggle, onDelete }) {
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
        cursor: 'pointer',
        position: 'relative',
      }}
      onClick={onToggle}
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
