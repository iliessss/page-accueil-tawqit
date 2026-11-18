'use strict';

/* Adresse du script d'enregistrement : à remplacer par l'URL /exec au branchement */
const ENDPOINT = 'https://script.google.com/macros/s/AKfycbyFI53PCO7fsarMzTwdORCX3yMXSWcFJfkaZN-yAbJmUoRmzw1fTxjZ07I6nGGD14dI5A/exec';

/* Réglages à relire avant la mise en ligne */
const BLOQUER_PARTICULIER = true;
const DELAI_MIN_JOURS = 1;
const DUREE_MIN_MS = 3000;
// Au-delà, l'envoi est abandonné côté navigateur (message d'échec, bouton réactivé, identifiant d'envoi conservé)
let DELAI_REPONSE_MS = 30000;
const CLE_STOCKAGE = 'tawqit-intervention-v1';
const CLE_IDENTIFIANT = 'tawqit-intervention-id';

/* Textes de COPY.md, section « Messages d'erreur » et boutons */
const MSG = {
  vide: 'Ce champ est nécessaire.',
  courriel: 'Cette adresse ne semble pas complète.',
  telephone: 'Ce numéro ne semble pas complet.',
  datePassee: 'Choisissez une date à venir.',
  recapUn: 'Il manque 1 information. Le premier champ à compléter est signalé ci-dessous.',
  recapPlusieurs: 'Il manque {n} informations. Le premier champ à compléter est signalé ci-dessous.',
  echec: "L'envoi n'a pas pu être confirmé. Vos réponses restent sur cette page. Si vous avez reçu un accusé de réception par courriel, votre demande est enregistrée. Sinon, réessayez dans un instant ou écrivez-nous à contact@tawqit.org.",
  conflit: 'Une première version de votre demande est déjà enregistrée sous la référence {reference}. Pour la corriger, écrivez à contact@tawqit.org en rappelant cette référence.',
  envoi: 'Envoi en cours…',
  lienCopie: 'Lien copié.'
};
const MESSAGES_CODE = { vide: MSG.vide, courriel: MSG.courriel, telephone: MSG.telephone, date_passee: MSG.datePassee };

/* Valeurs admises (identiques à backend/Code.gs) */
const TYPES = ['mosquee', 'institut', 'association', 'organisation', 'particulier'];
const FONCTIONS = ['president', 'bureau', 'imam', 'direction', 'mandate', 'autre'];
const FORMATS = ['conference', 'conference_qr', 'cours', 'regroupement', 'a_definir'];
const EQUIPEMENTS = ['femmes', 'sono', 'ecran'];
const OUI_NON = ['oui', 'non', 'a_discuter'];
const MOMENTS = ['matin', 'apres_midi', 'soiree', 'vendredi', 'week_end'];

/* Ordre du formulaire : sert au focus du premier champ et au récapitulatif */
const ORDRE = [
  'type_demandeur',
  'structure_nom', 'ville', 'code_postal', 'pays',
  'nom_prenom', 'fonction', 'fonction_autre', 'courriel', 'telephone', 'certifie_habilite',
  'format',
  'voeu1_date', 'voeu1_moment', 'voeu2_date', 'voeu2_moment', 'voeu3_date', 'voeu3_moment',
  'accepte_frais', 'accepte_don', 'collecte', 'accepte_donnees'
];
/* Étape de l'assistant où se trouve chaque champ (4 étapes) */
const ETAPES = 4;
const ETAPE_DE = {
  type_demandeur: 1, structure_nom: 1, ville: 1, code_postal: 1, pays: 1,
  nom_prenom: 2, fonction: 2, fonction_autre: 2, courriel: 2, telephone: 2, certifie_habilite: 2,
  format: 3,
  voeu1_date: 3, voeu1_moment: 3, voeu2_date: 3, voeu2_moment: 3, voeu3_date: 3, voeu3_moment: 3,
  accepte_frais: 4, accepte_don: 4, collecte: 4, accepte_donnees: 4
};

