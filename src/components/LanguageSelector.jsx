import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';

const LanguageSelector = ({ className = '', variant = 'dropdown' }) => {
  const { currentLanguage, availableLanguages, changeLanguage, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  const currentLanguageInfo = availableLanguages[currentLanguage];

  if (variant === 'simple') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Globe className="w-4 h-4 text-gray-600" />
        <select
          value={currentLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="bg-transparent border-none text-sm text-gray-700 focus:outline-none focus:ring-0"
        >
          {Object.entries(availableLanguages).map(([code, info]) => (
            <option key={code} value={code}>
              {info.flag} {info.nativeName}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
        aria-label={t('selectLanguage')}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLanguageInfo?.flag}</span>
        <span className="hidden md:inline">{currentLanguageInfo?.nativeName}</span>
        <span className="sm:hidden md:hidden">{currentLanguageInfo?.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
              {t('selectLanguage')}
            </div>
            {Object.entries(availableLanguages).map(([code, info]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                  currentLanguage === code ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{info.flag}</span>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{info.nativeName}</span>
                    {info.nativeName !== info.name && (
                      <span className="text-xs text-gray-500">{info.name}</span>
                    )}
                  </div>
                </div>
                {currentLanguage === code && (
                  <Check className="w-4 h-4 text-orange-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 