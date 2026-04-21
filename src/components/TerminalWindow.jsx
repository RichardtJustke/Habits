import { THEME } from '../constants.js';

export default function TerminalWindow({ children, title = 'RASTREADOR DE HÁBITOS v1.0' }) {
  return (
    <div
      style={{
        background: THEME.colors.bg,
        border: `2px solid ${THEME.colors.accent}`,
        borderRadius: THEME.radius.lg,
        overflow: 'hidden',
        boxShadow: `0 0 20px ${THEME.colors.accent}30`,
      }}
    >
      {/* Cabeçalho */}
      <div
        style={{
          background: THEME.colors.bgSecondary,
          borderBottom: `1px solid ${THEME.colors.accent}`,
          padding: `${THEME.spacing.md}px ${THEME.spacing.lg}px`,
          display: 'flex',
          alignItems: 'center',
          gap: THEME.spacing.md,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: THEME.spacing.sm,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: THEME.colors.danger,
            }}
          />
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: THEME.colors.warning,
            }}
          />
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: THEME.colors.primary,
            }}
          />
        </div>
        <span
          style={{
            color: THEME.colors.accent,
            fontSize: THEME.typography.fontSizeSmall,
            fontWeight: 'bold',
            flex: 1,
            letterSpacing: 1,
          }}
        >
          ❯ {title}
        </span>
      </div>

      {/* Conteúdo */}
      <div
        style={{
          padding: THEME.spacing.xl,
          minHeight: '500px',
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto',
        }}
      >
        {children}
      </div>

      {/* Rodapé */}
      <div
        style={{
          borderTop: `1px solid ${THEME.colors.border}`,
          padding: `${THEME.spacing.md}px ${THEME.spacing.lg}px`,
          background: THEME.colors.bgSecondary,
          fontSize: THEME.typography.fontSizeXSmall,
          color: THEME.colors.textTertiary,
          textAlign: 'right',
        }}
      >
        {new Date().toLocaleString('pt-BR')}
      </div>
    </div>
  );
}
