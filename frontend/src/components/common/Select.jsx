import { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  id,
  options = [],
  error,
  hint,
  placeholder = 'Selecciona una opción...',
  className = '',
  ...props
}, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-dark mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          name={id}
          ref={ref}
          className={[
            'w-full px-4 py-2.5 rounded-xl border bg-white',
            'font-body text-dark appearance-none',
            'transition-all duration-200 outline-none',
            'focus:ring-2 focus:ring-offset-0',
            'pr-10',
            error
              ? 'border-error focus:border-error focus:ring-error/20 bg-error/5'
              : 'border-line focus:border-primary focus:ring-primary/20',
            props.disabled ? 'bg-surface text-muted cursor-not-allowed' : '',
            className,
          ].join(' ')}
          {...props}
        >
          <option value="" disabled hidden>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Chevron */}
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      {error && (
        <p className="text-error text-xs mt-1.5 font-medium flex items-center gap-1 animate-fade-in">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}

      {hint && !error && (
        <p className="text-muted text-xs mt-1.5">{hint}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;