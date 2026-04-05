const statusColors: Record<string, string> = {
  // Offer statuses
  Draft: 'border-border-bright text-text-muted',
  Sent: 'border-blue-400 text-blue-400',
  Negotiating: 'border-accent-amber text-accent-amber glow-text-amber',
  Accepted: 'border-accent-green text-accent-green glow-text-green',
  Rejected: 'border-accent-red text-accent-red',
  Expired: 'border-border-bright text-text-muted',
  // Show statuses
  Confirmed: 'border-blue-400 text-blue-400',
  OnSale: 'border-accent-green text-accent-green glow-text-green',
  ReadyForSettlement: 'border-accent-amber text-accent-amber glow-text-amber',
  Settled: 'border-border-bright text-text-muted',
  Cancelled: 'border-accent-red text-accent-red',
  // ShowEvent statuses
  Preparing: 'border-border-bright text-text-muted',
  LoadIn: 'border-blue-400 text-blue-400',
  DoorsOpen: 'border-accent-green text-accent-green glow-text-green',
  ShowStarted: 'border-accent-cyan text-accent-cyan glow-text-cyan',
  ShowCompleted: 'border-accent-amber text-accent-amber glow-text-amber',
  LoadOut: 'border-blue-400 text-blue-400',
  Closed: 'border-border-bright text-text-muted',
  // Ticketing statuses
  Open: 'border-accent-green text-accent-green glow-text-green',
  SoldOut: 'border-accent-magenta text-accent-magenta glow-text-magenta',
  // Artist/Venue statuses
  Active: 'border-accent-green text-accent-green',
  Inactive: 'border-border-bright text-text-muted',
}

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors = statusColors[status] ?? 'border-border-bright text-text-muted'
  return (
    <span
      className={[
        'inline-flex items-center border px-2 py-0.5 text-xs font-mono tracking-wider uppercase',
        colors,
      ].join(' ')}
    >
      {status}
    </span>
  )
}
