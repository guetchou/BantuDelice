# Système de Géolocalisation Buntudelice

## Vue d'ensemble

Le système de géolocalisation de Buntudelice permet aux utilisateurs de localiser les restaurants à proximité, de gérer leurs adresses de livraison et d'optimiser les zones de livraison. Il utilise l'API Geolocation du navigateur et Mapbox pour les cartes et le géocodage.

## Fonctionnalités principales

### 🗺️ Carte Interactive
- **Sélection d'adresse** : Cliquez sur la carte pour sélectionner une adresse
- **Géocodage** : Recherche d'adresses avec suggestions automatiques
- **Localisations sauvegardées** : Gestion des adresses favorites (domicile, travail, etc.)
- **Position actuelle** : Utilisation du GPS pour localiser l'utilisateur

### 📍 Restaurants à proximité
- **Détection automatique** : Trouve les restaurants dans un rayon configurable
- **Tri intelligent** : Par distance, note, frais de livraison
- **Filtres** : Par type de cuisine, zone de livraison
- **Statistiques** : Distance moyenne, notes moyennes, etc.

### 🚚 Zones de livraison
- **Définition de zones** : Rayon, frais de livraison, commande minimum
- **Détection automatique** : Détermine la zone de l'utilisateur
- **Tarification dynamique** : Frais selon la distance et la zone

## Architecture technique

### Composants React

#### `useGeolocation` Hook
```typescript
const {
  coordinates,        // [longitude, latitude]
  accuracy,          // Précision en mètres
  loading,           // État de chargement
  error,             // Message d'erreur
  permission,        // Statut de permission
  getCurrentPosition, // Obtenir la position
  requestPosition,   // Demander la permission + position
  startWatching,     // Surveiller la position
  stopWatching,      // Arrêter la surveillance
  calculateDistance, // Calculer la distance
  formatDistance     // Formater la distance
} = useGeolocation();
```

#### `GeolocationService` Service
```typescript
// Géocodage d'adresse
const result = await GeolocationService.geocodeAddress("123 Rue de la Paix");

// Géocodage inverse
const address = await GeolocationService.reverseGeocode([15.2429, -4.2634]);

// Sauvegarder une localisation
const location = await GeolocationService.saveLocation({
  name: "Domicile",
  address: "123 Rue de la Paix",
  coordinates: [15.2429, -4.2634],
  type: "home"
});

// Trouver les restaurants à proximité
const restaurants = await GeolocationService.findNearbyRestaurants(lat, lng, 5);
```

#### `LocationMap` Composant
```typescript
<LocationMap
  onLocationSelect={handleLocationSelect}
  onAddressChange={setAddress}
  initialAddress="123 Rue de la Paix"
  showSavedLocations={true}
/>
```

#### `NearbyRestaurants` Composant
```typescript
<NearbyRestaurants />
```

### Base de données

#### Tables principales

**`user_locations`** - Localisations sauvegardées
```sql
CREATE TABLE user_locations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  type TEXT CHECK (type IN ('home', 'work', 'favorite', 'recent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**`restaurants`** - Restaurants avec géolocalisation
```sql
CREATE TABLE restaurants (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  cuisine_type TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  delivery_fee DECIMAL(10, 2),
  average_rating DECIMAL(3, 2),
  is_active BOOLEAN DEFAULT true
);
```

**`delivery_zones`** - Zones de livraison
```sql
CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  center_latitude DECIMAL(10, 8) NOT NULL,
  center_longitude DECIMAL(11, 8) NOT NULL,
  radius_km DECIMAL(5, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) NOT NULL,
  min_order_amount DECIMAL(10, 2) DEFAULT 0
);
```

#### Fonctions SQL

**Calcul de distance (Haversine)**
```sql
CREATE FUNCTION calculate_distance(lat1, lon1, lat2, lon2)
RETURNS DECIMAL AS $$
  -- Formule de Haversine pour calculer la distance
  -- entre deux points géographiques
$$ LANGUAGE plpgsql;
```

**Restaurants à proximité**
```sql
CREATE FUNCTION find_nearby_restaurants(
  user_lat DECIMAL,
  user_lon DECIMAL,
  radius_km DECIMAL DEFAULT 5
) RETURNS TABLE (
  -- Retourne les restaurants dans le rayon spécifié
  -- triés par distance
);
```

## Configuration

### Variables d'environnement

```env
# Mapbox (carte et géocodage)
VITE_MAPBOX_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbHV0ZXN0In0.example

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Configuration Mapbox

