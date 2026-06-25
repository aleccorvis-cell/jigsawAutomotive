# Jigsaw Automotive Group — B2B Unternehmenswebsite
**Minimalistische, moderne & datenschutzkonforme Landingpage für die Automobilbranche**

Willkommen im Quellcode-Repository der **Jigsaw Automotive Group**. Diese Website wurde nach modernsten Standards für Webdesign, Performance, SEO (einschließlich GEO/AI-Readiness) und Barrierefreiheit entwickelt. Sie enthält eine vollständig funktionsfähige statische Frontend-Demo mit einem integrierten Client-side CMS (Admin-Dashboard).

---

## Inhaltsverzeichnis
1. [Projektstruktur](#1-projektstruktur)
2. [Installations- & Startanleitung](#2-installations---startanleitung)
3. [GitHub Pages Deployment](#3-github-pages-deployment)
4. [Das Git-basierte CMS (Modulverwaltung)](#4-das-git-basierte-cms-modulverwaltung)
5. [Statische Hosting-Grenzen & Zielarchitektur](#5-statische-hosting-grenzen--zielarchitektur)
6. [Datenschutz & Rechtliche Hinweise](#6-datenschutz--rechtliche-hinweise)
7. [Asset- & Bildgrössenempfehlungen](#7-asset---bildgr%C3%B6ssenempfehlungen)
8. [Sicherheits- & Spam-Schutz-Konzept](#8-sicherheits---spam-schutz-konzept)

---

## 1. Projektstruktur

Das Projekt ist modular und sauber getrennt aufgebaut:

```
jigsaw-automotive/
├── admin/                  # CMS Admin Dashboard
│   ├── index.html          # Dashboard-Oberfläche
│   ├── admin.css           # Dashboard-Styles
│   └── admin.js            # Sync-Logik & GitHub API-Verbindung
├── assets/                 # Statische Ressourcen
│   ├── downloads/          # PDFs & Whitepaper (Factsheet, Leadmagnet)
│   ├── fonts/              # Lokal gehostete Schriftarten (Inter Variable)
│   └── images/             # Optimierte WebP-Bilder & Logos
├── content/
│   └── config.json         # Zentrales Content-Model (Module & Texte)
├── css/
│   └── style.css           # Zentrales Design-System & Responsive Layout
├── js/
│   └── main.js             # Clientseitiges JavaScript (Animationen, CMS, Validierung)
├── index.html              # Startseite (Home)
├── leistungen.html         # Services & Leistungen
├── team.html               # Teamvorstellung & Werte
├── projekte.html           # Case Studies & Referenzen
├── kontakt.html            # Kontaktseite mit Terminbuchungs-Vorbereitung
├── impressum.html          # Impressum (Rechtssicher vorbereitet)
└── datenschutz.html        # Datenschutzerklärung (DSGVO/DSG-konform)
```

---

## 2. Installations- & Startanleitung

Da es sich um eine hochoptimierte statische Website handelt, ist **keine Installation von Datenbanken oder Servern** erforderlich.

### Lokal starten
1. Laden Sie dieses Repository herunter.
2. Öffnen Sie die Datei `index.html` direkt in einem beliebigen modernen Webbrowser (z. B. Chrome, Safari, Firefox).
3. **Empfohlen (Lokaler Server für CMS-Funktionen):** Um die dynamische JSON-Nachladung des CMS lokal zu testen, starten Sie einen lokalen Webserver im Projektordner:
   ```bash
   # Mit Python
   python3 -m http.server 8000
   # Oder mit Node.js / npx
   npx serve .
   ```
   Öffnen Sie anschliessend `http://localhost:8000` in Ihrem Browser.

---

## 3. GitHub Pages Deployment

Die Website ist so konzipiert, dass sie vollständig auf **GitHub Pages** demonstriert werden kann.

### Schritte zur Veröffentlichung:
1. Erstellen Sie ein neues GitHub-Repository (z. B. `jigsaw-automotive`).
2. Pushen Sie diesen Projektordner in Ihr Repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Jigsaw Automotive Website"
   git remote add origin https://github.com/IHR_BENUTZERNAME/jigsaw-automotive.git
   git branch -M main
   git push -u origin main
   ```
3. Gehen Sie in Ihrem GitHub-Repository auf **Settings > Pages**.
4. Wählen Sie unter *Build and deployment* den Branch `main` (Ordner `/root`) und klicken Sie auf **Save**.
5. Nach ca. 1-2 Minuten ist Ihre Website unter `https://IHR_BENUTZERNAME.github.io/jigsaw-automotive/` weltweit erreichbar.

---

## 4. Das Git-basierte CMS (Modulverwaltung)

Die Website verfügt über ein integriertes CMS unter `/admin/index.html`. 

### Wie es funktioniert:
- **Lokal testen:** Wenn Sie im Dashboard Änderungen an Modulen oder Texten vornehmen und auf *„Änderungen lokal speichern“* klicken, werden diese im `localStorage` Ihres Browsers gesichert. Die Hauptwebsite übernimmt diese Änderungen sofort (perfekt für Präsentationen und Tests).
- **GitHub Sync (Echtbetrieb):** 
  1. Erstellen Sie einen [GitHub Personal Access Token (PAT)](https://github.com/settings/tokens) mit `repo`-Rechten.
  2. Tragen Sie den Token, Ihren Benutzernamen und den Repository-Namen im CMS unter dem Reiter **„GitHub Sync“** ein.
  3. Klicken Sie auf **„Auf GitHub veröffentlichen 🚀“**. Das CMS sendet die Änderungen per API direkt an Ihr GitHub-Repository. GitHub Pages aktualisiert die Live-Website automatisch.

---

## 5. Statische Hosting-Grenzen & Zielarchitektur

GitHub Pages bietet hervorragendes statisches Hosting, kann jedoch keine serverseitige Logik (Datenbanken, E-Mail-Versand, Benutzerverwaltung) ausführen.

### Vorbereitete Migration & Zielarchitektur für den Live-Betrieb:
- **Kontaktformular:** 
  - *Demo (GitHub Pages):* Führt eine clientseitige Validierung, Spam-Schutz (Math CAPTCHA, Honeypot, Timestamp) durch und öffnet das E-Mail-Programm des Nutzers (`mailto`).
  - *Produktiv-Empfehlung:* Tragen Sie im Formular-Tag in `kontakt.html` eine Formspree-ID oder eine Serverless-Function-URL (z. B. Netlify Forms) ein. Die Schnittstelle ist im JavaScript bereits vollständig integriert.
- **Terminbuchung:**
  - *Demo:* Ein CTA führt zur Kontaktseite mit vorausgefüllter Mailto-Struktur.
  - *Produktiv-Empfehlung:* Einbettung eines Widgets von Calendly oder MS Bookings (Vorbereitung im HTML vorhanden).
- **Datenbanken / CMS:**
  - Für umfangreichere Bearbeitungen kann diese Struktur problemlos in ein Headless CMS (wie Strapi oder Storyblok) überführt werden, wobei das bestehende CSS und HTML als performantes Frontend erhalten bleibt.

---

## 6. Datenschutz & Rechtliche Hinweise

> [!IMPORTANT]
> **Rechtliche Finalprüfung durch den Betreiber erforderlich**
> Die rechtlichen Angaben (Impressum, Datenschutzerklärung) wurden nach bestem Wissen auf Basis der gesetzlichen Vorgaben für Deutschland (TMG/MStV), Österreich (ECG) und die Schweiz (DSG) strukturiert. Sie müssen vor dem offiziellen Go-Live zwingend juristisch geprüft und durch die tatsächlichen Betreiberdaten (Umsatzsteuer-ID, Handelsregisternummer etc.) ergänzt werden.

- **Vorteil:** Die Website lädt keinerlei Assets von Drittanbieter-Servern (CDNs). Weder Google Fonts noch jQuery oder Bootstrap-Server werden kontaktiert. Dies verhindert DSGVO-bezogene Abmahnungen.

---

## 7. Asset- & Bildgrössenempfehlungen

- **Schriftarten:** Nutzen Sie ausschliesslich die lokal abgelegte Schriftart `Inter-Variable.woff2`.
- **Bilder:** Verwenden Sie für Fotos ausschliesslich das **WebP-Format**, um die Dateigrösse minimal zu halten.
- **Puzzle-Masken:**
  - Die runden Puzzle-Masken für Team- und CEO-Fotos erwarten quadratische Bilder (Empfehlung: `600x600 Pixel`). 
  - Die CSS-Logik sorgt dafür, dass sich die Bilder automatisch anpassen, ohne verzerrt zu werden (`object-fit: cover`).

---

## 8. Sicherheits- & Spam-Schutz-Konzept

Um Angriffe auf statische Formulare zu verhindern, wurden folgende Schutzmechanismen integriert:
1. **Honeypot-Schutz:** Ein unsichtbares Feld entlarvt automatisierte Bots sofort.
2. **Timestamp-Validierung:** Erkennt das Ausfüllen des Formulars in unnatürlich schneller Zeit (unter 3 Sekunden).
3. **Math CAPTCHA:** Barrierefreies Rechenrätsel vor dem Absenden.
4. **Input Sanitization:** Bereinigung aller Formular-Eingabewerte im JavaScript zur Verhinderung von HTML/JS-Injection (XSS).
5. **Rate-Limiting:** Absendesperre von 5 Sekunden zwischen den Formularklicks, um Missbrauch zu blockieren.
