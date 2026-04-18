import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-surface px-4">
      <div className="text-center animate-scale-in">
        <p className="text-8xl font-display text-line mb-4 select-none">404</p>
        <h1 className="text-2xl font-bold text-dark mb-2">Página no encontrada</h1>
        <p className="text-muted text-sm mb-8 max-w-sm mx-auto">
          La página que buscas no existe o fue movida.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}