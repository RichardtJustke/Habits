import { THEME } from '../constants.js';

export default function FlashMessage({ message }) {
  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: THEME.spacing.xl,
        right: THEME.spacing.max,
        background: '#1a2a1a',
        border: `1px solid ${THEME.colors.success}`,
        color: THEME.colors.success,
        padding: `${THEME.spacing.md}px ${THEME.spacing.xl}px`,
        borderRadius: THEME.radius.md,
        fontSize: THEME.typography.fontSizeSmall,
        zIndex: 999,
        fontFamily: THEME.typography.fontFamily,
      }}
    >
      {message}
    </div>
  );
}
