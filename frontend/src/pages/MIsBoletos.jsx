import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EmptyState     from '../components/common/EmptyState';
import StatusBadge    from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast }        from '../context/ToastContext';
import { usuariosService } from '../services/usuariosService';
import { formatFechaCorta, formatHora } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

const TABS = [
  { id: 'Activo',    label: 'Próximos' },
  { id: 'Inactivo',  label: 'Usados' },
  { id: 'Cancelado', label: 'Cancelados' },
];

// Genera y abre una ventana de impresión con el boleto completo
const imprimirBoleto = (boleto) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${boleto.codigoQR ?? boleto.idBoleto}`;
  const ventana = window.open('', '_blank', 'width=480,height=680');
  ventana.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8"/>
      <title>Boleto — ${boleto.eventoTitulo}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
        .ticket { background: white; border-radius: 16px; overflow: hidden; max-width: 420px; width: 100%; box-shadow: 0 8px 32px rgba(0,0,0,.12); }
        .header { background: #0F172A; color: white; padding: 20px 24px; }
        .header h1 { font-size: 10px; text-transform: uppercase; letter-spacing: .15em; opacity: .6; margin-bottom: 6px; }
        .header h2 { font-size: 20px; font-weight: 700; line-height: 1.2; }
        .body { padding: 20px 24px; }
        .row { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
        .row:last-child { border-bottom: none; }
        .icon { width: 16px; color: #2563EB; flex-shrink: 0; margin-top: 2px; }
        .label { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: #94a3b8; margin-bottom: 2px; }
        .value { font-size: 14px; font-weight: 600; color: #0F172A; }
        .zona-badge { display: inline-block; background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 700; }
        .qr-section { background: #f8fafc; border-top: 2px dashed #e2e8f0; padding: 20px 24px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .qr-section img { border: 3px solid #2563EB; border-radius: 12px; padding: 6px; background: white; }
        .qr-section p { font-size: 10px; color: #94a3b8; font-family: monospace; }
        .footer { background: #2563EB; color: white; text-align: center; padding: 10px; font-size: 11px; font-weight: 600; letter-spacing: .1em; }
        @media print { body { background: white; } .ticket { box-shadow: none; } }
      </style>
    </head>
    <body>
      <div class="ticket">
        <div class="header">
          <h1>EventosApp — Tu Boleto</h1>
          <h2>${boleto.eventoTitulo}</h2>
        </div>
        <div class="body">
          <div class="row">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <div><div class="label">Fecha y hora</div><div class="value">${formatFechaCorta(boleto.eventoFecha)} · ${formatHora(boleto.eventoFecha)} hrs</div></div>
          </div>
          <div class="row">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"/></svg>
            <div><div class="label">Ubicación</div><div class="value">${boleto.ubicacion}</div></div>
          </div>
          <div class="row">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
            <div><div class="label">Zona</div><div class="value"><span class="zona-badge">${boleto.nombreZona}</span></div></div>
          </div>
        </div>
        <div class="qr-section">
          <img src="${qrUrl}" width="200" height="200" alt="QR"/>
          <p>ID: ${boleto.idBoleto}</p>
        </div>
        <div class="footer">PRESENTA ESTE CÓDIGO EN PUERTA</div>
      </div>
      <script>window.onload = () => window.print();</script>
    </body>
    </html>
  `);
  ventana.document.close();
};

