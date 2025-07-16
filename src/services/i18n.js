import en from '../locales/en';
import mk from '../locales/mk';
import sq from '../locales/sq';
import de from '../locales/de';
import it from '../locales/it';
import fr from '../locales/fr';
import pt from '../locales/pt';
import es from '../locales/es';

// Available languages
export const languages = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  mk: { name: 'Macedonian', nativeName: 'Македонски', flag: '🇲🇰' },
  sq: { name: 'Albanian', nativeName: 'Shqip', flag: '🇦🇱' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' }
};

// Translation files
const translations = {
  en,
  mk,
  sq,
  de,
  it,
  fr,
  pt,
  es
};

class I18nService {
  constructor() {
    this.currentLanguage = this.getStoredLanguage() || 'en';
    this.translations = translations;
  }

  // Get stored language preference
  getStoredLanguage() {
    try {
      return localStorage.getItem('fenix_language') || 'en';
    } catch (error) {
      console.warn('Could not access localStorage for language preference');
      return 'en';
    }
  }

  // Store language preference
  setStoredLanguage(language) {
    try {
      localStorage.setItem('fenix_language', language);
    } catch (error) {
      console.warn('Could not store language preference in localStorage');
    }
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Set current language
  setLanguage(language) {
    if (this.translations[language]) {
      const previousLanguage = this.currentLanguage;
      this.currentLanguage = language;
      this.setStoredLanguage(language);
      
      // Update document attributes
      document.documentElement.lang = language;
      document.documentElement.dir = this.getTextDirection();
      
      // Dispatch a custom event that components can listen to
      const event = new CustomEvent('fenix_language_changed', {
        detail: {
          previousLanguage,
          currentLanguage: language
        }
      });
      document.dispatchEvent(event);
      
      return true;
    }
    console.warn(`Language ${language} not supported`);
    return false;
  }

  // Get translation for a key
  t(key, params = {}) {
    const translation = this.translations[this.currentLanguage]?.[key] || 
                       this.translations['en']?.[key] || 
                       key;

    // Replace parameters in translation
    if (params && typeof params === 'object') {
      return Object.keys(params).reduce((str, param) => {
        return str.replace(new RegExp(`{${param}}`, 'g'), params[param]);
      }, translation);
    }

    return translation;
  }

  // Get all available languages
  getAvailableLanguages() {
    return languages;
  }

  // Get language info
  getLanguageInfo(languageCode) {
    return languages[languageCode] || null;
  }

  // Format date according to current language
  formatDate(date, options = {}) {
    const dateObj = new Date(date);
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    const localeMap = {
      en: 'en-US',
      mk: 'mk-MK',
      sq: 'sq-AL',
      de: 'de-DE',
      it: 'it-IT',
      fr: 'fr-FR',
      pt: 'pt-BR',
      es: 'es-ES'
    };

    const locale = localeMap[this.currentLanguage] || 'en-US';
    
    try {
      return dateObj.toLocaleDateString(locale, { ...defaultOptions, ...options });
    } catch (error) {
      // Fallback to English if locale is not supported
      return dateObj.toLocaleDateString('en-US', { ...defaultOptions, ...options });
    }
  }

  // Format time according to current language
  formatTime(date, options = {}) {
    const dateObj = new Date(date);
    const defaultOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };

    const localeMap = {
      en: 'en-US',
      mk: 'mk-MK',
      sq: 'sq-AL',
      de: 'de-DE',
      it: 'it-IT',
      fr: 'fr-FR',
      pt: 'pt-BR',
      es: 'es-ES'
    };

    const locale = localeMap[this.currentLanguage] || 'en-US';
    
    try {
      return dateObj.toLocaleTimeString(locale, { ...defaultOptions, ...options });
    } catch (error) {
      // Fallback to English if locale is not supported
      return dateObj.toLocaleTimeString('en-US', { ...defaultOptions, ...options });
    }
  }

  // Format number according to current language
  formatNumber(number, options = {}) {
    const defaultOptions = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    };

    const localeMap = {
      en: 'en-US',
      mk: 'mk-MK',
      sq: 'sq-AL',
      de: 'de-DE',
      it: 'it-IT',
      fr: 'fr-FR',
      pt: 'pt-BR',
      es: 'es-ES'
    };

    const locale = localeMap[this.currentLanguage] || 'en-US';
    
    try {
      return number.toLocaleString(locale, { ...defaultOptions, ...options });
    } catch (error) {
      // Fallback to English if locale is not supported
      return number.toLocaleString('en-US', { ...defaultOptions, ...options });
    }
  }

  // Format currency according to current language
  formatCurrency(amount, currency = 'USD', options = {}) {
    const defaultOptions = {
      style: 'currency',
      currency: currency
    };

    const localeMap = {
      en: 'en-US',
      mk: 'mk-MK',
      sq: 'sq-AL',
      de: 'de-DE',
      it: 'it-IT',
      fr: 'fr-FR',
      pt: 'pt-BR',
      es: 'es-ES'
    };

    const locale = localeMap[this.currentLanguage] || 'en-US';
    
    try {
      return amount.toLocaleString(locale, { ...defaultOptions, ...options });
    } catch (error) {
      // Fallback to English if locale is not supported
      return amount.toLocaleString('en-US', { ...defaultOptions, ...options });
    }
  }

  // Get text direction for current language
  getTextDirection() {
    // Most languages are LTR, but you can add RTL languages here if needed
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.includes(this.currentLanguage) ? 'rtl' : 'ltr';
  }

  // Check if current language is RTL
  isRTL() {
    return this.getTextDirection() === 'rtl';
  }

  // Get plural form for current language
  getPluralForm(count, forms) {
    // This is a simplified pluralization system
    // For more complex pluralization rules, you might want to use a library like i18next
    if (count === 1) {
      return forms.singular || forms.one || forms[0];
    }
    return forms.plural || forms.many || forms[1] || forms[0];
  }

  // Initialize the service
  init() {
    // Set up any initialization logic here
    const language = this.getStoredLanguage();
    if (language && this.translations[language]) {
      this.currentLanguage = language;
    }
  }
}

// Create singleton instance
const i18nService = new I18nService();

export default i18nService; 