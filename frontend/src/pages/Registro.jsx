import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input  from '../components/common/Input';
import Button from '../components/common/Button';
import { useToast }     from '../context/ToastContext';
import { authService }  from '../services/authService';
import { useAuth }     from '../context/AuthContext';
import { useEffect } from 'react';

export default function Registro() {
  const [formData,  setFormData]  = useState({ nombre: '', correo: '', contrasena: '', confirmar: '' });
  const [error,     setError]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate    = useNavigate();
  const { addToast } = useToast();
  const { user }    = useAuth();

  useEffect(() => {
    if (user) navigate('/'); // Si ya está logueado, redirige al home
  }, [user, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre || !formData.correo || !formData.contrasena || !formData.confirmar) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    if (formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (formData.contrasena !== formData.confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.registro(formData);
      addToast('Cuenta creada. Revisa tu correo para verificarla.', 'success');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Ocurrió un error al registrar tu cuenta.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-surface px-4 py-12">
      <div className="max-w-md w-full animate-scale-in">

        <div className="bg-white rounded-2xl shadow-sm border border-line p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-display text-dark tracking-wide">CREAR CUENTA</h2>
            <p className="text-muted text-sm mt-1">Únete para comprar boletos y organizar eventos</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-error/10 border border-error/20 rounded-xl flex items-center gap-2.5 text-error text-sm animate-fade-in">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleRegistro} className="space-y-1">
            <Input label="Nombre completo"     id="nombre"    type="text"     placeholder="Ej. Juan Pérez"        value={formData.nombre}     onChange={handleChange} />
            <Input label="Correo electrónico"  id="correo"    type="email"    placeholder="ejemplo@correo.com"    value={formData.correo}     onChange={handleChange} />
            <Input label="Contraseña"          id="contrasena" type="password" placeholder="Mínimo 6 caracteres"  value={formData.contrasena} onChange={handleChange} hint="Usa al menos 6 caracteres con números y letras." />
            <Input label="Confirmar contraseña" id="confirmar" type="password" placeholder="Repite tu contraseña" value={formData.confirmar}  onChange={handleChange} />

            <div className="pt-2">
              <Button type="submit" isLoading={isLoading} className="w-full">
                Crear cuenta
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}