/* ---------- Dates ---------- */
/* Le serveur compte les jours à Paris : la page fait de même, quel que soit le fuseau du navigateur */
const FORMAT_JOUR_PARIS = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' });
function aujourdhuiParis() {
  const o = {};
  FORMAT_JOUR_PARIS.formatToParts(new Date()).forEach(p => { o[p.type] = p.value; });
  return o.year + '-' + o.month + '-' + o.day;
}
function ajouterJours(iso, n) {
  const [a, m, j] = iso.split('-').map(Number);
  const d = new Date(Date.UTC(a, m - 1, j) + n * 86400000);
  return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
}
function dateIsoValide(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [a, m, j] = s.split('-').map(Number);
  const d = new Date(Date.UTC(a, m - 1, j));
  return d.getUTCFullYear() === a && d.getUTCMonth() === m - 1 && d.getUTCDate() === j;
}
const dateMin = () => ajouterJours(aujourdhuiParis(), DELAI_MIN_JOURS);
function majDateMin() {
  const min = dateMin();
  ['voeu1_date', 'voeu2_date', 'voeu3_date'].forEach(n => { form.elements[n].min = min; });
}

/* Empreinte des réponses (somme de contrôle, pas un secret) : le serveur repère un même identifiant renvoyé avec d'autres réponses. */
function empreinteDe(v) {
  const texte = JSON.stringify(Object.keys(v).sort().map(k => [k, v[k]]));
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < texte.length; i++) {
    const c = texte.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
}

/* ---------- Validation (mêmes règles que validerDemande_ dans backend/Code.gs) ---------- */
const vide = s => String(s == null ? '' : s).trim() === '';
/* Même contrôle que le serveur : forme, caractères refusés, longueur maximale */
const COURRIEL_MAX = 254;
const courrielValide = c => c.length <= COURRIEL_MAX && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c) && !/[\r\n,;<>]/.test(c);

function valider(v) {
  const e = {};
  const exige = (nom) => { if (vide(v[nom])) e[nom] = 'vide'; };
  const dans = (nom, liste) => { if (vide(v[nom]) || liste.indexOf(v[nom]) < 0) e[nom] = 'vide'; };

  dans('type_demandeur', TYPES);
  ['structure_nom', 'ville', 'pays', 'nom_prenom'].forEach(exige);
  dans('fonction', FONCTIONS);
  if (v.fonction === 'autre') exige('fonction_autre');

  const courriel = String(v.courriel || '').trim();
  if (courriel === '') e.courriel = 'vide';
  else if (!courrielValide(courriel)) e.courriel = 'courriel';

  const tel = String(v.telephone || '').trim();
  if (tel === '') e.telephone = 'vide';
  else {
    const chiffres = tel.replace(/\D/g, '').length;
    if (!/^[0-9+\s().\-\/]+$/.test(tel) || chiffres < 8 || chiffres > 15) e.telephone = 'telephone';
  }

  if (v.certifie_habilite !== 'oui') e.certifie_habilite = 'vide';
  dans('format', FORMATS);
  if (v.accepte_frais !== 'oui') e.accepte_frais = 'vide';
  if (v.accepte_don !== 'oui') e.accepte_don = 'vide';
  dans('collecte', OUI_NON);
  if (v.accepte_donnees !== 'oui') e.accepte_donnees = 'vide';

  const min = dateMin();
  [1, 2, 3].forEach(n => {
    const d = String(v['voeu' + n + '_date'] || '').trim();
    const m = String(v['voeu' + n + '_moment'] || '').trim();
    const requis = n === 1 || d !== '' || m !== '';
    if (!requis) return;
    if (d === '' || !dateIsoValide(d)) e['voeu' + n + '_date'] = 'vide';
    else if (d < min) e['voeu' + n + '_date'] = 'date_passee';
    if (m === '' || MOMENTS.indexOf(m) < 0) e['voeu' + n + '_moment'] = 'vide';
  });
  return e;
}

/* ---------- Éléments ---------- */
const form = document.getElementById('demande');
const suite = document.getElementById('suite');
const blocStructure = document.getElementById('bloc-structure');
const etapes = Array.prototype.slice.call(document.querySelectorAll('.etape'));
const segments = Array.prototype.slice.call(document.querySelectorAll('.progression__item'));
const msgParticulier = document.getElementById('msg-particulier');
const recap = document.getElementById('recap');
const recapTexte = document.getElementById('recap-texte');
const recapListe = document.getElementById('recap-liste');
const boutonEnvoi = document.getElementById('envoyer');
const erreurEnvoi = document.getElementById('e-envoi');
const progression = document.getElementById('progression');
const ouvertA = Date.now();
let enCours = false;
let etapeCourante = 1;

