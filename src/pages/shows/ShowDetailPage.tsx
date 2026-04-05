import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  useShow,
  useOpenTicketSales,
  useCancelShow,
  useCompleteShow,
  useSettleShow,
} from '../../hooks/useShows'
import { useArtists } from '../../hooks/useArtists'
import { useVenues } from '../../hooks/useVenues'
import { Card, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Field, Input, Select, Textarea } from '../../components/ui/FormField'
import { StatusBadge } from '../../components/StatusBadge'
import { StatusTimeline } from '../../components/StatusTimeline'
import { ErrorMessage } from '../../components/ErrorMessage'
import { PageSpinner } from '../../components/ui/Spinner'
import { format, parseISO } from 'date-fns'
import type { OpenTicketSalesBody, CancelShowBody, CompleteShowBody, TicketTier, CancelledBy } from '../../types/show'

const SHOW_STEPS = ['Confirmed', 'OnSale', 'ReadyForSettlement', 'Settled']
const SHOW_TERMINALS = ['Cancelled']

// ── Open Ticket Sales Form ────────────────────────────────────────────────────

function OpenTicketSalesForm({ showId, onClose }: { showId: string; onClose: () => void }) {
  const openSales = useOpenTicketSales(showId)
  const [totalCapacity, setTotalCapacity] = useState(0)
  const [ticketingCompanyId, setTicketingCompanyId] = useState('')
  const [tiers, setTiers] = useState<TicketTier[]>([{ name: 'General Admission', price: 0, capacity: 0 }])

  const addTier = () => setTiers((t) => [...t, { name: '', price: 0, capacity: 0 }])
  const removeTier = (i: number) => setTiers((t) => t.filter((_, idx) => idx !== i))
  const setTier = (i: number, key: keyof TicketTier, value: string | number) =>
    setTiers((t) => t.map((tier, idx) => idx === i ? { ...tier, [key]: value } : tier))

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const body: OpenTicketSalesBody = { totalCapacity, tiers, ticketingCompanyId }
        await openSales.mutateAsync(body)
        onClose()
      }}
      className="flex flex-col gap-4"
    >
      <Field label="Total Capacity" id="totalCap">
        <Input id="totalCap" type="number" min={1} value={totalCapacity || ''} onChange={(e) => setTotalCapacity(Number(e.target.value))} required />
      </Field>
      <Field label="Ticketing Company ID" id="tcId">
        <Input id="tcId" value={ticketingCompanyId} onChange={(e) => setTicketingCompanyId(e.target.value)} required placeholder="e.g. tc-001" />
      </Field>

      <div>
        <div className="text-accent-amber text-xs uppercase tracking-widest font-display mb-2">Ticket Tiers</div>
        <div className="flex flex-col gap-3">
          {tiers.map((tier, i) => (
            <div key={i} className="border border-border p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-text-muted text-xs">Tier {i + 1}</span>
                {tiers.length > 1 && (
                  <button type="button" onClick={() => removeTier(i)} className="text-accent-red text-xs hover:underline">Remove</button>
                )}
              </div>
              <Field label="Name" id={`tier-name-${i}`}>
                <Input id={`tier-name-${i}`} value={tier.name} onChange={(e) => setTier(i, 'name', e.target.value)} required />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Field label="Price ($)" id={`tier-price-${i}`}>
                  <Input id={`tier-price-${i}`} type="number" min={0} step="0.01" value={tier.price || ''} onChange={(e) => setTier(i, 'price', Number(e.target.value))} required />
                </Field>
                <Field label="Capacity" id={`tier-cap-${i}`}>
                  <Input id={`tier-cap-${i}`} type="number" min={1} value={tier.capacity || ''} onChange={(e) => setTier(i, 'capacity', Number(e.target.value))} required />
                </Field>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addTier} className="mt-2 text-accent-cyan text-xs hover:underline">+ Add Tier</button>
      </div>

      <ErrorMessage error={openSales.error} />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="sm" type="submit" loading={openSales.isPending}>Open Sales</Button>
      </div>
    </form>
  )
}

// ── Complete Show Form ────────────────────────────────────────────────────────

function CompleteShowForm({ showId, onClose }: { showId: string; onClose: () => void }) {
  const complete = useCompleteShow(showId)
  const [durationMinutes, setDurationMinutes] = useState(90)

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const body: CompleteShowBody = { durationMinutes }
        await complete.mutateAsync(body)
        onClose()
      }}
      className="flex flex-col gap-4"
    >
      <Field label="Duration (minutes)" id="duration">
        <Input id="duration" type="number" min={1} value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))} required />
      </Field>
      <ErrorMessage error={complete.error} />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="sm" type="submit" loading={complete.isPending}>Mark Complete</Button>
      </div>
    </form>
  )
}

// ── Cancel Show Form ──────────────────────────────────────────────────────────

function CancelShowForm({ showId, onClose }: { showId: string; onClose: () => void }) {
  const cancel = useCancelShow(showId)
  const [form, setForm] = useState<CancelShowBody>({ cancelledBy: 'Promoter', reason: '' })

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        await cancel.mutateAsync(form)
        onClose()
      }}
      className="flex flex-col gap-4"
    >
      <Field label="Cancelled By" id="cancelledBy">
        <Select
          id="cancelledBy"
          value={form.cancelledBy}
          onChange={(e) => setForm((f) => ({ ...f, cancelledBy: e.target.value as CancelledBy }))}
          required
        >
          <option value="Promoter">Promoter</option>
          <option value="Artist">Artist</option>
          <option value="Venue">Venue</option>
        </Select>
      </Field>
      <Field label="Reason" id="cancelReason">
        <Textarea id="cancelReason" value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} rows={3} required placeholder="Why is this show being cancelled?" />
      </Field>
      <ErrorMessage error={cancel.error} />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="danger" size="sm" type="submit" loading={cancel.isPending}>Cancel Show</Button>
      </div>
    </form>
  )
}

