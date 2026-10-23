export const eventConfig = {
  title: import.meta.env.VITE_EVENT_TITLE || 'Mon anniversaire',
  age: import.meta.env.VITE_EVENT_AGE || '26 ans',
  date: import.meta.env.VITE_EVENT_DATE || 'Une date à définir',
  time: import.meta.env.VITE_EVENT_TIME || 'Une heure à définir',
  city: import.meta.env.VITE_EVENT_CITY || 'Lieu à définir',
  venue: import.meta.env.VITE_EVENT_VENUE || 'Adresse dévoilée après inscription',
  address: import.meta.env.VITE_EVENT_ADDRESS || 'Adresse dévoilée après inscription',
}
