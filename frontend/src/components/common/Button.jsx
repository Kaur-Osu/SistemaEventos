import { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconRight,
  className = '',
  disabled,
  ...props
}, ref) => {

  const base = [
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl',
    'transition-all duration-200 ease-out',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'active:scale-[0.97]',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
    'select-none',
  ].join(' ');

  const variants = {
    primary  : 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 focus-visible:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/25 focus-visible:ring-secondary',
    success  : 'bg-success text-white hover:bg-success/90 hover:shadow-lg hover:shadow-success/25 focus-visible:ring-success',
    danger   : 'bg-error text-white hover:bg-error/90 hover:shadow-lg hover:shadow-error/25 focus-visible:ring-error',
    warning  : 'bg-warning text-dark hover:bg-warning/90 hover:shadow-lg hover:shadow-warning/25 focus-visible:ring-warning',
    outline  : 'bg-white border-2 border-line text-muted hover:border-primary hover:text-primary hover:bg-primary/5 focus-visible:ring-primary',
    ghost    : 'bg-transparent text-muted hover:bg-surface hover:text-dark focus-visible:ring-line',
    dark     : 'bg-dark text-white hover:bg-dark/90 hover:shadow-lg focus-visible:ring-dark',
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin-slow h-4 w-4 text-current"
          fill="none" viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        icon && <span className="flex-shrink-0 w-4 h-4">{icon}</span>
      )}
      {children}
      {!isLoading && iconRight && (
        <span className="flex-shrink-0 w-4 h-4">{iconRight}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;