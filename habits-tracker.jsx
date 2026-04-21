import { useState, useEffect, useCallback } from "react";

// ── helpers ──────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().slice(0, 10);
const fmt = (d) => {
  const dt = new Date(d + "T12:00:00");
  return dt.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};
const weekLabel = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const shortWeek = ["S", "M", "T", "W", "T", "F", "S"];

function genWeekDays(anchor) {
  const d = new Date(anchor + "T12:00:00");
  const dow = d.getDay(); // 0=Sun
  const days = [];
  for (let i = 0; i < 7; i++) {
    const dd = new Date(d);
    dd.setDate(d.getDate() - dow + i);
    days.push(dd.toISOString().slice(0, 10));
  }
  return days;
}

function buildHeatmap(log) {
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

const ROTATING_MSGS = [
  "task list loaded. enthusiasm not included.",
  "git commit -m 'got things done'",
  "initializing productivity daemon...",
  "// TODO: change the world",
  "no tests failing. yet.",
  "pushing to main. no regrets.",
  "rm -rf procrastination",
  "merge conflict: brain vs to-do list",
];

const ICONS = {
  morning: "🌅", deepwork: "💻", health: "💪", evening: "🌙",
  learning: "📚", default: "📌",
};

const DEFAULT_TASKS = [
  { id: "t1", group: "morning", groupLabel: "Morning", groupIcon: "🌅", name: "Acordar cedo", note: "// sem snooze", streak: 0 },
  { id: "t2", group: "morning", groupLabel: "Morning", groupIcon: "🌅", name: "Meditação", note: "// 10 min", streak: 0 },
  { id: "t3", group: "deepwork", groupLabel: "Deep Work", groupIcon: "💻", name: "Bloco de foco", note: "// 90 min", streak: 0 },
  { id: "t4", group: "deepwork", groupLabel: "Deep Work", groupIcon: "💻", name: "Inbox zero", note: "", streak: 0 },
  { id: "t5", group: "health", groupLabel: "Saúde", groupIcon: "💪", name: "Exercício", note: "// 30 min", streak: 0 },
  { id: "t6", group: "evening", groupLabel: "Wind Down", groupIcon: "🌙", name: "Leitura", note: "// 30 min", streak: 0 },
];

// ── storage helpers ──────────────────────────────────────────────────────────
async function loadState() {
  try {
    const r = await window.storage.get("habits:state");
    if (r) return JSON.parse(r.value);
  } catch (_) {}
  return null;
}
async function saveState(s) {
  try { await window.storage.set("habits:state", JSON.stringify(s)); } catch (_) {}
}

// ── main app ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("habits");
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [completions, setCompletions] = useState({}); // { "2024-01-01": ["t1","t3"] }
  const [dayLog, setDayLog] = useState({});           // { "2024-01-01": 0.75 }
  const [weekOffset, setWeekOffset] = useState(0);
  const [newTask, setNewTask] = useState(null);
  const [newGroup, setNewGroup] = useState("morning");
  const [newName, setNewName] = useState("");
  const [newNote, setNewNote] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [flashMsg, setFlashMsg] = useState("");

  const rotMsg = ROTATING_MSGS[Math.floor(Date.now() / 60000) % ROTATING_MSGS.length];

  // load
  useEffect(() => {
    loadState().then((s) => {
      if (s) {
        setTasks(s.tasks || DEFAULT_TASKS);
        setCompletions(s.completions || {});
        setDayLog(s.dayLog || {});
      }
      setLoaded(true);
    });
  }, []);

  // save on change
  useEffect(() => {
    if (!loaded) return;
    saveState({ tasks, completions, dayLog });
  }, [tasks, completions, dayLog, loaded]);

  const anchorDate = useCallback(() => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 7);
    return d.toISOString().slice(0, 10);
  }, [weekOffset]);

  const weekDays = genWeekDays(anchorDate());
  const selectedDay = weekOffset === 0 ? today() : weekDays[3]; // today or midweek

  const todayDone = completions[today()] || [];
  const todayPct = tasks.length ? todayDone.length / tasks.length : 0;

  // toggle completion
  const toggle = (taskId) => {
    const td = today();
    setCompletions((prev) => {
      const cur = prev[td] || [];
      const next = cur.includes(taskId) ? cur.filter((x) => x !== taskId) : [...cur, taskId];
      const pct = tasks.length ? next.length / tasks.length : 0;
      setDayLog((dl) => ({ ...dl, [td]: pct }));
      // streak update
      setTasks((ts) =>
        ts.map((t) => {
          if (t.id !== taskId) return t;
          if (!cur.includes(taskId)) {
            // being checked — increment streak if yesterday was also done
            const yest = new Date(td);
            yest.setDate(yest.getDate() - 1);
            const yk = yest.toISOString().slice(0, 10);
            const wasYest = (prev[yk] || []).includes(taskId);
            return { ...t, streak: wasYest ? t.streak + 1 : 1 };
          }
          return { ...t, streak: Math.max(0, t.streak - 1) };
        })
      );
      return { ...prev, [td]: next };
    });
    setFlashMsg("committed ✓");
    setTimeout(() => setFlashMsg(""), 1200);
  };

  // add task
  const addTask = () => {
    if (!newName.trim()) return;
    const id = "t" + Date.now();
    const groupMeta = { morning: { label: "Morning", icon: "🌅" }, deepwork: { label: "Deep Work", icon: "💻" }, health: { label: "Saúde", icon: "💪" }, evening: { label: "Wind Down", icon: "🌙" }, learning: { label: "Learning", icon: "📚" } };
    const gm = groupMeta[newGroup] || { label: newGroup, icon: "📌" };
    setTasks((t) => [...t, { id, group: newGroup, groupLabel: gm.label, groupIcon: gm.icon, name: newName.trim(), note: newNote.trim() ? `// ${newNote.trim()}` : "", streak: 0 }]);
    setNewTask(null);
    setNewName("");
    setNewNote("");
  };

  const deleteTask = (id) => setTasks((t) => t.filter((x) => x.id !== id));

  // group tasks
  const groups = tasks.reduce((acc, t) => {
    if (!acc[t.group]) acc[t.group] = { label: t.groupLabel, icon: t.groupIcon, tasks: [] };
    acc[t.group].tasks.push(t);
    return acc;
  }, {});

  // heatmap
  const heatmap = buildHeatmap(dayLog);

  // stats
  const allDays = Object.keys(dayLog);
  const totalDays = allDays.length;
  const avgPct = totalDays ? Math.round(allDays.reduce((s, d) => s + dayLog[d], 0) / totalDays * 100) : 0;
  const perfectDays = allDays.filter((d) => dayLog[d] >= 1).length;

  // streak calc
  let currentStreak = 0;
  {
    const d = new Date();
    while (true) {
      const k = d.toISOString().slice(0, 10);
      if (dayLog[k] && dayLog[k] > 0) { currentStreak++; d.setDate(d.getDate() - 1); }
      else break;
    }
  }

  const pct = Math.round(todayPct * 100);
  const barLen = 30;
  const filled = Math.round((pct / 100) * barLen);
  const progressBar = "█".repeat(filled) + "░".repeat(barLen - filled);

  const heatColor = (pct) => {
    if (pct === null) return "#1a1d2e";
    if (pct === 0) return "#1a1d2e";
    if (pct < 0.25) return "#1e3a1e";
    if (pct < 0.5) return "#2d6a2d";
    if (pct < 0.75) return "#3d9e3d";
    return "#4ade80";
  };

  // months label for heatmap
  const monthLabels = () => {
    const labels = [];
    let lastMonth = -1;
    heatmap.forEach((week, wi) => {
      const firstDay = week.find((d) => !d.future);
      if (!firstDay) return;
      const m = new Date(firstDay.date + "T12:00:00").getMonth();
      if (m !== lastMonth) {
        labels.push({ wi, label: new Date(firstDay.date + "T12:00:00").toLocaleDateString("pt-BR", { month: "short" }) });
        lastMonth = m;
      }
    });
    return labels;
  };

  const CELL = 14;
  const GAP = 3;
  const totalWeeks = heatmap.length;
  const svgW = totalWeeks * (CELL + GAP);
  const svgH = 7 * (CELL + GAP) + 20; // +20 for month labels

  return (
    <div style={{ minHeight: "100vh", background: "#0d0f1a", color: "#c9d1d9", fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace", fontSize: 14 }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap" rel="stylesheet" />

      {/* flash */}
      {flashMsg && (
        <div style={{ position: "fixed", top: 16, right: 24, background: "#1a2a1a", border: "1px solid #4ade80", color: "#4ade80", padding: "6px 16px", borderRadius: 4, fontSize: 12, zIndex: 999, fontFamily: "inherit" }}>
          {flashMsg}
        </div>
      )}

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* TABS */}
        <div style={{ display: "flex", gap: 32, borderBottom: "1px solid #21262d", paddingTop: 20, marginBottom: 28 }}>
          {["habits", "stats", "profile"].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", color: tab === t ? "#f0b429" : "#556", fontFamily: "inherit", fontSize: 15, fontWeight: tab === t ? 700 : 400, cursor: "pointer", paddingBottom: 12, borderBottom: tab === t ? "2px solid #f0b429" : "2px solid transparent", letterSpacing: 0.5 }}>
              {t}
            </button>
          ))}
        </div>

        {/* ── HABITS TAB ── */}
        {tab === "habits" && (
          <div>
            {/* terminal header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14 }}>
                <span style={{ color: "#f0b429" }}>user[pro]</span>
                <span style={{ color: "#4ade80" }}>@init.Habits</span>
                <span style={{ color: "#8b949e" }}> $ daily</span>
              </div>
              <div style={{ color: "#556", marginTop: 4 }}>{rotMsg}</div>
            </div>

            {/* date + streak */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#8b949e", marginBottom: 6 }}>
                <span>📅</span>
                <span style={{ color: "#e6edf3" }}>{fmt(today())}</span>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", color: "#8b949e" }}>
                <span>🔥 {currentStreak} days</span>
                <span>*</span>
                <span>🛡️ {perfectDays}</span>
              </div>
            </div>

            {/* week strip */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <button onClick={() => setWeekOffset((w) => w - 1)} style={{ background: "none", border: "none", color: "#556", cursor: "pointer", fontSize: 16, padding: "0 12px 0 0", fontFamily: "inherit" }}>&lt;</button>
                <div style={{ display: "flex", flex: 1, gap: 0 }}>
                  {weekDays.map((d) => {
                    const isToday = d === today();
                    const wd = new Date(d + "T12:00:00").getDay();
                    const dayPct = dayLog[d] ?? 0;
                    return (
                      <div key={d} style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ color: isToday ? "#f0b429" : "#556", fontSize: 12, marginBottom: 4 }}>{weekLabel[wd].slice(0, 3)}</div>
                        <div style={{ background: isToday ? "#f0b429" : "transparent", color: isToday ? "#0d0f1a" : "#8b949e", borderRadius: 4, padding: "4px 0", fontWeight: isToday ? 700 : 400, fontSize: 13 }}>
                          {isToday ? `*${new Date(d + "T12:00:00").getDate()}` : new Date(d + "T12:00:00").getDate()}
                        </div>
                        <div style={{ height: 6, margin: "4px 6px 0", borderRadius: 2, background: heatColor(dayPct > 0 ? dayPct : dayLog[d] !== undefined ? 0 : null) }} />
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => setWeekOffset((w) => Math.min(w + 1, 0))} style={{ background: "none", border: "none", color: "#556", cursor: "pointer", fontSize: 16, padding: "0 0 0 12px", fontFamily: "inherit" }}>&gt;</button>
              </div>
            </div>

            {/* progress */}
            <div style={{ marginBottom: 24, padding: "12px 16px", background: "#11131f", borderRadius: 6, border: "1px solid #21262d" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#556", fontSize: 12, marginBottom: 6 }}>
                <span>// progresso hoje</span>
                <span style={{ color: pct >= 100 ? "#4ade80" : pct > 50 ? "#f0b429" : "#e06c75" }}>{pct}%</span>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: pct >= 100 ? "#4ade80" : pct > 50 ? "#f0b429" : "#556", letterSpacing: 1 }}>[{progressBar}]</div>
              <div style={{ color: "#334", fontSize: 11, marginTop: 4 }}>// {todayDone.length}/{tasks.length} tarefas</div>
            </div>

            {/* groups */}
            {Object.entries(groups).map(([gk, g]) => {
              const done = g.tasks.filter((t) => todayDone.includes(t.id)).length;
              return (
                <div key={gk} style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid #1e2230" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span>{g.icon}</span>
                      <span style={{ color: "#f0b429", fontWeight: 700 }}>{g.label}</span>
                    </div>
                    <span style={{ color: "#556", fontSize: 12 }}>[{done}/{g.tasks.length}]</span>
                  </div>
                  {g.tasks.map((t) => {
                    const checked = todayDone.includes(t.id);
                    return (
                      <div key={t.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10, padding: "8px 10px", borderRadius: 4, background: checked ? "#111820" : "transparent", transition: "background 0.2s", cursor: "pointer", position: "relative" }}
                        onClick={() => toggle(t.id)}>
                        <span style={{ color: checked ? "#4ade80" : "#556", fontSize: 13, minWidth: 20, marginTop: 1 }}>{checked ? "[✓]" : "[ ]"}</span>
                        <div style={{ flex: 1 }}>
                          <span style={{ color: checked ? "#8b949e" : "#e6edf3", textDecoration: checked ? "line-through" : "none" }}>{t.name}</span>
                          {t.note && <div style={{ color: "#334", fontSize: 12, marginTop: 2 }}>{t.note}</div>}
                        </div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          {t.streak > 0 && <span style={{ color: "#f0b429", fontSize: 12 }}>🔥{t.streak}</span>}
                          <button onClick={(e) => { e.stopPropagation(); deleteTask(t.id); }} style={{ background: "none", border: "none", color: "#223", cursor: "pointer", fontSize: 12, fontFamily: "inherit", padding: 0 }}>✕</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* add task */}
            {newTask ? (
              <div style={{ border: "1px solid #21262d", borderRadius: 6, padding: 16, marginTop: 16, background: "#11131f" }}>
                <div style={{ color: "#4ade80", marginBottom: 12, fontSize: 13 }}>$ habit --new</div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ color: "#556", fontSize: 11, marginBottom: 4 }}>// nome da tarefa</div>
                  <input value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} placeholder="nome..." style={{ background: "#0d0f1a", border: "1px solid #21262d", color: "#e6edf3", padding: "6px 10px", borderRadius: 4, fontFamily: "inherit", fontSize: 13, width: "100%", outline: "none" }} />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ color: "#556", fontSize: 11, marginBottom: 4 }}>// nota opcional</div>
                  <input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="nota..." style={{ background: "#0d0f1a", border: "1px solid #21262d", color: "#e6edf3", padding: "6px 10px", borderRadius: 4, fontFamily: "inherit", fontSize: 13, width: "100%", outline: "none" }} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ color: "#556", fontSize: 11, marginBottom: 4 }}>// grupo</div>
                  <select value={newGroup} onChange={(e) => setNewGroup(e.target.value)} style={{ background: "#0d0f1a", border: "1px solid #21262d", color: "#e6edf3", padding: "6px 10px", borderRadius: 4, fontFamily: "inherit", fontSize: 13, outline: "none" }}>
                    <option value="morning">🌅 Morning</option>
                    <option value="deepwork">💻 Deep Work</option>
                    <option value="health">💪 Saúde</option>
                    <option value="evening">🌙 Wind Down</option>
                    <option value="learning">📚 Learning</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={addTask} style={{ background: "#f0b429", color: "#0d0f1a", border: "none", padding: "7px 18px", borderRadius: 4, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13 }}>[save]</button>
                  <button onClick={() => setNewTask(null)} style={{ background: "none", border: "1px solid #21262d", color: "#556", padding: "7px 18px", borderRadius: 4, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>[cancel]</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setNewTask(true)} style={{ background: "none", border: "1px dashed #21262d", color: "#334", width: "100%", padding: "12px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 13, marginTop: 8, transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.target.style.color = "#4ade80"; e.target.style.borderColor = "#4ade80"; }}
                onMouseLeave={(e) => { e.target.style.color = "#334"; e.target.style.borderColor = "#21262d"; }}>
                + nova tarefa
              </button>
            )}
          </div>
        )}

        {/* ── STATS TAB ── */}
        {tab === "stats" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14 }}>
                <span style={{ color: "#f0b429" }}>user[pro]</span>
                <span style={{ color: "#4ade80" }}>@init.Habits</span>
                <span style={{ color: "#8b949e" }}> $ stats</span>
              </div>
            </div>

            {/* quick glance */}
            <div style={{ marginBottom: 24, padding: "16px", background: "#11131f", borderRadius: 6, border: "1px solid #21262d" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span>👁️</span>
                <span style={{ color: "#e6edf3", fontWeight: 700 }}>quick glance</span>
              </div>
              <div style={{ color: "#556", fontSize: 12, marginBottom: 10 }}>// seu resumo de rastreamento</div>
              <div style={{ color: "#8b949e", lineHeight: 2, fontSize: 13 }}>
                <div>days tracked: <span style={{ color: "#f0b429" }}>{totalDays}</span></div>
                <div>avg completion: <span style={{ color: "#f0b429" }}>{avgPct}%</span></div>
                <div>perfect days: <span style={{ color: "#f0b429" }}>{perfectDays}</span></div>
                <div>current streak: <span style={{ color: currentStreak > 0 ? "#f0b429" : "#556" }}>{currentStreak} days</span></div>
              </div>
            </div>

            {/* heatmap */}
            <div style={{ marginBottom: 24, padding: "16px", background: "#11131f", borderRadius: 6, border: "1px solid #21262d" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                <span>📅</span>
                <span style={{ color: "#e6edf3", fontWeight: 700 }}>contributions</span>
              </div>
              <div style={{ color: "#556", fontSize: 12, marginBottom: 14 }}>// sua atividade no último ano</div>

              <div style={{ overflowX: "auto" }}>
                <svg width={svgW + 20} height={svgH + 4} style={{ display: "block" }}>
                  {/* month labels */}
                  {monthLabels().map(({ wi, label }) => (
                    <text key={wi} x={wi * (CELL + GAP) + 2} y={12} fill="#556" fontSize={10} fontFamily="monospace">{label}</text>
                  ))}
                  {/* cells */}
                  {heatmap.map((week, wi) =>
                    week.map((day, di) => (
                      <rect key={day.date} x={wi * (CELL + GAP)} y={20 + di * (CELL + GAP)} width={CELL} height={CELL} rx={2} fill={day.future ? "transparent" : heatColor(day.pct)} opacity={day.future ? 0 : 1}>
                        <title>{day.date}: {day.pct !== null ? Math.round(day.pct * 100) + "%" : "sem dados"}</title>
                      </rect>
                    ))
                  )}
                </svg>
              </div>

              {/* legend */}
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 8, fontSize: 11, color: "#556" }}>
                <span>// menos</span>
                {[null, 0.1, 0.3, 0.6, 1].map((v, i) => (
                  <div key={i} style={{ width: 11, height: 11, borderRadius: 2, background: heatColor(v), border: v === null ? "1px solid #21262d" : "none" }} />
                ))}
                <span>mais</span>
              </div>
              <div style={{ color: "#556", fontSize: 11, marginTop: 6 }}>
                // {totalDays} dias · {avgPct}% média · {perfectDays} dias perfeitos
              </div>
            </div>

            {/* per-task streaks */}
            <div style={{ padding: "16px", background: "#11131f", borderRadius: 6, border: "1px solid #21262d" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                <span>🔥</span>
                <span style={{ color: "#e6edf3", fontWeight: 700 }}>streaks por tarefa</span>
              </div>
              <div style={{ color: "#556", fontSize: 12, marginBottom: 12 }}>// dias consecutivos completando cada tarefa</div>
              {[...tasks].sort((a, b) => b.streak - a.streak).map((t) => (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: "#8b949e" }}>{t.groupIcon} {t.name}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ width: 80, height: 4, background: "#1a1d2e", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min(100, t.streak * 10)}%`, background: t.streak > 7 ? "#f0b429" : t.streak > 3 ? "#d97706" : "#4ade80", borderRadius: 2 }} />
                    </div>
                    <span style={{ color: t.streak > 0 ? "#f0b429" : "#334", minWidth: 40, textAlign: "right" }}>🔥{t.streak}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {tab === "profile" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14 }}>
                <span style={{ color: "#f0b429" }}>user[pro]</span>
                <span style={{ color: "#4ade80" }}>@init.Habits</span>
                <span style={{ color: "#8b949e" }}> $ profile</span>
              </div>
            </div>

            <div style={{ padding: "20px", background: "#11131f", borderRadius: 6, border: "1px solid #21262d", marginBottom: 16 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#e6edf3", marginBottom: 4 }}>user[pro]</div>
              <div style={{ color: "#556", fontSize: 13 }}>// tracking desde o início</div>
              <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                  { label: "total days", value: totalDays, icon: "📅" },
                  { label: "avg %", value: avgPct + "%", icon: "📊" },
                  { label: "streak", value: currentStreak, icon: "🔥" },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: "center", padding: "12px", background: "#0d0f1a", borderRadius: 4, border: "1px solid #21262d" }}>
                    <div style={{ fontSize: 20 }}>{s.icon}</div>
                    <div style={{ color: "#f0b429", fontSize: 20, fontWeight: 700, marginTop: 4 }}>{s.value}</div>
                    <div style={{ color: "#556", fontSize: 11 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "16px", background: "#11131f", borderRadius: 6, border: "1px solid #21262d", marginBottom: 16 }}>
              <div style={{ color: "#e6edf3", fontWeight: 700, marginBottom: 10 }}>⚙️ config</div>
              {[
                { label: "reset all data", color: "#e06c75", action: () => { if (window.confirm("Resetar tudo?")) { setTasks(DEFAULT_TASKS); setCompletions({}); setDayLog({}); } } },
              ].map((item) => (
                <button key={item.label} onClick={item.action} style={{ display: "block", background: "none", border: "1px solid #21262d", color: item.color, fontFamily: "inherit", fontSize: 13, padding: "8px 16px", borderRadius: 4, cursor: "pointer", marginBottom: 8 }}>
                  {item.label}
                </button>
              ))}
            </div>

            <div style={{ padding: "16px", background: "#11131f", borderRadius: 6, border: "1px solid #21262d" }}>
              <div style={{ color: "#e6edf3", fontWeight: 700, marginBottom: 8 }}>📋 tarefas ({tasks.length})</div>
              {tasks.map((t) => (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#556", marginBottom: 6, padding: "4px 0", borderBottom: "1px solid #1a1d2e" }}>
                  <span>{t.groupIcon} {t.name}</span>
                  <span style={{ color: "#334" }}>🔥{t.streak}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
