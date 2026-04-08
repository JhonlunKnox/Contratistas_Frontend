import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import DashboardLayout from '../Layouts/DashboardLayout'
import SupervisorLayout from '../Layouts/SupervisorLayout'
import RegistrarTrabajador from '../pages/Admin/RegistrarTrabajador'
import Actividades from '../pages/Empleado/Actividades'
import Dashboard from '../pages/Empleado/Dashboard'
import Historial from '../pages/Empleado/Historial'
import MisContratos from '../pages/Empleado/MisContratos'
import Solicitudes from '../pages/Empleado/Solicitudes'
import Notificaciones from '../pages/Empleado/Notificaciones'
import DashboardSupervisor from '../pages/Supervisor/DashboardSupervisor'
import MisContratistas from '../pages/Supervisor/MisContratistas'
import SolicitudesSupervisor from '../pages/Supervisor/SolicitudesSupervisor'
// 👇 Importamos la nueva pantalla del Historial del Supervisor
import HistorialSupervisor from '../pages/Supervisor/HistorialSupervisor' 

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* ── Contratista (Empleado) ── */}
        <Route path="/empleado" element={<DashboardLayout role="empleado" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"   element={<Dashboard />} />
          <Route path="actividades" element={<Actividades />} />
          <Route path="contratos"   element={<MisContratos />} />
          <Route path="solicitudes" element={<Solicitudes />} />
          <Route path="historial"   element={<Historial />} />
          <Route path="notifs"      element={<Notificaciones />} />
        </Route>

        {/* ── Supervisor ── */}
        <Route path="/supervisor" element={<SupervisorLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"     element={<DashboardSupervisor />} />
          <Route path="contratistas"  element={<MisContratistas />} />
          <Route path="solicitudes"   element={<SolicitudesSupervisor />} />
          {/* 👇 Añadimos la nueva ruta para el historial */}
          <Route path="historial"     element={<HistorialSupervisor />} /> 
        </Route>

        {/* ── Admin / Gerente ── */}
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<Navigate to="registrar" replace />} />
          <Route path="registrar" element={<RegistrarTrabajador />} />
        </Route>

        {/* Redirects mayúsculas */}
        <Route path="/Empleado"              element={<Navigate to="/empleado" replace />} />
        <Route path="/Empleado/dashboard"    element={<Navigate to="/empleado/dashboard" replace />} />
        <Route path="/Empleado/actividades"  element={<Navigate to="/empleado/actividades" replace />} />
        <Route path="/Empleado/contratos"    element={<Navigate to="/empleado/contratos" replace />} />
        <Route path="/Empleado/solicitudes"  element={<Navigate to="/empleado/solicitudes" replace />} />
        <Route path="/Empleado/historial"    element={<Navigate to="/empleado/historial" replace />} />
        <Route path="/Empleado/notifs"       element={<Navigate to="/empleado/notifs" replace />} />
        <Route path="/Admin"                 element={<Navigate to="/admin" replace />} />
        <Route path="/Admin/registrar"       element={<Navigate to="/admin/registrar" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}