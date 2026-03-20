import { useMemo, useState } from 'react'
import { colors, radius, typography, shadows, inputStyle, inputFocusStyle, inputBlurStyle, thStyle } from '../../theme'

const HISTORIAL_SOLICITUDES = [
  {
    id: 'SOL-2026-001',
    contrato: '123456',
    nombreContrato: 'Contrato 1',
    fecha: '18/03/2026',
    estado: 'Aprobada',
    observacion: 'Documentación completa y validada.',
  },
  {
    id: 'SOL-2026-002',
    contrato: '143454',
    nombreContrato: 'Contrato 2',
    fecha: '12/03/2026',
    estado: 'En revisión',
    observacion: 'Pendiente revisión del supervisor.',
  },
  {
    id: 'SOL-2026-003',
    contrato: '156532',
    nombreContrato: 'Contrato 3',
    fecha: '02/03/2026',
    estado: 'Rechazada',
    observacion: 'Hace falta adjuntar la planilla de seguridad social.',
  },
]

const estadoStyles = {
  Aprobada: {
    background: '#EAF8EF',
    color: '#1E6E3A',
  },
  'En revisión': {
    background: '#FFF5DA',
    color: '#A16207',
  },
  Rechazada: {
    background: '#FEECEC',
    color: '#B42318',
  },
}

export default function Historial() {
  const [busqueda, setBusqueda] = useState('')
  const [hoveredRow, setHoveredRow] = useState(null)

  const resultados = useMemo(() => {
    const term = busqueda.toLowerCase()
    return HISTORIAL_SOLICITUDES.filter(
      (item) =>
        item.id.toLowerCase().includes(term) ||
        item.contrato.includes(busqueda) ||
        item.nombreContrato.toLowerCase().includes(term) ||
        item.estado.toLowerCase().includes(term)
    )
  }, [busqueda])

  return (
    <>
      <style>{`
        .hs-shell {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .hs-card {
          background: ${colors.bgCard};
          border-radius: 18px;
          box-shadow: ${shadows.card};
          padding: 22px 18px;
        }

        .hs-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .hs-table-wrap {
          overflow-x: auto;
          border-radius: ${radius.lg};
          border: 1px solid ${colors.border};
        }

        .hs-table {
          width: 100%;
          min-width: 840px;
          border-collapse: collapse;
        }
      `}</style>

      <section className="hs-shell">
        <div className="hs-card">
          <div className="hs-toolbar">
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', color: colors.textPrimary, fontWeight: 700 }}>
                Historial de solicitudes
              </h1>
              <p style={{ margin: '6px 0 0', color: colors.textSecondary, fontSize: typography.md }}>
                Consulta el estado y el detalle de las solicitudes de pago que ya enviaste.
              </p>
            </div>

            <input
              placeholder="Buscar por solicitud, contrato o estado..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ ...inputStyle, width: '300px', maxWidth: '100%' }}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
            />
          </div>

          <div className="hs-table-wrap">
            <table className="hs-table">
              <thead>
                <tr>
                  {['ID solicitud', 'Contrato', 'Fecha', 'Estado', 'Observación'].map((header) => (
                    <th key={header} style={thStyle}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resultados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: '28px 20px',
                        textAlign: 'center',
                        color: colors.textMuted,
                        fontSize: typography.base,
                      }}
                    >
                      No hay resultados para esa búsqueda.
                    </td>
                  </tr>
                ) : (
                  resultados.map((item, index) => (
                    <tr
                      key={item.id}
                      onMouseEnter={() => setHoveredRow(item.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        borderBottom: `1px solid ${colors.border}`,
                        background:
                          hoveredRow === item.id
                            ? colors.bgRowHover
                            : index % 2 === 0
                              ? colors.bgCard
                              : '#EEF4FF',
                      }}
                    >
                      <td style={{ padding: '16px 20px', color: colors.textPrimary, fontWeight: 700 }}>
                        {item.id}
                      </td>
                      <td style={{ padding: '16px 20px', color: colors.textSecondary }}>
                        <div style={{ fontWeight: 600, color: colors.textPrimary }}>{item.contrato}</div>
                        <div style={{ marginTop: 4 }}>{item.nombreContrato}</div>
                      </td>
                      <td style={{ padding: '16px 20px', color: colors.textSecondary }}>{item.fecha}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px 12px',
                            borderRadius: radius.full,
                            fontWeight: 700,
                            fontSize: typography.sm,
                            ...estadoStyles[item.estado],
                          }}
                        >
                          {item.estado}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', color: colors.textSecondary }}>
                        {item.observacion}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}
