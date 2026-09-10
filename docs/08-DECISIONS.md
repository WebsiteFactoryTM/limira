# 08 — Decizii, întrebări deschise, backlog

## A. ADR — decizii de arhitectură luate

### ADR-001 — Payload rulează în același proiect Next, nu separat
**Decis.** Payload 3 e proiectat să trăiască în aplicația Next (`app/(payload)`).
Un singur deploy, un singur set de tipuri, acces direct la Local API din RSC
(fără hop HTTP la fetch de produse). Alternativa (Payload standalone + Next separat)
adaugă latență, un al doilea deploy și complexitate de CORS, fără câștig aici.

### ADR-002 — Folosim `@payloadcms/plugin-ecommerce`, nu comerț scris de la zero
**Decis.** Plugin-ul oficial livrează `products`, `variants`, `carts`, `orders`,
`transactions`, `addresses`, hook-urile React (`useCart`, `usePayments`, `useAddresses`,
`useCurrency`) și un adaptor Stripe. Extindem prin `CollectionOverride`, nu prin fork.
**Consecință:** ne aliniem la versiunea Payload a plugin-ului (ambele `3.88.0` — fixate exact).

### ADR-003 — Moneda RON se definește custom
**Decis.** Plugin-ul exportă doar `EUR`, `USD`, `GBP`. Definim un obiect `Currency` pentru
RON (cod `RON`, 2 zecimale, simbol `lei`, format `ro-RO`) și îl setăm ca monedă implicită.
Prețurile se stochează în **subunități întregi (bani)**, niciodată în float.

### ADR-004 — Procesatorul de plăți: Stripe implicit, Netopia ca alternativă
**Recomandăm Stripe**: adaptor oficial în plugin, integrare rapidă, webhook-uri solide,
Apple/Google Pay incluse. **Dar decizia e a clientei** — mulți cumpărători din RO preferă
Netopia/EuPlătesc, iar comisioanele diferă.
Dacă alege Netopia: scriem un `PaymentAdapter` custom pe interfața plugin-ului
(`initiatePayment` + `confirmOrder` + endpoint de webhook). **Estimare: +1 zi de lucru.**
🔵 **Necesită răspunsul clientei — vezi secțiunea B.**

### ADR-005 — Vizualizatorul 360° se alege la M12, nu acum
**Amânat deliberat.** Alegerea depinde de calitatea reală a panoramelor primite.
- **Pannellum** — mic (~20KB), MIT, echirectangular + hotspots. Suficient pentru scope.
- **Marzipano** — tiling multi-rezoluție, mai bun pentru panorame foarte mari.
- **three + @react-three/fiber** — control total, dar +150KB și mai mult efort.
Criteriu: alegem cel mai mic care satisface bugetul de performanță pe mobil low-end.

### ADR-006 — Fără colțuri rotunjite pe structură
**Decis.** Brandul e unghiular (logo-ul e un pătrat). Rază `0` pe carduri, secțiuni,
inputuri; `999px` doar pe chip-uri și badge-uri. Colțul tăiat (`clip-path`) înlocuiește
raza. Este o decizie de identitate, nu de gust — nu o inversa fără acordul clientei.

### ADR-007 — CTA roz cu text negru
**Decis.** Alb pe `#E64593` are 3,72:1 (sub AA). Negru pe roz are 5,64:1 (AA).
Alegerea accesibilă este și cea mai apropiată de estetica anilor '90. Vezi
`03-DESIGN-SYSTEM.md §3.2`.

### ADR-008 — Două axe independente: luminozitate și mod *(revizuit)*
**Decis.** Un singur comutator nu poate face două treburi. Le separăm:

- **`data-lum`** = `light` | `dark` — luminozitatea magazinului, **aleasă de vizitator**
  dintr-un comutator dedicat *Luminos / Întunecat / Sistem*. Persistat în
  `localStorage` + cookie; `system` se re-rezolvă la schimbarea `prefers-color-scheme`.
- **`data-mode`** = `shop` | `atelier` — identitatea editorială, **rezolvată din rută**
  (`/atelier/*`) plus comutatorul permanent din meniu (cerință contractuală).

Atelierul e întunecat prin definiție contractuală, deci `data-mode="atelier"`
suprascrie luminozitatea. Rezultă **trei suprafețe**: magazin·lumină, magazin·întuneric
(fundal cald `#121014`, editorial) și atelier (vid `#08070A`, neon maxim).
Ambele se rezolvă pe server → fără FOUC. Detalii: `03-DESIGN-SYSTEM.md §3.3`.

*Versiunea anterioară a acestui ADR folosea un singur atribut `data-mode` pentru ambele
roluri, ceea ce lega tema întunecată de atelier și lăsa magazinul fără temă întunecată
proprie. Revizuit la 10.09.2026.*

### ADR-011 — Neonul se implementează cu `filter: drop-shadow()`, nu `box-shadow`
**Decis.** Butoanele și cardurile au colț tăiat prin `clip-path`, iar `box-shadow` e
tăiat odată cu elementul. `drop-shadow` se aplică **după** clip și urmează silueta
reală, deci e singura variantă compatibilă cu motivul „cut & fold".

