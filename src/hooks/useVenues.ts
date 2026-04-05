import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { venuesApi } from '../api/venues'
import type {
  CreateVenueBody,
  AddStageBody,
  AddSectionBody,
  AddAvailabilityBody,
  AddRestrictionBody,
} from '../types/venue'

export const venueKeys = {
  all: ['venues'] as const,
  list: () => [...venueKeys.all, 'list'] as const,
  detail: (id: string) => [...venueKeys.all, id] as const,
}

export function useVenues() {
  return useQuery({ queryKey: venueKeys.list(), queryFn: venuesApi.list })
}

export function useVenue(id: string) {
  return useQuery({ queryKey: venueKeys.detail(id), queryFn: () => venuesApi.get(id) })
}

export function useCreateVenue() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateVenueBody) => venuesApi.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: venueKeys.list() }),
  })
}

export function useAddStage(venueId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: AddStageBody) => venuesApi.addStage(venueId, body),
    onSuccess: (data) => qc.setQueryData(venueKeys.detail(venueId), data),
  })
}

export function useAddSection(venueId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ stageId, body }: { stageId: string; body: AddSectionBody }) =>
      venuesApi.addSection(venueId, stageId, body),
    onSuccess: (data) => qc.setQueryData(venueKeys.detail(venueId), data),
  })
}

export function useAddAvailability(venueId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: AddAvailabilityBody) => venuesApi.addAvailability(venueId, body),
    onSuccess: (data) => qc.setQueryData(venueKeys.detail(venueId), data),
  })
}

export function useAddRestriction(venueId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: AddRestrictionBody) => venuesApi.addRestriction(venueId, body),
    onSuccess: (data) => qc.setQueryData(venueKeys.detail(venueId), data),
  })
}
