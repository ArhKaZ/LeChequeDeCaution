import { useState } from 'react'
import PageHeading from '../components/PageHeading'
import { go } from '../navigation'
import '../forms.css'
import Alert from '../components/Alert'

interface AccessPageProps {
  onSubmit: (credentials: { email: string; pin: string }) => void
  loading: boolean
  error: string
  onClearError: () => void
}

export default function AccessPage({ onSubmit, loading, error, onClearError }: AccessPageProps) {
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({ email, pin })
  }

  return (
    <section className="content-page page-enter">
      <PageHeading kicker="Retrouver mon billet" title="Tu es déjà inscrit·e ?" />
      <p className="section-intro">Entre l’adresse utilisée lors de ton inscription et ton code à 4 chiffres.</p>
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
        <label>
          Code à 4 chiffres
          <input
            required
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            value={pin}
            onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="0000"
            autoComplete="off"
          />
        </label>
        {error && (
          <Alert className="form-error" onClose={onClearError}>
            {error}
          </Alert>
        )}
        <button className="button primary full" disabled={loading} type="submit">
          {loading ? 'Recherche…' : 'Revoir mon billet'} <span>→</span>
        </button>
      </form>
      <button className="button quiet full" onClick={() => go('forgot')}>
        J’ai oublié mon code
      </button>
    </section>
  )
}
