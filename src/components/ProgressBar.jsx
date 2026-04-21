import { THEME } from '../constants.js';
import { buildProgressBar } from '../utils/helpers.js';

export default function ProgressBar({ pct, todayDone, totalTasks }) {
  const bar = buildProgressBar(pct);
  const barColor = pct >= 100 ? THEME.colors.success : pct > 50 ? THEME.colors.primary : THEME.colors.danger;

  return (
    <div
      style={{
        marginBottom: THEME.spacing.xxxl,
        padding: `${THEME.spacing.lg}px ${THEME.spacing.xl}px`,
        background: THEME.colors.bgSecondary,
        borderLeft: `3px solid ${barColor}`,
        borderRadius: THEME.radius.md,
        border: `1px solid ${THEME.colors.border}`,
        borderLeftWidth: '3px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: THEME.colors.textTertiary,
          fontSize: THEME.typography.fontSizeSmall,
          marginBottom: THEME.spacing.md,
        }}
      >
        <span>// progresso hoje</span>
        <span style={{ color: barColor }}>{pct}%</span>
      </div>
      <div
        style={{
          fontFamily: THEME.typography.fontFamily,
          fontSize: THEME.typography.fontSizeXSmall,
          color: barColor,
          letterSpacing: 1,
        }}
      >
        [{bar}]
      </div>
      <div
        style={{
          color: THEME.colors.textMuted,
          fontSize: THEME.typography.fontSizeXSmall,
          marginTop: THEME.spacing.sm,
        }}
      >
        // {todayDone}/{totalTasks} tarefas
      </div>
    </div>
  );
}
