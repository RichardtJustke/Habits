import { useMemo, useRef, useState } from 'react';
import { THEME, BIO_MSGS } from '../constants.js';
import { calculateStats, calculateCurrentStreak } from '../utils/helpers.js';

export default function ProfileTab({ tasks, dayLog, completions, onResetAll, onImportState }) {
  const stats = calculateStats(dayLog);
  const currentStreak = calculateCurrentStreak(dayLog);
  const fileInputRef = useRef(null);
  const [backupMessage, setBackupMessage] = useState('');

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
        <div style={{ color: THEME.colors.textTertiary, fontSize: THEME.typography.fontSizeSmall, marginBottom: THEME.spacing.md }}>
          Os dados ficam salvos automaticamente no navegador via localStorage. Para não perder nada, exporte um backup JSON e, se precisar, restaure depois.
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

        <button
          onClick={() => {
            const backup = {
              tasks,
              dayLog,
              completions,
              exportedAt: new Date().toISOString(),
            };

            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `trackerday-backup-${new Date().toISOString().slice(0, 10)}.json`;
            link.click();
            URL.revokeObjectURL(url);
            setBackupMessage('backup exportado');
            setTimeout(() => setBackupMessage(''), 1400);
          }}
          style={{
            display: 'block',
            background: 'none',
            border: `1px solid ${THEME.colors.border}`,
            color: THEME.colors.success,
            fontFamily: THEME.typography.fontFamily,
            fontSize: 13,
            padding: `${THEME.spacing.md}px ${THEME.spacing.xl}px`,
            borderRadius: THEME.radius.md,
            cursor: 'pointer',
            marginBottom: THEME.spacing.md,
          }}
        >
          exportar backup JSON
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            display: 'block',
            background: 'none',
            border: `1px solid ${THEME.colors.border}`,
            color: THEME.colors.primary,
            fontFamily: THEME.typography.fontFamily,
            fontSize: 13,
            padding: `${THEME.spacing.md}px ${THEME.spacing.xl}px`,
            borderRadius: THEME.radius.md,
            cursor: 'pointer',
            marginBottom: THEME.spacing.md,
          }}
        >
          importar backup JSON
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const text = await file.text();
            const parsed = JSON.parse(text);
            if (!parsed || !Array.isArray(parsed.tasks)) {
              alert('Backup inválido.');
              return;
            }

            onImportState(parsed);
            e.target.value = '';
          }}
        />

        {backupMessage && (
          <div style={{ color: THEME.colors.success, fontSize: THEME.typography.fontSizeSmall, marginTop: THEME.spacing.sm }}>
            {backupMessage}
          </div>
        )}
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
