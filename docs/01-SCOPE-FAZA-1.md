# 01 — Scope Faza 1: Magazinul online

**Sursa de adevăr: Anexa nr. 1, secțiunea „FAZA 1 — Magazinul online".**
Fiecare rând de mai jos este contractat. Nimic în plus fără act adițional (art. 2.2).

Legendă status: ⬜ neînceput · 🟨 în lucru · ✅ gata · 🔵 blocat de client
Statusul viu se ține în `06-STATE.md`; tabelul de aici este specificația.

---

## A. Design și experiență de utilizare

| # | Cerință | Criteriu de acceptanță |
|---|---|---|
| A1 | Identitate vizuală construită pe brandul beneficiarului (roz neon, negru, alb), **fără adaptare de template** | Sistem de design propriu documentat în `03-DESIGN-SYSTEM.md`; niciun theme comercial în dependențe |
| A2 | **Două teme vizuale, o singură identitate**: mod magazin (luminos, editorial) și mod atelier (întunecat, neon) | Ambele moduri derivă din același set de tokens; comutare fără reîncărcare de pagină, fără FOUC. Comutatorul magazin/atelier e livrat din Faza 1, cu atelierul blocat până la Faza 2 |
| A2b | **Comutator de temă Luminos / Întunecat / Sistem** pentru magazin — *adăugire față de Anexă, inclusă fără cost* | Axă independentă de modul editorial (ADR-008); preferința se ține minte; `system` urmărește setarea dispozitivului |
| A5 | **Meniu mobil ca modal pe tot ecranul** sub 1200px, cu hamburger animat și feedback per acțiune | Focus trap, `Esc` închide, blocare de scroll, ținte ≥44px; conține navigația, ambele comutatoare, contul, contactul rapid și limba |
| A3 | Structurarea informației pe baza comportamentului de cumpărare; parcurs clar de la prima pagină la finalizarea comenzii | Flux testat: Home → Categorie → PDP → Coș → Checkout în maximum 5 pași, fără fundături |
| A4 | Abordare mobile-first; testare pe mobil, tabletă, laptop, desktop | Breakpoints 390 / 768 / 1024 / 1440 / 1920 verificate; test real pe un device Android și unul iOS |

## B. Structura și funcționalitățile magazinului

| # | Cerință | Criteriu de acceptanță |
|---|---|---|
| B1 | **Pagina principală**: slider și bannere dinamice, secțiuni de categorii, carusel de produse, prezentare atelier, testimoniale, zonă dedicată artei reciclate | Toate cele 6 zone există și sunt editabile din CMS ca blocuri reordonabile |
| B2 | **Antet sticky**: logo, meniu, categorii, iconuri de cont, favorite, căutare și coș | Header rămâne accesibil la scroll; badge numeric pe coș și favorite; comutator magazin/atelier prezent în meniu (pregătit din Faza 1) |
| B3 | **Categorii / catalog**: structură distinctă pentru **produse în stoc**, **concepte** și **colecții**, cu categorii și subcategorii | Trei tipuri de listare distincte, nu doar filtre pe aceeași grilă; categorii ierarhice (nested) administrabile |
| B4 | **Pagina produsului**: galerie foto, descriere scurtă și completă, stoc, variante (mărime, culoare, material), preț și preț redus, adăugare în coș, favorite, comparare, recenzii cu rating | Selectarea variantei actualizează preț/stoc/galerie fără reload; stoc real afișat; rating agregat |
| B5 | **Secțiunea de artă reciclată**: prezentare de tip galerie pentru piesele unicat, cu spațiu pentru poveste, proces și material | Layout de galerie (nu grilă de shop); fiecare piesă are câmpuri poveste / proces / material; piesele unicat se marchează „vândut" fără să dispară |
| B6 | **Căutare** | Acces rapid la produse și categorii; funcțional cu și fără diacritice; sugestii instant |
| B7 | **Filtrare**: preț, categorie, mărime, culoare, material și alte atribute | Filtre combinabile, reflectate în URL (shareable, back-button funcțional), cu contorizare rezultate |
| B8 | **Produse similare / recomandate** | Pe PDP și în coș, pe bază de categorie/atribute |
| B9 | **Pagina oferte** | Listează produsele în promoție în perioada setată din CMS |
| B10 | **Pagina despre / atelier** | Povestea din spatele brandului: valorile, materialul, procesul. Conținut editabil pe blocuri |
| B11 | **Pagina de contact** cu formular, hartă și butoane rapide | Formular validat + anti-spam; hartă; butoane WhatsApp / telefon / email; date de companie |
| B12 | **Sistem de blog** pentru conținut și SEO | Categorii, autor, imagine, conținut rich text, SEO per articol, feed |
| B13 | **Sistem de colectare și gestionare a feedback-ului** de la clienți | Colectare + listare + moderare în panou |
| B14 | **Contul meu**: urmărirea comenzilor, editarea datelor de facturare și livrare, descărcarea facturii | Autentificare; istoric comenzi cu status; adrese salvate; link de descărcare factură |
| B15 | **Coș și finalizare comandă**: actualizare cantități, cupoane, checkout rapid, plată online cu cardul, favorite și comparare | Coș persistent (guest + logat, cu merge la login); cupon validat server-side; checkout în maximum 3 ecrane; plata cu cardul funcțională end-to-end |
| B16 | **Bilingv RO + EN**, SEO friendly, structură dedicată `/en` | RO fără prefix, EN pe `/en`; `hreflang` corect; conținut localizat în Payload. **Traducerea textelor NU este inclusă** — livrăm structura, clienta livrează textul EN |

