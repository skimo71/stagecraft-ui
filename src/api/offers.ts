import { api } from './client'
import type { OfferView, CreateOfferBody, AddProposalBody, RejectOfferBody } from '../types/offer'

export const offersApi = {
  list: () => api.get<OfferView[]>('/offers'),
  get: (id: string) => api.get<OfferView>(`/offers/${id}`),
  create: (body: CreateOfferBody) => api.post<OfferView>('/offers', body),
  send: (id: string) => api.post<OfferView>(`/offers/${id}/send`, {}),
  addProposal: (id: string, body: AddProposalBody) =>
    api.post<OfferView>(`/offers/${id}/proposals`, body),
  accept: (id: string) => api.post<OfferView>(`/offers/${id}/accept`, {}),
  reject: (id: string, body: RejectOfferBody) =>
    api.post<OfferView>(`/offers/${id}/reject`, body),
  expire: (id: string) => api.post<OfferView>(`/offers/${id}/expire`, {}),
}
