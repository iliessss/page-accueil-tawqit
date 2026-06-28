import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './components/LanguageContext';
import { AppWrapper } from './components/AppWrapper';
import faviconImage from 'figma:asset/eafe33705c5600570a1d6b10a52d36d26fdd436e.png';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Set favicon
    const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = faviconImage;
    document.getElementsByTagName('head')[0].appendChild(link);

    // Set page title
    document.title = 'Tawqit — Horaires de prière précis';
  }, []);

  return (
    <LanguageProvider>
      <AppWrapper darkMode={darkMode} setDarkMode={setDarkMode} />
    </LanguageProvider>
  );
}
