import PageHeading from '../components/PageHeading'
import type { FormEvent } from 'react'
import type { FormState } from '../types'
import './FormPage.css'
import '../forms.css'

interface FormPageProps {
  form: FormState
  updateForm: (event: { target: { name: string; value: string | string[] } }) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  loading: boolean
  isEditing: boolean
}

export default function FormPage({ form, updateForm, onSubmit, loading, isEditing }: FormPageProps) {
  function updateBring(index: number, value: string): void {
    const nextItems = form.bring.map((item, itemIndex) => (
      itemIndex === index ? value : item
    ))
    updateForm({ target: { name: 'bring', value: nextItems } })
  }

  function addBring() {
    updateForm({
      target: {
        name: 'bring',
        value: [...form.bring, ''],
      },
    })
  }

  function removeBring(index: number): void {
    const nextItems = form.bring.filter((_, itemIndex) => itemIndex !== index)
    updateForm({
      target: {
        name: 'bring',
        value: nextItems.length ? nextItems : [''],
      },
    })
  }

  return (
    <section className="content-page page-enter">
      <PageHeading
        kicker={isEditing ? 'Modifier mon billet' : 'Prends ta place'}
        title={isEditing ? 'Tu peux encore ajuster ta liste.' : 'Les petites infos dont j’ai besoin'}
      />
      <form className="guest-form" onSubmit={onSubmit}>
        <label>
          Ton petit nom (tu peux en mettre un faux)
          <input
            required
            name="name"
            value={form.name}
            onChange={updateForm}
            placeholder="Jean-Philippe Tanguy"
            autoComplete="name"
          />
        </label>
        {!isEditing && <label>
          Mon code à 4 chiffres <small>(pour retrouver ton billet)</small>
          <input
            required
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            name="pin"
            value={form.pin}
            onChange={(event) => updateForm({
              target: {
                name: 'pin',
                value: event.target.value.replace(/\D/g, '').slice(0, 4),
              },
            })}
            placeholder="0000"
            autoComplete="new-password"
          />
        </label>}
        <fieldset className="bring-fields">
          <legend>
            Remplis mon frigo<small> (Si tu ramènes juste ton cul c'est ok aussi)</small>
          </legend>
          {form.bring.map((item, index) => (
            <div className="bring-input-row" key={index}>
              <input
                name={`bring-${index}`}
                value={item}
                onChange={(event) => updateBring(index, event.target.value)}
                placeholder={index === 0 ? 'Bœuf wagyu' : 'Un autre objet…'}
              />
              {form.bring.length > 1 && (
                <button
                  className="remove-item"
                  type="button"
                  onClick={() => removeBring(index)}
                  aria-label={`Supprimer l'objet ${index + 1}`}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button className="add-item" type="button" onClick={addBring}>+ Ajouter un objet</button>
        </fieldset>
        <legend>
          Tu pourras mettre à jour la liste de ce que tu ramènes le jour J si tu y penses !
        </legend>
        <button className="button primary full" disabled={loading} type="submit">
          {loading ? 'Enregistrement…' : isEditing ? 'Enregistrer les changements' : 'Créer mon billet'}
          <span>→</span>
        </button>
      </form>
    </section>
  )
}
