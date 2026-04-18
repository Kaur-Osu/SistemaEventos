import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth }   from '../context/AuthContext';
import { useToast }  from '../context/ToastContext';
import PageHeader    from '../components/common/PageHeader';
import Button        from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { eventosService }  from '../services/eventosService';
import { formatMonedaCompacto } from '../utils/formatters';

export default function DashboardOrg() {
  const { user }     = useAuth();
  const { addToast } = useToast();

  const [eventos,   setEventos]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    eventosService.misEventos()
      .then(setEventos)
      .catch(err => addToast(err.message, 'error'))
      .finally(() => setIsLoading(false));
  }, []);

  // Calcular métricas desde los eventos reales
    // Reemplaza estas líneas
    const activos         = eventos.filter(e => e.listado && !e.cancelado && !e.rechazado).length;
    const boletosVendidos = eventos
      .filter(e => e.listado && !e.cancelado)
      .reduce((acc, e) => acc + Number(e.boletosVendidos ?? 0), 0);
    const ingresos        = eventos
      .filter(e => e.listado && !e.cancelado)
      .reduce((acc, e) => acc + Number(e.totalRecaudado ?? 0), 0);
    const capacidadTotal  = eventos
      .filter(e => e.listado && !e.cancelado)  // ← solo eventos publicados activos
      .reduce((acc, e) => acc + Number(e.capacidadTotal ?? 0), 0);

  const metricas = [
    { label: 'Eventos activos',  valor: activos,                        color: 'primary',   icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'Boletos vendidos', valor: boletosVendidos,                 color: 'success',   icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
    { label: 'Ingresos totales', valor: formatMonedaCompacto(ingresos),  color: 'warning',   icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Capacidad total',  valor: capacidadTotal,                  color: 'secondary', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  const COLOR_MAP = {
    primary  : { border: 'border-l-primary',   bg: 'bg-primary/10',   text: 'text-primary' },
    success  : { border: 'border-l-success',   bg: 'bg-success/10',   text: 'text-success' },
    warning  : { border: 'border-l-warning',   bg: 'bg-warning/10',   text: 'text-warning' },
    secondary: { border: 'border-l-secondary', bg: 'bg-secondary/10', text: 'text-secondary' },
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 font-body">

      <PageHeader
        title="Panel de Control"
        description={`Bienvenido, ${user?.nombre?.split(' ')[0] ?? 'organizador'}. Aquí está el resumen de tu rendimiento.`}
        action={
          <Link to="/organizador/crear-evento">
            <Button variant="primary" icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            }>
              Crear evento
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : (
        <>
          {/* Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {metricas.map((m, i) => {
              const c = COLOR_MAP[m.color];
              return (
                <div
                  key={m.label}
                  className={`bg-white rounded-2xl p-5 border border-line border-l-4 ${c.border} animate-slide-up`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">{m.label}</p>
                      <p className="text-3xl font-display text-dark">{m.valor}</p>
                    </div>
                    <div className={`p-2.5 rounded-xl ${c.bg} ${c.text}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={m.icon} />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Acciones rápidas */}
          <div className="bg-white rounded-2xl border border-line p-8 text-center animate-slide-up" style={{ animationDelay: '240ms' }}>
            <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4 border border-line">
              <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-dark mb-2">
              {activos === 0 ? 'Crea tu primer evento' : 'Prepara tu próximo evento'}
            </h2>
            <p className="text-muted text-sm max-w-md mx-auto mb-6">
              {activos === 0
                ? 'Aún no tienes eventos activos. Crea uno y empieza a vender boletos.'
                : 'Gestiona tus eventos, revisa tus finanzas o publica uno nuevo en minutos.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/organizador/eventos">
                <Button variant="outline">Ver mis eventos</Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}