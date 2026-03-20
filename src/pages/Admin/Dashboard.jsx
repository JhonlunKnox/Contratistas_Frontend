import { colors, typography, cardStyle } from '../../theme'

export default function Dashboard() {
  const stats = [
    { label: 'Total Contratistas', value: 24, color: colors.primary },
    { label: 'Solicitudes Pendientes', value: 8, color: colors.warning },
    { label: 'Contratos Activos', value: 12, color: colors.success },
    { label: 'Notificaciones', value: 3, color: colors.danger },
  ]

  return (
    <>
      <style>{`
        .admin-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .stat-card { padding: 20px; border-radius: 8px; background: white; box-shadow: 0 1px 6px rgba(0,0,0,0.06); }
        .stat-value { font-size: 32px; font-weight: 700; margin: 8px 0; }
        .stat-label { font-size: 12px; color: ${colors.textMuted}; text-transform: uppercase; letter-spacing: 0.4px; }
      `}</style>

      <h1 style={{ fontSize: typography.xl, fontWeight: 600, color: colors.textPrimary, marginBottom: 24 }}>
        Dashboard
      </h1>

      <div className="admin-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div style={{ width: 12, height: 12, background: stat.color, borderRadius: '50%' }} />
            <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <h2 style={{ fontSize: typography.lg, fontWeight: 600, color: colors.textPrimary, marginBottom: 16 }}>
          Actividad Reciente
        </h2>
        <p style={{ color: colors.textMuted, fontSize: typography.sm }}>
          Los datos se mostrarán aquí cuando haya actividad en el sistema.
        </p>
      </div>
    </>
  )
}
