import { useState } from 'react'
import { colors, radius, typography, shadows } from '../../theme'

const solicitudesData = [
  { id: 1, fecha: '27/01/2026', contratista: 'Juan',   supervisor: 'Andrea', tipo: 'Pago', estado: 'Pendiente' },
  { id: 2, fecha: '25/12/2025', contratista: 'Maria',  supervisor: 'Pablo',  tipo: 'Pago', estado: 'Pendiente' },
  { id: 3, fecha: '27/01/2026', contratista: 'Andres', supervisor: 'Andrea', tipo: 'Pago', estado: 'Pendiente' },
  { id: 4, fecha: '27/01/2026', contratista: 'Pedro',  supervisor: 'Pablo',  tipo: 'Pago', estado: 'Pendiente' },
]

const documentos = ['Evidencia', 'Seguridad social', 'Certificado ARL']
const estadoOptions = ['Aprobar', 'Devolver', 'Pendiente']

export default function SolicitudesSupervisor() {
  const [solicitudes, setSolicitudes] = useState(solicitudesData)
  const [selected, setSelected]       = useState(null)   // solicitud abierta en modal
  const [estadoDropdown, setEstadoDropdown] = useState(false)
  const [nuevoEstado, setNuevoEstado]       = useState('')
  const [comentario, setComentario]         = useState('')
  const [filterOpen, setFilterOpen]         = useState(false)
  const [filter, setFilter] = useState({ estado: '', fecha: '', contratista: '' })
  const [tempFilter, setTempFilter] = useState({ estado: '', fecha: '', contratista: '' })

  const openModal = (s) => {
    setSelected(s)
    setNuevoEstado('')
    setComentario('')
    setEstadoDropdown(false)
  }
  const closeModal = () => setSelected(null)

  const handleConfirmar = () => {
    if (!nuevoEstado) return
    setSolicitudes(prev =>
      prev.map(s => s.id === selected.id ? { ...s, estado: nuevoEstado } : s)
    )
    closeModal()
  }

  const applyFilter = () => {
    setFilter(tempFilter)
    setFilterOpen(false)
  }
  const cancelFilter = () => {
    setTempFilter(filter)
    setFilterOpen(false)
  }

  const displayed = solicitudes.filter(s => {
    if (filter.estado      && s.estado      !== filter.estado)                             return false
    if (filter.fecha       && s.fecha       !== filter.fecha)                              return false
    if (filter.contratista && !s.contratista.toLowerCase().includes(filter.contratista.toLowerCase())) return false
    return true
  })

  return (
    <>
      <style>{`
        .sol-wrap { width: 100%; }

        /* tabla */
        .sol-table-wrap {
          border-radius: ${radius.xl};
          background: ${colors.bgCard};
          box-shadow: ${shadows.card};
          overflow: hidden;
        }
        .sol-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px 16px;
        }
        .sol-table { width: 100%; border-collapse: collapse; }
        .sol-th {
          text-align: left;
          padding: 12px 16px;
          font-size: ${typography.xs};
          font-weight: 600;
          color: ${colors.textMuted};
          text-transform: uppercase;
          letter-spacing: 0.4px;
          background: ${colors.bgInput};
          border-bottom: 1px solid ${colors.border};
        }
        .sol-td {
          padding: 14px 16px;
          font-size: ${typography.base};
          color: ${colors.textSecondary};
          border-bottom: 1px solid ${colors.border};
        }
        .sol-td.emphasis { font-weight: 700; color: ${colors.textPrimary}; }
        .sol-row:hover { background: ${colors.bgRowHover}; }
        .sol-row:last-child td { border-bottom: none; }

        /* btn revisar */
        .sol-btn-revisar {
          padding: 7px 14px;
          background: #D6E4FF;
          color: #1A2C6B;
          border: none;
          border-radius: ${radius.md};
          font-size: ${typography.xs};
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
          transition: background 0.15s;
        }
        .sol-btn-revisar:hover { background: #B3CCFF; }

        /* filtro btn */
        .sol-filter-btn {
          background: none; border: none; cursor: pointer;
          color: ${colors.textSecondary}; padding: 6px 8px;
          border-radius: ${radius.md}; font-size: 18px;
          transition: background 0.15s;
        }
        .sol-filter-btn:hover { background: ${colors.bgInput}; }

        /* MODAL overlay */
        .sol-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.45);
          display: flex; align-items: center; justify-content: center;
          z-index: 100; padding: 16px;
        }

        /* modal card */
        .sol-modal {
          background: ${colors.bgCard};
          border-radius: ${radius.xl};
          width: 100%; max-width: 520px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.22);
          overflow: hidden;
          animation: sol-pop 0.18s ease;
        }
        @keyframes sol-pop {
          from { transform: scale(0.95); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }

        .sol-modal-head {
          background: ${colors.navy};
          padding: 18px 24px;
        }

        .sol-modal-body { padding: 20px 24px 24px; }

        /* input readonly */
        .sol-input-ro {
          width: 100%; padding: 8px 12px;
          background: #E8EFFE;
          border: none; border-radius: ${radius.md};
          font-size: ${typography.base}; color: ${colors.textPrimary};
          font-family: inherit; box-sizing: border-box;
        }

        /* docs */
        .sol-docs { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 12px; }
        .sol-doc-item {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          width: 90px;
        }
        .sol-doc-icon {
          width: 72px; height: 80px;
          background: #F0F4FF;
          border: 1.5px solid ${colors.border};
          border-radius: ${radius.md};
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 4px;
        }
        .sol-btn-descargar {
          padding: 4px 12px;
          background: #1A2C6B; color: white;
          border: none; border-radius: ${radius.md};
          font-size: ${typography.xs}; font-weight: 600;
          cursor: pointer; font-family: inherit;
          transition: opacity 0.15s;
        }
        .sol-btn-descargar:hover { opacity: 0.85; }

        /* textarea comentarios */
        .sol-textarea {
          width: 100%; min-height: 80px; resize: vertical;
          padding: 10px 12px;
          border: 1px solid ${colors.borderInput};
          border-radius: ${radius.md};
          font-size: ${typography.base}; font-family: inherit;
          color: ${colors.textPrimary}; background: ${colors.bgInput};
          outline: none; box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .sol-textarea:focus {
          border-color: ${colors.borderFocus};
          box-shadow: 0 0 0 3px ${colors.focusShadow};
        }
        .sol-textarea::placeholder { color: ${colors.textMuted}; }

        /* modal footer */
        .sol-modal-footer {
          display: flex; gap: 10px; align-items: center; margin-top: 20px; position: relative;
        }

        /* nuevo estado btn */
        .sol-estado-wrap { position: relative; }
        .sol-btn-estado {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 14px;
          border: 1.5px solid ${colors.border};
          border-radius: ${radius.md}; background: ${colors.bgCard};
          font-size: ${typography.sm}; font-weight: 600;
          cursor: pointer; font-family: inherit; color: ${colors.textPrimary};
          white-space: nowrap; transition: border-color 0.15s;
        }
        .sol-btn-estado:hover { border-color: ${colors.borderFocus}; }
        .sol-estado-dropdown {
          position: absolute; bottom: calc(100% + 6px); left: 0;
          background: ${colors.bgCard};
          border: 1px solid ${colors.border};
          border-radius: ${radius.md};
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          min-width: 150px; z-index: 10; overflow: hidden;
        }
        .sol-estado-item {
          display: block; width: 100%; text-align: left;
          padding: 10px 16px; font-size: ${typography.sm};
          color: ${colors.textPrimary}; background: none;
          border: none; cursor: pointer; font-family: inherit;
          transition: background 0.1s;
        }
        .sol-estado-item:hover { background: ${colors.bgInput}; }

        /* btn generar reporte */
        .sol-btn-reporte {
          flex: 1; padding: 9px;
          background: ${colors.bgInput}; color: ${colors.textMuted};
          border: 1px solid ${colors.border}; border-radius: ${radius.md};
          font-size: ${typography.sm}; font-weight: 600;
          cursor: not-allowed; font-family: inherit;
        }

        /* btn confirmar */
        .sol-btn-confirmar {
          padding: 9px 20px;
          background: ${colors.bgCard}; color: ${colors.textPrimary};
          border: 1.5px solid ${colors.border}; border-radius: ${radius.md};
          font-size: ${typography.sm}; font-weight: 600;
          cursor: pointer; font-family: inherit;
          transition: background 0.15s, border-color 0.15s;
          white-space: nowrap;
        }
        .sol-btn-confirmar:hover:not(:disabled) {
          background: ${colors.bgInput}; border-color: ${colors.textPrimary};
        }
        .sol-btn-confirmar:disabled { opacity: 0.45; cursor: not-allowed; }

        /* MODAL FILTRO */
        .sol-filter-modal {
          background: ${colors.bgCard};
          border-radius: ${radius.xl};
          width: 100%; max-width: 360px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.22);
          animation: sol-pop 0.18s ease;
        }
        .sol-filter-head {
          background: ${colors.navy}; padding: 16px 24px;
          text-align: center;
          color: ${colors.textWhite}; font-size: ${typography.lg}; font-weight: 700;
        }
        .sol-filter-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
        .sol-filter-field { display: flex; flex-direction: column; gap: 6px; }
        .sol-filter-label {
          font-size: ${typography.sm}; font-weight: 600; color: ${colors.textPrimary};
        }
        .sol-filter-input {
          width: 100%; padding: 7px 10px;
          border: none; border-radius: ${radius.md};
          background: #E8EFFE; font-size: ${typography.base};
          font-family: inherit; color: ${colors.textPrimary};
          outline: none; box-sizing: border-box;
        }
        .sol-filter-footer { display: flex; gap: 10px; padding: 0 24px 24px; flex-direction: column; }
        .sol-btn-cancelar {
          padding: 11px; background: ${colors.danger}; color: white;
          border: none; border-radius: ${radius.md}; font-size: ${typography.base};
          font-weight: 700; cursor: pointer; font-family: inherit;
          transition: opacity 0.15s;
        }
        .sol-btn-cancelar:hover { opacity: 0.85; }
        .sol-btn-confirmar-filter {
          padding: 11px; background: ${colors.success}; color: white;
          border: none; border-radius: ${radius.md}; font-size: ${typography.base};
          font-weight: 700; cursor: pointer; font-family: inherit;
          transition: opacity 0.15s;
        }
        .sol-btn-confirmar-filter:hover { opacity: 0.85; }
      `}</style>

      <div className="sol-wrap">
        <div className="sol-table-wrap">

          {/* Encabezado */}
          <div className="sol-header-row">
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: colors.textPrimary }}>
              Solicitudes Pendientes
            </h1>
            <button
              id="btn-filtrar"
              className="sol-filter-btn"
              title="Filtrar"
              onClick={() => { setTempFilter(filter); setFilterOpen(true) }}
            >
              <FilterIcon />
            </button>
          </div>

          {/* Tabla */}
          <div style={{ overflowX: 'auto' }}>
            <table className="sol-table">
              <thead>
                <tr>
                  {['ID', 'Fecha Solicitud', 'Contratista', 'Supervisor', 'Tipo', ''].map(h => (
                    <th key={h} className="sol-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.map(s => (
                  <tr key={s.id} className="sol-row">
                    <td className="sol-td emphasis">{s.id}</td>
                    <td className="sol-td">{s.fecha}</td>
                    <td className="sol-td">{s.contratista}</td>
                    <td className="sol-td">{s.supervisor}</td>
                    <td className="sol-td">{s.tipo}</td>
                    <td className="sol-td">
                      <button
                        id={`btn-revisar-${s.id}`}
                        className="sol-btn-revisar"
                        onClick={() => openModal(s)}
                      >
                        Revisar Solicitud
                      </button>
                    </td>
                  </tr>
                ))}
                {displayed.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: colors.textMuted, fontSize: typography.base }}>
                      No hay solicitudes que coincidan con el filtro.
                    </td>
                  </tr>
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

            {/* Cabecera navy */}
            <div className="sol-modal-head">
              <h2 style={{ margin: 0, color: colors.textWhite, fontSize: typography.xl, fontWeight: 700 }}>
                Solicitud ID. {selected.id}
              </h2>
            </div>

            <div className="sol-modal-body">
              {/* Contratista + Fecha */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: typography.sm, fontWeight: 600, color: colors.textPrimary }}>
                    Contratista
                  </label>
                  <input readOnly value={selected.contratista} className="sol-input-ro" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: typography.sm, fontWeight: 600, color: colors.textPrimary }}>
                    Fecha de Solicitud
                  </label>
                  <input readOnly value={selected.fecha} className="sol-input-ro" />
                </div>
              </div>

              {/* Documentos */}
              <p style={{ margin: '0 0 4px', fontSize: typography.sm, fontWeight: 700, color: colors.textPrimary }}>
                Documentos
              </p>
              <div className="sol-docs">
                {documentos.map(doc => (
                  <div key={doc} className="sol-doc-item">
                    <div className="sol-doc-icon">
                      <PdfIcon />
                      <span style={{ fontSize: '10px', color: colors.textMuted, textAlign: 'center', lineHeight: 1.2 }}>PDF</span>
                    </div>
                    <span style={{ fontSize: '11px', textAlign: 'center', color: colors.textPrimary, fontWeight: 600, lineHeight: 1.2 }}>{doc}</span>
                    <button className="sol-btn-descargar">Descargar</button>
                  </div>
                ))}
              </div>

              {/* Comentarios */}
              <p style={{ margin: '16px 0 6px', fontSize: typography.sm, fontWeight: 700, color: colors.textPrimary }}>
                Comentarios
              </p>
              <textarea
                className="sol-textarea"
                placeholder="Escriba comentario aquí..."
                value={comentario}
                onChange={e => setComentario(e.target.value)}
              />

              {/* Footer de acciones */}
              <div className="sol-modal-footer">

                {/* Nuevo Estado */}
                <div className="sol-estado-wrap">
                  <button
                    id="btn-nuevo-estado"
                    className="sol-btn-estado"
                    onClick={() => setEstadoDropdown(o => !o)}
                  >
                    {nuevoEstado || 'Nuevo Estado'}
                    <span style={{ fontSize: 14 }}>⊙</span>
                  </button>
                  {estadoDropdown && (
                    <div className="sol-estado-dropdown">
                      {estadoOptions.map(op => (
                        <button
                          key={op}
                          className="sol-estado-item"
                          onClick={() => { setNuevoEstado(op); setEstadoDropdown(false) }}
                        >
                          {op}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Generar Reporte */}
                <button className="sol-btn-reporte" disabled>
                  Generar Reporte
                </button>

                {/* Confirmar */}
                <button
                  id="btn-confirmar-solicitud"
                  className="sol-btn-confirmar"
                  disabled={!nuevoEstado}
                  onClick={handleConfirmar}
                >
                  Confirmar
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
            <div className="sol-filter-head">filtrar las solicitudes</div>
            <div className="sol-filter-body">
              <div className="sol-filter-field">
                <label className="sol-filter-label">Estado</label>
                <input
                  className="sol-filter-input"
                  value={tempFilter.estado}
                  onChange={e => setTempFilter(p => ({ ...p, estado: e.target.value }))}
                  placeholder="Pendiente / Aprobada..."
                />
              </div>
              <div className="sol-filter-field">
                <label className="sol-filter-label">Fecha</label>
                <input
                  className="sol-filter-input"
                  value={tempFilter.fecha}
                  onChange={e => setTempFilter(p => ({ ...p, fecha: e.target.value }))}
                  placeholder="dd/mm/aaaa"
                />
              </div>
              <div className="sol-filter-field">
                <label className="sol-filter-label">Contratista</label>
                <input
                  className="sol-filter-input"
                  value={tempFilter.contratista}
                  onChange={e => setTempFilter(p => ({ ...p, contratista: e.target.value }))}
                  placeholder="Nombre del contratista"
                />
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
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 5h14M6 10h8M9 15h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function PdfIcon() {
  return (
    <svg width="32" height="36" viewBox="0 0 32 36" fill="none">
      <rect x="1" y="1" width="24" height="30" rx="3" fill="#E8EFFE" stroke={colors.border} strokeWidth="1.5" />
      <path d="M17 1v8h8" stroke={colors.border} strokeWidth="1.5" />
      <text x="5" y="26" fontSize="7" fontWeight="800" fill="#1A2C6B" fontFamily="system-ui">PDF</text>
    </svg>
  )
}
