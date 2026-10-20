import React from 'react';
import { BrandLockup } from './BrandLockup';
import { useLanguage } from './LanguageContext';
import backgroundLight from 'figma:asset/e24de73c67279cf27f53290c20cb3ea4e31a70b6.png';
import backgroundDark from 'figma:asset/8e763fc6c51997bb726189026bda5de1dc5e82de.png';

interface FooterProps {
  darkMode?: boolean;
}

export function Footer({ darkMode = false }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const backgroundImage = darkMode ? backgroundDark : backgroundLight;
  const { t } = useLanguage();

  const footerLinks = {
    produit: [
      { label: t('features'), href: '#fonctionnalites' },
      { label: t('preview'), href: '#apercu' },
      { label: t('about'), href: '#qui-sommes-nous' }
    ],
    ressources: [
      { label: t('faq'), href: '#faq' },
      { label: t('methods'), href: '#methodes' },
      { label: t('support'), href: '#' },
      { label: t('donateFooter'), href: 'https://donorbox.org/tawqit', external: true }
    ],
    legal: [
      { label: t('privacy'), href: '#confidentialite' },
      { label: t('legalNotice'), href: '#mentions-legales' },
      { label: t('contactLink'), href: 'mailto:contact@tawqit.org' }
    ]
  };

  return (
    <footer className="relative py-16 lg:py-24" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
      {/* Geometric pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTAgMEw1MCAxMDBNMCA1MEwxMDAgNTBNMTUgMTVMODUgODVNODUgMTVMMTUgODUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIwLjUiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzMCIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjAuNSIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==')] bg-repeat pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-24">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <BrandLockup size="md" theme={darkMode ? "dark" : "light"} showTagline />
            <p className="font-['adobe-devanagari_844'] text-white/70 text-base leading-relaxed max-w-sm mb-6">
              {t('footerDesc')}
            </p>

            {/* Social / App Badges - Simple styled buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://apps.apple.com/fr/app/tawqit/id6758964906"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-full bg-[#F9DACA] hover:bg-[#E5D6BF] text-[#2C2A5A] text-sm font-['CormorantSC-Regular'] leading-tight transition-all shadow-lg text-center tracking-wide"
              >
                {t('downloadIOS')}
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.tawqit.tawqit"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-full bg-[#34A853] hover:bg-[#2D9548] text-white text-sm font-['CormorantSC-Regular'] leading-tight transition-all shadow-lg text-center tracking-wide"
              >
                {t('downloadAndroid')}
              </a>
            </div>
          </div>

          {/* Produit */}
          <div>
            <h3 className="font-['Cormorant_Garamond'] text-white font-semibold text-lg mb-4">{t('product')}</h3>
            <ul className="space-y-3">
              {footerLinks.produit.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-['adobe-devanagari_844'] text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="font-['Cormorant_Garamond'] text-white font-semibold text-lg mb-4">{t('resources')}</h3>
            <ul className="space-y-3">
              {footerLinks.ressources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
                    className="font-['adobe-devanagari_844'] text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-['Cormorant_Garamond'] text-white font-semibold text-lg mb-4">{t('contact')}</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-['adobe-devanagari_844'] text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-['adobe-devanagari_844'] text-white/60 text-sm">
            © {currentYear} Tawqit — {t('allRightsReserved')}
          </p>
          <p className="font-['adobe-devanagari_844'] text-white/60 text-sm">
            {t('editedBy')}{' '}
            <a href="#mentions-legales" className="text-white/80 hover:text-white underline underline-offset-4">
              LOGARITHMES
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}