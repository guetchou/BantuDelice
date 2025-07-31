# 📸 Galerie Photo BantuDelice

## 🎯 Vue d'ensemble

La galerie photo de BantuDelice est un composant moderne et interactif qui permet d'afficher des photos de l'équipe, des services et des moments clés de l'entreprise. Elle utilise des technologies modernes pour offrir une expérience utilisateur fluide et professionnelle.

## 🚀 Fonctionnalités

### ✨ Caractéristiques principales
- **Lightbox interactif** : Affichage en plein écran avec navigation
- **Filtrage par catégories** : Service Client, Livraison, Témoignage, etc.
- **Animations fluides** : Utilisation de Framer Motion
- **Design responsive** : Adapté à tous les écrans
- **Chargement optimisé** : Images SVG pour les placeholders
- **Bouton flottant** : Accès rapide depuis toutes les pages

### 🎨 Design
- **Gradients modernes** : Couleurs BantuDelice (orange, pink, purple)
- **Cartes interactives** : Hover effects et transitions
- **Typographie cohérente** : Hiérarchie visuelle claire
- **Icônes Lucide** : Design moderne et cohérent

## 📁 Structure des fichiers

```
frontend/
├── src/
│   ├── components/
│   │   ├── PhotoGallery.tsx          # Composant principal de la galerie
│   │   └── FloatingGalleryButton.tsx # Bouton flottant d'accès rapide
│   ├── pages/
│   │   └── Gallery.tsx               # Page dédiée à la galerie
│   └── routes/
│       └── mainRoutes.tsx            # Route /gallery ajoutée
├── public/
│   └── images/                       # Images SVG placeholder
│       ├── agent-centre-appel.svg
│       ├── livreur-colis.svg
│       ├── client-satisfait.svg
│       ├── equipe-bantudelice.svg
│       ├── service-domicile.svg
│       ├── livreuse-repas.svg
│       ├── entrepot-colis.svg
│       ├── formation-equipe.svg
│       └── livraison-express.svg
└── GALLERY_README.md                 # Ce fichier
```

## 🛠️ Technologies utilisées

### 📦 Dépendances
```json
{
  "framer-motion": "^10.16.4",
  "yet-another-react-lightbox": "^3.12.0",
  "yet-another-react-lightbox/plugins/captions": "^3.12.0"
}
```

### 🎯 Composants principaux
- **React 18** : Framework principal
- **TypeScript** : Typage statique
- **Tailwind CSS** : Styling utilitaire
- **Framer Motion** : Animations
- **Lucide React** : Icônes
- **React Router DOM** : Navigation

## 📖 Utilisation

### 1. Accès à la galerie
- **URL directe** : `http://localhost:9595/#/gallery`
- **Bouton flottant** : Icône caméra en bas à droite
- **Page About** : Lien "Voir notre galerie"

### 2. Navigation dans la galerie
- **Filtres** : Boutons de catégories en haut
- **Lightbox** : Clic sur une image pour agrandir
- **Navigation** : Flèches ou touches clavier dans le lightbox

### 3. Intégration dans d'autres pages
```tsx
import PhotoGallery from '@/components/PhotoGallery';

// Dans votre composant
<PhotoGallery />
```

## 🎨 Personnalisation

### Ajouter de nouvelles images
1. Créer un fichier SVG dans `public/images/`
2. Ajouter l'entrée dans `PhotoGallery.tsx` :

```tsx
const images = [
  // ... autres images
  {
    src: "/images/nouvelle-image.svg",
    title: "Titre de l'image",
    description: "Description de l'image",
    category: "Nouvelle Catégorie",
    icon: NouvelleIcon
  }
];
```

### Modifier les catégories
```tsx
const categories = [
  "Tous",
  "Nouvelle Catégorie",
  // ... autres catégories
];
```

### Personnaliser les couleurs
Les couleurs utilisent les classes Tailwind CSS de BantuDelice :
- **Orange** : `from-orange-500 to-pink-600`
- **Pink** : `from-pink-400 to-purple-500`
- **Purple** : `from-purple-400 to-indigo-500`

## 🔧 Configuration

### Variables d'environnement
Aucune configuration spéciale requise. Les images SVG sont servies statiquement.

### Performance
- **Lazy loading** : Images chargées à la demande
- **Optimisation SVG** : Fichiers vectoriels légers
- **Animations optimisées** : Utilisation de `transform` CSS

## 🐛 Dépannage

### Problèmes courants
1. **Images non chargées** : Vérifier les chemins dans `public/images/`
2. **Animations lentes** : Vérifier les performances du navigateur
3. **Lightbox non fonctionnel** : Vérifier l'installation des dépendances

### Commandes utiles
```bash
# Installer les dépendances
pnpm add framer-motion yet-another-react-lightbox

# Démarrer le serveur de développement
pnpm run dev

# Vérifier les erreurs TypeScript
pnpm run type-check
```

## 📈 Améliorations futures

### 🚀 Fonctionnalités prévues
- [ ] Upload d'images par les utilisateurs
- [ ] Partage sur les réseaux sociaux
- [ ] Mode diaporama automatique
- [ ] Filtres avancés (date, lieu, etc.)
- [ ] Intégration avec une API de photos

### 🎨 Améliorations UI/UX
- [ ] Mode sombre pour la galerie
- [ ] Animations de transition entre pages
- [ ] Zoom sur les images
- [ ] Galerie en grille masonry

## 📞 Support

Pour toute question ou problème avec la galerie photo :
- **Développeur** : Équipe BantuDelice
- **Documentation** : Ce fichier README
- **Issues** : Système de tickets du projet

---

*Dernière mise à jour : Décembre 2024*
*Version : 1.0.0* 