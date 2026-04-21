import { THEME } from '../constants.js';

export default function TerminalOutput({ children, title, type = 'info' }) {
  const colors = {
    info: THEME.colors.success,
    warning: THEME.colors.warning,
    error: THEME.colors.danger,
    accent: THEME.colors.accent,
  };

  const color = colors[type] || colors.info;

  return (
    <div
      style={{
        background: THEME.colors.bgSecondary,
        border: `1px solid ${color}`,
        borderRadius: THEME.radius.md,
        padding: THEME.spacing.lg,
        marginBottom: THEME.spacing.lg,
        fontFamily: THEME.typography.fontFamily,
        fontSize: THEME.typography.fontSize,
      }}
    >
      {title && (
        <div
          style={{
            color: color,
            fontWeight: 'bold',
            marginBottom: THEME.spacing.md,
            textTransform: 'uppercase',
            fontSize: THEME.typography.fontSizeSmall,
            letterSpacing: 1,
          }}
        >
          {'>> '} {title}
        </div>
      )}
      <div style={{ color: THEME.colors.text, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}
