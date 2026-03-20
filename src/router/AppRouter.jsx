import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import DashboardLayout from '../Layouts/DashboardLayout'
import AdminDashboard from '../pages/Admin/Dashboard'
import Empleado from '../pages/Admin/Empleado'
import RegistrarTrabajador from '../pages/Admin/RegistrarTrabajador'
import Dashboard from '../pages/Contratistas/Dashboard'
import Actividades from '../pages/Contratistas/Actividades'
import MisContratos from '../pages/Contratistas/MisContratos'
import Solicitudes from '../pages/Contratistas/Solicitudes'
import Historial from '../pages/Contratistas/Historial'
import Notificaciones from '../pages/Contratistas/Notificaciones'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="registrar" element={<RegistrarTrabajador />} />
          <Route path="empleados" element={<Empleado />} />
        </Route>

        <Route path="/contratista" element={<DashboardLayout role="contratista" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="actividades" element={<Actividades />} />
          <Route path="contratos" element={<MisContratos />} />
          <Route path="solicitudes" element={<Solicitudes />} />
          <Route path="historial" element={<Historial />} />
          <Route path="notificaciones" element={<Notificaciones />} />
        </Route>

        <Route path="/contratista" element={<Navigate to="/contratista" replace />} />
        <Route path="/Contratista/dashboard" element={<Navigate to="/contratista/dashboard" replace />} />
        <Route path="/Contratista/actividades" element={<Navigate to="/contratista/actividades" replace />} />
        <Route path="/Contratista/contratos" element={<Navigate to="/contratista/contratos" replace />} />
        <Route path="/Contratista/solicitudes" element={<Navigate to="/contratista/solicitudes" replace />} />
        <Route path="/Contratista/historial" element={<Navigate to="/contratista/historial" replace />} />
        <Route path="/Contratista/notificaciones" element={<Navigate to="/contratista/notificaciones" replace />} />
        <Route path="/Admin" element={<Navigate to="/admin" replace />} />
        <Route path="/Admin/registrar" element={<Navigate to="/admin/registrar" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
