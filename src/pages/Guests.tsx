import PageHeading from '../components/PageHeading'
import './Guests.css'
import type { Guest } from '../types'

interface GuestsProps {
  guests: Guest[]
  arrivedCount: number
  loading: boolean
  onCheckIn: (guest: Guest) => void
}

export default function Guests({ guests, arrivedCount, loading }: GuestsProps) {
  return <section className="content-page page-enter">
    <PageHeading kicker="Petit coquin" title="Qui est déjà arrivé ?" />
    <div className="stats">
      <strong>{arrivedCount}<small> / {guests.length}</small></strong>
      <span>invité·es arrivé·es</span>
      <div className="progress">
        <i style={{ width: guests.length ? `${arrivedCount / guests.length * 100}%` : '0%' }} />
      </div>
    </div>{loading ? <p className="empty">Chargement…</p> : guests.length === 0 ?
      <p className="empty">Les inscriptions apparaîtront ici.</p> :
      <div className="guest-list">{guests.map((item) => <div className="guest-row" key={item.id}>
        <span className={`avatar ${item.arrived ? 'arrived' : ''}`}>{item.name?.charAt(0).toUpperCase()}</span>
        <div>
          <strong>{item.name}</strong><small>{item.email}</small>
        </div>{item.arrived ? <span className="arrived-label" color='green'>Arrivé</span> :
          <span className="arrived-label">Sur la route</span>}
      </div>)}
      </div>}
  </section>
}
