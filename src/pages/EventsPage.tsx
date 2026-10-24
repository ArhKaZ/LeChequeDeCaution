import { useState } from 'react'
import EventsCard from '../components/EventsCard'
import PageHeading from '../components/PageHeading'
import type { Event, EventInput, Guest } from '../types'
import './EventsPage.css'

interface EventsPageProps {
  eventList: Event[]
  currentGuest: Guest | null
  onCreateEvent: (event: Omit<EventInput, 'createdBy'>) => Promise<void>
  onRegisterEvent: (event: Event) => Promise<void>
  onValidateEvent: (event: Event) => void
}

export default function EventsPage({
  eventList,
  currentGuest,
  onCreateEvent,
  onRegisterEvent,
  onValidateEvent,
}: EventsPageProps) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [hour, setHour] = useState('')
  const [description, setDescription] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onCreateEvent({
        name, hour, description,
        validated: false,
        registrants: []
    })
    setName('')
    setHour('')
    setDescription('')
    setShowForm(false)
  }

  return (
    <section className="content-page page-enter events-page">
      <PageHeading
        kicker="Les événements"
        title="Inscris-toi ou ajoute-en !"
      />
      <div className='content-container'>
      <div className="list-events">
        {eventList.length === 0 ? (
          <p className="empty">Aucun événement proposé pour le moment.</p>
        ) : (
          eventList.map((event) => (
            <EventsCard
              key={event.id}
              event={event}
              onRegister={() => onRegisterEvent(event)}
              onValidate={() => onValidateEvent(event)}
              canRegister={Boolean(currentGuest)}
              isRegistered={Boolean(currentGuest && event.registrants.includes(currentGuest.id))}
            />
          ))
        )}
      </div>
      {showForm && (
        <form className="guest-form event-form" onSubmit={submit}>
          <label>
            Nom de l’événement
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Blind test musical"
            />
          </label>
          <label>
            Heure
            <input
              required
              type="time"
              value={hour}
              onChange={(event) => setHour(event.target.value)}
            />
          </label>
          <label>
            Description
            <textarea
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Décris l’activité et ce qu’il faut prévoir."
              rows={4}
            />
          </label>
          <button className="button primary full" type="submit">
            Proposer l’événement <span>→</span>
          </button>
        </form>
      )}
      <div className="btn-add-event">
        <button
          disabled={!currentGuest}
          onClick={() => setShowForm((visible) => !visible)}
          title={!currentGuest ? 'Inscris-toi pour proposer un événement' : undefined}
        >
          {showForm ? 'Fermer' : 'Proposer un événement'}
        </button>
      </div>
      </div>
    </section>
  )
}
