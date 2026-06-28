import React from 'react';
import { motion } from 'motion/react';
import { Clock, Settings, Bell } from 'lucide-react';
import logoFrLight from 'figma:asset/5f81213ae3c22f24f8fc3904313c4743d9978b8a.png';
import logoFrDark from 'figma:asset/eafe33705c5600570a1d6b10a52d36d26fdd436e.png';
import lightModeScreenshot from 'figma:asset/f7bfae298f7f1e8b8bb566f5c430ef8e59014141.png';
import lightModeScreenshotEn from 'figma:asset/62075090d82344e425ae2f19dfdbf2db676315d9.png';
import darkModeScreenshot from 'figma:asset/ca213ac505fafdfabc5a763618a5b4a256e412d6.png';
import darkModeScreenshotEn from 'figma:asset/92de24d31b59334838795fdf0a2503dd461274e5.png';
import backgroundLight from 'figma:asset/e24de73c67279cf27f53290c20cb3ea4e31a70b6.png';
import backgroundDark from 'figma:asset/8e763fc6c51997bb726189026bda5de1dc5e82de.png';
import { OfficialCTA } from './OfficialCTA';
import { useLanguage } from './LanguageContext';

interface HeroProps {
  darkMode?: boolean;
}

export function Hero({ darkMode = false }: HeroProps) {
  const logoFr = darkMode ? logoFrDark : logoFrLight;
  const { t, language } = useLanguage();
  const screenshot = darkMode 
    ? (language === 'en' ? darkModeScreenshotEn : darkModeScreenshot)
    : (language === 'en' ? lightModeScreenshotEn : lightModeScreenshot);
  const backgroundImage = darkMode ? backgroundDark : backgroundLight;
  
  return (
    <div className="relative overflow-hidden pt-12 lg:pt-24 pb-24 lg:pb-32">
      {/* Background Image - Adaptive */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={backgroundImage} 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            {/* H1 */}
            <h1 className="font-['CormorantSC-Regular'] text-5xl lg:text-6xl xl:text-7xl text-white mb-6 leading-[1.1]">
              {t('heroTitle')}
            </h1>

            {/* Subtitle */}
            <p className="font-['adobe-devanagari_844'] text-xl text-white/80 mb-8 leading-relaxed max-w-xl">
              {t('heroSubtitle')}
            </p>

            {/* Official CTA Buttons */}
            <div className="mb-8">
              <OfficialCTA variant="dark" showTrustBadges={true} />
            </div>

            {/* Micro-reassurance */}
            <p className="text-sm font-['adobe-devanagari_844'] text-white/60 mb-6">
              {t('heroReassurance')}
            </p>

            {/* Chips */}
            <div className="flex flex-wrap gap-3">
              {[t('chipSimple'), t('chipSettings'), t('chipNotifications')].map((chip, i) => (
                <motion.span
                  key={chip}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-['adobe-devanagari_844'] font-medium"
                >
                  {chip}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Right: iPhone Mockup + Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* iPhone Mockup */}
            <div className="relative">
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative w-[280px] sm:w-[320px] lg:w-[360px] aspect-[9/19.5] bg-black rounded-[3rem] p-3 shadow-2xl"
              >
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden">
                  <img 
                    src={screenshot} 
                    alt="Tawqit App Screenshot"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </motion.div>

              {/* Floating Card: Next Prayer */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -left-4 top-1/4 lg:-left-12 bg-white/15 dark:bg-[#3B3E6C]/90 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl border-2 border-white/30 w-[240px]"
                style={{
                  transform: 'rotate(-2deg)'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#E5D6BF]" />
                  <span className="text-white/70 text-sm font-['adobe-devanagari_844']">{t('nextPrayer')}</span>
                </div>
                <div className="text-2xl font-['CormorantSC-Regular'] text-white mb-1">Fajr</div>
                <div className="text-4xl font-['Against-Regular'] text-[#E5D6BF]">06:14:09</div>
              </motion.div>

              {/* Floating Card: Location & Date */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -right-4 bottom-1/4 lg:-right-12 bg-white/15 dark:bg-[#545785]/90 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl border-2 border-white/30 w-[240px]"
                style={{
                  transform: 'rotate(2deg)'
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="w-4 h-4 text-[#F9DACA]" />
                  <span className="text-white/70 text-sm font-['adobe-devanagari_844']">{t('location')}</span>
                </div>
                <div className="text-2xl font-['CormorantSC-Bold'] text-white mb-1">Paris, France</div>
                <div className="text-white/60 text-sm font-['adobe-devanagari_844']">15 Rajab 1448</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gradient glow - Enhanced for visibility */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#E5D6BF]/15 rounded-full blur-[150px] pointer-events-none" />
    </div>
  );
}