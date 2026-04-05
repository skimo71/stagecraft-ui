import { Link } from 'react-router-dom'
import { useShows } from '../../hooks/useShows'
import { Card } from '../../components/ui/Card'
import { StatusBadge } from '../../components/StatusBadge'
import { ErrorMessage } from '../../components/ErrorMessage'
import { PageSpinner, EmptyState } from '../../components/ui/Spinner'
import { format, parseISO } from 'date-fns'

export function ShowListPage() {
  const { data: shows, isLoading, error } = useShows()

  if (isLoading) return <PageSpinner />
  if (error) return <ErrorMessage error={error} className="m-6" />

  const groups = {
    upcoming: shows?.filter((s) => ['Confirmed', 'OnSale'].includes(s.status)) ?? [],
    past: shows?.filter((s) => ['ReadyForSettlement', 'Settled', 'Cancelled'].includes(s.status)) ?? [],
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl">
      <div className="mb-6">
        <div className="text-text-muted text-xs tracking-widest uppercase mb-1">&gt;_ Show Management</div>
        <h1 className="text-3xl font-display text-accent-green glow-text-green tracking-widest">SHOWS</h1>
        <p className="text-text-muted text-xs mt-1">Shows are created automatically when an offer is accepted.</p>
      </div>

      {shows?.length === 0 ? (
        <EmptyState message="NO SHOWS" />
      ) : (
        <div className="flex flex-col gap-6">
          {groups.upcoming.length > 0 && (
            <div>
              <div className="text-accent-green text-xs uppercase tracking-widest mb-2 glow-text-green">Active</div>
              <div className="flex flex-col gap-2">
                {groups.upcoming.map((show) => (
                  <Link key={show.showId} to={`/shows/${show.showId}`} className="block group">
                    <Card className="hover:border-accent-green transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-text-primary text-sm group-hover:text-accent-green transition-colors">
                            {format(parseISO(show.dateAndTime), 'MMM d, yyyy · h:mm a')}
                          </div>
                          <div className="text-text-muted text-xs mt-0.5">
                            ${show.guaranteedFee.toLocaleString()} guarantee
                          </div>
                        </div>
                        <StatusBadge status={show.status} />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {groups.past.length > 0 && (
            <div>
              <div className="text-text-muted text-xs uppercase tracking-widest mb-2">Past</div>
              <div className="flex flex-col gap-2">
                {groups.past.map((show) => (
                  <Link key={show.showId} to={`/shows/${show.showId}`} className="block group">
                    <Card className="opacity-60 hover:opacity-100 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="text-text-muted text-sm">
                          {format(parseISO(show.dateAndTime), 'MMM d, yyyy')}
                          <span className="ml-2 text-xs">${show.guaranteedFee.toLocaleString()}</span>
                        </div>
                        <StatusBadge status={show.status} />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
