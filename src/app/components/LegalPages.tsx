import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from './LanguageContext';

// Infos de l'association éditrice. À COMPLÉTER avant mise en ligne.
const ORG = {
  name: 'LOGARITHMES',
  form: 'Association loi 1901',
  address: '[adresse du siège]',
  rna: '[n° RNA W…]',
  publisher: '[directeur·rice de la publication]',
  email: 'contact@tawqit.org',
};

export type LegalPage = 'mentions-legales' | 'confidentialite';

export const LEGAL_HASHES: Record<string, LegalPage> = {
  '#mentions-legales': 'mentions-legales',
  '#confidentialite': 'confidentialite',
};

function Mentions() {
  return (
    <>
      <h2>Mentions légales</h2>
      <h3>Éditeur du site</h3>
      <p>
        Le site <strong>tawqit.org</strong> et l'application <strong>Tawqit</strong> sont édités par l'association{' '}
        <strong>{ORG.name}</strong> ({ORG.form}), dont le siège est situé {ORG.address}, déclarée sous le n° {ORG.rna}.
        <br />
        Directeur de la publication : {ORG.publisher}.
        <br />
        Contact : <a href={`mailto:${ORG.email}`}>{ORG.email}</a>
      </p>
      <h3>Hébergement</h3>
      <p>
        Site hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>).
        <br />
        Le calcul des horaires est assuré par un service de l'association hébergé par Google Cloud (région Belgique,
        europe-west1).
      </p>
      <h3>Propriété intellectuelle</h3>
      <p>
        Le nom Tawqit, le logo, les textes et les visuels de ce site sont la propriété de l'association {ORG.name}.
        Toute reproduction sans autorisation est interdite. Le moteur de calcul astronomique Tawqit est un logiciel
        propriétaire de l'association.
      </p>
      <h3>Dons</h3>
      <p>
        Les dons sont collectés pour le compte de l'association via la plateforme Donorbox (
        <a href="https://donorbox.org/tawqit" target="_blank" rel="noopener noreferrer">donorbox.org/tawqit</a>).
        Aucune donnée bancaire ne transite par tawqit.org.
      </p>
    </>
  );
}

function Privacy() {
  return (
    <>
      <h2>Politique de confidentialité</h2>
      <p>
        L'association {ORG.name} attache une grande importance à la protection de vos données. Ce site et
        l'application Tawqit ont été conçus pour en collecter le moins possible.
      </p>
      <h3>Site tawqit.org</h3>
      <ul>
        <li>
          <strong>Aucun cookie</strong>, aucun traceur, aucune mesure d'audience.
        </li>
        <li>
          La <strong>ville choisie</strong> pour l'affichage des horaires est mémorisée uniquement dans votre
          navigateur (stockage local). Elle n'est jamais transmise à un serveur autrement que sous forme de
          coordonnées géographiques, le temps du calcul des horaires.
        </li>
        <li>
          La <strong>géolocalisation</strong> (« Me localiser ») n'est utilisée qu'avec votre accord explicite, dans
          votre navigateur, pour retrouver la ville la plus proche. La position n'est ni enregistrée ni transmise.
        </li>
        <li>
          Les requêtes de calcul d'horaires sont traitées par un serveur de l'association hébergé par Google Cloud ;
          seules les coordonnées, le fuseau horaire et la date sont envoyés. Les journaux techniques du serveur
          (adresse IP, horodatage) sont conservés 30 jours au maximum à des fins de sécurité.
        </li>
      </ul>
      <h3>Application mobile Tawqit</h3>
      <ul>
        <li>Les horaires sont calculés localement sur votre appareil : aucune donnée n'est envoyée à nos serveurs.</li>
        <li>
          La position de l'appareil, si vous l'autorisez, sert uniquement au calcul et reste sur l'appareil.
        </li>
        <li>Aucun compte, aucune publicité, aucun traceur.</li>
      </ul>
      <h3>Dons</h3>
      <p>
        Les dons sont traités par Donorbox, qui agit comme sous-traitant de paiement et applique sa propre politique
        de confidentialité. L'association ne reçoit que les informations nécessaires à l'émission du reçu fiscal.
      </p>
      <h3>Vos droits</h3>
      <p>
        Conformément au RGPD, vous pouvez exercer vos droits d'accès, de rectification et d'effacement en écrivant à{' '}
        <a href={`mailto:${ORG.email}`}>{ORG.email}</a>.
      </p>
    </>
  );
}

export function LegalPages() {
  const [page, setPage] = useState<LegalPage | null>(() => LEGAL_HASHES[window.location.hash] ?? null);
  const { t } = useLanguage();

  useEffect(() => {
    const onHash = () => setPage(LEGAL_HASHES[window.location.hash] ?? null);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (!page) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [page]);

  const close = () => {
    history.replaceState(null, '', window.location.pathname + window.location.search);
    setPage(null);
  };

  if (!page) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#2C2A5A]/90 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div className="min-h-full flex items-start justify-center p-4 sm:p-8">
        <div className="relative w-full max-w-3xl bg-[#F9DACA] text-[#2C2A5A] rounded-3xl shadow-2xl p-6 sm:p-10 my-8">
          <button
            type="button"
            onClick={close}
            aria-label={t('legalClose')}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#2C2A5A]/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="legal-prose font-['adobe-devanagari_844'] text-lg leading-relaxed">
            {page === 'mentions-legales' ? <Mentions /> : <Privacy />}
          </div>
        </div>
      </div>
    </div>
  );
}
