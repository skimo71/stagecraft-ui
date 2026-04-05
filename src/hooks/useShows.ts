import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { showsApi } from '../api/shows'
import type { OpenTicketSalesBody, CancelShowBody, CompleteShowBody } from '../types/show'

export const showKeys = {
  all: ['shows'] as const,
  list: () => [...showKeys.all, 'list'] as const,
  detail: (id: string) => [...showKeys.all, id] as const,
}

export function useShows() {
  return useQuery({ queryKey: showKeys.list(), queryFn: showsApi.list })
}

export function useShow(id: string) {
  return useQuery({ queryKey: showKeys.detail(id), queryFn: () => showsApi.get(id) })
}

export function useOpenTicketSales(showId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: OpenTicketSalesBody) => showsApi.openTicketSales(showId, body),
    onSuccess: (data) => {
      qc.setQueryData(showKeys.detail(showId), data)
      qc.invalidateQueries({ queryKey: showKeys.list() })
    },
  })
}

export function useCancelShow(showId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CancelShowBody) => showsApi.cancel(showId, body),
    onSuccess: (data) => {
      qc.setQueryData(showKeys.detail(showId), data)
      qc.invalidateQueries({ queryKey: showKeys.list() })
    },
  })
}

export function useCompleteShow(showId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CompleteShowBody) => showsApi.complete(showId, body),
    onSuccess: (data) => {
      qc.setQueryData(showKeys.detail(showId), data)
      qc.invalidateQueries({ queryKey: showKeys.list() })
    },
  })
}

export function useSettleShow(showId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => showsApi.settle(showId),
    onSuccess: (data) => {
      qc.setQueryData(showKeys.detail(showId), data)
      qc.invalidateQueries({ queryKey: showKeys.list() })
    },
  })
}
