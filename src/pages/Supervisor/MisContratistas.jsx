import { useState } from 'react'
import { colors, radius, typography, shadows } from '../../theme'

const contratistas = [
  { id: 1, nombre: 'Ricardo', rol: 'Product Manager',  avatar: '👱' },
  { id: 2, nombre: 'Angela',  rol: 'Sales Executive',   avatar: '👩🏾' },
  { id: 3, nombre: 'Damian',  rol: 'UI UX Designer',    avatar: '👨🏾‍🦱' },
]

export default function MisContratistas() {
  const [hoveredCard, setHoveredCard] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <style>{`
        .mc-shell {
          max-width: 860px;
        }

        .mc-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: ${colors.bgInput};
          border: 1px solid ${colors.border};
          border-radius: ${radius.xl};
          padding: 16px 20px;
          margin-bottom: 12px;
          transition: box-shadow 0.18s, background 0.18s, transform 0.18s;
          cursor: default;
        }

        .mc-card:hover {
          background: ${colors.bgCard};
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
          transform: translateY(-1px);
        }

        .mc-avatar {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #e0e7ef;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          flex-shrink: 0;
          border: 2px solid ${colors.border};
        }

        .mc-actions {
          display: flex;
          gap: 24px;
          margin-left: auto;
          align-items: center;
        }

        .mc-action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
        }

        .mc-action-icon {
          width: 38px;
          height: 38px;
          border-radius: ${radius.md};
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.15s, transform 0.15s;
        }

        .mc-action-icon:hover {
          opacity: 0.85;
          transform: scale(1.06);
        }

        .mc-action-label {
          font-size: 10px;
          color: ${colors.textSecondary};
          font-weight: 500;
          text-align: center;
          line-height: 1.2;
        }

        .mc-dots-menu {
          position: relative;
        }

        .mc-dots-dropdown {
          position: absolute;
          right: 0;
          top: 28px;
          background: ${colors.bgCard};
          border: 1px solid ${colors.border};
          border-radius: ${radius.md};
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          min-width: 160px;
          z-index: 10;
          overflow: hidden;
        }

        .mc-dots-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 10px 16px;
          font-size: ${typography.sm};
          color: ${colors.textPrimary};
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.1s;
        }

        .mc-dots-item:hover {
          background: ${colors.bgInput};
        }

        @media (max-width: 560px) {
          .mc-card { flex-wrap: wrap; }
          .mc-actions { margin-left: 0; width: 100%; justify-content: flex-end; }
        }
      `}</style>

      <div className="mc-shell">

        {/* Encabezado */}
        <div style={{
          background: colors.bgCard,
          borderRadius: radius.xl,
          boxShadow: shadows.card,
          padding: '24px 28px 28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: colors.textPrimary, lineHeight: 1.2 }}>
              Mis<br />contratistas
            </h1>

            {/* Menú de 3 puntos */}
            <div className="mc-dots-menu">
              <button
                id="btn-contratistas-menu"
                onClick={() => setMenuOpen(o => !o)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '22px', color: colors.textMuted, padding: '4px 8px',
                  borderRadius: radius.md, lineHeight: 1,
                }}
                onMouseEnter={e => e.currentTarget.style.background = colors.bgInput}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                ⋮
              </button>
              {menuOpen && (
                <div className="mc-dots-dropdown">
                  <button className="mc-dots-item" onClick={() => setMenuOpen(false)}>Agregar contratista</button>
                  <button className="mc-dots-item" onClick={() => setMenuOpen(false)}>Exportar lista</button>
                  <button className="mc-dots-item" onClick={() => setMenuOpen(false)}>Filtrar</button>
                </div>
              )}
            </div>
          </div>

          {/* Tarjetas de contratistas */}
          {contratistas.map(c => (
            <div
              key={c.id}
              className="mc-card"
              onMouseEnter={() => setHoveredCard(c.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Avatar */}
              <div className="mc-avatar">{c.avatar}</div>

              {/* Info */}
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: typography.md, color: colors.textPrimary }}>
                  {c.nombre}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: typography.xs, color: colors.textSecondary }}>
                  Role : {c.rol}
                </p>
              </div>

              {/* Acciones */}
              <div className="mc-actions">
                {/* Ver información */}
                <button className="mc-action-btn" id={`btn-ver-${c.id}`} title="Ver información">
                  <div className="mc-action-icon" style={{ background: '#2E7D32' }}>
                    <EyeIcon />
                  </div>
                  <span className="mc-action-label">Ver<br/>información</span>
                </button>

                {/* Descargar */}
                <button className="mc-action-btn" id={`btn-descargar-${c.id}`} title="Descargar información">
                  <div className="mc-action-icon" style={{ background: '#1A2C6B' }}>
                    <DownloadIcon />
                  </div>
                  <span className="mc-action-label">Descargar<br/>información</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 4C5.5 4 2 10 2 10s3.5 6 8 6 8-6 8-6-3.5-6-8-6z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="2.5" stroke="white" strokeWidth="1.5" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3v10M6 9l4 4 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 15h14" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
