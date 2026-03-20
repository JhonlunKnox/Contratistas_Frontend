import { colors, typography, cardStyle, thStyle } from '../../theme'

export default function Empleado() {
  const empleados = [
    { id: 1, nombre: 'Andrés Gómez', email: 'andres@empresa.com', telefono: '+57 300 123 4567', estado: 'Activo' },
    { id: 2, nombre: 'María López', email: 'maria@empresa.com', telefono: '+57 300 234 5678', estado: 'Activo' },
    { id: 3, nombre: 'Carlos Rodríguez', email: 'carlos@empresa.com', telefono: '+57 300 345 6789', estado: 'Inactivo' },
  ]

  return (
    <>
      <style>{`
        .emp-table { width: 100%; border-collapse: collapse; background: ${colors.bgCard}; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,0.06); }
        .emp-table th { ${Object.entries(thStyle).map(([k, v]) => `${k}: ${v}`).join('; ')} }
        .emp-table td { padding: 12px 20px; border-bottom: 1px solid ${colors.border}; font-size: ${typography.sm}; }
        .emp-table tr:last-child td { border-bottom: none; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
        .badge-activo { background: ${colors.successLight}; color: ${colors.successText}; }
        .badge-inactivo { background: ${colors.dangerLight}; color: ${colors.dangerText}; }
      `}</style>

      <h1 style={{ fontSize: typography.xl, fontWeight: 600, color: colors.textPrimary, marginBottom: 20 }}>
        Contratistas
      </h1>

      <div style={cardStyle}>
        <table className="emp-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map(emp => (
              <tr key={emp.id}>
                <td style={{ fontWeight: 500 }}>{emp.nombre}</td>
                <td>{emp.email}</td>
                <td>{emp.telefono}</td>
                <td>
                  <span className={`badge badge-${emp.estado.toLowerCase()}`}>
                    {emp.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
