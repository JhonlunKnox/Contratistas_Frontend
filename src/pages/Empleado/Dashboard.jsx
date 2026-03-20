import { useState } from 'react'
import { colors, radius, typography, shadows, thStyle } from '../../theme'

const metricas = [
  {
    id: 'actividades',
    valor: '2',
    etiqueta: '# Tipo Actividades',
    fondo: '#31489C',
    icono: <BriefcaseIcon />,
  },
  {
    id: 'dias',
    valor: '21',
    etiqueta: 'Dia Mes Vencido',
    fondo: '#222222',
    icono: <DocumentIcon />,
  },
  {
    id: 'aprobadas',
    valor: '5',
    etiqueta: '# Solicitudes Aprobadas',
    fondo: '#3F8D24',
    icono: <MoneyIcon />,
  },
]

const ultimaSolicitud = {
  id: '146345',
  fecha: '22/04/2022',
  estado: 'En revision',
  encargado: 'Luis Contreras',
}

export default function Dashboard() {
  const [hoveredRow, setHoveredRow] = useState(null)

  return (
    <>
      <style>{`
        .db-shell {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .db-card {
          background: ${colors.bgCard};
          border-radius: 18px;
          box-shadow: ${shadows.card};
          padding: 24px 18px 28px;
        }

        .db-metrics {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin: 22px 0 26px;
        }

        .db-metric {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-radius: ${radius.lg};
          padding: 16px 18px;
          color: ${colors.textWhite};
          box-shadow: 0 10px 18px rgba(0, 0, 0, 0.14);
        }

        .db-status {
          display: flex;
          align-items: center;
          gap: 26px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .db-dot {
          width: 16px;
          height: 16px;
          border-radius: ${radius.full};
          display: inline-block;
        }

        .db-table-wrap {
          overflow-x: auto;
          border-radius: ${radius.lg};
          border: 1px solid ${colors.border};
          background: ${colors.bgCard};
        }

        .db-table {
          width: 100%;
          min-width: 720px;
          border-collapse: collapse;
        }

        @media (max-width: 900px) {
          .db-metrics {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="db-shell">
        <div className="db-card">
          <h1 style={{ margin: 0, fontSize: '30px', color: colors.textPrimary, fontWeight: 700 }}>
            Dashboard Principal
          </h1>

          <div className="db-metrics">
            {metricas.map((metrica) => (
              <article key={metrica.id} className="db-metric" style={{ background: metrica.fondo }}>
                <div style={{ width: 48, height: 48, flexShrink: 0 }}>{metrica.icono}</div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '44px', lineHeight: 1, fontWeight: 800 }}>{metrica.valor}</div>
                  <div style={{ marginTop: 6, fontSize: typography.sm, fontWeight: 600 }}>{metrica.etiqueta}</div>
                </div>
              </article>
            ))}
          </div>

          <section>
            <h2 style={{ margin: '0 0 16px', fontSize: '22px', color: colors.textPrimary, fontWeight: 700 }}>
              Ultima Solicitud
            </h2>

            <div className="db-status">
              <Legend color="#F5B417" label="Pendiente Supervisor" />
              <Legend color="#3F9CAA" label="Pendiente Gerente" />
              <Legend color="#F21C15" label="Rechazada" />
              <Legend color="#4A972A" label="Aprobada" />
            </div>

            <div className="db-table-wrap">
              <table className="db-table">
                <thead>
                  <tr>
                    {['Id Solicitud', 'Fecha Solicitud', 'Estado', 'Encargado', 'Accion'].map((header) => (
                      <th key={header} style={thStyle}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr
                    onMouseEnter={() => setHoveredRow(ultimaSolicitud.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      background: hoveredRow === ultimaSolicitud.id ? colors.bgRowHover : colors.bgCard,
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    <td style={tdStyle(true)}>{ultimaSolicitud.id}</td>
                    <td style={tdStyle()}>{ultimaSolicitud.fecha}</td>
                    <td style={tdStyle()}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 110,
                          padding: '10px 12px',
                          borderRadius: radius.md,
                          background: colors.primary,
                          color: colors.primaryText,
                          fontWeight: 700,
                          boxShadow: '0 8px 14px rgba(245, 192, 32, 0.22)',
                        }}
                      >
                        En revision
                      </span>
                    </td>
                    <td style={tdStyle()}>{ultimaSolicitud.encargado}</td>
                    <td style={tdStyle()}>
                      <button
                        type="button"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: colors.textPrimary,
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          fontSize: typography.base,
                        }}
                      >
                        Ver Solicitud
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </>
  )
}

function Legend({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span className="db-dot" style={{ background: color }} />
      <span style={{ color: colors.textPrimary, fontSize: typography.base, fontWeight: 500 }}>{label}</span>
    </div>
  )
}

function tdStyle(emphasis = false) {
  return {
    padding: '16px 20px',
    color: emphasis ? colors.textPrimary : colors.textSecondary,
    fontWeight: emphasis ? 700 : 500,
  }
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect x="5" y="13" width="38" height="24" rx="4" fill="rgba(255,255,255,0.95)" />
      <path d="M18 13V10.5C18 8.57 19.57 7 21.5 7h5C28.43 7 30 8.57 30 10.5V13" stroke="#31489C" strokeWidth="2.2" />
      <path d="M5 22h38" stroke="#31489C" strokeWidth="2.2" />
    </svg>
  )
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" style={{ width: '100%', height: '100%' }}>
      <path d="M13 6h15l8 8v28H13V6z" fill="rgba(255,255,255,0.95)" />
      <path d="M28 6v9h8" fill="none" stroke="#222222" strokeWidth="2.2" />
      <path d="M18 22h12M18 28h12M18 34h8" stroke="#222222" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function MoneyIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect x="6" y="11" width="36" height="24" rx="4" fill="rgba(255,255,255,0.95)" />
      <circle cx="24" cy="23" r="6" fill="#3F8D24" />
      <path d="M12 18c2 0 4-2 4-4M36 18c-2 0-4-2-4-4M12 28c2 0 4 2 4 4M36 28c-2 0-4 2-4 4" stroke="#3F8D24" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}
