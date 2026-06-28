import React from 'react';
import violetBackground from 'figma:asset/5bf2532ea612c1cb698a05daabf0c760125b57f9.png';

interface SectionBackgroundProps {
  variant: 'violet' | 'beige';
  children: React.ReactNode;
  className?: string;
}

export function SectionBackground({ variant, children, className = '' }: SectionBackgroundProps) {
  const colors = {
    violet: {
      bg: '#2C2A5A',
      text: 'text-white',
      overlay: 'rgba(44, 42, 90, 0.85)'
    },
    beige: {
      bg: '#F9DACA',
      text: 'text-[#2C2A5A]',
      overlay: 'rgba(249, 218, 202, 0.95)'
    }
  };

  const color = colors[variant];

  return (
    <div 
      className={`relative ${color.text} ${className}`}
      style={{ 
        backgroundColor: color.bg
      }}
    >
      {/* Background Image for Violet Sections */}
      {variant === 'violet' && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${violetBackground})`,
              opacity: 0.95
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 30% 50%, rgba(74, 72, 112, 0.3) 0%, transparent 60%)',
              pointerEvents: 'none'
            }}
          />
        </>
      )}

      {/* Geometric pattern for Beige Sections */}
      {variant === 'beige' && (
        <>
          <div 
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M40 0l40 40-40 40L0 40z' stroke='%23000' stroke-opacity='0.3' stroke-width='0.5'/%3E%3Cpath d='M20 20l20 20-20 20-20-20z' stroke='%23000' stroke-opacity='0.2' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '80px 80px',
              pointerEvents: 'none'
            }}
          />
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.5) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
