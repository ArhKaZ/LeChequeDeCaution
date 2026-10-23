import Info from '../components/Info'
import PageHeading from '../components/PageHeading'
import './Details.css'
import { eventConfig } from '../eventConfig'

interface DetailsProps {
  onNext: () => void
}

export default function Details({ onNext }: DetailsProps) {
    return <section className="content-page page-enter"><PageHeading kicker="Le jour j" title="Les infos de base" />
        <div className="info-grid">
            <Info label="Quand" value={eventConfig.date} detail={`À partir de ${eventConfig.time}`} />
            <Info label="Où" value={eventConfig.venue} detail="L'adresse arrive avec ton billet" />
            <Info label="Quoi" value="Boire, discuter, fumer, danser" detail="Faites ce que vous voulez" />
        </div>
        <div className="note-block">
            <span className="note-icon">✳</span>
            <p>Des événements sont prévus pendant la soirée. Une photo de vous ou de votre groupe sera prise à l’entrée.</p>
            </div>
        <button className="button primary full" onClick={onNext}>Continuer <span>→</span></button>
    </section>
}
