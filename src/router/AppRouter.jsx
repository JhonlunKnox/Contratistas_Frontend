import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import DashboardLayout from '../Layouts/DashboardLayout'
import RegistrarTrabajador from '../pages/Admin/RegistrarTrabajador'
import MisContratos from '../pages/Empleado/MisContratos'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Rutas Admin */}
        <Route element={<DashboardLayout role="admin" />}>
          <Route path="/Admin/registrar" element={<RegistrarTrabajador />} />
        </Route>

        {/* Rutas Empleado */}
        <Route element={<DashboardLayout role="empleado" />}>
          <Route path="/Empleado/contratos" element={<MisContratos />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}