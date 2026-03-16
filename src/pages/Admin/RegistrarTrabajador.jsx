import { useState } from 'react'

const initialForm = {
  nombre: '',
  correo: '',
  telefono: '',
  rol: '',
  usuario: '',
  contrasena: '',
}

export default function RegistrarTrabajador() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: POST /api/trabajadores
    console.log('Registrando trabajador:', form)
    setSubmitted(true)
    setTimeout(() => {
      setForm(initialForm)
      setSubmitted(false)
    }, 2500)
  }

  return (
    <div className="max-w-2xl">

      <h1 className="text-lg font-semibold text-[#1a2545] mb-6">Registrar Trabajador</h1>

      {/* Alerta de éxito */}
      {submitted && (
        <div className="alert-success mb-5 flex items-center gap-2">
          <span>✓</span> Trabajador registrado exitosamente.
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div className="grid grid-cols-2 gap-x-5 gap-y-4">

          <Field label="Nombre" name="nombre" value={form.nombre}
            onChange={handleChange} placeholder="Nombre completo" />

          <Field label="Correo" name="correo" type="email" value={form.correo}
            onChange={handleChange} placeholder="correo@empresa.com" />

          <Field label="Teléfono" name="telefono" type="tel" value={form.telefono}
            onChange={handleChange} placeholder="+57 300 000 0000" />

          <Field label="Rol" name="rol" value={form.rol}
            onChange={handleChange} placeholder="Ej: Contratista, Analista" />

          <Field label="Usuario" name="usuario" value={form.usuario}
            onChange={handleChange} placeholder="usuario123" />

          <Field label="Contraseña" name="contrasena" type="password" value={form.contrasena}
            onChange={handleChange} placeholder="••••••••" />

        </div>

        <div className="flex justify-end mt-6">
          <button type="submit" className="btn-success">
            Registrar
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, name, type = 'text', value, onChange, placeholder }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="input-clarity"
      />
    </div>
  )
}