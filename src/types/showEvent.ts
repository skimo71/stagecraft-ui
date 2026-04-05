export type ShowEventStatus =
  | 'Preparing'
  | 'LoadIn'
  | 'DoorsOpen'
  | 'ShowStarted'
  | 'ShowCompleted'
  | 'LoadOut'
  | 'Closed'

export interface StaffRoleView {
  staffRoleId: string
  role: string
  required: number
  confirmed: number
  supplierId?: string
  isFullyConfirmed: boolean
}

export interface VendorView {
  vendorId: string
  vendorType: string
  supplierId: string
}

export interface FulfillmentItemView {
  fulfillmentItemId: string
  riderItemId: string
  description: string
  required: boolean
  fulfilled: boolean
  fulfilledBy?: string
  fulfilledAt?: string
}

export interface ShowEventView {
  showEventId: string
  showId: string
  venueId: string
  artistId: string
  dateAndTime: string
  status: ShowEventStatus
  isFullyStaffed: boolean
  isRiderFulfilled: boolean
  staff: StaffRoleView[]
  vendors: VendorView[]
  fulfillmentItems: FulfillmentItemView[]
}

export interface CreateShowEventBody {
  venueId: string
  artistId: string
  dateAndTime: string
}

export interface StartLoadInBody {
  scheduledLoadInTime: string
  crewCount: number
}

export interface CompleteShowEventBody {
  durationMinutes: number
}

export interface AddStaffRoleBody {
  role: string
  required: number
  supplierId?: string
}

export interface ConfirmStaffRoleBody {
  count: number
}

export interface AddVendorBody {
  vendorType: string
  supplierId: string
}

export interface AddFulfillmentItemBody {
  riderItemId: string
  description: string
  required: boolean
}

export interface MarkFulfilledBody {
  fulfilledBy: string
}
