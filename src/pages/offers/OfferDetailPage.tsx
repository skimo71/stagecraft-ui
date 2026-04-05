import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  useOffer,
  useSendOffer,
  useAddProposal,
  useAcceptOffer,
  useRejectOffer,
  useExpireOffer,
} from '../../hooks/useOffers'
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
import type { AddProposalBody } from '../../types/offer'

const OFFER_STEPS = ['Draft', 'Sent', 'Negotiating', 'Accepted']
const OFFER_TERMINALS = ['Rejected', 'Expired']

function AddProposalForm({ offerId, onClose }: { offerId: string; onClose: () => void }) {
  const addProposal = useAddProposal()
  const { data: venues } = useVenues()
  const [form, setForm] = useState<AddProposalBody>({ venueId: '', dateAndTime: '', guaranteedFee: 0 })

  const set = (key: keyof AddProposalBody) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: key === 'guaranteedFee' ? Number((e as React.ChangeEvent<HTMLInputElement>).target.value) : e.target.value }))

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        await addProposal.mutateAsync({ id: offerId, body: form })
        onClose()
      }}
      className="flex flex-col gap-4"
    >
      <Field label="Venue" id="pVenueId">
        <Select id="pVenueId" value={form.venueId} onChange={set('venueId')} required>
          <option value="">-- Select Venue --</option>
          {venues?.map((v) => <option key={v.venueId} value={v.venueId}>{v.name}</option>)}
        </Select>
      </Field>
      <Field label="Date & Time" id="pDate">
        <Input id="pDate" type="datetime-local" value={form.dateAndTime} onChange={set('dateAndTime')} required />
      </Field>
      <Field label="Guaranteed Fee ($)" id="pFee">
        <Input id="pFee" type="number" min={0} step="100" value={form.guaranteedFee || ''} onChange={set('guaranteedFee')} required />
      </Field>
      <ErrorMessage error={addProposal.error} />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="sm" type="submit" loading={addProposal.isPending}>Submit Proposal</Button>
      </div>
    </form>
  )
}

function RejectForm({ offerId, onClose }: { offerId: string; onClose: () => void }) {
  const reject = useRejectOffer()
  const [reason, setReason] = useState('')

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        await reject.mutateAsync({ id: offerId, body: { reason: reason || undefined } })
        onClose()
      }}
      className="flex flex-col gap-4"
    >
      <Field label="Reason (optional)" id="rejectReason">
        <Textarea id="rejectReason" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Why is this offer being rejected?" />
      </Field>
      <ErrorMessage error={reject.error} />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="danger" size="sm" type="submit" loading={reject.isPending}>Reject Offer</Button>
      </div>
    </form>
  )
}

