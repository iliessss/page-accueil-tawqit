import React from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { PrayerTimes } from './PrayerTimes';
import { Features } from './Features';
import { AppPreview } from './AppPreview';
import { Methods } from './Methods';
import { About } from './About';
import { FAQ } from './FAQ';
import { Footer } from './Footer';
import { GlobalBackground } from './GlobalBackground';
import { SectionBackground } from './SectionBackground';
import { SectionSeparator } from './SectionSeparator';

interface AppWrapperProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export function AppWrapper({ darkMode, setDarkMode }: AppWrapperProps) {
  return (
    <div className={darkMode ? 'dark' : ''}>
      <GlobalBackground>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <main>
          {/* HORAIRES PAR VILLE - Violet */}
          <SectionBackground variant="violet">
            <section id="horaires">
              <PrayerTimes />
            </section>
          </SectionBackground>

          <SectionSeparator variant="curve" color="rose" position="bottom" />

          {/* HERO - Violet */}
          <SectionBackground variant="violet">
            <section id="hero">
              <Hero darkMode={darkMode} />
            </section>
          </SectionBackground>

          <SectionSeparator variant="wave" color="gold" position="bottom" />

          {/* FEATURES - Beige */}
          <SectionBackground variant="beige">
            <section id="fonctionnalites">
              <Features />
            </section>
          </SectionBackground>

          <SectionSeparator variant="curve" color="rose" position="bottom" />

          {/* APP PREVIEW - Violet */}
          <SectionBackground variant="violet">
            <section id="apercu">
              <AppPreview darkMode={darkMode} />
            </section>
          </SectionBackground>

          <SectionSeparator variant="diagonal" color="gold" position="bottom" />

          {/* METHODS - Violet */}
          <SectionBackground variant="violet">
            <section id="methodes">
              <Methods darkMode={darkMode} />
            </section>
          </SectionBackground>

          <SectionSeparator variant="curve" color="gold" position="bottom" />

          {/* ABOUT - Beige */}
          <SectionBackground variant="beige">
            <section id="qui-sommes-nous">
              <About />
            </section>
          </SectionBackground>

          <SectionSeparator variant="wave" color="rose" position="bottom" />

          {/* FAQ - Violet */}
          <SectionBackground variant="violet">
            <section id="faq">
              <FAQ />
            </section>
          </SectionBackground>

          <SectionSeparator variant="wave" color="rose" position="bottom" />
        </main>
        
        {/* FOOTER - Violet */}
        <SectionBackground variant="violet">
          <Footer darkMode={darkMode} />
        </SectionBackground>
      </GlobalBackground>
    </div>
  );
}
