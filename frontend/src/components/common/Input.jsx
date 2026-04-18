import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  id,
  type = 'text',
  placeholder,
  error,
  hint,
  icon,
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
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4 flex-shrink-0">
            {icon}
          </span>
        )}
        <input
          id={id}
          name={id}
          type={type}
          ref={ref}
          placeholder={placeholder}
          className={[
            'w-full py-2.5 rounded-xl border bg-white',
            'font-body text-dark placeholder:text-muted/60',
            'transition-all duration-200 outline-none',
            'focus:ring-2 focus:ring-offset-0',
            icon ? 'pl-10 pr-4' : 'px-4',
            error
              ? 'border-error focus:border-error focus:ring-error/20 bg-error/5'
              : 'border-line focus:border-primary focus:ring-primary/20',
            props.disabled ? 'bg-surface text-muted cursor-not-allowed' : '',
            className,
          ].join(' ')}
          {...props}
        />
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

Input.displayName = 'Input';
export default Input;