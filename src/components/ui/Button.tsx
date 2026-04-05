import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'border-2 border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-text-inverse shadow-glow hover:shadow-glow',
  secondary:
    'border-2 border-border-bright text-text-primary hover:border-accent-cyan hover:text-accent-cyan',
  danger:
    'border-2 border-accent-magenta text-accent-magenta hover:bg-accent-magenta hover:text-text-inverse shadow-glow-magenta',
  ghost: 'border border-border text-text-muted hover:text-text-primary hover:border-border-bright',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', loading, disabled, children, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          'font-mono font-medium tracking-widest uppercase transition-all duration-150',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none',
          'focus:outline-none focus:ring-1 focus:ring-accent-cyan focus:ring-offset-1 focus:ring-offset-bg-base',
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(' ')}
        {...props}
      >
        {loading ? <LoadingIndicator /> : children}
      </button>
    )
  },
)
Button.displayName = 'Button'

function LoadingIndicator() {
  return <span className="inline-flex items-center gap-1">
    <span className="animate-blink">|</span>
    <span>processing</span>
  </span>
}
