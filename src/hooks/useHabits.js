import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_TASKS } from '../constants.js';
import { today, isTaskComplete } from '../utils/helpers.js';

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

function normalizeTasks(tasksList) {
  return (tasksList || []).map((task) => ({
    ...task,
    subtasks: Array.isArray(task.subtasks)
      ? task.subtasks.map((subtask) => ({ ...subtask }))
      : null,
  }));
}

function rebuildDayLog(tasksList, completionMap) {
  const nextDayLog = {};
  Object.entries(completionMap || {}).forEach(([date, ids]) => {
    const completedCount = tasksList.filter((task) => isTaskComplete(task, ids || [])).length;
    nextDayLog[date] = tasksList.length ? completedCount / tasksList.length : 0;
  });
  return nextDayLog;
}

function pruneCompletions(completionMap, removedIds) {
  const nextCompletions = {};

  Object.entries(completionMap || {}).forEach(([date, ids]) => {
    const filtered = (ids || []).filter((id) => !removedIds.has(id));
    if (filtered.length > 0) {
      nextCompletions[date] = filtered;
    }
  });

  return nextCompletions;
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
        const normalizedTasks = normalizeTasks(s.tasks || DEFAULT_TASKS);
        const nextCompletions = s.completions || {};
        setTasks(normalizedTasks);
        setCompletions(nextCompletions);
        setDayLog(rebuildDayLog(normalizedTasks, nextCompletions));
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
  const toggle = useCallback((idToToggle) => {
    const td = today();
    setCompletions((prev) => {
      const cur = prev[td] || [];
      const next = cur.includes(idToToggle)
        ? cur.filter((x) => x !== idToToggle)
        : [...cur, idToToggle];

      setTasks((ts) => {
        let completedCount = 0;
        const nextTasks = ts.map((t) => {
          const wasDonePrev = isTaskComplete(t, cur);
          const isDoneNow = isTaskComplete(t, next);
          
          if (isDoneNow) {
            completedCount++;
          }

          // se o status principal da tarefa não mudou, o streak se mantém
          if (wasDonePrev === isDoneNow) {
            return t;
          }
          
          // acabou de completar a tarefa (ou todas as subtasks)
          if (!wasDonePrev && isDoneNow) {
            const yest = new Date(td + 'T12:00:00');
            yest.setDate(yest.getDate() - 1);
            const yk = yest.toISOString().slice(0, 10);
            const wasYestDone = isTaskComplete(t, prev[yk] || []);
            return { ...t, streak: wasYestDone ? t.streak + 1 : 1 };
          }
          
          // acabou de desmarcar (removendo subtask ou main)
          return { ...t, streak: Math.max(0, t.streak - 1) };
        });

        const nextCompletions = { ...prev, [td]: next };
        const nextDayLog = rebuildDayLog(nextTasks, nextCompletions);
        if (Object.prototype.hasOwnProperty.call(nextDayLog, td)) {
          nextDayLog[td] = ts.length ? completedCount / ts.length : 0;
        }
        setDayLog(nextDayLog);

        return nextTasks;
      });

      return { ...prev, [td]: next };
    });
  }, [tasks.length]);

  const addTask = useCallback(({ group, name, note, subtasks }) => {
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
        subtasks: subtasks && subtasks.length > 0 ? subtasks : null,
        streak: 0,
      },
    ]);
  }, []);

  const deleteTask = useCallback((id) => {
    const nextTasks = tasks.filter((task) => task.id !== id);
    const taskToRemove = tasks.find((task) => task.id === id);
    const removedIds = new Set([id, ...(taskToRemove?.subtasks || []).map((subtask) => subtask.id)]);
    const nextCompletions = pruneCompletions(completions, removedIds);

    setTasks(nextTasks);
    setCompletions(nextCompletions);
    setDayLog(rebuildDayLog(nextTasks, nextCompletions));
  }, [tasks, completions]);

  const deleteSubtask = useCallback((taskId, subtaskId) => {
    const nextTasks = tasks.map((task) => {
      if (task.id !== taskId || !Array.isArray(task.subtasks)) return task;

      const nextSubtasks = task.subtasks.filter((subtask) => subtask.id !== subtaskId);
      return {
        ...task,
        subtasks: nextSubtasks.length > 0 ? nextSubtasks : null,
      };
    });

    const nextCompletions = pruneCompletions(completions, new Set([subtaskId]));

    setTasks(nextTasks);
    setCompletions(nextCompletions);
    setDayLog(rebuildDayLog(nextTasks, nextCompletions));
  }, [tasks, completions]);

  const resetAllData = useCallback(() => {
    setTasks(DEFAULT_TASKS);
    setCompletions({});
    setDayLog({});
  }, []);

  const replaceState = useCallback((nextState) => {
    const normalizedTasks = normalizeTasks(nextState?.tasks || DEFAULT_TASKS);
    const nextCompletions = nextState?.completions || {};
    setTasks(normalizedTasks);
    setCompletions(nextCompletions);
    setDayLog(rebuildDayLog(normalizedTasks, nextCompletions));
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
    deleteSubtask,
    resetAllData,
    replaceState,
  };
}
