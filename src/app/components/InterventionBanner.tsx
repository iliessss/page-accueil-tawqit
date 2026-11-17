import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from './LanguageContext';

export function InterventionBanner() {
  const { t } = useLanguage();

  const cards = [
    {
      href: '/interventions/',
      external: false,
      kicker: t('interventionBannerKicker'),
      title: t('interventionCta'),
      text: t('interventionBannerText'),
      action: t('interventionLink'),
    },
    {
      href: 'https://mosquees.tawqit.org',
      external: true,
      kicker: t('mosqueesBannerKicker'),
      title: t('mosqueesBannerTitle'),
      text: t('mosqueesBannerText'),
      action: t('mosqueesBannerAction'),
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-24 pt-8 lg:pt-10">
      <div className="grid md:grid-cols-2 gap-4 lg:gap-6 max-w-6xl mx-auto">
        {cards.map((card, index) => (
          <motion.a
            key={card.href}
            href={card.href}
            {...(card.external && { target: '_blank', rel: 'noopener noreferrer' })}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`group flex flex-col rounded-[2rem] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/25 shadow-xl p-5 sm:p-8 transition-colors hover:border-[#F9DACA]/70`}
          >
            <p className="font-['CormorantSC-Medium'] text-sm tracking-[0.18em] text-[#F9DACA] mb-2">
              {card.kicker}
            </p>
            <h2 className="font-['CormorantSC-Bold'] text-xl sm:text-2xl lg:text-3xl text-white sm:mb-2">
              {card.title}
            </h2>
            <p className="hidden sm:block font-['adobe-devanagari_844'] text-lg text-white/80 leading-relaxed">
              {card.text}
            </p>
            <span className="mt-4 sm:mt-6 md:mt-auto md:pt-6 self-start">
              <span className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#F9DACA] group-hover:bg-[#E5D6BF] text-[#2C2A5A] font-['CormorantSC-Bold'] text-base leading-tight shadow-lg transition-colors whitespace-nowrap">
                {card.action}
                <span aria-hidden="true">→</span>
              </span>
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
