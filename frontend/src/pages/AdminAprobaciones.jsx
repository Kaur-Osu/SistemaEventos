import { useState, useEffect } from 'react';
import Button     from '../components/common/Button';
import Textarea   from '../components/common/TextArea';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge    from '../components/common/StatusBadge';
import { useToast }      from '../context/ToastContext';
import { adminService }  from '../services/adminService';
import { categoriaLabels } from '../config/theme';
import { formatMoneda, formatFechaCorta } from '../utils/formatters';
import api from '../api/axios';

const TABS = [
  { id: 'todos',     label: 'Todos' },
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'publicado', label: 'Publicados' },
  { id: 'suspendido', label: 'Suspendidos' },
  { id: 'rechazado', label: 'Rechazados' },
  { id: 'cancelado', label: 'Cancelados' },
];

// Deriva el estado visual de un evento
const getEstado = (e) => {
  if (e.cancelado)  return 'cancelado';
  if (e.rechazado)  return 'rechazado';
  if (e.suspendido) return 'suspendido';
  if (e.listado)    return 'publicado';
  return 'pendiente';
};

const BADGE_MAP = {
  pendiente: 'pendiente',
  publicado: 'publicado',
  rechazado: 'rechazado',
  cancelado: 'cancelado',
  suspendido: 'suspendido',
};

