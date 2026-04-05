export type TicketingShowStatus = 'Open' | 'SoldOut' | 'Cancelled' | 'Closed'

export interface SeatView {
  seatId: string
  stageId: string
  sectionId: string
  row: string
  seatNumber: string
  price: number
  baseFee: number
  fulfillmentFee: number
  isReserved: boolean
}

export interface OrderView {
  orderId: string
  seatId: string
  customerId: string
  receiptNumber: string
  transactionNumber: string
  dateAndTimeSold: string
  totalPaid: number
  appliedFees: number
  ticketPrinted: boolean
  willCall: boolean
}

export interface TicketingShowView {
  ticketingShowId: string
  ticketingCompanyId: string
  showId: string
  venueId: string
  totalCapacity: number
  soldCount: number
  status: TicketingShowStatus
  isLowTickets: boolean
  lowTicketThresholdPercent: number
  inventory: SeatView[]
  orders: OrderView[]
}

export interface AddSeatBody {
  stageId: string
  sectionId: string
  row: string
  seatNumber: string
  price: number
  baseFee: number
  fulfillmentFee: number
}

export interface PurchaseTicketBody {
  seatId: string
  customerId: string
  receiptNumber: string
  transactionNumber: string
  totalPaid: number
  appliedFees: number
  ticketPrinted: boolean
  willCall: boolean
}
