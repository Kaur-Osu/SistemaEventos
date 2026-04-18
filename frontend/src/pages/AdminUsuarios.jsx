import { useState, useEffect } from 'react';
import Textarea   from '../components/common/TextArea';
import Button     from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState  from '../components/common/EmptyState';
import PageHeader  from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast }    from '../context/ToastContext';
import { adminService } from '../services/adminService';

const TABS = [
  { id: 'Pendiente',  label: 'Pendientes' },
  { id: 'Aprobada',   label: 'Aprobados' },
  { id: 'Rechazada',  label: 'Rechazados' },
  { id: 'todos',      label: 'Todos' },
];

export default function AdminUsuarios() {
  const [imagenModal, setImagenModal] = useState({ open: false, url: '', titulo: '' });
  const { addToast } = useToast();
  const [usuarios,  setUsuarios]  = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro,    setFiltro]    = useState('Pendiente');
  const [busqueda,  setBusqueda]  = useState('');
  const [modal,     setModal]     = useState({ open: false, idUsuario: null, motivo: '', loading: false });

  const cargar = () => {
    setIsLoading(true);
    adminService.listarUsuarios()
      .then(setUsuarios)
      .catch(err => addToast(err.message, 'error'))
      .finally(() => setIsLoading(false));
  };

  useEffect(cargar, []);

  const aprobar = async (idUsuario) => {
    try {
      await adminService.verificarUsuario(idUsuario, true, '');
      addToast('Usuario aprobado como organizador.', 'success');
      cargar();
    } catch (err) { addToast(err.message, 'error'); }
  };

  const confirmarRechazo = async () => {
    setModal(p => ({ ...p, loading: true }));
    try {
      await adminService.verificarUsuario(modal.idUsuario, false, modal.motivo);
      addToast('Solicitud rechazada. Se notificó al usuario.', 'info');
      setModal({ open: false, idUsuario: null, motivo: '', loading: false });
      cargar();
    } catch (err) {
      addToast(err.message, 'error');
      setModal(p => ({ ...p, loading: false }));
    }
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const tab = filtro === 'todos' || u.estadoVerificacion === filtro;
    const bus = !busqueda ||
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase());
    return tab && bus;
  });

  return (
    <div className="max-w-7xl mx-auto pb-12 font-body">

      {/* Modal rechazo */}
      {modal.open && (
        <div className="fixed inset-0 bg-dark/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-line p-6 sm:p-8 max-w-lg w-full animate-scale-in">
            <h2 className="text-xl font-bold text-dark mb-1">Rechazar solicitud</h2>
            <p className="text-muted text-sm mb-5">El usuario recibirá este motivo para corregir sus documentos.</p>
            <Textarea
              label="Motivo"
              id="motivo-usr"
              rows={4}
              placeholder="Ej. El INE está borroso..."
              value={modal.motivo}
              onChange={e => setModal(p => ({ ...p, motivo: e.target.value }))}
            />
            <div className="flex justify-end gap-3 pt-4 border-t border-line mt-4">
              <Button variant="ghost" onClick={() => setModal({ open: false, idUsuario: null, motivo: '', loading: false })}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                isLoading={modal.loading}
                disabled={!modal.motivo.trim()}
                onClick={confirmarRechazo}
              >
                Confirmar rechazo
              </Button>
            </div>
          </div>
        </div>
      )}

      <PageHeader title="Verificación de Cuentas" description="Revisa los documentos de usuarios que desean organizar eventos." />

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
                  {tab.id === 'todos' ? usuarios.length : usuarios.filter(u => u.estadoVerificacion === tab.id).length}
                </span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-60 sm:mb-3">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-line bg-white rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : usuariosFiltrados.length === 0 ? (
            <EmptyState title="Sin resultados" description="No hay usuarios que coincidan." />
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface text-muted text-xs uppercase tracking-wider border-b border-line">
                  <th className="px-5 py-3 font-semibold">Usuario</th>
                  <th className="px-5 py-3 font-semibold">Documentos</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                  <th className="px-5 py-3 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {usuariosFiltrados.map(u => (
                  <tr key={u.idUsuario} className="hover:bg-surface/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                          {u.nombre.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-dark">{u.nombre}</p>
                          <p className="text-xs text-muted">{u.correo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {u.ine && (
                          <button
                            onClick={() => setImagenModal({ open: true, url: u.ine, titulo: 'INE' })}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Ver INE
                          </button>
                        )}
                        {u.selfie && (
                          <button
                            onClick={() => setImagenModal({ open: true, url: u.selfie, titulo: 'Selfie' })}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Ver Selfie
                          </button>
                        )}
                        {!u.ine && !u.selfie && (
                          <span className="text-xs text-muted italic">Sin documentos</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={u.estadoVerificacion} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        {u.estadoVerificacion === 'Pendiente' && (
                          <>
                            <Button variant="danger" size="sm" onClick={() => setModal({ open: true, idUsuario: u.idUsuario, motivo: '', loading: false })}>
                              Rechazar
                            </Button>
                            <Button variant="success" size="sm" onClick={() => aprobar(u.idUsuario)}>
                              Aprobar
                            </Button>
                          </>
                        )}
                        {u.estadoVerificacion === 'Aprobada' && (
                          <Button variant="ghost" size="sm" className="text-error hover:bg-error/10" onClick={() => setModal({ open: true, idUsuario: u.idUsuario, motivo: '', loading: false })}>
                            Revocar
                          </Button>
                        )}
                        {u.estadoVerificacion === 'Rechazada' && (
                          <Button variant="ghost" size="sm" className="text-success hover:bg-success/10" onClick={() => aprobar(u.idUsuario)}>
                            Aprobar
                          </Button>
                        )}
                      </div>
                      {/* Modal visualizador de documentos */}
{imagenModal.open && (
  <div
    className="fixed inset-0 bg-dark/70 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
    onClick={() => setImagenModal({ open: false, url: '', titulo: '' })}
    onKeyDown={e => e.key === 'Escape' && setImagenModal({ open: false, url: '', titulo: '' })}
  >
    <div
      className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full animate-scale-in"
      onClick={e => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-line bg-surface">
        <h3 className="font-semibold text-dark text-sm">{imagenModal.titulo}</h3>
        <button
          onClick={() => setImagenModal({ open: false, url: '', titulo: '' })}
          className="text-muted hover:text-dark transition-colors p-1 rounded-lg hover:bg-surface"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

        {/* Imagen */}
        <div className="p-4 bg-dark/5 flex items-center justify-center min-h-[300px]">
          <img
            src={imagenModal.url}
            alt={imagenModal.titulo}
            className="max-w-full max-h-[70vh] object-contain rounded-xl"
            onError={e => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden flex-col items-center gap-2 text-muted">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">No se pudo cargar la imagen</p>
          </div>
        </div>

        {/* Footer con hint */}
        
      </div>
  </div>
)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}