export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <svg
      className={`animate-spin-slow text-primary ${sizes[size] ?? sizes.md} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-80"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// Pantalla completa de carga
export function LoadingScreen({ mensaje = 'Cargando...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-muted text-sm font-medium animate-pulse-soft">{mensaje}</p>
    </div>
  );
}