/* ---------- Lecture du formulaire ---------- */
function lireValeurs() {
  const v = { equipements: [] };
  Array.prototype.forEach.call(form.elements, el => {
    if (!el.name || el.type === 'submit' || el.type === 'button') return;
    if (el.type === 'radio') { if (el.checked) v[el.name] = el.value; return; }
    if (el.type === 'checkbox') {
      if (!el.checked) return;
      if (el.name === 'equipements') v.equipements.push(el.value); else v[el.name] = el.value;
      return;
    }
    v[el.name] = el.value;
  });
  return v;
}

/* ---------- sessionStorage : rien n'est perdu en cas d'échec ---------- */
function sauver() {
  try {
    const paires = [];
    Array.prototype.forEach.call(form.elements, el => {
      if (!el.name || el.name === 'societe' || el.type === 'submit' || el.type === 'button') return;
      if (el.type === 'radio' || el.type === 'checkbox') { if (el.checked) paires.push([el.name, el.value]); return; }
      paires.push([el.name, el.value]);
    });
    sessionStorage.setItem(CLE_STOCKAGE, JSON.stringify(paires));
  } catch (err) { /* stockage indisponible : la page fonctionne sans */ }
}
function restaurer() {
  try {
    const brut = sessionStorage.getItem(CLE_STOCKAGE);
    if (!brut) return;
    const paires = JSON.parse(brut);
    if (!Array.isArray(paires)) return;
    Array.prototype.forEach.call(form.elements, el => {
      if (!el.name || el.name === 'societe' || el.type === 'submit' || el.type === 'button') return;
      if (el.type === 'radio' || el.type === 'checkbox') {
        el.checked = paires.some(p => p[0] === el.name && p[1] === el.value);
        return;
      }
      const trouve = paires.find(p => p[0] === el.name);
      if (trouve) el.value = el.maxLength > 0 ? String(trouve[1]).slice(0, el.maxLength) : trouve[1];
    });
  } catch (err) { /* contenu illisible : on repart d'un formulaire vierge */ }
}
function oublier() {
  try { sessionStorage.removeItem(CLE_STOCKAGE); } catch (err) { /* sans effet */ }
}

/* ---------- Identifiant d'envoi : un nouvel essai après échec ne crée pas de doublon ---------- */
function nouvelIdentifiant() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  const t = new Uint8Array(16);
  (window.crypto || window.msCrypto).getRandomValues(t);
  return Array.prototype.map.call(t, b => b.toString(16).padStart(2, '0')).join('');
}
function identifiantEnvoi() {
  try {
    let id = sessionStorage.getItem(CLE_IDENTIFIANT);
    if (!id) { id = nouvelIdentifiant(); sessionStorage.setItem(CLE_IDENTIFIANT, id); }
    return id;
  } catch (err) { return identifiantMemoire; }
}
let identifiantMemoire = nouvelIdentifiant();
function renouvelerIdentifiant() {
  identifiantMemoire = nouvelIdentifiant();
  envoiTente = false;
  try { sessionStorage.removeItem(CLE_IDENTIFIANT); } catch (err) { /* sans effet */ }
}
/* Un envoi déjà tenté (identifiant émis, y compris avant un rechargement de l'onglet) peut être enregistré côté serveur :
   la page ne le bloque plus sur la date, le serveur reconnaît l'identifiant et tranche (même référence, conflit ou date passée). */
let envoiTente = false;
function dejaTente() {
  if (envoiTente) return true;
  try { return Boolean(sessionStorage.getItem(CLE_IDENTIFIANT)); } catch (err) { return false; }
}
function erreursBloquantes(v) {
  const e = valider(v);
  if (dejaTente()) Object.keys(e).forEach(n => { if (e[n] === 'date_passee') delete e[n]; });
  return e;
}

