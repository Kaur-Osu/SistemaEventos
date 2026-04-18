import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth }   from '../context/AuthContext';
import { useToast }  from '../context/ToastContext';
import Button        from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { themeConfig, categoriaLabels } from '../config/theme';
import { eventosService }  from '../services/eventosService';
import { ordenesService }  from '../services/ordenesService';
import { formatFecha, formatHora, formatMoneda } from '../utils/formatters';

export default function EventDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { user }     = useAuth();
  const { addToast } = useToast();

  const [evento,     setEvento]     = useState(null);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState('');
  const [seleccion,  setSeleccion]  = useState({}); // { idZona: cantidad }
  const [comprando,  setComprando]  = useState(false);

  useEffect(() => {
    setIsLoading(true);
    eventosService.obtenerDetalle(id)
      .then(setEvento)
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="text-center">
          <p className="text-error font-semibold mb-3">{error || 'Evento no encontrado'}</p>
          <Button variant="outline" onClick={() => navigate(-1)}>Volver</Button>
        </div>
      </div>
    );
  }

  const theme    = themeConfig[evento.categoria] ?? themeConfig.default;
  const imgSrc = (() => {
    const url = evento.imagenes?.find(i => i.portada)?.urlImagen ?? evento.imagenes?.[0]?.urlImagen;
    if (!url || !url.startsWith('http')) return null;
    return url;
  })();
  const zonas    = evento.zonas ?? [];

  const incrementar = (idZona, maxDisponible) => {
    setSeleccion(prev => {
      const actual = prev[idZona] ?? 0;
      if (actual >= Math.min(maxDisponible, 10)) return prev;
      return { ...prev, [idZona]: actual + 1 };
    });
  };

  const decrementar = (idZona) => {
    setSeleccion(prev => {
      const s = { ...prev };
      if (s[idZona] > 1) s[idZona]--;
      else delete s[idZona];
      return s;
    });
  };

  const totalBoletos = Object.values(seleccion).reduce((a, b) => a + b, 0);
  const totalPagar   = Object.entries(seleccion).reduce((acc, [idZona, cant]) => {
    const zona = zonas.find(z => z.idZona === parseInt(idZona));
    return acc + (zona ? zona.precio * cant : 0);
  }, 0);

  const handleComprar = async () => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/evento/${id}` } });
      return;
    }
    if (totalBoletos === 0) return;

    setComprando(true);
    try {
      // Crear una orden por cada zona seleccionada
      const ordenes = await Promise.all(
        Object.entries(seleccion).map(([idZona, cantidad]) =>
          ordenesService.crear(evento.idEvento, parseInt(idZona), cantidad)
        )
      );

      // Usamos la primera orden (flujo simplificado — en producción podrías manejar múltiples)
      const primeraOrden = ordenes[0];

      navigate(`/checkout/${evento.idEvento}`, {
        state: {
          idOrden    : primeraOrden.idOrden,
          expiracion : primeraOrden.expiracion,
          seleccion,
          totalPagar,
          evento,
        },
      });
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setComprando(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-20">

      {/* Hero */}
      <div
        className="w-full h-64 md:h-96 flex items-end relative bg-cover bg-center"
        style={{ backgroundImage: imgSrc ? `url(${imgSrc})` : 'none', backgroundColor: '#0F172A' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pb-8">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${theme.badgeBg} ${theme.badgeText}`}>
            {categoriaLabels[evento.categoria] ?? evento.categoria}
          </span>
          <h1 className="text-4xl md:text-6xl font-display text-white tracking-wide">
            {evento.titulo}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Columna izquierda */}
          <div className="lg:w-2/3 space-y-6">
            <div className="bg-white rounded-2xl border border-line p-6">
              <h2 className="text-2xl font-display text-dark mb-3">Acerca del evento</h2>
              <p className="text-muted leading-relaxed text-sm">{evento.descripcion}</p>
            </div>

            <div className="bg-white rounded-2xl border border-line p-6">
              <h2 className="text-2xl font-display text-dark mb-5">Información importante</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-surface ${theme.text}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm">Fecha y hora</p>
                    <p className="text-muted text-sm capitalize mt-0.5">{formatFecha(evento.fecha)}</p>
                    <p className="text-muted text-sm">{formatHora(evento.fecha)} hrs</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-surface ${theme.text}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm">Ubicación</p>
                    <p className="text-muted text-sm mt-0.5">{evento.ubicacion}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizador */}
            <div className="bg-white rounded-2xl border border-line p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                {evento.organizadorNombre?.charAt(0)}
              </div>
              <div>
                <p className="text-xs text-muted">Organizado por</p>
                <p className="text-sm font-semibold text-dark">{evento.organizadorNombre}</p>
              </div>
            </div>
          </div>

          {/* Sidebar de compra */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl border border-line p-6 sticky top-24">
              <h3 className="text-xl font-display text-dark pb-4 mb-4 border-b border-line">
                Adquirir boletos
              </h3>

              <div className="space-y-3 mb-6">
                {zonas.map(zona => {
                  const cant        = seleccion[zona.idZona] ?? 0;
                  const disponibles = Number(zona.boletosDisponibles ?? 0);
                  const agotado     = disponibles === 0;

                  return (
                    <div
                      key={zona.idZona}
                      className={`flex justify-between items-center p-4 border rounded-xl transition-colors ${
                        agotado ? 'border-line bg-surface opacity-60' : 'border-line bg-surface hover:border-muted'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-dark text-sm">{zona.nombre}</p>
                        <p className={`text-sm font-bold ${theme.text}`}>${formatMoneda(zona.precio)} MXN</p>
                        <p className="text-xs text-muted mt-0.5">
                          {agotado ? 'Agotado' : `${disponibles} disponibles`}
                        </p>
                      </div>

                      {!agotado && (
                        <div className="flex items-center gap-2">
                          {cant > 0 ? (
                            <>
                              <button
                                onClick={() => decrementar(zona.idZona)}
                                className="w-8 h-8 rounded-full bg-white border border-line flex items-center justify-center text-muted hover:bg-surface transition-all"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="font-bold text-dark w-5 text-center text-sm">{cant}</span>
                              <button
                                onClick={() => incrementar(zona.idZona, disponibles)}
                                className="w-8 h-8 rounded-full bg-white border border-line flex items-center justify-center text-muted hover:bg-surface transition-all"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => incrementar(zona.idZona, disponibles)}
                              className="px-3 py-1.5 rounded-full text-xs font-semibold border-2 border-line text-muted hover:border-primary hover:text-primary transition-all"
                            >
                              Agregar
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-line pt-4 mb-5 space-y-2">
                <div className="flex justify-between text-sm text-muted">
                  <span>Boletos seleccionados</span>
                  <span className="font-semibold text-dark">{totalBoletos}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-dark">Subtotal</span>
                  <span className={`text-2xl font-display ${theme.text}`}>${formatMoneda(totalPagar)}</span>
                </div>
              </div>

              <Button
                onClick={handleComprar}
                disabled={totalBoletos === 0 || user?.rol === 'admin'}
                isLoading={comprando}
                className={`w-full ${totalBoletos > 0 && user?.rol !== 'admin' ? `${theme.bg} text-white hover:opacity-90` : ''}`}
                size="lg"
              >
                {user?.rol === 'admin'
                  ? 'Los admins no pueden comprar boletos'
                  : user
                    ? 'Proceder al pago'
                    : 'Inicia sesión para comprar'}
              </Button>

              {user?.rol === 'admin' && (
                <p className="text-xs text-muted text-center mt-2">
                  Las cuentas de administrador no pueden adquirir boletos.
                </p>
                )}

              {!user && totalBoletos > 0 && (
                <p className="text-xs text-muted text-center mt-2">
                  Necesitas una cuenta para comprar boletos.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}