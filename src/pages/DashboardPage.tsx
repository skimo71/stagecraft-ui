import { Link } from 'react-router-dom'
import { useArtists } from '../hooks/useArtists'
import { useVenues } from '../hooks/useVenues'
import { useOffers } from '../hooks/useOffers'
import { useShows } from '../hooks/useShows'
import { Card, CardHeader } from '../components/ui/Card'
import { StatusBadge } from '../components/StatusBadge'
import { format, parseISO } from 'date-fns'

function StatBox({
  label,
  value,
  accent,
  to,
}: {
  label: string
  value: number | string
  accent: string
  to: string
}) {
  return (
    <Link to={to} className="block group">
      <div className="bg-bg-surface border-2 border-border-bright p-4 hover:border-accent-cyan transition-colors group-hover:shadow-glow">
        <div className={`text-4xl font-display ${accent}`}>{value}</div>
        <div className="text-text-muted text-xs uppercase tracking-widest mt-1">{label}</div>
      </div>
    </Link>
  )
}

export function DashboardPage() {
  const { data: artists } = useArtists()
  const { data: venues } = useVenues()
  const { data: offers } = useOffers()
  const { data: shows } = useShows()

  const upcomingShows = shows
    ?.filter((s) => ['Confirmed', 'OnSale'].includes(s.status))
    .sort((a, b) => new Date(a.dateAndTime).getTime() - new Date(b.dateAndTime).getTime())
    .slice(0, 5) ?? []

  const activeOffers = offers?.filter((o) =>
    ['Draft', 'Sent', 'Negotiating'].includes(o.status),
  ) ?? []

  return (
    <div className="p-4 sm:p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <div className="text-text-muted text-xs tracking-widest uppercase mb-1 font-mono">
          &gt;_ System Overview
        </div>
        <h1 className="text-3xl font-display text-accent-cyan glow-text-cyan tracking-widest">
          DASHBOARD
        </h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatBox label="Artists" value={artists?.length ?? '—'} accent="text-accent-cyan glow-text-cyan" to="/artists" />
        <StatBox label="Venues" value={venues?.length ?? '—'} accent="text-accent-amber glow-text-amber" to="/venues" />
        <StatBox label="Active Offers" value={activeOffers.length} accent="text-accent-magenta glow-text-magenta" to="/offers" />
        <StatBox label="Live Shows" value={upcomingShows.length} accent="text-accent-green glow-text-green" to="/shows" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upcoming shows */}
        <Card>
          <CardHeader label="Upcoming Shows" />
          {upcomingShows.length === 0 ? (
            <p className="text-text-muted text-xs py-4 text-center tracking-widest">[ NO UPCOMING SHOWS ]</p>
          ) : (
            <div className="flex flex-col gap-2">
              {upcomingShows.map((show) => (
                <Link
                  key={show.showId}
                  to={`/shows/${show.showId}`}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:text-accent-cyan transition-colors group"
                >
                  <div>
                    <div className="text-sm text-text-primary group-hover:text-accent-cyan transition-colors">
                      {format(parseISO(show.dateAndTime), 'MMM d, yyyy')}
                    </div>
                    <div className="text-xs text-text-muted font-mono">
                      {format(parseISO(show.dateAndTime), 'h:mm a')} · ${show.guaranteedFee.toLocaleString()}
                    </div>
                  </div>
                  <StatusBadge status={show.status} />
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Active offers */}
        <Card>
          <CardHeader label="Active Offers" />
          {activeOffers.length === 0 ? (
            <p className="text-text-muted text-xs py-4 text-center tracking-widest">[ NO ACTIVE OFFERS ]</p>
          ) : (
            <div className="flex flex-col gap-2">
              {activeOffers.slice(0, 5).map((offer) => (
                <Link
                  key={offer.offerId}
                  to={`/offers/${offer.offerId}`}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:text-accent-cyan transition-colors group"
                >
                  <div>
                    <div className="text-xs text-text-muted font-mono">
                      {format(parseISO(offer.currentProposal.dateAndTime), 'MMM d, yyyy')}
                    </div>
                    <div className="text-xs text-text-muted">
                      ${offer.currentProposal.guaranteedFee.toLocaleString()} guarantee
                    </div>
                  </div>
                  <StatusBadge status={offer.status} />
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
