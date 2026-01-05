# Slevomat AI

Interakční design playground s pokročilými animacemi a integrací s Figma.

## 📁 Projekty

### 1. **Cursor Ideas** (`/cursor-ideas`)
Floating Button Modal App - moderní webová aplikace s floating buttonem a modálním oknem s perfektní interakční animací inspirovanou SwiftUI.

## ✨ Funkce

- **Floating Action Button** v pravém dolním rohu
  - Modrý s jemným vrženým stínem
  - Ikona ruky (24x24px)
  - Hover efekt: pohyb nahoru + zvýraznění stínu + ztmavení o 10%
  - Smooth animace ikony při přechodu ruka → křížek

- **16 Variant animací modálu** (inspirováno SwiftUI, iOS, Material Design):
  
  **Základní varianty:**
  1. **Spring Scale Transform** - Button se transformuje přímo na modál s pružnou animací
  2. **Slide from Right** - Modál elegantně přijede zprava s spring efektem
  3. **Expand from Button** - Modál se rozbalí z pozice buttonu (nejblíže SwiftUI)
  4. **Blur Backdrop Slide** - Modál s blur pozadím a jemným posuvem
  
  **✨ Efektní varianty (s křížkem v modálu):**
  5. **Button → Modal Transform** - Floating button se přímo transformuje do modálu (velikost, pozice, shape)
  6. **Ripple Expand** - Vlnová expanze s ripple efektem z pozice buttonu
  7. **3D Flip & Expand** - Modál se otočí ve 3D prostoru a rozbalí
  8. **Elastic Morph** - Elastický morphing s nelineárním scalingem a rotací
  
  **🎯 Native-like varianty (Shared Layout Animation):**
  9. **Shared Layout Morph** - Skutečný shared element s layoutId, plynulá transformace
  10. **Organic Grow** - Organický růst, pomalý a přirozený (mass: 1.3, stiffness: 180)
  11. **Bubble Pop** - Rychlá bublina s bounce efektem (bounce: 0.4, mass: 0.5)
  12. **Liquid Expand** - Tekutá expanze s rotací a velkým mass (2.0)
  
  **🏆 Best Practice Design (Senior Interaction Designer):**
  13. **Hero Transition** - iOS-style progressive disclosure, anticipation + continuity
  14. **Material Elevation** - Material Design Z-axis elevation, dramatické stíny
  15. **Magnetic Pull** - Magnetické přitahování, spatial relationship emphasis
  16. **Contextual Bloom** - Postupné vrstvené odhalování, storytelling approach

## 🚀 Instalace a spuštění

```bash
# Instalace závislostí
npm install

# Spuštění vývojového serveru
npm run dev

# Build pro produkci
npm run build
```

## 🛠 Technologie

- React 18 + TypeScript
- React Router DOM (routing mezi projekty)
- Framer Motion (pro SwiftUI-like animace)
- Tailwind CSS (pro styling)
- Vite (build tool)
- Lucide React (ikony)

## 📂 Struktura projektu

```
src/
├── pages/
│   ├── HomePage.tsx       # Rozcestník s projekty
│   ├── CursorIdeas.tsx    # Floating Button Modal playground
│   └── FigmaMCP.tsx       # Figma MCP prototyp s tab switcherem
├── components/
│   ├── FigmaDesktop.tsx   # Desktop verze (1000×800) s modálem
│   └── FigmaMobile.tsx    # Mobile verze (320×568) s bottom sheetem
├── App.tsx                # Router
├── main.tsx               # Entry point
└── index.css              # Global styles
```

### 2. **Figma MCP** (`/figma-mcp`)
Integrace s Figma pomocí Model Context Protocol. Interaktivní prototyp s dvěma verzemi:
- **Desktop (1000×800)** - Floating button s modálním oknem
- **Mobile 320 (320×568)** - Floating button s bottom sheetem
- Přepínání mezi verzemi pomocí tab switcheru
- Design importován přímo z Figma pomocí MCP nástrojů

---

## 💡 Použití

### Homepage
- Otevřete `http://localhost:5173/`
- Vyberte projekt kliknutím na kartu

### Cursor Ideas
1. Kliknutím na tlačítka v levém horním rohu vyberte variantu animace
   - **Základní varianty** (modré) - křížek zůstává ve floating buttonu
   - **Efektní varianty** (fialové) - křížek se objeví v pravém horním rohu modálu
   - **Native-like varianty** (zelené) - skutečné shared element animace
   - **Best Practice varianty** (žluté) - profesionální interaction design
2. Klikněte na floating button v pravém dolním rohu pro otevření modálu
3. Zavřete kliknutím na křížek nebo na backdrop (pozadí)
4. Tlačítko "Zpět" v levém horním rohu vás vrátí na homepage

### Figma MCP
1. Přepínejte mezi Desktop a Mobile verzí pomocí tabů nahoře
2. **Desktop verze:**
   - Klikněte na floating button v pravém dolním rohu
   - Otevře se modální okno zprava s spring animací
   - Zavřete křížkem nebo kliknutím na backdrop
3. **Mobile verze:**
   - Klikněte na floating button v pravém dolním rohu
   - Vyjetí bottom sheetu zdola s spring animací
   - Zavřete chevron ikonou nebo kliknutím na backdrop
4. Design je pixel-perfect podle Figma souboru

## 🎨 Speciální funkce

