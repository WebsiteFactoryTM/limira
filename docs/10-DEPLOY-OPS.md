# 10 — Medii, găzduire, CI/CD, performanță

> **Găzduirea nu e inclusă în preț** (art. 4.3) și rămâne în sarcina directă a clientei,
> împreună cu domeniul, certificatele și abonamentele serviciilor terțe. Rolul nostru:
> recomandăm, configurăm, predăm accesele.

## 1. Medii

| Mediu | Rol | Bază de date | Media |
|---|---|---|---|
| **local** | dezvoltare | Postgres 16 în Docker | disc local |
| **preview** | fiecare PR / livrabil trimis clientei spre feedback | Postgres de preview | bucket de preview |
| **producție** | site-ul public | Postgres managed cu backup | S3-compatibil + CDN |

Livrabilele intermediare se trimit clientei **ca link de preview**, nu ca screenshot —
așa poate testa pe telefonul ei. Fiecare link trimis pornește termenul de 5 zile
lucrătoare pentru feedback (art. 2.8) → consemnează data în `08-DECISIONS.md §D`.

## 2. Găzduire — două variante de recomandat clientei

### Varianta A — Vercel + Neon + Cloudflare R2 *(recomandată)*
- **Vercel Pro** ~20 $/lună · **Neon** Launch ~19 $/lună · **R2** ~1–5 $/lună · domeniu ~15 €/an
- **Total ≈ 40–45 $/lună.**
- Avantaje: deploy automat din Git, preview per PR, CDN global, zero administrare de server,
  ISR și imaginile funcționează nativ.
- Dezavantaje: cost recurent mai mare; atenție la funcțiile cu durată lungă (procesarea
  panoramelor din Faza 2 se face **offline, la build/upload**, nu la request).

### Varianta B — VPS + Docker + Coolify/Dokploy
- VPS 4 vCPU / 8 GB (Hetzner ~15 €/lună) cu Next + Postgres + MinIO, Cloudflare în față.
- **Total ≈ 15–20 €/lună.**
- Avantaje: cost mic, control total, date în UE, fără limite de funcții.
- Dezavantaje: administrare, actualizări, backup și monitorizare **în sarcina cuiva** —
  iar mentenanța inclusă acoperă aplicația, nu administrarea de server.

> **Recomandarea noastră:** varianta A. Diferența de ~25 $/lună e mai mică decât costul
> unei singure intervenții pe un server căzut, iar clienta nu are echipă tehnică.
> 🔵 Decizia îi aparține — întrebarea 6 din `08-DECISIONS.md §B`.

## 3. Variabile de mediu

```bash
# --- Core ---
DATABASE_URI=postgres://...
PAYLOAD_SECRET=                     # 32+ caractere aleatoare
NEXT_PUBLIC_SERVER_URL=https://...
CRON_SECRET=                        # protejează /api/cron/*

# --- Media (producție) ---
S3_BUCKET= S3_REGION= S3_ENDPOINT= S3_ACCESS_KEY_ID= S3_SECRET_ACCESS_KEY=

# --- Plăți ---
STRIPE_SECRET_KEY= STRIPE_WEBHOOK_SECRET= NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
# sau: NETOPIA_SIGNATURE= NETOPIA_PUBLIC_KEY= NETOPIA_PRIVATE_KEY=

# --- Curier / facturare / newsletter ---
COURIER_PROVIDER= COURIER_USER= COURIER_PASS=
INVOICING_PROVIDER= INVOICING_TOKEN= INVOICING_CIF=
NEWSLETTER_PROVIDER= NEWSLETTER_API_KEY= NEWSLETTER_LIST_ID=

# --- Email transacțional ---
SMTP_HOST= SMTP_PORT= SMTP_USER= SMTP_PASS= EMAIL_FROM=

# --- Analytics (consent-gated) ---
NEXT_PUBLIC_GA_ID= NEXT_PUBLIC_META_PIXEL_ID=
```

**Regulă:** fiecare integrare are **mod mock** activ când lipsește cheia. Dezvoltarea nu
se blochează așteptând conturile clientei (care depind de art. 2.6).
Secretele nu ajung niciodată în Git, în CMS sau în capturi trimise clientei.

## 4. CI/CD

