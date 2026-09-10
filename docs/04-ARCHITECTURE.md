# 04 — Arhitectură tehnică

## 1. Stack (versiuni verificate la 10.09.2026)

| Componentă | Versiune | Notă |
|---|---|---|
| Node.js | **24.x** | LTS pe mașina de dev |
| pnpm | **11.x** | manager de pachete al proiectului |
| Next.js | **16.3.x** | App Router, RSC, Server Actions |
| React | **19.3.x** | |
| TypeScript | **5.x**, `strict: true` | |
| Payload CMS | **3.88.x** | rulează **în același proiect Next**, nu ca serviciu separat |
| `@payloadcms/db-postgres` | 3.88.x | Drizzle sub capotă |
| `@payloadcms/plugin-ecommerce` | **3.88.x** | products · variants · carts · orders · transactions · addresses + adaptor Stripe |
| `@payloadcms/plugin-seo` · `-search` · `-form-builder` · `-nested-docs` · `-redirects` | 3.88.x | |
| `@payloadcms/richtext-lexical` | 3.88.x | |
| `@payloadcms/storage-s3` | 3.88.x | media în producție (R2 / S3) |
| PostgreSQL | **16+** | Docker local, managed în producție |
| Tailwind CSS | **4.3.x** | configurare CSS-first (`@theme`), peste `design/tokens/tokens.css` |
| next-intl | **4.14.x** | RO implicit fără prefix, EN pe `/en` |
| motion (framer-motion) | **13.x** | animații de componentă |
| gsap + ScrollTrigger | **3.15.x** | coregrafie legată de scroll |
| lenis | **1.3.x** | smooth scroll desktop |

**Vizualizator 360° (Faza 2):** decizie amânată la M11 — vezi `08-DECISIONS.md` ADR-005.
Candidați: Pannellum (mic, MIT, suficient pentru echirectangular + hotspots),
Marzipano (Google, mai capabil), sau `three` + `@react-three/fiber` (control total, cost mai mare).

## 2. De ce Payload și nu WooCommerce/Shopify

