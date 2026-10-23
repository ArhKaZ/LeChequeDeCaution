import './FlemmePage.css';

export default function FlemmePage() {
    const imageBaseUrl = import.meta.env.BASE_URL

    return (
        <section className='image-container'>
            <h1>Ok t'as raison soit différent</h1>
            <img src={`${imageBaseUrl}sleep.jpeg`} className="image-mid" ></img>
        </section>
    )
}