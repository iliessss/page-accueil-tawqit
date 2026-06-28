import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Moon, Sunset } from 'lucide-react';
import backgroundLight from 'figma:asset/e24de73c67279cf27f53290c20cb3ea4e31a70b6.png';
import backgroundDark from 'figma:asset/8e763fc6c51997bb726189026bda5de1dc5e82de.png';

interface MethodsProps {
  darkMode?: boolean;
}

export function Methods({ darkMode = false }: MethodsProps) {
  const backgroundImage = darkMode ? backgroundDark : backgroundLight;
  const methods = [
    {
      icon: BookOpen,
      title: 'Asr: écoles juridiques',
      description: 'Choisissez entre la méthode Shafi\'i/Maliki/Hanbali (ombre égale à la longueur de l\'objet) ou Hanafi (ombre égale au double).',
      color: '#2C2A5A'
    },
    {
      icon: Moon,
      title: 'Akhir Icha: tiers ou milieu de nuit',
      description: 'Définissez la fin du temps de Icha selon le tiers de la nuit ou le milieu de la nuit, selon votre école.',
      color: '#4A4870'
    },
    {
      icon: Sunset,
      title: 'Jours/Nuits polaires: comportements alternatifs',
      description: 'Dans les régions à hautes latitudes, utilisez des méthodes alternatives pour calculer les horaires quand le soleil ne se couche pas.',
      color: '#C24A4A',
      polar: true
    }
  ];

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
          <h2 className="font-['CormorantSC-Bold'] text-4xl lg:text-5xl xl:text-6xl text-white mb-6 tracking-wide leading-tight">
            Réglages avancés,<br />expliqués simplement.
          </h2>
          <p className="font-['adobe-devanagari_844'] text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Comprenez et contrôlez les détails qui comptent pour vos prières
          </p>
        </motion.div>

        {/* Methods Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {methods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`group relative p-8 rounded-3xl backdrop-blur-xl border-2 transition-all shadow-xl hover:shadow-2xl ${
                method.polar
                  ? 'bg-white/10 border-[#F9DACA]/30 hover:border-[#F9DACA]/50'
                  : 'bg-white/5 border-white/20 hover:border-white/30'
              }`}
            >
              {/* Glow effect */}
              <div 
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl"
                style={{ backgroundColor: method.polar ? '#F9DACA' : '#E5D6BF' }}
              />

              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
                  method.polar ? 'bg-[#F9DACA]/20' : 'bg-white/10'
                }`}
              >
                <method.icon 
                  className={`w-10 h-10 ${
                    method.polar ? 'text-[#F9DACA]' : 'text-white'
                  }`}
                />
              </motion.div>

              {/* Content */}
              <h3 className={`font-['CormorantSC-Regular'] text-2xl lg:text-3xl mb-4 tracking-wide ${method.polar ? 'text-[#F9DACA]' : 'text-white'}`}>
                {method.title}
              </h3>
              <p className={`font-['adobe-devanagari_844'] text-base leading-relaxed ${method.polar ? 'text-[#F9DACA]/80' : 'text-white/70'}`}>
                {method.description}
              </p>

              {/* Decorative element */}
              <div className={`absolute bottom-8 right-8 w-12 h-12 rounded-full opacity-5 ${
                method.polar ? 'bg-[#F9DACA]' : 'bg-white'
              }`} />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="font-['adobe-devanagari_844'] text-white/70 text-lg mb-6 leading-relaxed">
            Tous ces réglages sont accessibles directement dans l'application
          </p>
          <motion.a
            href="#android"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-white/20 text-white rounded-2xl font-['CormorantSC-Bold'] text-lg hover:bg-white/30 transition-all shadow-xl border border-white/30"
          >
            Télécharger maintenant
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}