import React, { createContext, useContext, useState, useEffect, useReducer, useMemo } from 'react';
import i18nService, { languages } from '../services/i18n';

const I18nContext = createContext();

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

export const I18nProvider = ({ children }) => {
  // Use a reducer to force re-renders when language changes
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'SET_LANGUAGE':
          return { ...state, currentLanguage: action.payload, version: state.version + 1 };
        default:
          return state;
      }
    },
    {
      currentLanguage: i18nService.getCurrentLanguage(),
      version: 0 // Version is used to force re-renders
    }
  );

  const [availableLanguages] = useState(i18nService.getAvailableLanguages());

  // Initialize the i18n service
  useEffect(() => {
    // Initialize with stored language preference
    const storedLanguage = i18nService.getCurrentLanguage();
    if (storedLanguage) {
      dispatch({ type: 'SET_LANGUAGE', payload: storedLanguage });
    }

    // Set document attributes
    document.documentElement.lang = state.currentLanguage;
    document.documentElement.dir = i18nService.getTextDirection();

    // Listen for language changes from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === 'fenix_language') {
        const newLang = e.newValue;
        if (newLang && newLang !== state.currentLanguage) {
          dispatch({ type: 'SET_LANGUAGE', payload: newLang });
        }
      }
    };

    // Listen for custom language change events
    const handleLanguageChange = (e) => {
      if (e.detail?.language && e.detail.language !== state.currentLanguage) {
        dispatch({ type: 'SET_LANGUAGE', payload: e.detail.language });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('fenix_language_changed', handleLanguageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('fenix_language_changed', handleLanguageChange);
    };
  }, [state.currentLanguage]);

  // Change language function
  const changeLanguage = (langCode) => {
    if (langCode !== state.currentLanguage && i18nService.translations[langCode]) {
      i18nService.setLanguage(langCode);
      dispatch({ type: 'SET_LANGUAGE', payload: langCode });

      // Update document attributes
      document.documentElement.lang = langCode;
      document.documentElement.dir = i18nService.getTextDirection();

      // Dispatch a custom event for other components
      document.dispatchEvent(
        new CustomEvent('fenix_language_changed', {
          detail: { language: langCode, previousLanguage: state.currentLanguage }
        })
      );

      // Force a full page re-render by adding a small timeout
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 10);

      return true;
    }
    return false;
  };

  // Memoize translation function to avoid unnecessary re-renders
  const t = useMemo(() => {
    return (key, params = {}) => i18nService.t(key, params);
  }, [state.currentLanguage, state.version]);

  // Memoize formatting functions
  const formatDate = useMemo(() => {
    return (date, options = {}) => i18nService.formatDate(date, options);
  }, [state.currentLanguage]);

  const formatTime = useMemo(() => {
    return (date, options = {}) => i18nService.formatTime(date, options);
  }, [state.currentLanguage]);

  const formatNumber = useMemo(() => {
    return (number, options = {}) => i18nService.formatNumber(number, options);
  }, [state.currentLanguage]);

  const formatCurrency = useMemo(() => {
    return (amount, currency = 'USD', options = {}) => 
      i18nService.formatCurrency(amount, currency, options);
  }, [state.currentLanguage]);

  // Other utility functions
  const getCurrentLanguageInfo = () => i18nService.getLanguageInfo(state.currentLanguage);
  const isRTL = () => i18nService.isRTL();
  const getTextDirection = () => i18nService.getTextDirection();
  const getPluralForm = (count, forms) => i18nService.getPluralForm(count, forms);

  // Create a memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    currentLanguage: state.currentLanguage,
    version: state.version, // Include version in context to force re-renders
    availableLanguages,
    changeLanguage,
    t,
    formatDate,
    formatTime,
    formatNumber,
    formatCurrency,
    getCurrentLanguageInfo,
    isRTL,
    getTextDirection,
    getPluralForm
  }), [state.currentLanguage, state.version, availableLanguages]);

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

export default I18nContext; 