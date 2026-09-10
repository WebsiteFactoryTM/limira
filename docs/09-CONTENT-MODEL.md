# 09 — Modelul de conținut Payload

**Principiu de bază:** clienta trebuie să vadă în panou **câmpuri denumite în limba în
care vorbește despre munca ei** (promisiune explicită din ofertă). Fiecare câmp are
`label` în română și, unde nu e evident, `admin.description`. Câmpurile tehnice se ascund.

Legendă: `L` = localizat (RO/EN) · `R` = obligatoriu · `I` = indexat

---

## 1. Din `@payloadcms/plugin-ecommerce` (nu le rescrie)

`products` · `variants` · `carts` · `orders` · `transactions` · `addresses`
plus endpoint-urile `/api/payments/{provider}/…` și hook-urile React
`useCart` · `usePayments` · `useAddresses` · `useCurrency` · `useEcommerce`.

Configurare la M3:
- monedă implicită **RON**, definită custom (ADR-003); `supportedCurrencies: [RON, EUR]`
- colecția de clienți: `customers` (separată de `admins`)
- adaptor de plată: mock la M3, real la M9

### 1.1 Extinderi pe `products` (prin `CollectionOverride`)

| Câmp | Tip | Flags | Rol |
|---|---|---|---|
| `productType` | select: `stoc` \| `concept` \| `unicat` | R, I | Susține cerința B3 — cele trei tipuri de listare distincte |
| `shortDescription` | textarea | L | Descriere scurtă (PDP + carduri) |
| `description` | richText (lexical) | L | Descriere completă |
| `materials` | relationship → `materials`, hasMany | I | Filtrare + „Atinge materialul" (Faza 2) |
| `sourceMaterialImage` | upload → `media` | | 🔴 **Macro-foto a materialului-sursă.** Alimentează „flip to material" (Faza 1) și „Ce poți face din...?" (Faza 2) |
| `sourceMaterialLabel` | text | L | „Blug vechi", „Plasă de pescuit" |
| `story` | richText | L | Povestea piesei |
| `process` | richText | L | Cum a fost făcută |
| `careInstructions` | richText | L | Întreținere |
| `dimensions` | group (l, L, H, greutate) | | |
| `crossSell` | relationship → `products`, hasMany | | Cerință C7 |
| `upSell` | relationship → `products`, hasMany | | Cerință C7 |
| `collections` | relationship → `collections`, hasMany | I | |
| `categories` | relationship → `categories`, hasMany | I | |
| `isOnSale` / `saleFrom` / `saleTo` | checkbox + date | I | Alimentează `/oferte` (B9) |
| `ratingAvg` / `ratingCount` | number | | Calculate din `reviews`, read-only |
| `seo` | group (plugin-seo) | L | |

### 1.2 Extinderi pe `variants`
`size` · `color` (cu `hex` pentru swatch) · `material` (relationship) · `stock` ·
`sku` · `barcode` · `imagesOverride`

> Atenție: piesele `unicat` au stoc 1 și, la vânzare, **rămân vizibile marcate „vândut"**
> (cerință B5) — nu se ascund. Flag: `keepVisibleWhenSoldOut: true` (implicit pentru `unicat`).

---

## 2. Colecții proprii — Faza 1

### `categories` (nested-docs)
`title` L R · `slug` L R I · `parent` · `description` L · `image` · `icon` ·
`displayOrder` · `featuredOnHome` · `seo` L

### `collections` — colecții curatoriate
`title` L R · `slug` L R · `subtitle` L · `heroImage` · `description` richText L ·
`products[]` · `season` · `publishedAt` · `seo` L

### `concepts` — piese-concept, nu încă în stoc
`title` L R · `slug` L R · `images[]` · `concept` richText L · `materialsIntended[]` ·
`status`: `schiță` \| `prototip` \| `în lucru` · `interestForm` (checkbox: acceptă cereri)

### `artPieces` — piese unicat de artă (B5)
`title` L R · `slug` L R · `images[]` R (ratio liber) · `story` richText L R ·
`process` richText L · `materials[]` · `dimensions` · `year` ·
`availability`: `disponibilă` \| `vândută` \| `nu e de vânzare` ·
`price` (opțional) · `linkedProduct` (opțional) · `seo` L

