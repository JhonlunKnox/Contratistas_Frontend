import { useMemo, useState } from 'react'
import {
  colors,
  radius,
  typography,
  shadows,
  inputStyle,
  inputFocusStyle,
  inputBlurStyle,
  btnSuccess,
  btnDanger,
  thStyle,
} from '../../theme'

const SOLICITUDES_INICIALES = [
  {
    id: 'SOL-2026-001',
    fechaCreacion: '18/03/2026',
    estado: 'En revision',
    observaciones: 'Pendiente validacion de la planilla de seguridad social.',
    contratoId: '123456',
    periodo: 'Marzo 2026',
    descripcion: 'Solicitud de pago correspondiente a las actividades operativas del mes.',
    documentos: [
      { nombre: 'Informe de actividades marzo.pdf', tipo: 'Informe principal', fecha: '18/03/2026' },
      { nombre: 'Planilla seguridad social.pdf', tipo: 'Soporte obligatorio', fecha: '18/03/2026' },
      { nombre: 'Certificado ARL.pdf', tipo: 'Soporte obligatorio', fecha: '18/03/2026' },
    ],
    comentarios: [
      { autor: 'Supervisor', fecha: '19/03/2026', mensaje: 'Por favor confirma que la planilla incluye el periodo completo.' },
      { autor: 'Gerente', fecha: '20/03/2026', mensaje: 'En espera de la validacion final del soporte financiero.' },
    ],
  },
  {
    id: 'SOL-2026-002',
    fechaCreacion: '11/03/2026',
    estado: 'Aprobada',
    observaciones: 'Solicitud aprobada y lista para pago.',
    contratoId: '143454',
    periodo: 'Febrero 2026',
    descripcion: 'Pago por actividades de seguimiento documental y atencion al contratista.',
    documentos: [
      { nombre: 'Informe de febrero.pdf', tipo: 'Informe principal', fecha: '11/03/2026' },
      { nombre: 'Planilla seguridad social febrero.pdf', tipo: 'Soporte obligatorio', fecha: '11/03/2026' },
    ],
    comentarios: [
      { autor: 'Supervisor', fecha: '12/03/2026', mensaje: 'Todo el paquete documental se encuentra correcto.' },
    ],
  },
  {
    id: 'SOL-2026-003',
    fechaCreacion: '02/03/2026',
    estado: 'Devuelta',
    observaciones: 'Falta adjuntar el certificado ARL vigente.',
    contratoId: '156532',
    periodo: 'Febrero 2026',
    descripcion: 'Solicitud asociada a soporte de novedades y reportes semanales.',
    documentos: [
      { nombre: 'Reporte semanal consolidado.pdf', tipo: 'Informe principal', fecha: '02/03/2026' },
    ],
    comentarios: [
      { autor: 'Supervisor', fecha: '03/03/2026', mensaje: 'Hace falta el certificado ARL para continuar con la revision.' },
    ],
  },
]

const DOCUMENTOS_REQUERIDOS = [
  { id: 'informe', etiqueta: 'Informe de actividades' },
  { id: 'seguridad-social', etiqueta: 'Planilla seguridad social (pdf)' },
  { id: 'certificado-arl', etiqueta: 'Certificado ARL (pdf)' },
]

const estadoStyles = {
  Aprobada: { background: '#EAF8EF', color: '#1E6E3A' },
  'En revision': { background: '#FFF5DA', color: '#A16207' },
  Devuelta: { background: '#FEECEC', color: '#B42318' },
  Borrador: { background: '#E8F0FE', color: '#1D4ED8' },
}

