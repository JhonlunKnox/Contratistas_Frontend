import { useState, useEffect } from 'react'
import { colors, radius, typography, shadows } from '../../theme'
import { apiFetch } from '../../services/api'

const ESTADO_OPTIONS = ['Aprobar', 'Devolver', 'Pendiente']
const ESTADO_DB_MAP  = { Aprobar: 'Aprobado', Devolver: 'No Aprobado', Pendiente: 'Pendiente' }

export default function SolicitudesSupervisor() {
  const [solicitudes, setSolicitudes]     = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')

  // Modal revisión
  const [selected, setSelected]           = useState(null)
  const [evidencias, setEvidencias]       = useState([])
  const [loadingEv, setLoadingEv]         = useState(false)
  const [estadoDropdown, setEstadoDropdown] = useState(false)
  const [nuevoEstado, setNuevoEstado]     = useState('')
  const [comentario, setComentario]       = useState('')
  const [confirmando, setConfirmando]     = useState(false)
  const [errorModal, setErrorModal]       = useState('')

  // Modal filtro
  const [filterOpen, setFilterOpen]       = useState(false)
  const [filter, setFilter]               = useState({ contratista: '', fecha: '' })
  const [tempFilter, setTempFilter]       = useState({ contratista: '', fecha: '' })

  useEffect(() => {
    apiFetch('/api/solicitudes')
      .then(({ solicitudes: all }) => {
        setSolicitudes(all.filter(s => s.estado === 'Pendiente'))
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const openModal = async (s) => {
    setSelected(s)
    setNuevoEstado('')
    setComentario('')
    setEstadoDropdown(false)
    setErrorModal('')
    setEvidencias([])
    setLoadingEv(true)
    try {
      const data = await apiFetch(`/api/solicitudes/${s.solicitud_id}/evidencias`)
      setEvidencias(data.evidencias)
    } catch {
      // lista vacía
    } finally {
      setLoadingEv(false)
    }
  }

  const closeModal = () => { setSelected(null); setErrorModal('') }

  const handleConfirmar = async () => {
    if (!nuevoEstado) return
    setConfirmando(true)
    setErrorModal('')
    try {
      await apiFetch(`/api/solicitudes/${selected.solicitud_id}`, {
        method: 'PUT',
        body: JSON.stringify({ estado: ESTADO_DB_MAP[nuevoEstado], comentario: comentario || null }),
      })
      setSolicitudes(prev => prev.filter(s => s.solicitud_id !== selected.solicitud_id))
      closeModal()
    } catch (err) {
      setErrorModal(err.message || 'Error al actualizar la solicitud')
    } finally {
      setConfirmando(false)
    }
  }

  const applyFilter  = () => { setFilter(tempFilter); setFilterOpen(false) }
  const cancelFilter = () => { setTempFilter(filter); setFilterOpen(false) }

  const displayed = solicitudes.filter(s => {
    if (filter.contratista && !(s.nombre_contratista || '').toLowerCase().includes(filter.contratista.toLowerCase())) return false
    if (filter.fecha && !new Date(s.created_at).toLocaleDateString('es-CO').includes(filter.fecha)) return false
    return true
  })

  return (
    <>
      <style>{`
        .sol-wrap { width: 100%; }
        .sol-table-wrap { border-radius: ${radius.xl}; background: ${colors.bgCard}; box-shadow: ${shadows.card}; overflow: hidden; }
        .sol-header-row { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 16px; }
        .sol-table { width: 100%; border-collapse: collapse; }
        .sol-th { text-align: left; padding: 12px 16px; font-size: ${typography.xs}; font-weight: 600; color: ${colors.textMuted}; text-transform: uppercase; letter-spacing: 0.4px; background: ${colors.bgInput}; border-bottom: 1px solid ${colors.border}; }
        .sol-td { padding: 14px 16px; font-size: ${typography.base}; color: ${colors.textSecondary}; border-bottom: 1px solid ${colors.border}; }
        .sol-td.emphasis { font-weight: 700; color: ${colors.textPrimary}; }
        .sol-row:hover { background: ${colors.bgRowHover}; }
        .sol-row:last-child td { border-bottom: none; }
        .sol-btn-revisar { padding: 7px 14px; background: #D6E4FF; color: #1A2C6B; border: none; border-radius: ${radius.md}; font-size: ${typography.xs}; font-weight: 700; cursor: pointer; font-family: inherit; white-space: nowrap; transition: background 0.15s; }
        .sol-btn-revisar:hover { background: #B3CCFF; }
        .sol-filter-btn { background: none; border: none; cursor: pointer; color: ${colors.textSecondary}; padding: 6px 8px; border-radius: ${radius.md}; font-size: 18px; transition: background 0.15s; }
        .sol-filter-btn:hover { background: ${colors.bgInput}; }
        .sol-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 16px; }
        .sol-modal { background: ${colors.bgCard}; border-radius: ${radius.xl}; width: 100%; max-width: 520px; box-shadow: 0 20px 60px rgba(0,0,0,0.22); overflow: hidden; animation: sol-pop 0.18s ease; }
        @keyframes sol-pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .sol-modal-head { background: ${colors.navy}; padding: 18px 24px; }
        .sol-modal-body { padding: 20px 24px 24px; }
        .sol-input-ro { width: 100%; padding: 8px 12px; background: #E8EFFE; border: none; border-radius: ${radius.md}; font-size: ${typography.base}; color: ${colors.textPrimary}; font-family: inherit; box-sizing: border-box; }
        .sol-textarea { width: 100%; min-height: 80px; resize: vertical; padding: 10px 12px; border: 1px solid ${colors.borderInput}; border-radius: ${radius.md}; font-size: ${typography.base}; font-family: inherit; color: ${colors.textPrimary}; background: ${colors.bgInput}; outline: none; box-sizing: border-box; transition: border-color 0.15s, box-shadow 0.15s; }
        .sol-textarea:focus { border-color: ${colors.borderFocus}; box-shadow: 0 0 0 3px ${colors.focusShadow}; }
        .sol-modal-footer { display: flex; gap: 10px; align-items: center; margin-top: 20px; position: relative; }
        .sol-estado-wrap { position: relative; }
        .sol-btn-estado { display: flex; align-items: center; gap: 8px; padding: 9px 14px; border: 1.5px solid ${colors.border}; border-radius: ${radius.md}; background: ${colors.bgCard}; font-size: ${typography.sm}; font-weight: 600; cursor: pointer; font-family: inherit; color: ${colors.textPrimary}; white-space: nowrap; transition: border-color 0.15s; }
        .sol-btn-estado:hover { border-color: ${colors.borderFocus}; }
        .sol-estado-dropdown { position: absolute; bottom: calc(100% + 6px); left: 0; background: ${colors.bgCard}; border: 1px solid ${colors.border}; border-radius: ${radius.md}; box-shadow: 0 8px 24px rgba(0,0,0,0.12); min-width: 150px; z-index: 10; overflow: hidden; }
        .sol-estado-item { display: block; width: 100%; text-align: left; padding: 10px 16px; font-size: ${typography.sm}; color: ${colors.textPrimary}; background: none; border: none; cursor: pointer; font-family: inherit; transition: background 0.1s; }
        .sol-estado-item:hover { background: ${colors.bgInput}; }
        .sol-btn-confirmar { padding: 9px 20px; background: ${colors.bgCard}; color: ${colors.textPrimary}; border: 1.5px solid ${colors.border}; border-radius: ${radius.md}; font-size: ${typography.sm}; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.15s, border-color 0.15s; white-space: nowrap; }
        .sol-btn-confirmar:hover:not(:disabled) { background: ${colors.bgInput}; border-color: ${colors.textPrimary}; }
        .sol-btn-confirmar:disabled { opacity: 0.45; cursor: not-allowed; }
        .sol-filter-modal { background: ${colors.bgCard}; border-radius: ${radius.xl}; width: 100%; max-width: 360px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.22); animation: sol-pop 0.18s ease; }
        .sol-filter-head { background: ${colors.navy}; padding: 16px 24px; text-align: center; color: ${colors.textWhite}; font-size: ${typography.lg}; font-weight: 700; }
        .sol-filter-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
        .sol-filter-field { display: flex; flex-direction: column; gap: 6px; }
        .sol-filter-label { font-size: ${typography.sm}; font-weight: 600; color: ${colors.textPrimary}; }
        .sol-filter-input { width: 100%; padding: 7px 10px; border: none; border-radius: ${radius.md}; background: #E8EFFE; font-size: ${typography.base}; font-family: inherit; color: ${colors.textPrimary}; outline: none; box-sizing: border-box; }
        .sol-filter-footer { display: flex; gap: 10px; padding: 0 24px 24px; flex-direction: column; }
        .sol-btn-cancelar { padding: 11px; background: ${colors.danger}; color: white; border: none; border-radius: ${radius.md}; font-size: ${typography.base}; font-weight: 700; cursor: pointer; font-family: inherit; transition: opacity 0.15s; }
        .sol-btn-cancelar:hover { opacity: 0.85; }
        .sol-btn-confirmar-filter { padding: 11px; background: ${colors.success}; color: white; border: none; border-radius: ${radius.md}; font-size: ${typography.base}; font-weight: 700; cursor: pointer; font-family: inherit; transition: opacity 0.15s; }
        .sol-btn-confirmar-filter:hover { opacity: 0.85; }
      `}</style>

      <div className="sol-wrap">
        <div className="sol-table-wrap">
          <div className="sol-header-row">
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: colors.textPrimary }}>
              Solicitudes Pendientes
            </h1>
            <button className="sol-filter-btn" title="Filtrar" onClick={() => { setTempFilter(filter); setFilterOpen(true) }}>
              <FilterIcon />
            </button>
          </div>

          {error && (
            <div style={{ margin: '0 24px 16px', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: radius.md, color: '#ef4444', fontSize: typography.sm }}>
              {error}
            </div>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table className="sol-table">
              <thead>
                <tr>
                  {['ID', 'Fecha Solicitud', 'Contratista', 'Contrato', 'Acción'].map(h => (
                    <th key={h} className="sol-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: colors.textMuted }}>Cargando...</td></tr>
                ) : displayed.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: colors.textMuted, fontSize: typography.base }}>
                      No hay solicitudes pendientes.
                    </td>
                  </tr>
                ) : (
                  displayed.map(s => (
                    <tr key={s.solicitud_id} className="sol-row">
                      <td className="sol-td emphasis">{s.solicitud_id}</td>
                      <td className="sol-td">{new Date(s.created_at).toLocaleDateString('es-CO')}</td>
                      <td className="sol-td">{s.nombre_contratista || '—'}</td>
                      <td className="sol-td">{s.contrato_id}</td>
                      <td className="sol-td">
                        <button id={`btn-revisar-${s.solicitud_id}`} className="sol-btn-revisar" onClick={() => openModal(s)}>
                          Revisar Solicitud
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── MODAL REVISIÓN ── */}
      {selected && (
        <div className="sol-modal-overlay" onClick={closeModal}>
          <div className="sol-modal" onClick={e => e.stopPropagation()}>
            <div className="sol-modal-head">
              <h2 style={{ margin: 0, color: colors.textWhite, fontSize: typography.xl, fontWeight: 700 }}>
                Solicitud ID. {selected.solicitud_id}
              </h2>
            </div>

            <div className="sol-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: typography.sm, fontWeight: 600, color: colors.textPrimary }}>Contratista</label>
                  <input readOnly value={selected.nombre_contratista || '—'} className="sol-input-ro" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: typography.sm, fontWeight: 600, color: colors.textPrimary }}>Fecha de Solicitud</label>
                  <input readOnly value={new Date(selected.created_at).toLocaleDateString('es-CO')} className="sol-input-ro" />
                </div>
              </div>

              <p style={{ margin: '0 0 4px', fontSize: typography.sm, fontWeight: 700, color: colors.textPrimary }}>
                Evidencias / Documentos
              </p>
              {loadingEv ? (
                <p style={{ color: colors.textMuted, fontSize: typography.sm }}>Cargando evidencias...</p>
              ) : evidencias.length === 0 ? (
                <p style={{ color: colors.textMuted, fontSize: typography.sm }}>Sin evidencias adjuntas.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {evidencias.map(ev => (
                    <div key={ev.evidencia_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 14px', borderRadius: radius.md, background: '#F0F4FF', border: `1px solid ${colors.border}`, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: typography.sm, color: colors.textPrimary, wordBreak: 'break-all', flex: 1 }}>{ev.url}</span>
                      <a href={ev.url} target="_blank" rel="noopener noreferrer" style={{ background: '#1A2C6B', color: 'white', border: 'none', borderRadius: radius.md, padding: '5px 12px', fontSize: typography.xs, fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>
                        Descargar
                      </a>
                    </div>
                  ))}
                </div>
              )}

              <p style={{ margin: '16px 0 6px', fontSize: typography.sm, fontWeight: 700, color: colors.textPrimary }}>Comentarios</p>
              <textarea
                className="sol-textarea"
                placeholder="Escriba comentario aquí..."
                value={comentario}
                onChange={e => setComentario(e.target.value)}
              />

              {errorModal && (
                <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: radius.md, color: '#ef4444', fontSize: typography.sm }}>
                  {errorModal}
                </div>
              )}

              <div className="sol-modal-footer">
                <div className="sol-estado-wrap">
                  <button id="btn-nuevo-estado" className="sol-btn-estado" onClick={() => setEstadoDropdown(o => !o)}>
                    {nuevoEstado || 'Nuevo Estado'}
                    <span style={{ fontSize: 14 }}>⊙</span>
                  </button>
                  {estadoDropdown && (
                    <div className="sol-estado-dropdown">
                      {ESTADO_OPTIONS.map(op => (
                        <button key={op} className="sol-estado-item" onClick={() => { setNuevoEstado(op); setEstadoDropdown(false) }}>
                          {op}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ flex: 1 }} />

                <button
                  id="btn-confirmar-solicitud"
                  className="sol-btn-confirmar"
                  disabled={!nuevoEstado || confirmando}
                  onClick={handleConfirmar}
                >
                  {confirmando ? 'Guardando...' : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL FILTROS ── */}
      {filterOpen && (
        <div className="sol-modal-overlay" onClick={cancelFilter}>
          <div className="sol-filter-modal" onClick={e => e.stopPropagation()}>
            <div className="sol-filter-head">Filtrar solicitudes</div>
            <div className="sol-filter-body">
              <div className="sol-filter-field">
                <label className="sol-filter-label">Contratista</label>
                <input className="sol-filter-input" value={tempFilter.contratista} onChange={e => setTempFilter(p => ({ ...p, contratista: e.target.value }))} placeholder="Nombre del contratista" />
              </div>
              <div className="sol-filter-field">
                <label className="sol-filter-label">Fecha</label>
                <input className="sol-filter-input" value={tempFilter.fecha} onChange={e => setTempFilter(p => ({ ...p, fecha: e.target.value }))} placeholder="dd/mm/aaaa" />
              </div>
            </div>
            <div className="sol-filter-footer">
              <button className="sol-btn-cancelar" onClick={cancelFilter}>Cancelar</button>
              <button className="sol-btn-confirmar-filter" onClick={applyFilter}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function FilterIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M6 10h8M9 15h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
}
