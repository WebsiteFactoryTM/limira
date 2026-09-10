# 03 — Sistemul de design: **NEON SALVAGE**

> Un magazin care nu arată ca un magazin. Editorial ca o revistă de artă,
> tăios ca un flyer de rave din '96, curat ca un showroom din 2026.

Fișierul de tokens gata de folosit: **`design/tokens/tokens.css`**.
Mockup-ul care demonstrează sistemul: **`design/mockup/index.html`**.

---

## 1. De unde vine

Trei surse, toate din materialul clientei:

1. **Logo-ul** — un pătrat deschis cu o formă croită și pliată în interior. Traduce
   direct în motivul **„cut & fold"**: tăieturi diagonale, colțuri pliate, linii de
   cusătură punctate. Este ADN-ul geometric al site-ului.
2. **Regula 70–20–10** (negru / alb / roz) — nu o preferință, o cerință. Rozul este
   **semnal**, nu suprafață: îl folosim pentru afordanțe, un singur cuvânt dintr-un titlu,
   preț, status, halou în spatele unei imagini-cheie. Niciodată blocuri mari umplute cu roz.
3. **Anii '90 reinterpretați curat** — contrast dur, neon, marquee, halftone,
   misregistration — dar așezate într-o grilă editorială disciplinată și cu spațiu alb generos.
   Referința nu e „nostalgie", e **energie**.

Al patrulea strat vine din materialul brandului: **reciclarea**. Off-white cald ca
hârtia reciclată, textură de grain, „before → after" ca gest vizual recurent.

## 2. Cele cinci principii

| | Principiu | Ce înseamnă în practică |
|---|---|---|
| 1 | **Salvage grid** | Grilă editorială de 12 coloane, dar cu „resturi de croi": 1–2 elemente pe ecran ies deliberat din grilă sau trec peste marginea viewportului. Ordine + o abatere controlată. |
| 2 | **Cut & fold** | Tăieturi diagonale (`clip-path`), colțuri pliate, borduri punctate ca o cusătură. Fără colțuri rotunjite pe structură — brandul e unghiular. |
| 3 | **Neonul e semnal** | Max. ~10% din suprafața oricărui ecran. Dacă un ecran arată roz, e greșit. |
| 4 | **Zgomot analog** | Grain la 3–5% opacitate peste tot, halftone pe imaginile-erou, ușor decalaj cromatic la hover. Împiedică „look-ul de template". |
| 5 | **Mișcarea explică** | Fiecare animație spune ceva: dezvăluie material, arată transformarea, confirmă o acțiune. Decor pur = tăiat. |

---

## 3. Culoare

### 3.1 Paletă brută

```
ROZ LIMIRA        #E64593   ← culoarea-semnătură, neatinsă
NEGRU             #000000
ALB               #FFFFFF
```

Rampă derivată (doar pentru stări și accesibilitate — nu culori noi de brand):

| Token | Hex | Rol |
|---|---|---|
| `--pink-100` | `#FFE9F3` | fundal de chip pe temă luminoasă |
| `--pink-300` | `#FF9EC9` | text neon pe negru, halou |
| `--pink-500` | `#E64593` | **brand** — fill CTA, accente |
| `--pink-600` | `#C9316F` | hover pe temă luminoasă |
| `--pink-700` | `#A31E60` | **link la dimensiune de corp pe fundal deschis** (contrast 7,2:1) |

Neutre **calde**, nu reci (hârtie reciclată, nu ecran de birou):

| Token | Hex | | Token | Hex |
|---|---|---|---|---|
| `--ink-950` | `#08070A` | *rezervat atelierului* | `--ink-300` | `#9B96A3` |
| `--ink-900` | `#121014` | *fundal magazin·întuneric* | `--ink-200` | `#C9C4CE` |
| `--ink-850` | `#191720` | | `--ink-100` | `#E7E3E8` |
| `--ink-800` | `#221F29` | | `--bone` | `#F5F2EE` |
| `--ink-700` | `#2E2A37` | | `--paper` | `#FFFFFF` |
| `--ink-600` | `#3F3A49` | | | |
| `--ink-400` | `#6E6A78` | | | |

> `--ink-950` și `--ink-900` **nu sunt interschimbabile**: vidul absolut e rezervat
> atelierului, magazinul întunecat stă pe un negru cald și ridicat. Așa rămân distincte.

### 3.2 Reguli de contrast (verificate, nu presupuse)

