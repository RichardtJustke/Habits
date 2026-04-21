import { useMemo } from 'react';
import { THEME, BIO_MSGS } from '../constants.js';
import { calculateStats, calculateCurrentStreak } from '../utils/helpers.js';

export default function ProfileTab({ tasks, dayLog, completions, onResetAll }) {
  const stats = calculateStats(dayLog);
  const currentStreak = calculateCurrentStreak(dayLog);

  // Pega uma bio aleatória toda vez que o componente é montado
  const randomBio = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * BIO_MSGS.length);
    return BIO_MSGS[randomIndex];
  }, []);

  return (
    <div>
      <div style={{ marginBottom: THEME.spacing.xl }}>
        <div style={{ fontSize: THEME.typography.fontSize }}>
          <span style={{ color: THEME.colors.primary }}>TuTz</span>
          <span style={{ color: THEME.colors.success }}>@TrackerDay</span>
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
          Richardt Justke (TuTz)
        </div>
        <div style={{ color: THEME.colors.textTertiary, fontSize: 13 }}>
          {randomBio}
        </div>
        <div
          style={{
            marginTop: THEME.spacing.xl,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: THEME.spacing.xl,
          }}
        >
          {[
            { label: 'dias totais', value: stats.totalDays, icon: '📅' },
            { label: 'média %', value: stats.avgPct + '%', icon: '📈' },
            { label: 'sequência', value: currentStreak, icon: '🔥' },
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

      {/* configurações */}
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
          ⚙️ configurações
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
          resetar todos os dados
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
