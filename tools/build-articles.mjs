// Génère les pages statiques des articles dans public/articles/.
// La source de l'article « science des heures de prière » est le dépôt du site
// personnel d'Iliès (Markdown + figures) ; ses node_modules servent au rendu.
//   node tools/build-articles.mjs ~/Projects/ilies-haouche
import { createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(process.argv[2] || path.join(process.env.HOME, 'Projects/ilies-haouche'));
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public/articles');
const require = createRequire(path.join(SRC, 'package.json'));
const load = async (name) => {
  const m = await import(pathToFileURL(require.resolve(name)).href);
  return m.default ?? m;
};
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const Markdown = await load('react-markdown');
const remarkGfm = await load('remark-gfm');
const remarkMath = await load('remark-math');
const rehypeRaw = await load('rehype-raw');
const rehypeKatex = await load('rehype-katex');

const STORES = {
  ios: 'https://apps.apple.com/fr/app/tawqit/id6758964906',
  android: 'https://play.google.com/store/apps/details?id=com.tawqit.tawqit',
};

const page = ({ lang, title, lede, authors, body, canonical, other, extraHead = '', description }) => `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — Tawqit</title>
<meta name="description" content="${description.replace(/"/g, '&quot;')}">
<meta name="theme-color" content="#514668">
<link rel="icon" type="image/png" href="/favicon.png">
<link rel="canonical" href="https://tawqit.org${canonical}">
<link rel="preload" href="/interventions/fonts/cormorant-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/interventions/fonts/literata-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/interventions/tokens.css">
${extraHead}<link rel="stylesheet" href="/articles/article.css">
</head>
<body>
<header class="bandeau">
  <a class="bandeau__logo" href="/" aria-label="Tawqit — ${lang === 'en' ? 'home' : 'accueil'}"><img src="/interventions/img/logo-tawqit-clair.png" width="414" height="360" alt="Tawqit"></a>
  <nav class="bandeau__nav">
    <a href="/#articles">${lang === 'en' ? '← All articles' : '← Tous les articles'}</a>
    ${other ? `<a href="${other.href}" hreflang="${other.lang}">${other.label}</a>` : ''}
  </nav>
</header>
<main class="feuille">
  <p class="surtitre">${lang === 'en' ? 'Scientific article' : 'Article scientifique'}</p>
  <h1>${title}</h1>
  ${lede ? `<p class="chapeau">${lede}</p>` : ''}
  <p class="auteurs">${authors}</p>
  <div class="texte">
${body}
  </div>
</main>
<footer class="pied">
  <p class="pied__stores"><a href="${STORES.ios}" rel="noopener">App Store</a><a href="${STORES.android}" rel="noopener">Google Play</a></p>
  <p>Tawqit — ${lang === 'en' ? 'a project of the association' : 'projet porté par l\'association'} LOGARITHMES · <a href="mailto:contact@tawqit.org">contact@tawqit.org</a> · <a href="/">tawqit.org</a></p>
</footer>
</body>
</html>
`;

// ---------- Article 1 : la science des heures de prière ----------
const SLUG = 'science-des-heures-de-priere';
const meta = {
  fr: {
    title: 'Tawqit — la science des heures de prière',
    lede: 'Un article sur le ʿilm al-mīqāt : comment l\'astronomie détermine les heures de prière — et l\'application que j\'ai développée pour l\'implémenter.',
    description: 'Comment l\'astronomie détermine les heures de prière : histoire du ʿilm al-mīqāt, angles du Fajr et de l\'ʿIshāʾ, réfraction, Tamkīn, hautes latitudes.',
  },
  en: null,
};
const images = new Set();
const h = React.createElement;
const shift = (tag) => ({ node, ...props }) => h(tag, props);
const components = {
  h1: shift('h2'), h2: shift('h3'), h3: shift('h4'),
  img: ({ node, ...props }) => {
    if (String(props.className || '').includes('only-dark')) return null;
    const file = path.basename(props.src);
    images.add(file);
    return h('img', { src: `/articles/${SLUG}/img/${file}`, alt: props.alt, loading: 'lazy' });
  },
  table: ({ node, ...props }) => h('div', { className: 'tableau' }, h('table', props)),
  a: ({ node, ...props }) => h('a', { ...props, rel: 'noopener' }),
};
const render = (md) => renderToStaticMarkup(h(Markdown, {
  remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [rehypeRaw, rehypeKatex], components,
}, md));

meta.en = {
  title: 'Tawqit — the science of prayer times',
  lede: 'An article on ʿilm al-mīqāt: how astronomy determines prayer times — and the app I built to implement it.',
  description: 'How astronomy determines prayer times: the history of ʿilm al-mīqāt, the Fajr and ʿIshāʾ angles, refraction, Tamkīn, high latitudes.',
};

const katexCss = '<link rel="stylesheet" href="/articles/katex/katex.min.css">\n';
for (const lang of ['fr', 'en']) {
  const md = fs.readFileSync(path.join(SRC, `src/content/projects/tawqit.${lang}.md`), 'utf8');
  const dir = path.join(OUT, SLUG, lang === 'fr' ? '' : 'en');
  fs.mkdirSync(dir, { recursive: true });
  const canonical = `/articles/${SLUG}/${lang === 'fr' ? '' : 'en/'}`;
  fs.writeFileSync(path.join(dir, 'index.html'), page({
    lang, ...meta[lang], authors: 'Iliès Haouche', body: render(md), canonical, extraHead: katexCss,
    other: lang === 'fr'
      ? { href: `/articles/${SLUG}/en/`, lang: 'en', label: 'English' }
      : { href: `/articles/${SLUG}/`, lang: 'fr', label: 'Français' },
  }));
}
fs.mkdirSync(path.join(OUT, SLUG, 'img'), { recursive: true });
for (const f of images) fs.copyFileSync(path.join(SRC, 'public/tawqit', f), path.join(OUT, SLUG, 'img', f));

// KaTeX : feuille de style et polices woff2
const katexDist = path.join(path.dirname(require.resolve('katex/package.json')), 'dist');
fs.mkdirSync(path.join(OUT, 'katex/fonts'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'katex/katex.min.css'),
  fs.readFileSync(path.join(katexDist, 'katex.min.css'), 'utf8').replace(/,url\([^)]*\.(woff|ttf)\) format\("(woff|truetype)"\)/g, ''));
