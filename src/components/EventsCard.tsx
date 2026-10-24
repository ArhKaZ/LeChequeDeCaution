import type { Event } from '../types'
import './EventsCard.css';

interface EventsCardProps {
    event: Event
    onRegister: () => void
    onValidate: () => void
    canRegister: boolean
}

export default function EventsCard({
    event,
    onRegister,
    onValidate,
    canRegister,
}: EventsCardProps) {
    return (
        <div className="card">
            <div className="column-card">
                <p>{event.name}</p>
                <p>{event.hour}</p>
                <small>Proposé par {event.createdByGuest?.name || 'un invité'}</small>
                
            </div>
            <div className="column-card">
            {event.validated ? 
                <>
                    <button className='button primary' disabled={!canRegister} onClick={onRegister}>
                        S'inscrire
                    </button>
                    <small>{event.registeredGuests?.length || 0} inscrit·es</small>
                </> : 
                <>
                    <p>Attente de validation</p>
                    {/* <button className="button" onClick={onValidate}>
                        Valider
                    </button> */}
                </>}
            </div>
        </div>
    )
}