import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input  from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth }     from '../context/AuthContext';
import { authService } from '../services/authService';

export default function AdminLogin() {
  const [formData,  setFormData]  = useState({ correo: '', contrasena: '' });
  const [error,     setError]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await authService.loginAdmin(formData.correo, formData.contrasena);
      login(data.usuario, data.token);
      navigate('/admin/aprobaciones');
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-surface px-4 py-12">
      <div className="max-w-md w-full animate-scale-in">
        <div className="bg-white rounded-2xl shadow-sm border border-line p-8">

          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-dark/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-display text-dark tracking-wide">PANEL ADMIN</h2>
            <p className="text-muted text-sm mt-1">Acceso exclusivo para administradores</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-error/10 border border-error/20 rounded-xl flex items-center gap-2.5 text-error text-sm animate-fade-in">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-1">
            <Input
              label="Correo"
              id="correo"
              type="email"
              placeholder="admin@eventosapp.com"
              value={formData.correo}
              onChange={handleChange}
            />
            <Input
              label="Contraseña"
              id="contrasena"
              type="password"
              placeholder="••••••••"
              value={formData.contrasena}
              onChange={handleChange}
            />
            <div className="pt-2">
              <Button type="submit" variant="dark" isLoading={isLoading} className="w-full">
                Ingresar al panel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}