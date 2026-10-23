import { initializeApp } from 'firebase/app'
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getDocs as getMatchingDocs,
  getFirestore,
  initializeFirestore,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import type { Event, EventInput, Guest, GuestInput, GuestUpdates } from './types'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean)
const firebaseApp = isFirebaseConfigured ? initializeApp(firebaseConfig) : null
let db: ReturnType<typeof getFirestore> | null = null

if (firebaseApp) {
  try {
    db = initializeFirestore(firebaseApp, {
      experimentalForceLongPolling: true,
    })
  } catch {
    db = getFirestore(firebaseApp)
  }
}

function withTimeout<T>(request: Promise<T>, message: string): Promise<T> {
  return Promise.race([
    request,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject(new Error(message)), 15000)
    }),
  ])
}

const localKey = 'birthday-guest-list-v2'
const eventsLocalKey = 'birthday-event-list-v2'
const eventsCollection = 'events'
const readLocal = (): Guest[] => JSON.parse(localStorage.getItem(localKey) || '[]') as Guest[]
const writeLocal = (guests: Guest[]): void => localStorage.setItem(localKey, JSON.stringify(guests))
const readLocalEvents = (): Event[] => JSON.parse(localStorage.getItem(eventsLocalKey) || '[]') as Event[]

function mapEventData(data: Record<string, unknown>): Record<string, unknown> {
  return {
    ...data,
    hour: data.hour ?? data.heure ?? '',
    name: data.name ?? data.nom ?? '',
    validated: data.validated ?? data.valide ?? false,
    registrants: data.registrants ?? data.inscrits ?? [],
    createdBy: data.createdBy ?? data.createur ?? '',
  }
}

export async function saveGuest(guest: GuestInput): Promise<Guest> {
  if (db) {
    const reference = await withTimeout(
      addDoc(collection(db, 'guests'), {
        ...guest,
        createdAt: serverTimestamp(),
      }),
      'Firebase ne répond pas. Vérifie la connexion et les règles Firestore.',
    )
    return { ...guest, id: reference.id }
  }

  const saved: Guest = { ...guest, id: guest.ticketId }
  writeLocal([...readLocal().filter((item) => item.id !== saved.id), saved])
  return saved
}

export async function getGuests(): Promise<Guest[]> {
  if (db) {
    const snapshot = await getDocs(collection(db, 'guests'))
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Guest))
  }
  return readLocal()
}

export async function getEvents(): Promise<Event[]> {
  if (db) {
    const snapshot = await getDocs(collection(db, eventsCollection))
    return snapshot.docs.map((item) => ({
      id: item.id,
      hour: '',
      name: '',
      validated: false,
      registrants: [],
      createdBy: '',
      ...mapEventData(item.data()),
    } as Event))
  }

  return readLocalEvents()
}

export async function saveEvent(event: EventInput): Promise<Event> {
  if (db) {
    const reference = await withTimeout(
      addDoc(collection(db, eventsCollection), event),
      'Firebase ne répond pas. Vérifie la connexion et les règles Firestore.',
    )

    return { ...event, id: reference.id }
  }

  const savedEvent: Event = { ...event, id: crypto.randomUUID() }
  const events = [...readLocalEvents(), savedEvent]
  localStorage.setItem(eventsLocalKey, JSON.stringify(events))
  return savedEvent
}

export async function validateEvent(eventId: string): Promise<void> {
  if (db) {
    await updateDoc(doc(db, eventsCollection, eventId), { validated: true })
    return
  }

  const events = readLocalEvents().map((event) => (
    event.id === eventId ? { ...event, validated: true } : event
  ))
  localStorage.setItem(eventsLocalKey, JSON.stringify(events))
}

export async function updateEventRegistrants(
  eventId: string,
  registrants: string[],
): Promise<void> {
  if (db) {
    await updateDoc(doc(db, eventsCollection, eventId), { registrants })
    return
  }

  const events = readLocalEvents().map((event) => (
    event.id === eventId ? { ...event, registrants } : event
  ))
  localStorage.setItem(eventsLocalKey, JSON.stringify(events))
}

export async function checkInGuest(guestId: string): Promise<void> {
  if (db) {
    await updateDoc(doc(db, 'guests', guestId), { arrived: true, arrivedAt: serverTimestamp() })
    return
  }
  writeLocal(readLocal().map((guest) => guest.id === guestId ? { ...guest, arrived: true } : guest))
}

export async function findGuest(name: string, pin: string): Promise<Guest | null> {
  if (db) {
    const guestQuery = query(
      collection(db, 'guests'),
      where('name', '==', name),
      where('pin', '==', pin),
    )
    const snapshot = await getMatchingDocs(guestQuery)
    const matchingGuest = snapshot.docs[0]
    return matchingGuest ? { id: matchingGuest.id, ...matchingGuest.data() } as Guest : null
  }

  return readLocal().find((guest) => guest.name === name && guest.pin === pin) || null
}

export async function updateGuest(guestId: string, updates: GuestUpdates): Promise<void> {
  if (db) {
    await updateDoc(doc(db, 'guests', guestId), { ...updates })
    return
  }

  writeLocal(readLocal().map((guest) => guest.id === guestId ? { ...guest, ...updates } : guest))
}

export async function findGuestByEmail(email: string): Promise<Guest | null> {
  if (db) {
    const guestQuery = query(collection(db, 'guests'), where('email', '==', email))
    const snapshot = await getMatchingDocs(guestQuery)
    const matchingGuest = snapshot.docs[0]
    return matchingGuest ? { id: matchingGuest.id, ...matchingGuest.data() } as Guest : null
  }

  return readLocal().find((guest) => guest.email === email) || null
}
