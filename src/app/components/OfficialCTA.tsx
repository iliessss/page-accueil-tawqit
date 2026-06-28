import React from 'react';
import { motion } from 'motion/react';
import { Shield, CheckCircle, Award } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface OfficialCTAProps {
  variant?: 'light' | 'dark';
  showTrustBadges?: boolean;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical';
}

export function OfficialCTA({ 
  variant = 'dark', 
  showTrustBadges = true, 
  size = 'lg',
  layout = 'horizontal' 
}: OfficialCTAProps) {
  const isLight = variant === 'light';
  const { t } = useLanguage();
  
  const sizes = {
    sm: { px: 'px-6', py: 'py-3', text: 'text-base', leading: 'leading-snug' },
    md: { px: 'px-8', py: 'py-4', text: 'text-lg', leading: 'leading-snug' },
    lg: { px: 'px-10', py: 'py-5', text: 'text-xl', leading: 'leading-tight' }
  };
  
  const currentSize = sizes[size];

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Main CTA Buttons */}
      <div className={`flex ${layout === 'vertical' ? 'flex-col' : 'flex-col sm:flex-row'} gap-4 w-full max-w-3xl justify-center items-center`}>
        {/* iOS Download Button - Solid Beige */}
        <motion.a
          href="https://apps.apple.com/fr/app/tawqit/id6758964906"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className={`${currentSize.px} ${currentSize.py} rounded-full bg-[#F9DACA] hover:bg-[#E5D6BF] text-[#2C2A5A] font-['CormorantSC-Bold'] font-semibold ${currentSize.text} ${currentSize.leading} transition-all shadow-xl hover:shadow-2xl text-center`}
        >
          {t('downloadIOS')}
        </motion.a>

        {/* Android Download Button - Solid Green */}
        <motion.a
          href="https://play.google.com/store/apps/details?id=com.tawqit.tawqit"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className={`${currentSize.px} ${currentSize.py} rounded-full bg-[#34A853] hover:bg-[#2D9548] text-white font-['CormorantSC-Bold'] font-semibold ${currentSize.text} ${currentSize.leading} transition-all shadow-xl hover:shadow-2xl text-center`}
        >
          {t('downloadAndroid')}
        </motion.a>
      </div>

      {/* Trust Badges */}
      {showTrustBadges && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-6 pt-2"
        >
          {/* Certified Badge */}
          <div className={`flex items-center gap-2 ${
            isLight ? 'text-[#2C2A5A]/70' : 'text-white/70'
          }`}>
            <Shield className="w-5 h-5" />
            <span className="text-sm font-['adobe-devanagari_844'] font-medium">{t('certifiedBadge')}</span>
          </div>

          {/* Secure Badge */}
          <div className={`flex items-center gap-2 ${
            isLight ? 'text-[#2C2A5A]/70' : 'text-white/70'
          }`}>
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-['adobe-devanagari_844'] font-medium">{t('secureBadge')}</span>
          </div>

          {/* Quality Badge */}
          <div className={`flex items-center gap-2 ${
            isLight ? 'text-[#2C2A5A]/70' : 'text-white/70'
          }`}>
            <Award className="w-5 h-5" />
            <span className="text-sm font-['adobe-devanagari_844'] font-medium">{t('qualityBadge')}</span>
          </div>
        </motion.div>
      )}

      {/* Social Proof Line */}
      {showTrustBadges && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-center text-sm font-['adobe-devanagari_844'] ${
            isLight ? 'text-[#2C2A5A]/60' : 'text-white/60'
          }`}
        >
          {t('socialProof')}
        </motion.p>
      )}
    </div>
  );
}