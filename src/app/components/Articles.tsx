import React from 'react';
import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import backgroundLight from 'figma:asset/e24de73c67279cf27f53290c20cb3ea4e31a70b6.png';
import backgroundDark from 'figma:asset/8e763fc6c51997bb726189026bda5de1dc5e82de.png';

interface ArticlesProps {
  darkMode?: boolean;
}

export function Articles({ darkMode = false }: ArticlesProps) {
  const { language, t } = useLanguage();
  const backgroundImage = darkMode ? backgroundDark : backgroundLight;

  const articles: { title: string; authors: string; summary: string; href: string; action?: string }[] = [
    {
      title: t('article1Title'),
      authors: 'Iliès Haouche',
      summary: t('article1Summary'),
      href: `/articles/science-des-heures-de-priere/${language === 'en' ? 'en/' : ''}`,
    },
    {
      title: t('article2Title'),
      authors: 'Iliès Haouche · Cheikh Ismaïl ar-Roubaysi',
      summary: t('article2Summary'),
      href: '/articles/angle-de-depression-solaire/',
    },
  ];

  return (
    <div className="py-24 lg:py-32 relative" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-['CormorantSC-Bold'] text-4xl lg:text-5xl xl:text-6xl text-white mb-6 tracking-wide leading-tight">
            {t('articlesTitle')}
          </h2>
          <p className="font-['adobe-devanagari_844'] text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            {t('articlesSubtitle')}
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8">
          {articles.map((article, index) => (
            <motion.a
              key={article.href}
              href={article.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col w-full max-w-xl rounded-[2rem] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/25 shadow-xl p-8 lg:p-10 transition-colors hover:border-[#F9DACA]/70"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#F9DACA]/20">
                  <BookOpen className="w-5 h-5 text-[#F9DACA]" />
                </span>
                <span className="font-['CormorantSC-Medium'] text-sm tracking-[0.18em] text-[#F9DACA]">
                  {article.authors}
                </span>
              </div>
              <h3 className="font-['CormorantSC-Bold'] text-2xl lg:text-3xl text-white mb-3">
                {article.title}
              </h3>
              <p className="font-['adobe-devanagari_844'] text-lg text-white/80 leading-relaxed">
                {article.summary}
              </p>
              <span className="mt-auto pt-8 self-start"><span className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#F9DACA] group-hover:bg-[#E5D6BF] text-[#2C2A5A] font-['CormorantSC-Bold'] text-base leading-tight shadow-lg transition-colors whitespace-nowrap">
                {article.action ?? t('articleRead')}
                <span aria-hidden="true">→</span>
              </span></span>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