for (const f of fs.readdirSync(path.join(katexDist, 'fonts'))) {
  if (f.endsWith('.woff2')) fs.copyFileSync(path.join(katexDist, 'fonts', f), path.join(OUT, 'katex/fonts', f));
}

// ---------- Article 2 : l'angle de dépression solaire (PDF, pages en images) ----------
const SLUG2 = 'angle-de-depression-solaire';
const pagesDir = path.join(OUT, SLUG2, 'pages');
const pages = fs.existsSync(pagesDir) ? fs.readdirSync(pagesDir).filter((f) => /\.(jpg|webp|png)$/.test(f)).sort() : [];
if (pages.length) {
  const body = `<p class="telecharger"><a class="bouton" href="/articles/${SLUG2}.pdf">Télécharger l'article (PDF)</a></p>\n`
    + pages.map((f, i) => `<img class="page-pdf" src="/articles/${SLUG2}/pages/${f}" alt="Page ${i + 1} sur ${pages.length} de l'article" width="1240" height="1754"${i ? ' loading="lazy"' : ''}>`).join('\n');
  fs.writeFileSync(path.join(OUT, SLUG2, 'index.html'), page({
    lang: 'fr', title: 'Les avis religieux et physique de l\'angle de dépression solaire', lede: '',
    description: 'Fajr et ʿIshāʾ : le seuil de 18 degrés des astronomes de l\'Islam, la convention moderne à 15 degrés, et ce que montrent la photométrie et les observatoires.',
    authors: 'Iliès Haouche · Cheikh Ismaïl ar-Roubaysi', body, canonical: `/articles/${SLUG2}/`, other: null,
  }).replace('<main class="feuille">', '<main class="feuille feuille--pdf">'));
}
console.log('articles générés :', SLUG, [...images].length, 'figures ;', SLUG2, pages.length, 'pages');
