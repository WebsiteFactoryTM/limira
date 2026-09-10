# 05 — Roadmap de implementare

15 milestones. **Statusul viu nu se ține aici, ci în `06-STATE.md`.**
Aici sunt conținutul, ordinea și definiția de „gata" pentru fiecare milestone.

Ordinea nu e arbitrară: fiecare milestone se poate arăta clientei ca progres vizibil,
iar cele care depind de conținut de la client (M6 catalog, M8 editorial, M12 panorame)
sunt așezate cât mai târziu, ca să nu blocheze restul.

| M | Titlu | Fază | Estimare | Depinde de client |
|---|---|---|---|---|
| M0 | Analiză, sistem de design, mockup de prezentare | 1 | 2 zile | — |
| M1 | Scaffold aplicație + infrastructură locală | 1 | 0,5 zile | — |
| M2 | Fundația de design în cod | 1 | 3 zile | — |
| M3 | Modelul de conținut Payload | 1 | 3 zile | — |
| M4 | Shell: header, footer, i18n, mișcare | 1 | 2,5 zile | — |
| M5 | Homepage + blocuri editabile | 1 | 3 zile | 🔵 poveste brand |
| M6 | Catalog, filtre, căutare | 1 | 3 zile | 🔵 structura de categorii |
| M7 | Pagina de produs + recenzii + favorite + comparare | 1 | 3 zile | 🔵 foto + descrieri |
| M8 | Artă reciclată, blog, pagini editoriale, contact, feedback | 1 | 3 zile | 🔵 conținut editorial |
| M9 | Coș, checkout, plăți, cont | 1 | 4 zile | 🔵 cont procesator plăți |
| M10 | Integrări + module administrative | 1 | 3 zile | 🔵 conturi curier/facturare |
| M11 | Legal, SEO, performanță, A11y, import, QA, lansare | 1 | 3 zile | 🔵 texte legale, 150 produse |
| — | **PREDARE FAZA 1 → tranșa 2 (925 EUR)** | | | |
| M12 | Faza 2: fundația atelierului | 2 | 4 zile | 🔵 panorame 360° |
| M13 | Faza 2: 4 mecanici + motor de explorare + recompense | 2 | 5 zile | 🔵 conținut mecanici |
| M14 | Faza 2: QA, performanță mobil, lansare | 2 | 2,5 zile | — |
| — | **PREDARE FAZA 2 → tranșa 4 (675 EUR)** | | | |

---

## M0 — Analiză, sistem de design, mockup de prezentare

**Scop:** direcție vizuală aprobată de clientă înainte să scriem prima linie de UI.

