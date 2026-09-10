# 06 — STARE CURENTĂ

> **Acesta este singurul fișier care spune unde am rămas.**
> Se actualizează la finalul fiecărei sesiuni de lucru, înainte de raportare.

**Ultima actualizare:** 10.09.2026
**Milestone curent:** M0 — finalizat, în așteptarea aprobării clientei
**Următorul milestone:** M1 — scaffold aplicație (blocat de aprobarea direcției)

---

## 🔴 ACȚIUNEA IMEDIAT URMĂTOARE

**Trimite clientei link-ul mockup-ului și cere aprobarea scrisă a direcției vizuale**,
împreună cu cele 12 întrebări din `08-DECISIONS.md §B`.

**Două căi de a-l arăta clientei:**

| | Link | Când îl folosești |
|---|---|---|
| Artefact | https://claude.ai/code/artifact/d0dc9c0e-9f54-4508-9bca-9047aebd3750 | iterații de lucru — se actualizează la același URL la republicare. **Privat implicit**, trebuie partajat din butonul Share |
| Hosting propriu | `design/deploy/` — pachet static, vezi `design/deploy/README.md` | prezentarea oficială — URL cu brandul nostru, fără cont, de pe orice device |

⚠️ **`design/mockup/index.html` este sursa.** `design/deploy/index.html` se GENEREAZĂ
din ea cu `node design/build-standalone.mjs`. După orice modificare a mockup-ului,
rulează scriptul, altfel copia de pe hosting rămâne în urmă.

Nu începe M1 înainte de aprobare. Motivul e contractual: avem **2 runde de revizuiri de
design în Faza 1** (art. 2.12), iar o rundă consumată pe cod construit în direcția greșită
costă mult mai mult decât una consumată pe mockup.

De consemnat la trimitere: data (pornește termenul de 5 zile lucrătoare pentru feedback,
art. 2.8) în `08-DECISIONS.md §D`.

---

## ✅ Ce este gata

### M0 — Analiză, sistem de design, mockup *(finalizat 10.09.2026)*

| Livrabil | Unde |
|---|---|
| Analiza contractului, anexei și ofertei | `docs/00-PROJECT-BRIEF.md` |
| Scope Faza 1, cu criterii de acceptanță | `docs/01-SCOPE-FAZA-1.md` |
| Scope Faza 2, cu cele 4 mecanici | `docs/02-SCOPE-FAZA-2.md` |
| **Sistemul de design NEON SALVAGE** | `docs/03-DESIGN-SYSTEM.md` |
| Tokens gata de folosit în cod | `design/tokens/tokens.css` |
| Arhitectura tehnică + pregătirea Fazei 2 | `docs/04-ARCHITECTURE.md` |
| Roadmap M0–M14 | `docs/05-ROADMAP.md` |
| Registrul de materiale cerute clientei | `docs/07-CLIENT-DELIVERABLES.md` |
| ADR-uri + 12 întrebări deschise + backlog | `docs/08-DECISIONS.md` |
| Modelul de conținut Payload | `docs/09-CONTENT-MODEL.md` |
| Medii, hosting, CI, buget de performanță | `docs/10-DEPLOY-OPS.md` |
| **Mockup dinamic de prezentare** | `design/mockup/index.html` + link publicat |
| Extrase text din PDF-uri | `reference/` |
| Logo-uri + nota de branding | `brand/` |

### Decizii deja luate (nu le relua)

- Sistem de design **NEON SALVAGE**; regula 70–20–10 respectată; rozul e semnal, nu suprafață
- Fonturi: **Bricolage Grotesque** (display) · **Montserrat** (UI) · **Space Mono** (micro) —
  toate OFL, fără costuri de licență
- **CTA roz cu text negru** — singura combinație accesibilă (ADR-007)
- Fără colțuri rotunjite pe structură; colț tăiat prin `clip-path` (ADR-006)
- **Două axe independente**: `data-lum` (luminozitate, alegerea vizitatorului) și
  `data-mode` (identitate editorială, din rută). Trei suprafețe: magazin·lumină,
  magazin·întuneric, atelier (ADR-008, revizuit)
- **Neonul cu `filter: drop-shadow()`**, nu `box-shadow` — `box-shadow` ar fi tăiat de
  `clip-path`-ul colțurilor. La lumină haloul devine umbră colorată, mișcarea rămâne
  identică (ADR-011)
- **Meniu mobil ca modal full-screen** sub 1200px, cu aceeași tăietură diagonală ca
  tranziția de mod (ADR-012)
