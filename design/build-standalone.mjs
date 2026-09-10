/**
 * Împachetează mockup-ul într-un HTML de sine stătător, gata de urcat oriunde.
 *
 *   node design/build-standalone.mjs
 *
 * DE CE EXISTĂ: `design/mockup/index.html` este un FRAGMENT. Platforma de
 * artefacte îi adaugă singură <!doctype>, <html>, <head> și <body>. Urcat ca
 * atare pe un hosting normal, ar rămâne fără <meta charset> (diacriticele se
 * strică) și fără <meta viewport> (telefonul randează versiunea de desktop).
 *
 * Scriptul mută <title>, link-urile de fonturi și blocul <style> în <head>,
 * adaugă meta-urile care lipsesc și scrie rezultatul în `design/deploy/`.
 *
 * ⚠️ După ORICE modificare în design/mockup/index.html, rulează din nou
 *    scriptul, altfel copia de pe hosting rămâne în urmă.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(here, 'mockup/index.html')
const OUT_DIR = resolve(here, 'deploy')
const OUT = resolve(OUT_DIR, 'index.html')

const TITLE = 'Limira Lamira — direcție vizuală'
const DESC =
  'Mockup de direcție vizuală pentru magazinul online Limira Lamira Art Studio. ' +
  'Sistem de design NEON SALVAGE. Pregătit de Website Factory.'
/** Setează-l după primul deploy ca să funcționeze previzualizarea la partajare. */
const SITE_URL = process.env.MOCKUP_URL || ''

/* Semnul din logo, ca favicon SVG inline — fără fișier separat de încărcat. */
const FAVICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
      '<g fill="none" stroke="#e64593" stroke-width="8" stroke-linecap="square">' +
      '<path d="M30 12 H88 V88"/><path d="M70 88 H12 V12"/>' +
      '<path d="M50 26 L74 50 L50 74 L26 50 Z"/><path d="M30 34 L70 74"/>' +
      '</g></svg>'
  )

const src = readFileSync(SRC, 'utf8')

const cut = src.indexOf('</style>')
if (cut === -1) throw new Error('Nu am găsit blocul <style> în sursă.')
const headSrc = src.slice(0, cut + '</style>'.length).trim()
const bodySrc = src.slice(cut + '</style>'.length).trim()

/* Titlul din sursă e cel pentru galeria de artefacte; pe web vrem unul descriptiv. */
const headNoTitle = headSrc.replace(/<title>[\s\S]*?<\/title>\s*/i, '')

const og = SITE_URL
  ? `
  <meta property="og:url" content="${SITE_URL}">
  <meta property="og:image" content="${SITE_URL.replace(/\/$/, '')}/og.png">
  <meta name="twitter:image" content="${SITE_URL.replace(/\/$/, '')}/og.png">`
  : `
  <!-- Rulează cu MOCKUP_URL=https://... ca să se completeze og:url și og:image. -->`

const html = `<!doctype html>
<html lang="ro">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${TITLE}</title>
  <meta name="description" content="${DESC}">

  <!-- Material de lucru pentru client: nu se indexează. -->
  <meta name="robots" content="noindex, nofollow">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Website Factory">
  <meta property="og:locale" content="ro_RO">
  <meta property="og:title" content="${TITLE}">
  <meta property="og:description" content="${DESC}">
  <meta name="twitter:card" content="summary_large_image">${og}

  <link rel="icon" href="${FAVICON}">
  <link rel="apple-touch-icon" href="${FAVICON}">
  <meta name="theme-color" content="#f5f2ee" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#121014" media="(prefers-color-scheme: dark)">

  <style>
    /* Resetul minim pe care îl oferea platforma de artefacte. */
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; }
    img, svg, video { max-width: 100%; }
    [hidden] { display: none !important; }
  </style>

${headNoTitle
  .split('\n')
  .map((l) => (l.trim() ? '  ' + l : l))
  .join('\n')}
</head>
<body>

${bodySrc}

</body>
</html>
`

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(OUT, html, 'utf8')

const kb = (Buffer.byteLength(html) / 1024).toFixed(0)
console.log(`✓ ${OUT}  (${kb} KB)`)
if (!SITE_URL) {
  console.log('  Notă: fără MOCKUP_URL, previzualizarea la partajare nu va avea imagine.')
  console.log('  Rulează: MOCKUP_URL=https://domeniul-tau node design/build-standalone.mjs')
}
