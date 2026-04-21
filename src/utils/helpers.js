// ── DATE HELPERS ──────────────────────────────────────────────────────────────
export const today = () => new Date().toISOString().slice(0, 10);

export const fmt = (d) => {
  const dt = new Date(d + 'T12:00:00');
  return dt.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const weekLabel = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
export const shortWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function genWeekDays(anchor) {
  const d = new Date(anchor + 'T12:00:00');
  const dow = d.getDay(); // 0=Sun
  const days = [];
  for (let i = 0; i < 7; i++) {
    const dd = new Date(d);
    dd.setDate(d.getDate() - dow + i);
    days.push(dd.toISOString().slice(0, 10));
  }
  return days;
}

// ── HEATMAP BUILDER ────────────────────────────────────────────────────────────
export function buildHeatmap(log) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 364);
  const weeks = [];
  const cur = new Date(start);
  cur.setDate(cur.getDate() - cur.getDay()); // align to Sunday
  while (cur <= end) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const k = cur.toISOString().slice(0, 10);
      week.push({ date: k, pct: log[k] ?? null, future: cur > end });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

// ── PROGRESS BAR ───────────────────────────────────────────────────────────────
export function buildProgressBar(pct, length = 30) {
  const filled = Math.round((pct / 100) * length);
  return '█'.repeat(filled) + '░'.repeat(length - filled);
}

// ── HEAT COLOR MAPPING ────────────────────────────────────────────────────────
export function heatColor(pct) {
  if (pct === null) return '#1a1d2e';
  if (pct === 0) return '#1a1d2e';
  if (pct < 0.25) return '#1e3a1e';
  if (pct < 0.5) return '#2d6a2d';
  if (pct < 0.75) return '#3d9e3d';
  return '#4ade80';
}

// ── STREAK CALCULATION ────────────────────────────────────────────────────────
export function calculateCurrentStreak(dayLog) {
  let currentStreak = 0;
  const d = new Date();
  while (true) {
    const k = d.toISOString().slice(0, 10);
    if (dayLog[k] && dayLog[k] > 0) {
      currentStreak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return currentStreak;
}

// ── STATS CALCULATION ──────────────────────────────────────────────────────────
export function calculateStats(dayLog) {
  const allDays = Object.keys(dayLog);
  const totalDays = allDays.length;
  const avgPct = totalDays
    ? Math.round((allDays.reduce((s, d) => s + dayLog[d], 0) / totalDays) * 100)
    : 0;
  const perfectDays = allDays.filter((d) => dayLog[d] >= 1).length;

  return { totalDays, avgPct, perfectDays };
}

// ── MONTH LABELS FOR HEATMAP ──────────────────────────────────────────────────
export function getMonthLabels(heatmap) {
  const labels = [];
  let lastMonth = -1;
  heatmap.forEach((week, wi) => {
    const firstDay = week.find((d) => !d.future);
    if (!firstDay) return;
    const m = new Date(firstDay.date + 'T12:00:00').getMonth();
    if (m !== lastMonth) {
      labels.push({
        wi,
        label: new Date(firstDay.date + 'T12:00:00').toLocaleDateString('pt-BR', {
          month: 'short',
        }),
      });
      lastMonth = m;
    }
  });
  return labels;
}

// ── ROTATING MESSAGE ───────────────────────────────────────────────────────────
export function getRotatingMessage(messages) {
  return messages[Math.floor(Date.now() / 60000) % messages.length];
}
