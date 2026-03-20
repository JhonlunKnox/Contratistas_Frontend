import { useState } from 'react'
import { colors, radius, typography, shadows, inputStyle, inputFocusStyle, inputBlurStyle, thStyle } from '../../theme'

const CONTRATOS_MOCK = [
  { id: 5, fechaInicial: '22/04/2022', fechaFinal: '20/05/2026', cargo: 'Atención al Cliente',  monto: '$3.000.000' },
  { id: 9, fechaInicial: '10/08/2023', fechaFinal: '22/04/2028', cargo: 'Gestión de Consultas', monto: '$4.500.000' },
]

export default function MisContratos() {
  const [contratos]                 = useState(CONTRATOS_MOCK)
  const [filtro, setFiltro]         = useState('')
  const [hoveredRow, setHoveredRow] = useState(null)

  const filtrados = contratos.filter(c =>
    c.cargo.toLowerCase().includes(filtro.toLowerCase()) ||
    String(c.id).includes(filtro)
  )

  return (
    <>
      <style>{`
        /* Tabla → cards en móvil */
        .mc-table-wrap { background: ${colors.bgCard}; border-radius: ${radius.lg}; box-shadow: ${shadows.card}; overflow: hidden; }
        .mc-table { width: 100%; border-collapse: collapse; }
        .mc-table thead { display: table-header-group; }
        .mc-table tbody tr { display: table-row; }
        .mc-table td, .mc-table th { display: table-cell; }

        .mc-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 12px; flex-wrap: wrap; }

        @media (max-width: 640px) {
          .mc-table thead { display: none; }
          .mc-table-wrap { background: transparent; box-shadow: none; border-radius: 0; overflow: visible; }
          .mc-table, .mc-table tbody { display: block; width: 100%; }
          .mc-table tbody tr {
            display: block;
            background: ${colors.bgCard};
            border-radius: ${radius.lg};
            box-shadow: ${shadows.card};
            margin-bottom: 12px;
            padding: 16px;
          }
          .mc-table td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0 !important;
            border-bottom: 1px solid ${colors.border};
            font-size: 13px;
          }
          .mc-table td:last-child { border-bottom: none; }
          .mc-table td::before {
            content: attr(data-label);
            font-size: 11px;
            font-weight: 600;
            color: ${colors.textMuted};
            text-transform: uppercase;
            letter-spacing: 0.4px;
            flex-shrink: 0;
            margin-right: 12px;
          }
          .mc-header { flex-direction: column; align-items: flex-start; }
          .mc-header input { width: 100% !important; }
        }
      `}</style>

      <div style={{ maxWidth: '860px' }}>

        <div className="mc-header">
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

        <div className="mc-table-wrap">
          <table className="mc-table">
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
                  <tr key={c.id}
                    onMouseEnter={() => setHoveredRow(c.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      borderBottom: `1px solid ${colors.border}`,
                      background: hoveredRow === c.id ? colors.bgRowHover : i % 2 === 0 ? colors.bgCard : colors.bgRowAlt,
                      transition: 'background 0.15s',
                    }}
                  >
                    <td data-label="ID" style={{ padding: '14px 20px', textAlign: 'center', color: colors.textSecondary, fontWeight: 500 }}>{c.id}</td>
                    <td data-label="Fecha inicial" style={{ padding: '14px 20px', color: colors.textSecondary }}>{c.fechaInicial}</td>
                    <td data-label="Fecha final"   style={{ padding: '14px 20px', color: colors.textSecondary }}>{c.fechaFinal}</td>
                    <td data-label="Cargo"         style={{ padding: '14px 20px', color: colors.textPrimary }}>{c.cargo}</td>
                    <td data-label="Monto"         style={{ padding: '14px 20px', color: colors.textPrimary, fontWeight: 600 }}>{c.monto}</td>
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
    </>
  )
}