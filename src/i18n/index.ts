import { createI18n } from 'vue-i18n'
import enGB from '../locales/en-GB.json'
import nlNL from '../locales/nl-NL.json'
import frFR from '../locales/fr-FR.json'

const messages = {
  'en-GB': enGB,
  'nl-NL': nlNL,
  'fr-FR': frFR
}

// Get saved locale from localStorage or use default
const getSavedLocale = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('locale') || 'en-GB'
  }
  return 'en-GB'
}

const i18n = createI18n({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: 'en-GB',
  messages,
  globalInjection: true
})

export default i18n
export { messages }
