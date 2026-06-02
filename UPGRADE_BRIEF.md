# FULL IMPACT OVERHAUL — V2

Le template a des bons os mais zéro "wow". Ce brief restructure les éléments à fort impact visuel. L'objectif : un contractor ouvre le lien et dit "putain" dans les 2 premières secondes.

IMPORTANT : Ce brief REMPLACE l'ancien. Lis-le en entier avant de coder.

---

## 1. HERO FULL-BLEED — Le changement #1

Le hero actuel est du texte sur fond crème avec une photo en dessous. C'est un article de blog, pas un showstopper.

**Nouveau concept :** Le BeforeAfter slider remplit TOUT le viewport (100vh). Le nom de la boîte est par-dessus en blanc, avec un gradient sombre en bas pour la lisibilité. Le contractor ouvre le lien → voit un intérieur daté qui se transforme en intérieur magnifique → son nom en grand par-dessus. C'est le moment.

### Modifier `BeforeAfter.tsx` — supporter deux images séparées

Ajouter une prop optionnelle `beforeSrc`. Si fournie, le "before" utilise cette image au lieu de la même image filtrée. Garder le filtre comme fallback.

```tsx
interface Props {
  src: string;           // "after" image (toujours requise)
  beforeSrc?: string;    // "before" image (optionnelle — si absente, on filtre src)
  alt: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  overlay?: boolean;     // NEW: active le gradient sombre pour le hero
}
```

Quand `overlay={true}` :
- Ajouter un gradient sombre sur les deux images : `linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 100%)`
- Ça permet au texte blanc d'être lisible par-dessus
- Le gradient est SOUS les labels Before/After mais AU-DESSUS des images

### Restructurer `HeroSection.tsx` — full-bleed immersif

```
Structure visuelle :

┌─────────────────────────────────────┐
│                                     │  ← 100vh
│        [Before/After slider]        │  ← remplit tout le viewport
│                                     │
│                                     │
│  ┌─ Gradient sombre en bas ────────┐│
│  │  PAINTING ATELIER · CITY        ││  ← kicker en blanc
│  │                                  ││
│  │  Company Name                    ││  ← h1, blanc, clamp(3rem,9vw,7.5rem)
│  │  Interior & exterior painting    ││  ← sous-titre, blanc/80%
│  │                                  ││
│  │  [Request estimate]  📞 phone    ││  ← CTAs
│  └──────────────────────────────────┘│
│  Scroll ↓                           │  ← scroll indicator
└─────────────────────────────────────┘
```

Tout le contenu texte est positionné `absolute bottom-0` PAR-DESSUS le BeforeAfter, avec z-index au-dessus du slider.

Le parallax mouse reste (2 layers), mais layer1 = le BeforeAfter, layer2 = le texte.

**Animation d'entrée (la séquence qui crée le "putain") :**

1. L'image apparaît d'abord (scale 1.05 → 1, opacity 0→1, dur 1.2s, ease power2.out)
2. Le slider auto-sweep part immédiatement (position 75% → 35%, dur 2s, ease power2.inOut) — le visiteur voit le mur daté se transformer en intérieur frais
3. Pendant le sweep, le gradient sombre fade-in (0→1, dur 0.8s)
4. Le kicker slide-up (opacity 0→1, y 12→0, dur 0.5s)
5. Le nom de la boîte : **chaque mot apparaît séparément** — wrap chaque mot dans un `<span>` avec `overflow:hidden` autour, et chaque mot fait yPercent 110→0, stagger 0.08s, dur 0.9s, ease power4.out
6. Le sous-titre fade (opacity 0→1, dur 0.6s)
7. Les CTAs slide-up (opacity 0→1, y 16→0, stagger 0.1s)
8. Le "Scroll ↓" fade-in en dernier

**Timing total : ~3.5s.** C'est un mini-film d'ouverture.

