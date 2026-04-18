import { useState, useRef } from 'react';
import { useAuth }  from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input  from '../components/common/Input';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import { authService } from '../services/authService';

// ── Componente de upload de archivo ──────────────────────────────────────────
function FileUpload({ label, id, accept, file, onChange }) {
  const ref = useRef(null);
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-dark mb-1.5">{label}</label>
      <div
        onClick={() => ref.current?.click()}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
          file ? 'border-success/40 bg-success/5' : 'border-line hover:border-primary hover:bg-primary/5'
        }`}
      >
        {file ? (
          <>
            <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium text-success truncate">{file.name}</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm text-muted">Haz clic para subir archivo</span>
          </>
        )}
        <input ref={ref} id={id} type="file" accept={accept} className="sr-only" onChange={onChange} />
      </div>
    </div>
  );
}

// ── Panel de estado de verificación ──────────────────────────────────────────
function VerificacionPanel({ estado }) {
  if (estado === 'Aprobada') {
    return (
      <div className="p-6 bg-success/10 border border-success/20 rounded-xl text-center animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-success/20 flex items-center justify-center mx-auto mb-3">
          <svg className="w-7 h-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-dark mb-1">¡Cuenta verificada!</h3>
        <p className="text-muted text-sm">Ya puedes crear y publicar eventos en la plataforma.</p>
      </div>
    );
  }

  if (estado === 'Pendiente') {
    return (
      <div className="p-6 bg-warning/10 border border-warning/20 rounded-xl text-center animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-warning/20 flex items-center justify-center mx-auto mb-3">
          <svg className="w-7 h-7 text-warning animate-pulse-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-dark mb-1">Solicitud en revisión</h3>
        <p className="text-muted text-sm">Estamos validando tus documentos. Esto puede tomar de 24 a 48 horas.</p>
      </div>
    );
  }

  if (estado === 'Rechazada') {
    return (
      <div className="p-6 bg-error/10 border border-error/20 rounded-xl text-center animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-error/20 flex items-center justify-center mx-auto mb-3">
          <svg className="w-7 h-7 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-dark mb-1">Solicitud rechazada</h3>
        <p className="text-muted text-sm mb-4">Tus documentos no pasaron la revisión. Puedes volver a intentarlo con documentos correctos.</p>
        <p className="text-xs text-muted">Revisa tu correo para ver el motivo del rechazo.</p>
      </div>
    );
  }

  return null;
}

// ── Banner de correo no verificado ───────────────────────────────────────────
function CorreoBanner() {
  const { addToast } = useToast();
  const [enviando,  setEnviando]  = useState(false);
  const [enviado,   setEnviado]   = useState(false);

  const reenviar = async () => {
    setEnviando(true);
    try {
      await authService.reenviarVerificacion();
      setEnviado(true);
      addToast('Correo de verificación enviado.', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3 animate-fade-in">
      <svg className="w-5 h-5 text-warning flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-dark">Correo sin verificar</p>
        <p className="text-xs text-muted mt-0.5">
          {enviado
            ? 'Enlace enviado. Revisa tu bandeja y carpeta de spam.'
            : 'Verifica tu correo para acceder a todas las funciones.'}
        </p>
      </div>
      {!enviado && (
        <Button
          variant="warning"
          size="sm"
          isLoading={enviando}
          onClick={reenviar}
          className="flex-shrink-0"
        >
          Reenviar enlace
        </Button>
      )}
    </div>
  );
}

export default function Perfil() {
  const { user }     = useAuth();
  const { addToast } = useToast();
  const [tabActiva,  setTabActiva]  = useState('datos');

  // Estado de verificación local (se leerá del contexto en Fase 5)
  const [estadoVerificacion, setEstadoVerificacion] = useState(
    user?.estadoVerificacion ?? 'Nuevo'
  );

  const [pwdData, setPwdData] = useState({ actual: '', nueva: '', confirmar: '' });
  const [pwdLoading, setPwdLoading] = useState(false);

  const [orgData,   setOrgData]   = useState({ curp: '', banco: '', cuenta: '' });
  const [archivos,  setArchivos]  = useState({ ine: null, selfie: null });
  const [orgLoading, setOrgLoading] = useState(false);

  const handleFileChange = (field) => (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addToast('Solo se permiten archivos de imagen.', 'error');
        return;
      }
      setArchivos(p => ({ ...p, [field]: file }));
    } else {
      setArchivos(p => ({ ...p, [field]: null }));
    }
  };

 const handlePwdSubmit = async (e) => {
  e.preventDefault();
  if (pwdData.nueva.length < 6) {
    addToast('La contraseña debe tener al menos 6 caracteres.', 'error');
    return;
  }
  if (pwdData.nueva !== pwdData.confirmar) {
    addToast('Las contraseñas nuevas no coinciden.', 'error');
    return;
  }
  setPwdLoading(true);
  try {
    await authService.cambiarContrasena(pwdData.actual, pwdData.nueva);
    addToast('Contraseña actualizada correctamente.', 'success');
    setPwdData({ actual: '', nueva: '', confirmar: '' });
  } catch (err) {
    addToast(err.message, 'error');
  } finally {
    setPwdLoading(false);
  }
};

  const handleOrgSubmit = async (e) => {
  e.preventDefault(); 
  if (orgData.curp.length < 18) {
    addToast('La CURP debe tener exactamente 18 caracteres.', 'error');
    return;
  }

if (orgData.cuenta.length < 18) {
  addToast('La CLABE debe tener exactamente 18 dígitos.', 'error');
  return;
}
  e.preventDefault();
  if (!archivos.ine || !archivos.selfie) {
    addToast('Debes subir tu INE y una selfie.', 'error');
    return;
  }
  setOrgLoading(true);
  try {
    const fd = new FormData();
    fd.append('ine',           archivos.ine);
    fd.append('selfie',        archivos.selfie);
    fd.append('curp',          orgData.curp);
    fd.append('cuentaBancaria', orgData.cuenta);
    fd.append('banco',         orgData.banco);
    await authService.verificarse(fd);
    setEstadoVerificacion('Pendiente');
    addToast('Solicitud enviada. Revisaremos tus documentos pronto.', 'success');
  } catch (err) {
    addToast(err.message, 'error');
  } finally {
    setOrgLoading(false);
  }
};

  const tabs = [
    {
      id: 'datos', label: 'Datos personales',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    },
    {
      id: 'seguridad', label: 'Seguridad',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
    },
    ...(user?.rol === 'cliente' ? [{
      id: 'organizador', label: 'Ser organizador',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    }] : []),
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 min-h-[calc(100vh-80px)] bg-surface font-body">

      {/* Header de perfil */}
      <div className="flex flex-col sm:flex-row items-center gap-5 mb-8 bg-white p-6 rounded-2xl border border-line animate-slide-up">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-display shadow-sm flex-shrink-0">
          {user?.nombre?.charAt(0) ?? 'U'}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-display text-dark tracking-wide">{user?.nombre ?? 'Usuario'}</h1>
          <p className="text-muted text-sm">{user?.correo ?? ''}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
            <span className="px-3 py-1 bg-surface border border-line rounded-full text-xs font-semibold text-muted capitalize">
              {user?.rol ?? 'cliente'}
            </span>
            {user?.correoVerificado
              ? <span className="px-3 py-1 bg-success/10 border border-success/20 rounded-full text-xs font-semibold text-success">Correo verificado</span>
              : user?.rol !== 'admin' && ( 
              <span className="px-3 py-1 bg-warning/10 border border-warning/20 rounded-full text-xs font-semibold text-warning">Correo sin verificar</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">

        {/* Menú lateral */}
        <div className="w-full md:w-56 flex-shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-all ${
                tabActiva === tab.id
                  ? tab.id === 'organizador'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-dark text-white shadow-md'
                  : 'bg-white text-muted border border-line hover:border-dark/30 hover:text-dark'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {tab.icon}
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel de contenido */}
        <div className="flex-1 bg-white rounded-2xl border border-line p-6 sm:p-8 animate-fade-in">

          {/* ── Datos personales ── */}
          {tabActiva === 'datos' && (
              <div>
                <h2 className="text-xl font-bold text-dark mb-5">Información básica</h2>

                {/* Banner correo no verificado */}
                {!user?.correoVerificado && user?.rol !== 'admin' && (

                  <CorreoBanner />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input label="Nombre completo"    id="nombre" defaultValue={user?.nombre} disabled />
                  <Input label="Correo electrónico" id="correo" defaultValue={user?.correo}  disabled />
                </div>
                <p className="text-xs text-muted">Para modificar tu nombre o correo, contacta a soporte.</p>
              </div>
            )}

          {/* ── Seguridad ── */}
          {tabActiva === 'seguridad' && (
            <div>
              <h2 className="text-xl font-bold text-dark mb-1">Cambiar contraseña</h2>
              <p className="text-muted text-sm mb-6">Usa al menos 6 caracteres con números y letras.</p>
              <form onSubmit={handlePwdSubmit} className="max-w-md space-y-1">
                <Input label="Contraseña actual"  placeholder="Ingresa tu contraseña actual"      id="actual"    type="password" value={pwdData.actual}    onChange={e => setPwdData(p => ({ ...p, actual: e.target.value }))}    required />
                <Input label="Nueva contraseña" placeholder="Ingresa al menos 6 caracteres"         id="nueva"     type="password" value={pwdData.nueva}     onChange={e => setPwdData(p => ({ ...p, nueva: e.target.value }))}     required />
                <Input label="Confirmar nueva contraseña" placeholder="Confirma tu nueva contraseña" id="confirmar" type="password" value={pwdData.confirmar} onChange={e => setPwdData(p => ({ ...p, confirmar: e.target.value }))} required />
                <div className="pt-2">
                  <Button type="submit" variant="secondary" isLoading={pwdLoading} className="w-full">
                    Actualizar contraseña
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* ── Ser organizador ── */}
          {tabActiva === 'organizador' && user?.rol === 'cliente' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-dark">Conviértete en organizador</h2>
                <StatusBadge status={estadoVerificacion} />
              </div>

              {/* Estados que no muestran el formulario */}
              {(estadoVerificacion === 'Aprobada' || estadoVerificacion === 'Pendiente' || estadoVerificacion === 'Rechazada') && (
                <VerificacionPanel estado={estadoVerificacion} />
              )}

              {/* Formulario — solo si es Nuevo o Rechazado (puede reintentar) */}
              {(estadoVerificacion === 'Nuevo' || estadoVerificacion === 'Rechazada') && (
                <>
                  {estadoVerificacion === 'Rechazada' && (
                    <div className="mb-6 p-3 bg-error/10 border border-error/20 rounded-xl text-sm text-error">
                      Tu solicitud anterior fue rechazada. Sube documentos correctos e inténtalo de nuevo.
                    </div>
                  )}

                  <p className="text-muted text-sm mb-6">
                    Necesitamos validar tu identidad para garantizar la seguridad de los compradores. Todos los campos son obligatorios.
                  </p>

                  <form onSubmit={handleOrgSubmit} className="space-y-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="CURP"
                        id="curp"
                        placeholder="18 caracteres"
                        maxLength={18}
                        value={orgData.curp}
                        onChange={e => setOrgData(p => ({ ...p, curp: e.target.value.toUpperCase() }))}
                        hint="Exactamente 18 caracteres alfanuméricos."
                        required
                      />
                      <Input
                        label="Banco"
                        id="banco"
                        placeholder="Ej. BBVA, Santander"
                        value={orgData.banco}
                        onChange={e => setOrgData(p => ({ ...p, banco: e.target.value }))}
                        required
                      />
                      <div className="md:col-span-2">
                        <Input
                          label="CLABE interbancaria (18 dígitos)"
                          id="cuenta"
                          placeholder="Para depositarte tus ganancias"
                          maxLength={18}
                          value={orgData.cuenta}
                          onChange={e => setOrgData(p => ({ ...p, cuenta: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <FileUpload
                        label="INE (frente)"
                        id="ine"
                        accept="image/*"
                        file={archivos.ine}
                        onChange={handleFileChange('ine')}
                      />
                      
                      <FileUpload
                        label="Selfie sosteniendo tu INE"
                        id="selfie"
                        accept="image/*"
                        file={archivos.selfie}
                        onChange={handleFileChange('selfie')}
                      />
                    </div>

                    <div className="pt-4">
                      <Button type="submit" isLoading={orgLoading} className="w-full">
                        Enviar solicitud
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}