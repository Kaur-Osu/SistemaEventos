import { useState } from 'react';
import { Link } from 'react-router-dom';
import { themeConfig, categoriaLabels } from '../../config/theme';

export default function EventCard({ evento }) {
  const [imgError, setImgError] = useState(false);

  const fecha = new Date(evento.fecha);
  const dia   = fecha.getDate();
  const mes   = fecha.toLocaleString('es-MX', { month: 'short' }).toUpperCase();
  const hora  = fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  const theme = themeConfig[evento.categoria] || themeConfig.default;

  // Ajuste para aceptar rutas locales y absolutas
  const imgSrc = (() => {
    const url = evento.imagenPortada || evento.imagenUrl;
    if (!url) return null;

    // Si es absoluta (http/https), úsala tal cual
    if (url.startsWith('http')) return url;

    // Si es relativa, concatenar con la base del backend
    const baseUrl = import.meta.env.VITE_API_URL || '';
    return `${baseUrl}${url}`;
  })();

  const precioMin = evento.precioMinimo
    ? `Desde $${parseFloat(evento.precioMinimo).toLocaleString('es-MX')}`
    : null;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-line hover:shadow-xl hover:shadow-dark/5 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">

      {/* Imagen */}
      <div className="relative h-48 w-full bg-surface overflow-hidden flex-shrink-0">
        {!imgError && imgSrc ? (
          <img
            src={imgSrc}
            alt={evento.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-surface">
            <svg className="w-10 h-10 text-line mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted">Sin imagen</span>
          </div>
        )}

        {/* Badge categoría */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${theme.badgeBg} ${theme.badgeText}`}>
            {categoriaLabels[evento.categoria] || evento.categoria}
          </span>
        </div>

        {/* Precio mínimo */}
        {precioMin && (
          <div className="absolute bottom-3 right-3">
            <span className="px-2.5 py-1 text-xs font-bold bg-dark text-white rounded-full">
              {precioMin}
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex gap-3 mb-3">
          {/* Fecha */}
          <div className={`flex flex-col items-center justify-center bg-surface border rounded-xl min-w-[3rem] h-12 flex-shrink-0 ${theme.border}`}>
            <span className={`text-[10px] font-bold uppercase leading-none ${theme.dateText}`}>{mes}</span>
            <span className="text-lg font-display text-dark leading-none mt-0.5">{dia}</span>
          </div>

          <div className="min-w-0">
            <h3 className={`font-bold text-dark text-sm leading-tight line-clamp-2 transition-colors ${theme.hoverTitle}`}>
              {evento.titulo}
            </h3>
            <p className="text-xs text-muted mt-1 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {hora} hrs
            </p>
          </div>
        </div>

        <p className="text-xs text-muted flex items-start gap-1.5 mb-4 flex-grow line-clamp-2">
          <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {evento.ubicacion}
        </p>

        <Link
          to={`/evento/${evento.idEvento}`}
          className={`w-full block text-center py-2 text-sm font-semibold rounded-xl border border-line bg-surface text-dark transition-all duration-300 ${theme.btnHover}`}
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}