Pe fiecare PR: `typecheck` → `lint` → `test:unit` → `build` → `test:e2e` (smoke) →
`lighthouse-ci` → deploy preview.
Pe `main`: deploy în producție + migrări Payload + `revalidate` global.

- **Migrările Payload/Drizzle se commit-uiesc** și rulează controlat, niciodată `push` automat pe producție.
- `pnpm audit` săptămânal; Renovate pe minor + patch, manual pe major (Payload și Next se
  actualizează împreună, ca pereche).

## 5. Buget de performanță — condiție de acceptanță, nu recomandare

Măsurat pe **Moto G Power, 4G simulat, Lighthouse CI**, pe Home, Categorie și PDP:

| Metrică | Prag | Blochează CI |
|---|---|---|
| LCP | ≤ 2,0 s | ✅ |
| CLS | ≤ 0,05 | ✅ |
| INP | ≤ 200 ms | ✅ |
| JS la prima încărcare (gzip) | ≤ 180 KB | ✅ |
| Greutate totală Home | ≤ 1,2 MB | ⚠️ avertizare |
| Lighthouse Performance | ≥ 90 | ✅ |
| Lighthouse Accessibility | ≥ 95 | ✅ |
| Lighthouse SEO | ≥ 95 | ✅ |

**Faza 2 — praguri separate pentru `/atelier`** (conținut panoramic, inevitabil mai greu):
prima scenă interactivă ≤ **3,0 s** pe 4G · fiecare panoramă ≤ **600 KB** după tiling și
conversie AVIF · scena următoare preîncărcată în fundal · fără jank la rotire (60fps pe
device de referință).

> Argumentul din ofertă e explicit: *„cine așteaptă trei secunde nu mai cumpără, iar
> Google observă asta."* Bugetul e felul în care ne ținem de promisiune.

## 6. Monitorizare și backup

- **Uptime**: verificare la 5 minute pe `/` și `/api/health`, alertă pe email + WhatsApp.
- **Erori**: Sentry (plan gratuit e suficient la volumul acesta), cu source maps.
- **Analytics**: GA4 consent-gated + Vercel Analytics (fără cookie-uri) pentru Core Web Vitals reale.
- **Backup BD**: zilnic, retenție 30 de zile, **cu un test de restaurare făcut măcar o dată**
  înainte de lansare. Un backup netestat nu e un backup.
- **Backup media**: versionare pe bucket sau replicare.
- **Alertă de business**: nicio comandă în 24h → notificare (prinde checkout-ul stricat
  mai repede decât reclamația unui client).

## 7. Lansare — checklist

- [ ] DNS + SSL + `www` → apex, redirect canonic
- [ ] `robots.txt` permite indexarea (verifică să nu rămână `Disallow: /` din preview)
- [ ] `sitemap.xml` trimis în Google Search Console (ambele limbi)
- [ ] Comandă reală de test, cu plată reală de valoare mică, apoi refund
- [ ] AWB de test generat și anulat
- [ ] Factură de test emisă și stornată
- [ ] Toate email-urile tranzacționale primite și verificate (inclusiv în Spam)
- [ ] Banner GDPR blochează efectiv GA4 și Pixel până la accept
- [ ] Paginile legale publicate, cu conținutul primit de la clientă
- [ ] 404 și 500 personalizate, în vocea brandului
- [ ] Redirecturi de la URL-urile vechi, dacă există site anterior
- [ ] Backup făcut **și restaurat de test**
- [ ] Instruire pe panou + manual de utilizare predat
- [ ] Capturi pentru portofoliu trimise clientei spre aprobare (art. 7)
- [ ] **Factura tranșei 2 emisă** (termen de plată: 5 zile calendaristice)

## 8. Predarea codului (art. 3.7)

La achitarea integrală, în **10 zile lucrătoare**, predăm:
codul-sursă complet · structura și conținutul bazei de date · fișierele grafice și
editabile create pentru proiect · documentația tehnică și manualul panoului ·
accesul de administrator · export complet al repository-ului · cheile, parolele și
conturile care aparțin clientei.

**Nu se predau:** infrastructura internă, instrumentele de lucru, bibliotecile
reutilizabile preexistente (art. 2.3), componentele open-source și serviciile terțe
(rămân sub licențele proprii).
