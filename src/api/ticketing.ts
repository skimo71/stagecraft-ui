import { api } from './client'
import type { TicketingShowView, AddSeatBody, PurchaseTicketBody } from '../types/ticketing'

export const ticketingApi = {
  get: (showId: string) => api.get<TicketingShowView>(`/shows/${showId}/ticketing`),
  addSeat: (showId: string, body: AddSeatBody) =>
    api.post<TicketingShowView>(`/shows/${showId}/ticketing/seats`, body),
  purchaseTicket: (showId: string, body: PurchaseTicketBody) =>
    api.post<TicketingShowView>(`/shows/${showId}/ticketing/tickets`, body),
}
