import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/common/PageHeader';
import Input      from '../components/common/Input';
import Select     from '../components/common/Select';
import Button     from '../components/common/Button';
import api        from '../api/axios';
import { eventosService } from '../services/eventosService';

export default function EscanearBoleto() {
  const { addToast } = useToast();

  const [codigoQR,     setCodigoQR]     = useState('');
  const [idEvento,     setIdEvento]     = useState('');
  const [eventos,      setEventos]      = useState([]);
  const [resultado,    setResultado]    = useState(null);
  const [mensaje,      setMensaje]      = useState('');
  const [isLoading,    setIsLoading]    = useState(false);
  const [loadingEventos, setLoadingEventos] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await eventosService.eventosHoy();
        setEventos(data);
      } catch (err) {
        addToast('Error al cargar eventos de hoy.', 'error');
      } finally {
        setLoadingEventos(false);
      }
    };
    fetchEventos();
  }, [addToast]);

  const limpiar = () => {
    setCodigoQR('');
    setIdEvento('');
    setResultado(null);
    setMensaje('');
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!codigoQR.trim()) {
      addToast('Ingresa el código QR del boleto.', 'error');
      return;
    }
    if (!idEvento) {
      addToast('Selecciona un evento.', 'error');
      return;
    }
    setIsLoading(true);
    setResultado(null);
    try {
      const res = await api.post('/ordenes/usar-boleto', { 
        codigoQR: codigoQR.trim(),
        idEvento: parseInt(idEvento)
      });
      setResultado('ok');
      setMensaje(res.data.mensaje ?? 'Boleto válido. Acceso permitido.');
    } catch (err) {
      setResultado('error');
      setMensaje(err.message ?? 'Boleto inválido o ya usado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto pb-12 font-body">
      <PageHeader
        title="Escanear Boleto"
        description="Valida la entrada de un asistente escaneando su código QR."
      />

      <div className="bg-white rounded-2xl border border-line p-6 sm:p-8">
        <form onSubmit={handleScan} className="space-y-1">
          <Input
            label="Código QR del boleto"
            id="codigoQR"
            placeholder="Escribe o escanea el código aquí"
            value={codigoQR}
            onChange={e => setCodigoQR(e.target.value)}
            required
          />

          <Select
            label="Evento de hoy"
            id="idEvento"
            placeholder={loadingEventos ? "Cargando eventos..." : "Selecciona un evento"}
            value={idEvento}
            onChange={e => setIdEvento(e.target.value)}
            options={eventos.map(evento => ({
              value: evento.idEvento,
              label: `${evento.titulo} - ${evento.ubicacion}`
            }))}
            disabled={loadingEventos}
            required
          />

          <div className="pt-2">
            <Button type="submit" isLoading={isLoading} className="w-full">
              Validar boleto
            </Button>
          </div>
        </form>

        {resultado && (
          <div className={`mt-6 p-5 rounded-xl border text-center animate-scale-in ${
            resultado === 'ok'
              ? 'bg-success/10 border-success/20'
              : 'bg-error/10 border-error/20'
          }`}>
            <p className={`font-bold text-lg mb-1 ${resultado === 'ok' ? 'text-success' : 'text-error'}`}>
              {resultado === 'ok' ? 'Acceso permitido' : 'Acceso denegado'}
            </p>
            <p className={`text-sm ${resultado === 'ok' ? 'text-success/80' : 'text-error/80'}`}>
              {mensaje}
            </p>
            <button onClick={limpiar}
              className="mt-4 text-sm font-semibold text-muted hover:text-dark transition-colors underline">
              Escanear otro boleto
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 p-5 bg-surface border border-line rounded-2xl">
        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">¿Cómo funciona?</p>
        <div className="space-y-2 text-sm text-muted">
          {['Escanea el QR del boleto con un lector o pégalo manualmente.',
            'El sistema verifica automáticamente el evento y la validez del boleto.',
            'Si el boleto ya fue usado, el acceso será denegado.']
            .map((texto, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {texto}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}