import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { showEventsApi } from '../api/showEvents'
import type {
  CreateShowEventBody,
  StartLoadInBody,
  CompleteShowEventBody,
  AddStaffRoleBody,
  ConfirmStaffRoleBody,
  AddVendorBody,
  AddFulfillmentItemBody,
  MarkFulfilledBody,
} from '../types/showEvent'

export const showEventKeys = {
  all: ['showEvents'] as const,
  detail: (showId: string) => [...showEventKeys.all, showId] as const,
}

export function useShowEvent(showId: string) {
  return useQuery({
    queryKey: showEventKeys.detail(showId),
    queryFn: () => showEventsApi.get(showId),
    retry: (failureCount, error: unknown) => {
      // Don't retry 404s — event may not exist yet
      if (error && typeof error === 'object' && 'status' in error && (error as { status: number }).status === 404) return false
      return failureCount < 1
    },
  })
}

export function useCreateShowEvent(showId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateShowEventBody) => showEventsApi.create(showId, body),
    onSuccess: (data) => qc.setQueryData(showEventKeys.detail(showId), data),
  })
}

export function useStartLoadIn(showId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: StartLoadInBody) => showEventsApi.startLoadIn(showId, body),
    onSuccess: (data) => qc.setQueryData(showEventKeys.detail(showId), data),
  })
}

export function useOpenDoors(showId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => showEventsApi.openDoors(showId),
    onSuccess: (data) => qc.setQueryData(showEventKeys.detail(showId), data),
  })
}

export function useStartShow(showId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => showEventsApi.startShow(showId),
    onSuccess: (data) => qc.setQueryData(showEventKeys.detail(showId), data),
  })
}

export function useCompleteShowEvent(showId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CompleteShowEventBody) => showEventsApi.completeShow(showId, body),
    onSuccess: (data) => qc.setQueryData(showEventKeys.detail(showId), data),
  })
}

export function useStartLoadOut(showId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => showEventsApi.startLoadOut(showId),
    onSuccess: (data) => qc.setQueryData(showEventKeys.detail(showId), data),
  })
}

export function useCloseShowEvent(showId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => showEventsApi.close(showId),
    onSuccess: (data) => qc.setQueryData(showEventKeys.detail(showId), data),
  })
}

export function useAddStaffRole(showId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: AddStaffRoleBody) => showEventsApi.addStaffRole(showId, body),
    onSuccess: (data) => qc.setQueryData(showEventKeys.detail(showId), data),
  })
}

export function useConfirmStaffRole(showId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ staffRoleId, body }: { staffRoleId: string; body: ConfirmStaffRoleBody }) =>
      showEventsApi.confirmStaffRole(showId, staffRoleId, body),
    onSuccess: (data) => qc.setQueryData(showEventKeys.detail(showId), data),
  })
}

export function useAddVendor(showId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: AddVendorBody) => showEventsApi.addVendor(showId, body),
    onSuccess: (data) => qc.setQueryData(showEventKeys.detail(showId), data),
  })
}

export function useAddFulfillmentItem(showId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: AddFulfillmentItemBody) => showEventsApi.addFulfillmentItem(showId, body),
    onSuccess: (data) => qc.setQueryData(showEventKeys.detail(showId), data),
  })
}

export function useMarkFulfilled(showId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ fulfillmentItemId, body }: { fulfillmentItemId: string; body: MarkFulfilledBody }) =>
      showEventsApi.markFulfilled(showId, fulfillmentItemId, body),
    onSuccess: (data) => qc.setQueryData(showEventKeys.detail(showId), data),
  })
}
