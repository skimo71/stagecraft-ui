interface ErrorMessageProps {
  error: unknown
  className?: string
}

export function ErrorMessage({ error, className = '' }: ErrorMessageProps) {
  if (!error) return null
  const message = error instanceof Error ? error.message : 'An error occurred'
  return (
    <div
      className={[
        'border border-accent-red text-accent-red text-xs font-mono px-3 py-2 bg-accent-red/5',
        className,
      ].join(' ')}
    >
      <span className="text-accent-red mr-2">!</span>
      {message}
    </div>
  )
}
