import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { colors, radius, typography, shadows, btnDanger } from '../../theme'

const adminMenu = [
  { label: 'Dashboard',      path: '/admin/dashboard',   icon: <GridIcon /> },
  { label: 'Registrar',      path: '/admin/registrar',   icon: <FormIcon /> },
  { label: 'Empleados',      path: '/admin/empleados',   icon: <UserIcon /> },
  { label: 'Solicitudes',    path: '/admin/solicitudes', icon: <ListIcon /> },
  { label: 'Contratos',      path: '/admin/contratos',   icon: <DocIcon />  },
  { label: 'Notificaciones', path: '/admin/notifs',      icon: <BellIcon />, badge: 3 },
]

const empleadoMenu = [
  { label: 'Dashboard',           path: '/empleado/dashboard',  icon: <GridIcon /> },
  { label: 'Actividades',         path: '/empleado/actividades',icon: <ListIcon /> },
  { label: 'Mis Contratos',       path: '/empleado/contratos',  icon: <DocIcon />  },
  { label: 'Solicitudes de pago', path: '/empleado/solicitudes',icon: <UserIcon /> },
  { label: 'Historial',           path: '/empleado/historial',  icon: <FormIcon /> },
  { label: 'Notificaciones',      path: '/empleado/notifs',     icon: <BellIcon />, badge: 2 },
]

const userData = {
  admin:    { initials: 'SR', name: 'Santiago Rodríguez', sub: 'Jefe RH' },
  empleado: { initials: 'AG', name: 'Andrés Gómez',       sub: '12840157' },
}

export default function DashboardLayout({ role = 'empleado' }) {
  const navigate = useNavigate()
  const menu = role === 'admin' ? adminMenu : empleadoMenu
  const user = userData[role]

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: colors.bgApp, fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: '192px', background: colors.navy, display: 'flex', flexDirection: 'column', flexShrink: 0, boxShadow: shadows.sidebar }}>

        {/* Logo + usuario */}
        <div style={{ padding: '20px 16px 16px', borderBottom: `1px solid ${colors.navyBorder}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="10" stroke={colors.primary} strokeWidth="1.5" fill="none" />
              <path d="M7 11.5L9.8 14.5L15.5 8" stroke={colors.primary} strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ color: colors.textWhite, fontSize: typography.lg, fontWeight: 700 }}>Clarity</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: radius.full,
              background: colors.primary, display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: colors.primaryText,
              fontWeight: 700, fontSize: typography.sm, flexShrink: 0,
            }}>
              {user.initials}
            </div>
            <div>
              <p style={{ color: colors.textWhite, fontSize: typography.sm, fontWeight: 600, lineHeight: 1.3 }}>{user.name}</p>
              <p style={{ color: colors.textWhite40, fontSize: '10px' }}>{user.sub}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {menu.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
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

      {/* ── Contenido ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <header style={{
          background: colors.bgCard,
          borderBottom: `1px solid ${colors.border}`,
          padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <input
            placeholder="Buscar..."
            style={{
              flex: 1, padding: '8px 12px',
              border: `1px solid ${colors.borderInput}`,
              borderRadius: radius.md, fontSize: typography.sm,
              outline: 'none', background: colors.bgInput, fontFamily: 'inherit',
            }}
            onFocus={e => { e.target.style.borderColor = colors.borderFocus; e.target.style.boxShadow = `0 0 0 3px ${colors.focusShadow}` }}
            onBlur={e =>  { e.target.style.borderColor = colors.borderInput;  e.target.style.boxShadow = 'none' }}
          />
          <button style={{ width: 32, height: 32, background: colors.bgInput, border: 'none', borderRadius: radius.full, cursor: 'pointer', fontSize: 14 }}>🔧</button>
          <div style={{ position: 'relative' }}>
            <button style={{ width: 32, height: 32, background: colors.bgInput, border: 'none', borderRadius: radius.full, cursor: 'pointer', fontSize: 14 }}>📬</button>
            <span style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, background: colors.badge, borderRadius: radius.full, border: `2px solid ${colors.bgCard}` }} />
          </div>
        </header>

        {/* Página activa */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// ── Iconos ───────────────────────────────────────────────────────────
function GridIcon() {
  return <svg viewBox="0 0 14 14" fill="none" style={{ width: '100%', height: '100%' }}>
    <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
  </svg>
}
function FormIcon() {
  return <svg viewBox="0 0 14 14" fill="none" style={{ width: '100%', height: '100%' }}>
    <rect x="1" y="2" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M4 6h6M4 8.5h3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
}
function UserIcon() {
  return <svg viewBox="0 0 14 14" fill="none" style={{ width: '100%', height: '100%' }}>
    <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
}
function ListIcon() {
  return <svg viewBox="0 0 14 14" fill="none" style={{ width: '100%', height: '100%' }}>
    <path d="M2 3.5h10M2 7h10M2 10.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
}
function DocIcon() {
  return <svg viewBox="0 0 14 14" fill="none" style={{ width: '100%', height: '100%' }}>
    <rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M4 5h6M4 7.5h6M4 10h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
}
function BellIcon() {
  return <svg viewBox="0 0 14 14" fill="none" style={{ width: '100%', height: '100%' }}>
    <path d="M7 2C5.34 2 4 3.34 4 5v2.5L2.5 9.5h9L10 7.5V5c0-1.66-1.34-3-3-3z" stroke="currentColor" strokeWidth="1.3" />
    <path d="M5.5 9.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5" stroke="currentColor" strokeWidth="1.3" />
  </svg>
}