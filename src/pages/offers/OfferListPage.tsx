import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOffers, useCreateOffer } from '../../hooks/useOffers'
import { useArtists } from '../../hooks/useArtists'
import { useVenues } from '../../hooks/useVenues'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Field, Input, Select } from '../../components/ui/FormField'
import { StatusBadge } from '../../components/StatusBadge'
import { ErrorMessage } from '../../components/ErrorMessage'
import { PageSpinner, EmptyState } from '../../components/ui/Spinner'
import { format, parseISO } from 'date-fns'
import type { CreateOfferBody } from '../../types/offer'

function CreateOfferForm({ onClose }: { onClose: () => void }) {
  const create = useCreateOffer()
  const { data: artists } = useArtists()
  const { data: venues } = useVenues()
  const [form, setForm] = useState<CreateOfferBody>({
    promoterId: '',
    artistId: '',
    venueId: '',
    dateAndTime: '',
    guaranteedFee: 0,
  })

  const set = (key: keyof CreateOfferBody) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: key === 'guaranteedFee' ? Number((e as React.ChangeEvent<HTMLInputElement>).target.value) : e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await create.mutateAsync(form)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Promoter ID" id="promoterId">
        <Input id="promoterId" value={form.promoterId} onChange={set('promoterId')} placeholder="UUID" required />
      </Field>
      <Field label="Artist" id="artistId">
        <Select id="artistId" value={form.artistId} onChange={set('artistId')} required>
          <option value="">-- Select Artist --</option>
          {artists?.map((a) => <option key={a.artistId} value={a.artistId}>{a.bandName}</option>)}
        </Select>
      </Field>
      <Field label="Venue" id="venueId">
        <Select id="venueId" value={form.venueId} onChange={set('venueId')} required>
          <option value="">-- Select Venue --</option>
          {venues?.map((v) => <option key={v.venueId} value={v.venueId}>{v.name}</option>)}
        </Select>
      </Field>
      <Field label="Date & Time" id="dateAndTime">
        <Input id="dateAndTime" type="datetime-local" value={form.dateAndTime} onChange={set('dateAndTime')} required />
      </Field>
      <Field label="Guaranteed Fee ($)" id="fee">
        <Input id="fee" type="number" min={0} step="100" value={form.guaranteedFee || ''} onChange={set('guaranteedFee')} required />
      </Field>
      <ErrorMessage error={create.error} />
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="sm" type="submit" loading={create.isPending}>Create Offer</Button>
      </div>
    </form>
  )
}

export function OfferListPage() {
  const { data: offers, isLoading, error } = useOffers()
  const [showCreate, setShowCreate] = useState(false)

  if (isLoading) return <PageSpinner />
  if (error) return <ErrorMessage error={error} className="m-6" />

  const groups = {
    active: offers?.filter((o) => ['Draft', 'Sent', 'Negotiating'].includes(o.status)) ?? [],
    terminal: offers?.filter((o) => ['Accepted', 'Rejected', 'Expired'].includes(o.status)) ?? [],
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <div className="text-text-muted text-xs tracking-widest uppercase mb-1">&gt;_ Offer Management</div>
          <h1 className="text-3xl font-display text-accent-magenta glow-text-magenta tracking-widest">OFFERS</h1>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>+ New Offer</Button>
      </div>

      {offers?.length === 0 ? (
        <EmptyState message="NO OFFERS" />
      ) : (
        <div className="flex flex-col gap-6">
          {groups.active.length > 0 && (
            <div>
              <div className="text-accent-amber text-xs uppercase tracking-widest mb-2 glow-text-amber">Active</div>
              <div className="flex flex-col gap-2">
                {groups.active.map((offer) => (
                  <Link key={offer.offerId} to={`/offers/${offer.offerId}`} className="block group">
                    <Card className="hover:border-accent-magenta transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-text-primary text-sm group-hover:text-accent-magenta transition-colors">
                            {format(parseISO(offer.currentProposal.dateAndTime), 'MMM d, yyyy · h:mm a')}
                          </div>
                          <div className="text-text-muted text-xs mt-0.5">
                            ${offer.currentProposal.guaranteedFee.toLocaleString()} guarantee
                            · {offer.proposals.length} proposal{offer.proposals.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <StatusBadge status={offer.status} />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {groups.terminal.length > 0 && (
            <div>
              <div className="text-text-muted text-xs uppercase tracking-widest mb-2">Closed</div>
              <div className="flex flex-col gap-2">
                {groups.terminal.map((offer) => (
                  <Link key={offer.offerId} to={`/offers/${offer.offerId}`} className="block group">
                    <Card className="opacity-60 hover:opacity-100 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="text-text-muted text-sm">
                          {format(parseISO(offer.currentProposal.dateAndTime), 'MMM d, yyyy')}
                          <span className="ml-2 text-xs">${offer.currentProposal.guaranteedFee.toLocaleString()}</span>
                        </div>
                        <StatusBadge status={offer.status} />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create New Offer">
        <CreateOfferForm onClose={() => setShowCreate(false)} />
      </Modal>
    </div>
  )
}
