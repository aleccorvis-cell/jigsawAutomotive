# Content-Modell & Modulverwaltung (Content Model)
**Jigsaw Automotive Group**

Dieses Dokument beschreibt die Inhaltsstruktur (`content/config.json`), die Funktionsweise des CMS-Admin-Bereichs und wie die verschiedenen Inhaltsmodule auf der Website verwaltet werden.

---

## 1. Das Content-Model (`config.json`)

Die gesamte Steuerung der dynamischen Inhalte erfolgt über eine zentrale JSON-Datei. Das folgende Schema zeigt die Struktur der Konfigurationsdatei:

```json
{
  "company": {
    "name": "Name des Unternehmens",
    "contactPerson": "Name des primären Ansprechpartners",
    "email": "Kontakt-E-Mail-Adresse",
    "phone": "Telefonnummer im internationalen Format",
    "address": "Physischer Standort / Hauptsitz",
    "brandingNotice": "Webdesign-Credit im Footer"
  },
  "modules": {
    "hero": true,
    "trust": true,
    "ueber-uns": true,
    "leistungen": true,
    "team": true,
    "projekte": true,
    "downloads": true,
    "faq": true,
    "cta": true
  },
  "hero": {
    "title": "Hauptüberschrift auf der Startseite",
    "subtitle": "Einleitender Begleittext im Hero-Bereich",
    "ctaPrimary": "Text des primären Buttons",
    "ctaSecondary": "Text des sekundären Buttons"
  },
  "ueberUns": {
    "overline": "Kategorie-Label über der Überschrift",
    "title": "Hauptüberschrift des Bereichs",
    "leadText": "Hervorgehobener Einleitungstext",
    "bodyText": "Ausführlicher Beschreibungstext",
    "ctaText": "Button-Text für den Team-Verweis"
  }
}
```

---

## 2. Inhaltsmodule (Verwaltungsprinzip)

Im Admin-Bereich (`/admin/index.html`) wird jedes Inhaltsmodul als Karte mit einer Checkbox dargestellt. Das Aktivieren oder Deaktivieren steuert die Anzeige auf allen Seiten.

### A. Hero-Bereich (`#hero`)
- **Ziel:** Erste visuelle Kontaktaufnahme. Zeigt das CEO-Porträt von Christof Chrappek (maskiert in Puzzle-Form).
- **Steuerung:** Kann komplett ein- oder ausgeblendet werden. Texte sind im Reiter „Inhalte bearbeiten“ änderbar.

### B. Kennzahlen / Trust (`#trust`)
- **Ziel:** Schneller Vertrauensaufbau im B2B-Umfeld durch Zahlen (z. B. "15+ Jahre Erfahrung").
- **Steuerung:** Zeigt standardmässig vier Metriken.

### C. Über uns (`#ueber-uns`)
- **Ziel:** Vermittlung der Firmenphilosophie und des „Jigsaw“-Prinzips.
- **Steuerung:** Modul-Toggle schaltet den gesamten Block auf der Startseite an/aus.

### D. Leistungen (`#leistungen`)
- **Ziel:** Detaillierte Darstellung des Leistungsportfolios (Strategieberatung, Projektmanagement, Interim Management etc.).
- **Steuerung:** Verlinkt direkt auf die vollständige Serviceseite (`leistungen.html`).

### E. Team (`#team`)
- **Ziel:** Vorstellung der handelnden Personen.
- **Steuerung:** Das Bild von Christof Chrappek ist im CSS-Puzzle-Frame maskiert. Für weitere Teammitglieder stehen neutrale Puzzle-SVG-Platzhalter bereit (`placeholder-team-2.svg` bis `4`).

### F. Downloadbereich & Leadmagnet (`#downloads`)
- **Ziel:** Leadgenerierung und Bereitstellung von Informationsmaterialien (Factsheets, Whitepaper).
- **Dateipfade:** 
  - Haupt-Factsheet: `assets/downloads/Jigsaw_Automotive_Portfolio.pdf`
  - Leadmagnet-Whitepaper: `assets/downloads/whitepaper-automotive-dach.pdf` (wird nach E-Mail-Eingabe im Modal zum Download freigegeben).

### G. FAQ (`#faq`)
- **Ziel:** Klärung häufiger B2B-Fragen und Verbesserung des Suchmaschinen-Rankings (Schema.org integration).
- **Steuerung:** Akkordeon-Struktur im Frontend.

---

## 3. Empfohlene Bildgrössen & Formate

Um die Ladezeiten und die visuelle Qualität der Puzzle-Masken optimal zu halten, wird die Einhaltung folgender Bildformate empfohlen:

| Bereich | Empfohlenes Format | Auflösung (px) | Seitenverhältnis | Besonderheit |
| :--- | :--- | :--- | :--- | :--- |
| **CEO / Teamfotos** | WebP | 600 x 600 | 1:1 (Quadratisch) | Wird automatisch in die Puzzle-Maske eingepasst (`object-fit: cover`). |
| **Projektbilder / Banner** | WebP | 1200 x 800 | 3:2 oder 16:9 | Hohe Komprimierung (Qualität ca. 80-85%). |
| **Logo** | PNG oder SVG | 400 x 120 | Freies Verhältnis | Transparenter Hintergrund ist zwingend erforderlich. |
