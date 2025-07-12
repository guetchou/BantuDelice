# Configuration Mapbox pour Buntudelice

## 🔑 **Obtenir une clé API Mapbox**

### 1. **Créer un compte Mapbox**
- Allez sur [mapbox.com](https://www.mapbox.com/)
- Créez un compte gratuit
- Accédez à votre dashboard

### 2. **Créer un token d'accès**
- Dans votre dashboard Mapbox
- Allez dans "Access tokens"
- Créez un nouveau token avec les permissions suivantes :
  - `styles:read`
  - `styles:tiles`
  - `geocoding:read`
  - `directions:read`

### 3. **Limites gratuites**
- **50,000 requêtes/mois** pour le géocodage
- **5,000 requêtes/mois** pour les directions
- **50,000 tuiles/mois** pour les cartes

## ⚙️ **Configuration dans le projet**

### 1. **Variables d'environnement**

Créez ou modifiez votre fichier `.env.local` :

```bash
# Mapbox Configuration
VITE_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_access_token_here
```

### 2. **Fichier de configuration**

Le fichier `src/config/mapbox.ts` gère automatiquement :
- L'initialisation de Mapbox
- La gestion des erreurs
- Les utilitaires de géocodage
- Le calcul d'itinéraires

### 3. **Utilisation dans les composants**

```tsx
import { useMapboxAvailability } from '@/components/maps/MapboxProvider';
import { MAPBOX_CONFIG } from '@/config/mapbox';

const MyMapComponent = () => {
  const { canUseMapbox, error } = useMapboxAvailability();

  if (!canUseMapbox) {
    return <div>Erreur: {error}</div>;
  }

  // Votre composant de carte ici
};
```

## 🗺️ **Fonctionnalités disponibles**

### **Géocodage**
```tsx
import { geocodeAddress } from '@/config/mapbox';

const address = await geocodeAddress("Brazzaville, Congo");
```

### **Géocodage inverse**
```tsx
import { reverseGeocode } from '@/config/mapbox';

const location = await reverseGeocode([15.2429, -4.2634]);
```

### **Calcul d'itinéraire**
```tsx
import { calculateRoute } from '@/config/mapbox';

const route = await calculateRoute(
  [15.2429, -4.2634], // Point de départ
  [15.3000, -4.2000], // Destination
  'driving' // Mode de transport
);
```

### **Calcul de distance**
```tsx
import { calculateDistance, formatDistance } from '@/config/mapbox';

const distance = calculateDistance(lat1, lng1, lat2, lng2);
const formattedDistance = formatDistance(distance);
```

## 🔧 **Configuration avancée**

### **Styles de carte personnalisés**
```tsx
// Dans votre composant de carte
const map = new mapboxgl.Map({
  container: mapContainer.current,
  style: 'mapbox://styles/mapbox/streets-v12', // Style par défaut
  // Ou utilisez votre style personnalisé :
  // style: 'mapbox://styles/your-username/your-style-id',
  center: MAPBOX_CONFIG.defaultCenter,
  zoom: MAPBOX_CONFIG.defaultZoom
});
```

### **Styles disponibles**
- `mapbox://styles/mapbox/streets-v12` - Rues (par défaut)
- `mapbox://styles/mapbox/outdoors-v12` - Extérieur
- `mapbox://styles/mapbox/light-v11` - Clair
- `mapbox://styles/mapbox/dark-v11` - Sombre
- `mapbox://styles/mapbox/satellite-v9` - Satellite
- `mapbox://styles/mapbox/satellite-streets-v12` - Satellite avec rues

## 🚀 **Déploiement**

### **Variables d'environnement en production**
- Ajoutez `VITE_MAPBOX_ACCESS_TOKEN` à vos variables d'environnement de production
- Vérifiez que la clé a les bonnes permissions
- Surveillez l'utilisation dans votre dashboard Mapbox

### **Sécurité**
- Ne partagez jamais votre clé API publiquement
- Utilisez des restrictions de domaine si possible
- Surveillez régulièrement l'utilisation de votre compte

## 📊 **Monitoring et optimisation**

### **Surveillance de l'utilisation**
- Dashboard Mapbox → Usage
- Surveillez les requêtes de géocodage
- Surveillez les requêtes de directions
- Surveillez l'utilisation des tuiles

### **Optimisation**
- Mettez en cache les résultats de géocodage
- Limitez les requêtes inutiles
- Utilisez des bounds pour limiter les recherches
- Implémentez une pagination pour les résultats

## 🛠️ **Dépannage**

### **Erreurs courantes**

1. **"Mapbox access token is not configured"**
   - Vérifiez que `VITE_MAPBOX_ACCESS_TOKEN` est défini
   - Redémarrez votre serveur de développement

2. **"Failed to initialize Mapbox"**
   - Vérifiez que la clé API est valide
   - Vérifiez les permissions de la clé

3. **"Geocoding failed"**
   - Vérifiez votre quota mensuel
   - Vérifiez la validité de l'adresse

### **Test de la configuration**
```tsx
import { isMapboxAvailable } from '@/config/mapbox';

console.log('Mapbox disponible:', isMapboxAvailable());
```

## 💡 **Conseils**

1. **Commencez avec le plan gratuit** pour tester
2. **Surveillez votre utilisation** pour éviter les dépassements
3. **Mettez en cache** les résultats fréquemment utilisés
4. **Utilisez des bounds** pour limiter les recherches géographiques
5. **Testez en local** avant de déployer

## 📞 **Support**

- [Documentation Mapbox](https://docs.mapbox.com/)
- [Support Mapbox](https://support.mapbox.com/)
- [Pricing Mapbox](https://www.mapbox.com/pricing) 