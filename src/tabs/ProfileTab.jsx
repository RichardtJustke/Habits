import { THEME } from '../constants.js';
import { calculateStats, calculateCurrentStreak } from '../utils/helpers.js';

export default function ProfileTab({ tasks, dayLog, completions, onResetAll }) {
  const stats = calculateStats(dayLog);
  const currentStreak = calculateCurrentStreak(dayLog);

  return (
    <div>
      <div style={{ marginBottom: THEME.spacing.xl }}>
        <div style={{ fontSize: THEME.typography.fontSize }}>
          <span style={{ color: THEME.colors.primary }}>user[pro]</span>
          <span style={{ color: THEME.colors.success }}>@init.Habits</span>
          <span style={{ color: THEME.colors.textSecondary }}> $ profile</span>
        </div>
      </div>

      {/* profile header */}
      <div
        style={{
          padding: THEME.spacing.xl,
          background: THEME.colors.bgSecondary,
          borderRadius: THEME.radius.lg,
          border: `1px solid ${THEME.colors.border}`,
          marginBottom: THEME.spacing.xl,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 700, color: THEME.colors.text, marginBottom: THEME.spacing.sm }}>
          user[pro]
        </div>
        <div style={{ color: THEME.colors.textTertiary, fontSize: 13 }}>// tracking desde o início</div>
        <div
          style={{
            marginTop: THEME.spacing.xl,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: THEME.spacing.xl,
          }}
        >
          {[
            { label: 'total days', value: stats.totalDays, icon: '📅' },
            { label: 'avg %', value: stats.avgPct + '%', icon: '📊' },
            { label: 'streak', value: currentStreak, icon: '🔥' },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                textAlign: 'center',
                padding: THEME.spacing.lg,
                background: THEME.colors.bg,
                borderRadius: THEME.radius.md,
                border: `1px solid ${THEME.colors.border}`,
              }}
            >
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div style={{ color: THEME.colors.primary, fontSize: 20, fontWeight: 700, marginTop: THEME.spacing.md }}>
                {s.value}
              </div>
              <div style={{ color: THEME.colors.textTertiary, fontSize: THEME.typography.fontSizeXSmall }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* config */}
      <div
        style={{
          padding: THEME.spacing.xl,
          background: THEME.colors.bgSecondary,
          borderRadius: THEME.radius.lg,
          border: `1px solid ${THEME.colors.border}`,
          marginBottom: THEME.spacing.xl,
        }}
      >
        <div style={{ color: THEME.colors.text, fontWeight: 700, marginBottom: THEME.spacing.md }}>
          ⚙️ config
        </div>
        <button
          onClick={() => {
            if (window.confirm('Resetar tudo?')) {
              onResetAll();
            }
          }}
          style={{
            display: 'block',
            background: 'none',
            border: `1px solid ${THEME.colors.border}`,
            color: THEME.colors.danger,
            fontFamily: THEME.typography.fontFamily,
            fontSize: 13,
            padding: `${THEME.spacing.md}px ${THEME.spacing.xl}px`,
            borderRadius: THEME.radius.md,
            cursor: 'pointer',
            marginBottom: THEME.spacing.md,
          }}
        >
          reset all data
        </button>
      </div>

      {/* task list */}
      <div
        style={{
          padding: THEME.spacing.xl,
          background: THEME.colors.bgSecondary,
          borderRadius: THEME.radius.lg,
          border: `1px solid ${THEME.colors.border}`,
        }}
      >
        <div style={{ color: THEME.colors.text, fontWeight: 700, marginBottom: THEME.spacing.md }}>
          📋 tarefas ({tasks.length})
        </div>
        {tasks.map((t) => (
          <div
            key={t.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: THEME.typography.fontSizeSmall,
              color: THEME.colors.textTertiary,
              marginBottom: THEME.spacing.md,
              padding: `${THEME.spacing.sm}px 0`,
              borderBottom: `1px solid ${THEME.colors.bgTertiary}`,
            }}
          >
            <span>{t.name}</span>
            <span style={{ color: THEME.colors.textMuted }}>🔥{t.streak}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
