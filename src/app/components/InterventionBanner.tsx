import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from './LanguageContext';

export function InterventionBanner() {
  const { t } = useLanguage();

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-24 pb-16 lg:pb-20">
      <motion.a
        href="/interventions/"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group block max-w-5xl mx-auto rounded-[2rem] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/25 shadow-xl p-6 sm:p-8 lg:px-10 transition-colors hover:border-[#F9DACA]/70"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <div className="flex-1 min-w-0">
            <p className="font-['CormorantSC-Medium'] text-sm tracking-[0.18em] text-[#F9DACA] mb-2">
              {t('interventionBannerKicker')}
            </p>
            <h2 className="font-['CormorantSC-Bold'] text-2xl lg:text-3xl text-white mb-2">
              {t('interventionCta')}
            </h2>
            <p className="font-['adobe-devanagari_844'] text-lg text-white/80 leading-relaxed">
              {t('interventionBannerText')}
            </p>
          </div>
          <span className="shrink-0 self-start md:self-center inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#F9DACA] group-hover:bg-[#E5D6BF] text-[#2C2A5A] font-['CormorantSC-Bold'] text-base leading-tight shadow-lg transition-colors whitespace-nowrap">
            {t('interventionLink')}
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </motion.a>
    </div>
  );
}
