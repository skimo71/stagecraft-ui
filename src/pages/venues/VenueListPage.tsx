import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useVenues, useCreateVenue } from '../../hooks/useVenues'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Field, Input } from '../../components/ui/FormField'
import { StatusBadge } from '../../components/StatusBadge'
import { ErrorMessage } from '../../components/ErrorMessage'
import { PageSpinner, EmptyState } from '../../components/ui/Spinner'
import type { CreateVenueBody } from '../../types/venue'

function CreateVenueForm({ onClose }: { onClose: () => void }) {
  const create = useCreateVenue()
  const [form, setForm] = useState<CreateVenueBody>({
    name: '',
    address: '',
    phone: '',
    operatorId: '',
    capacity: 0,
  })

  const set = (key: keyof CreateVenueBody) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: key === 'capacity' ? Number(e.target.value) : e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await create.mutateAsync(form)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Venue Name" id="venueName"><Input id="venueName" value={form.name} onChange={set('name')} required /></Field>
      <Field label="Address" id="venueAddr"><Input id="venueAddr" value={form.address} onChange={set('address')} required /></Field>
      <Field label="Phone" id="venuePhone"><Input id="venuePhone" value={form.phone} onChange={set('phone')} required /></Field>
      <Field label="Operator ID" id="operatorId"><Input id="operatorId" value={form.operatorId} onChange={set('operatorId')} placeholder="UUID" required /></Field>
      <Field label="Capacity" id="capacity"><Input id="capacity" type="number" min={1} value={form.capacity || ''} onChange={set('capacity')} required /></Field>
      <ErrorMessage error={create.error} />
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="sm" type="submit" loading={create.isPending}>Create</Button>
      </div>
    </form>
  )
}

export function VenueListPage() {
  const { data: venues, isLoading, error } = useVenues()
  const [showCreate, setShowCreate] = useState(false)

  if (isLoading) return <PageSpinner />
  if (error) return <ErrorMessage error={error} className="m-6" />

  return (
    <div className="p-4 sm:p-6 max-w-4xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <div className="text-text-muted text-xs tracking-widest uppercase mb-1">&gt;_ Venue Registry</div>
          <h1 className="text-3xl font-display text-accent-amber glow-text-amber tracking-widest">VENUES</h1>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>+ New Venue</Button>
      </div>

      {venues?.length === 0 ? (
        <EmptyState message="NO VENUES" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {venues?.map((venue) => (
            <Link key={venue.venueId} to={`/venues/${venue.venueId}`} className="block group">
              <Card className="hover:border-accent-amber transition-all" style={{ boxShadow: 'none' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-text-primary font-mono font-medium group-hover:text-accent-amber transition-colors">
                      {venue.name}
                    </div>
                    <div className="text-text-muted text-xs mt-1">{venue.address}</div>
                    <div className="text-text-muted text-xs mt-1">
                      Cap: {venue.capacity.toLocaleString()} · {venue.stages.length} stage{venue.stages.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <StatusBadge status={venue.status} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Register New Venue">
        <CreateVenueForm onClose={() => setShowCreate(false)} />
      </Modal>
    </div>
  )
}
