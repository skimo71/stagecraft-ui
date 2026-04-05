import { api } from './client'
import type {
  ShowView,
  OpenTicketSalesBody,
  CancelShowBody,
  CompleteShowBody,
} from '../types/show'

export const showsApi = {
  list: () => api.get<ShowView[]>('/shows'),
  get: (id: string) => api.get<ShowView>(`/shows/${id}`),
  openTicketSales: (id: string, body: OpenTicketSalesBody) =>
    api.post<ShowView>(`/shows/${id}/open-ticket-sales`, body),
  cancel: (id: string, body: CancelShowBody) =>
    api.post<ShowView>(`/shows/${id}/cancel`, body),
  complete: (id: string, body: CompleteShowBody) =>
    api.post<ShowView>(`/shows/${id}/complete`, body),
  settle: (id: string) => api.post<ShowView>(`/shows/${id}/settle`, {}),
}
