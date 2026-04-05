export interface SectionView {
  sectionId: string
  name: string
  capacity: number
  price: number
}

export interface StageView {
  stageId: string
  name: string
  sections: SectionView[]
}

export interface AvailabilityView {
  availabilityId: string
  date: string
  status: 'Available' | 'Booked'
  showId?: string
}

export interface RestrictionView {
  restrictionId: string
  type: string
  parameters: string
}

export interface VenueView {
  venueId: string
  name: string
  address: string
  phone: string
  operatorId: string
  capacity: number
  status: 'Active' | 'Inactive'
  stages: StageView[]
  availability: AvailabilityView[]
  restrictions: RestrictionView[]
}

export interface CreateVenueBody {
  name: string
  address: string
  phone: string
  operatorId: string
  capacity: number
}

export interface AddStageBody {
  name: string
}

export interface AddSectionBody {
  name: string
  capacity: number
  price: number
}

export interface AddAvailabilityBody {
  date: string
}

export interface AddRestrictionBody {
  type: string
  parameters: string
}
