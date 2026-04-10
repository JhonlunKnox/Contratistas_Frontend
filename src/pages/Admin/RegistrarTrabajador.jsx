import { useState } from 'react'
import { colors, radius, typography, cardStyle, formLabelStyle, inputStyle, inputFocusStyle, inputBlurStyle, btnSuccess } from '../../theme'

const API_URL = 'http://localhost:5000'

const initialForm = {
  nombre: '', correo: '', identificacion: '',
  tipo_documento: '', rol: '', contrasena: '',
}

export default function RegistrarTrabajador() {
  const [form, setForm]       = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre:        form.nombre,
          correo:        form.correo,
          identificacion: form.identificacion,
          tipo_documento: form.tipo_documento || undefined,
          rol:           form.rol,
          password:      form.contrasena,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error al registrar')
        return
      }
      setSuccess(true)
      setForm(initialForm)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        .rt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 20px; }
        @media (max-width: 600px) {
          .rt-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ maxWidth: '640px' }}>
        <h1 style={{ fontSize: typography.xl, fontWeight: 600, color: colors.textPrimary, marginBottom: 20 }}>
          Registrar Trabajador
        </h1>

        {success && (
          <div style={{ marginBottom: 16, padding: '12px 16px', background: colors.successLight, border: `1px solid ${colors.successBorder}`, borderRadius: radius.md, color: colors.successText, fontSize: typography.sm, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>✓</span> Trabajador registrado exitosamente.
          </div>
        )}

        {error && (
          <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: radius.md, color: '#ef4444', fontSize: typography.sm }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={cardStyle}>
          <div className="rt-grid">
            <Field label="Nombre"         name="nombre"         value={form.nombre}         onChange={handleChange} placeholder="Nombre completo" />
            <Field label="Correo"         name="correo"         value={form.correo}         onChange={handleChange} placeholder="correo@empresa.com" type="email" />
            <Field label="Identificación" name="identificacion" value={form.identificacion} onChange={handleChange} placeholder="Cédula / NIT" />
            <Field label="Tipo Documento" name="tipo_documento" value={form.tipo_documento} onChange={handleChange} placeholder="Ej: CC, NIT, CE" required={false} />
            <Field label="Contraseña"     name="contrasena"     value={form.contrasena}     onChange={handleChange} placeholder="••••••••" type="password" />

            <div>
              <label style={formLabelStyle}>Rol</label>
              <select name="rol" value={form.rol} onChange={handleChange} required
                style={{ ...inputStyle, background: 'white', cursor: 'pointer' }}
                onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={e =>  Object.assign(e.target.style, inputBlurStyle)}
              >
                <option value="">Seleccionar rol...</option>
                <option value="contratista">Contratista</option>
                <option value="supervisor">Supervisor</option>
                <option value="gerente">Gerente</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <button type="submit" disabled={loading} style={{ ...btnSuccess, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = colors.successHover }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = colors.success }}
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

function Field({ label, name, type = 'text', value, onChange, placeholder, required = true }) {
  return (
    <div>
      <label style={formLabelStyle}>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required} style={inputStyle}
        onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
        onBlur={e =>  Object.assign(e.target.style, inputBlurStyle)}
      />
    </div>
  )
}
