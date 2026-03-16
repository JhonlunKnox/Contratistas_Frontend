import { useState } from 'react'

// Datos mockeados — reemplazar con fetch a la API
const CONTRATOS_MOCK = [
  {
    id: 5,
    fechaInicial: '22/04/2022',
    fechaFinal: '20/05/2026',
    cargo: 'Atención al Cliente',
    monto: '$3.000.000',
  },
  {
    id: 9,
    fechaInicial: '10/08/2023',
    fechaFinal: '22/04/2028',
    cargo: 'Gestión de Consultas',
    monto: '$4.500.000',
  },
]

export default function MisContratos() {
  const [contratos] = useState(CONTRATOS_MOCK)
  const [filtro, setFiltro] = useState('')

  const contratosFiltrados = contratos.filter(c =>
    c.cargo.toLowerCase().includes(filtro.toLowerCase()) ||
    String(c.id).includes(filtro)
  )

  return (
    <div className="max-w-4xl">

      <div className="flex items-center justify-between mb-5">
        <h1 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-lg)' }}
            className="font-semibold">
          Mis Contratos
        </h1>
        <div className="flex items-center gap-2">
          <input
            placeholder="Filtrar por cargo o ID..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            className="input-clarity w-48"
            style={{ padding: '6px 12px' }}
          />
          <button style={{ color: 'var(--color-text-muted)', fontSize: '18px' }}
                  className="hover:opacity-70 transition px-1 bg-transparent border-none cursor-pointer">
            ⊟
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="w-full" style={{ fontSize: 'var(--font-size-base)' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-row-alt)', borderBottom: '1px solid var(--color-border)' }}>
              {['ID de contrato','Fecha inicial','Fecha final','Cargo','Monto'].map(h => (
                <th key={h} className="text-left px-5 py-3"
                    style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600,
                             color: 'var(--color-text-muted)', textTransform: 'uppercase',
                             letterSpacing: '0.4px' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contratosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10"
                    style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                  No se encontraron contratos.
                </td>
              </tr>
            ) : (
              contratosFiltrados.map((c, i) => (
                <tr key={c.id}
                    style={{
                      borderBottom: `1px solid var(--color-border)`,
                      background: i % 2 === 0 ? 'var(--color-bg-card)' : 'var(--color-bg-row-alt)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-hover-row)'}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'var(--color-bg-card)' : 'var(--color-bg-row-alt)'}
                >
                  <td className="px-5 py-3.5 text-center font-medium"
                      style={{ color: 'var(--color-text-secondary)' }}>{c.id}</td>
                  <td className="px-5 py-3.5" style={{ color: 'var(--color-text-secondary)' }}>{c.fechaInicial}</td>
                  <td className="px-5 py-3.5" style={{ color: 'var(--color-text-secondary)' }}>{c.fechaFinal}</td>
                  <td className="px-5 py-3.5" style={{ color: 'var(--color-text-primary)' }}>{c.cargo}</td>
                  <td className="px-5 py-3.5 font-semibold"
                      style={{ color: 'var(--color-text-primary)' }}>{c.monto}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Contador */}
      <p className="mt-3" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
        {contratosFiltrados.length} contrato{contratosFiltrados.length !== 1 ? 's' : ''} encontrado{contratosFiltrados.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}