export type OfferStatus = 'Draft' | 'Sent' | 'Negotiating' | 'Accepted' | 'Rejected' | 'Expired'

export interface ProposalView {
  proposalId: string
  venueId: string
  dateAndTime: string
  guaranteedFee: number
}

export interface OfferView {
  offerId: string
  promoterId: string
  artistId: string
  status: OfferStatus
  currentProposal: ProposalView
  proposals: ProposalView[]
}

export interface CreateOfferBody {
  promoterId: string
  artistId: string
  venueId: string
  dateAndTime: string
  guaranteedFee: number
}

export interface AddProposalBody {
  venueId: string
  dateAndTime: string
  guaranteedFee: number
}

export interface RejectOfferBody {
  reason?: string
}
