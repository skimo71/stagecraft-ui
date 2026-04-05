import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { offersApi } from '../api/offers'
import { showKeys } from './useShows'
import type { CreateOfferBody, AddProposalBody, RejectOfferBody } from '../types/offer'

export const offerKeys = {
  all: ['offers'] as const,
  list: () => [...offerKeys.all, 'list'] as const,
  detail: (id: string) => [...offerKeys.all, id] as const,
}

export function useOffers() {
  return useQuery({ queryKey: offerKeys.list(), queryFn: offersApi.list })
}

export function useOffer(id: string) {
  return useQuery({ queryKey: offerKeys.detail(id), queryFn: () => offersApi.get(id) })
}

export function useCreateOffer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateOfferBody) => offersApi.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: offerKeys.list() }),
  })
}

export function useSendOffer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => offersApi.send(id),
    onSuccess: (data) => {
      qc.setQueryData(offerKeys.detail(data.offerId), data)
      qc.invalidateQueries({ queryKey: offerKeys.list() })
    },
  })
}

export function useAddProposal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AddProposalBody }) =>
      offersApi.addProposal(id, body),
    onSuccess: (data) => {
      qc.setQueryData(offerKeys.detail(data.offerId), data)
      qc.invalidateQueries({ queryKey: offerKeys.list() })
    },
  })
}

export function useAcceptOffer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => offersApi.accept(id),
    onSuccess: (data) => {
      qc.setQueryData(offerKeys.detail(data.offerId), data)
      qc.invalidateQueries({ queryKey: offerKeys.list() })
      // Accepting an offer creates a Show
      qc.invalidateQueries({ queryKey: showKeys.list() })
    },
  })
}

export function useRejectOffer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: RejectOfferBody }) =>
      offersApi.reject(id, body),
    onSuccess: (data) => {
      qc.setQueryData(offerKeys.detail(data.offerId), data)
      qc.invalidateQueries({ queryKey: offerKeys.list() })
    },
  })
}

export function useExpireOffer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => offersApi.expire(id),
    onSuccess: (data) => {
      qc.setQueryData(offerKeys.detail(data.offerId), data)
      qc.invalidateQueries({ queryKey: offerKeys.list() })
    },
  })
}