export default function AdminAprobaciones() {
  const { addToast } = useToast();

  const [eventos,          setEventos]          = useState([]);
  const [isLoading,        setIsLoading]        = useState(true);
  const [filtro,           setFiltro]           = useState('pendiente');
  const [busqueda,         setBusqueda]         = useState('');
  const [preview,          setPreview]          = useState(null);
  const [imagenExpandida,  setImagenExpandida]  = useState(null);
  const [modalRech,        setModalRech]        = useState({ open: false, idEvento: null, motivo: '', loading: false });
  const [modalSusp, setModalSusp] = useState({ open: false, idEvento: null, motivo: '', loading: false });

  const cargar = () => {
    setIsLoading(true);
    adminService.listarEventos()
      .then(setEventos)
      .catch(err => addToast(err.message, 'error'))
      .finally(() => setIsLoading(false));
  };

  useEffect(cargar, []);

  const aprobar = async (idEvento) => {
    try {
      await api.put(`/admin/eventos/${idEvento}/aprobar`);
      addToast('Evento aprobado y publicado en el catálogo.', 'success');
      setPreview(null);
      cargar();
    } catch (err) { addToast(err.message, 'error'); }
  };

  const confirmarRechazo = async () => {
    if (!modalRech.motivo.trim()) return;
    setModalRech(p => ({ ...p, loading: true }));
    try {
      await api.put(`/admin/eventos/${modalRech.idEvento}/rechazar`, { motivo: modalRech.motivo });
      addToast('Evento rechazado. Se notificó al organizador.', 'info');
      setModalRech({ open: false, idEvento: null, motivo: '', loading: false });
      setPreview(null);
      cargar();
    } catch (err) {
      addToast(err.message, 'error');
      setModalRech(p => ({ ...p, loading: false }));
    }
  };

  const abrirVistaPrevia = async (evento) => {
  try {
    const detalle = await adminService.obtenerDetalleEvento(evento.idEvento);
    // Fusionar campos de estado del evento original (lista) con el detalle
    setPreview({
      ...detalle,
      listado  : evento.listado,
      cancelado: evento.cancelado,
      rechazado: evento.rechazado,
      motivoRechazo: evento.motivoRechazo,
      suspendido: evento.suspendido,
      motivoSuspension: evento.motivoSuspension,
    });
  } catch (err) { addToast(err.message, 'error'); }
};
  const eventosFiltrados = eventos.filter(e => {
    const estado = getEstado(e);
    const coincideTab = filtro === 'todos' || estado === filtro;
    const coincideBusqueda = !busqueda ||
      e.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.organizadorNombre?.toLowerCase().includes(busqueda.toLowerCase());
    return coincideTab && coincideBusqueda;
  });

  const confirmarSuspension = async () => {
  if (!modalSusp.motivo.trim()) return;
  setModalSusp(p => ({ ...p, loading: true }));
  try {
    await api.put(`/admin/eventos/${modalSusp.idEvento}/suspender`, { motivo: modalSusp.motivo });
    addToast('Evento suspendido. Se notificó al organizador.', 'success');
    setModalSusp({ open: false, idEvento: null, motivo: '', loading: false });
    setPreview(null);
    cargar();
  } catch (err) {
    addToast(err.message, 'error');
    setModalSusp(p => ({ ...p, loading: false }));
  }
};

const reactivar = async (idEvento) => {
  try {
    await api.put(`/admin/eventos/${idEvento}/reactivar`);
    addToast('Evento reactivado y publicado nuevamente.', 'success');
    setPreview(null);
    cargar();
  } catch (err) { addToast(err.message, 'error'); }
};

  return (
    <div className="max-w-7xl mx-auto pb-12 font-body">

      {/* Modal rechazo */}
      {modalRech.open && (
        <div className="fixed inset-0 bg-dark/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-line p-6 sm:p-8 max-w-md w-full animate-scale-in">
            <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-dark mb-1 text-center">Rechazar evento</h2>
            <p className="text-muted text-sm mb-5 text-center">El organizador recibirá este motivo por correo.</p>
            <Textarea
              label="Motivo del rechazo"
              id="motivo-rech"
              rows={4}
              placeholder="Ej. Las imágenes no cumplen con las políticas..."
              value={modalRech.motivo}
              onChange={e => setModalRech(p => ({ ...p, motivo: e.target.value }))}
            />
            <div className="flex justify-end gap-3 pt-4 border-t border-line mt-4">
              <Button variant="ghost" onClick={() => setModalRech({ open: false, idEvento: null, motivo: '', loading: false })}>
                Cancelar
              </Button>
              <Button variant="danger" isLoading={modalRech.loading} disabled={!modalRech.motivo.trim()} onClick={confirmarRechazo}>
                Confirmar rechazo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal suspensión */}
      {modalSusp.open && (
        <div className="fixed inset-0 bg-dark/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-line p-6 sm:p-8 max-w-md w-full animate-scale-in">
            <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-dark mb-1 text-center">Suspender evento</h2>
            <p className="text-muted text-sm mb-5 text-center">El evento dejará de ser visible. El organizador recibirá el motivo.</p>
            <Textarea
              label="Motivo de suspensión"
              id="motivo-susp"
              rows={4}
              placeholder="Ej. Infracción de políticas de contenido..."
              value={modalSusp.motivo}
              onChange={e => setModalSusp(p => ({ ...p, motivo: e.target.value }))}
            />
            <div className="flex justify-end gap-3 pt-4 border-t border-line mt-4">
              <Button variant="ghost" onClick={() => setModalSusp({ open: false, idEvento: null, motivo: '', loading: false })}>
                Cancelar
              </Button>
              <Button variant="warning" isLoading={modalSusp.loading} disabled={!modalSusp.motivo.trim()} onClick={confirmarSuspension}>
                Confirmar suspensión
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal vista previa */}
      {preview && (
        <div className="fixed inset-0 bg-dark/60 z-[50] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-line w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">

            <div className="flex justify-between items-center p-5 border-b border-line bg-surface flex-shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-xl text-dark">Vista previa</h2>
                <StatusBadge status={BADGE_MAP[getEstado(preview)]} />
              </div>
              <button onClick={() => setPreview(null)} className="text-muted hover:text-dark transition-colors p-1 rounded-lg hover:bg-line">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  {/* Imagen clickeable */}
                  <div
                    className="h-52 rounded-xl overflow-hidden bg-surface border border-line relative group cursor-pointer"
                    onClick={() => preview.imagenes?.[0]?.urlImagen && setImagenExpandida(preview.imagenes[0].urlImagen)}
                  >
                    {preview.imagenes?.[0]?.urlImagen ? (
                      <>
                        <img src={preview.imagenes[0].urlImagen} alt="Banner" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-dark/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted text-sm">Sin imagen</div>
                    )}
                  </div>

                  <div>
                  <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Descripción</p>
                  <p className="text-sm text-dark leading-relaxed bg-surface rounded-xl p-4 border border-line">
                    {preview.descripcion}
                  </p>
                </div>
                </div>

                {/* Motivo de rechazo — solo si fue rechazado */}
                  {getEstado(preview) === 'rechazado' && preview.motivoRechazo && (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-xl animate-fade-in">
                      <p className="text-xs font-bold text-error uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Motivo de rechazo
                      </p>
                      <p className="text-sm text-error/80 leading-relaxed">{preview.motivoRechazo}</p>
                    </div>
                  )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-dark">{preview.titulo}</h3>
                    <p className="text-primary text-sm font-medium mt-1 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {preview.organizadorNombre}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {[
                      {
                        label: 'Fecha',
                        value: `${new Date(preview.fecha).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · ${new Date(preview.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} hrs`,
                        icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                      },
                      { label: 'Recinto',   value: preview.ubicacion,                   icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z' },
                      { label: 'Categoría', value: categoriaLabels[preview.categoria],  icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
                    ].map(item => (
                      <div key={item.label} className="flex items-start gap-3 p-3 bg-surface rounded-xl border border-line">
                        <svg className="w-4 h-4 text-muted mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                        </svg>
                        <div>
                          <p className="text-xs font-bold text-muted uppercase tracking-wider">{item.label}</p>
                          <p className="text-sm text-dark font-medium mt-0.5 capitalize">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Zonas configuradas</p>
                    <div className="space-y-1.5">
                      {(preview.zonas ?? []).map((z, i) => (
                        <div key={i} className="flex justify-between items-center p-3 border border-line rounded-xl bg-white text-sm">
                          <div>
                            <p className="font-semibold text-dark">{z.nombre}</p>
                            <p className="text-xs text-muted">Aforo: {z.capacidadTotal ?? z.capacidad} personas</p>
                          </div>
                          <span className="font-bold text-primary">${formatMoneda(z.precio)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer — solo mostrar acciones si está pendiente */}
            <div className="p-5 border-t border-line bg-surface flex justify-end gap-3 flex-shrink-0">
            {getEstado(preview) === 'pendiente' && (
              <>
                <Button variant="danger" size="sm"
                  onClick={() => { setPreview(null); setModalRech({ open: true, idEvento: preview.idEvento, motivo: '', loading: false }); }}>
                  Rechazar
                </Button>
                <Button variant="success" size="sm" onClick={() => aprobar(preview.idEvento)}>
                  Aprobar y publicar
                </Button>
              </>
            )}
            {getEstado(preview) === 'publicado' && (
              <Button variant="warning" size="sm"
                onClick={() => { setPreview(null); setModalSusp({ open: true, idEvento: preview.idEvento, motivo: '', loading: false }); }}>
                Suspender evento
              </Button>
            )}
            {getEstado(preview) === 'suspendido' && (
              <Button variant="success" size="sm" onClick={() => reactivar(preview.idEvento)}>
                Reactivar evento
              </Button>
            )}
            {['rechazado', 'cancelado'].includes(getEstado(preview)) && (
              <Button variant="ghost" size="sm" onClick={() => setPreview(null)}>Cerrar</Button>
            )}
          </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {imagenExpandida && (
        <div
          className="fixed inset-0 bg-dark/90 z-[80] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setImagenExpandida(null)}
        >
          <div className="relative max-w-4xl w-full animate-scale-in" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setImagenExpandida(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cerrar
            </button>
            <img src={imagenExpandida} alt="Imagen expandida" className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
            <p className="text-center text-white/40 text-xs mt-3">
              Haz clic fuera para cerrar
            </p>
          </div>
        </div>
      )}

      <PageHeader title="Gestión de Eventos" description="Revisa, aprueba o rechaza los eventos de los organizadores." />

      <div className="bg-white rounded-2xl border border-line overflow-hidden">

        {/* Tabs + buscador */}
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
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                  filtro === tab.id ? 'bg-primary/10 text-primary' : 'bg-line text-muted'
                }`}>
                  {tab.id === 'todos'
                    ? eventos.length
                    : eventos.filter(e => getEstado(e) === tab.id).length}
                </span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64 sm:mb-3">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar evento u organizador..."
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
            <EmptyState
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              title="Sin eventos"
              description={filtro === 'pendiente' ? 'No hay eventos pendientes de revisión.' : 'No hay eventos en esta categoría.'}
            />
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface text-muted text-xs uppercase tracking-wider border-b border-line">
                  <th className="px-5 py-3 font-semibold">Evento</th>
                  <th className="px-5 py-3 font-semibold">Organizador</th>
                  <th className="px-5 py-3 font-semibold">Categoría</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                  <th className="px-5 py-3 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {eventosFiltrados.map(evento => {
                  const estado = getEstado(evento);
                  return (
                    <tr key={evento.idEvento} className="hover:bg-surface/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-dark">{evento.titulo}</p>
                        <p className="text-xs text-muted mt-0.5">
                          {evento.fecha ? formatFechaCorta(evento.fecha) : '—'}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-sm text-dark font-medium">{evento.organizadorNombre}</td>
                      <td className="px-5 py-4 text-xs text-muted capitalize">{categoriaLabels[evento.categoria]}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={BADGE_MAP[estado]} />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          
                          {estado != 'cancelado' && (
                            <Button variant="outline" size="sm" onClick={() => abrirVistaPrevia(evento)}>
                            Ver detalles
                          </Button>
                          )}
                          
                          {estado === 'publicado' && (
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => setModalSusp({ open: true, idEvento: evento.idEvento, motivo: '', loading: false })}
                            >
                              Suspender
                            </Button>
                          )}
                          {estado === 'suspendido' && (
                            <Button variant="success" size="sm" onClick={() => reactivar(evento.idEvento)}>
                              Reactivar
                            </Button>
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