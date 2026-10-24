import PageHeading from '../components/PageHeading'
import './BringList.css'
import type { BringItems } from '../types'

interface BringListProps {
  items: BringItems
  loading: boolean
}

export default function BringList({ items, loading }: BringListProps) {
  return <section className="content-page page-enter">
    <PageHeading kicker="Remplissez mon frigo" title="Ce que les gens ramènent" />
    <p className="section-intro">N'hésitez pas à faire des stocks pendant les manifs.</p>
    {loading ? <p className="empty">Chargement…</p> : Object.keys(items).length === 0 ? <p className="empty">Aucune idée pour l'instant.</p> :
      <div className="bring-list">{Object.values(items).map((item) => <div className="bring-row" key={item.label}><span>✦</span><div><strong>
        {item.label}</strong><small>{item.people.join(' · ')}</small>
      </div>
      </div>
      )}
      </div>
    }
  </section>
}