- **Adaptivní UI**: Křížek se automaticky přemístí do modálu u variant 5-12
- **Plynulé animace obsahu**: Obsah modálu se animuje postupně s delay efektem
- **3D transformace**: Varianta "3D Flip & Expand" používá perspective pro realistický efekt
- **Elastic physics**: Varianta "Elastic Morph" má nelineární deformaci pro dramatický efekt
- **Shared Layout Animations**: Varianty 9-12 používají `layoutId` z Framer Motion pro skutečnou transformaci elementu (ne fake CSS animaci)
- **Physics-based animations**: Každá varianta má unikátní spring parametry (stiffness, damping, mass, bounce)

## 🔥 Native-like varianty (9-16)

Tyto varianty jsou skutečně "app native" - **button a modál jsou stejný DOM element**:
- ✅ Žádné fakeové CSS animace
- ✅ Skutečná transformace elementu pomocí Framer Motion layoutId
- ✅ Background plynule přechází z modré (#3b82f6) na bílou (#ffffff)
- ✅ Obsah se dynamicky mění (ikona ruky → plný obsah modálu)
- ✅ Každá varianta má unikátní physics:
  - **Shared Layout Morph**: Vyvážený (stiffness: 260, damping: 30, mass: 0.8)
  - **Organic Grow**: Pomalý růst (stiffness: 180, damping: 22, mass: 1.3)
  - **Bubble Pop**: Rychlý s bounce (stiffness: 320, damping: 18, mass: 0.5, bounce: 0.4)
  - **Liquid Expand**: Velmi měkký s rotací (stiffness: 140, damping: 18, mass: 2.0)

## 🏆 Best Practice Design varianty (13-16)

Navrženo jako **senior interaction designer** s důrazem na **anticipation, continuity, spatial relationships a storytelling**:

### **13. Hero Transition** 🍎
- **Inspirace**: Apple iOS Human Interface Guidelines
- **Princip**: Progressive disclosure s anticipation
- **Physics**: stiffness: 280, damping: 32, mass: 0.7
- **Unique features**:
  - Scale anticipation [0.95 → 1.02 → 1] pro signalizaci akce
  - Fade-up obsahu (y: 20 → 0) pro kontinuitu
  - iOS-like easing curve [0.16, 1, 0.3, 1]
  - Soft shadows pro depth perception
- **Použití**: iOS/Apple design systems, transactional flows

### **14. Material Elevation** 📦
- **Inspirace**: Material Design 3 Guidelines
- **Princip**: Z-axis elevation pro spatial hierarchy
- **Physics**: stiffness: 240, damping: 28, mass: 1.0
- **Unique features**:
  - Dramatické stíny (24px blur → 48px blur)
  - Scale content reveal (0.9 → 1)
  - Zdůrazněná elevace = důležitost
  - Material motion easing
- **Použití**: Android/Material UI apps, information architecture

### **15. Magnetic Pull** 🧲
- **Inspirace**: Spatial relationship + anticipation
- **Princip**: Magnetické přitahování = jasná kauzalita
- **Physics**: stiffness: 200, damping: 20, mass: 1.4, velocity: -50
- **Unique features**:
  - Multi-stage scale [0.9 → 1.08 → 0.98 → 1] pro "pull" efekt
  - Obsah se "přitahuje" z dálky (y: 100)
  - Emphasized movement pro storytelling
  - Velocity boost pro dynamiku
- **Použití**: Gamification, engaging experiences, tutorial flows

### **16. Contextual Bloom** 🌸
- **Inspirace**: Luxury brands + layer-by-layer storytelling
- **Princip**: Postupné vrstvené odhalování obsahu
- **Physics**: stiffness: 220, damping: 26, mass: 0.9
- **Unique features**:
  - Bloom from center (scale: 0.3 → 1)
  - Jemná rotace [0° → 2° → 0°] pro premium feel
  - Nejdelší delay (0.65s) pro sophisticated timing
  - Layer-by-layer content reveal
- **Použití**: Premium brands, luxury products, editorial content

## 🎯 Doporučení podle use case

### **Pro produkční použití:**

| Use Case | Doporučená varianta | Důvod |
|----------|---------------------|-------|
| **iOS/macOS app** | #13 Hero Transition | Apple HIG compliant, native feel |
| **Android app** | #14 Material Elevation | Material Design guidelines |
| **Univerzální web** | #9 Shared Layout Morph | Platforma-agnostický, čistý |
| **E-commerce** | #13 Hero Transition | Smooth product detail transitions |
| **Dashboard/Admin** | #14 Material Elevation | Jasná hierarchie, profesionální |
| **Landing page** | #16 Contextual Bloom | Premium dojem, storytelling |
| **Gamifikace** | #15 Magnetic Pull | Engaging, fun, jasná kauzalita |
| **Social media** | #11 Bubble Pop | Playful, quick, bounce efekt |
| **Finance/Banking** | #13 Hero Transition | Důvěryhodný, smooth, profesionální |
| **Luxury retail** | #16 Contextual Bloom | Sophisticated, elegant, premium |

### **Podle designové filozofie:**

- **Minimalistické**: #9 Shared Layout Morph, #13 Hero Transition
- **Expresivní**: #11 Bubble Pop, #15 Magnetic Pull
- **Profesionální**: #13 Hero Transition, #14 Material Elevation
- **Experimentální**: #12 Liquid Expand, #16 Contextual Bloom

