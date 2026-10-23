import PageHeading from '../components/PageHeading'
import Rule from '../components/Rule'
import './Rules.css'

interface RulesProps {
  accepted: boolean
  setAccepted: (accepted: boolean) => void
  onNext: () => void
}

export default function Rules({ accepted, setAccepted, onNext }: RulesProps) {
  return (
  <section className="content-page page-enter">
    <PageHeading kicker="On cadre un minimum" title="On ne fait pas n'importe quoi non plus" />
    <div className="rules-list">
        <Rule number="01" title="On prend soin du lieu" text="Faites attention aux objets de la maison." />
        <Rule number="02" title="Si tu ne te sens pas bien" text="Les vomis sont à éviter. Soyez pro : direction les WC." />
        <Rule number="03" title="Ne vous embrouillez pas" text="S'il y a un problème avec quelqu'un, venez trouver l'hôte de la maison." />
        <Rule number="04" title="Si la porte est fermée, on ne rentre pas" text="J'habite avec ma sœur, on ne la dérange pas, s'il vous plaît." />
        <Rule number="05" title="Le niveau sonore" text="Il y aura forcément du bruit. Faites de votre mieux pour ne pas abuser." />
    </div>
    <label className="check-row">
        <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
        <span className="fake-check">✓</span>
        <span>J'ai lu les règles et je les accepte. Si je ne les respecte pas, j'accepte qu'une équipe soit montée pour venir me péter les genoux.</span>
    </label>
    <button className="button primary full" disabled={!accepted} onClick={onNext}>Je confirme <span>→</span></button>
  </section>
  );
}
