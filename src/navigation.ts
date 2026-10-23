import type { Page } from './types'

export const pages: Page[] = [
  'home',
  'details',
  'rules',
  'form',
  'edit',
  'ticket',
  'access',
  'forgot',
  'guests',
  'bring',
  'checkin',
  'events',
  'event-validation',
  'flemme-page'
]

export function currentPage(): Page {
  const page = window.location.hash.replace('#/', '').split('/')[0]
  return (pages as string[]).includes(page) ? page as Page : 'home'
}

export function go(page: Page): void {
  window.location.hash = `/${page}`
}
