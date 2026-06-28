import React from 'react';

interface GlobalBackgroundProps {
  children: React.ReactNode;
}

export function GlobalBackground({ children }: GlobalBackgroundProps) {
  return (
    <div className="relative min-h-screen">
      {/* Base gradient background - clean, no logo */}
      <div 
        className="fixed inset-0"
        style={{ 
          background: 'linear-gradient(135deg, #2C2A5A 0%, #4A4870 50%, #F9DACA 100%)',
          zIndex: -2
        }}
      />
      
      {/* Subtle geometric pattern - very discreet */}
      <div 
        className="fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23000' fill-opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
          zIndex: -1
        }}
      />
      
      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
