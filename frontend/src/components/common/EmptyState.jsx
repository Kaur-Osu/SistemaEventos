import { Link } from 'react-router-dom';
import Button from './Button';

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in ${className}`}>
      {icon && (
        <div className="w-20 h-20 rounded-2xl bg-surface border border-line flex items-center justify-center mb-5 text-muted">
          {icon}
        </div>
      )}

      <h3 className="text-xl font-bold text-dark mb-2">{title}</h3>

      {description && (
        <p className="text-muted text-sm max-w-sm leading-relaxed mb-6">{description}</p>
      )}

      {actionLabel && actionTo && (
        <Link to={actionTo}>
          <Button variant="primary" size="md">{actionLabel}</Button>
        </Link>
      )}

      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}