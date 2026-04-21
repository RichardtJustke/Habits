import { useState } from 'react';
import { THEME, GROUPS } from '../constants.js';

export default function AddTaskForm({ onAdd, onCancel }) {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [group, setGroup] = useState('morning');

  const handleSave = () => {
    onAdd({ group, name, note });
    setName('');
    setNote('');
    setGroup('morning');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div
      style={{
        border: `1px solid ${THEME.colors.border}`,
        borderRadius: THEME.radius.lg,
        padding: THEME.spacing.xl,
        marginTop: THEME.spacing.xl,
        background: THEME.colors.bgSecondary,
      }}
    >
      <div style={{ color: THEME.colors.success, marginBottom: THEME.spacing.lg, fontSize: 13 }}>
        $ habit --new
      </div>

      <div style={{ marginBottom: THEME.spacing.md }}>
        <div
          style={{
            color: THEME.colors.textTertiary,
            fontSize: THEME.typography.fontSizeXSmall,
            marginBottom: THEME.spacing.sm,
          }}
        >
          // nome da tarefa
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="nome..."
          style={{
            background: THEME.colors.bg,
            border: `1px solid ${THEME.colors.border}`,
            color: THEME.colors.text,
            padding: `${THEME.spacing.md}px ${THEME.spacing.md}px`,
            borderRadius: THEME.radius.md,
            fontFamily: THEME.typography.fontFamily,
            fontSize: 13,
            width: '100%',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: THEME.spacing.md }}>
        <div
          style={{
            color: THEME.colors.textTertiary,
            fontSize: THEME.typography.fontSizeXSmall,
            marginBottom: THEME.spacing.sm,
          }}
        >
          // nota opcional
        </div>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="nota..."
          style={{
            background: THEME.colors.bg,
            border: `1px solid ${THEME.colors.border}`,
            color: THEME.colors.text,
            padding: `${THEME.spacing.md}px ${THEME.spacing.md}px`,
            borderRadius: THEME.radius.md,
            fontFamily: THEME.typography.fontFamily,
            fontSize: 13,
            width: '100%',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: THEME.spacing.lg }}>
        <div
          style={{
            color: THEME.colors.textTertiary,
            fontSize: THEME.typography.fontSizeXSmall,
            marginBottom: THEME.spacing.sm,
          }}
        >
          // grupo
        </div>
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          style={{
            background: THEME.colors.bg,
            border: `1px solid ${THEME.colors.border}`,
            color: THEME.colors.text,
            padding: `${THEME.spacing.md}px ${THEME.spacing.md}px`,
            borderRadius: THEME.radius.md,
            fontFamily: THEME.typography.fontFamily,
            fontSize: 13,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        >
          {Object.entries(GROUPS).map(([key, g]) => (
            <option key={key} value={key}>
              {g.icon} {g.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: THEME.spacing.md }}>
        <button
          onClick={handleSave}
          style={{
            background: THEME.colors.primary,
            color: THEME.colors.bg,
            border: 'none',
            padding: `${THEME.spacing.md + 1}px ${THEME.spacing.xl}px`,
            borderRadius: THEME.radius.md,
            cursor: 'pointer',
            fontFamily: THEME.typography.fontFamily,
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          [salvar]
        </button>
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: `1px solid ${THEME.colors.border}`,
            color: THEME.colors.textTertiary,
            padding: `${THEME.spacing.md + 1}px ${THEME.spacing.xl}px`,
            borderRadius: THEME.radius.md,
            cursor: 'pointer',
            fontFamily: THEME.typography.fontFamily,
            fontSize: 13,
          }}
        >
          [cancelar]
        </button>
      </div>
    </div>
  );
}