**Photos hero :**
- `afterSrc` (beautiful room) : `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1920&q=85` (salon lumineux, murs blancs frais, plancher bois)
- `beforeSrc` (dated room) : utiliser la MÊME image `photo-1560448204-e02f11c3d0e2` mais avec le filtre ultra-lourd comme fallback. C'est plus cohérent que deux pièces différentes.

Le filtre "before" doit être EXTREME pour le hero full-bleed :
```css
filter: grayscale(1) brightness(0.58) contrast(0.78) sepia(0.5) saturate(0.2);
```
Plus un overlay : `rgba(90,75,50,0.25)` — un voile jaunâtre/marron qui simule un intérieur des années 90.

Le contraste doit être IMMÉDIATEMENT visible. Quand le slider bouge, c'est "avant : triste et vieux" → "après : lumineux et frais". Pas subtil.

### CTA button style dans le hero (blanc, pas sienna — pour contraste sur image sombre)

```tsx
<a href="#contact" className="mh-cta inline-flex items-center px-8 py-4 text-sm font-medium tracking-wide rounded-sm backdrop-blur-sm transition-all duration-300"
  style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
  Request an estimate
</a>
```
Au hover : `backgroundColor: "rgba(255,255,255,0.25)"`. Le backdrop-blur donne un effet glass.

---

## 2. PHOTOS — Tout remplacer

CHAQUE photo du site doit montrer de la peinture, pas des intérieurs random.

### `constants.ts` — nouvelles images services

```ts
export const SERVICES = [
  {
    num: "01",
    title: "Interior Painting",
    blurb: "Walls, ceilings, trim, and feature details — crisp lines and a finish that reads flawless up close.",
    img: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1100&q=80",
    // (blue paint roller on white wall — by Theme Photos)
  },
  {
    num: "02",
    title: "Exterior Painting",
    blurb: "Siding, stucco, trim, and doors — coatings chosen to hold their color through every season.",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1100&q=80",
    // (garder — la maison extérieure fonctionne ici)
  },
  {
    num: "03",
    title: "Cabinet Refinishing",
    blurb: "Kitchens and built-ins, stripped and sprayed to a smooth, durable, factory-grade surface.",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1100&q=80",
    // (garder — cuisine avec cabinets)
  },
  {
    num: "04",
    title: "Color Consultation",
    blurb: "A guided palette session — light, undertones, and mood considered before a single coat goes on.",
    img: "https://images.unsplash.com/photo-1576153192396-180ecef2a715?auto=format&fit=crop&w=1100&q=80",
    // (paint swatch cards / color samples)
  },
  {
    num: "05",
    title: "Commercial Painting",
    blurb: "Offices, retail, and tenant spaces — scheduled around your hours, finished without the disruption.",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1100&q=80",
    // (garder — open space bureau)
  },
  {
    num: "06",
    title: "Surface Prep & Drywall",
    blurb: "Patching, skim-coating, and sanding — the unseen craft that makes the finished wall look effortless.",
    img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1100&q=80",
    // (construction/rénovation en cours)
  },
];
```

### `WorkSection.tsx` — nouvelles images galerie

```ts
const FIGS = [
  { kind: "photo", type: "Interior",           img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80", ... },
  // salon lumineux avec murs peints frais
  { kind: "photo", type: "Cabinet Refinishing", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=80", ... },
  { kind: "ba",    type: "Before / After",      img: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1600&q=80", ... },
  // intérieur moderne — le BeforeAfter en applique le filtre
  { kind: "photo", type: "Color Consultation",  img: "https://images.unsplash.com/photo-1576153192396-180ecef2a715?auto=format&fit=crop&w=1000&q=80", ... },
  // paint swatches — montre le métier
  { kind: "photo", type: "Detail",              img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80", ... },
  // pinceaux et outils pro — gros plan
  { kind: "photo", type: "Exterior",            img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1000&q=80", ... },
];
```

