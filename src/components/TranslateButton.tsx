import React, { useEffect } from 'react';

const TranslateButton: React.FC = () => {
  useEffect(() => {
    // Reset cookie to force English
    document.cookie = 'googtrans=/en/en; path=/';
    const initGoogleTranslate = () => {
      if ((window as any).google && (window as any).google.translate) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,es,fr,de,it,pt,zh,ja,ko',
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    // Expose init to window (used by script)
    (window as any).googleTranslateElementInit = initGoogleTranslate;

    // Prevent double-loading
    if (!document.querySelector('#google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src =
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else {
      initGoogleTranslate();
    }
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white p-2 shadow-md rounded">
      <div id="google_translate_element" />
    </div>
  );
};

export default TranslateButton;
