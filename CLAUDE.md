# LIMIRA LAMIRA — Magazin online & Atelier imersiv

> **Fișier de context principal. Citește-l integral la începutul fiecărei sesiuni,
> apoi treci imediat la `docs/06-STATE.md` pentru a afla unde s-a rămas.**

---

## 1. Ce este proiectul

Magazin online + experiență imersivă pentru **LIMIRA LAMIRA Art Studio** (Timișoara) —
studio de modă și artă din materiale reciclate. Client: **REUTIL NATUR SRL**
(dna. Fran Limira). Executant: **SC PIXEL FACTORY SRL** / Website Factory.

Contract nr. 113 / 26.08.2026 + Anexa nr. 1 (Anexa este documentul principal de scope).
Sursele PDF sunt în `C:\PIXEL-FACTORY\limira\`; extrasele text în `reference/`
(atenție: diacriticele s-au pierdut la extracție — **PDF-ul rămâne sursa de adevăr**).

Proiectul are **două faze contractate**:

| Fază | Conținut | Durată | Preț |
|---|---|---|---|
| **Faza 1** | Magazinul online complet | 5–6 săpt. | 1.850 EUR |
| **Faza 2** | Atelierul 360° + motor de explorare + 4 mecanici + recompense | 3–4 săpt. | 1.350 EUR |
| | **TOTAL (fără TVA, executant neplătitor)** | 8–10 săpt. | **3.200 EUR** |

Magazinul se poate lansa înaintea atelierului. Faza 2 începe doar după acord scris + tranșa 3.

---

## 2. Ideea centrală de produs (nu o pierde din vedere)

> *„Un magazin online care nu arată ca un magazin online."*

Provocarea nu e tehnică, e **de curatoriere**: cum ții laolaltă un obiect care se
cumpără repede (geantă, haină) și o piesă de artă care se privește întâi și se
cumpără după. Răspunsul contractat: **două moduri de vizitare, un singur brand,
aceeași identitate vizuală**.

- **MOD MAGAZIN** — luminos, editorial, parcurs rapid de cumpărare.
- **MOD ATELIER** — întunecat, neon, explorare și descoperire (Faza 2).
- **Coșul și contul sunt comune.** Ce adaugi în atelier găsești în magazin, și invers.
- Comutatorul între moduri este **permanent disponibil în meniu**.

Faza 1 trebuie construită astfel încât Faza 2 să se **adauge**, nu să impună rescriere.
Vezi `docs/04-ARCHITECTURE.md` §"Pregătirea pentru Faza 2".

---

## 3. Branding — reguli obligatorii

```
Roz LIMIRA LAMIRA   #E64593   ← culoare-semnătură, folosită ca ACCENT
Negru               #000000
Alb                 #FFFFFF
```

**Regula cromatică 70–20–10 este cerință explicită a clientei:**
70% negru · 20% alb · 10% roz. Rozul **nu** devine dominant.
Semnificația declarată: optimism, „viața poate fi roz dacă alegi să o privești așa".

Identitatea vizuală e inspirată de **energia și estetica anilor '90** — contraste
puternice, accente neon, libertate de expresie, combinații îndrăznețe — **reinterpretate
într-o estetică actuală și curată**. Aceeași direcție se regăsește în amenajarea fizică
a studioului: online-ul și spațiul fizic trebuie să vorbească aceeași limbă.

Sistemul complet de design (tokens, tipografie, mișcare, componente) este în
**`docs/03-DESIGN-SYSTEM.md`**. Nu improviza culori sau fonturi în afara lui.

Logo-uri: `brand/logo/`. Logo-ul e un pătrat deschis cu o formă croită/pliată în
interior — motivul „cut & fold" derivat din el este element de design recurent.

---

## 4. Stack tehnologic (contractat, nu negociabil)

- **Next.js 16 (App Router) + React 19 + TypeScript strict**
- **Payload CMS 3.88** (în același proiect Next, nu separat)
- **PostgreSQL** (`@payloadcms/db-postgres`)
- **`@payloadcms/plugin-ecommerce`** — products, variants, carts, orders, transactions, addresses + adaptor Stripe
- **Tailwind CSS 4** (config CSS-first) + tokens proprii
- **next-intl 4** — RO implicit fără prefix, EN pe `/en`
- **Motion (framer-motion) 13 + GSAP/ScrollTrigger + Lenis** pentru mișcare
- pnpm, Node 24

Găzduirea NU este inclusă în preț (art. 4.3) — rămâne în sarcina clientei.

---

## 5. Reguli de lucru în acest repo

1. **`docs/06-STATE.md` este singura sursă de adevăr despre progres.**
   Îl actualizezi la finalul fiecărei sesiuni de lucru, înainte de a raporta.
2. **Nu extinde scope-ul.** Orice funcționalitate care nu e în `docs/01-SCOPE-FAZA-1.md`
   sau `docs/02-SCOPE-FAZA-2.md` este activitate suplimentară facturabilă (art. 2.2).
   Dacă apare o idee bună în afara scope-ului: notează-o în `docs/08-DECISIONS.md`
   la secțiunea „Backlog post-lansare", nu o implementa.
3. **Nu inventa conținut de client.** Textele legale, descrierile de produs, poveștile,
   informațiile despre materiale și referințele artistice vin de la client (art. 2.5).
   Unde lipsesc, folosește placeholder marcat vizibil `[[CONȚINUT CLIENT]]` și
   adaugă rândul în `docs/07-CLIENT-DELIVERABLES.md`.
4. **Mobile-first, mereu.** Majoritatea vizitatorilor vin de pe telefon (asumat în ofertă).
5. **Bugetul de performanță e o cerință de business**, nu un moft — vezi
   `docs/10-DEPLOY-OPS.md` §"Performance budget". Orice efect de mișcare trebuie să
   treacă testul: degradează grațios la `prefers-reduced-motion` și pe mobil low-end.
6. **RO este limba implicită** a interfeței, a CMS-ului și a denumirilor de câmpuri.
   Clienta trebuie să vadă în panou câmpuri denumite în limba în care vorbește despre
   munca ei (promisiune explicită din ofertă).
7. **Revizuiri limitate**: 2 runde de design pe livrabil în Faza 1, 3 în Faza 2 (art. 2.12).
   Ține evidența rundelor în `docs/06-STATE.md`.

---

## 6. Hartă de documente

| Fișier | Ce conține |
|---|---|
| `docs/00-PROJECT-BRIEF.md` | Rezumat comercial, părți, termene, plăți, riscuri |
| `docs/01-SCOPE-FAZA-1.md` | Scope Faza 1, funcție cu funcție, cu criterii de acceptanță |
| `docs/02-SCOPE-FAZA-2.md` | Scope Faza 2: tur 360°, cele 4 mecanici, recompense |
| `docs/03-DESIGN-SYSTEM.md` | **Sistemul de design „NEON SALVAGE"** — tokens, tipografie, mișcare, componente |
| `docs/04-ARCHITECTURE.md` | Stack, structură de foldere, rutare, i18n, integrări, pregătire Faza 2 |
| `docs/05-ROADMAP.md` | Milestones M0–M14 cu task-uri concrete și definiție de „gata" |
| `docs/06-STATE.md` | **⭐ UNDE AM RĂMAS / CE URMEAZĂ** |
| `docs/07-CLIENT-DELIVERABLES.md` | Ce trebuie cerut clientei, în ce ordine, cu termenele din contract |
| `docs/08-DECISIONS.md` | ADR-uri, întrebări deschise pentru clientă, backlog post-lansare |
| `docs/09-CONTENT-MODEL.md` | Specificația colecțiilor Payload, câmp cu câmp |
| `docs/10-DEPLOY-OPS.md` | Medii, hosting, CI/CD, backup, monitorizare, buget de performanță |
| `design/mockup/index.html` | **Mockup-ul dinamic de prezentare pentru clientă** |

---

## 7. Prima comandă într-o sesiune nouă

```
1. cat CLAUDE.md
2. cat docs/06-STATE.md          ← ce s-a făcut, ce urmează, blocaje
3. cat docs/05-ROADMAP.md        ← contextul milestone-ului curent
4. (dacă atingi UI) cat docs/03-DESIGN-SYSTEM.md
```
