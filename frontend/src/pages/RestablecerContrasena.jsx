import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input  from '../components/common/Input';
import Button from '../components/common/Button';
import { useToast }     from '../context/ToastContext';
import { authService }  from '../services/authService';

export default function RestablecerContrasena() {
  const { token }    = useParams();
  const navigate     = useNavigate();
  const { addToast } = useToast();

  const [form,      setForm]      = useState({ nueva: '', confirmar: '' });
  const [error,     setError]     = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.nueva.length < 6)          { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    if (form.nueva !== form.confirmar)   { setError('Las contraseñas no coinciden.'); return; }

    setIsLoading(true);
    try {
      await authService.restablecerContrasena(token, form.nueva);
      addToast('Contraseña actualizada correctamente.', 'success');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'El enlace expiró o es inválido.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-surface px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-line p-8 max-w-md w-full animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-display text-dark tracking-wide">NUEVA CONTRASEÑA</h2>
          <p className="text-muted text-sm mt-2">Elige una contraseña segura para tu cuenta.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-xl text-error text-sm flex items-center gap-2 animate-fade-in">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-1">
          <Input
            label="Nueva contraseña"
            id="nueva"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={form.nueva}
            onChange={e => setForm(p => ({ ...p, nueva: e.target.value }))}
          />
          <Input
            label="Confirmar contraseña"
            id="confirmar"
            type="password"
            placeholder="Repite la contraseña"
            value={form.confirmar}
            onChange={e => setForm(p => ({ ...p, confirmar: e.target.value }))}
          />
          <div className="pt-2">
            <Button type="submit" isLoading={isLoading} className="w-full">
              Guardar nueva contraseña
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}