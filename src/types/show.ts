export type ShowStatus = 'Confirmed' | 'OnSale' | 'ReadyForSettlement' | 'Settled' | 'Cancelled'

export type CancelledBy = 'Promoter' | 'Artist' | 'Venue'

export interface ShowView {
  showId: string
  offerId: string
  promoterId: string
  artistId: string
  venueId: string
  dateAndTime: string
  guaranteedFee: number
  status: ShowStatus
}

export interface TicketTier {
  name: string
  price: number
  capacity: number
}

export interface OpenTicketSalesBody {
  totalCapacity: number
  tiers: TicketTier[]
  ticketingCompanyId: string
}

export interface CancelShowBody {
  cancelledBy: CancelledBy
  reason: string
}

export interface CompleteShowBody {
  durationMinutes: number
}
