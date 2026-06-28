import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Smartphone, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { OfficialCTA } from './OfficialCTA';

export function AndroidSoon() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  const timeline = [
    { label: 'Beta', status: 'completed' },
    { label: 'Publication', status: 'in-progress' },
    { label: 'Déploiement', status: 'upcoming' }
  ];

  return (
    <div className="py-24 lg:py-32 relative">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Main Card */}
          <div className="relative p-12 lg:p-16 rounded-[3rem] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border-2 border-white/30 overflow-hidden shadow-2xl">
            {/* Glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E5D6BF]/30 rounded-full blur-[140px]" />

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Badge */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2C2A5A]/20 backdrop-blur-sm rounded-full mb-8"
              >
                <Smartphone className="w-4 h-4 text-[#2C2A5A]" />
                <span className="font-['CormorantSC-Regular'] text-[#2C2A5A] text-sm tracking-wide">BIENTÔT DISPONIBLE</span>
              </motion.div>

              {/* Title */}
              <h2 className="font-['CormorantSC-Bold'] text-4xl lg:text-5xl xl:text-6xl text-[#2C2A5A] mb-6">
                Android arrive bientôt.
              </h2>

              {/* Description */}
              <p className="font-['adobe-devanagari_844'] text-xl text-[#2C2A5A]/70 mb-12 max-w-2xl mx-auto">
                L'app Android est en cours de finalisation. Inscrivez-vous pour être 
                averti dès la sortie.
              </p>

              {/* Official CTA Section */}
              <div className="mb-12">
                <OfficialCTA variant="light" showTrustBadges={true} />
              </div>

              {/* Timeline */}
              <div className="flex justify-center gap-4 mb-12">
                {timeline.map((step, index) => (
                  <div key={step.label} className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                          step.status === 'completed'
                            ? 'bg-[#2C2A5A] text-white'
                            : step.status === 'in-progress'
                            ? 'bg-[#2C2A5A] text-white animate-pulse'
                            : 'bg-[#2C2A5A]/10 text-[#2C2A5A]/50'
                        }`}
                      >
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : step.status === 'in-progress' ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <span className="text-sm font-bold">{index + 1}</span>
                        )}
                      </div>
                      <span
                        className={`font-['CormorantSC-Regular'] text-sm ${
                          step.status === 'upcoming' ? 'text-[#2C2A5A]/50' : 'text-[#2C2A5A]'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < timeline.length - 1 && (
                      <div
                        className={`w-16 h-1 rounded-full mb-8 ${
                          step.status === 'completed' ? 'bg-[#2C2A5A]' : 'bg-[#2C2A5A]/20'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Email Form */}
              {!submitted ? (
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="max-w-md mx-auto"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2C2A5A]/50" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.fr"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-[#2C2A5A]/20 rounded-2xl text-[#2C2A5A] placeholder:text-[#2C2A5A]/50 focus:outline-none focus:border-[#2C2A5A] transition-colors"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-[#2C2A5A] text-white rounded-2xl font-['CormorantSC-Bold'] hover:bg-[#3B3E6C] transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      ) : (
                        'Me prévenir'
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-md mx-auto p-6 bg-[#2C2A5A]/10 rounded-2xl border border-[#2C2A5A]/20"
                >
                  <CheckCircle2 className="w-12 h-12 text-[#2C2A5A] mx-auto mb-4" />
                  <p className="text-[#2C2A5A] text-lg font-semibold mb-2">
                    Merci de votre inscription !
                  </p>
                  <p className="text-[#2C2A5A]/70">
                    Nous vous préviendrons dès que l'app Android sera disponible.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}