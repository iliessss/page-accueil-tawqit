import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import lightModeScreenshot1 from 'figma:asset/f7bfae298f7f1e8b8bb566f5c430ef8e59014141.png';
import lightModeScreenshot2 from 'figma:asset/1f26c075e00d585d011aa0ff2c4dfbb1aea3d556.png';
import lightModeScreenshot1En from 'figma:asset/62075090d82344e425ae2f19dfdbf2db676315d9.png';
import lightModeScreenshot2En from 'figma:asset/a6f445e9aa860632565a5d7988220db5be3fcae3.png';
import darkModeScreenshot1 from 'figma:asset/ca213ac505fafdfabc5a763618a5b4a256e412d6.png';
import darkModeScreenshot2 from 'figma:asset/03913e187d3b3dc240cf536f0625df6fa92e6a44.png';
import darkModeScreenshot1En from 'figma:asset/92de24d31b59334838795fdf0a2503dd461274e5.png';
import darkModeScreenshot2En from 'figma:asset/81f2d9f1fff6d156cf3a1e3e058707d6ec309b83.png';
import backgroundLight from 'figma:asset/e24de73c67279cf27f53290c20cb3ea4e31a70b6.png';
import backgroundDark from 'figma:asset/8e763fc6c51997bb726189026bda5de1dc5e82de.png';
import { useLanguage } from './LanguageContext';

interface AppPreviewProps {
  darkMode: boolean;
}

export function AppPreview({ darkMode }: AppPreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { language } = useLanguage();
  
  const backgroundImage = darkMode ? backgroundDark : backgroundLight;

  const screenshotsLight = [
    {
      title: 'Horaires',
      description: 'Vue principale avec compte à rebours',
      image: language === 'en' ? lightModeScreenshot1En : lightModeScreenshot1
    },
    {
      title: 'Réglages',
      description: 'Paramétrage avancé des méthodes',
      image: language === 'en' ? lightModeScreenshot2En : lightModeScreenshot2
    }
  ];

  const screenshotsDark = [
    {
      title: 'Horaires',
      description: 'Vue principale avec compte à rebours',
      image: language === 'en' ? darkModeScreenshot1En : darkModeScreenshot1
    },
    {
      title: 'Réglages',
      description: 'Paramétrage avancé des méthodes',
      image: language === 'en' ? darkModeScreenshot2En : darkModeScreenshot2
    }
  ];

  const screenshots = darkMode ? screenshotsDark : screenshotsLight;

  const controls = [
    'Méthode Asr',
    'Akhir Icha',
    'Horaires alternatives (Jours/Nuits polaires)',
    'Notifications'
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <div className="py-24 lg:py-32 relative" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-['CormorantSC-Regular'] text-4xl lg:text-5xl xl:text-6xl text-white mb-6 tracking-wide">
            Aperçu
          </h2>
          <p className="font-['adobe-devanagari_844'] text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Une interface claire qui met l'accent sur l'essentiel
          </p>
        </motion.div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Screenshots Carousel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[9/19.5] max-w-[360px] mx-auto">
              {/* iPhone Frame */}
              <div className="relative w-full h-full bg-black rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full"
                    >
                      {screenshots[currentSlide].image ? (
                        <img 
                          src={screenshots[currentSlide].image!} 
                          alt={screenshots[currentSlide].title}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-b from-[#545785] to-[#3B3E6C] flex flex-col items-center justify-center text-white/30 text-sm p-8">
                          <div className="text-center">
                            <div className="text-6xl mb-4">⚙️</div>
                            <div className="text-white text-lg font-semibold mb-2">
                              {screenshots[currentSlide].title}
                            </div>
                            <div className="text-white/60">
                              {screenshots[currentSlide].description}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Carousel Controls */}
              <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center border border-white/20"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </motion.button>

                <div className="flex gap-2">
                  {screenshots.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlide
                          ? 'w-8 bg-white'
                          : 'w-2 bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center border border-white/20"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Right: Controls & Dark Mode */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* What you control */}
            <div>
              <h3 className="font-['CormorantSC-Regular'] text-3xl lg:text-4xl text-white mb-6 tracking-wide">
                Ce que vous contrôlez
              </h3>
              <div className="space-y-4">
                {controls.map((control, index) => (
                  <motion.div
                    key={control}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:bg-white/15 hover:border-white/30 hover:shadow-lg transition-all group"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-white/30 transition-colors">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-['CormorantSC-Light'] text-white text-lg leading-relaxed">{control}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Dark Mode Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border-2 border-white/20 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-['CormorantSC-Light'] text-2xl lg:text-3xl text-white mb-2">Mode sombre</h4>
                  <p className="font-['adobe-devanagari_844'] text-white/70">Confort visuel optimal</p>
                </div>
                <div className="w-14 h-8 bg-white/20 rounded-full flex items-center px-1">
                  <motion.div
                    className="w-6 h-6 bg-white rounded-full shadow-lg"
                    animate={{ x: darkMode ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 h-20 rounded-xl bg-gradient-to-b from-[#545785] to-[#3B3E6C] border-2 border-white/20" />
                <div className="flex-1 h-20 rounded-xl bg-gradient-to-b from-[#2C2A5A] to-[#1F1D42] border-2 border-white/40" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}