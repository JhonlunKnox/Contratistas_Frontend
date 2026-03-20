import { useMemo, useState } from 'react'
import { colors, radius, typography, shadows, inputStyle, inputFocusStyle, inputBlurStyle, thStyle } from '../../theme'

const ACTIVIDADES_INICIALES = [
  {
    id: 1,
    nombre: 'Llamadas',
    descripcion: 'Gestion de consultas',
    contratoId: '146345',
    fecha: '22/04/2022',
    cantidad: 30,
  },
  {
    id: 2,
    nombre: 'Mensajes',
    descripcion: 'Atencion al cliente',
    contratoId: '146345',
    fecha: '21/04/2022',
    cantidad: 45,
  },
  {
    id: 3,
    nombre: 'Seguimiento',
    descripcion: 'Revision de novedades contractuales',
    contratoId: '156532',
    fecha: '18/04/2022',
    cantidad: 18,
  },
]

export default function Actividades() {
  const [busqueda, setBusqueda] = useState('')
  const [hoveredRow, setHoveredRow] = useState(null)

  const actividades = useMemo(() => {
    const term = busqueda.toLowerCase()
    return ACTIVIDADES_INICIALES.filter(
      (actividad) =>
        actividad.nombre.toLowerCase().includes(term) ||
        actividad.descripcion.toLowerCase().includes(term) ||
        actividad.contratoId.includes(busqueda) ||
        actividad.fecha.includes(busqueda)
    )
  }, [busqueda])

  const descargarPdf = (actividad) => {
    const lineas = [
      'CLARITY - Evidencia de actividad',
      `Actividad: ${actividad.nombre}`,
      `Descripcion: ${actividad.descripcion}`,
      `Id contrato: ${actividad.contratoId}`,
      `Fecha: ${actividad.fecha}`,
      `Cantidad realizada: ${actividad.cantidad}`,
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
        .ac-shell {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .ac-card {
          background: ${colors.bgCard};
          border-radius: 18px;
          box-shadow: ${shadows.card};
          padding: 22px 18px;
        }

        .ac-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .ac-table-wrap {
          overflow-x: auto;
          border-radius: ${radius.lg};
          border: 1px solid ${colors.border};
          background: ${colors.bgCard};
        }

        .ac-table {
          width: 100%;
          min-width: 920px;
          border-collapse: collapse;
        }
      `}</style>

      <section className="ac-shell">
        <div className="ac-card">
          <div className="ac-toolbar">
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', color: colors.textPrimary, fontWeight: 700 }}>
                Registro de actividades
              </h1>
              <p style={{ margin: '6px 0 0', color: colors.textSecondary, fontSize: typography.md }}>
                Consulta las actividades realizadas y descarga su evidencia en PDF.
              </p>
            </div>

            <input
              placeholder="Buscar actividad, fecha o contrato..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ ...inputStyle, width: '280px', maxWidth: '100%' }}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
            />
          </div>

          <div className="ac-table-wrap">
            <table className="ac-table">
              <thead>
                <tr>
                  {['Nombre actividad', 'Descripcion', 'Id contrato', 'Fecha', 'Cantidad realizada', 'Evidencia'].map((header) => (
                    <th key={header} style={thStyle}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {actividades.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '28px 20px', textAlign: 'center', color: colors.textMuted }}>
                      No hay actividades que coincidan con la busqueda.
                    </td>
                  </tr>
                ) : (
                  actividades.map((actividad, index) => (
                    <tr
                      key={actividad.id}
                      onMouseEnter={() => setHoveredRow(actividad.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        borderBottom: `1px solid ${colors.border}`,
                        background:
                          hoveredRow === actividad.id
                            ? colors.bgRowHover
                            : index % 2 === 0
                              ? colors.bgCard
                              : '#EEF4FF',
                      }}
                    >
                      <td style={{ padding: '16px 20px', color: colors.textPrimary, fontWeight: 600 }}>
                        {actividad.nombre}
                      </td>
                      <td style={{ padding: '16px 20px', color: colors.textSecondary }}>
                        {actividad.descripcion}
                      </td>
                      <td style={{ padding: '16px 20px', color: colors.textPrimary }}>
                        {actividad.contratoId}
                      </td>
                      <td style={{ padding: '16px 20px', color: colors.textSecondary }}>
                        {actividad.fecha}
                      </td>
                      <td style={{ padding: '16px 20px', color: colors.textPrimary, fontWeight: 700 }}>
                        {actividad.cantidad}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <button
                          type="button"
                          onClick={() => descargarPdf(actividad)}
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