export default function Solicitudes() {
  const [busqueda, setBusqueda] = useState('')
  const [hoveredRow, setHoveredRow] = useState(null)
  const [solicitudes, setSolicitudes] = useState(SOLICITUDES_INICIALES)
  const [detalleSolicitud, setDetalleSolicitud] = useState(null)
  const [mostrarCrear, setMostrarCrear] = useState(false)
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [nuevaSolicitud, setNuevaSolicitud] = useState({
    contratoId: '123456',
    periodo: '',
    descripcion: '',
    documentos: {
      informe: '',
      'seguridad-social': '',
      'certificado-arl': '',
    },
  })

  const solicitudesFiltradas = useMemo(() => {
    const term = busqueda.toLowerCase()
    return solicitudes.filter(
      (solicitud) =>
        solicitud.id.toLowerCase().includes(term) ||
        solicitud.estado.toLowerCase().includes(term) ||
        solicitud.fechaCreacion.includes(busqueda) ||
        solicitud.observaciones.toLowerCase().includes(term)
    )
  }, [busqueda, solicitudes])

  const abrirDetalle = (solicitud) => {
    setDetalleSolicitud(solicitud)
  }

  const cerrarDetalle = () => setDetalleSolicitud(null)

  const abrirCrear = () => {
    setMostrarCrear(true)
    setMostrarConfirmacion(false)
  }

  const cerrarCrear = () => {
    setMostrarCrear(false)
    setMostrarConfirmacion(false)
  }

  const actualizarDocumento = (id, valor) => {
    setNuevaSolicitud((prev) => ({
      ...prev,
      documentos: {
        ...prev.documentos,
        [id]: valor,
      },
    }))
  }

  const confirmarEnvio = () => {
    const nueva = {
      id: `SOL-2026-00${solicitudes.length + 1}`,
      fechaCreacion: '20/03/2026',
      estado: 'En revision',
      observaciones: 'Solicitud creada y enviada correctamente.',
      contratoId: nuevaSolicitud.contratoId,
      periodo: nuevaSolicitud.periodo || 'Pendiente',
      descripcion: nuevaSolicitud.descripcion || 'Sin descripcion adicional.',
      documentos: DOCUMENTOS_REQUERIDOS.map((doc) => ({
        nombre: nuevaSolicitud.documentos[doc.id] || 'Pendiente de adjuntar',
        tipo: doc.etiqueta,
        fecha: '20/03/2026',
      })),
      comentarios: [
        { autor: 'Sistema', fecha: '20/03/2026', mensaje: 'La solicitud fue registrada y esta en revision.' },
      ],
    }

    setSolicitudes((prev) => [nueva, ...prev])
    setNuevaSolicitud({
      contratoId: '123456',
      periodo: '',
      descripcion: '',
      documentos: {
        informe: '',
        'seguridad-social': '',
        'certificado-arl': '',
      },
    })
    setMostrarConfirmacion(false)
    setMostrarCrear(false)
  }

  return (
    <>
      <style>{`
        .sp-shell { display: flex; flex-direction: column; gap: 20px; }
        .sp-card { background: ${colors.bgCard}; border-radius: 18px; box-shadow: ${shadows.card}; padding: 22px 18px; }
        .sp-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
        .sp-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .sp-table-wrap { overflow-x: auto; border-radius: ${radius.lg}; border: 1px solid ${colors.border}; background: ${colors.bgCard}; }
        .sp-table { width: 100%; min-width: 860px; border-collapse: collapse; }
        .sp-modal-backdrop { position: fixed; inset: 0; background: rgba(9, 20, 40, 0.58); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 70; }
        .sp-modal { width: min(900px, 100%); max-height: calc(100vh - 40px); overflow-y: auto; border-radius: 22px; background: ${colors.bgCard}; box-shadow: 0 18px 36px rgba(13, 33, 69, 0.24); }
        .sp-confirm { width: min(420px, 100%); border-radius: 22px; overflow: hidden; background: ${colors.bgCard}; box-shadow: 0 18px 36px rgba(0, 0, 0, 0.35); }
        .sp-modal-header { padding: 22px 26px 16px; border-bottom: 1px solid ${colors.border}; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .sp-modal-body { padding: 22px 26px 26px; display: flex; flex-direction: column; gap: 22px; }
        .sp-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .sp-info-card { padding: 16px; border-radius: ${radius.lg}; background: ${colors.bgInput}; border: 1px solid ${colors.border}; }
        .sp-file-row { display: grid; grid-template-columns: minmax(0, 1fr) 150px; gap: 12px; align-items: end; }
        .sp-comment { border-left: 4px solid ${colors.primary}; background: #FFF9E7; border-radius: 0 ${radius.md} ${radius.md} 0; padding: 14px 16px; }
        .sp-confirm-top { background: ${colors.navy}; color: ${colors.textWhite}; padding: 20px 24px; text-align: center; font-size: ${typography.xl}; font-weight: 700; }
        .sp-confirm-body { padding: 18px 24px 24px; display: flex; flex-direction: column; gap: 18px; }

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
                placeholder="Buscar por ID, fecha o estado..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ ...inputStyle, width: '260px', maxWidth: '100%' }}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
              />

              <button
                type="button"
                onClick={abrirCrear}
                style={{
                  ...btnSuccess,
                  padding: '11px 18px',
                }}
              >
                Crear solicitud
              </button>
            </div>
          </div>

          <div className="sp-table-wrap">
            <table className="sp-table">
              <thead>
                <tr>
                  {['ID', 'Fecha de creacion', 'Estado', 'Observaciones', 'Accion'].map((header) => (
                    <th key={header} style={thStyle}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {solicitudesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '28px 20px', textAlign: 'center', color: colors.textMuted }}>
                      No hay solicitudes que coincidan con la busqueda.
                    </td>
                  </tr>
                ) : (
                  solicitudesFiltradas.map((solicitud, index) => (
                    <tr
                      key={solicitud.id}
                      onMouseEnter={() => setHoveredRow(solicitud.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        borderBottom: `1px solid ${colors.border}`,
                        background:
                          hoveredRow === solicitud.id
                            ? colors.bgRowHover
                            : index % 2 === 0
                              ? colors.bgCard
                              : '#EEF4FF',
                      }}
                    >
                      <td style={{ padding: '16px 20px', color: colors.textPrimary, fontWeight: 700 }}>{solicitud.id}</td>
                      <td style={{ padding: '16px 20px', color: colors.textSecondary }}>{solicitud.fechaCreacion}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '8px 12px',
                            borderRadius: radius.full,
                            fontWeight: 700,
                            fontSize: typography.sm,
                            ...estadoStyles[solicitud.estado],
                          }}
                        >
                          {solicitud.estado}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', color: colors.textSecondary }}>
                        {solicitud.observaciones || 'Sin observaciones.'}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <button
                          type="button"
                          onClick={() => abrirDetalle(solicitud)}
                          style={{
                            border: 'none',
                            borderRadius: radius.md,
                            background: colors.primary,
                            color: colors.primaryText,
                            fontWeight: 700,
                            padding: '10px 16px',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          Revisar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {detalleSolicitud && (
        <div className="sp-modal-backdrop">
          <div className="sp-modal">
            <div className="sp-modal-header">
              <div>
                <h2 style={{ margin: 0, fontSize: '26px', color: colors.textPrimary }}>Detalle de solicitud</h2>
                <p style={{ margin: '6px 0 0', color: colors.textSecondary }}>
                  {detalleSolicitud.id} · Contrato {detalleSolicitud.contratoId}
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarDetalle}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: radius.full,
                  border: 'none',
                  background: colors.bgInput,
                  color: colors.textSecondary,
                  cursor: 'pointer',
                  fontSize: '20px',
                }}
              >
                ×
              </button>
            </div>

            <div className="sp-modal-body">
              <div className="sp-grid">
                <div className="sp-info-card">
                  <div style={{ fontSize: typography.xs, color: colors.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Fecha de creacion</div>
                  <div style={{ marginTop: 8, color: colors.textPrimary, fontWeight: 700 }}>{detalleSolicitud.fechaCreacion}</div>
                </div>
                <div className="sp-info-card">
                  <div style={{ fontSize: typography.xs, color: colors.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Estado actual</div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ display: 'inline-flex', padding: '8px 12px', borderRadius: radius.full, fontWeight: 700, ...estadoStyles[detalleSolicitud.estado] }}>
                      {detalleSolicitud.estado}
                    </span>
                  </div>
                </div>
                <div className="sp-info-card">
                  <div style={{ fontSize: typography.xs, color: colors.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Periodo reportado</div>
                  <div style={{ marginTop: 8, color: colors.textPrimary }}>{detalleSolicitud.periodo}</div>
                </div>
                <div className="sp-info-card">
                  <div style={{ fontSize: typography.xs, color: colors.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Observaciones</div>
                  <div style={{ marginTop: 8, color: colors.textSecondary }}>{detalleSolicitud.observaciones || 'Sin observaciones.'}</div>
                </div>
              </div>

              <section>
                <h3 style={{ margin: '0 0 6px', fontSize: '22px', color: colors.textPrimary }}>Informacion general</h3>
                <p style={{ margin: 0, color: colors.textSecondary }}>{detalleSolicitud.descripcion}</p>
              </section>

              <section>
                <h3 style={{ margin: '0 0 14px', fontSize: '22px', color: colors.textPrimary }}>Documentos</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {detalleSolicitud.documentos.map((documento) => (
                    <div
                      key={documento.nombre}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        padding: '14px 16px',
                        borderRadius: radius.lg,
                        background: colors.bgInput,
                        border: `1px solid ${colors.border}`,
                        flexWrap: 'wrap',
                      }}
                    >
                      <div>
                        <div style={{ color: colors.textPrimary, fontWeight: 700 }}>{documento.nombre}</div>
                        <div style={{ marginTop: 4, color: colors.textSecondary, fontSize: typography.sm }}>
                          {documento.tipo} · {documento.fecha}
                        </div>
                      </div>

                      <button
                        type="button"
                        style={{
                          border: 'none',
                          borderRadius: radius.md,
                          background: '#304A9A',
                          color: colors.textWhite,
                          fontWeight: 700,
                          padding: '10px 16px',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}
                      >
                        Ver documento
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 style={{ margin: '0 0 14px', fontSize: '22px', color: colors.textPrimary }}>Comentarios</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {detalleSolicitud.comentarios.map((comentario, index) => (
                    <div key={`${comentario.autor}-${index}`} className="sp-comment">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                        <strong style={{ color: colors.textPrimary }}>{comentario.autor}</strong>
                        <span style={{ color: colors.textMuted, fontSize: typography.sm }}>{comentario.fecha}</span>
                      </div>
                      <p style={{ margin: '8px 0 0', color: colors.textSecondary }}>{comentario.mensaje}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {mostrarCrear && (
        <div className="sp-modal-backdrop">
          <div className="sp-modal">
            <div className="sp-modal-header">
              <div>
                <h2 style={{ margin: 0, fontSize: '26px', color: colors.textPrimary }}>Crear solicitud</h2>
                <p style={{ margin: '6px 0 0', color: colors.textSecondary }}>
                  Completa la informacion base y adjunta los soportes de la solicitud.
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarCrear}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: radius.full,
                  border: 'none',
                  background: colors.bgInput,
                  color: colors.textSecondary,
                  cursor: 'pointer',
                  fontSize: '20px',
                }}
              >
                ×
              </button>
            </div>

            <div className="sp-modal-body">
              <div className="sp-grid">
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, color: colors.textPrimary }}>ID contrato</label>
                  <input
                    value={nuevaSolicitud.contratoId}
                    onChange={(e) => setNuevaSolicitud((prev) => ({ ...prev, contratoId: e.target.value }))}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, color: colors.textPrimary }}>Periodo</label>
                  <input
                    value={nuevaSolicitud.periodo}
                    onChange={(e) => setNuevaSolicitud((prev) => ({ ...prev, periodo: e.target.value }))}
                    placeholder="Ej. Marzo 2026"
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, color: colors.textPrimary }}>Descripcion</label>
                <textarea
                  value={nuevaSolicitud.descripcion}
                  onChange={(e) => setNuevaSolicitud((prev) => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Resume brevemente el alcance de la solicitud."
                  style={{ ...inputStyle, minHeight: 110, resize: 'vertical' }}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
                />
              </div>

              <section>
                <h3 style={{ margin: '0 0 14px', fontSize: '22px', color: colors.textPrimary }}>Documentos</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {DOCUMENTOS_REQUERIDOS.map((documento) => (
                    <div key={documento.id} className="sp-file-row">
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, color: colors.textPrimary }}>
                          {documento.etiqueta}
                        </label>
                        <input
                          value={nuevaSolicitud.documentos[documento.id]}
                          onChange={(e) => actualizarDocumento(documento.id, e.target.value)}
                          placeholder="Nombre del archivo"
                          style={inputStyle}
                          onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                          onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
                        />
                      </div>

                      <button
                        type="button"
                        style={{
                          height: 42,
                          border: 'none',
                          borderRadius: radius.md,
                          background: '#304A9A',
                          color: colors.textWhite,
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}
                      >
                        Adjuntar
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
                <button type="button" onClick={cerrarCrear} style={{ ...btnDanger, width: 'auto', padding: '10px 18px' }}>
                  Cancelar
                </button>
                <button type="button" onClick={() => setMostrarConfirmacion(true)} style={{ ...btnSuccess, padding: '10px 18px' }}>
                  Enviar solicitud
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarConfirmacion && (
        <div className="sp-modal-backdrop">
          <div className="sp-confirm">
            <div className="sp-confirm-top">Confirmacion de envio</div>
            <div className="sp-confirm-body">
              <div style={{ borderRadius: radius.md, background: '#F4F7FF', padding: '14px 16px', textAlign: 'center', color: colors.textPrimary, fontWeight: 800 }}>
                SOLICITUD PARA CONTRATO {nuevaSolicitud.contratoId}
              </div>

              <div style={{ borderRadius: radius.md, background: '#E8F0FE', padding: '28px 20px', textAlign: 'center', color: colors.textSecondary, fontSize: typography.md }}>
                Desea enviar esta solicitud de pago y dejarla en estado de revision.
              </div>

              <button type="button" onClick={() => setMostrarConfirmacion(false)} style={{ ...btnDanger, padding: '12px 18px', fontSize: typography.md }}>
                Cancelar
              </button>
              <button type="button" onClick={confirmarEnvio} style={{ ...btnSuccess, padding: '12px 18px', fontSize: typography.md }}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
