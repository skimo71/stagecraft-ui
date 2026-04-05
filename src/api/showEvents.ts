import { api } from './client'
import type {
  ShowEventView,
  CreateShowEventBody,
  StartLoadInBody,
  CompleteShowEventBody,
  AddStaffRoleBody,
  ConfirmStaffRoleBody,
  AddVendorBody,
  AddFulfillmentItemBody,
  MarkFulfilledBody,
} from '../types/showEvent'

export const showEventsApi = {
  get: (showId: string) => api.get<ShowEventView>(`/shows/${showId}/event`),
  create: (showId: string, body: CreateShowEventBody) =>
    api.post<ShowEventView>(`/shows/${showId}/event`, body),
  startLoadIn: (showId: string, body: StartLoadInBody) =>
    api.post<ShowEventView>(`/shows/${showId}/event/load-in`, body),
  openDoors: (showId: string) =>
    api.post<ShowEventView>(`/shows/${showId}/event/doors`, {}),
  startShow: (showId: string) =>
    api.post<ShowEventView>(`/shows/${showId}/event/show-start`, {}),
  completeShow: (showId: string, body: CompleteShowEventBody) =>
    api.post<ShowEventView>(`/shows/${showId}/event/show-complete`, body),
  startLoadOut: (showId: string) =>
    api.post<ShowEventView>(`/shows/${showId}/event/load-out`, {}),
  close: (showId: string) =>
    api.post<ShowEventView>(`/shows/${showId}/event/close`, {}),
  addStaffRole: (showId: string, body: AddStaffRoleBody) =>
    api.post<ShowEventView>(`/shows/${showId}/event/staff`, body),
  confirmStaffRole: (showId: string, staffRoleId: string, body: ConfirmStaffRoleBody) =>
    api.post<ShowEventView>(`/shows/${showId}/event/staff/${staffRoleId}/confirm`, body),
  addVendor: (showId: string, body: AddVendorBody) =>
    api.post<ShowEventView>(`/shows/${showId}/event/vendors`, body),
  addFulfillmentItem: (showId: string, body: AddFulfillmentItemBody) =>
    api.post<ShowEventView>(`/shows/${showId}/event/fulfillment`, body),
  markFulfilled: (showId: string, fulfillmentItemId: string, body: MarkFulfilledBody) =>
    api.post<ShowEventView>(
      `/shows/${showId}/event/fulfillment/${fulfillmentItemId}/fulfill`,
      body,
    ),
}
