import { useState } from 'react'
import type { FormEvent } from 'react'
import { checkInGuest, getGuests } from '../firebase'
import PageHeading from '../components/PageHeading'
import { go } from '../navigation'
import './CheckIn.css'
import Alert from '../components/Alert'
import type { Guest } from '../types'

const organizerCode = import.meta.env.VITE_CHECKIN_CODE

interface CheckInProps {
  ticketId: string
}

type CheckInState = 'locked' | 'wrong-code' | 'not-configured' | 'loading' | 'missing' | 'error' | 'already' | 'success'

export default function CheckIn({ ticketId }: CheckInProps) {
  const [code, setCode] = useState('')
  const [state, setState] = useState<CheckInState>('locked')
  const [name, setName] = useState('')

  async function validate(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    if (!organizerCode) {
      setState('not-configured')
      return
    }

    if (code !== organizerCode) {
      setState('wrong-code')
      return
    }

    setState('loading')

    try {
      const guest: Guest | undefined = (await getGuests()).find(
        (item) => item.ticketId === ticketId,
      )

      if (!guest) {
        setState('missing')
        return
      }

      setName(guest.name)

      if (!guest.arrived) {
        await checkInGuest(guest.id)
        setState('success')
      } else {
        setState('already')
      }
    } catch {
      setState('error')
    }
  }

  if (state === 'locked' || state === 'wrong-code' || state === 'not-configured') {
    return (
      <section className="content-page page-enter checkin-page">
        <div className="checkin-mark">⌕</div>
        <PageHeading
          kicker="Validation d’entrée"
          title="Code organisateur requis."
        />
        <p className="section-intro">
          Scanne le billet, puis saisis le code réservé à l’organisation.
        </p>
        <form className="guest-form checkin-form" onSubmit={validate}>
          <label>
            Code organisateur
            <input
              required
              type="password"
              inputMode="text"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Code secret"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck="false"
            />
          </label>
          {state === 'wrong-code' && (
            <Alert className="form-error" onClose={() => setState('locked')}>
              Le code organisateur est incorrect.
            </Alert>
          )}
          {state === 'not-configured' && (
            <Alert className="form-error" onClose={() => setState('locked')}>
              Le code organisateur n’est pas configuré dans `.env.local`.
            </Alert>
          )}
          <button className="button primary full" type="submit">
            Confirmer l’arrivée <span>→</span>
          </button>
        </form>
      </section>
    )
  }

  const title = state === 'loading'
    ? 'Vérification…'
    : state === 'missing'
      ? 'Billet introuvable.'
      : state === 'error'
        ? 'Une erreur est survenue.'
        : state === 'already'
          ? 'Déjà validé.'
          : 'Bienvenue à la fête.'

  return (
    <section className="content-page page-enter checkin-page">
      <div className="checkin-mark">
        {state === 'success' || state === 'already' ? '✓' : '!'}
      </div>
      <PageHeading kicker="Validation d’entrée" title={title} />
      {name && (
        <p className="intro">
          {name}, ton arrivée est bien enregistrée.
        </p>
      )}
      <button className="button quiet full" onClick={() => go('guests')}>
        Retour à la liste
      </button>
    </section>
  )
}
