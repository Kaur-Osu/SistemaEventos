import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input  from '../components/common/Input';
import Button from '../components/common/Button';
import { authService } from '../services/authService';

export default function RecuperarContrasena() {
  const [correo,    setCorreo]    = useState('');
  const [enviado,   setEnviado]   = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!correo) { setError('Ingresa tu correo.'); return; }
    setIsLoading(true);
    setError('');
    try {
      await authService.recuperarContrasena(correo);
      setEnviado(true);
    } catch (err) {
      setError(err.message || 'Error al enviar. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-surface px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-line p-8 max-w-md w-full animate-scale-in">

        {!enviado ? (
          <>
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-display text-dark tracking-wide">RECUPERAR ACCESO</h2>
              <p className="text-muted text-sm mt-2">Te enviaremos un enlace para restablecer tu contraseña.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-xl text-error text-sm flex items-center gap-2 animate-fade-in">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Input
                label="Correo electrónico"
                id="correo"
                type="email"
                placeholder="ejemplo@correo.com"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
              />
              <Button type="submit" isLoading={isLoading} className="w-full mt-2">
                Enviar enlace de recuperación
              </Button>
            </form>

            <p className="text-center text-sm text-muted mt-6">
              <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Volver al login
              </Link>
            </p>
          </>
        ) : (
          <div className="text-center animate-scale-in">
            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-display text-dark tracking-wide mb-2">¡Correo enviado!</h2>
            <p className="text-muted text-sm mb-6">
              Si el correo existe recibirás un enlace en los próximos minutos. Revisa también tu carpeta de spam.
            </p>
            <Link to="/login">
              <button className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all">
                Volver al login
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}