| Combinație | Raport | Verdict |
|---|---|---|
| `#E64593` pe alb | **3,72:1** | ❌ text de corp · ✅ doar ≥24px sau ≥19px bold |
| `#A31E60` pe alb | **7,24:1** | ✅ AAA — **acesta e roz-ul pentru linkuri inline pe temă luminoasă** |
| `#E64593` pe `#000` | **5,64:1** | ✅ AA — pe tema atelier rozul poate fi text de corp |
| **negru pe `#E64593`** | **5,64:1** | ✅ AA — **butoanele roz au text NEGRU, nu alb** |
| alb pe `#E64593` | 3,72:1 | ❌ evită sub 24px |
| `#FF9EC9` pe `#08070A` | **10,4:1** | ✅ AAA |

> **Decizia care definește look-ul:** CTA-ul primar este **roz plin cu text negru**.
> E accesibil, e brutal-90s, și ține rozul în rolul de semnal.

### 3.3 Două axe independente — trei suprafețe

Un singur comutator nu poate face două treburi. Separăm explicit:

| Atribut pe `<html>` | Valori | Ce controlează | Cine decide |
|---|---|---|---|
| **`data-lum`** | `light` \| `dark` | luminozitatea magazinului | **vizitatorul**, din comutatorul Luminos / Întunecat / Sistem |
| **`data-mode`** | `shop` \| `atelier` | identitatea editorială | **ruta** (`/atelier/*` → `atelier`) + comutatorul permanent din meniu |

Atelierul este **întunecat prin definiție contractuală**, deci `data-mode="atelier"`
suprascrie luminozitatea. Rezultă trei suprafețe, nu patru:

**1. Magazin · lumină** (implicit) — hârtie reciclată, editorial
```
--bg:#F5F2EE  --bg-alt:#FFFFFF  --fg:#08070A  --fg-muted:#6E6A78
--line:rgb(0 0 0/.13)  --accent:#E64593  --accent-fg:#000  --accent-text:#A31E60
```

**2. Magazin · întuneric** — editorial, nu atelier. Fundal **cald și ridicat** (`#121014`),
ca să rămână distinct de vidul atelierului.
```
--bg:#121014  --bg-alt:#191720  --fg:#F7F5F8  --fg-muted:#9B96A3
--line:rgb(255 255 255/.13)  --accent:#E64593  --accent-fg:#000  --accent-text:#FF9EC9
```

**3. Atelier** (Faza 2) — vidul absolut, neonul la maxim.
```
--bg:#08070A  --bg-alt:#0D0C11  --fg:#FFFFFF  --grain-op:.08
```

**Cascadă CSS** — ordinea contează, `atelier` trebuie să fie ultimul:
```css
:root                        { /* magazin · lumină, paleta completă */ }
:root[data-lum="dark"]       { /* magazin · întuneric */ }
@media (prefers-color-scheme:dark){ :root:not([data-lum="light"]){ /* idem, fără JS */ } }
:root[data-mode="atelier"]   { /* atelier — câștigă peste ambele */ }
```

**Persistență:** preferința de temă (`light` / `dark` / `system`) în `localStorage` +
cookie, citită pe server → **fără FOUC**. `system` se re-rezolvă la schimbarea
`prefers-color-scheme`.
Modul se ține în cookie `limira_mode` și se rezolvă pe server din rută.
Tranziția între moduri folosește View Transitions cu o **tăietură diagonală** (§6.1).

> `prefers-color-scheme` controlează **luminozitatea**, nu modul. Modul e o decizie
> editorială. Sunt respectate și `prefers-contrast` și `prefers-reduced-transparency`
> (halouri și grain).

### 3.4 Neonul — cum se comportă la lumină și la întuneric

Neonul nu strălucește la lumina zilei. Refuzul de a recunoaște asta e ce face ca
majoritatea „temelor luminoase cu neon" să arate murdar. Deci:

| | Magazin · lumină | Magazin · întuneric / Atelier |
|---|---|---|
| **Metaforă** | firmă de neon stinsă, la lumina zilei | tubul aprins |
| **Tratament** | cerneală saturată + umbră colorată difuză — lumina scursă pe hârtie | miez alb-fierbinte + halou roz în două straturi |
| **Mișcarea** | **identică** | **identică** |

Tokens (aceleași nume, valori diferite per suprafață — componentele nu știu diferența):

