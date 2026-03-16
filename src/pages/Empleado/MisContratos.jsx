import { useState } from 'react'
import { colors, radius, typography, shadows, inputStyle, inputFocusStyle, inputBlurStyle, thStyle } from '../../theme'

const CONTRATOS_MOCK = [
  { id: 5, fechaInicial: '22/04/2022', fechaFinal: '20/05/2026', cargo: 'Atención al Cliente',  monto: '$3.000.000' },
  { id: 9, fechaInicial: '10/08/2023', fechaFinal: '22/04/2028', cargo: 'Gestión de Consultas', monto: '$4.500.000' },
]

export default function MisContratos() {
  const [contratos]              = useState(CONTRATOS_MOCK)
  const [filtro, setFiltro]       = useState('')
  const [hoveredRow, setHoveredRow] = useState(null)

  const filtrados = contratos.filter(c =>
    c.cargo.toLowerCase().includes(filtro.toLowerCase()) ||
    String(c.id).includes(filtro)
  )

  return (
    <div style={{ maxWidth: '860px' }}>

      {/* Cabecera */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: typography.xl, fontWeight: 600, color: colors.textPrimary }}>
          Mis Contratos
        </h1>
        <input
          placeholder="Filtrar por cargo o ID..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={{ ...inputStyle, width: '200px', padding: '7px 12px' }}
          onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
          onBlur={e =>  Object.assign(e.target.style, inputBlurStyle)}
        />
      </div>

      {/* Tabla */}
      <div style={{ background: colors.bgCard, borderRadius: radius.lg, boxShadow: shadows.card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['ID de contrato', 'Fecha inicial', 'Fecha final', 'Cargo', 'Monto'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 40, color: colors.textMuted, fontSize: typography.sm }}>
                  No se encontraron contratos.
                </td>
              </tr>
            ) : (
              filtrados.map((c, i) => (
                <tr
                  key={c.id}
                  onMouseEnter={() => setHoveredRow(c.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    borderBottom: `1px solid ${colors.border}`,
                    background: hoveredRow === c.id
                      ? colors.bgRowHover
                      : i % 2 === 0 ? colors.bgCard : colors.bgRowAlt,
                    transition: 'background 0.15s',
                  }}
                >
                  <td style={{ padding: '14px 20px', textAlign: 'center', color: colors.textSecondary, fontWeight: 500 }}>{c.id}</td>
                  <td style={{ padding: '14px 20px', color: colors.textSecondary }}>{c.fechaInicial}</td>
                  <td style={{ padding: '14px 20px', color: colors.textSecondary }}>{c.fechaFinal}</td>
                  <td style={{ padding: '14px 20px', color: colors.textPrimary }}>{c.cargo}</td>
                  <td style={{ padding: '14px 20px', color: colors.textPrimary, fontWeight: 600 }}>{c.monto}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 10, fontSize: typography.xs, color: colors.textMuted }}>
        {filtrados.length} contrato{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}