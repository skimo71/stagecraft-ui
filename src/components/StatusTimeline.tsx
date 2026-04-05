interface StatusTimelineProps {
  steps: string[]
  current: string
  terminal?: string[]
}

export function StatusTimeline({ steps, current, terminal = [] }: StatusTimelineProps) {
  const currentIndex = steps.indexOf(current)
  const isTerminal = terminal.includes(current)

  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-1">
      {steps.map((step, i) => {
        const isPast = currentIndex > i
        const isCurrent = currentIndex === i
        const isCurrentTerminal = isCurrent && isTerminal

        return (
          <div key={step} className="flex items-center min-w-0">
            <div className="flex flex-col items-center">
              <div
                className={[
                  'w-6 h-6 flex items-center justify-center border-2 text-xs font-mono transition-all',
                  isPast
                    ? 'bg-accent-green border-accent-green text-text-inverse'
                    : isCurrent && !isCurrentTerminal
                      ? 'border-accent-cyan text-accent-cyan shadow-glow animate-pulse'
                      : isCurrentTerminal
                        ? 'border-accent-red text-accent-red'
                        : 'border-border text-text-muted',
                ].join(' ')}
              >
                {isPast ? '✓' : isCurrent ? '●' : '○'}
              </div>
              <span
                className={[
                  'text-xs mt-1 whitespace-nowrap tracking-wide',
                  isPast
                    ? 'text-accent-green'
                    : isCurrent && !isCurrentTerminal
                      ? 'text-accent-cyan glow-text-cyan'
                      : isCurrentTerminal
                        ? 'text-accent-red'
                        : 'text-text-muted',
                ].join(' ')}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={[
                  'h-px w-6 mx-1 border-t-2 mb-4',
                  isPast ? 'border-accent-green' : 'border-dashed border-border',
                ].join(' ')}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
