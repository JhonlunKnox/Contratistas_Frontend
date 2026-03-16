import { useState } from 'react'
import { colors, radius, typography, cardStyle, formLabelStyle, inputStyle, inputFocusStyle, inputBlurStyle, btnSuccess } from '../../theme'

const initialForm = {
  nombre: '', correo: '', telefono: '',
  rol: '', usuario: '', contrasena: '',
}

export default function RegistrarTrabajador() {
  const [form, setForm]           = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Registrando:', form)
    setSubmitted(true)
    setTimeout(() => { setForm(initialForm); setSubmitted(false) }, 2500)
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

        {submitted && (
          <div style={{ marginBottom: 16, padding: '12px 16px', background: colors.successLight, border: `1px solid ${colors.successBorder}`, borderRadius: radius.md, color: colors.successText, fontSize: typography.sm, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>✓</span> Trabajador registrado exitosamente.
          </div>
        )}

        <form onSubmit={handleSubmit} style={cardStyle}>
          <div className="rt-grid">
            <Field label="Nombre"     name="nombre"     value={form.nombre}     onChange={handleChange} placeholder="Nombre completo" />
            <Field label="Correo"     name="correo"     value={form.correo}     onChange={handleChange} placeholder="correo@empresa.com" type="email" />
            <Field label="Teléfono"   name="telefono"   value={form.telefono}   onChange={handleChange} placeholder="+57 300 000 0000" type="tel" />
            <Field label="Rol"        name="rol"        value={form.rol}        onChange={handleChange} placeholder="Ej: Contratista, Analista" />
            <Field label="Usuario"    name="usuario"    value={form.usuario}    onChange={handleChange} placeholder="usuario123" />
            <Field label="Contraseña" name="contrasena" value={form.contrasena} onChange={handleChange} placeholder="••••••••" type="password" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <button type="submit" style={btnSuccess}
              onMouseEnter={e => e.currentTarget.style.background = colors.successHover}
              onMouseLeave={e => e.currentTarget.style.background = colors.success}
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

function Field({ label, name, type = 'text', value, onChange, placeholder }) {
  return (
    <div>
      <label style={formLabelStyle}>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required style={inputStyle}
        onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
        onBlur={e =>  Object.assign(e.target.style, inputBlurStyle)}
      />
    </div>
  )
}