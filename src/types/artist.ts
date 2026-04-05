export type RiderCategory = 'Hospitality' | 'Technical' | 'Security' | 'Merchandise'

export interface MemberView {
  memberId: string
  name: string
  dateOfBirth: string
}

export interface RiderItemView {
  riderItemId: string
  category: RiderCategory
  description: string
  required: boolean
}

export interface RiderView {
  riderId: string
  items: RiderItemView[]
}

export interface ArtistView {
  artistId: string
  bandName: string
  genre: string
  status: 'Active' | 'Inactive'
  members: MemberView[]
  rider: RiderView
  hasMinors: boolean
}

export interface CreateArtistBody {
  bandName: string
  genre: string
}

export interface AddMemberBody {
  name: string
  dateOfBirth: string
}

export interface AddRiderItemBody {
  category: RiderCategory
  description: string
  required: boolean
}

export interface UpdateRiderItemBody {
  category: RiderCategory
  description: string
  required: boolean
}
