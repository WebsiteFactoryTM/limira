# Mockup Limira Lamira — pachet gata de deploy

Site static, 4 fișiere, fără build. Se urcă oriunde.

| Fișier | Ce e |
|---|---|
| `index.html` | mockup-ul complet, de sine stătător (~100 KB) |
| `og.png` | imaginea de previzualizare la partajare (WhatsApp, email, Slack) |
| `robots.txt` | interzice indexarea — e material de lucru, nu conținut public |
| `vercel.json` | antete: `noindex`, securitate, `no-cache` pe HTML |

> ⚠️ **Nu edita `index.html` de aici.** Este generat.
> Sursa e `design/mockup/index.html`; vezi „Actualizări" mai jos.

Singura resursă externă sunt fonturile Google. Restul — CSS, JS, imagini — e în fișier.
Merge și deschis local, prin dublu-click.

---

## Varianta 1 — Vercel CLI *(cea mai rapidă, ~2 minute)*

```bash
npm i -g vercel
cd design/deploy
vercel login
vercel --prod
```

La prima rulare te întreabă câteva lucruri:

| Întrebare | Răspuns |
|---|---|
| Set up and deploy? | **Y** |
| Which scope? | contul/echipa ta |
| Link to existing project? | **N** |
| Project name? | `limira-mockup` |
| In which directory is your code located? | `./` |
| Want to modify settings? | **N** |

Primești un URL de forma `https://limira-mockup.vercel.app`. Gata.

## Varianta 2 — Vercel din Git *(dacă vrei redeploy automat)*

Urci repo-ul pe GitHub, apoi în Vercel → **Add New → Project → Import**:

- **Framework Preset:** `Other`
- **Root Directory:** `design/deploy`
- **Build Command:** lasă gol
- **Output Directory:** lasă gol

De aici, orice push care atinge `design/deploy/` redeployează singur.

## Varianta 3 — orice alt hosting

Cele 4 fișiere merg identic pe Cloudflare Pages, Netlify, sau pe hostingul tău prin FTP.
Nu au nevoie de Node, de build, de nimic.

---

## Domeniu propriu

În Vercel: **Project → Settings → Domains → Add**, de exemplu
`limira.websitefactory.ro`. Vercel îți dă înregistrarea CNAME de adăugat în DNS.
Certificatul SSL se emite automat.

Un subdomeniu al tău arată mai bine decât `*.vercel.app` într-un email către client.

## După primul deploy — completează previzualizarea

Fără URL-ul final, `og:image` rămâne necompletat și link-ul apare fără imagine când e
trimis pe WhatsApp. Rulează încă o dată, cu URL-ul real, și redeployează:

```bash
MOCKUP_URL=https://limira.websitefactory.ro node design/build-standalone.mjs
cd design/deploy && vercel --prod
```

Pe Windows / PowerShell:
```powershell
$env:MOCKUP_URL="https://limira.websitefactory.ro"; node design/build-standalone.mjs
```

---

## Actualizări

Sursa e **`design/mockup/index.html`**. După orice modificare acolo:

```bash
node design/build-standalone.mjs   # regenerează design/deploy/index.html
cd design/deploy && vercel --prod  # redeployează
```

Antetele din `vercel.json` pun `no-cache` pe HTML, deci clienta vede versiunea nouă la
un simplu refresh — nu rămâne blocată pe cea veche.

## Dacă vrei link-ul protejat cu parolă

Vercel are **Deployment Protection** (Settings → Deployment Protection → Password),
disponibilă pe planurile plătite. Pe planul gratuit, protecția practică e combinația
`noindex` + un URL pe care nu-l știe nimeni altcineva — suficient pentru un mockup de
prezentare.

---

## De reținut

Acesta e **doar mockup-ul de direcție vizuală**. Magazinul propriu-zis (Next.js +
Payload + PostgreSQL) este un proiect separat, cu alt deploy și alte cerințe de
infrastructură — vezi `docs/10-DEPLOY-OPS.md`.
