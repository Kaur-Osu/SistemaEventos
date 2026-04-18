import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function UserMenuOptions({ closeHandler, rol, handleLogout }) {
  return (
    <div className="p-2 space-y-1">
      {rol === 'admin' && (
        <Link
          to="/admin/aprobaciones"
          onClick={closeHandler}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-dark text-white text-sm font-semibold hover:bg-dark/90 transition-colors mb-1"
        >
          <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Panel de Administración
        </Link>
      )}

      {rol === 'organizador' && (
        <Link
          to="/organizador/eventos"
          onClick={closeHandler}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors mb-1"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Mi Dashboard
        </Link>
      )}

      <Link to="/perfil" onClick={closeHandler} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-dark hover:bg-surface transition-colors">
        <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Mi Cuenta
      </Link>
      {rol !== 'admin' && (
      <Link to="/mis-boletos" onClick={closeHandler} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-dark hover:bg-surface transition-colors">
        <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        Mis Boletos
      </Link>
      )}

      <div className="h-px bg-line my-1" />

      <button
        onClick={() => { closeHandler(); handleLogout(); }}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-colors"
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Cerrar Sesión
      </button>
    </div>
  );
}

export default function Navbar() {
  const [menuAbierto,   setMenuAbierto]   = useState(false);
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const perfilRef = useRef(null);
  const navigate  = useNavigate();
  const { user: usuario, logout } = useAuth();
  const isLoggedIn = !!usuario;

  const cerrarMenu = () => { setMenuAbierto(false); setPerfilAbierto(false); };

  const handleLogout = () => { logout(); navigate('/'); };

  // Cerrar dropdown de perfil al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (perfilRef.current && !perfilRef.current.contains(e.target)) {
        setPerfilAbierto(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="bg-white border-b border-line sticky top-0 z-50 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between py-3 md:py-0 md:h-16 gap-y-3">

          {/* Logo + hamburguesa */}
          <div className="flex justify-between items-center w-full md:w-auto flex-shrink-0">
            <Link
              to="/"
              onClick={cerrarMenu}
              className="text-2xl font-display tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary hover:opacity-80 transition-opacity"
            >
              EVENTOS APP
            </Link>
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="md:hidden text-muted hover:text-dark bg-surface p-2 rounded-xl transition-all"
              aria-label="Menú"
            >
              {menuAbierto
                ? <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                : <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              }
            </button>
          </div>

          {/* Buscador */}
          <div className="w-full md:w-auto md:flex-1 flex justify-center order-last md:order-none md:px-8">
            <div className="w-full max-w-md relative">
              <input
                type="text"
                placeholder="Buscar eventos, artistas o recintos..."
                className="w-full pl-10 pr-4 py-2 bg-surface border border-line rounded-full text-sm text-dark placeholder:text-muted/60 focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <svg className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Controles escritorio */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {isLoggedIn ? (
              <div className="relative" ref={perfilRef}>
                <button
                  onClick={() => setPerfilAbierto(!perfilAbierto)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-surface transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                    {usuario.nombre?.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-dark hidden lg:block max-w-[120px] truncate">
                    {usuario.nombre}
                  </span>
                  <svg className={`w-3.5 h-3.5 text-muted hidden lg:block transition-transform duration-200 ${perfilAbierto ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {perfilAbierto && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-line z-50 overflow-hidden animate-slide-down">
                    <div className="px-4 py-3 border-b border-line bg-surface">
                      <p className="text-sm font-bold text-dark truncate">{usuario.nombre}</p>
                      <p className="text-xs text-muted capitalize">{usuario.rol}</p>
                    </div>
                    <UserMenuOptions closeHandler={cerrarMenu} rol={usuario.rol} handleLogout={handleLogout} />
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-muted hover:text-dark transition-colors rounded-xl hover:bg-surface">
                  Ingresar
                </Link>
                <Link to="/registro" className="px-4 py-2 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all text-sm">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        menuAbierto ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pb-6 pt-2 bg-white border-t border-line space-y-4">
          {isLoggedIn ? (
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-3 border-b border-line mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                  {usuario.nombre?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-dark text-sm truncate">{usuario.nombre}</p>
                  <p className="text-xs text-muted capitalize">{usuario.rol}</p>
                </div>
              </div>
              <UserMenuOptions closeHandler={cerrarMenu} rol={usuario.rol} handleLogout={handleLogout} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/login"
                onClick={cerrarMenu}
                className="flex justify-center items-center py-2.5 rounded-xl border-2 border-line text-sm font-semibold text-dark hover:border-primary hover:text-primary transition-all"
              >
                Ingresar
              </Link>
              <Link
                to="/registro"
                onClick={cerrarMenu}
                className="flex justify-center items-center py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-md"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}