## C. Module administrative

| # | Cerință | Criteriu de acceptanță |
|---|---|---|
| C1 | Administrare comenzi | Listă, filtrare pe status, detaliu, schimbare status, note interne |
| C2 | Administrare produse | CRUD produse + variante + stoc + prețuri + media |
| C3 | Rapoarte de comenzi și vânzări | Vedere agregată: comenzi/perioadă, valoare, produse de top, export CSV |
| C4 | Editare conținut | Pagini pe blocuri, meniuri, bannere, texte globale — fără programator |
| C5 | **Coș abandonat cu email reminder automat** | Job programat; email după N ore; link de recuperare a coșului; N configurabil din panou |
| C6 | Discount-uri și cupoane | Procent / sumă fixă / prag minim / interval de valabilitate / limită de utilizări |
| C7 | Cross-sell și up-sell | Configurabile per produs și per categorie |
| C8 | Butoane de contact rapid (WhatsApp, telefon, email) | Prezente pe mobil ca acțiune persistentă, configurabile din panou |
| C9 | Notificări email pentru administrator și client | Comandă nouă, confirmare, schimbare status, resetare parolă — șabloane editabile |
| C10 | Popup / header banner pentru promoții | Programabil pe interval, cu frecvență de afișare, dismissabil |
| C11 | **Import și optimizare a până la 150 de produse, incluse în tarif** | Flux de import CSV/Excel + optimizare imagini. Peste 150 → cotare separată |

## D. Integrări

| # | Cerință | Note |
|---|---|---|
| D1 | **API curier — generare automată AWB** | Furnizor de ales cu clienta (Sameday / FAN Courier / Cargus / DPD). Cont pe numele clientei (art. 2.13) |
| D2 | **API facturare** | SmartBill / Oblio / FGO. Cont pe numele clientei |
| D3 | **Procesator de plăți online** | Stripe (adaptor oficial în plugin) sau Netopia / EuPlătesc (necesită adaptor custom — vezi `08-DECISIONS.md`, ADR-004) |
| D4 | Google Analytics (GA4) | Consent-gated |
| D5 | Meta Pixel | Consent-gated |
| D6 | Newsletter — MailChimp / ActiveCampaign / Klaviyo | Unul singur, la alegerea clientei |
| D7 | Chat / WhatsApp | Widget sau deep-link |
| D8 | Social media | Linkuri + Open Graph + eventual feed |

> Executantul realizează **exclusiv integrarea tehnică**, în limitele API-urilor puse la
> dispoziție de furnizori, și nu răspunde de disponibilitatea sau politicile acestora
> (art. 2.13, art. 5.2).

## E. Securitate și optimizare

| # | Cerință | Criteriu de acceptanță |
|---|---|---|
| E1 | Securitate la nivel de infrastructură și aplicație | HTTPS/HSTS, CSP, rate limiting pe formulare și login, secrete în env, dependențe fără vulnerabilități critice |
| E2 | Sitemap | `sitemap.xml` dinamic + `robots.txt`, ambele localizate |
| E3 | Optimizare SEO de bază | Titluri/descrieri per pagină din CMS, date structurate Product / Article / Organization / BreadcrumbList, canonical, hreflang |
| E4 | Optimizare foto/video pentru web | AVIF/WebP, dimensiuni responsive, lazy loading, poster pentru video |
| E5 | **Pagini legale implementate**: Termeni și condiții, Politica de confidențialitate, Politica cookie, Politica de livrare și retur, GDPR Consent | Paginile există, sunt legate în footer și în checkout, cu banner de consimțământ funcțional (blochează scripturile până la accept). **Conținutul juridic vine de la beneficiar** |

---

## Ce NU este în Faza 1

Turul 360°, mecanicile de joc, sistemul de recompense — toate sunt Faza 2.
În Faza 1 pregătim doar **cârligele**: comutatorul de mod în meniu, tokens pentru tema
atelier, structura de rute și modelul de date extensibil.
Vezi `04-ARCHITECTURE.md` § „Pregătirea pentru Faza 2".