// ── Show Detail Page ──────────────────────────────────────────────────────────

export function ShowDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: show, isLoading, error } = useShow(id!)
  const { data: artists } = useArtists()
  const { data: venues } = useVenues()
  const settle = useSettleShow(id!)

  const [showOpenSales, setShowOpenSales] = useState(false)
  const [showComplete, setShowComplete] = useState(false)
  const [showCancel, setShowCancel] = useState(false)

  if (isLoading) return <PageSpinner />
  if (error) return <ErrorMessage error={error} className="m-6" />
  if (!show) return null

  const artist = artists?.find((a) => a.artistId === show.artistId)
  const venue = venues?.find((v) => v.venueId === show.venueId)

  const isCancelled = show.status === 'Cancelled'
  const timelineSteps = isCancelled
    ? [...SHOW_STEPS.slice(0, SHOW_STEPS.indexOf('Settled')), 'Cancelled']
    : SHOW_STEPS

  return (
    <div className="p-4 sm:p-6 max-w-3xl">
      {/* Breadcrumb */}
      <div className="text-text-muted text-xs font-mono mb-4">
        <Link to="/shows" className="hover:text-accent-green transition-colors">&gt;_ shows</Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary font-mono">{id?.slice(0, 8)}...</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-4">
        <div>
          <div className="text-text-muted text-xs tracking-widest uppercase mb-1">&gt;_ Show Detail</div>
          <h1 className="text-3xl font-display text-accent-green glow-text-green tracking-widest">SHOW</h1>
        </div>
        <StatusBadge status={show.status} />
      </div>

      {/* Timeline */}
      <Card className="mb-4">
        <StatusTimeline
          steps={timelineSteps}
          current={show.status}
          terminal={SHOW_TERMINALS}
        />
      </Card>

      {/* Action bar */}
      {!['Settled', 'Cancelled'].includes(show.status) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {show.status === 'Confirmed' && (
            <Button variant="primary" size="sm" onClick={() => setShowOpenSales(true)}>
              Open Ticket Sales
            </Button>
          )}
          {show.status === 'OnSale' && (
            <Button variant="primary" size="sm" onClick={() => setShowComplete(true)}>
              Complete Show
            </Button>
          )}
          {show.status === 'ReadyForSettlement' && (
            <Button variant="primary" size="sm" loading={settle.isPending} onClick={() => settle.mutate()}>
              Settle Show
            </Button>
          )}
          {['Confirmed', 'OnSale'].includes(show.status) && (
            <Button variant="danger" size="sm" onClick={() => setShowCancel(true)}>
              Cancel Show
            </Button>
          )}
          <ErrorMessage error={settle.error} className="w-full" />
        </div>
      )}

      {/* Show details */}
      <Card className="mb-4">
        <CardHeader label="Show Details" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-text-muted text-xs uppercase tracking-wider">Artist</div>
            <div className="text-text-primary mt-0.5">
              {artist ? (
                <Link to={`/artists/${show.artistId}`} className="hover:text-accent-cyan transition-colors">
                  {artist.bandName}
                </Link>
              ) : show.artistId.slice(0, 8)}
            </div>
          </div>
          <div>
            <div className="text-text-muted text-xs uppercase tracking-wider">Venue</div>
            <div className="text-text-primary mt-0.5">
              {venue ? (
                <Link to={`/venues/${show.venueId}`} className="hover:text-accent-cyan transition-colors">
                  {venue.name}
                </Link>
              ) : show.venueId.slice(0, 8)}
            </div>
          </div>
          <div>
            <div className="text-text-muted text-xs uppercase tracking-wider">Date & Time</div>
            <div className="text-text-primary mt-0.5">
              {format(parseISO(show.dateAndTime), 'MMM d, yyyy · h:mm a')}
            </div>
          </div>
          <div>
            <div className="text-text-muted text-xs uppercase tracking-wider">Guarantee</div>
            <div className="text-accent-green glow-text-green mt-0.5">
              ${show.guaranteedFee.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-text-muted text-xs uppercase tracking-wider">Offer</div>
            <div className="text-text-primary mt-0.5">
              <Link to={`/offers/${show.offerId}`} className="hover:text-accent-magenta transition-colors font-mono text-xs">
                {show.offerId.slice(0, 8)}...
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* Modals */}
      <Modal open={showOpenSales} onClose={() => setShowOpenSales(false)} title="Open Ticket Sales">
        <OpenTicketSalesForm showId={id!} onClose={() => setShowOpenSales(false)} />
      </Modal>
      <Modal open={showComplete} onClose={() => setShowComplete(false)} title="Complete Show">
        <CompleteShowForm showId={id!} onClose={() => setShowComplete(false)} />
      </Modal>
      <Modal open={showCancel} onClose={() => setShowCancel(false)} title="Cancel Show">
        <CancelShowForm showId={id!} onClose={() => setShowCancel(false)} />
      </Modal>
    </div>
  )
}
