import { useMemo, useState, useEffect } from 'react'
import { colors, radius, typography, shadows, inputStyle, inputFocusStyle, inputBlurStyle, thStyle } from '../../theme'
import { apiFetch } from '../../services/api'

export default function Actividades() {
  const [actividades, setActividades]   = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [busqueda, setBusqueda]         = useState('')
  const [hoveredRow, setHoveredRow]     = useState(null)

  useEffect(() => {
    apiFetch('/api/contratos')
      .then(async ({ contratos }) => {
        const resultados = await Promise.all(
          contratos.map(c =>
            apiFetch(`/api/contratos/${c.contrato_id}/actividades`)
              .then(d => d.actividades.map(a => ({ ...a, contrato_id: c.contrato_id })))
              .catch(() => [])
          )
        )
        setActividades(resultados.flat())
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtradas = useMemo(() => {
    const term = busqueda.toLowerCase()
    return actividades.filter(
      (a) =>
        a.nombre.toLowerCase().includes(term) ||
        (a.descripcion || '').toLowerCase().includes(term) ||
        String(a.contrato_id).includes(busqueda)
    )
  }, [busqueda, actividades])

  const descargarPdf = (actividad) => {
    const lineas = [
      'CLARITY - Evidencia de actividad',
      `Actividad: ${actividad.nombre}`,
      `Descripcion: ${actividad.descripcion || ''}`,
      `Id contrato: ${actividad.contrato_id}`,
      `Fecha: ${new Date(actividad.created_at).toLocaleDateString('es-CO')}`,
    ]

    const escapar = (texto) => texto.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
    const operaciones = lineas
      .map((linea, index) => `BT /F1 12 Tf 50 ${760 - index * 22} Td (${escapar(linea)}) Tj ET`)
      .join('\n')

    const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Count 1 /Kids [3 0 R] >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length ${operaciones.length} >>
stream
${operaciones}
endstream
endobj
xref
0 6
0000000000 65535 f
0000000010 00000 n
0000000063 00000 n
0000000122 00000 n
0000000248 00000 n
0000000318 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${318 + String(operaciones.length).length}
%%EOF`

    const blob = new Blob([pdf], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${actividad.nombre.toLowerCase().replace(/\s+/g, '-')}-evidencia.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <style>{`
        .ac-shell { display: flex; flex-direction: column; gap: 20px; }
        .ac-card { background: ${colors.bgCard}; border-radius: 18px; box-shadow: ${shadows.card}; padding: 22px 18px; }
        .ac-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
        .ac-table-wrap { overflow-x: auto; border-radius: ${radius.lg}; border: 1px solid ${colors.border}; background: ${colors.bgCard}; }
        .ac-table { width: 100%; min-width: 720px; border-collapse: collapse; }
      `}</style>

      <section className="ac-shell">
        <div className="ac-card">
          <div className="ac-toolbar">
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', color: colors.textPrimary, fontWeight: 700 }}>
                Registro de actividades
              </h1>
              <p style={{ margin: '6px 0 0', color: colors.textSecondary, fontSize: typography.md }}>
                Consulta las actividades registradas en tus contratos y descarga su evidencia en PDF.
              </p>
            </div>
            <input
              placeholder="Buscar actividad o contrato..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ ...inputStyle, width: '260px', maxWidth: '100%' }}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
            />
          </div>

          {error && (
            <div style={{ marginBottom: 14, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: radius.md, color: '#ef4444', fontSize: typography.sm }}>
              {error}
            </div>
          )}

          <div className="ac-table-wrap">
            <table className="ac-table">
              <thead>
                <tr>
                  {['Nombre actividad', 'Descripción', 'Id contrato', 'Fecha', 'Evidencia'].map((header) => (
                    <th key={header} style={thStyle}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ padding: '28px 20px', textAlign: 'center', color: colors.textMuted }}>Cargando actividades...</td></tr>
                ) : filtradas.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '28px 20px', textAlign: 'center', color: colors.textMuted }}>
                      {actividades.length === 0 ? 'No hay actividades registradas en tus contratos.' : 'No hay actividades que coincidan con la búsqueda.'}
                    </td>
                  </tr>
                ) : (
                  filtradas.map((actividad, index) => (
                    <tr
                      key={actividad.actividad_id}
                      onMouseEnter={() => setHoveredRow(actividad.actividad_id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        borderBottom: `1px solid ${colors.border}`,
                        background: hoveredRow === actividad.actividad_id ? colors.bgRowHover : index % 2 === 0 ? colors.bgCard : '#EEF4FF',
                      }}
                    >
                      <td style={{ padding: '16px 20px', color: colors.textPrimary, fontWeight: 600 }}>
                        {actividad.nombre}
                      </td>
                      <td style={{ padding: '16px 20px', color: colors.textSecondary }}>
                        {actividad.descripcion || '—'}
                      </td>
                      <td style={{ padding: '16px 20px', color: colors.textPrimary }}>
                        {actividad.contrato_id}
                      </td>
                      <td style={{ padding: '16px 20px', color: colors.textSecondary }}>
                        {new Date(actividad.created_at).toLocaleDateString('es-CO')}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <button
                          type="button"
                          onClick={() => descargarPdf(actividad)}
                          style={{ border: 'none', borderRadius: radius.md, background: '#304A9A', color: colors.textWhite, fontWeight: 700, padding: '10px 16px', cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                          Descargar PDF
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
    </>
  )
}
