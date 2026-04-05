import { api } from './client'
import type {
  VenueView,
  CreateVenueBody,
  AddStageBody,
  AddSectionBody,
  AddAvailabilityBody,
  AddRestrictionBody,
} from '../types/venue'

export const venuesApi = {
  list: () => api.get<VenueView[]>('/venues'),
  get: (id: string) => api.get<VenueView>(`/venues/${id}`),
  create: (body: CreateVenueBody) => api.post<VenueView>('/venues', body),
  addStage: (id: string, body: AddStageBody) =>
    api.post<VenueView>(`/venues/${id}/stages`, body),
  addSection: (id: string, stageId: string, body: AddSectionBody) =>
    api.post<VenueView>(`/venues/${id}/stages/${stageId}/sections`, body),
  addAvailability: (id: string, body: AddAvailabilityBody) =>
    api.post<VenueView>(`/venues/${id}/availability`, body),
  addRestriction: (id: string, body: AddRestrictionBody) =>
    api.post<VenueView>(`/venues/${id}/restrictions`, body),
}