NOTE : Vérifie que chaque URL charge correctement. Si une image ne charge pas, va sur unsplash.com, cherche le terme entre parenthèses, et prends la première photo pertinente.

---

## 3. ATMOSPHERIC — Monter le volume

Les opacités V1 étaient calibrées "subliminal" = invisible. On passe en mode visible.

### `AtelierTexture.tsx`
- Grain opacity : `0.032` → **`0.07`** (visible comme un vrai grain de papier)
- Linen opacity : `0.018` → **`0.035`**

### `PigmentCanvas.tsx`
- Alpha max des particules : `0.22` → **`0.38`** (ligne 96 : `const alpha = env * 0.38`)
- Ghost trail : desktop `0.12` → **`0.08`** (traînée plus longue = plus visible)
- Taille particules desktop : `rnd(80, 260)` → **`rnd(120, 340)`**

### `globals.css` — sections plus translucides
```css
--paper:      rgba(244, 240, 232, 0.75);   /* était 0.86 — beaucoup plus de bleed-through */
--paper-deep: rgba(234, 227, 214, 0.80);   /* était 0.90 */
```
Et les utility classes :
```css
.bg-paper      { background-color: rgba(244, 240, 232, 0.75); }
.bg-paper-deep { background-color: rgba(234, 227, 214, 0.80); }
```

### `PaletteNarrative.tsx`
Toutes les opacités × 2.5 :
```
rgba(176, 85, 47, 0.10) 0%       /* était 0.04 */
rgba(196, 128, 61, 0.07) 25%     /* était 0.03 */
rgba(122, 128, 104, 0.07) 75%    /* était 0.03 */
rgba(74, 80, 64, 0.10) 100%      /* était 0.04 */
```

### Hero glow (`HeroSection.tsx`)
Le glow-pulse keyframe : `opacity 0.08 → 0.11` → **`opacity 0.18 → 0.25`**
Le glow est maintenant clairement visible comme une lueur chaude derrière le texte.

```css
@keyframes glow-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1);    opacity: 0.18; }
  50%      { transform: translate(-50%, -50%) scale(1.08); opacity: 0.25; }
}
```

### CTA glow
```css
@keyframes cta-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(176, 85, 47, 0); }
  50%      { box-shadow: 0 0 28px 4px rgba(176, 85, 47, 0.15); }
}
```
(Était 0.08, maintenant 0.15 — visible comme un léger halo sienna)

---

## 4. NOUVELLE SECTION — Stats / Chiffres (entre Services et Work)

Le site a besoin de variété visuelle. Ajouter une section "By the Numbers" entre ServicesSection et WorkSection. C'est une bande sombre (inversée) qui casse le rythme paper/paper-deep.

### `src/sections/StatsSection.tsx`

**Design :** Fond sombre (`#211C17`), texte clair. 4 stats en grille.

```
┌────────────────────────────────────────────────────┐
│  bg: #211C17                                       │
│                                                    │
│    14+          2,500+        5.0 ★       24h      │
│   Years        Projects      Rating     Response   │
│                                                    │
│  "Fourteen years of clean lines across [zone]."    │
└────────────────────────────────────────────────────┘
```

**Les chiffres comptent up au scroll (counter animation) :**

```ts
// Chaque stat a { value: number, suffix: string, label: string }
const STATS = [
  { value: 14, suffix: "+", label: "Years in business" },
  { value: 2500, suffix: "+", label: "Projects completed" },
  { value: 5.0, suffix: " ★", label: "Average rating" },
  { value: 24, suffix: "h", label: "Response time" },
];
```

Animation du counter :
```ts
gsap.from(numberEl, {
  textContent: 0,
  duration: 2,
  ease: "power2.out",
  snap: { textContent: stat.value >= 100 ? 10 : 0.1 },
  scrollTrigger: { trigger: sectionRef, start: "top 75%", once: true },
});
```

