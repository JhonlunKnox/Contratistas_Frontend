import { useMemo, useState } from 'react'
import { colors, radius, typography, shadows, inputStyle, inputFocusStyle, inputBlurStyle } from '../../theme'

const NOTIFICACIONES_INICIALES = [
  {
    id: 'NOT-001',
    fecha: '20 de Febrero',
    resumen: 'La supervisora Angela ha aprobado una solicitud, se ha agregado a la lista de solicitudes por revisar.',
    detalle:
      'La solicitud SOL-2026-002 fue aprobada por la supervisora Angela. Puedes revisar el detalle completo, los documentos validados y continuar con el seguimiento del proceso de pago.',
    tipo: 'Aprobacion',
  },
  {
    id: 'NOT-002',
    fecha: '11 de Febrero',
    resumen: 'El supervisor Ricardo ha generado un reporte sobre una solicitud.',
    detalle:
      'Se generó un reporte asociado a la solicitud SOL-2026-001. El informe resume observaciones, soportes revisados y recomendaciones sobre la documentación enviada.',
    tipo: 'Reporte',
  },
  {
    id: 'NOT-003',
    fecha: '9 de Febrero',
    resumen: 'La supervisora Catalina ha aprobado una solicitud, se ha agregado a la lista de solicitudes por revisar.',
    detalle:
      'La solicitud SOL-2026-003 fue aprobada parcialmente. Verifica las observaciones del supervisor y confirma si debes adjuntar documentación adicional.',
    tipo: 'Aprobacion',
  },
  {
    id: 'NOT-004',
    fecha: '5 de Febrero',
    resumen: 'El supervisor Ricardo ha generado un reporte sobre una solicitud.',
    detalle:
      'Existe un reporte nuevo vinculado a tu solicitud de pago del periodo enero 2026. Puedes consultarlo para conocer observaciones y siguientes pasos.',
    tipo: 'Reporte',
  },
  {
    id: 'NOT-005',
    fecha: '30 de Enero',
    resumen: 'La supervisora Catalina ha aprobado una solicitud, se ha agregado a la lista de solicitudes por revisar.',
    detalle:
      'La solicitud aprobada quedó actualizada en tu historial. Revisa el estado y descarga los soportes asociados si necesitas archivarlos.',
    tipo: 'Aprobacion',
  },
  {
    id: 'NOT-006',
    fecha: '7 de Enero',
    resumen: 'El supervisor Ricardo ha generado un reporte sobre una solicitud.',
    detalle:
      'El reporte contiene comentarios sobre el certificado ARL y la planilla de seguridad social. Se recomienda revisarlo antes de enviar una nueva versión.',
    tipo: 'Reporte',
  },
]

