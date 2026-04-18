import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Input  from '../components/common/Input';
import Button from '../components/common/Button';
import { ordenesService }  from '../services/ordenesService';
import { formatMoneda }    from '../utils/formatters';
import { useToast }       from '../context/ToastContext';

export default function Checkout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { id }    = useParams();
  const { addToast } = useToast();

  const state = location.state;

  const [isLoadingOrder, setIsLoadingOrder] = useState(!state);
  const [isProcessing,   setIsProcessing]   = useState(false);
  const [showSuccess,    setShowSuccess]     = useState(false);
  const [timeExpired,    setTimeExpired]     = useState(false);
  const [timeLeft,       setTimeLeft]        = useState(() => {
    if (!state?.expiracion) return 600;
    const diff = Math.floor((new Date(state.expiracion) - Date.now()) / 1000);
    return Math.max(0, diff);
  });

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Redirigir si no hay estado de navegación
  useEffect(() => {
    if (!state) {
      setTimeout(() => navigate(`/evento/${id}`), 400);
    } else {
      setIsLoadingOrder(false);
    }
  }, [state, id, navigate]);

  // Temporizador
  useEffect(() => {
    if (isLoadingOrder || !state) return;
    if (timeLeft <= 0) { setTimeExpired(true); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, isLoadingOrder, state]);

  const formatTime = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const onSubmit = async () => {
    if (timeExpired || !state) return;
    setIsProcessing(true);
    try {
      await ordenesService.pagar(state.idOrden, totalFinal);
      setShowSuccess(true);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingOrder || !state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-muted font-display text-xl">Cargando tu orden...</p>
      </div>
    );
  }

  const { seleccion, totalPagar, evento } = state;
  const totalFinal    = totalPagar;
  const zonas         = evento?.zonas ?? [];

  // ── Modal: tiempo expirado ────────────────────────────────────────────────
  if (timeExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="bg-white rounded-2xl border border-line p-8 max-w-sm w-full text-center animate-scale-in">
          <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display text-dark tracking-wide mb-2">Tiempo expirado</h2>
          <p className="text-muted text-sm mb-6">
            Los boletos reservados fueron liberados. Puedes volver a seleccionarlos.
          </p>
          <Link to={`/evento/${id}`}>
            <Button variant="primary" className="w-full">Volver al evento</Button>
          </Link>
        </div>
      </div>
    );
  }

  // ── Modal: pago exitoso ───────────────────────────────────────────────────
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="bg-white rounded-2xl border border-line p-8 max-w-sm w-full text-center animate-scale-in">
          <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-display text-dark tracking-wide mb-2">¡Pago exitoso!</h2>
          <p className="text-muted text-sm mb-2">
            Tus boletos están activos. Revisa tu correo para el recibo.
          </p>
          <p className="font-bold text-dark text-lg mb-6">${formatMoneda(totalFinal)} MXN</p>
          <div className="flex flex-col gap-3">
            <Link to="/mis-boletos">
              <Button variant="primary" className="w-full">Ver mis boletos</Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="w-full">Ir al inicio</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Vista principal del checkout ──────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-80px)] bg-surface py-10 font-body">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Banner de tiempo */}
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-warning">
            <svg className="w-5 h-5 animate-pulse-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold text-dark">Completa tu pago antes de que expire la reserva.</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-line font-display text-2xl text-warning tracking-widest">
            {formatTime(timeLeft)}
          </div>
        </div>
<button
                  type="button"
                  onClick={() => navigate(`/evento/${id}`)}
                  className="flex items-center gap-2 text-sm text-muted hover:text-dark transition-colors mb-4"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Volver al evento
                </button>
        <div className="flex flex-col lg:flex-row gap-8">
                
          {/* Formulario de pago */}
          <div className="lg:w-3/5">
            <div className="bg-white rounded-2xl border border-line p-6 sm:p-8">
              <h2 className="text-xl font-bold text-dark mb-6 pb-4 border-b border-line">
                Detalles de pago
              </h2>
              <form id="pago-form" onSubmit={handleSubmit(onSubmit)} className="space-y-1">
              
                <Input
                  label="Nombre en la tarjeta"
                  id="nombreTitular"
                  placeholder="Como aparece en la tarjeta"
                  {...register('nombreTitular', { required: 'El nombre es obligatorio' })}
                  error={errors.nombreTitular?.message}
                />
                <div className="mb-4">
    <label className="block text-sm font-semibold text-dark mb-1.5">Número de tarjeta</label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-white text-dark placeholder:text-muted/60 transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    {...register('numeroTarjeta', {
                      required: 'Obligatorio',
                      validate: v => v.replace(/\s/g, '').length === 16 || 'Debe tener 16 dígitos',
                    })}
                    onChange={e => {
                      const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                      const fmt = raw.match(/.{1,4}/g)?.join(' ') ?? raw;
                      e.target.value = fmt;
                    }}
                  />
                  {errors.numeroTarjeta && (
                    <p className="text-error text-xs mt-1.5 font-medium">{errors.numeroTarjeta.message}</p>
                  )}
                </div>
                  <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-dark mb-1.5">Expiración</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      maxLength={5}
                      className="w-full px-4 py-2.5 rounded-xl border border-line bg-white text-dark placeholder:text-muted/60 transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      {...register('expiracion', {
                        required: 'Requerido',
                        pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Formato MM/AA' },
                      })}
                      onChange={e => {
                        let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                        if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
                        e.target.value = val;
                      }}
                    />
                    {errors.expiracion && (
                      <p className="text-error text-xs mt-1.5 font-medium">{errors.expiracion.message}</p>
                    )}
                  </div>
                  <Input
                    label="CVC"
                    id="cvc"
                    type="password"
                    placeholder="123"
                    maxLength={4}
                    {...register('cvc', {
                      required: 'Requerido',
                      pattern: { value: /^[0-9]{3,4}$/, message: 'Inválido' },
                    })}
                    error={errors.cvc?.message}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Resumen de orden */}
          <div className="lg:w-2/5">
            <div className="bg-white rounded-2xl border border-line p-6 sticky top-24">
              <h2 className="text-lg font-bold text-dark mb-4">Tu orden</h2>

              <div className="pb-4 mb-4 border-b border-line">
                <p className="font-bold text-dark text-sm leading-snug">{evento?.titulo}</p>
              </div>

              <div className="space-y-2 mb-4">
                {Object.entries(seleccion).map(([idZona, cantidad]) => {
                  const zona = zonas.find(z => z.idZona === parseInt(idZona));
                  if (!zona) return null;
                  return (
                    <div key={idZona} className="flex justify-between text-sm text-muted">
                      <span>{zona.nombre} × {cantidad}</span>
                      <span className="font-semibold text-dark">${formatMoneda(zona.precio * cantidad)}</span>
                    </div>
                  );
                })}
              </div>



              <div className="flex justify-between items-center pt-3 border-t border-line mb-6">
                <span className="font-bold text-dark">Total</span>
                <span className="text-2xl font-display text-primary">${formatMoneda(totalFinal)}</span>
              </div>

              <Button
                type="submit"
                form="pago-form"
                variant="success"
                isLoading={isProcessing}
                className="w-full text-base"
                size="lg"
              >
                Pagar ${formatMoneda(totalFinal)}
              </Button>

              <p className="text-xs text-muted text-center mt-3 flex items-center justify-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Pago seguro con encriptación SSL
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}