```
--nf-1 / --nf-2 / --nf-3   filtre `drop-shadow()`, intensitate crescătoare
--nt                        text-shadow pentru text neon
--tube                      culoarea „tubului" pentru linii și contururi
```

> **De ce `filter: drop-shadow()` și nu `box-shadow`:** butoanele au colț tăiat prin
> `clip-path`, iar `box-shadow` ar fi tăiat odată cu ele. `drop-shadow` se aplică
> **după** clip și urmează silueta reală. Este singura variantă care funcționează
> cu motivul „cut & fold".

### 3.5 Glitch — neonul care se vede și pe fundal deschis

Pe fundal deschis haloul nu se vede, dar **dezalinierea plăcilor de tipar** se vede
foarte bine. Este exact referința brandului: tipar din anii '90, riso, fanzin.
Deci pe suprafețele luminoase rolul de „moment neon" îl preia glitch-ul.

```
--glitch-a   placa magenta   → rgb(pink / .9) pe lumină · .95 pe întuneric
--glitch-b   placa albă      → rgb(255 255 255 / .95) pe lumină · .6 pe întuneric
```

**Fără culori noi în paletă.** Fantomele sunt roz și alb — nu cyan, nu verde acid.
Regula 70–20–10 rămâne intactă, iar artefactul durează ~620 ms.

> Dacă la revizuire clienta vrea mai multă energie de tipar, varianta cu placă **cyan**
> (magenta + cyan dezaliniate, misregistration clasic de offset) se obține schimbând un
> singur token. Este o decizie a ei, nu una pe care o luăm noi: adaugă o a patra culoare.

**Cum e construit** — trei mecanisme suprapuse, niciunul cu text duplicat:
1. **Fantome cromatice** — `filter: drop-shadow(±Npx 0 var(--glitch-a|b))`.
   Funcționează pe orice text, pe oricâte rânduri, fără să atingă layout-ul.
   (Alternativa clasică, `content: attr()` pe pseudo-elemente, se rupe la text care trece
   pe mai multe rânduri — nu o folosi.)
2. **Felii orizontale** — `clip-path: inset()` animat, ca un semnal prost.
3. **Explozie de neon** — `text-shadow: var(--nt)` pe vârfurile glitch-ului.

Timing `steps(1, end)`: tăieturi dure, fără interpolare. Așa arată un semnal stricat.

**Ce declanșează glitch-ul** (toate funcționează pe mobil — niciunul nu depinde de hover):

| Declanșator | Ținta |
|---|---|
| Intrarea în ecran | fiecare `h2` de secțiune, o singură dată |
| Încărcarea paginii | cuvântul-cheie din titlul erou, dublu |
| Atingere / hover | wordmark-ul din logo |
| Schimbarea temei | logo + titlurile vizibile — „firma repornește" |
| Puls ambiental, la ~7 s | un singur element vizibil, ales aleator din: cifrele de impact, marquee, bara promo, prețuri, titluri de categorie, titluri de lucrări |

**Tubul de secțiune** (`.tube`): sub eticheta fiecărei secțiuni se desenează o linie de
2px cu punct luminos la capăt, pâlpâind scurt la aprindere. Este momentul „luminos"
care funcționează la fel de bine pe fundal deschis ca pe negru.

Toate sunt dezactivate complet la `prefers-reduced-motion: reduce`.

Cine primește neon (și nimeni altcineva — rozul rămâne sub 10%):
CTA primar · un singur cuvânt din titlul erou · bara promo · badge-urile de coș și
favorite · eticheta de reducere · punctele interactive · bara sliderului before/after ·
cifrele de impact · dock-ul de contact rapid pe mobil.

---

## 4. Tipografie

| Rol | Font | De ce | Licență |
|---|---|---|---|
| **Display** | **Bricolage Grotesque** (variabil: `wght` 200–800, `wdth` 75–100, `opsz`) | Grotesc editorial cu ciudățenii deliberate — „artsy, diferit". Axa de lățime permite tipografie cinetică (§6.3) | OFL, Google Fonts ✅ |
| **UI / corp** | **Montserrat** (variabil) | Geometric, capitale subțiri — continuitate directă cu wordmark-ul din logo | OFL ✅ |
| **Micro / date** | **Space Mono** | Etichete, prețuri, SKU, coduri, ticker. Aduce tonul de fanzin / etichetă de atelier | OFL ✅ |

