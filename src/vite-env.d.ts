/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHECKIN_CODE?: string
  readonly VITE_EVENT_TITLE?: string
  readonly VITE_EVENT_AGE?: string
  readonly VITE_EVENT_DATE?: string
  readonly VITE_EVENT_TIME?: string
  readonly VITE_EVENT_CITY?: string
  readonly VITE_EVENT_VENUE?: string
  readonly VITE_EVENT_ADDRESS?: string
  readonly VITE_FIREBASE_API_KEY?: string
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string
  readonly VITE_FIREBASE_PROJECT_ID?: string
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string
  readonly VITE_FIREBASE_APP_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.css'
