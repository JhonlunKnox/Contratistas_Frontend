import { useMemo, useState, useEffect } from 'react'
import {
  colors, radius, typography, shadows,
  inputStyle, inputFocusStyle, inputBlurStyle,
  btnSuccess, btnDanger, thStyle,
} from '../../theme'
import { apiFetch } from '../../services/api'

const ESTADO_DISPLAY = {
  Pendiente:     'En revision',
  Aprobado:      'Aprobada',
  'No Aprobado': 'Devuelta',
}

const estadoStyles = {
  'En revision': { background: '#FFF5DA', color: '#A16207' },
  Aprobada:      { background: '#EAF8EF', color: '#1E6E3A' },
  Devuelta:      { background: '#FEECEC', color: '#B42318' },
}

const DOCUMENTOS_REQUERIDOS = [
  { id: 'informe',          etiqueta: 'Informe de actividades (URL)' },
  { id: 'seguridad-social', etiqueta: 'Planilla seguridad social (URL)' },
  { id: 'certificado-arl',  etiqueta: 'Certificado ARL (URL)' },
]

export default function Solicitudes() {
  const [solicitudes, setSolicitudes]           = useState([])
  const [contratos, setContratos]               = useState([])
  const [loading, setLoading]                   = useState(true)
  const [error, setError]                       = useState('')
  const [busqueda, setBusqueda]                 = useState('')
  const [hoveredRow, setHoveredRow]             = useState(null)

  // Modal detalle
  const [detalleSolicitud, setDetalleSolicitud] = useState(null)
  const [evidenciasDetalle, setEvidenciasDetalle] = useState([])
  const [loadingEvidencias, setLoadingEvidencias] = useState(false)

  // Modal crear
  const [mostrarCrear, setMostrarCrear]         = useState(false)
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [creando, setCreando]                   = useState(false)
  const [errorCrear, setErrorCrear]             = useState('')
  const [nuevaSolicitud, setNuevaSolicitud]     = useState({
    contrato_id: '',
    comentario: '',
    documentos: { informe: '', 'seguridad-social': '', 'certificado-arl': '' },
  })

  useEffect(() => {
    Promise.all([
      apiFetch('/api/solicitudes'),
      apiFetch('/api/contratos'),
    ])
      .then(([solData, contData]) => {
        setSolicitudes(solData.solicitudes)
        setContratos(contData.contratos)
        if (contData.contratos.length > 0) {
          setNuevaSolicitud(prev => ({ ...prev, contrato_id: String(contData.contratos[0].contrato_id) }))
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const solicitudesFiltradas = useMemo(() => {
    const term = busqueda.toLowerCase()
    return solicitudes.filter(
      (s) =>
        String(s.solicitud_id).includes(busqueda) ||
        (ESTADO_DISPLAY[s.estado] || s.estado).toLowerCase().includes(term) ||
        (s.comentario || '').toLowerCase().includes(term)
    )
  }, [busqueda, solicitudes])

  const abrirDetalle = async (solicitud) => {
    setDetalleSolicitud(solicitud)
    setEvidenciasDetalle([])
    setLoadingEvidencias(true)
    try {
      const data = await apiFetch(`/api/solicitudes/${solicitud.solicitud_id}/evidencias`)
      setEvidenciasDetalle(data.evidencias)
    } catch {
      // mostrar lista vacía
    } finally {
      setLoadingEvidencias(false)
    }
  }

  const cerrarDetalle = () => setDetalleSolicitud(null)

  const abrirCrear = () => {
    setMostrarCrear(true)
    setMostrarConfirmacion(false)
    setErrorCrear('')
  }

  const cerrarCrear = () => {
    setMostrarCrear(false)
    setMostrarConfirmacion(false)
    setErrorCrear('')
  }

  const actualizarDocumento = (id, valor) => {
    setNuevaSolicitud(prev => ({ ...prev, documentos: { ...prev.documentos, [id]: valor } }))
  }

  const confirmarEnvio = async () => {
    setCreando(true)
    setErrorCrear('')
    try {
      const { solicitud } = await apiFetch(`/api/contratos/${nuevaSolicitud.contrato_id}/solicitudes`, {
        method: 'POST',
        body: JSON.stringify({
          contrato_id: Number(nuevaSolicitud.contrato_id),
          comentario: nuevaSolicitud.comentario || null,
        }),
      })

      // Crear evidencias para las URLs que se hayan ingresado
      const hoy = new Date().toISOString().split('T')[0]
      const evidenciasPromises = Object.values(nuevaSolicitud.documentos)
        .filter(url => url.trim())
        .map(url =>
          apiFetch('/api/evidencias', {
            method: 'POST',
            body: JSON.stringify({ url, estado: 'Pendiente', fecha: hoy, solicitud_id: solicitud.solicitud_id }),
          }).catch(() => null)
        )
      await Promise.all(evidenciasPromises)

      setSolicitudes(prev => [{ ...solicitud, nombre_contratista: null }, ...prev])
      setNuevaSolicitud({
        contrato_id: contratos.length > 0 ? String(contratos[0].contrato_id) : '',
        comentario: '',
        documentos: { informe: '', 'seguridad-social': '', 'certificado-arl': '' },
      })
      setMostrarConfirmacion(false)
      setMostrarCrear(false)
    } catch (err) {
      setErrorCrear(err.message || 'Error al crear la solicitud')
      setMostrarConfirmacion(false)
    } finally {
      setCreando(false)
    }
  }

  return (
    <>
      <style>{`
        .sp-shell { display: flex; flex-direction: column; gap: 20px; }
        .sp-card { background: ${colors.bgCard}; border-radius: 18px; box-shadow: ${shadows.card}; padding: 22px 18px; }
        .sp-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
        .sp-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .sp-table-wrap { overflow-x: auto; border-radius: ${radius.lg}; border: 1px solid ${colors.border}; background: ${colors.bgCard}; }
        .sp-table { width: 100%; min-width: 720px; border-collapse: collapse; }
        .sp-modal-backdrop { position: fixed; inset: 0; background: rgba(9,20,40,0.58); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 70; }
        .sp-modal { width: min(860px, 100%); max-height: calc(100vh - 40px); overflow-y: auto; border-radius: 22px; background: ${colors.bgCard}; box-shadow: 0 18px 36px rgba(13,33,69,0.24); }
        .sp-confirm { width: min(420px, 100%); border-radius: 22px; overflow: hidden; background: ${colors.bgCard}; box-shadow: 0 18px 36px rgba(0,0,0,0.35); }
        .sp-modal-header { padding: 22px 26px 16px; border-bottom: 1px solid ${colors.border}; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .sp-modal-body { padding: 22px 26px 26px; display: flex; flex-direction: column; gap: 22px; }
        .sp-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .sp-info-card { padding: 16px; border-radius: ${radius.lg}; background: ${colors.bgInput}; border: 1px solid ${colors.border}; }
        .sp-comment { border-left: 4px solid ${colors.primary}; background: #FFF9E7; border-radius: 0 ${radius.md} ${radius.md} 0; padding: 14px 16px; }
        .sp-confirm-top { background: ${colors.navy}; color: ${colors.textWhite}; padding: 20px 24px; text-align: center; font-size: ${typography.xl}; font-weight: 700; }
        .sp-confirm-body { padding: 18px 24px 24px; display: flex; flex-direction: column; gap: 18px; }
        .sp-file-row { display: grid; grid-template-columns: minmax(0, 1fr) 120px; gap: 12px; align-items: end; }
        @media (max-width: 768px) {
          .sp-card { padding: 18px 14px; }
          .sp-grid { grid-template-columns: 1fr; }
          .sp-file-row { grid-template-columns: 1fr; }
          .sp-modal-header, .sp-modal-body { padding-left: 16px; padding-right: 16px; }
        }
      `}</style>

      <section className="sp-shell">
        <div className="sp-card">
          <div className="sp-toolbar">
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', color: colors.textPrimary, fontWeight: 700 }}>
                Mis solicitudes
              </h1>
              <p style={{ margin: '6px 0 0', color: colors.textSecondary, fontSize: typography.md }}>
                Revisa el estado de tus solicitudes de pago y crea nuevas cuando lo necesites.
              </p>
            </div>
            <div className="sp-actions">
              <input
                placeholder="Buscar por ID, estado..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ ...inputStyle, width: '240px', maxWidth: '100%' }}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
              />
              <button type="button" onClick={abrirCrear} style={{ ...btnSuccess, padding: '11px 18px' }}>
                Crear solicitud
              </button>
            </div>
          </div>

          {error && (
            <div style={{ marginBottom: 14, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: radius.md, color: '#ef4444', fontSize: typography.sm }}>
              {error}
            </div>
          )}

          <div className="sp-table-wrap">
            <table className="sp-table">
              <thead>
                <tr>
                  {['ID', 'Contrato', 'Fecha de creación', 'Estado', 'Observaciones', 'Acción'].map(header => (
                    <th key={header} style={thStyle}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ padding: '28px 20px', textAlign: 'center', color: colors.textMuted }}>Cargando...</td></tr>
                ) : solicitudesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '28px 20px', textAlign: 'center', color: colors.textMuted }}>
                      {solicitudes.length === 0 ? 'No hay solicitudes registradas.' : 'No hay solicitudes que coincidan con la búsqueda.'}
                    </td>
                  </tr>
                ) : (
                  solicitudesFiltradas.map((solicitud, index) => {
                    const display = ESTADO_DISPLAY[solicitud.estado] || solicitud.estado
                    const style   = estadoStyles[display] || estadoStyles['En revision']
                    return (
                      <tr
                        key={solicitud.solicitud_id}
                        onMouseEnter={() => setHoveredRow(solicitud.solicitud_id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={{ borderBottom: `1px solid ${colors.border}`, background: hoveredRow === solicitud.solicitud_id ? colors.bgRowHover : index % 2 === 0 ? colors.bgCard : '#EEF4FF' }}
                      >
                        <td style={{ padding: '16px 20px', color: colors.textPrimary, fontWeight: 700 }}>{solicitud.solicitud_id}</td>
                        <td style={{ padding: '16px 20px', color: colors.textSecondary }}>{solicitud.contrato_id}</td>
                        <td style={{ padding: '16px 20px', color: colors.textSecondary }}>{new Date(solicitud.created_at).toLocaleDateString('es-CO')}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 12px', borderRadius: radius.full, fontWeight: 700, fontSize: typography.sm, ...style }}>
                            {display}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', color: colors.textSecondary }}>{solicitud.comentario || 'Sin observaciones.'}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <button
                            type="button"
                            onClick={() => abrirDetalle(solicitud)}
                            style={{ border: 'none', borderRadius: radius.md, background: colors.primary, color: colors.primaryText, fontWeight: 700, padding: '10px 16px', cursor: 'pointer', fontFamily: 'inherit' }}
                          >
                            Revisar
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── MODAL DETALLE ── */}
      {detalleSolicitud && (
        <div className="sp-modal-backdrop">
          <div className="sp-modal">
            <div className="sp-modal-header">
              <div>
                <h2 style={{ margin: 0, fontSize: '26px', color: colors.textPrimary }}>Detalle de solicitud</h2>
                <p style={{ margin: '6px 0 0', color: colors.textSecondary }}>
                  #{detalleSolicitud.solicitud_id} · Contrato {detalleSolicitud.contrato_id}
                </p>
              </div>
              <button type="button" onClick={cerrarDetalle} style={{ width: 38, height: 38, borderRadius: radius.full, border: 'none', background: colors.bgInput, color: colors.textSecondary, cursor: 'pointer', fontSize: '20px' }}>
                ×
              </button>
            </div>

            <div className="sp-modal-body">
              <div className="sp-grid">
                <div className="sp-info-card">
                  <div style={{ fontSize: typography.xs, color: colors.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Fecha de creación</div>
                  <div style={{ marginTop: 8, color: colors.textPrimary, fontWeight: 700 }}>{new Date(detalleSolicitud.created_at).toLocaleDateString('es-CO')}</div>
                </div>
                <div className="sp-info-card">
                  <div style={{ fontSize: typography.xs, color: colors.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Estado actual</div>
                  <div style={{ marginTop: 8 }}>
                    {(() => {
                      const display = ESTADO_DISPLAY[detalleSolicitud.estado] || detalleSolicitud.estado
                      return (
                        <span style={{ display: 'inline-flex', padding: '8px 12px', borderRadius: radius.full, fontWeight: 700, ...estadoStyles[display] }}>
                          {display}
                        </span>
                      )
                    })()}
                  </div>
                </div>
              </div>

              <section>
                <h3 style={{ margin: '0 0 14px', fontSize: '22px', color: colors.textPrimary }}>Evidencias / Documentos</h3>
                {loadingEvidencias ? (
                  <p style={{ color: colors.textMuted }}>Cargando evidencias...</p>
                ) : evidenciasDetalle.length === 0 ? (
                  <p style={{ color: colors.textMuted }}>No hay evidencias adjuntas.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {evidenciasDetalle.map((ev) => (
                      <div key={ev.evidencia_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 16px', borderRadius: radius.lg, background: colors.bgInput, border: `1px solid ${colors.border}`, flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ color: colors.textPrimary, fontWeight: 700, wordBreak: 'break-all' }}>{ev.url}</div>
                          <div style={{ marginTop: 4, color: colors.textSecondary, fontSize: typography.sm }}>
                            {new Date(ev.fecha).toLocaleDateString('es-CO')} · {ev.estado}
                          </div>
                        </div>
                        <a href={ev.url} target="_blank" rel="noopener noreferrer" style={{ border: 'none', borderRadius: radius.md, background: '#304A9A', color: colors.textWhite, fontWeight: 700, padding: '10px 16px', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none', fontSize: typography.base }}>
                          Ver documento
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {detalleSolicitud.comentario && (
                <section>
                  <h3 style={{ margin: '0 0 14px', fontSize: '22px', color: colors.textPrimary }}>Observaciones</h3>
                  <div className="sp-comment">
                    <p style={{ margin: 0, color: colors.textSecondary }}>{detalleSolicitud.comentario}</p>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CREAR ── */}
      {mostrarCrear && (
        <div className="sp-modal-backdrop">
          <div className="sp-modal">
            <div className="sp-modal-header">
              <div>
                <h2 style={{ margin: 0, fontSize: '26px', color: colors.textPrimary }}>Crear solicitud</h2>
                <p style={{ margin: '6px 0 0', color: colors.textSecondary }}>
                  Selecciona el contrato, escribe un comentario y adjunta los soportes.
                </p>
              </div>
              <button type="button" onClick={cerrarCrear} style={{ width: 38, height: 38, borderRadius: radius.full, border: 'none', background: colors.bgInput, color: colors.textSecondary, cursor: 'pointer', fontSize: '20px' }}>
                ×
              </button>
            </div>

            <div className="sp-modal-body">
              {errorCrear && (
                <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: radius.md, color: '#ef4444', fontSize: typography.sm }}>
                  {errorCrear}
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, color: colors.textPrimary }}>Contrato</label>
                <select
                  value={nuevaSolicitud.contrato_id}
                  onChange={e => setNuevaSolicitud(prev => ({ ...prev, contrato_id: e.target.value }))}
                  style={{ ...inputStyle, background: 'white', cursor: 'pointer' }}
                  onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={e =>  Object.assign(e.target.style, inputBlurStyle)}
                >
                  {contratos.map(c => (
                    <option key={c.contrato_id} value={c.contrato_id}>
                      Contrato #{c.contrato_id} — {c.estado}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, color: colors.textPrimary }}>Comentario / Descripción</label>
                <textarea
                  value={nuevaSolicitud.comentario}
                  onChange={e => setNuevaSolicitud(prev => ({ ...prev, comentario: e.target.value }))}
                  placeholder="Resume brevemente el alcance de la solicitud."
                  style={{ ...inputStyle, minHeight: 110, resize: 'vertical' }}
                  onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={e =>  Object.assign(e.target.style, inputBlurStyle)}
                />
              </div>

              <section>
                <h3 style={{ margin: '0 0 14px', fontSize: '22px', color: colors.textPrimary }}>Documentos (URLs)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {DOCUMENTOS_REQUERIDOS.map((doc) => (
                    <div key={doc.id} className="sp-file-row">
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, color: colors.textPrimary }}>
                          {doc.etiqueta}
                        </label>
                        <input
                          value={nuevaSolicitud.documentos[doc.id]}
                          onChange={e => actualizarDocumento(doc.id, e.target.value)}
                          placeholder="https://..."
                          style={inputStyle}
                          onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                          onBlur={e =>  Object.assign(e.target.style, inputBlurStyle)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
                <button type="button" onClick={cerrarCrear} style={{ ...btnDanger, width: 'auto', padding: '10px 18px' }}>
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={!nuevaSolicitud.contrato_id}
                  onClick={() => setMostrarConfirmacion(true)}
                  style={{ ...btnSuccess, padding: '10px 18px', opacity: !nuevaSolicitud.contrato_id ? 0.6 : 1, cursor: !nuevaSolicitud.contrato_id ? 'not-allowed' : 'pointer' }}
                >
                  Enviar solicitud
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONFIRMACIÓN ── */}
      {mostrarConfirmacion && (
        <div className="sp-modal-backdrop">
          <div className="sp-confirm">
            <div className="sp-confirm-top">Confirmación de envío</div>
            <div className="sp-confirm-body">
              <div style={{ borderRadius: radius.md, background: '#F4F7FF', padding: '14px 16px', textAlign: 'center', color: colors.textPrimary, fontWeight: 800 }}>
                SOLICITUD PARA CONTRATO #{nuevaSolicitud.contrato_id}
              </div>
              <div style={{ borderRadius: radius.md, background: '#E8F0FE', padding: '28px 20px', textAlign: 'center', color: colors.textSecondary, fontSize: typography.md }}>
                Desea enviar esta solicitud de pago y dejarla en estado de revisión.
              </div>
              <button type="button" disabled={creando} onClick={() => setMostrarConfirmacion(false)} style={{ ...btnDanger, padding: '12px 18px', fontSize: typography.md }}>
                Cancelar
              </button>
              <button type="button" disabled={creando} onClick={confirmarEnvio} style={{ ...btnSuccess, padding: '12px 18px', fontSize: typography.md, opacity: creando ? 0.7 : 1 }}>
                {creando ? 'Enviando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