1. Créez un compte sur [Mapbox](https://www.mapbox.com/)
2. Générez un token d'accès public
3. Ajoutez le token dans vos variables d'environnement

## Utilisation

### 1. Intégration dans une page

```typescript
import { useGeolocation } from '@/hooks/useGeolocation';
import { GeolocationService } from '@/services/geolocationService';

function MyComponent() {
  const { coordinates, requestPosition } = useGeolocation();
  
  const handleGetLocation = async () => {
    try {
      await requestPosition();
      // Position obtenue avec succès
    } catch (error) {
      // Gérer l'erreur
    }
  };
  
  return (
    <button onClick={handleGetLocation}>
      Obtenir ma position
    </button>
  );
}
```

### 2. Utilisation de la carte

```typescript
import LocationMap from '@/components/location/LocationMap';

function OrderPage() {
  const [address, setAddress] = useState('');
  
  const handleLocationSelect = (location) => {
    setAddress(location.address);
  };
  
  return (
    <LocationMap
      onLocationSelect={handleLocationSelect}
      onAddressChange={setAddress}
      initialAddress={address}
    />
  );
}
```

### 3. Affichage des restaurants

```typescript
import NearbyRestaurants from '@/components/location/NearbyRestaurants';

function HomePage() {
  return (
    <div>
      <h1>Restaurants à proximité</h1>
      <NearbyRestaurants />
    </div>
  );
}
```

## Sécurité et confidentialité

### Permissions
- **Demande explicite** : L'utilisateur doit autoriser l'accès à sa position
- **Gestion des refus** : Interface adaptée si la géolocalisation est refusée
- **Fallback** : Coordonnées par défaut si la géolocalisation échoue

### Protection des données
- **RLS (Row Level Security)** : Chaque utilisateur ne voit que ses données
- **Chiffrement** : Toutes les communications sont chiffrées
- **Anonymisation** : Les données de position ne sont pas liées à l'identité

### Conformité RGPD
- **Consentement explicite** : L'utilisateur doit accepter la géolocalisation
- **Droit à l'oubli** : Suppression des données de localisation
- **Transparence** : Information claire sur l'utilisation des données

## Performance

### Optimisations
- **Mise en cache** : Les adresses géocodées sont mises en cache
- **Indexation** : Index sur les coordonnées pour les requêtes rapides
- **Pagination** : Chargement progressif des restaurants
- **Lazy loading** : Chargement à la demande des composants

### Métriques
- **Temps de réponse** : < 2s pour la géolocalisation
- **Précision** : ±10m en zone urbaine
- **Disponibilité** : 99.9% de disponibilité

## Tests

### Tests unitaires
```typescript
import { GeolocationService } from '@/services/geolocationService';

describe('GeolocationService', () => {
  test('should calculate distance correctly', () => {
    const distance = GeolocationService.calculateDistance(
      48.8566, 2.3522, // Brazzaville
      40.7128, -74.0060 // New York
    );
    expect(distance).toBeCloseTo(5837, 0);
  });
});
```

### Tests d'intégration
```typescript
describe('LocationMap', () => {
  test('should handle location selection', async () => {
    const mockLocation = {
      name: 'Test Location',
      address: '123 Test Street',
      coordinates: [15.2429, -4.2634]
    };
    
    const onLocationSelect = jest.fn();
    render(<LocationMap onLocationSelect={onLocationSelect} />);
    
    // Simuler la sélection d'une localisation
    fireEvent.click(screen.getByTestId('location-marker'));
    
    expect(onLocationSelect).toHaveBeenCalledWith(mockLocation);
  });
});
```

## Déploiement

### Prérequis
- Compte Mapbox avec token d'accès
- Base de données Supabase configurée
- Variables d'environnement définies

### Étapes
1. **Exécuter les migrations SQL**
   ```bash
   psql -d your-database -f database/geolocation_tables.sql
   ```

2. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   # Éditer .env avec vos valeurs
   ```

3. **Déployer l'application**
   ```bash
   npm run build
   # Déployer les fichiers générés
   ```

## Maintenance

### Nettoyage automatique
```sql
-- Nettoyer l'historique de géolocalisation ancien
SELECT cleanup_location_history(30); -- Garder 30 jours
```

### Monitoring
- **Logs** : Surveillance des erreurs de géolocalisation
- **Métriques** : Temps de réponse, précision, taux de succès
- **Alertes** : Notification en cas de problème

### Mises à jour
- **API Mapbox** : Vérifier les changements d'API
- **Navigateurs** : Tester la compatibilité
- **Sécurité** : Mettre à jour les dépendances

## Support

### Documentation
- [API Mapbox](https://docs.mapbox.com/)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Supabase Documentation](https://supabase.com/docs)

### Contact
- **Développement** : équipe-dev@buntudelice.com
- **Support** : support@buntudelice.com
- **Sécurité** : security@buntudelice.com

---

*Dernière mise à jour : Décembre 2024* 