- Folosim `@payloadcms/plugin-ecommerce`, nu comerț scris de la zero (ADR-002)
- RON se definește ca monedă custom (ADR-003)
- `visitorId` se emite din Faza 1, pentru ca Faza 2 să nu ceară migrare (ADR-009)
- Documentele de proiect stau la rădăcină; aplicația va sta în `app/` (ADR-010)

---

## ⬜ Ce urmează, în ordine

1. **Aprobarea direcției de la clientă** ← blocant pentru tot restul
2. **M1 — scaffold** (`05-ROADMAP.md`, comenzile sunt scrise acolo, gata de copiat)
3. **M2 — fundația de design în cod** (tokens + primitive + `/design-system`)
4. **M3 — modelul de conținut Payload**
5. mai departe conform `05-ROADMAP.md`

---

## 🔵 Blocaje și dependențe de client

| Ce | Blochează | Status |
|---|---|---|
| Aprobarea direcției vizuale | M1 și tot ce urmează | ⬜ mockup de trimis |
| Răspuns la cele 12 întrebări (`08-DECISIONS.md §B`) | M9, M10, M11 | ⬜ de trimis odată cu mockup-ul |
| Structura de categorii / colecții / concepte | M6 | ⬜ |
| Fotografii de produs + descrieri | M7, M11 | ⬜ |
| 🔴 **Macro-foto a materialului-sursă pentru fiecare produs** | efectul „flip to material" + mecanica Before & After | ⬜ **de subliniat explicit în cerere** |
| Texte legale | M11 | ⬜ |
| Conturi curier / facturare / plăți | M9, M10 | ⬜ **de deschis devreme, pot dura** |
| Domeniu + decizia de găzduire | M11 | ⬜ |
| Panorame 360° (spec în `07-CLIENT-DELIVERABLES.md`) | M12 | ⬜ Faza 2 |

> Fiecare solicitare se trimite **în scris, pe email**, se consemnează în
> `07-CLIENT-DELIVERABLES.md`, și pornește termenul de 10 zile lucrătoare (art. 2.6).

---

## 📌 Jurnalul sesiunilor

### Sesiunea 1 — 10.09.2026
Analiza celor trei documente contractuale și a materialului de branding. Repo-ul era gol.
Creată întreaga documentație de proiect (`docs/00`–`10`), sistemul de design NEON SALVAGE
cu fișierul de tokens, și mockup-ul dinamic de prezentare, publicat ca link privat.

Constatări care au schimbat planul:
- **Anexa contrazice oferta pe Faza 2.** Oferta descria un quiz cu întrebări și validare
  de răspunsuri; Anexa (documentul contractual) l-a înlocuit cu un „motor de explorare",
  **fără întrebări și fără răspunsuri corecte sau greșite**. Anexa prevalează.
  Notat în `02-SCOPE-FAZA-2.md`.
- **`@payloadcms/plugin-ecommerce` există oficial la 3.88.0** și acoperă products,
  variants, carts, orders, transactions, addresses + adaptor Stripe. Economisește
  aproximativ o săptămână față de comerț scris de la zero. Verificat direct în pachet.
- **Plugin-ul nu livrează RON** (doar EUR/USD/GBP) → monedă custom, ADR-003.
- **Alb pe roz `#E64593` are doar 3,72:1** — sub pragul AA. De aici decizia de CTA
  roz cu text negru (5,64:1), care e și mai aproape de estetica anilor '90 cerută.
- **Fără produse și fără fotografii momentan** → mockup-ul folosește texturi generate,
  marcate vizibil ca placeholder, iar catalogul se populează la M6–M7.

---

### Sesiunea 2 — 10.09.2026
**Milestone:** M0 (revizuire de mockup, înainte de trimiterea către clientă)

**Făcut:**
- **Sistem de neon complet** — CTA-uri, badge-uri, puncte interactive, cifre de impact și
  bara sliderului primesc halou și mișcare. Cuvântul-cheie din titlul erou se aprinde ca
  un tub de neon la fiecare încărcare.
- **Separarea celor două comutatoare.** Înainte, un singur comutator făcea două treburi:
  schimba și identitatea editorială, și luminozitatea. Acum: comutator dedicat
  *Luminos / Întunecat / Sistem* (funcțional, cu memorie) + comutator *Magazin / Atelier*
  vizibil dar **blocat**, cu lacăt și mesaj „se deschide în faza 2".
- **Meniu mobil**: modal full-screen, hamburger care se transformă în X, intrare cu
  tăietură diagonală, iteme decalate, aprindere de neon la atingere înainte de închidere.
  Focus trap, `Esc`, blocare de scroll.
