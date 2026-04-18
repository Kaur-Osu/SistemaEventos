import { useState, useEffect } from 'react';
import Button      from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState  from '../components/common/EmptyState';
import PageHeader  from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast }    from '../context/ToastContext';
import { adminService } from '../services/adminService';
import { useAuth }      from '../context/AuthContext';
import { formatMoneda } from '../utils/formatters';

const TABS = [
  { id: 'todos',      label: 'Todas' },
  { id: 'pendiente',  label: 'Pendientes' },
  { id: 'pagado',     label: 'Pagados' },
  { id: 'cancelado',  label: 'Cancelados' },
];

const TASA = 0.10;

export default function AdminPagos() {
  const { user }     = useAuth();
  const { addToast } = useToast();
  const [eventos,   setEventos]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro,    setFiltro]    = useState('pendiente');
  const [busqueda,  setBusqueda]  = useState('');

  const cargar = () => {
    setIsLoading(true);
    adminService.eventosNoPagados()
      .then(setEventos)
      .catch(err => addToast(err.message, 'error'))
      .finally(() => setIsLoading(false));
  };

  useEffect(cargar, []);

  const liquidar = async (idEvento, totalRecaudado) => {
    try {
      const aDepositar = totalRecaudado * (1 - TASA);
      await adminService.marcarPagado(idEvento, aDepositar);
      addToast('Evento marcado como pagado correctamente.', 'success');
      cargar();
    } catch (err) { addToast(err.message, 'error'); }
  };

  // Métricas calculadas
  const volumen   = eventos.reduce((acc, e) => acc + Number(e.totalRecaudado ?? 0), 0);
  const ganancias = volumen * TASA;
  const deuda     = volumen * (1 - TASA);

  const eventosFiltrados = eventos.filter(e => {
    const tab = filtro === 'todos' || (filtro === 'pendiente' && !e.pagado) || (filtro === 'pagado' && e.pagado);
    const bus = !busqueda || e.titulo.toLowerCase().includes(busqueda.toLowerCase()) || e.organizadorNombre?.toLowerCase().includes(busqueda.toLowerCase());
    return tab && bus;
  });

  return (
    <div className="max-w-7xl mx-auto pb-12 font-body">

      <PageHeader
        title="Control Financiero"
        description="Supervisa el volumen procesado y las liquidaciones a organizadores."
        action={
          <Button variant="secondary" size="sm" icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }>
            Exportar
          </Button>
        }
      />

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-dark rounded-2xl p-6 text-white animate-slide-up">
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">Volumen procesado</p>
          <p className="text-4xl font-display">${formatMoneda(volumen)}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-line border-t-4 border-t-primary animate-slide-up" style={{ animationDelay: '60ms' }}>
          <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Ganancias plataforma (10%)</p>
          <p className="text-3xl font-display text-primary">${formatMoneda(ganancias)}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-line border-t-4 border-t-warning animate-slide-up" style={{ animationDelay: '120ms' }}>
          <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Deuda a organizadores</p>
          <p className="text-3xl font-display text-dark">${formatMoneda(deuda)}</p>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-line overflow-hidden">

        <div className="border-b border-line bg-surface flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-5 pt-4 pb-4 sm:pb-0">
          <div className="flex gap-5 overflow-x-auto hide-scrollbar">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setFiltro(tab.id)}
                className={`pb-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  filtro === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-dark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-60 sm:mb-3">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar evento..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-line bg-white rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : eventosFiltrados.length === 0 ? (
            <EmptyState title="Sin registros" description="No hay eventos que coincidan con este filtro." />
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface text-muted text-xs uppercase tracking-wider border-b border-line">
                  <th className="px-5 py-3 font-semibold">Evento y organizador</th>
                  <th className="px-5 py-3 font-semibold text-right">Total recaudado</th>
                  <th className="px-5 py-3 font-semibold text-right">A liquidar (90%)</th>
                  <th className="px-5 py-3 font-semibold text-right">Estado / Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {eventosFiltrados.map(e => {
                  const total     = Number(e.totalRecaudado ?? 0);
                  const aLiquidar = total * (1 - TASA);
                  return (
                    <tr key={e.idEvento} className="hover:bg-surface/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-dark">{e.titulo}</p>
                        <p className="text-xs text-muted mt-0.5 flex items-center gap-1">
                          <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {e.organizadorNombre}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-right text-sm text-muted">${formatMoneda(total)}</td>
                      <td className="px-5 py-4 text-right text-sm font-bold text-dark">${formatMoneda(aLiquidar)}</td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        {!e.pagado ? (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => liquidar(e.idEvento, total)}
                          >
                            Liquidar fondos
                          </Button>
                        ) : (
                          <StatusBadge status="Pagado" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}