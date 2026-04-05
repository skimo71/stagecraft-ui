import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  glow?: boolean
}

export function Card({ children, className = '', glow }: CardProps) {
  return (
    <div
      className={[
        'bg-bg-surface border-2 border-border-bright p-4',
        glow ? 'shadow-glow' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  label: string
  children?: ReactNode
}

export function CardHeader({ label, children }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
      <span className="text-accent-amber text-xs uppercase tracking-widest font-display glow-text-amber">
        {label}
      </span>
      {children}
    </div>
  )
}