/* ---------- Particulier, fonction « Autre » ---------- */
function appliquerType() {
  const t = lireValeurs().type_demandeur;
  const bloque = BLOQUER_PARTICULIER && t === 'particulier';
  msgParticulier.hidden = !bloque;
  suite.hidden = bloque;
  blocStructure.hidden = bloque;
  progression.hidden = bloque;
  [suite, blocStructure].forEach(zone => {
    zone.querySelectorAll('fieldset, input, select, textarea, button').forEach(el => { el.disabled = bloque; });
  });
  if (bloque) effacerErreurs();
}
function appliquerFonction() {
  const autre = lireValeurs().fonction === 'autre';
  document.getElementById('bloc-fonction_autre').hidden = !autre;
}

/* ---------- Erreurs ---------- */
function elementsDe(nom) { return Array.prototype.slice.call(form.querySelectorAll('[name="' + nom + '"]')); }
function libelleDe(nom) {
  const el = elementsDe(nom)[0];
  if (!el) return nom;
  const net = t => t.replace(/\s*\*\s*$/, '').replace(/\s+/g, ' ').trim();
  const groupe = el.closest('.groupe');
  if (el.type === 'radio' && groupe) return net(groupe.querySelector('legend').textContent);
  if (el.type === 'checkbox') return net(el.closest('label').querySelector('span').textContent);
  const voeu = el.closest('.voeu');
  const lib = form.querySelector('label[for="' + el.id + '"]');
  const base = lib ? net(lib.textContent) : nom;
  return voeu ? net(voeu.querySelector('legend').textContent) + ' : ' + base : base;
}
function marquer(nom, code) {
  const p = document.getElementById('e-' + nom);
  if (p) { p.textContent = MESSAGES_CODE[code] || MSG.vide; p.hidden = false; }
  elementsDe(nom).forEach(el => el.setAttribute('aria-invalid', 'true'));
}
function effacer(nom) {
  const p = document.getElementById('e-' + nom);
  if (p) { p.textContent = ''; p.hidden = true; }
  elementsDe(nom).forEach(el => el.removeAttribute('aria-invalid'));
}
/* À la saisie, une erreur affichée n'est retirée que si le champ est devenu valide ; les champs liés (vœux) sont revus ensemble */
function revaliderMarques() {
  const marques = ORDRE.filter(n => { const p = document.getElementById('e-' + n); return p && !p.hidden; });
  if (!marques.length) return;
  const erreurs = erreursBloquantes(lireValeurs());
  marques.forEach(n => {
    if (!erreurs[n]) { effacer(n); return; }
    const p = document.getElementById('e-' + n);
    if (p.textContent !== (MESSAGES_CODE[erreurs[n]] || MSG.vide)) marquer(n, erreurs[n]);
  });
}
function effacerErreurs() {
  ORDRE.forEach(effacer);
  recap.hidden = true;
  recapListe.textContent = '';
  erreurEnvoi.hidden = true;
  erreurEnvoi.textContent = '';
}
function rendreRecap(noms) {
  recapTexte.textContent = noms.length === 1 ? MSG.recapUn : MSG.recapPlusieurs.replace('{n}', noms.length);
  recapListe.textContent = '';
  noms.forEach(n => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    const cible = elementsDe(n)[0];
    a.href = '#' + (cible && cible.id ? cible.id : 'demande');
    a.textContent = libelleDe(n);
    a.addEventListener('click', ev => { ev.preventDefault(); allerAuChamp(n); });
    li.appendChild(a);
    recapListe.appendChild(li);
  });
  recap.hidden = false;
}
/* Le bandeau suit les champs : il se met à jour à chaque correction et disparaît quand il n'en reste aucune */
function majRecap() {
  if (recap.hidden) return;
  const noms = ORDRE.filter(n => { const p = document.getElementById('e-' + n); return p && !p.hidden; });
  if (!noms.length) { recap.hidden = true; recapListe.textContent = ''; return; }
  rendreRecap(noms);
}
function afficherErreurs(erreurs) {
  effacerErreurs();
  const noms = ORDRE.filter(n => erreurs[n]);
  const horsOrdre = Object.keys(erreurs).filter(n => ORDRE.indexOf(n) < 0);
  if (!noms.length) { afficherEchec(); return; }
  noms.forEach(n => marquer(n, erreurs[n]));
  rendreRecap(noms);
  if (horsOrdre.length) afficherEchec();
  /* Chaque champ en erreur dans un repli fermé l'ouvre ; l'étape du premier est affichée et le focus y est porté */
  noms.forEach(ouvrirRepli);
  allerAuChamp(noms[0]);
}
function ouvrirRepli(nom) {
  const el = elementsDe(nom)[0];
  const repli = el && el.closest('details');
  if (repli) repli.open = true;
}
function allerAuChamp(nom) {
  const cible = elementsDe(nom)[0];
  if (!cible) return;
  ouvrirRepli(nom);
  if (ETAPE_DE[nom] && ETAPE_DE[nom] !== etapeCourante) afficherEtape(ETAPE_DE[nom], false);
  cible.focus();
  cible.scrollIntoView({ block: 'center' });
}
function afficherEchec() { afficherMessageEnvoi(MSG.echec); }
function afficherConflit(reference) { afficherMessageEnvoi(MSG.conflit.replace('{reference}', reference)); }
function afficherMessageEnvoi(texte) {
  const [avant, apres] = texte.split('contact@tawqit.org');
  erreurEnvoi.textContent = '';
  erreurEnvoi.appendChild(document.createTextNode(avant));
  const a = document.createElement('a');
  a.href = 'mailto:contact@tawqit.org';
  a.textContent = 'contact@tawqit.org';
  erreurEnvoi.appendChild(a);
  erreurEnvoi.appendChild(document.createTextNode(apres));
  erreurEnvoi.hidden = false;
}