### `materials`
`name` L R · `slug` · `macroImage` (textură) · `origin` L · `characteristics` L ·
`reuseOptions` L · `swatchColor`
> Aceleași câmpuri alimentează mecanica „Atinge materialul" din Faza 2. **Nu inventa
> conținut aici** (art. 2.9) — vezi `07-CLIENT-DELIVERABLES.md`.

### `posts` + `postCategories` (B12)
`title` L R · `slug` L R · `excerpt` L · `coverImage` · `content` richText L ·
`author` · `categories[]` · `publishedAt` · `relatedProducts[]` · `seo` L

### `pages` (B10, pagini generice)
`title` L R · `slug` L R · `layout` blocks[] · `seo` L

### `testimonials`
`author` · `role` L · `quote` L R · `avatar` · `rating` · `featured`

### `reviews` (B4)
`product` R · `customer` \| `guestName` · `rating` 1–5 R · `title` L · `body` ·
`status`: `în așteptare` \| `publicată` \| `respinsă` · `verifiedPurchase` · `createdAt`

### `feedback` (B13)
`type`: `sugestie` \| `problemă` \| `laudă` · `message` R · `email` · `page` ·
`status`: `nou` \| `în lucru` \| `rezolvat` · `internalNotes`

### `coupons` (C6)
`code` R I unic · `type`: `procent` \| `sumă fixă` · `value` R · `minOrder` ·
`validFrom` / `validTo` · `usageLimit` / `usedCount` · `perCustomerLimit` ·
`appliesTo` (toate \| categorii \| produse) · `active` ·
`source`: `manual` \| `recompensă atelier` ← 🔗 punctul de legătură cu Faza 2

### `wishlists`
`visitorId` I \| `customer` · `products[]` · `updatedAt`
> `visitorId` permite favorite fără cont (ADR-009); la login se face merge.

### `media`
`alt` L **R** (nenegociabil pentru accesibilitate) · `caption` L · `credit` ·
`focalPoint` · dimensiuni generate: `thumb 400` · `card 800` · `hero 1600` · `full 2400`,
toate în AVIF + WebP

### `customers` (auth) și `admins` (auth)
Colecții separate. `customers`: `email`, `name`, `phone`, `addresses[]`, `orders[]`,
`newsletterConsent`, `visitorId`, `createdAt`.
`admins`: acces la panou. **Un client nu are niciodată acces la `/admin`.**

### `forms` / `formSubmissions`
Din `plugin-form-builder` — contact (B11) și feedback (B13).

---

## 3. Globals — Faza 1

| Global | Conținut |
|---|---|
| `settings` | Nume site, logo, favicon, date de companie (CUI, reg. com., adresă), contact, social, moneda, TVA, praguri de livrare |
| `navigation` | Meniu principal (multi-nivel), meniu mobil, comutatorul de mod |
| `footer` | Coloane de linkuri, text legal, newsletter, plăți acceptate |
| `promoBar` | Text L, link, culoare, `activeFrom`/`activeTo`, frecvență de afișare (C10) |
| `legal` | Referințe către paginile: Termeni, Confidențialitate, Cookie, Livrare și retur, GDPR |
| `emails` | Șabloane editabile: comandă nouă, confirmare, schimbare status, coș abandonat, resetare parolă (C9) |
| `abandonedCart` | Activ, întârziere (ore), număr de reminder-e, șablon (C5) |

---

## 4. Blocuri de pagină

Fiecare bloc are **pereche 1:1**: configurația Payload în `src/blocks/<Nume>/config.ts`
și componenta React în `src/blocks/<Nume>/Component.tsx`. Un singur registru,
`src/blocks/index.ts`, folosit și de CMS și de renderer.

`HeroSlider` · `Marquee` · `CategoryGrid` · `ProductCarousel` · `ArtGalleryScroller` ·
`AtelierTeaser` · `SplitStory` · `BeforeAfterStrip` · `Testimonials` · `EditorialQuote` ·
`RichText` · `MediaGrid` · `FAQ` · `ContactBlock` · `NewsletterBlock` · `BlogTeaser` ·
`StatCounters` · `LogoTicker`

