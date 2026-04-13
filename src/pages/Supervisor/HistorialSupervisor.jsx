import { useState, useEffect, useMemo } from 'react'
import { colors, radius, typography, shadows } from '../../theme'
import { apiFetch } from '../../services/api'

const estadoStyles = {
  Aprobado:      { background: '#EAF8EF', color: '#1E6E3A' },
  Pendiente:     { background: '#FFF5DA', color: '#A16207' },
  'No Aprobado': { background: '#FEECEC', color: '#B42318' },
}

export default function HistorialSupervisor() {
  const [historial, setHistorial]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [busqueda, setBusqueda]     = useState('')

  useEffect(() => {
    apiFetch('/api/solicitudes')
      .then(({ solicitudes }) => {
        // Historial: todo lo que ya no está Pendiente
        setHistorial(solicitudes.filter(s => s.estado !== 'Pendiente'))
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtradas = useMemo(() => {
    const term = busqueda.toLowerCase()
    return historial.filter(s =>
      String(s.solicitud_id).includes(busqueda) ||
      String(s.contrato_id).includes(busqueda) ||
      (s.nombre_contratista || '').toLowerCase().includes(term) ||
      s.estado.toLowerCase().includes(term)
    )
  }, [busqueda, historial])

  return (
    <>
      <style>{`
        .hs-shell { width: 100%; box-sizing: border-box; display: flex; flex-direction: column; gap: 24px; }
        .hs-topbar { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 10px 0; }
        .hs-search-container { position: relative; width: 50%; max-width: 600px; margin: 0 auto; }
        .hs-search-input { width: 100%; padding: 14px 20px 14px 20px; border-radius: 30px; border: none; background: white; font-family: inherit; font-size: ${typography.md || '14px'}; box-shadow: 0 2px 10px rgba(0,0,0,0.05); outline: none; box-sizing: border-box; }
        .hs-card { background: ${colors?.bgCard || 'white'}; border-radius: ${radius?.xl || '24px'}; box-shadow: ${shadows?.card || '0 8px 30px rgba(0,0,0,0.04)'}; padding: 32px; width: 100%; box-sizing: border-box; }
        .hs-title { margin: 0 0 24px 0; font-size: 24px; font-weight: 800; color: ${colors?.textPrimary || '#1A2C6B'}; }
        .hs-table-wrapper { width: 100%; overflow-x: auto; }
        .hs-table { width: 100%; border-collapse: separate; border-spacing: 0 8px; text-align: center; min-width: 700px; }
        .hs-table th { background-color: #EBF2F9; color: #111827; padding: 16px; font-weight: 700; font-size: 14px; border: none; }
        .hs-table th:first-child { border-top-left-radius: 8px; border-bottom-left-radius: 8px; }
        .hs-table th:last-child { border-top-right-radius: 8px; border-bottom-right-radius: 8px; }
        .hs-table td { padding: 14px 16px; font-size: 14px; font-weight: 600; color: #374151; background-color: white; }
        .hs-table tr:nth-child(even) td { background-color: #EBF2F9; }
        .hs-table td:first-child { border-top-left-radius: 8px; border-bottom-left-radius: 8px; }
        .hs-table td:last-child { border-top-right-radius: 8px; border-bottom-right-radius: 8px; }
      `}</style>

      <div className="hs-shell">
        <div className="hs-topbar">
          <div style={{ width: '80px' }} />
          <div className="hs-search-container">
            <input
              type="text"
              className="hs-search-input"
              placeholder="Buscar por ID, contratista o estado..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
          <div style={{ width: '80px' }} />
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: radius.md, color: '#ef4444', fontSize: typography.sm }}>
            {error}
          </div>
        )}

        <div className="hs-card">
          <h2 className="hs-title">Historial de solicitudes</h2>

          <div className="hs-table-wrapper">
            <table className="hs-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha Solicitud</th>
                  <th>Contratista</th>
                  <th>Contrato</th>
                  <th>Estado</th>
                  <th>Observación</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: colors.textMuted }}>Cargando...</td></tr>
                ) : filtradas.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: colors.textMuted }}>
                    {historial.length === 0 ? 'No hay solicitudes en el historial.' : 'Sin resultados.'}
                  </td></tr>
                ) : (
                  filtradas.map(item => {
                    const style = estadoStyles[item.estado] || estadoStyles['Pendiente']
                    return (
                      <tr key={item.solicitud_id}>
                        <td>{item.solicitud_id}</td>
                        <td>{new Date(item.created_at).toLocaleDateString('es-CO')}</td>
                        <td>{item.nombre_contratista || '—'}</td>
                        <td>{item.contrato_id}</td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '13px', ...style }}>
                            {item.estado}
                          </span>
                        </td>
                        <td style={{ maxWidth: 200, wordBreak: 'break-word' }}>
                          {item.comentario || '—'}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
