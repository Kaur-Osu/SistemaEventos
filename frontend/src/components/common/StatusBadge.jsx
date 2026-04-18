const configs = {
  // Verificación de usuarios
  Aprobada    : 'bg-success/10 text-success border-success/20',
  Rechazada   : 'bg-error/10 text-error border-error/20',
  Pendiente   : 'bg-warning/10 text-warning border-warning/20',
  Nuevo       : 'bg-surface text-muted border-line',

  // Estados de eventos
  aprobado    : 'bg-success/10 text-success border-success/20',
  pendiente   : 'bg-warning/10 text-warning border-warning/20',
  cancelado   : 'bg-error/10 text-error border-error/20',
  publicado   : 'bg-primary/10 text-primary border-primary/20',
  borrador    : 'bg-surface text-muted border-line',
  realizado   : 'bg-dark/10 text-dark border-dark/20',
  rechazado   : 'bg-error/10 text-error border-error/20',
  suspendido  : 'bg-warning/10 text-warning border-warning/20',

  // Estados de boletos
  Activo      : 'bg-success/10 text-success border-success/20',
  Inactivo    : 'bg-surface text-muted border-line',
  Reserva     : 'bg-warning/10 text-warning border-warning/20',
  Cancelado   : 'bg-error/10 text-error border-error/20',

  // Pagos
  Depositado  : 'bg-success/10 text-success border-success/20',
  Reembolsado : 'bg-error/10 text-error border-error/20',
  Pagado      : 'bg-success/10 text-success border-success/20',
  'No Pagado' : 'bg-warning/10 text-warning border-warning/20',
};

export default function StatusBadge({ status, className = '' }) {
  const style = configs[status] ?? 'bg-surface text-muted border-line';

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
      border capitalize tracking-wide ${style} ${className}
    `}>
      {status}
    </span>
  );
}