Les chiffres sont en `font-display`, très grands : `clamp(3.5rem, 8vw, 6rem)`, couleur `#F4F0E8` (paper).
Les labels sont en `kicker`, couleur `rgba(244,240,232,0.5)`.
La phrase en bas est en `font-display italic`, couleur `rgba(244,240,232,0.7)`.

**Ajouter `<StatsSection company={company} />` dans `[slug]/page.tsx` entre `<ServicesSection>` et `<WorkSection>`.**

---

## 5. ANIMATIONS — Showstoppers

### 5a. Title word-split reveal (TOUTES les section titles)

Créer un helper qui wrap chaque mot dans un `<span>` overflow-hidden :

```tsx
// src/components/shared/SplitWords.tsx
"use client";
export default function SplitWords({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <span className={`inline-block split-word ${className ?? ""}`}>
            {word}
          </span>
          {i < text.split(" ").length - 1 && " "}
        </span>
      ))}
    </>
  );
}
```

Utilisation dans chaque section title :
```tsx
<h2 className="font-display text-ink font-medium" style={...}>
  <SplitWords text="Everything we touch," />
  <br /><span className="italic"><SplitWords text="finished by hand." /></span>
</h2>
```

Animation GSAP : `.split-word` démarre à `yPercent: 100` et entre à `yPercent: 0` avec stagger 0.04s. C'est BEAUCOUP plus impactant qu'un simple fade-up — chaque mot "monte" dans sa boîte.

```ts
gsap.set(".split-word", { yPercent: 100 });
// dans le ScrollTrigger de la section :
tl.to(".split-word", { yPercent: 0, duration: 0.7, stagger: 0.04, ease: "power4.out" });
```

### 5b. Magnetic CTA buttons

Créer un composant `MagneticButton` qui attire les buttons vers le curseur :

```tsx
// src/components/shared/MagneticButton.tsx
"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function MagneticButton({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const range = 120; // pixels de distance d'attraction
      if (dist < range) {
        const pull = 1 - dist / range;
        gsap.to(el, { x: dx * pull * 0.35, y: dy * pull * 0.35, duration: 0.4, ease: "power2.out" });
      } else {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
      }
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });

    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <a ref={ref} {...props}>{children}</a>;
}
```

Utiliser `<MagneticButton>` pour TOUS les CTA "Request an estimate" du site (hero, navbar, footer, contact). Quand le curseur s'approche, le bouton se déplace légèrement vers lui — effet premium.

### 5c. Photos avec hover lift 3D

Sur les photos de la WorkSection, ajouter un tilt 3D subtil au hover :

```ts
// Dans WorkSection, pour chaque figure photo (desktop only)
const onMove = (e: MouseEvent) => {
  const rect = el.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 à +0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  gsap.to(el, {
    rotateY: x * 6,     // max ±3°
    rotateX: -y * 6,    // max ±3°
    duration: 0.6,
    ease: "power2.out",
  });
};
const onLeave = () => gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "power2.out" });
```

Ajouter `perspective: 800px` sur le parent de chaque figure. Desktop only.

### 5d. Scroll-velocity parallax dans WorkSection

Les 3 colonnes de la rangée du bas (Commercial, Interior, Exterior) bougent à des vitesses différentes au scroll :

```ts
if (window.innerWidth >= 1024) {
  // Colonne 1 : monte vite
  gsap.to(col1, { y: -60, scrollTrigger: { trigger: gridRef, start: "top bottom", end: "bottom top", scrub: 1.5 }});
  // Colonne 2 : statique (référence)
  // Colonne 3 : descend lentement
  gsap.to(col3, { y: 40, scrollTrigger: { trigger: gridRef, start: "top bottom", end: "bottom top", scrub: 1.5 }});
}
```

Ça crée un effet "masonry vivant" — les photos ne sont plus alignées statiquement, elles flottent.

---

## 6. REVIEWS — Plus dramatique

