export interface Guest {
  id: string
  ticketId: string
  name: string
  email: string
  phone: string
  pin: string
  bring: string | string[]
  arrived: boolean
  createdAt: string
}

export interface GuestInput {
  name: string
  email: string
  phone: string
  pin: string
  bring: string[]
  ticketId: string
  arrived: boolean
  createdAt: string
}

export interface GuestUpdates {
  name: string
  phone: string
  bring: string[]
}

export interface Event {
  id: string
  hour: string
  name: string
  description: string
  validated: boolean
  registrants: string[]
  createdBy: string
  registeredGuests?: Guest[]
  createdByGuest?: Guest
}

export interface EventInput {
  hour: string
  name: string
  description: string
  validated: boolean
  registrants: string[]
  createdBy: string
}

export interface FormState {
  name: string
  email: string
  phone: string
  pin: string
  bring: string[]
}

export interface BringItem {
  label: string
  people: string[]
}

export type BringItems = Record<string, BringItem>

export type Page =
  | 'home'
  | 'details'
  | 'rules'
  | 'form'
  | 'edit'
  | 'ticket'
  | 'access'
  | 'forgot'
  | 'guests'
  | 'bring'
  | 'checkin'
  | 'dontcome'
  | 'events'
  | 'event-validation'
  | 'flemme-page'
