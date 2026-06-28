import React from 'react';
import astrolabeIconLight from 'figma:asset/c8309ea70c938be44b127e22121dbcf8857f858c.png';
import astrolabeIconDark from 'figma:asset/eafe33705c5600570a1d6b10a52d36d26fdd436e.png';

interface BrandLockupProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'horizontal' | 'vertical';
  showTagline?: boolean;
  theme?: 'light' | 'dark';
}

export function BrandLockup({ 
  size = 'md', 
  variant = 'horizontal',
  showTagline = false,
  theme = 'light'
}: BrandLockupProps) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-xl', tagline: 'text-xs' },
    md: { icon: 'w-10 h-10', text: 'text-2xl', tagline: 'text-sm' },
    lg: { icon: 'w-16 h-16', text: 'text-4xl', tagline: 'text-base' }
  };

  const currentSize = sizes[size];
  const textColor = 'text-white';
  // Theme dark → logo dark, Theme light → logo light
  const astrolabeIcon = theme === 'dark' ? astrolabeIconDark : astrolabeIconLight;

  return (
    <div className={`flex ${variant === 'vertical' ? 'flex-col items-center text-center' : 'items-center gap-3'}`}>
      {/* Astrolabe Icon */}
      <div className={`${currentSize.icon} flex-shrink-0`}>
        <img 
          src={astrolabeIcon} 
          alt="Tawqit Astrolabe" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Brand Name & Tagline */}
      <div className={variant === 'vertical' ? 'mt-3' : ''}>
        <div className={`font-['CormorantSC-Bold'] ${currentSize.text} ${textColor} tracking-wide`}>
          Tawqit
        </div>
        {showTagline && (
          <div className={`font-['Inter'] ${currentSize.tagline} ${textColor} opacity-70 mt-1`}>
            Horaires de prière précis
          </div>
        )}
      </div>
    </div>
  );
}