Argumentele din ofertă, pe care implementarea trebuie să le onoreze:
viteză reală (nu „optimizat cu plugin-uri"), zero plugin-uri care se rup la actualizare,
libertate totală de design (atelierul digital **nu s-ar putea construi altfel**),
panou de administrare cu câmpuri denumite în limba clientei, și scalare de la 40 la
4.000 de produse **prin adăugare, nu prin reconstrucție**.

## 3. Structura proiectului

```
limira-repo/
├─ CLAUDE.md
├─ docs/                       ← documentația de proiect (acest folder)
├─ design/
│  ├─ tokens/tokens.css        ← sursa de adevăr pentru design tokens
│  └─ mockup/index.html        ← mockup-ul de prezentare pentru clientă
├─ brand/                      ← logo-uri + nota de branding
├─ reference/                  ← extrase text din contract/anexă/ofertă
└─ app/                        ← ⬅ APLICAȚIA (se creează la M1)
   ├─ src/
   │  ├─ app/
   │  │  ├─ (frontend)/
   │  │  │  ├─ [locale]/
   │  │  │  │  ├─ layout.tsx            ← data-mode, grain, providers
   │  │  │  │  ├─ page.tsx              ← Home
   │  │  │  │  ├─ (shop)/
   │  │  │  │  │  ├─ produse/[...slug]/
   │  │  │  │  │  ├─ produs/[slug]/
   │  │  │  │  │  ├─ colectii/[slug]/
   │  │  │  │  │  ├─ concepte/[slug]/
   │  │  │  │  │  ├─ arta/[slug]/
   │  │  │  │  │  ├─ oferte/
   │  │  │  │  │  ├─ cos/  checkout/  comanda/[id]/
   │  │  │  │  │  ├─ cont/(comenzi|adrese|favorite|date)/
   │  │  │  │  │  ├─ favorite/  compara/  cautare/
   │  │  │  │  │  └─ blog/[slug]/  despre/  contact/  [page]/
   │  │  │  │  └─ atelier/                ← FAZA 2 (rută rezervată din Faza 1)
   │  │  │  │     ├─ page.tsx             ← intrare + selector de scenă
   │  │  │  │     └─ [scene]/page.tsx
   │  │  │  ├─ globals.css
   │  │  │  └─ design-system/             ← preview de componente (dev + preview only)
   │  │  ├─ (payload)/                    ← admin + API, generat de Payload
   │  │  └─ api/
   │  │     ├─ webhooks/(stripe|courier|invoicing)/
   │  │     └─ cron/(abandoned-cart|sitemap-warm)/
   │  ├─ collections/          ← vezi 09-CONTENT-MODEL.md
   │  ├─ globals/              ← Settings, Navigation, Footer, PromoBar
   │  ├─ blocks/               ← blocurile de pagină (Payload + React, pereche 1:1)
   │  ├─ components/
   │  │  ├─ primitives/  compound/  motion/  atelier/
   │  ├─ lib/
   │  │  ├─ payload/  ecommerce/  integrations/  seo/  analytics/  utils/
   │  ├─ hooks/
   │  ├─ i18n/  messages/{ro,en}.json
   │  ├─ payload.config.ts
   │  └─ payload-types.ts      ← generat, commit-uit
   ├─ tests/{e2e,unit}/
   ├─ docker-compose.yml       ← postgres local
   └─ .env.example
```

> **Regulă de foldere:** `docs/`, `design/`, `brand/`, `reference/` rămân la rădăcina
> repo-ului, în afara aplicației — sunt livrabile de proiect, nu cod. Aplicația trăiește
> în `app/`. Așa mockup-ul poate fi trimis clientei fără să atingem build-ul.

## 4. Rutare și internaționalizare

- **next-intl** cu `localePrefix: "as-needed"`, `defaultLocale: "ro"`, `locales: ["ro","en"]`.
  → RO: `/produs/geanta-x` · EN: `/en/product/bag-x`
- **Slug-urile sunt localizate** în Payload (câmp `slug` cu `localized: true`), deci URL-ul
  EN nu e o traducere automată — clienta îl controlează.
- Localizare Payload: `localization: { locales: ["ro","en"], defaultLocale: "ro", fallback: true }`.
- `hreflang` + `canonical` generate din `generateMetadata` pe fiecare rută.
- **Traducerea conținutului nu e în scope** (art. 2.10). Livrăm structura și UI-ul tradus
  (`messages/en.json`); textele de produs/editorial în EN le introduce clienta.
  Cu `fallback: true`, câmpurile EN necompletate afișează RO — nicio pagină goală.

## 5. Cele două moduri, tehnic

```ts
// src/app/(frontend)/[locale]/layout.tsx
const mode = resolveMode(pathname, cookies());   // "shop" | "atelier"
<html lang={locale} data-mode={mode}>
```

- `resolveMode`: rutele sub `/atelier` → `atelier`; restul → `shop`; suprascriere manuală
  din `ModeSwitch` persistată în cookie `limira_mode` (SameSite=Lax, 1 an).
- Citit pe server → **fără FOUC**, fără flash de temă greșită.
- Comutarea manuală folosește **View Transitions** cu `clip-path` diagonal (§6.1 din design system);
  fallback: cross-fade de 200ms.
- **Coșul și sesiunea nu se resetează niciodată la schimbarea modului** — cerință contractuală.

## 6. Model de date — pe scurt

Detaliul complet, câmp cu câmp: **`09-CONTENT-MODEL.md`**.

**Din plugin-ul de ecommerce:** `products` · `variants` · `carts` · `orders` ·
`transactions` · `addresses`, plus endpoint-urile de plată `/api/payments/{provider}/…`.

**Extinse de noi** (prin `CollectionOverride`, nu prin fork):
`products` primește `materials[]`, `sourceMaterialImage` (pentru flip-to-material și,
în Faza 2, Before & After), `productType` (`stoc` | `concept` | `unicat`), `story`, `process`.

**Colecții proprii Faza 1:**
`categories` (nested-docs) · `collections` · `concepts` · `artPieces` · `materials` ·
`posts` · `postCategories` · `pages` · `testimonials` · `reviews` · `feedback` ·
`coupons` · `wishlists` · `media` · `customers` · `admins` · `forms`/`formSubmissions`

**Globals Faza 1:** `settings` · `navigation` · `footer` · `promoBar` · `legal`

**Colecții Faza 2 (schema se proiectează acum, se implementează la M11):**
`scenes` · `hotspots` · `mechanics` · `mechanicItems` · `discoveries` · `rewards` · `rewardCodes`

## 7. Pregătirea pentru Faza 2 — ce facem ÎN Faza 1

Acesta e punctul în care un proiect prost făcut devine scump. Cinci decizii luate acum:

1. **Ruta `/atelier` există** din Faza 1, ca teaser + „în curând", cu tema `atelier` activă.
   Comutatorul de mod e livrat în Faza 1 (cerință: „comutator permanent în meniu").
2. **Tema atelier e completă din Faza 1** (tokens, nu doar culori) și se demonstrează pe
   ruta teaser. Faza 2 nu redesenează nimic, doar populează.
3. **Coșul e agnostic de suprafață.** `useCart()` din plugin funcționează identic în
   magazin și în scenă 360°. Niciun `if (isAtelier)` în logica de coș.
4. **`products` are deja `sourceMaterialImage` și `materials[]`.** Mecanica Before & After
   și „Atinge materialul" din Faza 2 citesc aceleași câmpuri pe care le folosește deja
   cardul de produs în Faza 1. Zero migrare de conținut.
5. **Identitatea vizitatorului anonim.** Un `visitorId` (cookie, 1 an) se emite din Faza 1
   pentru coș de guest și favorite. Faza 2 leagă progresul de explorare de același ID și
   îl migrează la contul de client la autentificare. Dacă nu îl introducem acum,
   Faza 2 pierde progresul utilizatorilor anonimi sau necesită migrare.

## 8. Integrări — arhitectură

Toate integrările externe trec printr-un **strat de adaptoare** în `lib/integrations/`,
cu o interfață proprie și un adaptor per furnizor. Motiv: clienta încă nu a ales
furnizorii (vezi `08-DECISIONS.md`), iar contractul spune explicit că nu răspundem de
politicile lor — trebuie să putem schimba furnizorul fără să atingem UI-ul.

```
lib/integrations/
├─ payments/     ← adaptor Payload (stripe | netopia)
├─ shipping/     ← createAWB(order) → { awb, label, tracking }  (sameday|fan|cargus|dpd)
├─ invoicing/    ← issueInvoice(order) → { number, pdfUrl }     (smartbill|oblio|fgo)
├─ newsletter/   ← subscribe(email, tags)                        (mailchimp|klaviyo|ac)
└─ analytics/    ← consent-gated: GA4, Meta Pixel
```

Reguli:
- **Toate cheile în variabile de mediu**, niciodată în cod sau în CMS.
- Fiecare integrare are **mod mock** activ când lipsește cheia → dezvoltarea nu se
  blochează așteptând conturile clientei.
- Webhook-urile (Stripe în primul rând) verifică semnătura și sunt **idempotente**.
- Erorile de la terți **nu blochează comanda**: AWB-ul și factura se generează asincron,
  cu reîncercare și alertă în panou dacă eșuează.

## 9. Performanță — decizii de arhitectură

- **RSC implicit.** Componentele client sunt insule: coș, filtre, galerie, căutare, mișcare.
- **Fără date de preț/stoc în cache static.** PDP: `revalidate` scurt + `revalidateTag`
  la modificarea produsului (hook Payload `afterChange`).
- **Imagini**: `next/image`, AVIF + WebP, `sizes` explicit pe fiecare instanță,
  `priority` doar pe LCP-ul fiecărei rute. Payload generează dimensiunile la upload.
- **Fonturi**: `next/font` cu `display: swap`, subset `latin` + `latin-ext` (obligatoriu
  pentru diacritice RO), preload doar pe display + UI.
- **GSAP/Lenis**: `dynamic(() => …, { ssr: false })`, montate după `requestIdleCallback`.
- **Bundle budget**: ≤ 180 KB JS gzip pentru prima încărcare pe Home și PDP.
- Buget complet și praguri de CI: `10-DEPLOY-OPS.md`.

## 10. Securitate

- CSP strict cu nonce (Next 16 middleware); fără `unsafe-inline` pe scripturi.
- HSTS, `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy` (gyroscope permis **doar** pe `/atelier` — necesar pentru turul 360°).
- Rate limiting: login, resetare parolă, formulare, aplicare cupon, căutare.
- Access control Payload explicit pe fiecare colecție. `customers` ≠ `admins`
  (colecții de auth separate) — clientul final nu are niciodată acces la panou.
- Plățile: **niciodată** date de card pe serverul nostru — doar tokenizare la procesator.
- GDPR: consimțământ înainte de GA4/Pixel, export și ștergere cont, registru de consimțăminte.
- `pnpm audit` în CI; Dependabot/Renovate pe minor+patch.
