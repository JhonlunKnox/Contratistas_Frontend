import { useState, useEffect, useMemo } from 'react'
import { colors, radius, typography, shadows, inputStyle, inputFocusStyle, inputBlurStyle, thStyle } from '../../theme'
import { apiFetch } from '../../services/api'

function calcularFechaFinal(fechaInicio, duracionSemanas) {
  const fecha = new Date(fechaInicio)
  fecha.setDate(fecha.getDate() + duracionSemanas * 7)
  return fecha.toLocaleDateString('es-CO')
}

function formatearFecha(fechaStr) {
  return new Date(fechaStr).toLocaleDateString('es-CO')
}

function formatearMonto(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor)
}

export default function MisContratos() {
  const [contratos, setContratos]       = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [filtro, setFiltro]             = useState('')
  const [hoveredRow, setHoveredRow]     = useState(null)

  useEffect(() => {
    apiFetch('/api/contratos')
      .then(data => setContratos(data.contratos))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtrados = useMemo(() => {
    const term = filtro.toLowerCase()
    return contratos.filter(c =>
      String(c.contrato_id).includes(filtro) ||
      c.estado.toLowerCase().includes(term) ||
      (c.actividades || []).some(a => a.nombre.toLowerCase().includes(term))
    )
  }, [contratos, filtro])

  return (
    <>
      <style>{`
        .mc-table-wrap { background: ${colors.bgCard}; border-radius: ${radius.lg}; box-shadow: ${shadows.card}; overflow: hidden; }
        .mc-table { width: 100%; border-collapse: collapse; }
        .mc-table thead { display: table-header-group; }
        .mc-table tbody tr { display: table-row; }
        .mc-table td, .mc-table th { display: table-cell; }
        .mc-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 12px; flex-wrap: wrap; }

        @media (max-width: 640px) {
          .mc-table thead { display: none; }
          .mc-table-wrap { background: transparent; box-shadow: none; border-radius: 0; overflow: visible; }
          .mc-table, .mc-table tbody { display: block; width: 100%; }
          .mc-table tbody tr {
            display: block;
            background: ${colors.bgCard};
            border-radius: ${radius.lg};
            box-shadow: ${shadows.card};
            margin-bottom: 12px;
            padding: 16px;
          }
          .mc-table td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0 !important;
            border-bottom: 1px solid ${colors.border};
            font-size: 13px;
          }
          .mc-table td:last-child { border-bottom: none; }
          .mc-table td::before {
            content: attr(data-label);
            font-size: 11px;
            font-weight: 600;
            color: ${colors.textMuted};
            text-transform: uppercase;
            letter-spacing: 0.4px;
            flex-shrink: 0;
            margin-right: 12px;
          }
          .mc-header { flex-direction: column; align-items: flex-start; }
          .mc-header input { width: 100% !important; }
        }
      `}</style>

      <div style={{ maxWidth: '960px' }}>

        <div className="mc-header">
          <h1 style={{ fontSize: typography.xl, fontWeight: 600, color: colors.textPrimary }}>
            Mis Contratos
          </h1>
          <input
            placeholder="Filtrar por ID, estado o actividad..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            style={{ ...inputStyle, width: '220px', padding: '7px 12px' }}
            onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={e =>  Object.assign(e.target.style, inputBlurStyle)}
          />
        </div>

        {error && (
          <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: radius.md, color: '#ef4444', fontSize: typography.sm }}>
            {error}
          </div>
        )}

        <div className="mc-table-wrap">
          <table className="mc-table">
            <thead>
              <tr>
                {['ID de contrato', 'Fecha inicial', 'Fecha final', 'Actividad', 'Monto', 'Estado'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: colors.textMuted, fontSize: typography.sm }}>
                    Cargando contratos...
                  </td>
                </tr>
              ) : filtrados.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: colors.textMuted, fontSize: typography.sm }}>
                    {contratos.length === 0 ? 'No tienes contratos asignados.' : 'No se encontraron contratos.'}
                  </td>
                </tr>
              ) : (
                filtrados.map((c, i) => (
                  <tr key={c.contrato_id}
                    onMouseEnter={() => setHoveredRow(c.contrato_id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      borderBottom: `1px solid ${colors.border}`,
                      background: hoveredRow === c.contrato_id ? colors.bgRowHover : i % 2 === 0 ? colors.bgCard : colors.bgRowAlt,
                      transition: 'background 0.15s',
                    }}
                  >
                    <td data-label="ID" style={{ padding: '14px 20px', textAlign: 'center', color: colors.textSecondary, fontWeight: 500 }}>{c.contrato_id}</td>
                    <td data-label="Fecha inicial" style={{ padding: '14px 20px', color: colors.textSecondary }}>{formatearFecha(c.fecha_inicio)}</td>
                    <td data-label="Fecha final"   style={{ padding: '14px 20px', color: colors.textSecondary }}>{calcularFechaFinal(c.fecha_inicio, c.duracion_semanas)}</td>
                    <td data-label="Actividad"     style={{ padding: '14px 20px', color: colors.textPrimary }}>
                      {(c.actividades || []).length > 0
                        ? c.actividades.map(a => a.nombre).join(', ')
                        : <span style={{ color: colors.textMuted }}>Sin actividades</span>}
                    </td>
                    <td data-label="Monto"  style={{ padding: '14px 20px', color: colors.textPrimary, fontWeight: 600 }}>{formatearMonto(c.valor_total)}</td>
                    <td data-label="Estado" style={{ padding: '14px 20px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', padding: '5px 10px',
                        borderRadius: radius.full, fontWeight: 700, fontSize: typography.xs,
                        background: c.estado === 'Activo' ? '#EAF8EF' : c.estado === 'Finalizado' ? '#E8EFFE' : c.estado === 'Cancelado' ? '#FEECEC' : '#FFF5DA',
                        color: c.estado === 'Activo' ? '#1E6E3A' : c.estado === 'Finalizado' ? '#1A2C6B' : c.estado === 'Cancelado' ? '#B42318' : '#A16207',
                      }}>
                        {c.estado}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: 10, fontSize: typography.xs, color: colors.textMuted }}>
          {filtrados.length} contrato{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}
        </p>
      </div>
    </>
  )
}
