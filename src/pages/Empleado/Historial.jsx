import { useMemo, useState, useEffect } from 'react'
import { colors, radius, typography, shadows, inputStyle, inputFocusStyle, inputBlurStyle, thStyle } from '../../theme'
import { apiFetch } from '../../services/api'

const estadoStyles = {
  Aprobado:      { background: '#EAF8EF', color: '#1E6E3A' },
  Pendiente:     { background: '#FFF5DA', color: '#A16207' },
  'No Aprobado': { background: '#FEECEC', color: '#B42318' },
}

const ESTADO_DISPLAY = {
  Aprobado:      'Aprobada',
  Pendiente:     'En revisión',
  'No Aprobado': 'Rechazada',
}

export default function Historial() {
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [busqueda, setBusqueda]       = useState('')
  const [hoveredRow, setHoveredRow]   = useState(null)

  useEffect(() => {
    apiFetch('/api/solicitudes')
      .then(data => setSolicitudes(data.solicitudes))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const resultados = useMemo(() => {
    const term = busqueda.toLowerCase()
    return solicitudes.filter(
      (item) =>
        String(item.solicitud_id).includes(busqueda) ||
        String(item.contrato_id).includes(busqueda) ||
        item.estado.toLowerCase().includes(term) ||
        (item.comentario || '').toLowerCase().includes(term)
    )
  }, [busqueda, solicitudes])

  return (
    <>
      <style>{`
        .hs-shell { display: flex; flex-direction: column; gap: 20px; }
        .hs-card { background: ${colors.bgCard}; border-radius: 18px; box-shadow: ${shadows.card}; padding: 22px 18px; }
        .hs-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
        .hs-table-wrap { overflow-x: auto; border-radius: ${radius.lg}; border: 1px solid ${colors.border}; }
        .hs-table { width: 100%; min-width: 840px; border-collapse: collapse; }
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

          {error && (
            <div style={{ marginBottom: 14, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: radius.md, color: '#ef4444', fontSize: typography.sm }}>
              {error}
            </div>
          )}

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
                {loading ? (
                  <tr><td colSpan={5} style={{ padding: '28px 20px', textAlign: 'center', color: colors.textMuted }}>Cargando...</td></tr>
                ) : resultados.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '28px 20px', textAlign: 'center', color: colors.textMuted, fontSize: typography.base }}>
                      {solicitudes.length === 0 ? 'No hay solicitudes registradas.' : 'No hay resultados para esa búsqueda.'}
                    </td>
                  </tr>
                ) : (
                  resultados.map((item, index) => {
                    const display = ESTADO_DISPLAY[item.estado] || item.estado
                    const style   = estadoStyles[item.estado] || estadoStyles['Pendiente']
                    return (
                      <tr
                        key={item.solicitud_id}
                        onMouseEnter={() => setHoveredRow(item.solicitud_id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={{
                          borderBottom: `1px solid ${colors.border}`,
                          background: hoveredRow === item.solicitud_id ? colors.bgRowHover : index % 2 === 0 ? colors.bgCard : '#EEF4FF',
                        }}
                      >
                        <td style={{ padding: '16px 20px', color: colors.textPrimary, fontWeight: 700 }}>
                          {item.solicitud_id}
                        </td>
                        <td style={{ padding: '16px 20px', color: colors.textPrimary, fontWeight: 600 }}>
                          {item.contrato_id}
                        </td>
                        <td style={{ padding: '16px 20px', color: colors.textSecondary }}>
                          {new Date(item.created_at).toLocaleDateString('es-CO')}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px 12px', borderRadius: radius.full, fontWeight: 700, fontSize: typography.sm, ...style }}>
                            {display}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', color: colors.textSecondary }}>
                          {item.comentario || 'Sin observaciones.'}
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
    </>
  )
}
