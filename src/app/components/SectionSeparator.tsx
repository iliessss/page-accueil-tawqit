import React from 'react';
import { motion } from 'motion/react';

interface SectionSeparatorProps {
  variant?: 'wave' | 'diagonal' | 'curve';
  color?: 'gold' | 'rose' | 'white';
  position?: 'top' | 'bottom';
}

export function SectionSeparator({ 
  variant = 'wave', 
  color = 'gold',
  position = 'bottom' 
}: SectionSeparatorProps) {
  const colors = {
    gold: '#E5D6BF',
    rose: '#F9DACA',
    white: '#FFFFFF'
  };

  const paths = {
    wave: 'M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z',
    diagonal: 'M0,0 L1440,0 L1440,96 L0,0 Z',
    curve: 'M0,64 Q360,0 720,64 T1440,64 L1440,0 L0,0 Z'
  };

  return (
    <div className={`relative w-full overflow-hidden ${position === 'top' ? 'rotate-180' : ''}`}>
      <motion.svg
        initial={{ opacity: 0, y: position === 'bottom' ? 20 : -20 }}
        whileInView={{ opacity: 0.15, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full h-16 md:h-24"
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={paths[variant]}
          fill={colors[color]}
        />
      </motion.svg>
    </div>
  );
}
