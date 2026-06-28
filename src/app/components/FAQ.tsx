import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'L\'app est-elle gratuite ?',
      answer: 'Oui, Tawqit est entièrement gratuite et sans publicité. Notre objectif est de fournir un outil simple et fiable pour tous.'
    },
    {
      question: 'Puis-je changer la ville facilement ?',
      answer: 'Absolument. L\'app utilise votre localisation ou vous permet de rechercher manuellement n\'importe quelle ville dans le monde.'
    },
    {
      question: 'Comment fonctionnent les notifications ?',
      answer: 'Vous pouvez activer des notifications pour chaque prière, avec des options de personnalisation (temps avant l\'appel, sonnerie, etc.).'
    },
    {
      question: 'Qu\'est-ce que les jours polaires ?',
      answer: 'Dans certaines régions à hautes latitudes, le soleil ne se couche pas en été ou ne se lève pas en hiver. Tawqit propose des méthodes alternatives reconnues pour ces situations.'
    },
    {
      question: 'Puis-je utiliser le mode sombre ?',
      answer: 'Oui ! L\'app propose un mode sombre élégant qui s\'active automatiquement selon vos préférences système, ou manuellement.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-24 lg:py-32 relative">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-['CormorantSC-Bold'] text-4xl lg:text-5xl xl:text-6xl text-[#2C2A5A] mb-6 tracking-wide">
            Questions fréquentes
          </h2>
          <p className="font-['adobe-devanagari_844'] text-xl text-[#2C2A5A]/70 max-w-2xl mx-auto leading-relaxed">
            Tout ce que vous devez savoir sur Tawqit
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl bg-white/60 backdrop-blur-sm border border-[#2C2A5A]/20 overflow-hidden hover:bg-white/80 hover:border-[#2C2A5A]/30 transition-all shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 lg:px-8 py-6 flex items-center justify-between text-left gap-4"
              >
                <span className="font-['CormorantSC-Regular'] text-lg lg:text-xl text-[#2C2A5A] tracking-wide">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-6 h-6 text-[#2C2A5A]" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="font-['adobe-devanagari_844'] px-6 lg:px-8 pb-6 text-[#2C2A5A]/70 text-base lg:text-lg leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
          <p className="font-['adobe-devanagari_844'] text-[#2C2A5A]/70 text-lg mb-6 leading-relaxed">
            Vous avez d'autres questions ?
          </p>
          <motion.a
            href="mailto:support@tawqit.app"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 border-2 border-[#2C2A5A]/30 text-[#2C2A5A] rounded-2xl font-['CormorantSC-Bold'] hover:bg-[#2C2A5A]/5 transition-all tracking-wide"
          >
            Contactez-nous
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}