export default function Notificaciones() {
  const [busqueda, setBusqueda] = useState('')
  const [notificaciones, setNotificaciones] = useState(NOTIFICACIONES_INICIALES)
  const [notificacionActiva, setNotificacionActiva] = useState(null)
  const [pagina, setPagina] = useState(1)

  const porPagina = 5

  const filtradas = useMemo(() => {
    const term = busqueda.toLowerCase()
    return notificaciones.filter(
      (item) =>
        item.fecha.toLowerCase().includes(term) ||
        item.resumen.toLowerCase().includes(term) ||
        item.tipo.toLowerCase().includes(term)
    )
  }, [busqueda, notificaciones])

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / porPagina))
  const paginaActual = Math.min(pagina, totalPaginas)
  const inicio = (paginaActual - 1) * porPagina
  const visibles = filtradas.slice(inicio, inicio + porPagina)

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return
    setPagina(nuevaPagina)
  }

  const abrirNotificacion = (notificacion) => {
    setNotificacionActiva(notificacion)
  }

  const cerrarDetalle = () => setNotificacionActiva(null)

  const eliminarNotificacion = (id) => {
    setNotificaciones((prev) => prev.filter((item) => item.id !== id))
    setNotificacionActiva((prev) => (prev && prev.id === id ? null : prev))
  }

  return (
    <>
      <style>{`
        .nt-shell {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .nt-card {
          background: ${colors.bgCard};
          border-radius: 18px;
          box-shadow: ${shadows.card};
          padding: 18px 16px 22px;
        }

        .nt-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .nt-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .nt-item {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          background: #EAF1FF;
          border-radius: ${radius.md};
          padding: 14px 14px 14px 16px;
          border: 1px solid #D9E4FB;
        }

        .nt-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .nt-page {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
          flex-wrap: wrap;
        }

        .nt-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(9, 20, 40, 0.58);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 70;
        }

        .nt-modal {
          width: min(760px, 100%);
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          border-radius: 22px;
          background: ${colors.bgCard};
          box-shadow: 0 18px 36px rgba(13, 33, 69, 0.24);
        }

        .nt-modal-header {
          padding: 22px 24px 16px;
          border-bottom: 1px solid ${colors.border};
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .nt-modal-body {
          padding: 22px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        @media (max-width: 768px) {
          .nt-item {
            flex-direction: column;
          }

          .nt-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .nt-modal-header,
          .nt-modal-body {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
      `}</style>

      <section className="nt-shell">
        <div className="nt-card">
          <div className="nt-toolbar">
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', color: colors.textPrimary, fontWeight: 700 }}>
                Notificaciones
              </h1>
              <p style={{ margin: '6px 0 0', color: colors.textSecondary, fontSize: typography.md }}>
                Consulta los avisos recientes y administra cuáles quieres conservar.
              </p>
            </div>

            <input
              placeholder="Buscar por fecha, tipo o texto..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value)
                setPagina(1)
              }}
              style={{ ...inputStyle, width: '280px', maxWidth: '100%' }}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
            />
          </div>

          <div className="nt-list">
            {visibles.length === 0 ? (
              <div
                style={{
                  padding: '24px 18px',
                  borderRadius: radius.lg,
                  background: colors.bgInput,
                  color: colors.textMuted,
                  textAlign: 'center',
                }}
              >
                No hay notificaciones que coincidan con la búsqueda.
              </div>
            ) : (
              visibles.map((notificacion) => (
                <div key={notificacion.id} className="nt-item">
                  <div style={{ flex: 1 }}>
                    <div style={{ color: colors.textPrimary, fontSize: typography.base, lineHeight: 1.55 }}>
                      <strong>{notificacion.fecha}</strong> / {notificacion.resumen}{' '}
                      {notificacion.tipo === 'Reporte' ? <strong>Ver reporte</strong> : null}
                    </div>

                  </div>

                  <div className="nt-actions">
                    <button
                      type="button"
                      onClick={() => abrirNotificacion(notificacion)}
                      style={actionButton(colors.primary, colors.primaryText)}
                    >
                      Entrar
                    </button>
                    <button
                      type="button"
                      onClick={() => eliminarNotificacion(notificacion.id)}
                      style={actionButton(colors.danger, colors.textWhite)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="nt-page">
            <button type="button" onClick={() => cambiarPagina(paginaActual - 1)} style={pageButton(false)}>
              ← Anterior
            </button>
            {Array.from({ length: totalPaginas }, (_, index) => index + 1).map((num) => (
              <button key={num} type="button" onClick={() => cambiarPagina(num)} style={pageButton(num === paginaActual)}>
                {num}
              </button>
            ))}
            <button type="button" onClick={() => cambiarPagina(paginaActual + 1)} style={pageButton(false)}>
              Siguiente →
            </button>
          </div>
        </div>
      </section>

      {notificacionActiva && (
        <div className="nt-modal-backdrop">
          <div className="nt-modal">
            <div className="nt-modal-header">
              <div>
                <h2 style={{ margin: 0, fontSize: '26px', color: colors.textPrimary }}>Detalle de notificación</h2>
                <p style={{ margin: '6px 0 0', color: colors.textSecondary }}>
                  {notificacionActiva.id} · {notificacionActiva.fecha}
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

            <div className="nt-modal-body">
              <div
                style={{
                  padding: '16px',
                  borderRadius: radius.lg,
                  background: '#EAF1FF',
                  border: '1px solid #D9E4FB',
                  color: colors.textPrimary,
                  lineHeight: 1.7,
                }}
              >
                <strong>{notificacionActiva.fecha}</strong> / {notificacionActiva.resumen}
              </div>

              <div
                style={{
                  padding: '18px',
                  borderRadius: radius.lg,
                  background: colors.bgInput,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div style={{ fontSize: typography.xs, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase' }}>
                  Contenido
                </div>
                <p style={{ margin: '10px 0 0', color: colors.textSecondary, lineHeight: 1.7 }}>
                  {notificacionActiva.detalle}
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    padding: '16px',
                    borderRadius: radius.lg,
                    background: colors.bgInput,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div style={{ fontSize: typography.xs, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase' }}>
                    Tipo
                  </div>
                  <div style={{ marginTop: 8, color: colors.textPrimary, fontWeight: 700 }}>
                    {notificacionActiva.tipo}
                  </div>
                </div>

                <div
                  style={{
                    padding: '16px',
                    borderRadius: radius.lg,
                    background: colors.bgInput,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div style={{ fontSize: typography.xs, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase' }}>
                    Identificador
                  </div>
                  <div style={{ marginTop: 8, color: colors.textPrimary, fontWeight: 700 }}>
                    {notificacionActiva.id}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => eliminarNotificacion(notificacionActiva.id)}
                  style={actionButton(colors.danger, colors.textWhite)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function actionButton(background, color) {
  return {
    border: 'none',
    borderRadius: '8px',
    background,
    color,
    fontWeight: 700,
    padding: '10px 14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  }
}

function pageButton(active) {
  return {
    border: 'none',
    borderRadius: '8px',
    background: active ? '#2B2B2B' : 'transparent',
    color: active ? '#FFFFFF' : '#444',
    padding: '8px 10px',
    minWidth: active ? '30px' : 'auto',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: active ? 700 : 500,
  }
}