/* ---------- Envoi ---------- */
const pause = ms => new Promise(r => setTimeout(r, ms));

/* Une adresse d'essai (localhost) ne doit jamais recevoir une demande venue d'une page publiée ailleurs */
const HOTES_LOCAUX = ['', 'localhost', '127.0.0.1', '[::1]'];
function endpointAtteignable() {
  let hote = '';
  try { hote = new URL(ENDPOINT, location.href).hostname; } catch (err) { return false; }
  return HOTES_LOCAUX.indexOf(hote) < 0 || HOTES_LOCAUX.indexOf(location.hostname) >= 0;
}

/* Pendant l'envoi, champs et boutons sont gelés ; seuls ceux qui ne l'étaient pas déjà sont rétablis */
let geles = [];
function geler() {
  geles = Array.prototype.filter.call(form.elements, el => !el.disabled);
  geles.forEach(el => { el.disabled = true; });
  form.setAttribute('aria-busy', 'true');
}
function degeler() {
  geles.forEach(el => { el.disabled = false; });
  geles = [];
  form.removeAttribute('aria-busy');
}

async function envoyer(valeurs) {
  enCours = true;
  const libelle = boutonEnvoi.textContent;
  geler();
  boutonEnvoi.textContent = MSG.envoi;
  boutonEnvoi.setAttribute('aria-busy', 'true');
  const controle = new AbortController();
  let minuteur = null;
  try {
    if (!endpointAtteignable()) throw new Error('adresse d\'essai');
    const attente = DUREE_MIN_MS - (Date.now() - ouvertA);
    if (attente > 0) await pause(attente);
    const corps = Object.assign({}, valeurs, { duree_s: Math.round((Date.now() - ouvertA) / 1000), id_envoi: identifiantEnvoi(), empreinte: empreinteDe(valeurs) });
    envoiTente = true;
    minuteur = setTimeout(() => controle.abort(), DELAI_REPONSE_MS);
    const rep = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(corps),
      signal: controle.signal
    });
    const data = await rep.json();
    degeler();
    if (data && data.ok === true && data.reference) {
      renouvelerIdentifiant();
      afficherApres(valeurs.courriel, data.reference);
    } else if (data && data.ok === false && (data.code === 'conflit' || data.erreur === 'conflit') && data.reference) {
      afficherConflit(String(data.reference));
      boutonEnvoi.focus({ preventScroll: true });
    } else if (data && data.erreurs && Object.keys(data.erreurs).length) {
      afficherErreurs(data.erreurs);
    } else {
      afficherEchec();
    }
  } catch (err) {
    degeler();
    afficherEchec();
    boutonEnvoi.focus({ preventScroll: true });
  } finally {
    clearTimeout(minuteur);
    enCours = false;
    degeler();
    boutonEnvoi.textContent = libelle;
    boutonEnvoi.removeAttribute('aria-busy');
  }
}
function afficherApres(courriel, reference) {
  document.getElementById('apres-courriel').textContent = courriel;
  document.getElementById('apres-reference').textContent = reference;
  document.getElementById('avant-envoi').hidden = true;
  const apres = document.getElementById('apres');
  apres.hidden = false;
  oublier();
  form.reset();
  document.getElementById('t-apres').focus();
  apres.scrollIntoView({ block: 'start' });
}

