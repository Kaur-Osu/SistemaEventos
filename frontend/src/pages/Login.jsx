import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input  from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth }      from '../context/AuthContext';
import { authService }  from '../services/authService';
import { useEffect } from 'react';

export default function Login() {
  const [formData,  setFormData]  = useState({ correo: '', contrasena: '' });
  const [error,     setError]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login }   = useAuth();
  const { user }    = useAuth();
  const navigate    = useNavigate();

  useEffect(() => {
  if (user) navigate('/', { replace: true });
}, [user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.correo || !formData.contrasena) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    setIsLoading(true);
    try {
      const data = await authService.login(formData.correo, formData.contrasena);
      login(data.usuario, data.token);
      if (data.usuario.rol === 'admin')        navigate('/admin/aprobaciones');
      else if (data.usuario.rol === 'organizador') navigate('/organizador/eventos');
      else                                     navigate('/');
    } catch (err) {
      setError(err.message || 'Correo o contraseña incorrectos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-surface px-4 py-12">
      <div className="max-w-md w-full animate-scale-in">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-line p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-display text-dark tracking-wide">BIENVENIDO</h2>
            <p className="text-muted text-sm mt-1">Ingresa tus credenciales para continuar</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-error/10 border border-error/20 rounded-xl flex items-center gap-2.5 text-error text-sm animate-fade-in">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-1">
            <Input
              label="Correo electrónico"
              id="correo"
              type="email"
              placeholder="ejemplo@correo.com"
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

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-line text-primary focus:ring-primary" />
                <span className="text-sm text-muted">Recordarme</span>
              </label>
              <Link to="/recuperar-contrasena" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <div className="pt-2">
              <Button type="submit" isLoading={isLoading} className="w-full">
                Iniciar sesión
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}