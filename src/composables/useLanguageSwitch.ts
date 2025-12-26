import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const SUPPORTED_LOCALES = ['en-GB', 'nl-NL', 'fr-FR'] as const
type SupportedLocale = typeof SUPPORTED_LOCALES[number]

export function useLanguageSwitch() {
  const { setLocale } = useI18n()
  
  // Get saved language from localStorage or use default
  const savedLocale = localStorage.getItem('locale') as SupportedLocale
  const currentLocale = ref(savedLocale || 'en-GB')
  
  // Switch language
  const switchLanguage = (newLocale: SupportedLocale) => {
    if (!SUPPORTED_LOCALES.includes(newLocale)) {
      console.warn(`Unsupported locale: ${newLocale}`)
      return
    }
    
    setLocale(newLocale)
    currentLocale.value = newLocale
    localStorage.setItem('locale', newLocale)
    
    // Update HTML lang attribute for accessibility
    document.documentElement.lang = newLocale
  }
  
  // Get available languages
  const getAvailableLanguages = () => {
    return [
      { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
      { code: 'nl-NL', name: 'Nederlands', flag: '🇳🇱' },
      { code: 'fr-FR', name: 'Français', flag: '🇫🇷' }
    ]
  }
  
  // Auto-load saved language on app start
  const initializeLanguage = () => {
    const saved = localStorage.getItem('locale') as SupportedLocale
    if (saved && SUPPORTED_LOCALES.includes(saved)) {
      switchLanguage(saved)
    } else {
      // Default to en-GB
      switchLanguage('en-GB')
    }
  }
  
  return {
    currentLocale,
    switchLanguage,
    getAvailableLanguages,
    initializeLanguage,
    supportedLocales: SUPPORTED_LOCALES
  }
}
