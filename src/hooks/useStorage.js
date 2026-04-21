import { useEffect } from 'react';

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

// ── HOOK: useStorage ───────────────────────────────────────────────────────────
/**
 * Hook que gerencia carregamento e persistência de estado no localStorage
 * @param {Object} state - objeto de estado { tasks, completions, dayLog }
 * @param {boolean} isReady - flag indicando se o estado está pronto para salvar
 */
export function useStorage(state, isReady) {
  // Salva quando o estado muda
  useEffect(() => {
    if (!isReady) return;
    saveState(state);
  }, [state, isReady]);

  return { loadState };
}
