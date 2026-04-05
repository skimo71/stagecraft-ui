import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { artistsApi } from '../api/artists'
import type {
  CreateArtistBody,
  AddMemberBody,
  AddRiderItemBody,
  UpdateRiderItemBody,
} from '../types/artist'

export const artistKeys = {
  all: ['artists'] as const,
  list: () => [...artistKeys.all, 'list'] as const,
  detail: (id: string) => [...artistKeys.all, id] as const,
}

export function useArtists() {
  return useQuery({ queryKey: artistKeys.list(), queryFn: artistsApi.list })
}

export function useArtist(id: string) {
  return useQuery({ queryKey: artistKeys.detail(id), queryFn: () => artistsApi.get(id) })
}

export function useCreateArtist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateArtistBody) => artistsApi.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: artistKeys.list() }),
  })
}

export function useAddMember(artistId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: AddMemberBody) => artistsApi.addMember(artistId, body),
    onSuccess: (data) => qc.setQueryData(artistKeys.detail(artistId), data),
  })
}

export function useRemoveMember(artistId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (memberId: string) => artistsApi.removeMember(artistId, memberId),
    onSuccess: (data) => qc.setQueryData(artistKeys.detail(artistId), data),
  })
}

export function useAddRiderItem(artistId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: AddRiderItemBody) => artistsApi.addRiderItem(artistId, body),
    onSuccess: (data) => qc.setQueryData(artistKeys.detail(artistId), data),
  })
}

export function useRemoveRiderItem(artistId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (riderItemId: string) => artistsApi.removeRiderItem(artistId, riderItemId),
    onSuccess: (data) => qc.setQueryData(artistKeys.detail(artistId), data),
  })
}

export function useUpdateRiderItem(artistId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ riderItemId, body }: { riderItemId: string; body: UpdateRiderItemBody }) =>
      artistsApi.updateRiderItem(artistId, riderItemId, body),
    onSuccess: (data) => qc.setQueryData(artistKeys.detail(artistId), data),
  })
}
