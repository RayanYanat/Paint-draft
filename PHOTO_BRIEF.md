# PHOTO OVERHAUL — Chaque image doit montrer de la PEINTURE

Le site ressemble à un template d'intérieur design, pas à un site de painting contractor. Aucune photo ne montre du paint, des rouleaux, du ruban, des swatches. Ce brief remplace TOUTES les photos du site par des images métier.

---

## 0. AJOUTER LE DOMAINE PEXELS — `next.config.ts`

Ajouter `images.pexels.com` dans les remotePatterns :

```ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};
```

---

## 1. HERO — Deux images DIFFÉRENTES (vrai before/after)

Le hero utilise déjà la prop `beforeSrc` sur BeforeAfter. L'utiliser avec deux photos SÉPARÉES au lieu du filtre CSS sur la même image.

Dans `HeroSection.tsx`, remplacer :

```ts
const HERO_AFTER = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1920&q=85";
const HERO_BEFORE_FILTER = "grayscale(1) brightness(0.58) contrast(0.78) sepia(0.5) saturate(0.2)";
```

Par :

```ts
const HERO_AFTER  = "https://images.pexels.com/photos/6835156/pexels-photo-6835156.jpeg?auto=compress&cs=tinysrgb&w=1920";
// Salle à manger, mur rouge accent bold — la peinture EST le sujet

const HERO_BEFORE = "https://images.pexels.com/photos/27906722/pexels-photo-27906722.jpeg?auto=compress&cs=tinysrgb&w=1920";
// Pièce vide délabrée, murs qui pèlent, poussière — clairement "il faut un peintre"
```

Et dans le JSX du hero, passer `beforeSrc` :

```tsx
<BeforeAfter
  src={HERO_AFTER}
  beforeSrc={HERO_BEFORE}
  alt={`${company.name} — interior transformation in ${company.city}`}
  overlay
  priority
  sweepFrom={75}
  sweepTo={35}
  sizes="100vw"
  className="w-full h-full"
/>
```

Supprimer `beforeFilter={HERO_BEFORE_FILTER}` — plus besoin de filtre CSS puisqu'on utilise une vraie photo "before".

NOTE : Quand `beforeSrc` est fourni, le BeforeAfter ne doit PAS appliquer de filtre CSS sur l'image before (le code actuel fait déjà ça — `style={{ filter: beforeSrc ? undefined : beforeFilter }}`). Vérifier que c'est bien le cas.

---

## 2. SERVICES — `constants.ts`

Remplacer les 6 images par :

```ts
export const SERVICES = [
  {
    num: "01",
    title: "Interior Painting",
    blurb: "Walls, ceilings, trim, and feature details — crisp lines and a finish that reads flawless up close.",
    img: "https://images.pexels.com/photos/994164/pexels-photo-994164.jpeg?auto=compress&cs=tinysrgb&w=1100",
    // Main qui roule du gris sur un mur — ligne humide visible entre peint et non-peint
  },
  {
    num: "02",
    title: "Exterior Painting",
    blurb: "Siding, stucco, trim, and doors — coatings chosen to hold their color through every season.",
    img: "https://images.pexels.com/photos/16734519/pexels-photo-16734519.jpeg?auto=compress&cs=tinysrgb&w=1100",
    // Deux peintres en blanc sur une échelle, repeignent un mur extérieur bois
  },
  {
    num: "03",
    title: "Cabinet Refinishing",
    blurb: "Kitchens and built-ins, stripped and sprayed to a smooth, durable, factory-grade surface.",
    img: "https://images.pexels.com/photos/7493886/pexels-photo-7493886.jpeg?auto=compress&cs=tinysrgb&w=1100",
    // Personne en tenue de protection qui spray-paint un meuble au pistolet
  },
  {
    num: "04",
    title: "Color Consultation",
    blurb: "A guided palette session — light, undertones, and mood considered before a single coat goes on.",
    img: "https://images.pexels.com/photos/6474474/pexels-photo-6474474.jpeg?auto=compress&cs=tinysrgb&w=1100",
    // Main qui tient des swatches de couleurs contre un mur gris
  },
  {
    num: "05",
    title: "Commercial Painting",
    blurb: "Offices, retail, and tenant spaces — scheduled around your hours, finished without the disruption.",
    img: "https://images.pexels.com/photos/6474133/pexels-photo-6474133.jpeg?auto=compress&cs=tinysrgb&w=1100",
    // Mec au pistolet à peinture spray sur un grand mur — échelle pro
  },
  {
    num: "06",
    title: "Surface Prep & Drywall",
    blurb: "Patching, skim-coating, and sanding — the unseen craft that makes the finished wall look effortless.",
    img: "https://images.pexels.com/photos/7217961/pexels-photo-7217961.jpeg?auto=compress&cs=tinysrgb&w=1100",
    // Application de ruban de masquage bleu (painter's tape) sur un mur blanc
  },
];
```

