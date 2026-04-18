import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ConfirmModal  from '../components/common/ConfirmModal';
import StatusBadge   from '../components/common/StatusBadge';
import PageHeader    from '../components/common/PageHeader';
import EmptyState    from '../components/common/EmptyState';
import Button        from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast }        from '../context/ToastContext';
import { eventosService }  from '../services/eventosService';
import { categoriaLabels } from '../config/theme';
import { formatFechaCorta } from '../utils/formatters';
import api from '../api/axios';

const TABS = [
  { id: 'todos',     label: 'Todos' },
  { id: 'revision',  label: 'En revisión' },
  { id: 'rechazado', label: 'Rechazados' },
  { id: 'publicado', label: 'Publicados' },
  { id: 'cancelado', label: 'Cancelados' },
];

export default function MisEventosOrg() {
  const { addToast } = useToast();
  const [eventos,   setEventos]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro,    setFiltro]    = useState('todos');
  const [modal,     setModal]     = useState({ isOpen: false, idEvento: null, isLoading: false, esPublicado: false });

  const cargar = () => {
    setIsLoading(true);
    eventosService.misEventos()
      .then(setEventos)
      .catch(err => addToast(err.message, 'error'))
      .finally(() => setIsLoading(false));
  };

  useEffect(cargar, []);

const getEstado = (e) => {
  if (e.estadoEvento) {
    const est = e.estadoEvento.toLowerCase();
    if (est === 'borrador') return 'revision'; // ← mapeo correcto
    return est;
  }
  if (e.cancelado)  return 'cancelado';
  if (e.rechazado)  return 'rechazado';
  if (e.listado)    return 'publicado';
  return 'revision';
};

const getCancelacionReason = (e) => {
  return e.motivoCancelacion || e.motivoSuspension || e.motivoRechazo || e.motivo || e.causa || null;
};

