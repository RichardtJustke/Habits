import { THEME } from '../constants.js';

export default function TerminalHeader({ rotatingMsg }) {
  return (
    <div style={{ marginBottom: THEME.spacing.xl }}>
      <div style={{ fontSize: THEME.typography.fontSize }}>
        <span style={{ color: THEME.colors.primary }}>user[pro]</span>
        <span style={{ color: THEME.colors.success }}>@init.Habits</span>
        <span style={{ color: THEME.colors.textSecondary }}> $ daily</span>
      </div>
      <div style={{ color: THEME.colors.textTertiary, marginTop: THEME.spacing.sm }}>
        {rotatingMsg}
      </div>
    </div>
  );
}
