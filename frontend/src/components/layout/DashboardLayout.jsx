import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();
  const isAdmin   = location.pathname.startsWith('/admin');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const perfilRef = useRef(null);

  useEffect(() => { setSidebarOpen(false); setPerfilAbierto(false); }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (perfilRef.current && !perfilRef.current.contains(e.target)) {
        setPerfilAbierto(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuOrganizador = [
    { name: 'Mis Eventos',  path: '/organizador/eventos',      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'Crear Evento', path: '/organizador/crear-evento', icon: 'M12 4v16m8-8H4' },
    { name: 'Escanear boletos', path: '/organizador/escanear', icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z' },  ];

  const menuAdmin = [
    { name: 'Aprobaciones', path: '/admin/aprobaciones', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Usuarios',     path: '/admin/usuarios',     icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    ...(user?.dueno === true || user?.dueno === 1 ? [{ name: 'Administradores', path: '/admin/gestores', icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' }] : [])
  ];

  const menuItems  = isAdmin ? menuAdmin : menuOrganizador;
  const paginaActual = menuItems.find(i => i.path === location.pathname)?.name ?? 'Panel de Control';
  const inicialUsuario = user?.nombre?.charAt(0)?.toUpperCase() ?? '?';
  const nombreUsuario  = user?.nombre ?? 'Usuario';
  const rolLabel       = isAdmin ? 'Administrador' : 'Organizador';

  return (
    <div className="min-h-screen bg-surface font-body">

      {/* Overlay móvil */}
      <div
        className={`fixed inset-0 bg-dark/60 z-20 transition-all duration-300 md:hidden backdrop-blur-sm ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-dark text-white z-30 flex flex-col
        transform transition-transform duration-300 ease-in-out md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 flex-shrink-0">
          <Link to="/" className="text-2xl font-display tracking-widest text-white hover:text-primary transition-colors">
            EVENTOS APP
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/40 hover:text-white p-1 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Usuario en sidebar */}
        <div className="px-4 py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
              isAdmin ? 'bg-secondary' : 'bg-primary'
            }`}>
              {inicialUsuario}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{nombreUsuario}</p>
              <p className="text-xs text-white/40">{rolLabel}</p>
            </div>
          </div>
        </div>

        {/* Menú */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3 mb-3">
            {isAdmin ? 'Administración' : 'Organización'}
          </p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg className="w-4.5 h-4.5 w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer sidebar */}
        <div className="p-3 border-t border-white/10 flex-shrink-0 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:bg-white/5 hover:text-white transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Ir al catálogo
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-error/70 hover:bg-error/10 hover:text-error transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="md:ml-64 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="h-16 bg-white border-b border-line flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-muted hover:text-dark p-2 rounded-xl hover:bg-surface transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-base font-semibold text-dark hidden sm:block">{paginaActual}</h2>
          </div>

          <div className="relative" ref={perfilRef}>
            <button
              onClick={() => setPerfilAbierto((prev) => !prev)}
              className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-surface transition-all"
              aria-expanded={perfilAbierto}
              aria-haspopup="true"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-dark leading-tight">{nombreUsuario}</p>
                <p className="text-xs text-primary font-medium">{rolLabel}</p>
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                isAdmin ? 'bg-secondary' : 'bg-primary'
              }`}>
                {inicialUsuario}
              </div>
            </button>

            {perfilAbierto && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-line z-50 overflow-hidden animate-slide-down">
                <div className="px-4 py-3 border-b border-line bg-surface">
                  <p className="text-sm font-bold text-dark truncate">{nombreUsuario}</p>
                  <p className="text-xs text-muted capitalize">{rolLabel}</p>
                </div>
                <div className="p-2 space-y-1">
                  {isAdmin ? (
                    <>
                      <Link
                        to="/admin/aprobaciones"
                        onClick={() => setPerfilAbierto(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-dark text-white text-sm font-semibold hover:bg-dark/90 transition-colors"
                      >
                        Panel de Administración
                      </Link>
                      <Link
                        to="/admin/usuarios"
                        onClick={() => setPerfilAbierto(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-dark hover:bg-surface transition-colors"
                      >
                        Usuarios
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/organizador/eventos"
                        onClick={() => setPerfilAbierto(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-dark hover:bg-surface transition-colors"
                      >
                        Mis Eventos
                      </Link>
                    </>
                  )}

                  <Link
                    to="/perfil"
                    onClick={() => setPerfilAbierto(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-dark hover:bg-surface transition-colors"
                  >
                    Mi Cuenta
                  </Link>

                  <div className="h-px bg-line my-1" />

                  <button
                    onClick={() => {
                      setPerfilAbierto(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}