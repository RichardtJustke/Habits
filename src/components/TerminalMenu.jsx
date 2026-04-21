import { THEME } from '../constants.js';

export default function TerminalMenu({ options, activeOption, onSelect }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: THEME.spacing.md,
        marginBottom: THEME.spacing.xl,
      }}
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          style={{
            padding: `${THEME.spacing.md}px ${THEME.spacing.lg}px`,
            background: activeOption === opt.id ? THEME.colors.bgTertiary : THEME.colors.bgSecondary,
            border: `2px solid ${activeOption === opt.id ? THEME.colors.primary : THEME.colors.border}`,
            color: activeOption === opt.id ? THEME.colors.primary : THEME.colors.text,
            fontFamily: THEME.typography.fontFamily,
            fontSize: THEME.typography.fontSizeSmall,
            cursor: 'pointer',
            borderRadius: THEME.radius.md,
            fontWeight: activeOption === opt.id ? 'bold' : 'normal',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (activeOption !== opt.id) {
              e.target.style.borderColor = THEME.colors.success;
              e.target.style.color = THEME.colors.success;
            }
          }}
          onMouseLeave={(e) => {
            if (activeOption !== opt.id) {
              e.target.style.borderColor = THEME.colors.border;
              e.target.style.color = THEME.colors.text;
            }
          }}
        >
          {opt.icon} {opt.label}
        </button>
      ))}
    </div>
  );
}