- [x] Analiza contractului, anexei și ofertei; extragerea scope-ului
- [x] Analiza brandingului (logo, paletă, regula 70-20-10, referința anilor '90)
- [x] Documentația de proiect (`docs/00`–`docs/10`)
- [x] Sistemul de design **NEON SALVAGE** + `design/tokens/tokens.css`
- [x] **Mockup dinamic de prezentare** (`design/mockup/index.html`) — publicat ca link privat
- [ ] Prezentare către clientă + aprobare scrisă a direcției
- [ ] Consemnarea rundelor de revizuire folosite (2 disponibile în Faza 1)

**Gata când:** clienta confirmă în scris direcția vizuală. Fără asta, M2 nu începe —
altfel se consumă runde de revizuire pe cod, nu pe design.

---

## M1 — Scaffold aplicație + infrastructură locală

```bash
cd C:\PIXEL-FACTORY\limira\limira-repo
pnpm create payload-app@latest app --template blank --db postgres --no-git
cd app
pnpm add @payloadcms/plugin-ecommerce @payloadcms/plugin-seo @payloadcms/plugin-search \
         @payloadcms/plugin-form-builder @payloadcms/plugin-nested-docs \
         @payloadcms/plugin-redirects @payloadcms/storage-s3
pnpm add next-intl motion gsap lenis
pnpm add -D @playwright/test vitest @vitejs/plugin-react eslint prettier
```

- [ ] Verifică versiunile din `04-ARCHITECTURE.md §1`; fixează-le exact (fără `^` pe Payload)
- [ ] `docker-compose.yml` cu Postgres 16 + volum persistent
- [ ] `.env.example` complet + `.env` local; `.gitignore` corect
- [ ] `git init` la rădăcina repo-ului, primul commit
- [ ] TypeScript `strict`, ESLint + Prettier, `pnpm typecheck` / `lint` / `test` funcționale
- [ ] Payload pornește, admin accesibil la `/admin`, primul user creat

**Gata când:** `pnpm dev` pornește, `/admin` și `/` răspund, Postgres persistă între reporniri.

---

## M2 — Fundația de design în cod

- [ ] `design/tokens/tokens.css` importat în `globals.css`, înaintea Tailwind
- [ ] Tailwind 4 `@theme` mapat peste tokens (culorile Tailwind = variabilele noastre)
- [ ] `next/font`: Bricolage Grotesque, Montserrat, Space Mono — subset `latin` + **`latin-ext`**
- [ ] Utilitare `u-cut`, `u-seam`, `u-label`, grain global, container/grilă
- [ ] Primitive: `Button`, `Input`, `Select`, `Checkbox`, `Quantity`, `Rating`, `Tag`,
      `Badge`, `Price`, `Link`, `Skeleton`, `Toast`, `Tooltip`
- [ ] Stratul de mișcare: provider Lenis (desktop, reduced-motion aware), helperi GSAP,
      variante Motion reutilizabile (`revealUp`, `staggerWords`, `seamWipe`)
- [ ] **Ruta `/design-system`** cu preview pentru fiecare primitivă, în ambele moduri
- [ ] Verificare contrast automată în test (tokens vs. praguri din `03-DESIGN-SYSTEM.md §3.2`)

**Gata când:** `/design-system` arată toate primitivele în ambele moduri, comutarea de mod
funcționează fără FOUC, și `prefers-reduced-motion` dezactivează tot ce trebuie.

---

## M3 — Modelul de conținut Payload

Specificația: `09-CONTENT-MODEL.md`.

- [ ] `plugin-ecommerce` configurat: monedă **RON** (definită custom — plugin-ul livrează
      doar EUR/USD/GBP), colecția de clienți `customers`, adaptor de plată (mock inițial)
- [ ] Override-uri pe `products`: `productType`, `materials[]`, `sourceMaterialImage`,
      `story`, `process`, `careInstructions`
- [ ] Colecții proprii + globals (vezi `09`)
- [ ] Localizare RO/EN activată, `fallback: true`
- [ ] **Etichete și descrieri de câmp în română**, grupate logic în admin — promisiune din ofertă
- [ ] `plugin-seo`, `plugin-nested-docs` (categorii), `plugin-search`, `plugin-form-builder`,
      `plugin-redirects`
- [ ] Access control explicit; `admins` separat de `customers`
- [ ] `pnpm payload generate:types` → `payload-types.ts` commit-uit
- [ ] Script de seed cu date demo (produse fictive marcate `[[DEMO]]`, ușor de șters)

**Gata când:** clienta poate crea un produs cu variante și îl vede în listă, iar
`payload-types.ts` e generat și folosit în frontend.

---

## M4 — Shell: header, footer, i18n, mișcare

- [ ] `Header` sticky + condensare la scroll; logo, meniu, categorii, căutare, cont,
      favorite, coș cu badge
- [ ] **`ModeSwitch`** magazin ↔ atelier, permanent în meniu, cu seam wipe
- [ ] `MegaMenu` desktop + `MobileNav` full-screen
- [ ] `SearchOverlay` cu sugestii instant
- [ ] `CartDrawer` (schelet, se leagă la M9)
- [ ] `Footer`: navigație, legal, social, newsletter, date de companie
- [ ] `QuickContactDock` (WhatsApp / telefon / email) pe mobil
- [ ] `PromoBar` global, programabil
- [ ] next-intl cablat: RO fără prefix, EN pe `/en`, comutator de limbă
- [ ] `/atelier` — pagină teaser în tema atelier („în curând", cu bloom neon)
- [ ] Cookie `limira_mode` + `visitorId` (vezi `04-ARCHITECTURE.md §7.5`)

**Gata când:** poți naviga tot site-ul gol în ambele limbi și ambele moduri, pe mobil și desktop.

---

## M5 — Homepage + blocuri editabile

Toate cele 6 zone contractate (B1), fiecare ca bloc reordonabil din CMS:

- [ ] `HeroSlider` — slider și bannere dinamice, cu titlu cinetic
- [ ] `Marquee` — ticker de neon reactiv la scroll
- [ ] `CategoryGrid` — secțiuni de categorii
- [ ] `ProductCarousel` — carusel de produse cu `ProductCard` (flip-to-material)
- [ ] `ArtGalleryScroller` — zonă dedicată artei reciclate, pinned horizontal pe desktop
- [ ] `AtelierTeaser` — prezentare atelier + intrarea către modul atelier
- [ ] `Testimonials` — testimoniale
- [ ] `SplitStory`, `EditorialQuote`, `NewsletterBlock`, `BlogTeaser`
- [ ] Ordinea și vizibilitatea blocurilor, administrabile

**Gata când:** clienta poate reordona și edita fiecare zonă de pe prima pagină singură.

---

## M6 — Catalog, filtre, căutare

- [ ] Trei tipuri de listare **distincte** (cerință B3): produse în stoc · concepte · colecții
- [ ] Categorii și subcategorii ierarhice, cu pagini proprii și breadcrumbs
- [ ] `FilterBar` + `FilterDrawer`: preț, categorie, mărime, culoare, material, atribute
- [ ] **Filtrele se reflectă în URL**; back-button și share funcționează
- [ ] Sortare, contorizare rezultate, `LoadMore`/paginare, `EmptyState` cu voce de brand
- [ ] Căutare full-text, **insensibilă la diacritice**, cu sugestii de produse și categorii
- [ ] Pagina `/oferte` — produse în promoție în intervalul setat

**Gata când:** un vizitator găsește un produs în ≤ 3 acțiuni din orice punct al site-ului.

---

## M7 — Pagina de produs

- [ ] Galerie foto cu zoom, thumbs, swipe pe mobil
- [ ] Descriere scurtă + completă, stoc real, `careInstructions`
- [ ] `VariantPicker`: mărime, culoare, material — actualizează preț/stoc/galerie fără reload
- [ ] Preț + preț redus + procent, cu cifre tabulare
- [ ] Adăugare în coș cu animația de zbor + sertar elastic
- [ ] Favorite (persistente pe `visitorId` și pe cont) și comparare
- [ ] Recenzii cu rating: afișare, agregare, formular, moderare în panou
- [ ] Produse similare / recomandate
- [ ] Secțiunea „materialul-sursă" — macro-foto + poveste (baza pentru Faza 2)
- [ ] Date structurate `Product` + `AggregateRating` + `Breadcrumb`

**Gata când:** toate cele 11 elemente din cerința B4 sunt prezente și funcționale.

---

## M8 — Artă reciclată, blog, editorial, contact, feedback

- [ ] `/arta` — galerie masonry pentru piese unicat, ratio mixt, fără crop agresiv
- [ ] Pagina piesei unicat: poveste, proces, material, status „vândut" fără dispariție
- [ ] Blog: listă, articol, categorii, autor, SEO, feed
- [ ] `/despre` — povestea brandului pe blocuri
- [ ] `/contact` — formular validat + anti-spam, hartă, butoane rapide, date de companie
- [ ] Sistem de feedback: colectare, listare, moderare
- [ ] Pagini generice pe blocuri (`[page]`)

---

## M9 — Coș, checkout, plăți, cont

- [ ] Coș: actualizare cantități, ștergere, subtotal, **coș persistent guest → merge la login**
- [ ] Cupoane validate server-side (procent / sumă / prag / interval / limită)
- [ ] Checkout în maximum 3 ecrane: date → livrare → plată; **checkout rapid ca guest**
- [ ] Adrese de facturare și livrare, salvate în cont
- [ ] Plată online cu cardul, end-to-end, cu webhook idempotent și verificare de semnătură
- [ ] Pagina de confirmare + email de confirmare
- [ ] Cont: comenzi cu status, adrese, date, favorite, **descărcare factură**
- [ ] Autentificare, înregistrare, resetare parolă, cu rate limiting

**Gata când:** o comandă reală de test trece complet, în ambele limbi, pe mobil.

---

## M10 — Integrări + module administrative

- [ ] Curier: generare automată AWB + tracking în panou și în contul clientului
- [ ] Facturare: emitere automată + link de descărcare
- [ ] Newsletter, chat/WhatsApp, social
- [ ] GA4 + Meta Pixel, **consent-gated**
- [ ] Rapoarte de comenzi și vânzări + export CSV
- [ ] **Coș abandonat**: job programat + email de recuperare, cu interval configurabil
- [ ] Cross-sell / up-sell configurabile
- [ ] Notificări email (admin + client), șabloane editabile
- [ ] Promo popup / header banner, programabil
- [ ] Toate integrările au **mod mock** funcțional

---

## M11 — Legal, SEO, performanță, A11y, import, lansare Faza 1

- [ ] Pagini legale (conținut de la clientă) + banner GDPR care blochează scripturile
- [ ] `sitemap.xml` localizat, `robots.txt`, canonical, hreflang, date structurate
- [ ] **Buget de performanță atins** (`10-DEPLOY-OPS.md`) — Lighthouse CI verde
- [ ] Audit de accesibilitate WCAG 2.2 AA + parcurs complet cu tastatura
- [ ] Import și optimizare **până la 150 de produse**
- [ ] E2E Playwright: căutare → PDP → coș → checkout, în ambele limbi
- [ ] Testare reală pe Android + iOS + tabletă + desktop
- [ ] Producție: domeniu, DNS, SSL, backup, monitorizare, analytics
- [ ] Manual de utilizare a panoului + sesiune de instruire cu clienta
- [ ] **Documentație de predare** (art. 3.7)

**Gata când:** site-ul e live, clienta a fost instruită, iar factura pentru tranșa 2 e emisă.

---

## M12 — Faza 2: fundația atelierului

> Începe **numai** după acord scris + încasarea tranșei 3.

- [ ] Alegerea vizualizatorului 360° (ADR-005) și integrarea lui
- [ ] Colecțiile `scenes` și `hotspots`; procesarea și tiling-ul panoramelor
- [ ] **Editor vizual de poziționare a hotspot-urilor în panoul Payload** (cerință A4) —
      componentă custom de câmp, nu introducere manuală de yaw/pitch
- [ ] Navigare între 6–10 scene, cu preîncărcarea scenei următoare
- [ ] Giroscop pe mobil, cu fallback la drag și permisiune cerută explicit
- [ ] Fișa de produs deschisă **în scenă**, cu adăugare în coș fără ieșire din atelier
- [ ] Activare/dezactivare scene și puncte din panou

---

## M13 — Faza 2: mecanici, motor de explorare, recompense

- [ ] Motorul de explorare: descoperit/nedescoperit, progres autosalvat, colecții complete
- [ ] **Fără întrebări, fără răspunsuri corecte/greșite, fără validare** (vezi `02-SCOPE-FAZA-2`)
- [ ] Mecanica 1 — „Ce poți face din...?" (Before & After cu slider)
- [ ] Mecanica 2 — „Găsește arta"
- [ ] Mecanica 3 — „Ce nu vezi pe etichetă"
- [ ] Mecanica 4 — „Atinge materialul"
- [ ] Panouri incluse: „Hai în backstage", „Joaca culorilor", „Secrete din Art Studio"
- [ ] Recompense: coduri unice, valabilitate limitată, condiții configurabile,
      aplicabile la checkout
- [ ] Migrarea progresului anonim → cont la autentificare
- [ ] **Plafon respectat: maximum 40 de puncte interactive**

---

## M14 — Faza 2: QA, performanță, lansare

- [ ] Buget de performanță pe mobil pentru conținut panoramic (cel mai greu ecran)
- [ ] Testare pe device-uri reale, inclusiv unul low-end
- [ ] Accesibilitate: alternativă non-360 pentru conținutul mecanicilor
- [ ] E2E: explorare → descoperire → recompensă → aplicare la checkout
- [ ] Instruire pe panoul de scene și mecanici
- [ ] Lansare + documentație de predare + **factura tranșei 4**
- [ ] Case study pentru portofoliu (art. 7 — cu acordul clientei)
