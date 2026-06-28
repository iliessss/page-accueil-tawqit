import React from 'react';
import { motion } from 'motion/react';
import { Menu, X, Globe } from 'lucide-react';
import { BrandLockup } from './BrandLockup';
import { useLanguage } from './LanguageContext';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { label: t('features'), href: '#fonctionnalites' },
    { label: t('preview'), href: '#apercu' },
    { label: t('methods'), href: '#methodes' },
    { label: t('about'), href: '#qui-sommes-nous' },
    { label: t('faq'), href: '#faq' }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/10 dark:bg-[#3B3E6C]/30 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-24">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Language Toggle */}
          <div className="flex items-center gap-6">
            <motion.a
              href="#hero"
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <BrandLockup size="md" theme={darkMode ? "dark" : "light"} />
            </motion.a>
            <button
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/80 hover:text-white text-sm font-['CormorantSC-Medium'] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA + Dark Mode Toggle */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {/* Download Buttons */}
            <div className="flex gap-3">
              <motion.a
                href="https://apps.apple.com/fr/app/tawqit/id6758964906"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 rounded-full bg-[#F9DACA] hover:bg-[#E5D6BF] text-[#2C2A5A] font-['CormorantSC-Bold'] font-semibold text-sm leading-tight transition-all shadow-lg text-center"
              >
                iOS
              </motion.a>
              <motion.a
                href="https://play.google.com/store/apps/details?id=com.tawqit.tawqit"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 rounded-full bg-[#34A853] hover:bg-[#2D9548] text-white font-['CormorantSC-Bold'] font-semibold text-sm leading-tight transition-all shadow-lg text-center"
              >
                Android
              </motion.a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden pb-6 border-t border-white/10 mt-4 pt-4"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/80 hover:text-white font-['CormorantSC-Medium'] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-3 pt-4">
                <a
                  href="https://apps.apple.com/fr/app/tawqit/id6758964906"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 bg-[#F9DACA] hover:bg-[#E5D6BF] text-[#2C2A5A] rounded-full text-center font-['CormorantSC-Bold'] font-semibold"
                >
                  {t('downloadIOS')}
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.tawqit.tawqit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 bg-[#34A853] hover:bg-[#2D9548] text-white rounded-full text-center font-['CormorantSC-Bold'] font-semibold"
                >
                  {t('downloadAndroid')}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}