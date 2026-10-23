import { useState } from 'react'
import PageHeading from '../components/PageHeading'
import type { Event } from '../types'
import Alert from '../components/Alert'

interface EventValidationPageProps {
  event: Event | undefined
  loading: boolean
  error: string
  onSubmit: (code: string) => Promise<void>
  onClearError: () => void
}

export default function EventValidationPage({
  event,
  loading,
  error,
  onSubmit,
  onClearError,
}: EventValidationPageProps) {
  const [code, setCode] = useState('')

  async function submit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault()
    await onSubmit(code)
  }

  if (!event) {
    return (
      <section className="content-page page-enter">
        <PageHeading
          kicker="Validation de l’événement"
          title="Événement introuvable."
        />
      </section>
    )
  }

  if (event.validated) {
    return (
      <section className="content-page page-enter">
        <PageHeading
          kicker="Validation de l’événement"
          title="Cet événement est déjà validé."
        />
        <p className="section-intro">
          {event.name} · {event.hour}
        </p>
      </section>
    )
  }

  return (
    <section className="content-page page-enter">
      <PageHeading
        kicker="Validation de l’événement"
        title="Valider cet événement"
      />
      <p className="section-intro">
        {event.name} · {event.hour}
      </p>
      <form className="guest-form" onSubmit={submit}>
        <label>
          Code du gérant
          <input
            required
            type="password"
            inputMode="numeric"
            value={code}
            onChange={(formInput) => setCode(formInput.target.value)}
            placeholder="Code secret"
            autoComplete="off"
          />
        </label>
        {error && (
          <Alert className="form-error" onClose={onClearError}>
            {error}
          </Alert>
        )}
        <button className="button primary full" disabled={loading} type="submit">
          {loading ? 'Validation…' : 'Valider l’événement'} <span>→</span>
        </button>
      </form>
    </section>
  )
}
