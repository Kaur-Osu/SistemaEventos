import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { useAuth }     from '../context/AuthContext';
import { authService } from '../services/authService';
import api from '../api/axios';

export default function VerificarCorreo() {
  const { idUsuario, token } = useParams();
  const { user, updateUser } = useAuth();

  const [estado,       setEstado]       = useState('cargando');
  const [reenviando,   setReenviando]   = useState(false);
  const [reenviado,    setReenviado]    = useState(false);
  const [errorReenvio, setErrorReenvio] = useState('');

  // Evita que React StrictMode llame al endpoint dos veces
  const llamadaHecha = useRef(false);

  useEffect(() => {
    if (llamadaHecha.current) return;
    llamadaHecha.current = true;

    api.get(`/auth/verificar-correo/${idUsuario}/${token}`)
      .then(async () => {
        setEstado('ok');
        try {
          const tokenGuardado = localStorage.getItem('token_eventos');
          if (tokenGuardado) {
            const usuarioActualizado = await authService.me();
            updateUser(usuarioActualizado);
          }
        } catch {}
      })
      .catch(() => setEstado('error'));
  }, []);

  const handleReenviar = async () => {
    setReenviando(true);
    setErrorReenvio('');
    try {
      await authService.reenviarVerificacion();
      setReenviado(true);
    } catch (err) {
      setErrorReenvio(err.message);
    } finally {
      setReenviando(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-surface px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-line p-10 max-w-md w-full text-center animate-scale-in">

        {estado === 'cargando' && (
          <>
            <div className="flex justify-center mb-4"><LoadingSpinner size="lg" /></div>
            <p className="text-muted">Verificando tu correo...</p>
          </>
        )}

        {estado === 'ok' && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-display text-dark tracking-wide mb-2">¡Correo verificado!</h2>
            <p className="text-muted text-sm mb-6">Tu cuenta está activa. Ya puedes usar todas las funciones.</p>
            <Link to={user ? '/' : '/login'}>
              <Button variant="primary" className="w-full">
                {user ? 'Ir al inicio' : 'Ir al login'}
              </Button>
            </Link>
          </>
        )}

        {estado === 'error' && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-display text-dark tracking-wide mb-2">Enlace expirado</h2>
            <p className="text-muted text-sm mb-6">Este enlace ya no es válido. Puedes solicitar uno nuevo.</p>

            {user && !user.correoVerificado ? (
              <>
                {reenviado ? (
                  <div className="p-3 bg-success/10 border border-success/20 rounded-xl text-success text-sm mb-4 animate-fade-in">
                    ✓ Nuevo enlace enviado. Revisa tu correo y carpeta de spam.
                  </div>
                ) : (
                  <>
                    {errorReenvio && (
                      <div className="p-3 bg-error/10 border border-error/20 rounded-xl text-error text-sm mb-4">
                        {errorReenvio}
                      </div>
                    )}
                    <Button variant="primary" isLoading={reenviando} onClick={handleReenviar} className="w-full mb-3">
                      Reenviar correo de verificación
                    </Button>
                  </>
                )}
                <Link to="/"><Button variant="ghost" className="w-full">Ir al inicio</Button></Link>
              </>
            ) : (
              <div className="space-y-3">
                <Link to="/login"><Button variant="primary" className="w-full">Iniciar sesión para reenviar</Button></Link>
                <Link to="/"><Button variant="ghost" className="w-full">Ir al inicio</Button></Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}