import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', remember: false })

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: conectar con API
    // Por ahora redirige según email para probar ambos roles
    if (form.email.includes('admin')) {
      navigate('/admin/registrar')
    } else {
      navigate('/empleado/contratos')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1628] relative overflow-hidden">

      {/* Overlay oscuro con textura */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d2145] to-[#0a1628] opacity-95" />

      {/* Puntos decorativos */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-5 blur-2xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-500 rounded-full opacity-5 blur-3xl" />

      <div className="relative z-10 w-full max-w-sm px-8 py-10 text-center">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="20" stroke="#F5C020" strokeWidth="2" fill="none" />
            <path d="M13 22.5L19.5 29L31 16" stroke="#F5C020" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" />
            <path d="M25 10C25 10 30 12 32 16" stroke="#F5C020" strokeWidth="1.5"
              strokeLinecap="round" />
          </svg>
          <span className="text-white text-3xl font-bold tracking-tight">Clarity</span>
        </div>

        <p style={{ color: 'var(--color-text-white-60)', fontSize: 'var(--font-size-sm)' }}
           className="mb-8">
          Ingresar a tu cuenta.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">

          {/* Email */}
          <div>
            <label style={{ color: 'var(--color-text-white-60)' }} className="form-label">
              E-mail
            </label>
            <input
              type="email"
              required
              placeholder="correo@empresa.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="input-clarity"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label style={{ color: 'var(--color-text-white-60)' }} className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="input-clarity"
            />
          </div>

          {/* Recordarme + Olvidé */}
          <div className="flex items-center justify-between pt-1">
            <label style={{ color: 'var(--color-text-white-60)', fontSize: 'var(--font-size-xs)' }}
                   className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={e => setForm({ ...form, remember: e.target.checked })}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              Recordarme
            </label>
            <button type="button"
              style={{ color: 'var(--color-text-white-60)', fontSize: 'var(--font-size-xs)' }}
              className="underline hover:text-white transition bg-transparent border-none cursor-pointer">
              Contraseña Olvidada
            </button>
          </div>

          {/* Botón */}
          <button type="submit" className="btn-primary w-full mt-2">
            Iniciar Sesión
          </button>

        </form>

        {/* Hint para desarrollo */}
        <p className="mt-6 text-white/30 text-xs">
          Tip: usa "admin@..." para entrar como jefe, cualquier otro como empleado
        </p>
      </div>
    </div>
  )
}