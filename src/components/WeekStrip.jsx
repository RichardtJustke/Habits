import { THEME } from '../constants.js';
import { weekLabel, today, heatColor } from '../utils/helpers.js';

export default function WeekStrip({ weekDays, dayLog, weekOffset, onWeekChange }) {
  const todayStr = today();

  return (
    <div style={{ marginBottom: THEME.spacing.xxxl }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <button
          onClick={() => onWeekChange((w) => w - 1)}
          style={{
            background: 'none',
            border: 'none',
            color: THEME.colors.textTertiary,
            cursor: 'pointer',
            fontSize: 16,
            padding: `0 ${THEME.spacing.lg}px 0 0`,
            fontFamily: THEME.typography.fontFamily,
          }}
        >
          &lt;
        </button>

        <div style={{ display: 'flex', flex: 1, gap: 0 }}>
          {weekDays.map((d) => {
            const isToday = d === todayStr;
            const wd = new Date(d + 'T12:00:00').getDay();
            const dayPct = dayLog[d] ?? 0;

            return (
              <div key={d} style={{ flex: 1, textAlign: 'center' }}>
                <div
                  style={{
                    color: isToday ? THEME.colors.primary : THEME.colors.textTertiary,
                    fontSize: THEME.typography.fontSizeSmall,
                    marginBottom: THEME.spacing.sm,
                  }}
                >
                  {weekLabel[wd].slice(0, 3)}
                </div>
                <div
                  style={{
                    background: isToday ? THEME.colors.primary : 'transparent',
                    color: isToday ? THEME.colors.bg : THEME.colors.textSecondary,
                    borderRadius: THEME.radius.md,
                    padding: '4px 0',
                    fontWeight: isToday ? 700 : 400,
                    fontSize: 13,
                  }}
                >
                  {isToday ? `*${new Date(d + 'T12:00:00').getDate()}` : new Date(d + 'T12:00:00').getDate()}
                </div>
                <div
                  style={{
                    height: 6,
                    margin: `${THEME.spacing.sm}px ${THEME.spacing.md}px 0`,
                    borderRadius: THEME.radius.sm,
                    background: heatColor(dayPct > 0 ? dayPct : dayLog[d] !== undefined ? 0 : null),
                  }}
                />
              </div>
            );
          })}
        </div>

        <button
          onClick={() => onWeekChange((w) => Math.min(w + 1, 0))}
          style={{
            background: 'none',
            border: 'none',
            color: THEME.colors.textTertiary,
            cursor: 'pointer',
            fontSize: 16,
            padding: `0 0 0 ${THEME.spacing.lg}px`,
            fontFamily: THEME.typography.fontFamily,
          }}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
