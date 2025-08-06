# Composants de la Page d'Accueil

Ce dossier contient les composants modulaires de la page d'accueil de BantuDelice, organisés pour une meilleure maintenabilité et réutilisabilité.

## Structure

```
home/
├── index.ts                    # Exports de tous les composants
├── HeroSection.tsx            # Section hero principale avec image immersive
├── ServicesSection.tsx        # Section des services principaux
├── TrendingServicesSection.tsx # Section des services tendances
├── TestimonialsSection.tsx    # Section des témoignages clients
├── MobileAppSection.tsx       # Section de téléchargement de l'app
└── README.md                  # Documentation
```

## Composants

### HeroSection 🎨
- **Responsabilité** : Section d'accueil principale avec image de fond immersive
- **Fonctionnalités** : 
  - Image de fond responsive (1920x1080 desktop, 768x1024 mobile)
  - Support WebP avec fallback JPG
  - Overlay dégradé pour lisibilité optimale
  - Navigation et call-to-action
  - Animations et particules décoratives
- **Optimisations** :
  - `fetchPriority="high"` pour l'image critique
  - `loading="eager"` pour le LCP optimal
  - Composant `OptimizedImage` pour la gestion des formats
- **Réutilisabilité** : Peut être adapté pour d'autres pages

### ServicesSection
- **Responsabilité** : Affichage de la grille des services principaux
- **Fonctionnalités** : Navigation vers les services, animations au hover
- **Données** : Liste des services avec icônes, descriptions et chemins

### TrendingServicesSection
- **Responsabilité** : Services populaires avec badges
- **Fonctionnalités** : Badges de statut, navigation
- **Données** : Services tendances avec badges (Disponible, Promo, Express)

### TestimonialsSection
- **Responsabilité** : Témoignages clients avec évaluations
- **Fonctionnalités** : Affichage des avis, étoiles, informations utilisateur
- **Données** : Témoignages avec noms, localisations, textes et notes

### MobileAppSection
- **Responsabilité** : Promotion de l'application mobile
- **Fonctionnalités** : Boutons de téléchargement, mockup téléphone
- **Réutilisabilité** : Peut être utilisé sur d'autres pages

## 🖼️ Image Hero - Spécifications

### Formats Requis
```
frontend/public/images/
├── hero-bg.jpg              # Desktop JPG (1920x1080, <500KB)
├── hero-bg.webp             # Desktop WebP (1920x1080, <300KB)
├── hero-bg-mobile.jpg       # Mobile JPG (768x1024, <300KB)
└── hero-bg-mobile.webp      # Mobile WebP (768x1024, <200KB)
```

### Contenu Recommandé
- **Ville de Brazzaville** (skyline, monuments)
- **Éléments de livraison** (motos, vélos, livreurs)
- **Transport** (taxis, voitures)
- **Restauration** (restaurants, plats)
- **Vie urbaine** (personnes, activité)

### Optimisation Automatique
```bash
# Installer les dépendances
npm install sharp

# Exécuter le script d'optimisation
node scripts/optimize-images.js
```

## Avantages de cette approche

### 1. Maintenabilité ⚡
- Chaque section est maintenant un composant indépendant
- Modifications isolées sans risque d'impact sur les autres
- Code plus lisible et organisé

### 2. Réutilisabilité 🔄
- Les composants peuvent être réutilisés sur d'autres pages
- Import/export centralisé via `index.ts`
- Configuration flexible

### 3. Testabilité 🧪
- Tests unitaires plus faciles à écrire
- Isolation des fonctionnalités
- Mocking simplifié

### 4. Performance 🚀
- Images optimisées avec WebP et responsive
- Lazy loading pour les images non critiques
- Bundle splitting potentiel
- Métriques Core Web Vitals optimisées

### 5. Collaboration 👥
- Développement en parallèle possible
- Conflits Git réduits
- Code review plus efficace

### 6. Accessibilité ♿
- Alt text descriptif pour l'image hero
- Contraste optimisé avec overlay
- Navigation clavier supportée
- ARIA labels appropriés

## Utilisation

```tsx
import {
  HeroSection,
  ServicesSection,
  TrendingServicesSection,
  TestimonialsSection,
  MobileAppSection
} from "@/components/home";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <ServicesSection />
      <TrendingServicesSection />
      <TestimonialsSection />
      <MobileAppSection />
    </div>
  );
}
```

## 🎯 Optimisations Performance

### Images
- **WebP** avec fallback JPG
- **Responsive** (desktop + mobile)
- **Compression** optimisée (<500KB)
- **Preload** pour l'image critique

### CSS
- **Backdrop blur** pour les overlays
- **Drop shadows** pour la lisibilité
- **Animations** optimisées avec CSS

### JavaScript
- **Lazy loading** pour les composants non critiques
- **Code splitting** par section
- **Memoization** des composants lourds

## Bonnes pratiques

1. **Responsabilité unique** : Chaque composant a une seule responsabilité
2. **Props minimales** : Utiliser les données locales quand possible
3. **Accessibilité** : Maintenir les attributs ARIA et la navigation clavier
4. **Performance** : Optimiser les re-renders avec React.memo si nécessaire
5. **Documentation** : Commenter les logiques complexes
6. **Images** : Toujours optimiser et fournir des alternatives

## Évolutions futures

- [ ] Ajout de tests unitaires pour chaque composant
- [ ] Implémentation de lazy loading avancé
- [ ] Ajout d'animations avec Framer Motion
- [ ] Internationalisation des textes
- [ ] Thèmes et personnalisation
- [ ] Support des images AVIF
- [ ] Optimisation automatique des images via CI/CD 