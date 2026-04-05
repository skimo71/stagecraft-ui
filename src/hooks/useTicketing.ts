import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketingApi } from '../api/ticketing'
import { showKeys } from './useShows'
import type { AddSeatBody, PurchaseTicketBody } from '../types/ticketing'

export const ticketingKeys = {
  all: ['ticketing'] as const,
  detail: (showId: string) => [...ticketingKeys.all, showId] as const,
}

export function useTicketing(showId: string) {
  return useQuery({
    queryKey: ticketingKeys.detail(showId),
    queryFn: () => ticketingApi.get(showId),
    retry: (failureCount, error: unknown) => {
      if (error && typeof error === 'object' && 'status' in error && (error as { status: number }).status === 404) return false
      return failureCount < 1
    },
  })
}

export function useAddSeat(showId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: AddSeatBody) => ticketingApi.addSeat(showId, body),
    onSuccess: (data) => qc.setQueryData(ticketingKeys.detail(showId), data),
  })
}

export function usePurchaseTicket(showId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: PurchaseTicketBody) => ticketingApi.purchaseTicket(showId, body),
    onSuccess: (data) => {
      qc.setQueryData(ticketingKeys.detail(showId), data)
      // Sold out state change may affect show status
      qc.invalidateQueries({ queryKey: showKeys.detail(showId) })
    },
  })
}
