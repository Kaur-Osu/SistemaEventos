import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider }    from './context/AuthContext';
import { ToastProvider }   from './context/ToastContext';
import ProtectedRoute      from './components/common/ProtectedRoute';
import ScrollToTop         from './components/layout/ScrollToTop';

// Layouts
import MainLayout      from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Páginas públicas
import Home               from './pages/Home';
import Login              from './pages/Login';
import Registro           from './pages/Registro';
import EventDetail        from './pages/EventDetails';
import NotFound           from './pages/NotFound';

// Páginas de auth (nuevas)
import VerificarCorreo       from './pages/VerificarCorreo';
import RecuperarContrasena   from './pages/RecuperarContrasena';
import RestablecerContrasena from './pages/RestablecerContrasena';

// Páginas protegidas usuario
import Checkout   from './pages/Checkout';
import MisBoletos from './pages/MIsBoletos';
import Perfil     from './pages/Perfil';

// Páginas organizador
import DashboardOrg  from './pages/DashboardOrg';
import MisEventosOrg from './pages/MisEventos';
import CrearEvento   from './pages/CrearEvento';
import EditarEvento  from './pages/EditarEvento';
import EscanearBoleto from './pages/EscanearBoleto';

// Páginas admin
import AdminAprobaciones from './pages/AdminAprobaciones';
import AdminUsuarios     from './pages/AdminUsuarios';
import AdminPagos        from './pages/AdminPagos';
import AdminLogin       from './pages/AdminLogin';
import AdminGestores     from './pages/AdminGestores';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>

            {/* ── Zona pública ─────────────────────────────────────────────── */}
            <Route element={<MainLayout />}>
              <Route path="/"          element={<Home />} />
              <Route path="/login"     element={<Login />} />
              <Route path="/registro"  element={<Registro />} />
              <Route path="/evento/:id" element={<EventDetail />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Rutas de auth sin login */}
              <Route path="/verificar-correo/:idUsuario/:token" element={<VerificarCorreo />} />
              <Route path="/recuperar-contrasena"               element={<RecuperarContrasena />} />
              <Route path="/restablecer-contrasena/:token"      element={<RestablecerContrasena />} />

              {/* Rutas protegidas para cualquier usuario logueado */}
              <Route element={<ProtectedRoute allowedRoles={['cliente', 'organizador', 'admin']} />}>
                <Route path="/checkout/:id"  element={<Checkout />} />
                <Route path="/mis-boletos"   element={<MisBoletos />} />
                <Route path="/perfil"        element={<Perfil />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>

            {/* ── Zona privada (dashboard) ──────────────────────────────────── */}
            <Route element={<DashboardLayout />}>
              <Route path="/organizador" element={<Navigate to="/organizador/eventos" replace />} />
              <Route path="/admin"       element={<Navigate to="/admin/aprobaciones" replace />} />

              <Route element={<ProtectedRoute allowedRoles={['organizador']} />}>
                <Route path="/organizador/dashboard"        element={<DashboardOrg />} />
                <Route path="/organizador/eventos"          element={<MisEventosOrg />} />
                <Route path="/organizador/crear-evento"     element={<CrearEvento />} />
                <Route path="/organizador/editar-evento/:id" element={<EditarEvento />} />
                <Route path="/organizador/escanear"  element={<EscanearBoleto />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/aprobaciones" element={<AdminAprobaciones />} />
                <Route path="/admin/usuarios"     element={<AdminUsuarios />} />
                <Route path="/admin/pagos"        element={<AdminPagos />} />
                <Route path="/admin/gestores"     element={<AdminGestores />} />
              </Route>
            </Route>

          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}