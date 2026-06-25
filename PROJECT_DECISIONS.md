# Projekt-Entscheidungen (Project Decisions)
**Jigsaw Automotive Group**

In diesem Dokument werden die wesentlichen Architektur-, Sicherheits-, Datenschutz-, SEO- und UX/UI-Entscheidungen für die Unternehmenswebsite der Jigsaw Automotive Group festgehalten.

---

## 1. Architektur & Hosting-Konzept

### Entscheidung: Decoupled Static Website + Browser-based Git CMS
- **Kontext:** Die Website muss auf GitHub Pages (statisches Hosting) ohne serverseitiges Backend lauffähig sein, soll aber später leicht migrierbar sein und eine einfache Inhaltsverwaltung bieten.
- **Lösung:**
  - Die Seite basiert auf reinem, hochperformantem HTML5, CSS3 und Vanilla JavaScript (keine schweren Frameworks wie React oder Vue zur Laufzeit, was die SEO-Indizierung maximiert).
  - Zur dynamischen Anpassung lädt die Seite eine Inhaltskonfiguration (`content/config.json`) per Fetch-API. Die standardmässigen statischen HTML-Dateien dienen als voll funktionsfähiger SEO-Fallback (Pre-rendering / Hybrid-Ansatz).
  - Ein browserbasiertes Admin-Dashboard (`/admin/index.html`) ermöglicht es Christof Chrappek, Module per Checkbox zu aktivieren/deaktivieren und Texte anzupassen.
  - **Sicherungsmethode:** Die Änderungen können als `config.json` heruntergeladen oder direkt über die GitHub REST API (unter Verwendung eines verschlüsselten bzw. lokal im Browser gespeicherten Personal Access Tokens) in das Repository committed werden. Dies eliminiert die Notwendigkeit eines teuren, wartungsintensiven Backends.

---

## 2. Datenschutz & DACH-Compliance (DSGVO/DSG)

### Entscheidung: "Privacy by Design" ohne externe CDNs
- **Kontext:** Strengste Datenschutzbestimmungen im DACH-Raum (Deutschland, Österreich, Schweiz) erfordern eine datensparsame Implementierung.
- **Lösung:**
  - **Lokale Schriftarten:** Die Schriftart *Inter* ist vollständig lokal im WOFF2-Format eingebunden (`assets/fonts/inter/`). Es erfolgen keinerlei Verbindungsaufrufe zu Google Fonts Servern (Verhinderung von Abmahnwellen bzgl. IP-Weitergabe).
  - **Cookie-Banner:** Da die Website im Standardbetrieb keinerlei Tracking- oder Marketing-Cookies setzt, ist eigentlich kein Banner zwingend erforderlich. Um maximale Rechtssicherheit zu gewährleisten, wurde dennoch ein minimalistischer Cookie-Banner implementiert, der rein lokal (`localStorage`) die Einwilligung für die technisch notwendige Session speichert.
  - **Kontaktformular:** Das Formular leitet im Demo-Zustand per `mailto` direkt an die E-Mail-Adresse von Christof Chrappek. Für den Produktivbetrieb ist eine dokumentierte Schnittstelle zu Formspree oder Netlify Forms vorbereitet, die DSGVO-konforme Datenverarbeitung garantiert.

---

## 3. SEO & GEO-Readiness

### Entscheidung: Semantisches HTML5 & Schema.org-Strukturierung
- **Kontext:** Maximale Sichtbarkeit im Automotive-B2B-Sektor und optimale Crawlbarkeit für klassische Suchmaschinen (Google) sowie AI-Suchmaschinen (GEO - Generative Engine Optimization).
- **Lösung:**
  - **Eindeutige Hierarchie:** Striktes Einhalten einer einzigen `<h1>` pro Seite und logischer Nachfolger (`<h2>` bis `<h4>`).
  - **Lokale & Strukturierte Daten:** Einpflegen von JSON-LD-Metadaten auf der Startseite (`Organization`), der Team-Seite (`AboutPage`) und der Kontaktseite (`ContactPage`).
  - **FAQ-Rich-Snippets:** FAQ-Bereich auf der Startseite ist mit strukturierten Daten ausgezeichnet, um Rich Snippets in den Google-Suchergebnissen zu erzeugen.
  - **Robots & Sitemap:** Klare Auszeichnung von Impressum und Datenschutzerklärung als `noindex, follow`, um das Crawling-Budget auf die Leistungs- und Projektseiten zu fokussieren.

---

## 4. UX/UI & Branding (Masculine B2B Automotive)

### Entscheidung: Minimalistisches Schwarz-Weiss-Rot-Design mit Puzzle-Maskierung
- **Kontext:** Der Markenname „Jigsaw“ (Puzzlestück) soll als Leitmotiv dienen. Das Design muss maskulin, elegant und extrem professionell wirken.
- **Lösung:**
  - **Farbpalette:** Dominantes Tiefschwarz (`#0a0a0a`) für Autorität und Wertigkeit, edles Off-White (`#fafafa`) für hohen Kontrast und Lesbarkeit, und gezielte Akzente in Automotive-Rot (`#c41e3a`) für CTAs und Kennzahlen.
  - **Puzzle-Maskierung:** Bilder (wie das CEO-Porträt von Christof Chrappek) werden per modernem CSS-Clip-Path (`clip-path: url(#puzzle-clip-1)`) in Form eines präzisen, geometrischen Puzzlestücks maskiert. Dies wirkt nicht verspielt, sondern symbolisiert Präzision und Systemintegration („Jedes Teil passt perfekt zusammen“).
  - **Liquid Glass Effekte:** Navigation und Formulare nutzen subtile Backdrop-Blur-Effekte für eine moderne, dreidimensionale Anmutung auf allen Bildschirmgrössen.
  - **Performance & CLS:** Alle Bild-Container haben feste Seitenverhältnisse und Bilder nutzen `object-fit: cover`. Layout-Verschiebungen (Cumulative Layout Shift) werden so vollständig vermieden.

---

## 5. Sicherheit (Security-first)

### Entscheidung: Zero-Dependency-Ansatz & Client-side Spam-Schutz
- **Kontext:** Schutz vor XSS (Cross-Site Scripting), CSRF und automatisierten Formular-Spam-Bots.
- **Lösung:**
  - **Honeypot-Feld:** Unsichtbares Formularfeld (`_gotcha`), das von echten Nutzern nicht befüllt werden kann, aber von Spam-Bots ausgefüllt wird. Bei Befüllung wird die Einsendung verworfen.
  - **Zeitstempel-Validierung:** Bots senden Formulare oft in Millisekunden ab. Die Seite prüft, ob die Formularausfüllung mindestens 3 Sekunden gedauert hat.
  - **Math CAPTCHA:** Ein lokal generiertes, barrierefreies Rechenrätsel verhindert einfache Brute-Force-Bots.
  - **Input Sanitization:** Sämtliche Eingaben im Kontaktformular werden vor einer eventuellen Weiterverarbeitung clientseitig bereinigt (Entfernung von HTML-Tags zur XSS-Vermeidung).