const muestraMotivoCancelacion = eventos.some((evento) => getCancelacionReason(evento));

  // Orden de prioridad para estados
  const ordenEstados = {
    'publicado': 1,
    'revision': 2,
    'rechazado': 3,
    'cancelado': 4,
  };

  const ordenarPorEstado = (eventosArray) => {
    return eventosArray.sort((a, b) => {
      const estadoA = getEstado(a);
      const estadoB = getEstado(b);
      const prioridadA = ordenEstados[estadoA] || 999;
      const prioridadB = ordenEstados[estadoB] || 999;
      
      if (prioridadA !== prioridadB) {
        return prioridadA - prioridadB;
      }
      
      // Dentro del mismo estado, ordenar por fecha más reciente primero
      return new Date(b.fecha) - new Date(a.fecha);
    });
  };

  const confirmarCancelacion = async () => {
    setModal(p => ({ ...p, isLoading: true }));
    try {
      // Si está publicado usamos solicitar cancelación, si es borrador cancelamos directo
      if (modal.esPublicado) {
        await eventosService.solicitarCancelacion(modal.idEvento, 'Cancelación solicitada por el organizador.');
        addToast('Solicitud de cancelación enviada al administrador.', 'info');
      } else {
        await eventosService.cancelar(modal.idEvento);
        addToast('Evento cancelado correctamente.', 'success');
      }
      setModal({ isOpen: false, idEvento: null, isLoading: false, esPublicado: false });
      cargar();
    } catch (err) {
      addToast(err.message, 'error');
      setModal(p => ({ ...p, isLoading: false }));
    }
  };

  const eventosFiltrados = ordenarPorEstado(eventos.filter(e => {
    if (filtro === 'todos') return true;
    return getEstado(e) === filtro;
  }));

  const reenviarEvento = async (idEvento) => {
  try {
    // Limpiar el estado rechazado para volver a borrador
    await api.put(`/eventos/${idEvento}/reenviar`);
    addToast('Evento reenviado para revisión.', 'success');
    cargar();
  } catch (err) {
    addToast(err.message, 'error');
  }
};

  return (
    <div className="max-w-7xl mx-auto pb-12 font-body">

      <ConfirmModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, idEvento: null, isLoading: false, esPublicado: false })}
        onConfirm={confirmarCancelacion}
        title={modal.esPublicado ? '¿Solicitar cancelación?' : '¿Cancelar este evento?'}
        message={modal.esPublicado
          ? 'Se enviará una solicitud al administrador para retirar el evento del catálogo.'
          : 'El evento será cancelado y ya no será visible. Esta acción no se puede deshacer.'}
        confirmText="Confirmar"
        isDanger
        isLoading={modal.isLoading}
      />

      <PageHeader
        title="Mis Eventos"
        description="Gestiona tu catálogo de eventos."
        action={
          <Link to="/organizador/crear-evento">
            <Button variant="dark" icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            }>
              Nuevo evento
            </Button>
          </Link>
        }
      />

      {/* Aviso de flujo */}
      <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-3 animate-fade-in">
        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-primary/90">
          Al crear un evento, será enviado automáticamente para revisión. Un administrador lo aprobará y publicará en el catálogo.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-line overflow-hidden">

        <div className="border-b border-line bg-surface px-5 pt-4 flex gap-5 overflow-x-auto hide-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFiltro(tab.id)}
              className={`pb-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                filtro === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-dark'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                filtro === tab.id ? 'bg-primary/10 text-primary' : 'bg-line text-muted'
              }`}>
                {tab.id === 'todos' ? eventos.length : eventos.filter(e => getEstado(e) === tab.id).length}
              </span>
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : eventosFiltrados.length === 0 ? (
            <EmptyState
              title="Sin eventos"
              description="No tienes eventos en esta categoría."
              actionLabel="Crear evento"
              actionTo="/organizador/crear-evento"
            />
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface text-muted text-xs uppercase tracking-wider border-b border-line">
                  <th className="px-5 py-3 font-semibold">Evento</th>
                  <th className="px-5 py-3 font-semibold">Categoría</th>
                  <th className="px-5 py-3 font-semibold">Capacidad</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                  {muestraMotivoCancelacion && (
                    <th className="px-5 py-3 font-semibold">Motivo</th>
                  )}
                  <th className="px-5 py-3 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {eventosFiltrados.map(evento => {
                  const estado = getEstado(evento);
                  const motivoCancelacion = getCancelacionReason(evento);
                  return (
                    <tr key={evento.idEvento} className="hover:bg-surface/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-dark">{evento.titulo}</p>
                        <p className="text-xs text-muted mt-0.5 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatFechaCorta(evento.fecha)} · {evento.ubicacion}
                        </p>
                        {/* Mostrar motivo si fue rechazado */}
                        {getEstado(evento) === 'rechazado' && evento.motivoRechazo && (
                          <div className="mt-2 p-2 bg-error/10 border border-error/20 rounded-lg">
                            <p className="text-xs text-error font-semibold">Motivo de rechazo:</p>
                            <p className="text-xs text-error/80 mt-0.5">{evento.motivoRechazo}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-muted">
                        {categoriaLabels[evento.categoria] ?? evento.categoria}
                      </td>
                      <td className="px-5 py-4 text-sm text-dark">
                        <span className="font-semibold">{evento.capacidadTotal ?? '–'}</span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {/* Mapeo de estado a StatusBadge */}
                        {estado === 'revision'  && <StatusBadge status="pendiente" />}
                        {estado === 'publicado' && <StatusBadge status="publicado" />}
                        {estado === 'cancelado' && <StatusBadge status="cancelado" />}
                        {estado === 'rechazado' && <StatusBadge status="rechazado" />}
                      </td>
                      {muestraMotivoCancelacion && (
                        <td className="px-5 py-4 text-sm text-dark max-w-xs break-words">
                          {estado === 'cancelado' && motivoCancelacion ? motivoCancelacion : '—'}
                        </td>
                      )}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-1.5">
                        {/* Editar — si no está cancelado */}
                        {estado !== 'cancelado' && (
                          <Link
                            to={`/organizador/editar-evento/${evento.idEvento}`}
                            className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            title={estado === 'rechazado' ? 'Corregir y reenviar' : 'Editar'}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                        )}
                        {/* Cancelar — si está publicado */}
                        {estado === 'publicado' && (
                          <button
                            onClick={() => setModal({ isOpen: true, idEvento: evento.idEvento, isLoading: false, esPublicado: true })}
                            className="p-2 text-muted hover:text-error hover:bg-error/10 rounded-lg transition-all"
                            title="Solicitar cancelación"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </button>
                        )}
                        {/* Cancelar — si está en revisión */}
                        {estado === 'revision' && (
                          <button
                            onClick={() => setModal({ isOpen: true, idEvento: evento.idEvento, isLoading: false, esPublicado: false })}
                            className="p-2 text-muted hover:text-error hover:bg-error/10 rounded-lg transition-all"
                            title="Cancelar evento"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </button>
                        )}
                      </div>
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