form.addEventListener('submit', ev => {
  ev.preventDefault();
  if (enCours) return;
  const v = lireValeurs();
  if (BLOQUER_PARTICULIER && v.type_demandeur === 'particulier') return;
  if (etapeCourante < ETAPES) { continuer(); return; }
  majDateMin();
  const erreurs = erreursBloquantes(v);
  if (Object.keys(erreurs).length) { afficherErreurs(erreurs); return; }
  effacerErreurs();
  envoyer(v);
});

/* ---------- Copier le lien ---------- */
document.getElementById('copier-lien').addEventListener('click', async () => {
  const retour = document.getElementById('copie-retour');
  const url = location.href.split('#')[0];
  try {
    await navigator.clipboard.writeText(url);
    retour.textContent = MSG.lienCopie;
  } catch (err) {
    try {
      const t = document.createElement('textarea');
      t.value = url;
      t.setAttribute('readonly', '');
      t.style.position = 'absolute';
      t.style.left = '-10000px';
      document.body.appendChild(t);
      t.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(t);
      retour.textContent = ok ? MSG.lienCopie : url;
    } catch (err2) {
      retour.textContent = url;
    }
  }
});

/* ---------- Assistant : une étape visible à la fois ---------- */
function afficherEtape(n, avecFocus) {
  etapeCourante = n;
  etapes.forEach((e, i) => e.classList.toggle('etape--active', i + 1 === n));
  segments.forEach((li, i) => {
    li.classList.toggle('est-fait', i + 1 <= n);
    if (i + 1 === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
  });
  if (!avecFocus) return;
  const titre = etapes[n - 1].querySelector('.etape__titre');
  if (progression.getBoundingClientRect().top < 0) progression.scrollIntoView({ block: 'start' });
  if (titre) titre.focus({ preventScroll: true });
}
function continuer() {
  majDateMin();
  const erreurs = erreursBloquantes(lireValeurs());
  const ici = {};
  Object.keys(erreurs).forEach(n => { if (ETAPE_DE[n] === etapeCourante) ici[n] = erreurs[n]; });
  if (Object.keys(ici).length) { afficherErreurs(ici); return; }
  effacerErreurs();
  afficherEtape(Math.min(ETAPES, etapeCourante + 1), true);
}
form.addEventListener('click', ev => {
  const bouton = ev.target && ev.target.closest ? ev.target.closest('[data-etape]') : null;
  if (!bouton) return;
  if (bouton.dataset.etape === 'suivant') continuer();
  else {
    /* Revenir en arrière ne vaut pas correction : seules les marques des champs devenus valides tombent */
    revaliderMarques();
    majRecap();
    afficherEtape(Math.max(1, etapeCourante - 1), true);
  }
});

/* ---------- Démarrage ---------- */
form.noValidate = true;
majDateMin();
document.addEventListener('visibilitychange', () => { if (!document.hidden) majDateMin(); });
restaurer();
appliquerType();
appliquerFonction();
form.addEventListener('input', ev => {
  const nom = ev.target && ev.target.name;
  if (nom) revaliderMarques();
  majRecap();
  sauver();
});
form.addEventListener('change', ev => {
  const nom = ev.target && ev.target.name;
  if (nom === 'type_demandeur') appliquerType();
  if (nom === 'fonction') appliquerFonction();
  if (nom) revaliderMarques();
  majRecap();
  sauver();
});

/* Lien « Lire la mention sur vos données » : ouvre le repli du pied et y fait défiler (sans JS, l'ancre seule mène au pied) */
document.getElementById('lien-mention').addEventListener('click', ev => {
  ev.preventDefault();
  const repli = document.getElementById('donnees');
  repli.open = true;
  repli.scrollIntoView({ block: 'start' });
  repli.querySelector('summary').focus({ preventScroll: true });
});

afficherEtape(1, false);
/* Posé en dernier : si ce script ne se charge pas ou échoue, la page reste le formulaire complet, lisible sans JS */
document.documentElement.classList.add('js-ready');