export function OfferDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: offer, isLoading, error } = useOffer(id!)
  const { data: artists } = useArtists()
  const { data: venues } = useVenues()
  const send = useSendOffer()
  const accept = useAcceptOffer()
  const expire = useExpireOffer()
  const [showAddProposal, setShowAddProposal] = useState(false)
  const [showReject, setShowReject] = useState(false)

  if (isLoading) return <PageSpinner />
  if (error) return <ErrorMessage error={error} className="m-6" />
  if (!offer) return null

  const artist = artists?.find((a) => a.artistId === offer.artistId)
  const venue = venues?.find((v) => v.venueId === offer.currentProposal.venueId)

  const isActive = ['Draft', 'Sent', 'Negotiating'].includes(offer.status)
  const timelineSteps = [...OFFER_STEPS, ...OFFER_TERMINALS.includes(offer.status) ? [offer.status] : []]

  return (
    <div className="p-4 sm:p-6 max-w-3xl">
      <div className="text-text-muted text-xs font-mono mb-4">
        <Link to="/offers" className="hover:text-accent-magenta transition-colors">&gt;_ offers</Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary font-mono">{id?.slice(0, 8)}...</span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-4">
        <div>
          <div className="text-text-muted text-xs tracking-widest uppercase mb-1">&gt;_ Offer Detail</div>
          <h1 className="text-3xl font-display text-accent-magenta glow-text-magenta tracking-widest">OFFER</h1>
        </div>
        <StatusBadge status={offer.status} />
      </div>

      {/* Timeline */}
      <Card className="mb-4">
        <StatusTimeline
          steps={OFFER_TERMINALS.includes(offer.status) ? [...OFFER_STEPS.slice(0, -1), offer.status] : OFFER_STEPS}
          current={offer.status}
          terminal={OFFER_TERMINALS}
        />
      </Card>

      {/* Action bar */}
      {isActive && (
        <div className="flex flex-wrap gap-2 mb-4">
          {offer.status === 'Draft' && (
            <Button
              variant="primary"
              size="sm"
              loading={send.isPending}
              onClick={() => send.mutate(id!)}
            >
              Send Offer
            </Button>
          )}
          {['Sent', 'Negotiating'].includes(offer.status) && (
            <>
              <Button variant="secondary" size="sm" onClick={() => setShowAddProposal(true)}>
                Add Proposal
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={accept.isPending}
                onClick={() => accept.mutate(id!)}
              >
                Accept
              </Button>
              <Button variant="danger" size="sm" onClick={() => setShowReject(true)}>
                Reject
              </Button>
              <Button
                variant="ghost"
                size="sm"
                loading={expire.isPending}
                onClick={() => expire.mutate(id!)}
              >
                Expire
              </Button>
            </>
          )}
          <ErrorMessage error={send.error ?? accept.error ?? expire.error} className="w-full" />
        </div>
      )}

      {/* Current proposal */}
      <Card className="mb-4">
        <CardHeader label="Current Proposal" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-text-muted text-xs uppercase tracking-wider">Venue</div>
            <div className="text-text-primary mt-0.5">{venue?.name ?? offer.currentProposal.venueId.slice(0, 8)}</div>
          </div>
          <div>
            <div className="text-text-muted text-xs uppercase tracking-wider">Artist</div>
            <div className="text-text-primary mt-0.5">{artist?.bandName ?? offer.artistId.slice(0, 8)}</div>
          </div>
          <div>
            <div className="text-text-muted text-xs uppercase tracking-wider">Date</div>
            <div className="text-text-primary mt-0.5">
              {format(parseISO(offer.currentProposal.dateAndTime), 'MMM d, yyyy · h:mm a')}
            </div>
          </div>
          <div>
            <div className="text-text-muted text-xs uppercase tracking-wider">Guarantee</div>
            <div className="text-accent-green glow-text-green mt-0.5">
              ${offer.currentProposal.guaranteedFee.toLocaleString()}
            </div>
          </div>
        </div>
      </Card>

      {/* Proposal history */}
      {offer.proposals.length > 1 && (
        <Card>
          <CardHeader label={`Proposal History (${offer.proposals.length})`} />
          <div className="flex flex-col gap-2">
            {offer.proposals.map((p, i) => (
              <div key={p.proposalId} className={['flex items-center justify-between py-2 border-b border-border last:border-0 text-sm', i === 0 ? 'opacity-40' : ''].join(' ')}>
                <span className="text-text-muted text-xs">#{i + 1}</span>
                <span className="text-text-primary">{format(parseISO(p.dateAndTime), 'MMM d, yyyy')}</span>
                <span className="text-text-muted">${p.guaranteedFee.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal open={showAddProposal} onClose={() => setShowAddProposal(false)} title="Add Counter-Proposal">
        <AddProposalForm offerId={id!} onClose={() => setShowAddProposal(false)} />
      </Modal>
      <Modal open={showReject} onClose={() => setShowReject(false)} title="Reject Offer">
        <RejectForm offerId={id!} onClose={() => setShowReject(false)} />
      </Modal>
    </div>
  )
}
