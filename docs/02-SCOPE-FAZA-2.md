# 02 — Scope Faza 2: Atelierul & sistemul de explorare

**Sursa de adevăr: Anexa nr. 1, secțiunea „FAZA 2 — Atelierul & sistemul de joc".**

> ⚠️ **Diferență importantă între ofertă și Anexă.** Oferta din 03.08.2026 descria un
> sistem cu *întrebări, răspunsuri corecte și validare*. **Anexa (documentul contractual)
> a înlocuit asta cu un „motor de explorare": fără întrebări, fără răspunsuri corecte sau
> greșite, fără validare de răspunsuri.** Anexa prevalează. Nu implementa quiz.

Faza 2 începe doar după **acord scris al părților** și **încasarea tranșei 3 (675 EUR)**.
Dacă beneficiarul nu solicită în scris începerea Fazei 2 în 6 luni de la predarea Fazei 1,
faza se suspendă și se reia pe baza unei oferte actualizate (art. 1.6).

---

## A. Dezvoltare

| # | Cerință | Criteriu de acceptanță |
|---|---|---|
| A1 | **Tur 360° cu 6–10 poziții legate între ele**, cu rotire la atingere și, pe mobil, prin mișcarea aparatului | Navigare între scene fără reload; giroscop pe mobil cu fallback la drag; preîncărcarea scenei următoare |
| A2 | **Până la 40 de puncte interactive** | Plafonul de 40 este contractual. Depășirea = dezvoltare suplimentară |
| A3 | Obiectele marcate **deschid fișa produsului direct în scenă**, cu adăugare în coș **fără ieșirea din atelier** | Panou de produs peste scenă, cu variante și adăugare în coș; scena rămâne activă în spate |
| A4 | **Panou de administrare a scenelor, a punctelor interactive și a conținutului acestora, în același CMS** | Editor vizual de poziționare a hotspot-urilor pe panoramă (yaw/pitch), nu introducere manuală de coordonate |
| A5 | **Motorul de explorare**: puncte descoperite / nedescoperite, progres salvat automat, colecții completate, deblocarea recompensei la atingerea condițiilor stabilite din panou | Progres persistent pentru vizitator anonim (device) și sincronizat la autentificare; condițiile de deblocare configurabile din CMS |
| A6 | **Sistem de recompense cu coduri unice, limitate în timp, folosibile la comandă** | Cod unic per utilizator, cu valabilitate și condiții din panou; aplicabil la checkout ca și cuponul |
| A7 | **Integrare completă cu contul de client și cu coșul — coșul este comun cu magazinul** | Un singur coș, aceeași stare în ambele moduri |
| A8 | **Temă vizuală dedicată (negru și neon)**; optimizare pentru mobil și încărcare rapidă | Modul atelier folosește tema `atelier` din sistemul de design; buget de performanță respectat (vezi `10-DEPLOY-OPS.md`) |
| A9 | **Comutator permanent între magazin și atelier, disponibil în meniu** | Prezent în ambele moduri, pe toate paginile |

## B. Conținut și producție

| # | Cerință | Note |
|---|---|---|
| B1 | Procesarea și optimizarea panoramelor puse la dispoziție de beneficiar | Tiling multi-rezoluție, AVIF/WebP, preload progresiv |
| B2 | Maparea punctelor interactive pe produse | |
| B3 | Configurarea primului traseu de explorare, a punctelor și a conținutului aferent | |
| B4 | **Sesiunea de fotografiere 360° NU este inclusă** (art. 2.10, 2.11) | Se realizează de beneficiar. Trimite-i specificația tehnică înainte — vezi `07-CLIENT-DELIVERABLES.md` |

> **Art. 2.11 — clauză de siguranță:** dacă materialul primit nu permite construirea turului
> în parametrii din Anexă (număr de poziții, acoperire, rezoluție, continuitate între scene),
> părțile convin în scris fie refacerea materialului, fie ajustarea scopului și a prețului.
> Termenele noastre se suspendă pe durata procesului.

---

## C. Cele 4 mecanici incluse (și numai acestea)

### 1. „Ce poți face din...?" — Before & After
Utilizatorul mută un slider și vede transformarea materialului-sursă în piesa finită
(blug vechi → geantă; sacou vechi → haină nouă).
**Date din CMS:** perechi de imagini before/after + etichete.
**Implementare:** comparator cu slider, drag + tastatură, lazy per pereche.

