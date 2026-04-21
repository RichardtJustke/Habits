import { THEME } from '../constants.js';
import { heatColor, getMonthLabels } from '../utils/helpers.js';

export default function HeatMap({ heatmap, stats }) {
  const monthLabels = getMonthLabels(heatmap);
  const CELL = 14;
  const GAP = 3;
  const totalWeeks = heatmap.length;
  const svgW = totalWeeks * (CELL + GAP);
  const svgH = 7 * (CELL + GAP) + 20;

  return (
    <div
      style={{
        marginBottom: THEME.spacing.xxxl,
        padding: THEME.spacing.xl,
        background: THEME.colors.bgSecondary,
        borderRadius: THEME.radius.lg,
        border: `1px solid ${THEME.colors.border}`,
      }}
    >
      <div style={{ display: 'flex', gap: THEME.spacing.md, marginBottom: THEME.spacing.sm }}>
        <span>📅</span>
        <span style={{ color: THEME.colors.text, fontWeight: 700 }}>contribuições</span>
      </div>
      <div
        style={{
          color: THEME.colors.textTertiary,
          fontSize: THEME.typography.fontSizeSmall,
          marginBottom: THEME.spacing.lg,
        }}
      >
        // sua atividade no último ano
      </div>

      <div style={{ overflowX: 'auto' }}>
        <svg width={svgW + 20} height={svgH + 4} style={{ display: 'block' }}>
          {/* rótulos de mês */}
          {monthLabels.map(({ wi, label }) => (
            <text
              key={wi}
              x={wi * (CELL + GAP) + 2}
              y={12}
              fill={THEME.colors.textTertiary}
              fontSize={10}
              fontFamily="monospace"
            >
              {label}
            </text>
          ))}

          {/* cells */}
          {heatmap.map((week) =>
            week.map((day) => (
              <rect
                key={day.date}
                x={week.indexOf(day) * (CELL + GAP)}
                y={heatmap.indexOf(week) * (CELL + GAP) + 20}
                width={CELL}
                height={CELL}
                rx={2}
                fill={day.future ? 'transparent' : heatColor(day.pct)}
                opacity={day.future ? 0 : 1}
              >
                <title>
                  {day.date}: {day.pct !== null ? Math.round(day.pct * 100) + '%' : 'sem dados'}
                </title>
              </rect>
            ))
          )}
        </svg>
      </div>

      {/* legenda */}
      <div
        style={{
          display: 'flex',
          gap: THEME.spacing.md,
          alignItems: 'center',
          marginTop: THEME.spacing.md,
          fontSize: THEME.typography.fontSizeXSmall,
          color: THEME.colors.textTertiary,
        }}
      >
        <span>// menos</span>
        {[null, 0.1, 0.3, 0.6, 1].map((v, i) => (
          <div
            key={i}
            style={{
              width: 11,
              height: 11,
              borderRadius: THEME.radius.sm,
              background: heatColor(v),
              border: v === null ? `1px solid ${THEME.colors.border}` : 'none',
            }}
          />
        ))}
        <span>mais</span>
      </div>

      <div
        style={{
          color: THEME.colors.textTertiary,
          fontSize: THEME.typography.fontSizeXSmall,
          marginTop: THEME.spacing.md,
        }}
      >
        // {stats.totalDays} dias · {stats.avgPct}% média · {stats.perfectDays} dias perfeitos
      </div>
    </div>
  );
}
