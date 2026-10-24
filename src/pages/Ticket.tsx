import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { QRCodeSVG } from 'qrcode.react'
import PageHeading from '../components/PageHeading'
import { go } from '../navigation'
import './Ticket.css'
import type { Event, Guest } from '../types'
import { eventConfig } from '../eventConfig'

interface TicketProps {
  guest: Guest | null
  events: Event[]
  onEdit: () => void
}

export default function Ticket({ guest, events, onEdit }: TicketProps) {
  if (!guest) return <section className="content-page page-enter">
    <PageHeading kicker="Ton accès personnel" title="Ton billet apparaîtra ici." />
    <button className="button primary full" onClick={() => go('details')}>S'inscrire <span>→</span></button></section>

  const currentGuest = guest
  const checkInUrl = `${window.location.origin}${window.location.pathname}#/checkin/${currentGuest.ticketId}`
  const ticketRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const agenda = events
    .filter((event) => event.validated && event.registrants.includes(currentGuest.id))
    .sort((first, second) => first.hour.localeCompare(second.hour))

  async function downloadTicket(): Promise<void> {
    if (!ticketRef.current) {
      return
    }

    setDownloading(true)

    try {
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: '#fffdf9',
        scale: 2,
      })
      const image = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })
      const width = 170
      const height = (canvas.height * width) / canvas.width

      pdf.addImage(image, 'PNG', 20, 35, width, height)
      pdf.save(`billet-${currentGuest.name.replace(/\s+/g, '-').toLowerCase()}.pdf`)
    } finally {
      setDownloading(false)
    }
  }

  return <section className="content-page page-enter">
    <PageHeading kicker="Ton accès personnel" title="Le billet est à toi." />
    <div className="ticket" ref={ticketRef}>
      <div className="ticket-top">
        <div>
          <span className="ticket-label">INVITATION</span>
          <h2>{eventConfig.title}</h2>
          <p>{eventConfig.date} · {eventConfig.time}</p>
        </div>
        <span className="ticket-stamp">{eventConfig.address}</span>
      </div>
      <div className="ticket-divider" />
      <div className="ticket-bottom">
        <QRCodeSVG value={checkInUrl} size={142} bgColor="#fffdf9" fgColor="#16201d" level="M" />
        <div className="ticket-meta">
          <span className="ticket-label">AU NOM DE</span>
          <strong>{currentGuest.name}</strong>
          <span>{currentGuest.email}</span>
          <span className="ticket-id">#{currentGuest.ticketId.slice(0, 8).toUpperCase()}</span>
        </div>
      </div>
    </div>
    <p className="helper">Présente ce QR code à l'entrée. Le scan ouvre la validation de ton arrivée.</p>
    <section className="ticket-agenda" aria-labelledby="ticket-agenda-title">
      <span className="ticket-label">TON PROGRAMME</span>
      <h2 id="ticket-agenda-title">Agenda</h2>
      {agenda.length === 0 ? (
        <p className="ticket-agenda-empty">Aucun événement réservé pour le moment.</p>
      ) : (
        <div className="agenda-list">
          {agenda.map((event) => (
            <div className="agenda-item" key={event.id}>
              <time dateTime={event.hour}>{event.hour}</time>
              <strong>{event.name}</strong>
            </div>
          ))}
        </div>
      )}
    </section>
    <button className="button primary full" onClick={onEdit}>Modifier ce que j’apporte</button>
    <button className="button quiet full" onClick={downloadTicket} disabled={downloading}>
      {downloading ? 'Préparation du téléchargement…' : 'Télécharger mon billet'}
    </button>
  </section>
}
