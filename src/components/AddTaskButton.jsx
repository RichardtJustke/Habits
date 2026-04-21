import { THEME } from '../constants.js';

export default function AddTaskButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: `1px dashed ${THEME.colors.border}`,
        color: THEME.colors.textMuted,
        width: '100%',
        padding: THEME.spacing.lg,
        borderRadius: THEME.radius.lg,
        cursor: 'pointer',
        fontFamily: THEME.typography.fontFamily,
        fontSize: 13,
        marginTop: THEME.spacing.md,
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.target.style.color = THEME.colors.success;
        e.target.style.borderColor = THEME.colors.success;
      }}
      onMouseLeave={(e) => {
        e.target.style.color = THEME.colors.textMuted;
        e.target.style.borderColor = THEME.colors.border;
      }}
    >
      + nova tarefa
    </button>
  );
}