> Alternativă aprobată pentru display, dacă clienta preferă ceva mai extrem la revizuire:
> **Syne ExtraBold**. Se schimbă un singur token, nimic altceva.
> **Nu introduce fonturi comerciale** — licențele nu sunt incluse în preț (art. 2.10).

### 4.1 Scară fluidă (fără media queries)

```
--step--2  clamp(0.69rem, 0.66rem + 0.12vw, 0.75rem)   micro-label
--step--1  clamp(0.83rem, 0.78rem + 0.22vw, 0.94rem)   caption, meta
--step-0   clamp(1.00rem, 0.94rem + 0.30vw, 1.19rem)   corp
--step-1   clamp(1.20rem, 1.10rem + 0.50vw, 1.50rem)   lead
--step-2   clamp(1.44rem, 1.28rem + 0.80vw, 1.90rem)   h4
--step-3   clamp(1.73rem, 1.48rem + 1.25vw, 2.40rem)   h3
--step-4   clamp(2.07rem, 1.70rem + 1.90vw, 3.03rem)   h2
--step-5   clamp(2.49rem, 1.94rem + 2.75vw, 3.82rem)   h1 secundar
--step-6   clamp(2.99rem, 2.20rem + 3.90vw, 4.83rem)   h1
--step-7   clamp(3.58rem, 2.48rem + 5.50vw, 6.10rem)   titlu de secțiune mare
--display  clamp(3.00rem, 1.00rem + 11.0vw, 12rem)     erou, din margine în margine
```

### 4.2 Reguli tipografice

- **Titlurile display**: `line-height: 0.88`, `letter-spacing: -0.03em`, `text-wrap: balance`.
- **Corpul**: `line-height: 1.6`, `max-width: 68ch`, `text-wrap: pretty`.
- **Micro-labels**: Space Mono, `uppercase`, `letter-spacing: 0.16em`, `--step--2`.
  Formă canonică: `⟶ ARTĂ RECICLATĂ / 07` — indicator + etichetă + număr.
- **Un singur cuvânt roz per titlu.** Cuvântul care poartă sensul, nu primul.
- **Diacriticele sunt obligatorii.** RO cu ă/â/î/ș/ț corecte peste tot, inclusiv în CMS.
  Space Mono are suport RO complet — verifică la fiecare font nou introdus.
- **Cifre tabulare** (`font-variant-numeric: tabular-nums`) pentru prețuri, stoc, cantități.

---

## 5. Spațiu, grilă, formă

- **Bază 4px.** Scară: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192.
- **Grilă**: 12 coloane, gutter `clamp(16px, 3vw, 32px)`, container `min(1440px, 100% - 2*gutter)`.
  Pe mobil: 4 coloane.
- **Bleed**: secțiunile-erou și galeriile ies din container până la marginea ecranului.
- **Rază**: `0` pe structură (carduri, secțiuni, inputuri). `999px` **doar** pe chip-uri și
  badge-uri — contrastul dintre unghiular și pastilă e parte din look.
- **Colț tăiat** în loc de colț rotunjit:
  `clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)`.
- **Cusătura**: `border: 1px dashed color-mix(in oklab, var(--accent) 60%, transparent)`
  cu `stroke-dasharray` animat la hover pe elementele „handmade".
- **Grain**: SVG `feTurbulence` fix, `opacity: .04`, `mix-blend-mode: overlay`,
  `pointer-events: none`, o singură instanță în layout root.

---

## 6. Sistemul de mișcare

Biblioteci: **Motion (framer-motion) 13** pentru componente React · **GSAP + ScrollTrigger**
pentru coregrafie legată de scroll · **Lenis** pentru smooth scroll (desktop; `smoothTouch: false`).

Tokens:
```
--ease-out-expo:  cubic-bezier(.16, 1, .3, 1)      ← intrări, dezvăluiri
--ease-inout-quart: cubic-bezier(.76, 0, .24, 1)   ← tranziții de mod, wipe-uri
--ease-out-back:  cubic-bezier(.34, 1.56, .64, 1)  ← confirmări (add to cart)
--dur-fast: 180ms   --dur: 320ms   --dur-slow: 620ms   --dur-reveal: 900ms
```

### 6.1 Cele 10 gesturi-semnătură

