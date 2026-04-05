import { api } from './client'
import type {
  ArtistView,
  CreateArtistBody,
  AddMemberBody,
  AddRiderItemBody,
  UpdateRiderItemBody,
} from '../types/artist'

export const artistsApi = {
  list: () => api.get<ArtistView[]>('/artists'),
  get: (id: string) => api.get<ArtistView>(`/artists/${id}`),
  create: (body: CreateArtistBody) => api.post<ArtistView>('/artists', body),
  addMember: (id: string, body: AddMemberBody) =>
    api.post<ArtistView>(`/artists/${id}/members`, body),
  removeMember: (id: string, memberId: string) =>
    api.delete<ArtistView>(`/artists/${id}/members/${memberId}`),
  addRiderItem: (id: string, body: AddRiderItemBody) =>
    api.post<ArtistView>(`/artists/${id}/rider/items`, body),
  removeRiderItem: (id: string, riderItemId: string) =>
    api.delete<ArtistView>(`/artists/${id}/rider/items/${riderItemId}`),
  updateRiderItem: (id: string, riderItemId: string, body: UpdateRiderItemBody) =>
    api.put<ArtistView>(`/artists/${id}/rider/items/${riderItemId}`, body),
}