- **Overlay de căutare** și **dock de contact rapid pe mobil** (cerința C8).
- **CSS rescris mobile-first** — `min-width` peste tot, baza e telefonul.
  Breakpoint de antet complet: 1200px. Sub el, hamburger.

**Decizii luate:** ADR-008 revizuit, ADR-011 și ADR-012 adăugate.
Documentate în `08-DECISIONS.md`; `03-DESIGN-SYSTEM.md §3.3–3.4` și
`design/tokens/tokens.css` sunt aliniate.

**De reținut:** tema întunecată a magazinului folosește `#121014` (cald, ridicat), NU
`#08070A`. Vidul absolut e rezervat atelierului, ca cele două să rămână distincte.

**Următoarea acțiune:** neschimbată — trimite mockup-ul clientei și cere aprobarea scrisă.

### Sesiunea 3 — 10.09.2026
**Milestone:** M0 (a doua revizuire de mockup)

**Făcut:**
- **Glitch de tipar** — răspunsul la „neonul nu se vede pe fundal deschis". Plăcile
  magenta și albă se dezaliniază ~620 ms, cu felii orizontale și explozie de neon pe
  vârfuri. **Roz și alb, nicio culoare nouă** — regula 70–20–10 rămâne intactă.
  Declanșat de intrarea în ecran, încărcare, atingere, schimbarea temei și un puls
  ambiental la ~7 s. **Toate funcționează pe mobil**, niciunul nu depinde de hover.
- **Tub de secțiune** — sub eticheta fiecărei secțiuni se desenează o linie de 2px cu
  punct luminos la capăt. Momentul „luminos" care merge la fel de bine pe alb ca pe negru.
- **Logo complet pe telefon** — wordmark-ul „LIMIRA LAMIRA" lângă semn, la toate
  dimensiunile. Ca să încapă la 360px, iconița de favorite a ieșit din antetul de mobil
  (rămâne în meniu).

**Decizii luate:** ADR-013 (glitch) și ADR-014 (logo complet).
`03-DESIGN-SYSTEM.md §3.5` și `design/tokens/tokens.css` sunt aliniate.

**De discutat cu clienta la revizuire:** varianta de glitch cu placă **cyan**
(misregistration clasic de offset) are mai multă energie de tipar, dar adaugă o a patra
culoare în paletă. Se schimbă un singur token. Decizia îi aparține.

**Verificat vizual:** tema luminoasă, glitch-ul la schimbarea temei, logo-ul complet,
antetul de desktop. **Neverificat pe device real:** layout-ul de mobil și glitch-ul la
scroll — artefactul se randează într-un iframe de lățime fixă, iar scroll-ul și
redimensionarea nu ajung la el. **Deschide link-ul pe telefon înainte de trimitere.**

**Următoarea acțiune:** neschimbată — trimite mockup-ul clientei și cere aprobarea scrisă.

### Sesiunea 4 — 10.09.2026
**Milestone:** M0 (pachet de livrare)

**Făcut:** pachet static gata de urcat pe Vercel sau pe orice hosting, în `design/deploy/`
(`index.html`, `og.png`, `robots.txt`, `vercel.json`, `README.md` cu instrucțiuni).

Generat de `design/build-standalone.mjs`. Scriptul există pentru că
`design/mockup/index.html` e un **fragment** — platforma de artefacte îi adaugă singură
`<!doctype>`, `<head>` și `<body>`. Urcat ca atare pe un hosting normal ar fi rămas
**fără `<meta charset>`** (diacriticele se strică) și **fără `<meta viewport>`**
(telefonul randează versiunea de desktop). Scriptul mută titlul, fonturile și blocul
`<style>` în `<head>` și adaugă meta-urile lipsă, `noindex`, favicon SVG din semnul
logo-ului și cardul de previzualizare.

**Verificat:** build-ul servit local se randează corect, diacriticele sunt intacte,
titlul din tab e corect, structura HTML e validă (câte un singur `<html>`, `<head>`,
`<body>`, `<title>`).

**Încă neverificat pe device real:** layout-ul de mobil. Redimensionarea ferestrei nu
are efect în mediul de testare de aici — am încercat de două ori și m-am oprit.
**De deschis pe telefon după primul deploy.**

**Următoarea acțiune:** neschimbată — trimite mockup-ul clientei și cere aprobarea scrisă.

---

## Format pentru sesiunile următoare

```markdown
### Sesiunea N — DD.MM.AAAA
**Milestone:** M-x
**Făcut:** ...
**Decizii luate:** ... (mută-le și în 08-DECISIONS.md dacă sunt arhitecturale)
**Blocaje:** ...
**Următoarea acțiune:** ...
```
