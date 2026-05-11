import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', label: '홈', icon: '🏠' },
  { to: '/workout', label: '운동', icon: '💪' },
  { to: '/diet', label: '식단', icon: '🍱' },
  { to: '/calendar', label: '달력', icon: '📅' },
  { to: '/progress', label: '그래프', icon: '📈' },
  { to: '/settings', label: '설정', icon: '⚙️' },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] flex z-50"
      style={{
        background: 'var(--surface-soft)',
        borderTop: '1px solid var(--hairline)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {tabs.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className="flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors active:scale-95"
          style={({ isActive }) => ({
            color: isActive ? '#ffffff' : 'var(--muted)',
            borderBottom: isActive ? '2px solid var(--m-blue)' : '2px solid transparent',
          })}
        >
          <span className="text-xl leading-none">{icon}</span>
          <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
            {label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}
