import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventCard    from '../components/events/EventCard';
import SkeletonCard from '../components/common/SkeletonCard';
import EmptyState   from '../components/common/EmptyState';
import { eventosService } from '../services/eventosService';
import heroBg from '../assets/hero.png';
import { useAuth } from '../context/AuthContext';

const CATEGORIAS = [
  { id: 'Todos',       label: 'Todos' },
  { id: 'festival',    label: 'Festival' },
  { id: 'teatro',      label: 'Teatro' },
  { id: 'deporte',     label: 'Deportes' },
  { id: 'corporativo', label: 'Corporativo' },
  { id: 'conferencia', label: 'Conferencia' },
];

const CATEGORY_ACTIVE = {
  Todos      : 'bg-dark text-white border-dark',
  festival   : 'bg-festival-main text-white border-festival-main',
  teatro     : 'bg-teatro-main text-white border-teatro-main',
  deporte    : 'bg-deporte-main text-white border-deporte-main',
  corporativo: 'bg-corporativo-main text-white border-corporativo-main',
  conferencia: 'bg-conferencia-main text-white border-conferencia-main',
};



export default function Home() {
  const { user } = useAuth();
  const [eventos,      setEventos]      = useState([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [error,        setError]        = useState('');
  const [filtro,       setFiltro]       = useState('Todos');
  const [busqueda,     setBusqueda]     = useState('');

  useEffect(() => {
    setIsLoading(true);
    eventosService.listarPublicos()
      .then(setEventos)
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const eventosFiltrados = eventos.filter(e => {
    const cat = filtro === 'Todos' || e.categoria === filtro;
    const bus = !busqueda ||
      e.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.ubicacion.toLowerCase().includes(busqueda.toLowerCase());
    return cat && bus;
  });

  return (
    <div className="font-body bg-surface min-h-screen">

      {/* Hero */}
      <div className="relative h-[420px] md:h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/60 to-dark/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl animate-slide-up">
            <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest rounded-full border border-primary/30 mb-4">
              Plataforma de eventos
            </span>
            <h1 className="text-5xl md:text-6xl font-display text-white tracking-wide leading-none mb-4">
              DESCUBRE LOS MEJORES EVENTOS
            </h1>
            <p className="text-white/70 text-base mb-8 leading-relaxed">
              Festivales, teatro, deportes y conferencias. Compra tus boletos de forma segura.
            </p>
            <div className="flex flex-wrap gap-3">
            <a href="#catalogo" className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all text-sm">
              Explorar eventos
            </a>
            {!user && (
              <Link to="/registro" className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all text-sm backdrop-blur-sm">
                Crear cuenta gratis
              </Link>
            )}
          </div>
          </div>
        </div>
      </div>

      {/* Catálogo */}
      <div id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="flex flex-col gap-5 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-dark">Eventos disponibles</h2>
              <p className="text-muted text-sm mt-0.5">
                {isLoading ? 'Cargando...' : `${eventosFiltrados.length} evento${eventosFiltrados.length !== 1 ? 's' : ''} encontrado${eventosFiltrados.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 bg-white border border-line rounded-xl text-sm text-dark placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <svg className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {busqueda && (
                <button onClick={() => setBusqueda('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIAS.map(cat => {
              const activo = filtro === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFiltro(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                    activo
                      ? `${CATEGORY_ACTIVE[cat.id]} shadow-sm scale-105`
                      : 'bg-white text-muted border-line hover:border-muted hover:text-dark'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm flex items-center gap-2 animate-fade-in">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
            <button onClick={() => window.location.reload()} className="ml-auto underline font-medium">Reintentar</button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : eventosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {eventosFiltrados.map((evento, i) => (
              <div key={evento.idEvento} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                <EventCard evento={evento} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            title="Sin resultados"
            description="No encontramos eventos con ese filtro."
            actionLabel="Ver todos"
            onAction={() => { setFiltro('Todos'); setBusqueda(''); }}
          />
        )}
      </div>
    </div>
  );
}