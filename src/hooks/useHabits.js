import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_TASKS } from '../constants.js';
import { today } from '../utils/helpers.js';

// ── STORAGE HELPERS ───────────────────────────────────────────────────────────
async function loadState() {
  try {
    const json = localStorage.getItem('habits:state');
    if (json) return JSON.parse(json);
  } catch (_) {}
  return null;
}

async function saveState(s) {
  try {
    localStorage.setItem('habits:state', JSON.stringify(s));
  } catch (_) {}
}

// ── HOOK: useHabits ───────────────────────────────────────────────────────────
/**
 * Hook principal que gerencia toda a lógica de estado das tarefas
 */
export function useHabits() {
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [completions, setCompletions] = useState({}); // { "2024-01-01": ["t1","t3"] }
  const [dayLog, setDayLog] = useState({}); // { "2024-01-01": 0.75 }
  const [loaded, setLoaded] = useState(false);

  // Load state from localStorage
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

  // Save state to localStorage
  useEffect(() => {
    if (!loaded) return;
    saveState({ tasks, completions, dayLog });
  }, [tasks, completions, dayLog, loaded]);

  // ── ACTIONS ────────────────────────────────────────────────────────────────
  const toggle = useCallback((taskId) => {
    const td = today();
    setCompletions((prev) => {
      const cur = prev[td] || [];
      const next = cur.includes(taskId)
        ? cur.filter((x) => x !== taskId)
        : [...cur, taskId];
      const pct = tasks.length ? next.length / tasks.length : 0;

      // Update day log
      setDayLog((dl) => ({ ...dl, [td]: pct }));

      // Update streak
      setTasks((ts) =>
        ts.map((t) => {
          if (t.id !== taskId) return t;
          if (!cur.includes(taskId)) {
            // Being checked — increment streak if yesterday was also done
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
  }, [tasks.length]);

  const addTask = useCallback(({ group, name, note }) => {
    if (!name.trim()) return;

    const id = 't' + Date.now();
    const groupLabel = {
      morning: 'Manhã',
      deepwork: 'Trabalho Profundo',
      health: 'Saúde',
      evening: 'Descompressão',
      learning: 'Aprendizado',
    }[group] || group;

    const groupIcon = {
      morning: '🌅',
      deepwork: '💻',
      health: '💪',
      evening: '🌙',
      learning: '📚',
    }[group] || '📌';

    setTasks((t) => [
      ...t,
      {
        id,
        group,
        name: name.trim(),
        note: note.trim() ? `// ${note.trim()}` : '',
        streak: 0,
      },
    ]);
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((t) => t.filter((x) => x.id !== id));
  }, []);

  const resetAllData = useCallback(() => {
    setTasks(DEFAULT_TASKS);
    setCompletions({});
    setDayLog({});
  }, []);

  return {
    // State
    tasks,
    completions,
    dayLog,
    loaded,

    // Actions
    toggle,
    addTask,
    deleteTask,
    resetAllData,
  };
}
