import { useState, useEffect } from 'react';
import Button        from '../components/common/Button';
import Input         from '../components/common/Input';
import PageHeader    from '../components/common/PageHeader';
import EmptyState    from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth }      from '../context/AuthContext';
import { useToast }     from '../context/ToastContext';
import { adminService } from '../services/adminService';

export default function AdminGestores() {
  const { user }     = useAuth();
  const { addToast } = useToast();

  const [admins,    setAdmins]    = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal,     setModal]     = useState(false);
  const [modo,      setModo]      = useState('nuevo');
  const [saving,    setSaving]    = useState(false);
  const [errors,    setErrors]    = useState({});
  const [form,      setForm]      = useState({ nombre: '', correo: '', contrasena: '' });
  const [correoUsuario,     setCorreoUsuario]     = useState('');
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
  const [buscando,          setBuscando]          = useState(false);
  const [contrasenaTemp,    setContrasenaTemp]    = useState('');
  const [modalDesact, setModalDesact] = useState({ open: false, idAdmin: null, nombre: '', motivo: '', loading: false });

  const cargar = () => {
    setIsLoading(true);
    adminService.listarAdmins()
      .then(setAdmins)
      .catch(err => addToast(err.message, 'error'))
      .finally(() => setIsLoading(false));
  };

  useEffect(cargar, []);

  const resetModal = () => {
    setModal(false);
    setModo('nuevo');
    setForm({ nombre: '', correo: '', contrasena: '' });
    setCorreoUsuario('');
    setUsuarioEncontrado(null);
    setContrasenaTemp('');
    setErrors({});
  };

  const validarNuevo = () => {
    const e = {};
    if (!form.nombre.trim())        e.nombre     = 'Obligatorio';
    if (!form.correo.trim())        e.correo     = 'Obligatorio';
    if (form.contrasena.length < 6) e.contrasena = 'Mínimo 6 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmitNuevo = async (e) => {
    e.preventDefault();
    if (!validarNuevo()) return;
    setSaving(true);
    try {
      await adminService.registrarAdmin(form.nombre, form.correo, form.contrasena);
      addToast('Administrador registrado correctamente.', 'success');
      resetModal();
      cargar();
    } catch (err) {
      addToast(err.message, 'error');
    } finally { setSaving(false); }
  };

  const buscarUsuario = async () => {
    if (!correoUsuario.trim()) return;
    setBuscando(true);
    setUsuarioEncontrado(null);
    try {
      const u = await adminService.buscarUsuarioParaAdmin(correoUsuario);
      setUsuarioEncontrado(u);
    } catch (err) {
      addToast(err.message, 'error');
    } finally { setBuscando(false); }
  };

  const handlePromover = async (e) => {
    e.preventDefault();
    if (!usuarioEncontrado) return;
    if (contrasenaTemp.length < 6) {
      setErrors({ contrasenaTemp: 'Mínimo 6 caracteres' });
      return;
    }
    setSaving(true);
    try {
      await adminService.promoverUsuarioAAdmin(usuarioEncontrado.idUsuario, contrasenaTemp);
      addToast(`${usuarioEncontrado.nombre} promovido a administrador.`, 'success');
      resetModal();
      cargar();
    } catch (err) {
      addToast(err.message, 'error');
    } finally { setSaving(false); }
  };

  const confirmarDesactivar = async () => {
    if (!modalDesact.motivo.trim()) {
      addToast('El motivo es obligatorio.', 'error');
      return;
    }
    setModalDesact(p => ({ ...p, loading: true }));
    try {
      await adminService.desactivarAdmin(modalDesact.idAdmin, modalDesact.motivo);
      addToast('Administrador desactivado. Se envió notificación.', 'info');
      setModalDesact({ open: false, idAdmin: null, nombre: '', motivo: '', loading: false });
      cargar();
    } catch (err) {
      addToast(err.message, 'error');
      setModalDesact(p => ({ ...p, loading: false }));
    }
  };

  const reactivar = async (idAdmin) => {
    try {
      await adminService.reactivarAdmin(idAdmin);
      addToast('Administrador reactivado correctamente.', 'success');
      cargar();
    } catch (err) { addToast(err.message, 'error'); }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 font-body">

      {/* Modal crear / promover */}
      {modal && (
        <div className="fixed inset-0 bg-dark/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-line p-6 sm:p-8 max-w-md w-full animate-scale-in">
            <h2 className="text-xl font-bold text-dark mb-1">Agregar administrador</h2>
            <p className="text-muted text-sm mb-5">Elige cómo deseas agregar al nuevo administrador.</p>

            <div className="flex rounded-xl border border-line overflow-hidden mb-6">
              <button onClick={() => { setModo('nuevo'); setErrors({}); }}
                className={`flex-1 py-2 text-sm font-semibold transition-colors ${modo === 'nuevo' ? 'bg-dark text-white' : 'bg-surface text-muted hover:text-dark'}`}>
                Crear nuevo
              </button>
              <button onClick={() => { setModo('usuario'); setErrors({}); }}
                className={`flex-1 py-2 text-sm font-semibold transition-colors ${modo === 'usuario' ? 'bg-dark text-white' : 'bg-surface text-muted hover:text-dark'}`}>
                Desde usuario existente
              </button>
            </div>

            {modo === 'nuevo' && (
              <form onSubmit={handleSubmitNuevo} className="space-y-1">
                <Input label="Nombre completo" id="nombre" placeholder="Ej. Laura Méndez"
                  value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} error={errors.nombre} />
                <Input label="Correo electrónico" id="correo" type="email" placeholder="admin@correo.com"
                  value={form.correo} onChange={e => setForm(p => ({ ...p, correo: e.target.value }))} error={errors.correo} />
                <Input label="Contraseña temporal" id="contrasena" type="password" placeholder="Mínimo 6 caracteres"
                  value={form.contrasena} onChange={e => setForm(p => ({ ...p, contrasena: e.target.value }))} error={errors.contrasena} />
                <div className="flex justify-end gap-3 pt-5 border-t border-line mt-4">
                  <Button type="button" variant="ghost" onClick={resetModal}>Cancelar</Button>
                  <Button type="submit" isLoading={saving}>Registrar admin</Button>
                </div>
              </form>
            )}

            {modo === 'usuario' && (
              <form onSubmit={handlePromover} className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1.5">Correo del usuario</label>
                  <div className="flex gap-2">
                    <input type="email" placeholder="usuario@correo.com" value={correoUsuario}
                      onChange={e => { setCorreoUsuario(e.target.value); setUsuarioEncontrado(null); }}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-line bg-white text-dark text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" />
                    <Button type="button" variant="outline" size="sm" isLoading={buscando} onClick={buscarUsuario}>
                      Buscar
                    </Button>
                  </div>
                  <p className="text-xs text-muted mt-1">El usuario debe tener el correo verificado.</p>
                </div>

                {usuarioEncontrado && (
                  <div className="p-3 bg-success/10 border border-success/20 rounded-xl flex items-center gap-3 animate-fade-in">
                    <div className="w-8 h-8 rounded-xl bg-success/20 flex items-center justify-center text-success font-bold text-sm flex-shrink-0">
                      {usuarioEncontrado.nombre?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-dark">{usuarioEncontrado.nombre}</p>
                      <p className="text-xs text-muted">{usuarioEncontrado.correo}</p>
                    </div>
                  </div>
                )}

                {usuarioEncontrado && (
                  <Input label="Contraseña para el panel" id="contrasenaTemp" type="password" placeholder="Mínimo 6 caracteres"
                    value={contrasenaTemp} onChange={e => { setContrasenaTemp(e.target.value); setErrors({}); }}
                    error={errors.contrasenaTemp} />
                )}

                <div className="flex justify-end gap-3 pt-5 border-t border-line mt-2">
                  <Button type="button" variant="ghost" onClick={resetModal}>Cancelar</Button>
                  <Button type="submit" isLoading={saving} disabled={!usuarioEncontrado}>Promover a admin</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal desactivar */}
      {modalDesact.open && (
        <div className="fixed inset-0 bg-dark/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-line p-6 sm:p-8 max-w-md w-full animate-scale-in">
            <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-dark mb-1 text-center">Desactivar administrador</h2>
            <p className="text-muted text-sm mb-5 text-center">
              Estás a punto de desactivar a <strong>{modalDesact.nombre}</strong>. Se le notificará por correo.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-dark mb-1.5">Motivo</label>
              <textarea rows={3} placeholder="Ej. Inactividad prolongada, violación de políticas..."
                value={modalDesact.motivo}
                onChange={e => setModalDesact(p => ({ ...p, motivo: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-line bg-white text-dark text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-line">
              <Button variant="ghost" onClick={() => setModalDesact({ open: false, idAdmin: null, nombre: '', motivo: '', loading: false })}>
                Cancelar
              </Button>
              <Button variant="danger" isLoading={modalDesact.loading}
                disabled={!modalDesact.motivo.trim()} onClick={confirmarDesactivar}>
                Confirmar desactivación
              </Button>
            </div>
          </div>
        </div>
      )}

      <PageHeader
        title="Gestión de Administradores"
        description="Solo el dueño puede agregar o desactivar administradores."
        action={
          <Button variant="primary" onClick={() => setModal(true)}
            icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>}>
            Agregar admin
          </Button>
        }
      />

      <div className="bg-white rounded-2xl border border-line overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : admins.length === 0 ? (
          <EmptyState title="Sin administradores" description="Aún no hay otros administradores registrados." />
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface text-muted text-xs uppercase tracking-wider border-b border-line">
                <th className="px-5 py-3 font-semibold">Administrador</th>
                <th className="px-5 py-3 font-semibold">Correo</th>
                <th className="px-5 py-3 font-semibold">Tipo</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {admins.map(admin => (
                <tr key={admin.idAdministrador} className="hover:bg-surface/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary font-bold text-sm flex-shrink-0">
                        {admin.nombre?.charAt(0)}
                      </div>
                      <p className="text-sm font-semibold text-dark">{admin.nombre}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted">{admin.correo}</td>
                  <td className="px-5 py-4">
                    {Number(admin.dueno) === 1 ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20">Dueño</span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface text-muted border border-line">Moderador</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      Number(admin.activo) === 1
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-error/10 text-error border-error/20'
                    }`}>
                      {Number(admin.activo) === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {!Number(admin.dueno) && Number(admin.activo) === 1 && (
                      <Button variant="outline" size="sm"
                        onClick={() => setModalDesact({ open: true, idAdmin: admin.idAdministrador, nombre: admin.nombre, motivo: '', loading: false })}>
                        Desactivar
                      </Button>
                    )}
                    {!Number(admin.dueno) && Number(admin.activo) === 0 && (
                      <Button variant="ghost" size="sm" onClick={() => reactivar(admin.idAdministrador)}>
                        Reactivar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}