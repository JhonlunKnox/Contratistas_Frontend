import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, typography, btnPrimary, inputStyle, radius } from '../theme'

const platforms = [
  {
    id: 'contratista',
    label: 'Contratista',
    description: 'Gestiona tus actividades y solicitudes',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" style={{ width: '100%', height: '100%' }}>
        <rect x="4" y="8" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M11 8V6.5A2.5 2.5 0 0 1 13.5 4h5A2.5 2.5 0 0 1 21 6.5V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4 16h24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    route: '/empleado/dashboard',
    color: '#3B82F6',
  },
  {
    id: 'supervisor',
    label: 'Supervisor',
    description: 'Revisa y aprueba solicitudes de contratistas',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" style={{ width: '100%', height: '100%' }}>
        <circle cx="16" cy="11" r="5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M6 27c0-5.52 4.48-10 10-10s10 4.48 10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="26" cy="9" r="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24.5 9l1 1 2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    route: '/supervisor/dashboard',
    color: '#10B981',
  },
  {
    id: 'gerente',
    label: 'Gerente',
    description: 'Vista ejecutiva y aprobaciones finales',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" style={{ width: '100%', height: '100%' }}>
        <path d="M16 4l3 7h7l-5.5 4.5 2 7L16 19l-6.5 3.5 2-7L6 11h7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
    route: '/admin/registrar',
    color: '#F5C020',
  },
]

export default function Login() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('contratista')
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [hoveredPlatform, setHoveredPlatform] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const platform = platforms.find(p => p.id === selected)
    navigate(platform.route)
  }

  const selectedPlatform = platforms.find(p => p.id === selected)

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#0a1628',
      position: 'relative', overflow: 'hidden', padding: '24px 16px',
    }}>
      {/* Fondo */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0a1628 0%, #0d2145 50%, #0a1628 100%)' }} />
      <div style={{ position: 'absolute', top: 40, left: 40, width: 200, height: 200, borderRadius: '50%', background: selectedPlatform.color, opacity: 0.04, filter: 'blur(60px)', transition: 'background 0.4s' }} />
      <div style={{ position: 'absolute', bottom: 40, right: 40, width: 240, height: 240, borderRadius: '50%', background: selectedPlatform.color, opacity: 0.04, filter: 'blur(80px)', transition: 'background 0.4s' }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
          <svg width="40" height="40" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="20" stroke={colors.primary} strokeWidth="2" fill="none" />
            <path d="M13 22.5L19.5 29L31 16" stroke={colors.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ color: colors.textWhite, fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px' }}>Clarity</span>
        </div>

        {/* Selector de plataforma */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: typography.xs, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12, textAlign: 'center' }}>
            Selecciona tu plataforma
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {platforms.map(p => {
              const isActive = selected === p.id
              const isHovered = hoveredPlatform === p.id
              return (
                <button
                  key={p.id}
                  id={`platform-${p.id}`}
                  onClick={() => setSelected(p.id)}
                  onMouseEnter={() => setHoveredPlatform(p.id)}
                  onMouseLeave={() => setHoveredPlatform(null)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 8, padding: '14px 8px', borderRadius: radius.lg,
                    border: isActive ? `2px solid ${p.color}` : '2px solid rgba(255,255,255,0.08)',
                    background: isActive
                      ? `${p.color}18`
                      : isHovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                  }}
                >
                  <div style={{
                    width: 36, height: 36,
                    color: isActive ? p.color : 'rgba(255,255,255,0.4)',
                    transition: 'color 0.2s',
                  }}>
                    {p.icon}
                  </div>
                  <span style={{
                    fontSize: typography.xs, fontWeight: isActive ? 700 : 500,
                    color: isActive ? p.color : 'rgba(255,255,255,0.5)',
                    transition: 'color 0.2s',
                    letterSpacing: '0.2px',
                  }}>
                    {p.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Descripción de la plataforma seleccionada */}
          <div style={{
            marginTop: 12, padding: '10px 14px',
            background: `${selectedPlatform.color}12`,
            border: `1px solid ${selectedPlatform.color}30`,
            borderRadius: radius.md,
            transition: 'all 0.3s ease',
          }}>
            <p style={{ margin: 0, color: `${selectedPlatform.color}CC`, fontSize: typography.xs, textAlign: 'center' }}>
              {selectedPlatform.description}
            </p>
          </div>
        </div>

        {/* Divisor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: typography.xs }}>Inicia sesión</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: typography.xs, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 6 }}>
              E-mail
            </label>
            <input
              type="email" required placeholder="correo@empresa.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ ...inputStyle, background: 'rgba(255,255,255,0.92)' }}
              onFocus={e => { e.target.style.borderColor = selectedPlatform.color; e.target.style.boxShadow = `0 0 0 3px ${selectedPlatform.color}33` }}
              onBlur={e => { e.target.style.borderColor = colors.borderInput; e.target.style.boxShadow = 'none' }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: typography.xs, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 6 }}>
              Contraseña
            </label>
            <input
              type="password" required placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={{ ...inputStyle, background: 'rgba(255,255,255,0.92)' }}
              onFocus={e => { e.target.style.borderColor = selectedPlatform.color; e.target.style.boxShadow = `0 0 0 3px ${selectedPlatform.color}33` }}
              onBlur={e => { e.target.style.borderColor = colors.borderInput; e.target.style.boxShadow = 'none' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: typography.xs, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.remember} onChange={e => setForm({ ...form, remember: e.target.checked })} style={{ accentColor: selectedPlatform.color }} />
              Recordarme
            </label>
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: typography.xs, textDecoration: 'underline', fontFamily: 'inherit' }}>
              Contraseña Olvidada
            </button>
          </div>

          <button
            id="btn-login"
            type="submit"
            style={{
              ...btnPrimary,
              background: selectedPlatform.color,
              color: selected === 'gerente' ? '#1A1A2E' : '#fff',
              transition: 'all 0.2s',
              boxShadow: `0 4px 20px ${selectedPlatform.color}40`,
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Ingresar como {selectedPlatform.label}
          </button>
        </form>
      </div>
    </div>
  )
}
