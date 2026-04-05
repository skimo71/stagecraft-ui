import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  useArtist,
  useAddMember,
  useRemoveMember,
  useAddRiderItem,
  useRemoveRiderItem,
} from '../../hooks/useArtists'
import { Card, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Field, Input, Select } from '../../components/ui/FormField'
import { StatusBadge } from '../../components/StatusBadge'
import { ErrorMessage } from '../../components/ErrorMessage'
import { PageSpinner } from '../../components/ui/Spinner'
import type { AddMemberBody, AddRiderItemBody, RiderCategory } from '../../types/artist'
import { format, parseISO } from 'date-fns'

const RIDER_CATEGORIES: RiderCategory[] = ['Hospitality', 'Technical', 'Security', 'Merchandise']

function AddMemberForm({ artistId, onClose }: { artistId: string; onClose: () => void }) {
  const addMember = useAddMember(artistId)
  const [form, setForm] = useState<AddMemberBody>({ name: '', dateOfBirth: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await addMember.mutateAsync(form)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Name" id="memberName">
        <Input id="memberName" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
      </Field>
      <Field label="Date of Birth" id="dob">
        <Input id="dob" type="date" value={form.dateOfBirth} onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))} required />
      </Field>
      <ErrorMessage error={addMember.error} />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="sm" type="submit" loading={addMember.isPending}>Add</Button>
      </div>
    </form>
  )
}

function AddRiderItemForm({ artistId, onClose }: { artistId: string; onClose: () => void }) {
  const addItem = useAddRiderItem(artistId)
  const [form, setForm] = useState<AddRiderItemBody>({ category: 'Hospitality', description: '', required: false })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await addItem.mutateAsync(form)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Category" id="riderCat">
        <Select id="riderCat" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as RiderCategory }))}>
          {RIDER_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
      </Field>
      <Field label="Description" id="riderDesc">
        <Input id="riderDesc" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required />
      </Field>
      <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
        <input
          type="checkbox"
          checked={form.required}
          onChange={(e) => setForm((f) => ({ ...f, required: e.target.checked }))}
          className="accent-accent-cyan"
        />
        Required
      </label>
      <ErrorMessage error={addItem.error} />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="sm" type="submit" loading={addItem.isPending}>Add Item</Button>
      </div>
    </form>
  )
}

export function ArtistDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: artist, isLoading, error } = useArtist(id!)
  const removeMember = useRemoveMember(id!)
  const removeRiderItem = useRemoveRiderItem(id!)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showAddRider, setShowAddRider] = useState(false)

  if (isLoading) return <PageSpinner />
  if (error) return <ErrorMessage error={error} className="m-6" />
  if (!artist) return null

  return (
    <div className="p-4 sm:p-6 max-w-3xl">
      {/* Breadcrumb */}
      <div className="text-text-muted text-xs font-mono mb-4">
        <Link to="/artists" className="hover:text-accent-cyan transition-colors">&gt;_ artists</Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary">{artist.bandName}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display text-accent-cyan glow-text-cyan tracking-widest">
            {artist.bandName.toUpperCase()}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-text-muted text-sm">{artist.genre}</span>
            <StatusBadge status={artist.status} />
            {artist.hasMinors && (
              <span className="text-xs border border-accent-amber text-accent-amber px-2 py-0.5 uppercase tracking-wider">
                ⚠ minors
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Members */}
        <Card>
          <CardHeader label="Band Members">
            <Button variant="ghost" size="sm" onClick={() => setShowAddMember(true)}>+ Add</Button>
          </CardHeader>
          {artist.members.length === 0 ? (
            <p className="text-text-muted text-xs py-3 text-center tracking-widest">[ NO MEMBERS ]</p>
          ) : (
            <div className="flex flex-col gap-1">
              {artist.members.map((m) => (
                <div key={m.memberId} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <div>
                    <div className="text-sm text-text-primary">{m.name}</div>
                    <div className="text-xs text-text-muted">{format(parseISO(m.dateOfBirth), 'MMM d, yyyy')}</div>
                  </div>
                  <button
                    onClick={() => removeMember.mutate(m.memberId)}
                    className="text-xs text-text-muted hover:text-accent-red transition-colors font-mono"
                  >
                    remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Rider */}
        <Card>
          <CardHeader label="Technical Rider">
            <Button variant="ghost" size="sm" onClick={() => setShowAddRider(true)}>+ Add</Button>
          </CardHeader>
          {artist.rider.items.length === 0 ? (
            <p className="text-text-muted text-xs py-3 text-center tracking-widest">[ NO RIDER ITEMS ]</p>
          ) : (
            <div className="flex flex-col gap-1">
              {artist.rider.items.map((item) => (
                <div key={item.riderItemId} className="flex items-start justify-between py-1.5 border-b border-border last:border-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-accent-amber uppercase tracking-wider">{item.category}</span>
                      {item.required && <span className="text-xs text-accent-red">required</span>}
                    </div>
                    <div className="text-sm text-text-primary mt-0.5">{item.description}</div>
                  </div>
                  <button
                    onClick={() => removeRiderItem.mutate(item.riderItemId)}
                    className="text-xs text-text-muted hover:text-accent-red transition-colors font-mono ml-2 shrink-0"
                  >
                    remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Modal open={showAddMember} onClose={() => setShowAddMember(false)} title="Add Band Member">
        <AddMemberForm artistId={id!} onClose={() => setShowAddMember(false)} />
      </Modal>
      <Modal open={showAddRider} onClose={() => setShowAddRider(false)} title="Add Rider Item">
        <AddRiderItemForm artistId={id!} onClose={() => setShowAddRider(false)} />
      </Modal>
    </div>
  )
}
