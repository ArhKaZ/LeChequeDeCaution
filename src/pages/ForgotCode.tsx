import { useState } from 'react'
import PageHeading from '../components/PageHeading'
import { findGuestByEmail, isFirebaseConfigured } from '../firebase'
import { go } from '../navigation'
import '../forms.css'
import Alert from '../components/Alert'

export default function ForgotCode() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const guest = await findGuestByEmail(email)
      if (!guest) {
        setMessage('Aucun billet ne correspond à cette adresse.')
      } else if (isFirebaseConfigured) {
        setMessage('La demande est enregistrée. La récupération par e-mail nécessite encore la configuration du service d’envoi.')
      } else {
        setMessage(`Mode démo : ton code est ${guest.pin}.`)
      }
    } catch {
      setMessage('Impossible de traiter la demande pour le moment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="content-page page-enter">
      <PageHeading kicker="Code oublié" title="On va retrouver ton billet." />
      <p className="section-intro">Indique ton e-mail. En production, un service sécurisé pourra t’envoyer un lien ou un nouveau code.</p>
      <form className="guest-form" onSubmit={submit}>
        <label>
          Adresse e-mail
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="camille@email.com"
            autoComplete="email"
          />
        </label>
        {message && (
          <Alert className="form-message" onClose={() => setMessage('')}>
            {message}
          </Alert>
        )}
        <button className="button primary full" disabled={loading} type="submit">
          {loading ? 'Recherche…' : 'Récupérer mon code'} <span>→</span>
        </button>
      </form>
      <button className="button quiet full" onClick={() => go('access')}>
        Retour à “déjà inscrit·e”
      </button>
    </section>
  )
}