---

## 3. WORK SECTION — `WorkSection.tsx`

Remplacer le tableau FIGS :

```ts
const FIGS = [
  {
    kind: "photo",
    type: "Interior",
    img: "https://images.unsplash.com/photo-1618158243573-81706465c360?auto=format&fit=crop&w=1200&q=80",
    // Murs bleu et rouge bold contrastés — la peinture domine la pièce
    cls: "lg:col-span-7",
    aspect: "aspect-[4/3]",
  },
  {
    kind: "photo",
    type: "Cabinet Refinishing",
    img: "https://images.unsplash.com/photo-1652918320907-f9ec8623ab30?auto=format&fit=crop&w=1000&q=80",
    // Cuisine avec cabinets verts peints + comptoir marbre — finition visible
    cls: "lg:col-span-5 lg:mt-24",
    aspect: "aspect-[4/5]",
  },
  {
    kind: "ba",
    type: "Before / After",
    img: "https://images.pexels.com/photos/6835156/pexels-photo-6835156.jpeg?auto=compress&cs=tinysrgb&w=1600",
    // Le même mur rouge accent que le hero — cohérence visuelle
    cls: "lg:col-span-12",
    aspect: "aspect-[16/10] sm:aspect-[2/1]",
  },
  {
    kind: "photo",
    type: "Supplies",
    img: "https://images.pexels.com/photos/5641407/pexels-photo-5641407.jpeg?auto=compress&cs=tinysrgb&w=1000",
    // Flat-lay overhead de rouleaux, pinceaux, pots de peinture — pro setup
    cls: "sm:col-span-6 lg:col-span-4",
    aspect: "aspect-[3/4]",
  },
  {
    kind: "photo",
    type: "At Work",
    img: "https://images.unsplash.com/photo-1652829069834-2c05031199c5?auto=format&fit=crop&w=1000&q=80",
    // Peintre en action avec un rouleau sur un mur — action shot
    cls: "sm:col-span-6 lg:col-span-4 lg:mt-16",
    aspect: "aspect-[3/4]",
  },
  {
    kind: "photo",
    type: "Exterior",
    img: "https://images.pexels.com/photos/16734519/pexels-photo-16734519.jpeg?auto=compress&cs=tinysrgb&w=1000",
    // Deux peintres en blanc sur échelle — extérieur bois
    cls: "sm:col-span-6 lg:col-span-4",
    aspect: "aspect-[3/4]",
  },
] as const;
```

---

## 4. VÉRIFICATION

Après implémentation, chaque photo du site doit répondre OUI à cette question : "Est-ce qu'on voit de la peinture, des outils de peinture, ou un résultat de peinture ?" Si la réponse est non, la photo n'a rien à faire sur le site.

Checklist :
- [ ] Hero after : mur rouge accent → OUI
- [ ] Hero before : pièce délabrée, murs qui pèlent → OUI
- [ ] Service 01 : rouleau sur mur, ligne humide → OUI
- [ ] Service 02 : peintres sur échelle → OUI
- [ ] Service 03 : spray-paint au pistolet → OUI
- [ ] Service 04 : swatches de couleurs en main → OUI
- [ ] Service 05 : spray gun sur grand mur → OUI
- [ ] Service 06 : ruban de masquage bleu → OUI
- [ ] Work 01 : murs bleu/rouge bold → OUI
- [ ] Work 02 : cabinets verts peints → OUI
- [ ] Work 03 : before/after slider → OUI
- [ ] Work 04 : flat-lay outils de peinture → OUI
- [ ] Work 05 : peintre avec rouleau → OUI
- [ ] Work 06 : peintres extérieur → OUI

Zéro photo de "joli salon" sans rapport avec la peinture.
