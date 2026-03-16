import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors,typography, btnPrimary, inputStyle } from '../theme'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', remember: false })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.email.includes('admin')) navigate('/admin/registrar')
    else navigate('/empleado/contratos')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#0a1628',
      position: 'relative', overflow: 'hidden', padding: '24px 16px',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0a1628 0%, #0d2145 50%, #0a1628 100%)' }} />
      <div style={{ position: 'absolute', top: 40, left: 40, width: 128, height: 128, borderRadius: '50%', background: colors.primary, opacity: 0.05, filter: 'blur(40px)' }} />
      <div style={{ position: 'absolute', bottom: 40, right: 40, width: 192, height: 192, borderRadius: '50%', background: '#3B82F6', opacity: 0.05, filter: 'blur(60px)' }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '360px', textAlign: 'center' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="20" stroke={colors.primary} strokeWidth="2" fill="none" />
            <path d="M13 22.5L19.5 29L31 16" stroke={colors.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M25 10C25 10 30 12 32 16" stroke={colors.primary} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ color: colors.textWhite, fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px' }}>Clarity</span>
        </div>

        <p style={{ color: colors.textWhite60, fontSize: typography.sm, marginBottom: 32 }}>Ingresar a tu cuenta.</p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: colors.textWhite60, fontSize: typography.xs, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 6 }}>E-mail</label>
            <input type="email" required placeholder="correo@empresa.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ ...inputStyle, background: 'rgba(255,255,255,0.92)' }}
              onFocus={e => { e.target.style.borderColor = colors.borderFocus; e.target.style.boxShadow = `0 0 0 3px ${colors.focusShadow}` }}
              onBlur={e =>  { e.target.style.borderColor = colors.borderInput; e.target.style.boxShadow = 'none' }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: colors.textWhite60, fontSize: typography.xs, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 6 }}>Contraseña</label>
            <input type="password" required placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={{ ...inputStyle, background: 'rgba(255,255,255,0.92)' }}
              onFocus={e => { e.target.style.borderColor = colors.borderFocus; e.target.style.boxShadow = `0 0 0 3px ${colors.focusShadow}` }}
              onBlur={e =>  { e.target.style.borderColor = colors.borderInput; e.target.style.boxShadow = 'none' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: colors.textWhite60, fontSize: typography.xs, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.remember} onChange={e => setForm({ ...form, remember: e.target.checked })} style={{ accentColor: colors.primary }} />
              Recordarme
            </label>
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textWhite60, fontSize: typography.xs, textDecoration: 'underline', fontFamily: 'inherit' }}>
              Contraseña Olvidada
            </button>
          </div>
          <button type="submit" style={{ ...btnPrimary }}
            onMouseEnter={e => e.currentTarget.style.background = colors.primaryHover}
            onMouseLeave={e => e.currentTarget.style.background = colors.primary}
          >
            Iniciar Sesión
          </button>
        </form>

        <p style={{ marginTop: 24, color: 'rgba(255,255,255,0.2)', fontSize: typography.xs }}>
          Tip: usa "admin@..." para jefe, cualquier otro para empleado
        </p>
      </div>
    </div>
  )
}