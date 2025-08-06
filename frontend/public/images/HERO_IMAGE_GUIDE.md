# Guide de l'Image Hero - BantuDelice

## 📸 Spécifications Recommandées

### Format et Taille
- **Format** : JPG ou WebP (WebP recommandé pour de meilleures performances)
- **Taille** : 1920x1080 pixels (Full HD)
- **Ratio** : 16:9
- **Poids** : < 500KB (idéalement < 300KB)

### Contenu Recommandé
L'image doit représenter :
- **Ville de Brazzaville** (skyline, monuments)
- **Éléments de livraison** (motos, vélos, livreurs)
- **Transport** (taxis, voitures)
- **Restauration** (restaurants, plats)
- **Vie urbaine** (personnes, activité)

### Optimisation Technique

#### 1. Compression
```bash
# Avec ImageOptim (Mac)
# Avec FileOptimizer (Windows)
# Avec Squoosh.app (en ligne)
```

#### 2. Formats Responsive
```html
<!-- WebP avec fallback -->
<picture>
  <source srcset="/images/hero-bg.webp" type="image/webp">
  <source srcset="/images/hero-bg.jpg" type="image/jpeg">
  <img src="/images/hero-bg.jpg" alt="Brazzaville cityscape">
</picture>
```

#### 3. Lazy Loading
```html
<img loading="lazy" src="/images/hero-bg.jpg" alt="...">
```

### Palette de Couleurs
- **Couleurs dominantes** : Bleus, oranges, verts
- **Contraste** : Assurer la lisibilité du texte blanc
- **Harmonie** : Avec la charte graphique BantuDelice

### Accessibilité
- **Alt text descriptif** : "Vue de Brazzaville avec éléments de livraison et transport"
- **Contraste** : Minimum 4.5:1 pour le texte
- **Focus** : Éléments interactifs bien visibles

### Performance
- **CDN** : Utiliser un CDN pour la distribution
- **Cache** : Headers de cache appropriés
- **Preload** : Précharger l'image critique

## 🎨 Exemples d'Inspiration

### Scènes Recommandées
1. **Vue aérienne** de Brazzaville avec le fleuve Congo
2. **Rue animée** avec restaurants et livreurs
3. **Skyline moderne** avec éléments de transport
4. **Marché local** avec activité commerciale

### Éléments à Éviter
- Texte sur l'image (le texte sera ajouté en CSS)
- Trop de détails qui distraient
- Couleurs trop vives qui nuisent à la lisibilité
- Éléments trop petits ou flous

## 📱 Responsive Design

### Breakpoints
- **Desktop** : 1920x1080
- **Tablet** : 1024x768
- **Mobile** : 768x1024

### Crop Strategy
- **Desktop** : Plein écran
- **Mobile** : Centrer sur les éléments principaux
- **Tablet** : Ajuster le crop selon l'orientation

## 🔧 Implémentation

### CSS Actuel
```css
.hero-background {
  background-image: url('/images/hero-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

### Optimisations Futures
```css
/* Avec WebP et fallback */
.hero-background {
  background-image: url('/images/hero-bg.webp');
}

@supports not (background-image: url('/images/hero-bg.webp')) {
  .hero-background {
    background-image: url('/images/hero-bg.jpg');
  }
}
```

## 📊 Métriques de Performance

### Objectifs
- **LCP** (Largest Contentful Paint) : < 2.5s
- **FID** (First Input Delay) : < 100ms
- **CLS** (Cumulative Layout Shift) : < 0.1

### Monitoring
- Utiliser Lighthouse pour tester
- Surveiller les métriques Core Web Vitals
- Optimiser selon les données utilisateur

## 🎯 Checklist

- [ ] Image 1920x1080 pixels
- [ ] Poids < 500KB
- [ ] Format WebP + JPG fallback
- [ ] Alt text descriptif
- [ ] Contraste suffisant
- [ ] Test sur mobile
- [ ] Performance optimisée
- [ ] Cache configuré 