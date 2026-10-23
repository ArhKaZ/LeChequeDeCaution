import { go } from '../navigation'
import { eventConfig } from '../eventConfig'
import './Home.css'


export default function Home() {
  const imageBaseUrl = import.meta.env.BASE_URL

  return (
  <section className="hero page-enter">
     <div className='text-between-images'>
        <h1>{eventConfig.title}</h1>
        <p className='eyebrow'>{eventConfig.date}</p>
        <p className="microcopy">{eventConfig.city} · Adresse dévoilée après inscription</p>
      </div>
    <div className="text-and-images">
      <img src={`${imageBaseUrl}IMG_0631.jpg`} className="home-illustration-img" alt="Fumélefrère" />
      <h1>{eventConfig.age}</h1>
      <img src={`${imageBaseUrl}IMG_3061.jpg`} className="home-illustration-img" alt="randompick" />
    </div>
    <div className='buttons-home'>
      <button className='button primary' onClick={() => go('details')}>Je viens <span>→</span></button>
      <button className='button primary' onClick={() => go('flemme-page')}>Grosse flemme <span>x</span></button>
      <button className="button quiet">Déjà inscrit·e</button>
    </div>
  </section>
  );
}
