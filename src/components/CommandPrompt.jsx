import { THEME } from '../constants.js';

export default function CommandPrompt({ command, onCommandChange, onCommandSubmit, placeholder = 'digite o comando...' }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onCommandSubmit();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: THEME.spacing.md,
        padding: `${THEME.spacing.md}px ${THEME.spacing.lg}px`,
        background: THEME.colors.bgSecondary,
        border: `1px solid ${THEME.colors.border}`,
        borderRadius: THEME.radius.md,
        marginBottom: THEME.spacing.lg,
      }}
    >
      <span style={{ color: THEME.colors.accent, fontWeight: 'bold', fontSize: 12 }}>$</span>
      <input
        type="text"
        value={command}
        onChange={(e) => onCommandChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          color: THEME.colors.text,
          fontFamily: THEME.typography.fontFamily,
          fontSize: THEME.typography.fontSize,
          outline: 'none',
          caretColor: THEME.colors.primary,
        }}
      />
      <span style={{ color: THEME.colors.textTertiary, fontSize: 10 }}>↵</span>
    </div>
  );
}