Actuellement les 3 reviews sont empilées avec le même rythme. Rendre la première review spéciale :

**La première review est full-width, grande, avec des guillemets géants :**
- Le `❝` fait `clamp(5rem, 12vw, 10rem)` (énorme), couleur sienna à 20% opacity
- Le texte de la quote fait `clamp(1.8rem, 4vw, 3.2rem)` (plus grand que les autres)
- Elle est seule sur une "bande" — pas les 3 d'affilée

**Les reviews 2 et 3 sont côte à côte sur desktop :**
- Grid 2 colonnes sur desktop
- Plus petites (taille actuelle)
- Séparées par une ligne verticale

```
┌──────────────────────────────────────────────────┐
│  ❝                                               │
│  "They treated our home like it was their own..." │  ← review 1, full-width, très grande
│  — Sarah M., Interior                            │
├─────────────────────┬────────────────────────────┤
│  "The color session  │  "Painted the exterior..." │  ← reviews 2-3, côte à côte
│  alone was worth it" │  — Linda K.                │
│  — James R.          │                            │
└─────────────────────┴────────────────────────────┘
```

---

## 7. SCROLL INDICATOR — Hero bottom

Ajouter un scroll indicator animé en bas du hero — une flèche ou un trait qui pulse vers le bas :

```tsx
<div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
  <span className="kicker text-white/60" style={{ fontSize: "0.6rem" }}>Scroll</span>
  <div className="w-px h-8 overflow-hidden">
    <div className="w-px h-full bg-white/40" style={{ animation: "scroll-line 1.8s ease-in-out infinite" }} />
  </div>
</div>
```

```css
@keyframes scroll-line {
  0%   { transform: translateY(-100%); }
  50%  { transform: translateY(0); }
  100% { transform: translateY(100%); }
}
```

---

## 8. NAVBAR — Adapter au hero sombre

Le hero est maintenant un full-bleed sombre. La navbar doit démarrer en mode transparent avec texte BLANC, puis switch au scroll vers le mode actuel (paper bg + texte ink).

```tsx
// Quand scrolled === false && au-dessus du hero :
backgroundColor: "transparent"
textColor: "#fff"
logoColor: "#fff"
ctaStyle: { border: "1px solid rgba(255,255,255,0.3)", color: "#fff", bg: "rgba(255,255,255,0.1)" }

// Quand scrolled === true :
backgroundColor: "rgba(244,240,232,0.88)"
textColor: "#6B6258" / "#211C17"
// (comportement actuel)
```

---

## ORDRE D'IMPLÉMENTATION

1. **Hero full-bleed** (BeforeAfter modifié + HeroSection restructuré + Navbar adapté) — C'EST le changement qui fait tout
2. **StatsSection** — casse le rythme visuel, ajoute de la crédibilité
3. **Atmospherics boost** — monte TOUTES les opacités
4. **Photos** — remplace les images non-painting
5. **Animations** (SplitWords, MagneticButton, 3D hover, column parallax)
6. **Reviews layout** — hero review + side-by-side
7. **Scroll indicator**

## RÈGLES

- Le hero DOIT être full viewport (100vh, min-height 600px pour les petits écrans)
- Le BeforeAfter dans le hero DOIT utiliser le filtre ultra-heavy, pas le filtre léger
- La navbar DOIT être blanche/transparente au-dessus du hero, puis switch au scroll
- `prefers-reduced-motion` : tout respecter, mais les photos restent visibles sans animation
- Mobile : pas de magnetic button, pas de 3D hover, pas de column parallax
- Tester que chaque URL Unsplash charge correctement. Si une ne marche pas, aller sur unsplash.com et chercher une alternative avec le terme entre parenthèses
- NE PAS toucher au formulaire de contact ni au footer (ils sont bien)
- Les counters de StatsSection doivent utiliser `gsap.to()` avec `snap` pour un décompte fluide, pas du JS setTimeout
