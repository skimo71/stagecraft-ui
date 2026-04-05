const frames = ['|', '/', '—', '\\']

export function Spinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-text-muted text-sm font-mono">
      <SpinnerIcon />
      <span>{label}</span>
    </div>
  )
}

export function SpinnerIcon() {
  // CSS animation cycling through ASCII frames via content
  return (
    <span
      className="text-accent-cyan glow-text-cyan"
      style={{ animation: 'spin-ascii 0.6s steps(4) infinite' }}
    >
      <style>{`
        @keyframes spin-ascii {
          0%   { content: '|'; }
          25%  { content: '/'; }
          50%  { content: '—'; }
          75%  { content: '\\\\'; }
        }
      `}</style>
      <AsciiSpinner />
    </span>
  )
}

function AsciiSpinner() {
  // Uses CSS animation via keyframes defined in index.css
  return <span className="inline-block animate-spin" style={{ animationDuration: '1s', animationTimingFunction: 'steps(1)' }}>|</span>
}

export function PageSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-text-muted">
      <div className="text-accent-cyan text-3xl font-display glow-text-cyan animate-pulse">
        [ LOADING ]
      </div>
      <p className="text-xs tracking-widest uppercase">Fetching data...</p>
    </div>
  )
}

export function EmptyState({ message = 'NO DATA' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-text-muted font-mono">
      <pre className="text-accent-cyan text-xs glow-text-cyan opacity-60 leading-tight">{`
┌─────────────────────┐
│                     │
│    [ ${message.padEnd(13)} ]  │
│                     │
└─────────────────────┘`}</pre>
    </div>
  )
}