### 2. „Găsește arta"
Fragmente și referințe artistice ascunse în diferite puncte ale atelierului. Prin
interacțiune, utilizatorul află opera, artistul și o informație sau poveste scurtă.
**Nu trebuie să ghicească și nu există răspuns corect sau greșit.**
**Date din CMS:** operă, artist, text scurt, imagine.

### 3. „Ce nu vezi pe etichetă"
Zonă educativă sub forma unei serii de mini-povești, cu titluri care provoacă
curiozitatea. Utilizatorul alege ce îl interesează și deschide informația, **fără chestionare**.
**Date din CMS:** titlu-cârlig, corp de text, media opțională.

### 4. „Atinge materialul"
Puncte interactive dedicate materialelor și texturilor: utilizatorul deschide o mostră
sau un obiect și descoperă vizual textura, proveniența, caracteristicile și
posibilitățile de reutilizare.
**Date din CMS:** material, macro-foto textură, proveniență, caracteristici, reutilizări.

### Motorul transversal — „Surpriza te așteaptă"
Sistemul de recompense funcționează **peste toate cele patru mecanici** și
**nu se numără ca mecanică distinctă**. Recompensa, codul, valabilitatea și condițiile
de acordare se administrează din panou.

---

## D. Incluse ca panouri / puncte interactive (fără cost adițional, în plafonul de 40)

Acestea **nu** sunt mecanici suplimentare — sunt tipuri de conținut afișate în punctele existente:

- **„Hai în backstage"** — procesul creativ: idee, schiță, alegerea materialului, croi,
  lucru manual, detalii, piesa finală. Fotografii și secvențe scurte puse la dispoziție de beneficiar.
- **„Joaca culorilor"** — experiență vizuală de combinare și descoperire a culorilor, pe o
  paletă și combinații predefinite, administrabile din CMS.
  **Nu este configurator de produs și nu este legat de stoc.**
- **„Secrete din Art Studio"** — puncte de explorare cu obiecte, tehnici, materiale, detalii
  și povești din atelier.

---

## E. Administrabil din panou, fără intervenție de programare (cerință contractuală)

- textele, imaginile, titlurile și descrierile punctelor interactive
- indiciile și informațiile afișate
- **poziționarea punctelor interactive pe scene**
- activarea / dezactivarea punctelor interactive și a scenelor
- conținutul mini-poveștilor din „Ce nu vezi pe etichetă"
- perechile de imagini Before & After
- recompensele, codurile, valabilitatea și condițiile de acordare

## F. Necesită dezvoltare suplimentară, cotată separat (art. 2.2)

- adăugarea de mecanici sau tipuri de joc noi față de cele patru incluse
- modificarea logicii sau a interfeței unei mecanici deja livrate
- adăugarea de scene 360° peste numărul contractat (6–10)
- depășirea plafonului de **40 de puncte interactive**

## G. Explicit ÎN AFARA anexei — se cotează la momentul dezvoltării

Concepte prezentate în ofertă sau discutate, dar **neincluse**:
Construiește-ți / Croiește-ți geanta · Cât salvezi planeta? · Descoperă povestea produsului ·
Îl găsești pe Van Gogh? · Colecționarul · Roata atelierului · Sezoane · Cheia dublă ·
Licitația piesei unicat · Ce piesă ești? · Ce a fost înainte?

Estimările orientative din ofertă (250–800 EUR fiecare) **nu sunt prețuri ferme**.

---

## H. Responsabilitatea conținutului (art. 2.5, 2.6, 2.9)

Conținutul mini-poveștilor din „Ce nu vezi pe etichetă", **inclusiv datele și afirmațiile
privind impactul de mediu**, conținutul și referințele artistice din „Găsește arta",
informațiile despre materiale din „Atinge materialul" și perechile de imagini pentru
„Ce poți face din...?" **se pun la dispoziție de beneficiar**.

> Executantul implementează mecanica și interfața. **Nu determină și nu validează**
> datele de mediu, informațiile despre materiale și referințele artistice afișate.

Aceasta e o clauză de protecție reală (greenwashing, drepturi de autor pe referințe
artistice). Nu completa singur astfel de date, nici măcar ca placeholder plauzibil —
folosește `[[CONȚINUT CLIENT]]`.
