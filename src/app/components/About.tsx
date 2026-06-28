import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Star, Compass, GraduationCap, Users, FlaskConical, Calculator } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import sheikhImage from 'figma:asset/acb4e203ef27543e30f70645bdab34177027803c.png';
import ilyesImage from 'figma:asset/3453c7271996fe0514a48b45b9a86b83e0c03a6f.png';
import iliesImage from 'figma:asset/5f83faf4205e79b59877b10ba5ca1e250e27ee2d.png';

export function About() {
  const { t } = useLanguage();

  const sheikhExpertise = [
    {
      icon: BookOpen,
      title: t('aboutExpertise1'),
    },
    {
      icon: GraduationCap,
      title: t('aboutExpertise2'),
    },
    {
      icon: Compass,
      title: t('aboutExpertise3'),
    },
    {
      icon: Star,
      title: t('aboutExpertise4'),
    },
  ];

  const ilyesExpertise = [
    {
      icon: GraduationCap,
      title: t('aboutIlyesExpertise1'),
    },
    {
      icon: BookOpen,
      title: t('aboutIlyesExpertise2'),
    },
    {
      icon: Star,
      title: t('aboutIlyesExpertise3'),
    },
    {
      icon: Users,
      title: t('aboutIlyesExpertise4'),
    },
  ];

  const iliesExpertise = [
    {
      icon: FlaskConical,
      title: t('aboutIliesExpertise1'),
    },
    {
      icon: Calculator,
      title: t('aboutIliesExpertise2'),
    },
    {
      icon: BookOpen,
      title: t('aboutIliesExpertise3'),
    },
    {
      icon: Star,
      title: t('aboutIliesExpertise4'),
    },
  ];

  return (
    <div className="py-24 lg:py-32 relative">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="font-['CormorantSC-Bold'] text-4xl lg:text-5xl xl:text-6xl text-[#2C2A5A] dark:text-white mb-6">
            {t('aboutTitle')}
          </h2>
          <p className="font-['adobe-devanagari_844'] text-xl text-[#2C2A5A]/70 dark:text-white/70 max-w-3xl mx-auto leading-relaxed">
            {t('aboutSubtitle')}
          </p>
        </motion.div>

        {/* Main Content - Sheikh */}
        <div className="max-w-6xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative p-12 lg:p-16 rounded-[3rem] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border-2 border-white/30 overflow-hidden shadow-2xl"
          >
            {/* Glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E5D6BF]/30 rounded-full blur-[140px]" />
            
            <div className="relative z-10">
              {/* Profile Section */}
              <div className="flex flex-col lg:flex-row gap-12 items-start mb-12">
                {/* Photo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex-shrink-0"
                >
                  <div className="relative">
                    <div className="w-64 h-64 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
                      <img
                        src={sheikhImage}
                        alt="Cheikh Ismaïl al-Roubaysi"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Decorative corner accent */}
                    <div className="absolute -top-3 -right-3 w-20 h-20 border-t-4 border-r-4 border-[#E5D6BF] rounded-tr-3xl" />
                    <div className="absolute -bottom-3 -left-3 w-20 h-20 border-b-4 border-l-4 border-[#E5D6BF] rounded-bl-3xl" />
                  </div>
                </motion.div>

                {/* Name & Title */}
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="font-['CormorantSC-Bold'] text-3xl lg:text-4xl text-[#2C2A5A] dark:text-white mb-4">
                      {t('aboutSheikhName')}
                    </h3>
                    <p className="font-['CormorantSC-Regular'] text-xl text-[#2C2A5A]/80 dark:text-white/80 mb-8">
                      {t('aboutSheikhTitle')}
                    </p>

                    {/* Expertise badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {sheikhExpertise.map((item, index) => (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-[#2C2A5A]/10 dark:bg-white/10 rounded-2xl"
                        >
                          <item.icon className="w-5 h-5 text-[#2C2A5A] dark:text-white flex-shrink-0" />
                          <span className="font-['adobe-devanagari_844'] text-sm text-[#2C2A5A] dark:text-white">
                            {item.title}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Biography */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="space-y-6"
              >
                <p className="font-['adobe-devanagari_844'] text-lg text-[#2C2A5A] dark:text-white/90 leading-relaxed">
                  {t('aboutBio1')}
                </p>
                <p className="font-['adobe-devanagari_844'] text-lg text-[#2C2A5A] dark:text-white/90 leading-relaxed">
                  {t('aboutBio2')}
                </p>
                <p className="font-['adobe-devanagari_844'] text-lg text-[#2C2A5A] dark:text-white/90 leading-relaxed">
                  {t('aboutBio3')}
                </p>
                <p className="font-['adobe-devanagari_844'] text-lg text-[#2C2A5A] dark:text-white/90 leading-relaxed">
                  {t('aboutBio4')}
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Oustedh Ilyes Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative p-12 lg:p-16 rounded-[3rem] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border-2 border-white/30 overflow-hidden shadow-2xl"
          >
            {/* Glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F9DACA]/30 rounded-full blur-[140px]" />
            
            <div className="relative z-10">
              {/* Profile Section */}
              <div className="flex flex-col lg:flex-row gap-12 items-start mb-12">
                {/* Photo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex-shrink-0"
                >
                  <div className="relative">
                    <div className="w-64 h-64 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
                      <img
                        src={ilyesImage}
                        alt="Oustedh Ilyes"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Decorative corner accent */}
                    <div className="absolute -top-3 -right-3 w-20 h-20 border-t-4 border-r-4 border-[#F9DACA] rounded-tr-3xl" />
                    <div className="absolute -bottom-3 -left-3 w-20 h-20 border-b-4 border-l-4 border-[#F9DACA] rounded-bl-3xl" />
                  </div>
                </motion.div>

                {/* Name & Title */}
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="font-['CormorantSC-Bold'] text-3xl lg:text-4xl text-[#2C2A5A] dark:text-white mb-4">
                      {t('aboutIlyesName')}
                    </h3>
                    <p className="font-['CormorantSC-Regular'] text-xl text-[#2C2A5A]/80 dark:text-white/80 mb-8">
                      {t('aboutIlyesTitle')}
                    </p>

                    {/* Expertise badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {ilyesExpertise.map((item, index) => (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-[#2C2A5A]/10 dark:bg-white/10 rounded-2xl"
                        >
                          <item.icon className="w-5 h-5 text-[#2C2A5A] dark:text-white flex-shrink-0" />
                          <span className="font-['adobe-devanagari_844'] text-sm text-[#2C2A5A] dark:text-white">
                            {item.title}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Biography */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="space-y-6"
              >
                <p className="font-['adobe-devanagari_844'] text-lg text-[#2C2A5A] dark:text-white/90 leading-relaxed">
                  {t('aboutIlyesBio1')}
                </p>
                <p className="font-['adobe-devanagari_844'] text-lg text-[#2C2A5A] dark:text-white/90 leading-relaxed">
                  {t('aboutIlyesBio2')}
                </p>
                <p className="font-['adobe-devanagari_844'] text-lg text-[#2C2A5A] dark:text-white/90 leading-relaxed">
                  {t('aboutIlyesBio3')}
                </p>
                <p className="font-['adobe-devanagari_844'] text-lg text-[#2C2A5A] dark:text-white/90 leading-relaxed">
                  {t('aboutIlyesBio4')}
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Oustedh Ilies Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="relative p-12 lg:p-16 rounded-[3rem] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border-2 border-white/30 overflow-hidden shadow-2xl"
          >
            {/* Glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F9DACA]/30 rounded-full blur-[140px]" />
            
            <div className="relative z-10">
              {/* Profile Section */}
              <div className="flex flex-col lg:flex-row gap-12 items-start mb-12">
                {/* Photo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex-shrink-0"
                >
                  <div className="relative">
                    <div className="w-64 h-64 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
                      <img
                        src={iliesImage}
                        alt="Oustedh Ilies"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Decorative corner accent */}
                    <div className="absolute -top-3 -right-3 w-20 h-20 border-t-4 border-r-4 border-[#F9DACA] rounded-tr-3xl" />
                    <div className="absolute -bottom-3 -left-3 w-20 h-20 border-b-4 border-l-4 border-[#F9DACA] rounded-bl-3xl" />
                  </div>
                </motion.div>

                {/* Name & Title */}
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  >
                    <h3 className="font-['CormorantSC-Bold'] text-3xl lg:text-4xl text-[#2C2A5A] dark:text-white mb-2">
                      {t('aboutIliesName')}
                    </h3>
                    <p className="font-['CormorantSC-Regular'] text-lg text-[#2C2A5A]/80 dark:text-white/80 mb-8">
                      {t('aboutIliesTitle')}
                    </p>

                    {/* Expertise badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {iliesExpertise.map((item, index) => (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-[#2C2A5A]/10 dark:bg-white/10 rounded-2xl"
                        >
                          <item.icon className="w-5 h-5 text-[#2C2A5A] dark:text-white flex-shrink-0" />
                          <span className="font-['adobe-devanagari_844'] text-sm text-[#2C2A5A] dark:text-white">
                            {item.title}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Biography */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="space-y-6"
              >
                <p className="font-['adobe-devanagari_844'] text-lg text-[#2C2A5A] dark:text-white/90 leading-relaxed">
                  {t('aboutIliesBio1')}
                </p>
                <p className="font-['adobe-devanagari_844'] text-lg text-[#2C2A5A] dark:text-white/90 leading-relaxed">
                  {t('aboutIliesBio2')}
                </p>
                <p className="font-['adobe-devanagari_844'] text-lg text-[#2C2A5A] dark:text-white/90 leading-relaxed">
                  {t('aboutIliesBio3')}
                </p>
                <p className="font-['adobe-devanagari_844'] text-lg text-[#2C2A5A] dark:text-white/90 leading-relaxed">
                  {t('aboutIliesBio4')}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}