export default function MisBoletos() {
  const { addToast } = useToast();
  const [boletos,   setBoletos]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro,    setFiltro]    = useState('Activo');
  const { user } = useAuth();

 useEffect(() => {
  usuariosService.misOrdenes()
    .then(async (ordenes) => {
      if (!ordenes || ordenes.length === 0) { setBoletos([]); return; }

      const resultados = await Promise.allSettled(
        ordenes.map(orden =>
          usuariosService.boletosPorOrden(orden.idOrden)
            .then(bs => bs.map(b => ({
              ...b,
              estado      : b.estadoBoleto ?? b.estado,
              eventoTitulo: b.eventoTitulo ?? orden.titulo,
              eventoFecha : b.eventoFecha  ?? orden.fecha,
              ubicacion   : b.eventoUbicacion ?? b.ubicacion ?? orden.ubicacion,
              nombreZona  : b.nombreZona,
            })))
        )

        
      );

      const todos = resultados
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value);

      setBoletos(todos);
    })
    .catch(err => addToast(err.message, 'error'))
    .finally(() => setIsLoading(false));
}, []);

  const boletosFiltrados = boletos.filter(b => b.estado === filtro);
  if (user?.rol === 'admin') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-line p-10 max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface border border-line flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h2 className="text-xl font-display text-dark tracking-wide mb-2">Sección no disponible</h2>
          <p className="text-muted text-sm">Las cuentas de administrador no pueden adquirir boletos.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-surface pb-16 font-body">

      <div className="bg-dark text-white py-10 px-4 text-center mb-8">
        <h1 className="text-4xl font-display tracking-wide mb-1">Mis Boletos</h1>
        <p className="text-white/50 text-sm">Administra tus entradas y preséntalas el día del evento.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {TABS.map(tab => {
            const count = boletos.filter(b => b.estado === tab.id).length;
            return (
              <button
                key={tab.id}
                onClick={() => setFiltro(tab.id)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border-2 ${
                  filtro === tab.id
                    ? 'bg-dark text-white border-dark shadow-md'
                    : 'bg-white text-muted border-line hover:border-muted'
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${filtro === tab.id ? 'bg-white/20' : 'bg-surface'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : boletosFiltrados.length === 0 ? (
          <EmptyState
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>}
            title="Sin boletos aquí"
            description={boletos.length === 0 ? 'No has comprado boletos todavía.' : 'No tienes boletos en esta sección.'}
            actionLabel="Explorar eventos"
            actionTo="/"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {boletosFiltrados.map((boleto, i) => (
              <div
                key={boleto.idBoleto}
                className={`flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden border transition-all animate-slide-up ${
                  boleto.estado === 'Activo' ? 'border-line shadow-sm hover:shadow-md' : 'border-line opacity-80'
                }`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Info */}
                <div className="p-5 flex-1 border-b sm:border-b-0 sm:border-r border-dashed border-line relative">
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-surface rounded-full hidden sm:block" />
                  <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-surface rounded-full hidden sm:block" />

                  <div className="mb-3"><StatusBadge status={boleto.estado} /></div>

                  <h3 className="text-lg font-display text-dark leading-tight mb-3">
                    {boleto.eventoTitulo}
                  </h3>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <svg className="w-3.5 h-3.5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {boleto.eventoFecha ? `${formatFechaCorta(boleto.eventoFecha)} · ${formatHora(boleto.eventoFecha)} hrs` : 'Fecha por confirmar'}
                    </div>
                    {boleto.ubicacion && (
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <svg className="w-3.5 h-3.5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {boleto.ubicacion}
                      </div>
                    )}
                  </div>
                </div>

                {/* QR + acciones */}
                <div className="bg-surface p-5 flex flex-col items-center justify-center min-w-[160px]">
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Zona</p>
                  <p className="text-base font-bold text-dark mb-3">{boleto.nombreZona}</p>

                  <div className={`p-1.5 bg-white rounded-xl border-2 mb-3 ${
                    boleto.estado === 'Activo' ? 'border-primary' : 'border-line'
                  }`}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${boleto.codigoQR ?? boleto.idBoleto}`}
                      alt="QR"
                      className={`w-24 h-24 ${boleto.estado !== 'Activo' ? 'grayscale opacity-40' : ''}`}
                    />
                  </div>

                  {boleto.estado === 'Activo' && (
                    <button
                      onClick={() => imprimirBoleto(boleto)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Descargar
                    </button>
                  )}

                  <p className="text-[9px] text-muted font-mono truncate w-full text-center px-2 mt-2">
                    {boleto.idBoleto}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}