Fiecare bloc are: `anchorId`, `theme` (moștenit \| shop \| atelier), `spacing`, `visible`.

---

## 5. Colecții Faza 2 — schema se proiectează acum, se implementează la M12–M13

### `scenes`
`title` L R · `slug` R · `panorama` upload R (echirectangular 2:1) · `order` ·
`initialYaw` / `initialPitch` / `initialFov` · `links[]` → { `toScene`, `yaw`, `pitch`, `label` L } ·
`ambientAudio` (opțional) · `active` checkbox
> Plafon contractual: **6–10 scene**. Peste → dezvoltare suplimentară.

### `hotspots`
`scene` R I · `yaw` R · `pitch` R · `type`: `produs` \| `mecanică` \| `poveste` \| `navigare` ·
`icon` · `label` L · `product` (dacă `produs`) · `mechanicItem` (dacă `mecanică`) ·
`content` richText L · `media[]` · `discoverable` checkbox · `active` checkbox
> Plafon contractual: **maximum 40 de puncte interactive în total.**
> Adaugă o validare care refuză salvarea peste 40 de hotspot-uri active,
> cu mesaj explicit — protejează și clienta, și scope-ul.
> `yaw`/`pitch` se setează dintr-un **editor vizual** custom (cerință A4), nu manual.

### `mechanics`
`key`: `beforeAfter` \| `findArt` \| `labelStories` \| `touchMaterial` (enum **închis** —
mecanici noi = dezvoltare suplimentară, art. F din `02-SCOPE-FAZA-2.md`) ·
`title` L · `intro` richText L · `active`

### `mechanicItems`
`mechanic` R · `order` · `title` L R · plus câmpuri condiționate de mecanică:
- `beforeAfter`: `imageBefore` R, `imageAfter` R, `caption` L
- `findArt`: `artwork` L, `artist` L, `note` richText L, `image`
- `labelStories`: `hookTitle` L R, `body` richText L R, `media`
- `touchMaterial`: `material` → `materials`, `macroImage`, `notes` richText L

### `discoveries` (progres, autosalvat)
`visitorId` I \| `customer` · `hotspot` \| `mechanicItem` · `discoveredAt` · `sceneVisited[]`
> Fără scor, fără „corect/greșit" — Anexa exclude explicit validarea răspunsurilor.

### `rewards`
`title` L R · `description` L · `image` · `conditionType`: `număr de puncte descoperite` \|
`colecție completă` \| `scene vizitate` · `conditionValue` · `couponTemplate`
(procent/sumă, valabilitate în ore) · `active` · `maxRedemptions`

### `rewardCodes`
`reward` R · `code` R I unic · `visitorId` \| `customer` · `issuedAt` · `expiresAt` ·
`redeemedAt` · `order`
> La emitere se creează automat un `coupon` cu `source: "recompensă atelier"` →
> aplicarea la checkout folosește exact aceeași logică validată în Faza 1. Zero cod nou
> în checkout pentru Faza 2.

---

## 6. Reguli de implementare

1. **Prețuri în subunități întregi** (bani), niciodată `float`.
2. **`alt` obligatoriu** pe `media`. Fără excepții.
3. **Slug-uri localizate**, generate din titlu cu transliterare RO corectă
   (ă→a, â→a, î→i, ș→s, ț→t), editabile manual.
4. **`revalidateTag`** în `afterChange`/`afterDelete` pe fiecare colecție care apare
   în frontend — altfel clienta editează și nu vede schimbarea.
5. **Versionare + draft/publish** pe `pages`, `posts`, `artPieces`, `collections`.
   Preview live pentru drafturi.
6. **Enum-urile de scope sunt închise** (`mechanics.key`, `productType`) — o valoare
   nouă înseamnă dezvoltare suplimentară, nu o intrare nouă în CMS.
7. **`payload-types.ts` se commit-uiește** și se regenerează la fiecare modificare de schemă.
