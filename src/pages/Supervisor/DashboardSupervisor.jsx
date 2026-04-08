import { useState } from 'react'
import { colors, radius, typography, shadows } from '../../theme'

const metricas = [
  { id: 'pendientes', valor: 40, etiqueta: 'Solicitudes\nPendientes', fondo: '#6B7280' },
  { id: 'aprobadas',  valor: 5,  etiqueta: 'Solicitudes\nAprobadas',  fondo: '#3F8D24' },
  { id: 'vencidas',   valor: 2,  etiqueta: 'Solicitudes\nVencidas',   fondo: '#C0392B' },
]

const contratistasConErrores = [
  { id: 1, nombre: 'Ricardo', errores: 5, solicitudes: 7,  avatar: '👱' },
  { id: 2, nombre: 'Angela',  errores: 4, solicitudes: 9,  avatar: '👩🏾' },
]

export default function DashboardSupervisor() {
  const [hoveredCard, setHoveredCard] = useState(null)

  return (
    <>
      <style>{`
        .sv-shell {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .sv-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .sv-metric {
          display: flex;
          align-items: center;
          gap: 14px;
          border-radius: ${radius.lg};
          padding: 18px 20px;
          color: ${colors.textWhite};
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: default;
        }

        .sv-metric:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.22);
        }

        .sv-metric-icon {
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          opacity: 0.92;
        }

        .sv-section-title {
          font-size: 18px;
          font-weight: 700;
          color: ${colors.textPrimary};
          margin: 0 0 16px;
        }

        .sv-contratista-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: ${colors.bgInput};
          border-radius: ${radius.lg};
          padding: 14px 20px;
          margin-bottom: 10px;
          border: 1px solid ${colors.border};
          transition: background 0.15s, box-shadow 0.15s, transform 0.15s;
          cursor: pointer;
        }

        .sv-contratista-card:hover {
          background: ${colors.bgCard};
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          transform: translateX(4px);
        }

        .sv-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #e0e7ef;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }

        @media (max-width: 700px) {
          .sv-metrics { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="sv-shell">

        {/* Métricas */}
        <div className="sv-metrics">
          {metricas.map(m => (
            <div
              key={m.id}
              className="sv-metric"
              style={{ background: m.fondo }}
            >
              <MoneyIcon color={m.fondo} />
              <div>
                <div style={{ fontSize: '38px', fontWeight: 800, lineHeight: 1 }}>{m.valor}</div>
                <div style={{ fontSize: typography.sm, fontWeight: 600, marginTop: 4, whiteSpace: 'pre-line', opacity: 0.9 }}>
                  {m.etiqueta}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contratistas con errores recurrentes */}
        <div style={{ background: colors.bgCard, borderRadius: radius.xl, boxShadow: shadows.card, padding: '24px' }}>
          <h2 className="sv-section-title">Contratistas con errores recurrentes</h2>

          {contratistasConErrores.map(c => (
            <div
              key={c.id}
              className="sv-contratista-card"
              onMouseEnter={() => setHoveredCard(c.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="sv-avatar">{c.avatar}</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: typography.md, color: colors.textPrimary }}>{c.nombre}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: typography.base,
                  color: colors.textSecondary,
                  fontWeight: 500,
                }}>
                  {c.errores} errores en {c.solicitudes} solicitudes
                </span>
              </div>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: hoveredCard === c.id ? colors.danger : 'transparent',
                flexShrink: 0,
                transition: 'background 0.2s',
              }} />
            </div>
          ))}
        </div>

      </div>
    </>
  )
}

function MoneyIcon({ color }) {
  const bg = color || '#6B7280'
  return (
    <svg className="sv-metric-icon" viewBox="0 0 52 52" fill="none">
      <rect x="6" y="12" width="40" height="26" rx="4" fill="rgba(255,255,255,0.92)" />
      <circle cx="26" cy="25" r="7" fill={bg} opacity="0.85" />
      <path d="M12 19c2 0 4-2 4-4M40 19c-2 0-4-2-4-4M12 31c2 0 4 2 4 4M40 31c-2 0-4 2-4 4"
        stroke={bg} strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}
