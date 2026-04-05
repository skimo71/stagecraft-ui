import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  useVenue,
  useAddStage,
  useAddSection,
  useAddAvailability,
  useAddRestriction,
} from '../../hooks/useVenues'
import { Card, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Field, Input } from '../../components/ui/FormField'
import { StatusBadge } from '../../components/StatusBadge'
import { ErrorMessage } from '../../components/ErrorMessage'
import { PageSpinner } from '../../components/ui/Spinner'
import { format, parseISO } from 'date-fns'
import type { AddStageBody, AddSectionBody, AddAvailabilityBody, AddRestrictionBody } from '../../types/venue'

export function VenueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: venue, isLoading, error } = useVenue(id!)
  const addStage = useAddStage(id!)
  const addSection = useAddSection(id!)
  const addAvailability = useAddAvailability(id!)
  const addRestriction = useAddRestriction(id!)

  const [showAddStage, setShowAddStage] = useState(false)
  const [showAddAvailability, setShowAddAvailability] = useState(false)
  const [showAddRestriction, setShowAddRestriction] = useState(false)
  const [addingSectionForStage, setAddingSectionForStage] = useState<string | null>(null)

  if (isLoading) return <PageSpinner />
  if (error) return <ErrorMessage error={error} className="m-6" />
  if (!venue) return null

  return (
    <div className="p-4 sm:p-6 max-w-3xl">
      <div className="text-text-muted text-xs font-mono mb-4">
        <Link to="/venues" className="hover:text-accent-amber transition-colors">&gt;_ venues</Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary">{venue.name}</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display text-accent-amber glow-text-amber tracking-widest">
            {venue.name.toUpperCase()}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-text-muted text-xs">{venue.address}</span>
            <StatusBadge status={venue.status} />
          </div>
          <div className="text-text-muted text-xs mt-1">
            {venue.phone} · Capacity: {venue.capacity.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Stages */}
        <Card>
          <CardHeader label="Stages">
            <Button variant="ghost" size="sm" onClick={() => setShowAddStage(true)}>+ Add Stage</Button>
          </CardHeader>
          {venue.stages.length === 0 ? (
            <p className="text-text-muted text-xs py-3 text-center tracking-widest">[ NO STAGES ]</p>
          ) : (
            <div className="flex flex-col gap-3">
              {venue.stages.map((stage) => (
                <div key={stage.stageId} className="border border-border p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-primary font-mono text-sm">{stage.name}</span>
                    <Button variant="ghost" size="sm" onClick={() => setAddingSectionForStage(stage.stageId)}>
                      + Section
                    </Button>
                  </div>
                  {stage.sections.length > 0 && (
                    <div className="flex flex-col gap-1 pl-3 border-l border-border">
                      {stage.sections.map((sec) => (
                        <div key={sec.sectionId} className="flex items-center justify-between text-xs text-text-muted">
                          <span>{sec.name}</span>
                          <span>{sec.capacity} seats · ${sec.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Availability */}
        <Card>
          <CardHeader label="Availability">
            <Button variant="ghost" size="sm" onClick={() => setShowAddAvailability(true)}>+ Add Date</Button>
          </CardHeader>
          {venue.availability.length === 0 ? (
            <p className="text-text-muted text-xs py-3 text-center tracking-widest">[ NO AVAILABILITY ]</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {venue.availability.map((a) => (
                <div
                  key={a.availabilityId}
                  className={[
                    'text-xs font-mono px-2 py-1 border',
                    a.status === 'Booked'
                      ? 'border-accent-red text-accent-red'
                      : 'border-accent-green text-accent-green',
                  ].join(' ')}
                >
                  {format(parseISO(a.date), 'MMM d, yyyy')}
                  <span className="ml-1 opacity-60">{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Restrictions */}
        {venue.restrictions.length > 0 && (
          <Card>
            <CardHeader label="Restrictions">
              <Button variant="ghost" size="sm" onClick={() => setShowAddRestriction(true)}>+ Add</Button>
            </CardHeader>
            <div className="flex flex-col gap-1">
              {venue.restrictions.map((r) => (
                <div key={r.restrictionId} className="text-xs text-text-muted border-b border-border pb-1 last:border-0 last:pb-0">
                  <span className="text-accent-amber">{r.type}</span>: {r.parameters}
                </div>
              ))}
            </div>
          </Card>
        )}
        {venue.restrictions.length === 0 && (
          <div className="text-right">
            <Button variant="ghost" size="sm" onClick={() => setShowAddRestriction(true)}>+ Add Restriction</Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal open={showAddStage} onClose={() => setShowAddStage(false)} title="Add Stage">
        <SimpleNameForm
          label="Stage Name"
          onSubmit={async (name) => { await addStage.mutateAsync({ name }); setShowAddStage(false) }}
          error={addStage.error}
          loading={addStage.isPending}
          onClose={() => setShowAddStage(false)}
        />
      </Modal>

      <Modal
        open={addingSectionForStage !== null}
        onClose={() => setAddingSectionForStage(null)}
        title="Add Section"
      >
        <AddSectionForm
          onSubmit={async (body) => {
            await addSection.mutateAsync({ stageId: addingSectionForStage!, body })
            setAddingSectionForStage(null)
          }}
          error={addSection.error}
          loading={addSection.isPending}
          onClose={() => setAddingSectionForStage(null)}
        />
      </Modal>

      <Modal open={showAddAvailability} onClose={() => setShowAddAvailability(false)} title="Add Availability">
        <SimpleDateForm
          label="Date"
          onSubmit={async (date) => { await addAvailability.mutateAsync({ date }); setShowAddAvailability(false) }}
          error={addAvailability.error}
          loading={addAvailability.isPending}
          onClose={() => setShowAddAvailability(false)}
        />
      </Modal>

      <Modal open={showAddRestriction} onClose={() => setShowAddRestriction(false)} title="Add Restriction">
        <AddRestrictionForm
          onSubmit={async (body) => { await addRestriction.mutateAsync(body); setShowAddRestriction(false) }}
          error={addRestriction.error}
          loading={addRestriction.isPending}
          onClose={() => setShowAddRestriction(false)}
        />
      </Modal>
    </div>
  )
}

function SimpleNameForm({ label, onSubmit, error, loading, onClose }: {
  label: string
  onSubmit: (name: string) => Promise<void>
  error: unknown
  loading: boolean
  onClose: () => void
}) {
  const [name, setName] = useState('')
  return (
    <form onSubmit={async (e) => { e.preventDefault(); await onSubmit(name) }} className="flex flex-col gap-4">
      <Field label={label} id="simpleName">
        <Input id="simpleName" value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>
      <ErrorMessage error={error} />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="sm" type="submit" loading={loading}>Add</Button>
      </div>
    </form>
  )
}

function SimpleDateForm({ label, onSubmit, error, loading, onClose }: {
  label: string
  onSubmit: (date: string) => Promise<void>
  error: unknown
  loading: boolean
  onClose: () => void
}) {
  const [date, setDate] = useState('')
  return (
    <form onSubmit={async (e) => { e.preventDefault(); await onSubmit(date) }} className="flex flex-col gap-4">
      <Field label={label} id="simpleDate">
        <Input id="simpleDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </Field>
      <ErrorMessage error={error} />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="sm" type="submit" loading={loading}>Add</Button>
      </div>
    </form>
  )
}

function AddSectionForm({ onSubmit, error, loading, onClose }: {
  onSubmit: (body: AddSectionBody) => Promise<void>
  error: unknown
  loading: boolean
  onClose: () => void
}) {
  const [form, setForm] = useState<AddSectionBody>({ name: '', capacity: 0, price: 0 })
  const set = (key: keyof AddSectionBody) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: key === 'name' ? e.target.value : Number(e.target.value) }))

  return (
    <form onSubmit={async (e) => { e.preventDefault(); await onSubmit(form) }} className="flex flex-col gap-4">
      <Field label="Section Name" id="secName"><Input id="secName" value={form.name} onChange={set('name')} required /></Field>
      <Field label="Capacity" id="secCap"><Input id="secCap" type="number" min={1} value={form.capacity || ''} onChange={set('capacity')} required /></Field>
      <Field label="Price ($)" id="secPrice"><Input id="secPrice" type="number" min={0} step="0.01" value={form.price || ''} onChange={set('price')} required /></Field>
      <ErrorMessage error={error} />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="sm" type="submit" loading={loading}>Add</Button>
      </div>
    </form>
  )
}

function AddRestrictionForm({ onSubmit, error, loading, onClose }: {
  onSubmit: (body: AddRestrictionBody) => Promise<void>
  error: unknown
  loading: boolean
  onClose: () => void
}) {
  const [form, setForm] = useState<AddRestrictionBody>({ type: '', parameters: '' })
  return (
    <form onSubmit={async (e) => { e.preventDefault(); await onSubmit(form) }} className="flex flex-col gap-4">
      <Field label="Type" id="rType"><Input id="rType" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} required /></Field>
      <Field label="Parameters" id="rParams"><Input id="rParams" value={form.parameters} onChange={(e) => setForm((f) => ({ ...f, parameters: e.target.value }))} required /></Field>
      <ErrorMessage error={error} />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="sm" type="submit" loading={loading}>Add</Button>
      </div>
    </form>
  )
}
