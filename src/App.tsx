import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import {
  checkInGuest,
  findGuest,
  getEvents,
  getGuests,
  isFirebaseConfigured,
  saveGuest,
  saveEvent,
  updateGuest,
  updateEventRegistrants,
  validateEvent,
} from './firebase'
import { currentPage, go } from './navigation'
import Home from './pages/Home'
import Details from './pages/Details'
import Rules from './pages/Rules'
import FormPage from './pages/FormPage'
import Ticket from './pages/Ticket'
import Guests from './pages/Guests'
import BringList from './pages/BringList'
import CheckIn from './pages/CheckIn'
import AccessPage from './pages/AccessPage'
import ForgotCode from './pages/ForgotCode'
import './app.css'
import type { BringItems, Event, FormState, Guest, GuestUpdates, Page } from './types'
import EventsPage from './pages/EventsPage'
import EventValidationPage from './pages/EventValidationPage'
import Alert from './components/Alert'
import { eventConfig } from './eventConfig'
import FlemmePage from './pages/FlemmePage'
import { currentGuestStorageKey, initializeStorage } from './storage'

initializeStorage()

const defaultForm: FormState = {
  name: '',
  email: '',
  phone: '',
  pin: '',
  bring: [''],
}

export default function App() {
  const [page, setPage] = useState<Page>(currentPage)
  const [form, setForm] = useState<FormState>(defaultForm)
  const [rulesAccepted, setRulesAccepted] = useState(false)
  const [guest, setGuest] = useState<Guest | null>(() => (
    JSON.parse(localStorage.getItem(currentGuestStorageKey) || 'null') as Guest | null
  ))
  const [guests, setGuests] = useState<Guest[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [accessError, setAccessError] = useState('')
  const [eventError, setEventError] = useState('')

  useEffect(() => {
    const sync = () => setPage(currentPage())
    window.addEventListener('hashchange', sync)

    return () => window.removeEventListener('hashchange', sync)
  }, [])

  useEffect(() => {
    if (page === 'guests' || page === 'bring' || page === 'events') {
      refreshGuests()
    }
    if (page === 'events' || page === 'event-validation') {
      refreshEvents()
    }
  }, [page])

  useEffect(() => {
    if (!message) {
      return
    }

    const timeout = window.setTimeout(() => setMessage(''), 6000)
    return () => window.clearTimeout(timeout)
  }, [message])

  async function refreshGuests() {
    setLoading(true)

    try {
      setGuests(await getGuests())
    } catch {
      setMessage('Impossible de charger les invités pour le moment.')
    } finally {
      setLoading(false)
    }
  }

  async function refreshEvents(): Promise<void> {
    setLoading(true)

    try {
      setEvents(await getEvents())
    } catch {
      setMessage('Impossible de charger les événements pour le moment.')
    } finally {
      setLoading(false)
    }
  }

  function updateForm(event: ChangeEvent<HTMLInputElement> | { target: { name: string; value: string | string[] } }): void {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  async function register(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    if (page === 'form' && !rulesAccepted) {
      go('rules')
      return
    }

    setLoading(true)

    try {
      if (page === 'edit' && guest) {
        const updates: GuestUpdates = {
          name: form.name,
          phone: form.phone,
          bring: form.bring,
        }
        await updateGuest(guest.id, updates)

        const updatedGuest = {
          ...guest,
          name: form.name,
          phone: form.phone,
          bring: form.bring,
        }

        setGuest(updatedGuest)
        localStorage.setItem(
          currentGuestStorageKey,
          JSON.stringify(updatedGuest),
        )
      } else {
        const savedGuest = await saveGuest({
          ...form,
          ticketId: crypto.randomUUID(),
          arrived: false,
          createdAt: new Date().toISOString(),
        })

        setGuest(savedGuest)
        localStorage.setItem(
          currentGuestStorageKey,
          JSON.stringify(savedGuest),
        )
      }

      go('ticket')
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Impossible de créer ou modifier le billet pour le moment.'
      setMessage(message)
    } finally {
      setLoading(false)
    }
  }

  async function accessTicket(credentials: { name: string; pin: string }): Promise<void> {
    setLoading(true)
    setAccessError('')

    try {
      const matchingGuest = await findGuest(
        credentials.name,
        credentials.pin,
      )

      if (!matchingGuest) {
        setAccessError('Nom ou code incorrect.')
        return
      }

      setGuest(matchingGuest)
      localStorage.setItem(
        currentGuestStorageKey,
        JSON.stringify(matchingGuest),
      )
      go('ticket')
    } catch {
      setAccessError('Impossible de retrouver le billet pour le moment.')
    } finally {
      setLoading(false)
    }
  }

  async function createEvent(input: { name: string; hour: string }): Promise<void> {
    if (!guest) {
      setMessage('Inscris-toi avant de proposer un événement.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const savedEvent = await saveEvent({
        ...input,
        validated: false,
        registrants: [],
        createdBy: guest.id,
      })
      setEvents((currentEvents) => [...currentEvents, savedEvent])
      setMessage('Ton événement a été proposé.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Impossible de proposer cet événement.')
    } finally {
      setLoading(false)
    }
  }

  async function registerForEvent(event: Event): Promise<void> {
    if (!guest || event.registrants.includes(guest.id)) {
      return
    }

    try {
      const registrants = [...event.registrants, guest.id]
      await updateEventRegistrants(event.id, registrants)
      setEvents((currentEvents) => currentEvents.map((currentEvent) => (
        currentEvent.id === event.id
          ? { ...currentEvent, registrants }
          : currentEvent
      )))
      setMessage('Tu es inscrit·e à cet événement.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Impossible de t’inscrire à cet événement.')
    }
  }

  async function confirmEventValidation(code: string): Promise<void> {
    setEventError('')

    if (!import.meta.env.VITE_CHECKIN_CODE) {
      setEventError('Le code du gérant n’est pas configuré.')
      return
    }

    if (code !== import.meta.env.VITE_CHECKIN_CODE) {
      setEventError('Le code du gérant est incorrect.')
      return
    }

    const eventId = window.location.hash.split('/')[2]
    if (!eventId) {
      setEventError('L’événement demandé est introuvable.')
      return
    }

    setLoading(true)

    try {
      await validateEvent(eventId)
      setEvents((currentEvents) => currentEvents.map((event) => (
        event.id === eventId ? { ...event, validated: true } : event
      )))
      setMessage('L’événement est validé.')
      go('events')
    } catch (error) {
      setEventError(error instanceof Error ? error.message : 'Impossible de valider cet événement.')
    } finally {
      setLoading(false)
    }
  }

  function openEventValidation(event: Event): void {
    window.location.hash = `/event-validation/${event.id}`
  }

  function editGuest(): void {
    if (!guest) {
      return
    }

    setForm({
      name: guest.name || '',
      email: guest.email || '',
      phone: guest.phone || '',
      pin: guest.pin || '',
      bring: Array.isArray(guest.bring)
        ? guest.bring
        : [guest.bring || ''],
    })
    go('edit')
  }

  async function markArrived(item: Guest): Promise<void> {
    await checkInGuest(item.id)
    setGuests(guests.map((guestItem) => (
      guestItem.id === item.id
        ? { ...guestItem, arrived: true }
        : guestItem
    )))
  }

  const arrivedCount = guests.filter((item) => item.arrived).length
  const bringItems = guests.reduce<BringItems>((items, item) => {
    const contributions = Array.isArray(item.bring)
      ? item.bring
      : [item.bring]

    contributions.filter(Boolean).forEach((contribution) => {
      const label = contribution.trim()

      if (!label) {
        return
      }

      const key = label.toLowerCase()
      items[key] = {
        label,
        people: [...(items[key]?.people || []), item.name],
      }
    })

    return items
  }, {})

  const eventList = events.map((event) => ({
    ...event,
    registeredGuests: guests.filter((guestItem) => (
      event.registrants.includes(guestItem.id)
    )),
    createdByGuest: guests.find((guestItem) => guestItem.id === event.createdBy),
  }))
  const selectedEventId = window.location.hash.split('/')[2]
  const selectedEvent = eventList.find((event) => event.id === selectedEventId)

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="brand"
          onClick={() => go('home')}
          aria-label="Retour à l'accueil"
        >
          <span className="brand-mark">26</span>
          <span>{eventConfig.title}</span>
        </button>
      </header>

      <main className="page-wrap">
        {page === 'home' && <Home />}
        {page === 'details' && <Details onNext={() => go('rules')} />}
        {page === 'rules' && (
          <Rules
            accepted={rulesAccepted}
            setAccepted={setRulesAccepted}
            onNext={() => go('form')}
          />
        )}
        {(page === 'form' || page === 'edit') && (
          <FormPage
            form={form}
            updateForm={updateForm}
            onSubmit={register}
            loading={loading}
            isEditing={page === 'edit'}
          />
        )}
        {page === 'ticket' && <Ticket guest={guest} onEdit={editGuest} />}
        {page === 'access' && (
          <AccessPage
            onSubmit={accessTicket}
            loading={loading}
            error={accessError}
            onClearError={() => setAccessError('')}
          />
        )}
        {page === 'forgot' && <ForgotCode />}
        {page === 'guests' && (
          <Guests
            guests={guests}
            arrivedCount={arrivedCount}
            loading={loading}
            onCheckIn={markArrived}
          />
        )}
        {page === 'bring' && (
          <BringList items={bringItems} loading={loading} />
        )}
        {page === 'checkin' && (
          <CheckIn ticketId={window.location.hash.split('/')[2]} />
        )}
        {message && (
          <Alert
            className="toast"
            onClose={() => setMessage('')}
          >
            {message}
          </Alert>
        )}
        {page === 'events' && (
          <EventsPage
            eventList={eventList}
            currentGuest={guest}
            onCreateEvent={createEvent}
            onRegisterEvent={registerForEvent}
            onValidateEvent={openEventValidation}
          />
        )}
        {page === 'event-validation' && (
          <EventValidationPage
            event={selectedEvent}
            loading={loading}
            error={eventError}
            onSubmit={confirmEventValidation}
            onClearError={() => setEventError('')}
          />
        )}
        {page === 'flemme-page' && (
          <FlemmePage/>
        )}
      </main>

      <nav className="bottom-nav" aria-label="Navigation principale">
        <button
          className={page === 'home' ? 'active' : ''}
          onClick={() => go('home')}
        >
          <span>⌂</span>
          Accueil
        </button>
        <button
          className={page === 'ticket' ? 'active' : ''}
          onClick={() => go('ticket')}
        >
          <span>▣</span>
          Mon billet
        </button>
        <button
          className={page === 'guests' ? 'active' : ''}
          onClick={() => go('guests')}
        >
          <span>◉</span>
          Arrivées
        </button>
        <button
          className={page === 'bring' ? 'active' : ''}
          onClick={() => go('bring')}
        >
          <span>♧</span>
          À apporter
        </button>
        <button
          className={page === 'events' ? 'active' : ''}
          onClick={() => go('events')}
        >
          <span>📅</span>
          Événements
        </button>
      </nav>
    </div>
  )
}
