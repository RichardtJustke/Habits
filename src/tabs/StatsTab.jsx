import { THEME } from '../constants.js';
import { buildHeatmap, calculateCurrentStreak, calculateStats } from '../utils/helpers.js';
import TerminalHeader from '../components/TerminalHeader.jsx';
import HeatMap from '../components/HeatMap.jsx';

export default function StatsTab({ rotatingMsg, tasks, dayLog }) {
  const heatmap = buildHeatmap(dayLog);
  const stats = calculateStats(dayLog);
  const currentStreak = calculateCurrentStreak(dayLog);

  return (
    <div>
      <div style={{ marginBottom: THEME.spacing.xl }}>
        <div style={{ fontSize: THEME.typography.fontSize }}>
          <span style={{ color: THEME.colors.primary }}>TuTz</span>
          <span style={{ color: THEME.colors.success }}>@TrackerDay</span>
          <span style={{ color: THEME.colors.textSecondary }}> $ stats</span>
        </div>
      </div>

      {/* visão rápida */}
      <div
        style={{
          marginBottom: THEME.spacing.xxxl,
          padding: THEME.spacing.xl,
          background: THEME.colors.bgSecondary,
          borderRadius: THEME.radius.lg,
          border: `1px solid ${THEME.colors.border}`,
        }}
      >
        <div style={{ display: 'flex', gap: THEME.spacing.md, marginBottom: THEME.spacing.md }}>
          <span>👁️</span>
          <span style={{ color: THEME.colors.text, fontWeight: 700 }}>visão rápida</span>
        </div>
        <div
          style={{
            color: THEME.colors.textTertiary,
            fontSize: THEME.typography.fontSizeSmall,
            marginBottom: THEME.spacing.lg,
          }}
        >
          // seu resumo de rastreamento
        </div>
        <div style={{ color: THEME.colors.textSecondary, lineHeight: 2, fontSize: 13 }}>
          <div>
            dias rastreados: <span style={{ color: THEME.colors.primary }}>{stats.totalDays}</span>
          </div>
          <div>
            conclusão média: <span style={{ color: THEME.colors.primary }}>{stats.avgPct}%</span>
          </div>
          <div>
            dias perfeitos: <span style={{ color: THEME.colors.primary }}>{stats.perfectDays}</span>
          </div>
          <div>
            sequência atual:{' '}}
            <span style={{ color: currentStreak > 0 ? THEME.colors.primary : THEME.colors.textTertiary }}>
              {currentStreak} days
            </span>
          </div>
        </div>
      </div>

      {/* heatmap */}
      <HeatMap heatmap={heatmap} stats={stats} />

      {/* sequências por tarefa */}
      <div
        style={{
          padding: THEME.spacing.xl,
          background: THEME.colors.bgSecondary,
          borderRadius: THEME.radius.lg,
          border: `1px solid ${THEME.colors.border}`,
        }}
      >
        <div style={{ display: 'flex', gap: THEME.spacing.md, marginBottom: THEME.spacing.sm }}>
          <span>🔥</span>
          <span style={{ color: THEME.colors.text, fontWeight: 700 }}>sequências por tarefa</span>
        </div>
        <div
          style={{
            color: THEME.colors.textTertiary,
            fontSize: THEME.typography.fontSizeSmall,
            marginBottom: THEME.spacing.lg,
          }}
        >
          // dias consecutivos completando cada tarefa
        </div>
        {[...tasks]
          .sort((a, b) => b.streak - a.streak)
          .map((t) => (
            <div
              key={t.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: THEME.spacing.md,
                fontSize: 13,
              }}
            >
              <span style={{ color: THEME.colors.textSecondary }}>
                {t.groupIcon} {t.name}
              </span>
              <div style={{ display: 'flex', gap: THEME.spacing.md, alignItems: 'center' }}>
                <div
                  style={{
                    width: 80,
                    height: 4,
                    background: THEME.colors.bgTertiary,
                    borderRadius: THEME.radius.sm,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, t.streak * 10)}%`,
                      background:
                        t.streak > 7 ? THEME.colors.primary : t.streak > 3 ? THEME.colors.warning : THEME.colors.success,
                      borderRadius: THEME.radius.sm,
                    }}
                  />
                </div>
                <span
                  style={{
                    color: t.streak > 0 ? THEME.colors.primary : THEME.colors.textMuted,
                    minWidth: 40,
                    textAlign: 'right',
                  }}
                >
                  🔥{t.streak}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
