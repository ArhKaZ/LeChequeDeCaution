import { useState } from 'react'
import type { Event } from '../types'
import './EventsCard.css';

interface EventsCardProps {
    event: Event
    onRegister: () => void
    onValidate: () => void
    canRegister: boolean
    isRegistered: boolean
}

export default function EventsCard({
    event,
    onRegister,
    onValidate,
    canRegister,
    isRegistered,
}: EventsCardProps) {
    const [showConfirmation, setShowConfirmation] = useState(false)

    function confirmRegistration(): void {
        setShowConfirmation(false)
        onRegister()
    }

    return (
        <>
        <div className="card">
            <div className="column-card">
                <p>{event.name}</p>
                <p>{event.hour}</p>
                <small>Proposé par {event.createdByGuest?.name || 'un invité'}</small>
                
            </div>
            <div className="column-card">
            {event.validated ? 
                <>
                    <button
                        className='button primary'
                        disabled={!canRegister || isRegistered}
                        onClick={() => setShowConfirmation(true)}
                    >
                        S'inscrire
                    </button>
                    <small>{event.registeredGuests?.length || 0} inscrit·es</small>
                </> : 
                <>
                    <p>Attente de validation</p>
                </>}
            </div>
        </div>
        {showConfirmation && (
            <div className="event-modal-backdrop" role="presentation">
                <div
                    className="event-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={`event-title-${event.id}`}
                >
                    <p className="event-modal-kicker">Inscription</p>
                    <h2 id={`event-title-${event.id}`}>{event.name}</h2>
                    <p className="event-modal-hour">{event.hour}</p>
                    <p className="event-modal-description">
                        {event.description || 'Aucune description pour cet événement.'}
                    </p>
                    <div className="event-modal-actions">
                        <button className="button primary" onClick={confirmRegistration}>
                            S'inscrire
                        </button>
                        <button className="button quiet" onClick={() => setShowConfirmation(false)}>
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}