const storageVersion = '2'
const storageVersionKey = 'birthday-storage-version'

const legacyStorageKeys = [
  'birthday-current-guest',
  'birthday-guest-list',
  'birthday-event-list',
]

export const currentGuestStorageKey = 'birthday-current-guest-v2'

export function initializeStorage(): void {
  if (localStorage.getItem(storageVersionKey) === storageVersion) {
    return
  }

  legacyStorageKeys.forEach((key) => localStorage.removeItem(key))
  localStorage.setItem(storageVersionKey, storageVersion)
}