| # | Gest | Unde | Cum |
|---|---|---|---|
| 1 | **Seam wipe** — tăietură diagonală care traversează ecranul | tranziții de pagină, comutare shop ↔ atelier | View Transitions API + `clip-path` diagonal, 620ms `--ease-inout-quart` |
| 2 | **Ticker de neon** — bandă roz cu text infinit, viteza reacționează la viteza de scroll | sub erou, între secțiuni | translateX pe `requestAnimationFrame`, `will-change: transform`; se oprește la reduced-motion |
| 3 | **Cursor magnetic** — inel roz care se transformă în etichetă („VEZI", „ADAUGĂ", „TRAGE") | doar desktop, `pointer: fine` | Motion spring, `mix-blend-mode: difference` peste imagini |
| 4 | **Titlu cinetic** — dezvăluire cuvânt cu cuvânt din mască + axa `wdth` a fontului animată la hover | eroul fiecărei pagini | mască `overflow:hidden` + `translateY(110%)`, stagger 60ms |
| 5 | **Card „flip to material"** — la hover, cardul de produs dezvăluie fotografia materialului-sursă | grile de catalog | cross-fade + scale 1.04, 320ms. **Este preview-ul mecanicii Before & After din Faza 2, prezent deja în Faza 1** |
| 6 | **Galerie orizontală ancorată** — secțiunea de artă reciclată se derulează lateral cât timp e pinned | homepage, secțiunea artă | GSAP ScrollTrigger pin + scrub; pe mobil devine carusel cu swipe |
| 7 | **Bloom neon** — halou care pulsează foarte lent în spatele unei singure imagini pe ecran | mod atelier | `box-shadow` + `filter` animat 8s, `prefers-reduced-transparency` respectat |
| 8 | **Numere care se aduna** legate de scroll | secțiunea de impact / poveste | `IntersectionObserver`, o singură rulare |
| 9 | **Header care se condensează** în pastilă compactă | global | scroll > 80px, 240ms; nu se ascunde niciodată complet (cerință: antet sticky) |
| 10 | **Miniatura care zboară în coș** + sertar cu revenire elastică | adăugare în coș | FLIP animation pe imagine + `--ease-out-back` pe sertar |
| 11 | **Glitch de tipar** — plăcile magenta și albă se dezaliniază, felii orizontale, explozie de neon | titluri de secțiune la intrarea în ecran · titlul erou la încărcare · logo la atingere · la schimbarea temei · puls ambiental la ~7s | `drop-shadow` decalat + `clip-path: inset()`, `steps(1,end)`, 620ms. Vezi §3.5 |
| 12 | **Tubul de secțiune** — linie de 2px care se desenează cu punct luminos la capăt | sub eticheta fiecărei secțiuni | `width` 0→38%, cu pâlpâire la aprindere |

### 6.2 Reguli obligatorii de mișcare

- **`prefers-reduced-motion: reduce`** → toate cele 10 gesturi degradează la fade simplu
  de 120ms sau la nimic. Lenis se dezactivează. Fără excepții.
- **Doar `transform` și `opacity`** în animații continue. Zero animații pe `width`,
  `height`, `top`, `left`.
- Efectele de cursor și pin-ul orizontal se activează **doar** la `(pointer: fine)` și
  `(min-width: 1024px)`. Mobilul primește varianta CSS.
- **Nicio animație nu blochează interacțiunea.** Utilizatorul poate da click în timpul
  oricărei dezvăluiri.
- GSAP și Lenis se încarcă **dinamic, client-side, după hidratare**, niciodată în calea LCP.
- Bugetul: **maximum 3 animații scroll-linked simultan** pe un viewport.

### 6.3 Tipografie cinetică — detaliu

Bricolage Grotesque are axa `wdth` (75–100). La hover pe un titlu de secțiune, lățimea
animează 100 → 82 pe 400ms. Efectul e subtil, dar face pagina să pară „vie" fără să miște
nimic din layout (font-variation-settings nu declanșează reflow dacă lățimea containerului
e fixă — testează cu `contain: layout`).

---

## 7. Componente (inventar pentru Faza 1)

**Primitive**
`Button` (primary roz/negru · secondary contur · ghost · destructive) ·
`Input` `Select` `Checkbox` `Radio` `Quantity` `Rating` ·
`Tag` `Badge` `Chip` `Price` (cu preț tăiat + procent) ·
`Link` (cu subliniere care se croiește la hover) · `Skeleton` · `Toast` · `Tooltip`

**Compuse**
`Header` (sticky, condensabil, cu comutator de mod) · `MegaMenu` · `MobileNav` ·
`SearchOverlay` (full-screen, cu sugestii instant) · `CartDrawer` · `Footer` ·
`ProductCard` (cu flip-to-material) · `ArtPieceCard` (format galerie, ratio liber) ·
`FilterBar` + `FilterDrawer` · `Breadcrumbs` · `Pagination` / `LoadMore` ·
`Gallery` (PDP: zoom, thumbs, swipe) · `VariantPicker` (mărime / culoare / material) ·
`ReviewList` + `ReviewForm` · `TestimonialSlider` · `Marquee` · `StatCounter` ·
`AccordionFAQ` · `NewsletterForm` · `CookieConsent` · `QuickContactDock` (mobil) ·
`PromoBanner` / `PromoPopup` · `EmptyState` · `ModeSwitch`

**Blocuri de pagină (editabile din CMS, reordonabile)**
`HeroSlider` · `CategoryGrid` · `ProductCarousel` · `ArtGalleryScroller` ·
`AtelierTeaser` · `SplitStory` (imagine + text, alternant) · `BeforeAfterStrip` ·
`Testimonials` · `EditorialQuote` · `LogoTicker` · `RichText` · `MediaGrid` ·
`FAQ` · `ContactBlock` · `NewsletterBlock` · `BlogTeaser`

**Pregătite în Faza 1, folosite în Faza 2**
`PanoViewer` · `Hotspot` · `SceneNav` · `DiscoveryTracker` · `RewardModal` ·
`BeforeAfterSlider` · `MaterialSheet` · `StoryCard`

Fiecare componentă se documentează într-un **story/preview la `/design-system`**
(rută protejată, doar în dev + preview) — asta e și instrumentul de prezentare
pentru revizuirile cu clienta.

---

## 8. Accesibilitate — nenegociabil

- Țintă **WCAG 2.2 AA**. Contrastele din §3.2 sunt deja verificate; orice culoare nouă
  se verifică înainte de folosire.
- Focus vizibil **întotdeauna**: contur roz de 2px + offset 2px, vizibil pe ambele moduri.
- Țintă de atingere ≥ 44×44px pe mobil.
- Toate imaginile de produs au `alt` din CMS; câmpul e obligatoriu.
- Sertarul de coș, overlay-ul de căutare și modalele: focus trap, `Esc` închide,
  focus revine la declanșator.
- Carusel/marquee: control de pauză accesibil.
- Formularele: label vizibil (nu doar placeholder), eroare legată prin `aria-describedby`,
  mesaj în română, clar, fără jargon.
- Testare cu tastatura pentru fluxul complet de cumpărare, la fiecare milestone.

---

## 9. Fotografie și artă

Regulile de mai jos merg în **ghidul de fotografiere** trimis clientei
(vezi `07-CLIENT-DELIVERABLES.md`) — imaginile fac 80% din impactul designului.

- **Produs**: fundal `--bone` sau negru, lumină laterală dură (umbră prezentă, 90s),
  format 4:5, minimum 2000px pe latura lungă.
- **Material-sursă**: o macro-fotografie per produs — e cheia mecanicii „flip to material"
  și, mai târziu, a mecanicii Before & After.
- **Atelier / proces**: 3:2, natural, dezordinea rămâne — e argumentul de brand.
- **Artă unicat**: ratio liber, respirație în jur, fără crop agresiv. Galeria acceptă
  proporții mixte prin masonry.
- **Tratament** aplicat de site, nu în post-procesare: duoton negru→roz **doar** pentru
  imaginile de secțiune (nu pe produse — produsele rămân fidele culorii reale),
  halftone la 6% peste eroi, grain global.

---

## 10. Tonul vocii (RO)

Direct, cald, fără corporatism. Propoziții scurte. Prima persoană plural pentru studio,
persoana a doua pentru vizitator.

| În loc de | Scrie |
|---|---|
| „Adăugați produsul în coșul de cumpărături" | „Pune-l în coș" |
| „Produs indisponibil momentan" | „S-a dus. Era unicat." |
| „Vă mulțumim pentru comandă" | „Gata. Îl croim și pornește spre tine." |
| „Filtrează rezultatele" | „Caută altfel" |

Micro-copy pentru stări goale, erori și confirmări **se scrie o dată, centralizat**,
în fișierele de traduceri (`messages/ro.json`), niciodată inline în componente.
