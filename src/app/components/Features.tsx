import React from 'react';
import { motion } from 'motion/react';
import { Eye, Settings, Globe, Sparkles } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Eye,
      title: "Interface pensée pour aller à l'essentiel",
      description: "Design minimaliste et épuré pour une expérience fluide et sans distraction"
    },
    {
      icon: Settings,
      title: "Paramétrage des méthodes",
      description: "Choisissez la méthode de calcul adaptée à votre région et vos besoins"
    },
    {
      icon: Globe,
      title: "Affichage lisible",
      description: "Typographie claire et contrastes optimisés pour une lecture parfaite"
    }
  ];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F9DACA] via-[#F9DACA] to-[#EED4C5]" />
      
      {/* Subtle radial glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/30 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#2C2A5A]/5 rounded-full blur-3xl opacity-40" />

      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTAgMEw1MCAxMDBNMCA1MEwxMDAgNTBNMTUgMTVMODUgODVNODUgMTVMMTUgODUiIHN0cm9rZT0iIzJDMkE1QSIgc3Ryb2tlLXdpZHRoPSIwLjUiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzMCIgc3Ryb2tlPSIjMkMyQTVBIiBzdHJva2Utd2lkdGg9IjAuNSIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==')] bg-repeat pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-24">
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              {/* Icon Container with Premium Effects */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="relative mb-8 mx-auto w-24 h-24 flex items-center justify-center"
              >
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 to-white/20 blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
                
                {/* Main icon circle - Glassmorphism */}
                <div className="relative w-20 h-20 rounded-full bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl flex items-center justify-center group-hover:shadow-3xl transition-all duration-500">
                  {/* Inner gradient glow */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-[#2C2A5A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon */}
                  <feature.icon className="relative w-9 h-9 text-[#2C2A5A] group-hover:text-[#2C2A5A]/90 transition-colors duration-300" strokeWidth={1.5} />
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 via-transparent to-transparent opacity-40" />
                </div>

                {/* Sparkle decoration */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="w-5 h-5 text-[#2C2A5A]/40" fill="currentColor" />
                </motion.div>
              </motion.div>

              {/* Text Content */}
              <div className="text-center space-y-4">
                <h3 className="font-['CormorantSC-Regular'] text-[#2C2A5A] text-xl lg:text-2xl leading-snug px-4 group-hover:text-[#2C2A5A]/90 transition-colors">
                  {feature.title}
                </h3>
                <p className="font-['adobe-devanagari_844'] text-[#2C2A5A]/70 text-base leading-relaxed px-2 group-hover:text-[#2C2A5A]/80 transition-colors">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}