Corolar de design: **neonul nu strălucește la lumina zilei.** Pe tema luminoasă haloul
devine o umbră colorată difuză (cerneală saturată, lumină scursă pe hârtie); pe temele
întunecate se aprinde complet, cu miez alb și halou în două straturi. **Mișcarea rămâne
identică** pe toate suprafețele. Tokens: `--nf-1/2/3`, `--nt`, `--tube` — componentele
nu știu pe ce suprafață sunt.

### ADR-012 — Meniu mobil ca modal pe tot ecranul, cu tăietură diagonală
**Decis.** Sub 1200px, navigația trece integral într-un modal full-screen care intră cu
aceeași **tăietură diagonală** ca tranziția de mod — un singur gest de brand, folosit
consecvent. Itemele intră decalat cu mască, iar la atingere se aprind ca un tub de neon
înainte ca meniul să se închidă (feedback per acțiune).
Modalul conține și ce nu încape în antetul de mobil: comutatoarele de temă și de mod,
contul, contactul rapid și limba. Antetul de mobil rămâne la logo + căutare + favorite +
coș + hamburger.

### ADR-009 — `visitorId` se emite din Faza 1
**Decis.** Coșul de guest și favoritele au nevoie de el oricum, iar Faza 2 leagă progresul
de explorare de același ID. Introdus mai târziu, ar cere migrare de date. Vezi
`04-ARCHITECTURE.md §7.5`.

### ADR-010 — Documentele de proiect stau în afara aplicației
**Decis.** `docs/`, `design/`, `brand/`, `reference/` la rădăcină; codul în `app/`.
Mockup-ul se poate trimite clientei fără să atingem build-ul, iar la predarea codului
(art. 3.7) se predă tot repo-ul, documentație inclusă.

---

## B. Întrebări deschise pentru clientă

De pus **într-un singur email**, la aprobarea designului. Fiecare are un implicit,
ca proiectul să nu se blocheze dacă răspunsul întârzie.

| # | Întrebare | Implicit dacă nu răspunde |
|---|---|---|
| 1 | **Procesator de plăți**: Stripe sau Netopia/EuPlătesc? | Stripe |
| 2 | **Curier**: Sameday, FAN Courier, Cargus sau DPD? | Sameday |
| 3 | **Facturare**: SmartBill, Oblio sau FGO? | Oblio |
| 4 | **Newsletter**: MailChimp, ActiveCampaign sau Klaviyo? | MailChimp |
| 5 | **Domeniul** — care este și cine îl deține acum? | blocant, nu are implicit |
| 6 | **Găzduire**: mergem pe Vercel sau pe VPS? (vezi `10-DEPLOY-OPS.md`) | Vercel + Neon + R2 |
| 7 | **Versiunea EN**: traduce tot conținutul sau doar interfața la lansare? | Doar interfața; conținutul EN cade pe RO (fallback) |
| 8 | **Livrare**: zone, tarife, prag de transport gratuit, retur? | blocant pentru checkout |
| 9 | **Fontul display**: Bricolage Grotesque (implicit) sau Syne? | Bricolage Grotesque |
| 10 | **Structura catalogului**: ce intră la „produse în stoc" vs. „concepte" vs. „colecții"? | blocant pentru M6 |
| 11 | Începem Faza 2 imediat după Faza 1 sau lansăm întâi magazinul? | Lansăm întâi magazinul |
| 12 | Câte produse are catalogul inițial? (plafon inclus: 150) | — |

---

## C. Backlog post-lansare (NU se implementează în cele două faze)

Idei bune apărute în analiză sau în ofertă, dar **în afara Anexei**. Se cotează separat
(art. 2.2). Ține-le aici ca să nu se strecoare în scope.

**Jocuri din ofertă, necontractate:**
Croiește-ți geanta (~800 EUR) · Colecționarul (~350) · Roata atelierului (~300) ·
Cheia dublă (~350) · Îl găsești pe Van Gogh? (~250) · Sezoane · Ce piesă ești? ·
Ce a fost înainte? · Cât salvezi planeta? · Descoperă povestea produsului ·
Licitația piesei unicat (de evaluat separat).
*Estimările din ofertă sunt orientative, nu prețuri ferme.*

**Idei tehnice/UX apărute în analiză:**
- Configurator de produs legat de stoc (diferit de „Joaca culorilor", care e doar vizual)
- Program de fidelitate / puncte
- Wishlist partajabil public
- Lookbook video / editorial cu scroll cinematic
- PWA cu notificări push pentru piesele unicat noi
- Feed de produse pentru Google Shopping / Meta Catalog
- Recenzii cu fotografii de la clienți
- „Adu-ți haina" — programare pentru upcycling la comandă
- A/B testing pe pagina de produs
- Integrare cu marketplace (Etsy / Breslo)

---

## D. Jurnal de revizuiri (art. 2.12)

Faza 1: **2 runde per livrabil de design.** Faza 2: **3 runde.**

| Livrabil | Rundă | Data | Ce a cerut clienta | Status |
|---|---|---|---|---|
| Mockup de direcție (M0) | 1 / 2 | — | — | ⬜ trimis, în așteptare |
