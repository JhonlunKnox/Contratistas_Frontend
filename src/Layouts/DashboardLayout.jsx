import { Outlet, NavLink, useNavigate } from 'react-router-dom'

// Menús según rol
const adminMenu = [
  { label: 'Dashboard',      path: '/admin/dashboard',  icon: <GridIcon /> },
  { label: 'Registrar',      path: '/admin/registrar',  icon: <FormIcon /> },
  { label: 'Empleados',      path: '/admin/empleados',  icon: <UserIcon /> },
  { label: 'Solicitudes',    path: '/admin/solicitudes',icon: <ListIcon /> },
  { label: 'Contratos',      path: '/admin/contratos',  icon: <DocIcon /> },
  { label: 'Notificaciones', path: '/admin/notifs',     icon: <BellIcon />, badge: 3 },
]

const empleadoMenu = [
  { label: 'Dashboard',          path: '/empleado/dashboard', icon: <GridIcon /> },
  { label: 'Actividades',        path: '/empleado/actividades',icon: <ListIcon /> },
  { label: 'Mis Contratos',      path: '/empleado/contratos', icon: <DocIcon /> },
  { label: 'Solicitudes de pago',path: '/empleado/solicitudes',icon: <UserIcon /> },
  { label: 'Historial',          path: '/empleado/historial', icon: <FormIcon /> },
  { label: 'Notificaciones',     path: '/empleado/notifs',    icon: <BellIcon />, badge: 2 },
]

// Datos de usuario mockeados por rol
const userData = {
  admin:    { initials: 'SR', name: 'Santiago Rodríguez', role: 'Jefe RH' },
  empleado: { initials: 'AG', name: 'Andrés Gómez',       role: '12840157' },
}

export default function DashboardLayout({ role = 'empleado' }) {
  const navigate = useNavigate()
  const menu = role === 'admin' ? adminMenu : empleadoMenu
  const user = userData[role]

  return (
    <div className="flex h-screen bg-[#eef1f7] font-sans overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-48 bg-[#0d2145] flex flex-col flex-shrink-0">

        {/* Logo + usuario */}
        <div className="px-4 py-5 border-b border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="10" stroke="#F5C020" strokeWidth="1.5" fill="none" />
              <path d="M7 11.5L9.8 14.5L15.5 8" stroke="#F5C020" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-white text-base font-bold">Clarity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center
                            text-[#1a1a2e] font-bold text-xs flex-shrink-0">
              {user.initials}
            </div>
            <div>
              <p className="text-white text-xs font-semibold leading-tight">{user.name}</p>
              <p className="text-white/40 text-[10px]">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {menu.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 text-xs py-2.5 transition-all
                 ${isActive
                   ? 'bg-yellow-400 text-[#1a1a2e] font-semibold mx-2.5 rounded-lg px-3'
                   : 'text-white/55 hover:text-white hover:bg-white/5 px-4'
                 }`
              }
            >
              <span className="w-3.5 h-3.5 flex-shrink-0">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-[9px] font-bold
                                 w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Cerrar sesión */}
        <div className="px-3.5 pb-4">
          <button
            onClick={() => navigate('/')}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs
                       font-medium rounded-lg transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ── Contenido principal ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3">
          <input
            placeholder="Buscar..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2
                       text-xs outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center
                             text-sm hover:bg-gray-200 transition">
            🔧
          </button>
          <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center
                             text-sm hover:bg-gray-200 transition relative">
            📬
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full
                             border-2 border-white" />
          </button>
        </header>

        {/* Página activa */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// ── Iconos SVG inline ──────────────────────────────────────────────
function GridIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" className="w-full h-full">
      <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}
function FormIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" className="w-full h-full">
      <rect x="1" y="2" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4 6h6M4 8.5h3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}
function UserIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" className="w-full h-full">
      <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
function ListIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" className="w-full h-full">
      <path d="M2 3.5h10M2 7h10M2 10.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
function DocIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" className="w-full h-full">
      <rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4 5h6M4 7.5h6M4 10h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}
function BellIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" className="w-full h-full">
      <path d="M7 2C5.34 2 4 3.34 4 5v2.5L2.5 9.5h9L10 7.5V5c0-1.66-1.34-3-3-3z"
        stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.5 9.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5"
        stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}