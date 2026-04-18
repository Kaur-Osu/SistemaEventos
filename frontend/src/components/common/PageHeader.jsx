export default function PageHeader({
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-slide-up ${className}`}>
      <div>
        <h1 className="text-3xl font-display text-dark tracking-wide">{title}</h1>
        {description && (
          <p className="text-muted mt-1 text-sm">{description}</p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">{action}</div>
      )}
    </div>
  );
}