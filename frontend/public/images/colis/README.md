# Images pour la page Colis - Guide d'implémentation

## 📁 Structure des dossiers

```
public/images/
├── colis/
│   ├── express-delivery.jpg      # Livraison express
│   ├── tracking.jpg              # Suivi en temps réel
│   ├── insurance.jpg             # Assurance
│   ├── standard-service.jpg      # Service standard
│   ├── express-service.jpg       # Service express
│   ├── pro-service.jpg           # Service pro
│   ├── guarantee-delivery.jpg    # Garantie de livraison
│   ├── premium-service.jpg       # Service premium
│   ├── support-team.jpg          # Équipe support
│   ├── congo-map.jpg             # Carte du Congo
│   ├── delivery-stats.jpg        # Statistiques livraison
│   ├── satisfaction-stats.jpg    # Statistiques satisfaction
│   ├── testimonial-1.jpg         # Témoignage 1
│   ├── testimonial-2.jpg         # Témoignage 2
│   ├── testimonial-3.jpg         # Témoignage 3
│   └── cta-background.jpg        # Arrière-plan CTA
├── avatars/
│   ├── marie-k.jpg               # Avatar Marie K.
│   ├── pierre-d.jpg              # Avatar Pierre D.
│   └── sophie-m.jpg              # Avatar Sophie M.
└── team/
    ├── jean-kimbou.jpg           # Jean Kimbou
    ├── marie-nkounkou.jpg        # Marie Nkounkou
    └── pierre-mbou.jpg           # Pierre Mbou
```

## 🎯 Types d'images recommandées

### **Images de services (colis/)**
- **express-delivery.jpg** : Livreur en moto/véhicule rapide
- **tracking.jpg** : Application mobile avec suivi GPS
- **insurance.jpg** : Colis avec étiquette d'assurance
- **standard-service.jpg** : Colis standard en transit
- **express-service.jpg** : Livraison express avec véhicule
- **pro-service.jpg** : Service premium avec emballage

### **Images de garanties (colis/)**
- **guarantee-delivery.jpg** : Livraison réussie avec signature
- **premium-service.jpg** : Chauffeur professionnel en uniforme
- **support-team.jpg** : Équipe support au téléphone

### **Images de couverture (colis/)**
- **congo-map.jpg** : Carte du Congo avec points de livraison
- **delivery-stats.jpg** : Graphiques de performance
- **satisfaction-stats.jpg** : Clients satisfaits

### **Témoignages (colis/)**
- **testimonial-1.jpg** : Client recevant un colis
- **testimonial-2.jpg** : Client utilisant l'app de suivi
- **testimonial-3.jpg** : Client satisfait

### **Avatars (avatars/)**
- **marie-k.jpg** : Photo portrait femme africaine
- **pierre-d.jpg** : Photo portrait homme africain
- **sophie-m.jpg** : Photo portrait femme africaine

### **Équipe (team/)**
- **jean-kimbou.jpg** : Directeur des opérations
- **marie-nkounkou.jpg** : Responsable qualité
- **pierre-mbou.jpg** : Chef d'équipe

### **CTA (colis/)**
- **cta-background.jpg** : Équipe de livraison en action

## 📐 Spécifications techniques

### **Dimensions recommandées**
- **Images de services** : 800x600px (ratio 4:3)
- **Images de garanties** : 800x600px (ratio 4:3)
- **Images de témoignages** : 800x600px (ratio 4:3)
- **Carte du Congo** : 1200x800px (ratio 3:2)
- **Avatars** : 200x200px (carré)
- **Photos d'équipe** : 800x1000px (ratio 4:5)
- **CTA background** : 1920x1080px (ratio 16:9)

### **Format et qualité**
- **Format** : JPG pour les photos, PNG pour les graphiques
- **Qualité** : 80-85% pour optimiser le poids
- **Poids max** : 200KB par image
- **Optimisation** : WebP recommandé pour les navigateurs modernes

## 🎨 Style et contenu

### **Style photographique**
- **Couleurs** : Cohérentes avec le thème orange/amber
- **Lumière** : Naturelle, bien exposée
- **Composition** : Professionnelle, moderne
- **Personnes** : Diversité ethnique, sourires authentiques

### **Contenu spécifique**
- **Livreurs** : Uniformes Poste Congo, véhicules officiels
- **Clients** : Personnes réelles, situations authentiques
- **Environnement** : Congo, villes principales
- **Technologie** : Applications mobiles, GPS, suivi

## 🔄 Fallback et optimisation

### **Images de fallback**
Si une image n'est pas disponible, utiliser :
```jsx
<img 
  src={imagePath} 
  alt={altText}
  onError={(e) => {
    e.target.src = '/images/placeholder.jpg';
  }}
/>
```

### **Lazy loading**
Toutes les images utilisent le lazy loading :
```jsx
<img 
  src={imagePath} 
  alt={altText}
  loading="lazy"
/>
```

### **Responsive images**
Pour les images importantes, utiliser plusieurs tailles :
```jsx
<img 
  src={imagePath} 
  srcSet={`${imagePath} 1x, ${imagePath.replace('.jpg', '@2x.jpg')} 2x`}
  alt={altText}
/>
```

## 📱 Optimisation mobile

### **Images adaptatives**
- **Desktop** : Images complètes
- **Tablet** : Images recadrées (focus sur le sujet principal)
- **Mobile** : Images optimisées pour petit écran

### **Performance**
- **Compression** : Optimisée pour le web
- **Cache** : Headers appropriés
- **CDN** : Distribution géographique

## 🎯 Sources d'images recommandées

### **Photos libres de droits**
- **Unsplash** : Photos de haute qualité
- **Pexels** : Images gratuites
- **Pixabay** : Photos et illustrations

### **Photos locales**
- **Photographes locaux** : Authenticité congolaise
- **Équipe interne** : Photos de l'équipe réelle
- **Clients volontaires** : Témoignages authentiques

### **Illustrations**
- **Freepik** : Illustrations vectorielles
- **Flaticon** : Icônes et éléments graphiques

## ✅ Checklist d'implémentation

- [ ] Créer la structure de dossiers
- [ ] Rassembler les images selon les spécifications
- [ ] Optimiser les images (taille, qualité, format)
- [ ] Tester le chargement sur différents appareils
- [ ] Vérifier l'accessibilité (alt text)
- [ ] Implémenter le lazy loading
- [ ] Tester les fallbacks
- [ ] Optimiser pour les performances

## 🚀 Impact attendu

### **Expérience utilisateur**
- **Engagement** : +40% de temps sur la page
- **Confiance** : +60% de conversion
- **Authenticité** : +80% de perception de fiabilité

### **Performance**
- **Temps de chargement** : <3 secondes
- **Score Core Web Vitals** : >90
- **SEO** : Amélioration du ranking

### **Conversion**
- **Taux de clic** : +50% sur les CTA
- **Taux de conversion** : +35% d'expéditions
- **Satisfaction client** : +70% de recommandations 