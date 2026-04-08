import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { colors, radius, typography, shadows, btnDanger } from '../theme'

const supervisorMenu = [
  { label: 'Dashboard',         path: '/supervisor/dashboard', icon: <GridIcon /> },
  { label: 'Mis Contratistas',  path: '/supervisor/contratistas', icon: <UserIcon /> },
  { label: 'Solicitudes',       path: '/supervisor/solicitudes',  icon: <ListIcon /> },
  { label: 'Historial',         path: '/supervisor/historial',    icon: <DocIcon />  },
  { label: 'Notificaciones',    path: '/supervisor/notifs',       icon: <BellIcon />, badge: 13 },
]

const supervisorUser = {
  name: 'Santiago Rodríguez',
  sub: '12840317',
  initials: 'SR',
}

export default function SupervisorLayout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <style>{`
        .sv-layout { display: flex; height: 100vh; overflow: hidden; background: ${colors.bgApp}; font-family: system-ui, sans-serif; }
        .sv-sidebar { width: 192px; background: ${colors.navy}; display: flex; flex-direction: column; flex-shrink: 0; box-shadow: ${shadows.sidebar}; transition: transform 0.25s ease; z-index: 40; }
        .sv-overlay { display: none; }
        .sv-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
        .sv-content { flex: 1; overflow-y: auto; padding: 24px; }
        .sv-hamburger { display: none; }

        @media (max-width: 768px) {
          .sv-sidebar { position: fixed; top: 0; left: 0; height: 100vh; transform: translateX(-100%); }
          .sv-sidebar.open { transform: translateX(0); }
          .sv-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 30; }
          .sv-hamburger { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: ${colors.bgInput}; border: none; border-radius: ${radius.md}; cursor: pointer; font-size: 18px; flex-shrink: 0; }
          .sv-content { padding: 16px; }
        }
      `}</style>

      <div className="sv-layout">

        {sidebarOpen && <div className="sv-overlay" onClick={() => setSidebarOpen(false)} />}

        {/* ── Sidebar ── */}
        <aside className={`sv-sidebar${sidebarOpen ? ' open' : ''}`}>

          {/* Logo + Usuario */}
          <div style={{ padding: '20px 16px 16px', borderBottom: `1px solid ${colors.navyBorder}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="10" stroke={colors.primary} strokeWidth="1.5" fill="none" />
                <path d="M7 11.5L9.8 14.5L15.5 8" stroke={colors.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ color: colors.textWhite, fontSize: typography.lg, fontWeight: 700 }}>Clarity</span>
            </div>

            {/* Avatar del supervisor */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: radius.full,
                background: 'linear-gradient(135deg, #F5A623 0%, #F5C020 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#1A1A2E', fontWeight: 700, fontSize: typography.sm, flexShrink: 0,
                fontSize: '18px',
              }}>
                👨🏾
              </div>
              <div>
                <p style={{ color: colors.textWhite, fontSize: typography.sm, fontWeight: 600, lineHeight: 1.3, margin: 0 }}>
                  {supervisorUser.name}
                </p>
                <p style={{ color: colors.textWhite40, fontSize: '10px', margin: 0 }}>
                  {supervisorUser.sub}
                </p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
            {supervisorMenu.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: typography.sm, textDecoration: 'none',
                  padding: isActive ? '9px 12px' : '9px 16px',
                  margin: isActive ? '2px 10px' : '2px 0',
                  borderRadius: isActive ? radius.md : 0,
                  background: isActive ? colors.primary : 'transparent',
                  color: isActive ? colors.primaryText : colors.textWhite60,
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.15s',
                })}
              >
                <span style={{ width: 14, height: 14, flexShrink: 0 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    background: colors.badge, color: colors.badgeText,
                    fontSize: '9px', fontWeight: 700,
                    width: 16, height: 16, borderRadius: radius.full,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Cerrar sesión */}
          <div style={{ padding: '0 14px 16px' }}>
            <button
              onClick={() => navigate('/')}
              style={btnDanger}
              onMouseEnter={e => e.currentTarget.style.background = colors.dangerHover}
              onMouseLeave={e => e.currentTarget.style.background = colors.danger}
            >
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* ── Contenido principal ── */}
        <div className="sv-main">
          <header style={{
            background: colors.bgCard, borderBottom: `1px solid ${colors.border}`,
            padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
          }}>
            <button className="sv-hamburger" onClick={() => setSidebarOpen(true)}>☰</button>

            <input
              placeholder="Buscar..."
              style={{
                flex: 1, padding: '8px 12px', border: `1px solid ${colors.borderInput}`,
                borderRadius: radius.md, fontSize: typography.sm, outline: 'none',
                background: colors.bgInput, fontFamily: 'inherit', minWidth: 0,
              }}
              onFocus={e => { e.target.style.borderColor = colors.borderFocus; e.target.style.boxShadow = `0 0 0 3px ${colors.focusShadow}` }}
              onBlur={e => { e.target.style.borderColor = colors.borderInput; e.target.style.boxShadow = 'none' }}
            />

            <button style={{ width: 32, height: 32, background: colors.bgInput, border: 'none', borderRadius: radius.full, cursor: 'pointer', fontSize: 14, flexShrink: 0 }}>🔧</button>

            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button style={{ width: 32, height: 32, background: colors.bgInput, border: 'none', borderRadius: radius.full, cursor: 'pointer', fontSize: 14 }}>📬</button>
              <span style={{
                position: 'absolute', top: -2, right: -2, width: 10, height: 10,
                background: colors.badge, borderRadius: radius.full, border: `2px solid ${colors.bgCard}`,
              }} />
            </div>
          </header>

          <main className="sv-content">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}

function GridIcon() {
  return <svg viewBox="0 0 14 14" fill="none" style={{ width: '100%', height: '100%' }}><rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" /></svg>
}
function UserIcon() {
  return <svg viewBox="0 0 14 14" fill="none" style={{ width: '100%', height: '100%' }}><circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.3" /><path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
}
function ListIcon() {
  return <svg viewBox="0 0 14 14" fill="none" style={{ width: '100%', height: '100%' }}><path d="M2 3.5h10M2 7h10M2 10.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
}
function DocIcon() {
  return <svg viewBox="0 0 14 14" fill="none" style={{ width: '100%', height: '100%' }}><rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M4 5h6M4 7.5h6M4 10h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>
}
function BellIcon() {
  return <svg viewBox="0 0 14 14" fill="none" style={{ width: '100%', height: '100%' }}><path d="M7 2C5.34 2 4 3.34 4 5v2.5L2.5 9.5h9L10 7.5V5c0-1.66-1.34-3-3-3z" stroke="currentColor" strokeWidth="1.3" /><path d="M5.5 9.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5" stroke="currentColor" strokeWidth="1.3" /></svg>
}
