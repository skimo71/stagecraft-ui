import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useArtists, useCreateArtist } from '../../hooks/useArtists'
import { Card, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Field, Input, Select } from '../../components/ui/FormField'
import { StatusBadge } from '../../components/StatusBadge'
import { ErrorMessage } from '../../components/ErrorMessage'
import { PageSpinner, EmptyState } from '../../components/ui/Spinner'
import type { CreateArtistBody } from '../../types/artist'

const GENRES = ['Rock', 'Pop', 'Jazz', 'Electronic', 'Hip-Hop', 'Country', 'Classical', 'Metal', 'Indie', 'Other']

function CreateArtistForm({ onClose }: { onClose: () => void }) {
  const create = useCreateArtist()
  const [form, setForm] = useState<CreateArtistBody>({ bandName: '', genre: 'Rock' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await create.mutateAsync(form)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Band Name" id="bandName">
        <Input
          id="bandName"
          value={form.bandName}
          onChange={(e) => setForm((f) => ({ ...f, bandName: e.target.value }))}
          placeholder="The Midnight Operators"
          required
        />
      </Field>
      <Field label="Genre" id="genre">
        <Select
          id="genre"
          value={form.genre}
          onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))}
        >
          {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
        </Select>
      </Field>
      <ErrorMessage error={create.error} />
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="sm" type="submit" loading={create.isPending}>Create</Button>
      </div>
    </form>
  )
}

export function ArtistListPage() {
  const { data: artists, isLoading, error } = useArtists()
  const [showCreate, setShowCreate] = useState(false)

  if (isLoading) return <PageSpinner />
  if (error) return <ErrorMessage error={error} className="m-6" />

  return (
    <div className="p-4 sm:p-6 max-w-4xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <div className="text-text-muted text-xs tracking-widest uppercase mb-1">&gt;_ Artist Registry</div>
          <h1 className="text-3xl font-display text-accent-cyan glow-text-cyan tracking-widest">ARTISTS</h1>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>
          + New Artist
        </Button>
      </div>

      {artists?.length === 0 ? (
        <EmptyState message="NO ARTISTS" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {artists?.map((artist) => (
            <Link key={artist.artistId} to={`/artists/${artist.artistId}`} className="block group">
              <Card className="hover:border-accent-cyan hover:shadow-glow transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-text-primary font-mono font-medium group-hover:text-accent-cyan transition-colors">
                      {artist.bandName}
                    </div>
                    <div className="text-text-muted text-xs mt-1 tracking-wider">{artist.genre}</div>
                    <div className="text-text-muted text-xs mt-1">
                      {artist.members.length} member{artist.members.length !== 1 ? 's' : ''}
                      {artist.hasMinors && <span className="ml-2 text-accent-amber">⚠ minors</span>}
                    </div>
                  </div>
                  <StatusBadge status={artist.status} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Register New Artist">
        <CreateArtistForm onClose={() => setShowCreate(false)} />
      </Modal>
    </div>
  )
}
