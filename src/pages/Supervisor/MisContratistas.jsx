import { useState, useEffect } from 'react'
import { jsPDF } from 'jspdf'
import { colors, radius, typography, shadows } from '../../theme'
import { apiFetch } from '../../services/api'

export default function MisContratistas() {
  const [contratistas, setContratistas] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [hoveredCard, setHoveredCard]   = useState(null)
  const [menuOpen, setMenuOpen]         = useState(false)
  const [modalOpen, setModalOpen]       = useState(false)
  const [seleccionado, setSeleccionado] = useState(null)

  useEffect(() => {
    apiFetch('/api/contratos')
      .then(async ({ contratos }) => {
        const actoresPromises = contratos.map(c =>
          apiFetch(`/api/contratos/${c.contrato_id}/actores`)
            .then(d => d.actores)
            .catch(() => [])
        )
        const todosActores = (await Promise.all(actoresPromises)).flat()
        // Filtrar solo Contratistas y deduplicar por usuario_id
        const vistos = new Set()
        const unicos = todosActores
          .filter(a => a.tipo_actor === 'Contratista')
          .filter(a => {
            if (vistos.has(a.usuario_id)) return false
            vistos.add(a.usuario_id)
            return true
          })
        setContratistas(unicos)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleVerInformacion = (c) => {
    setSeleccionado(c)
    setModalOpen(true)
  }

  const handleDescargar = (c) => {
    const doc = new jsPDF()
    doc.setFontSize(22)
    doc.text('Perfil de Contratista', 20, 30)
    doc.setLineWidth(0.5)
    doc.line(20, 35, 190, 35)
    doc.setFontSize(12)
    doc.text(`Nombre: ${c.nombre}`, 20, 50)
    doc.text(`Correo: ${c.correo}`, 20, 60)
    doc.text(`Identificación: ${c.identificacion}`, 20, 70)
    doc.text(`Tipo documento: ${c.tipo_documento || '—'}`, 20, 80)
    doc.text(`Estado: ${c.activo ? 'Activo' : 'Inactivo'}`, 20, 90)
    doc.save(`Contratista_${c.nombre.replace(/\s+/g, '_')}.pdf`)
  }

  function getInitials(nombre = '') {
    return nombre.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '??'
  }

  return (
    <>
      <style>{`
        .mc-shell { width: 100%; }
        .mc-card { display: flex; align-items: center; gap: 16px; background: ${colors.bgInput}; border: 1px solid ${colors.border}; border-radius: ${radius.xl}; padding: 16px 20px; margin-bottom: 12px; transition: box-shadow 0.18s, background 0.18s, transform 0.18s; cursor: default; width: 100%; box-sizing: border-box; }
        .mc-card:hover { background: ${colors.bgCard}; box-shadow: 0 6px 20px rgba(0,0,0,0.08); transform: translateY(-1px); }
        .mc-avatar { width: 54px; height: 54px; border-radius: 50%; background: #e0e7ef; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; color: ${colors.navy}; flex-shrink: 0; border: 2px solid ${colors.border}; }
        .mc-actions { display: flex; gap: 24px; margin-left: auto; align-items: center; }
        .mc-action-btn { display: flex; flex-direction: column; align-items: center; gap: 4px; background: none; border: none; cursor: pointer; font-family: inherit; padding: 0; }
        .mc-action-icon { width: 38px; height: 38px; border-radius: ${radius.md}; display: flex; align-items: center; justify-content: center; transition: opacity 0.15s, transform 0.15s; }
        .mc-action-icon:hover { opacity: 0.85; transform: scale(1.06); }
        .mc-action-label { font-size: 10px; color: ${colors.textSecondary}; font-weight: 500; text-align: center; line-height: 1.2; }
        .mc-dots-menu { position: relative; }
        .mc-dots-dropdown { position: absolute; right: 0; top: 28px; background: ${colors.bgCard}; border: 1px solid ${colors.border}; border-radius: ${radius.md}; box-shadow: 0 8px 24px rgba(0,0,0,0.12); min-width: 160px; z-index: 10; overflow: hidden; }
        .mc-dots-item { display: block; width: 100%; text-align: left; padding: 10px 16px; font-size: ${typography.sm}; color: ${colors.textPrimary}; background: none; border: none; cursor: pointer; font-family: inherit; transition: background 0.1s; }
        .mc-dots-item:hover { background: ${colors.bgInput}; }
        .mc-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 999; }
        .mc-modal-content { background: ${colors.bgCard}; padding: 24px; border-radius: ${radius.xl}; width: 90%; max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        @media (max-width: 560px) { .mc-card { flex-wrap: wrap; justify-content: center; text-align: center; } .mc-actions { margin-left: 0; width: 100%; justify-content: center; } }
      `}</style>

      <div className="mc-shell">
        <div style={{ background: colors.bgCard, borderRadius: radius.xl, boxShadow: shadows.card, padding: '24px 28px 28px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: colors.textPrimary, lineHeight: 1.2 }}>
              Mis<br />contratistas
            </h1>
            <div className="mc-dots-menu">
              <button
                id="btn-contratistas-menu"
                onClick={() => setMenuOpen(o => !o)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: colors.textMuted, padding: '4px 8px', borderRadius: radius.md, lineHeight: 1 }}
                onMouseEnter={e => e.currentTarget.style.background = colors.bgInput}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                ⋮
              </button>
              {menuOpen && (
                <div className="mc-dots-dropdown">
                  <button className="mc-dots-item" onClick={() => setMenuOpen(false)}>Exportar lista</button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: radius.md, color: '#ef4444', fontSize: typography.sm }}>
              {error}
            </div>
          )}

          {loading ? (
            <p style={{ color: colors.textMuted }}>Cargando contratistas...</p>
          ) : contratistas.length === 0 ? (
            <p style={{ color: colors.textMuted }}>No hay contratistas en tus contratos.</p>
          ) : (
            contratistas.map(c => (
              <div
                key={c.usuario_id}
                className="mc-card"
                onMouseEnter={() => setHoveredCard(c.usuario_id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="mc-avatar">{getInitials(c.nombre)}</div>

                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: typography.md, color: colors.textPrimary }}>
                    {c.nombre}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: typography.xs, color: colors.textSecondary }}>
                    {c.correo}
                  </p>
                </div>

                <div className="mc-actions">
                  <button className="mc-action-btn" id={`btn-ver-${c.usuario_id}`} title="Ver información" onClick={() => handleVerInformacion(c)}>
                    <div className="mc-action-icon" style={{ background: '#2E7D32' }}><EyeIcon /></div>
                    <span className="mc-action-label">Ver<br/>información</span>
                  </button>
                  <button className="mc-action-btn" id={`btn-descargar-${c.usuario_id}`} title="Descargar PDF" onClick={() => handleDescargar(c)}>
                    <div className="mc-action-icon" style={{ background: '#1A2C6B' }}><DownloadIcon /></div>
                    <span className="mc-action-label">Descargar<br/>información</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {modalOpen && seleccionado && (
        <div className="mc-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="mc-modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, color: colors.textPrimary }}>Perfil de Contratista</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div className="mc-avatar" style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                {getInitials(seleccionado.nombre)}
              </div>
              <div>
                <strong style={{ display: 'block', color: colors.textPrimary }}>{seleccionado.nombre}</strong>
                <span style={{ fontSize: typography.sm, color: colors.textSecondary }}>{seleccionado.correo}</span>
              </div>
            </div>
            <hr style={{ border: `0.5px solid ${colors.border}`, marginBottom: '16px' }} />
            <p style={{ color: colors.textPrimary, margin: '8px 0' }}><strong>Identificación:</strong> {seleccionado.identificacion}</p>
            <p style={{ color: colors.textPrimary, margin: '8px 0' }}><strong>Tipo documento:</strong> {seleccionado.tipo_documento || '—'}</p>
            <p style={{ color: colors.textPrimary, margin: '8px 0' }}>
              <strong>Estado:</strong>
              <span style={{ color: seleccionado.activo ? '#2E7D32' : '#D32F2F', marginLeft: '6px' }}>
                {seleccionado.activo ? 'Activo' : 'Inactivo'}
              </span>
            </p>
            <button
              onClick={() => setModalOpen(false)}
              style={{ marginTop: '24px', width: '100%', padding: '12px', background: colors.bgInput, border: `1px solid ${colors.border}`, borderRadius: radius.md, cursor: 'pointer', fontWeight: 'bold', color: colors.textPrimary }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function EyeIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4C5.5 4 2 10 2 10s3.5 6 8 6 8-6 8-6-3.5-6-8-6z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="10" cy="10" r="2.5" stroke="white" strokeWidth="1.5" /></svg>
}

function DownloadIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3v10M6 9l4 4 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 15h14" stroke="white" strokeWidth="1.8" strokeLinecap="round" /></svg>
}
