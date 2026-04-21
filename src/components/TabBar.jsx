import { THEME } from '../constants.js';

export default function TabBar({ activeTab, onTabChange, tabs }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: THEME.spacing.max,
        borderBottom: `1px solid ${THEME.colors.border}`,
        paddingTop: THEME.spacing.lg,
        marginBottom: THEME.spacing.xxxl,
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === tab ? THEME.colors.primary : THEME.colors.textTertiary,
            fontFamily: THEME.typography.fontFamily,
            fontSize: THEME.typography.fontSize,
            fontWeight: activeTab === tab ? 700 : 400,
            cursor: 'pointer',
            paddingBottom: THEME.spacing.lg,
            borderBottom: activeTab === tab ? `2px solid ${THEME.colors.primary}` : '2px solid transparent',
            letterSpacing: 0.5,
            transition: 'all 0.2s',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
