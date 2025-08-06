# 🗺️ Guide d'Utilisation - Carte de Suivi de Colis

## 📍 **Fonctionnalités de la Carte**

### ✅ **Ce qui est Disponible**

1. **🗺️ Carte Interactive**
   - Affichage de la position actuelle du colis
   - Points d'intérêt (expéditeur et destinataire)
   - Itinéraire de livraison
   - Interface responsive et moderne

2. **📍 Localisation en Temps Réel**
   - Coordonnées GPS précises
   - Mise à jour automatique de la position
   - Horodatage des dernières mises à jour

3. **🛣️ Informations d'Itinéraire**
   - Distance restante
   - Temps estimé d'arrivée
   - Points de passage

## 🚀 **Comment Utiliser la Carte**

### **1. Accès à la Carte**
```
URL: http://10.10.0.5:9595/#/colis/tracking
```

### **2. Recherche d'un Colis**
1. Entrez le numéro de suivi dans le champ de recherche
2. Cliquez sur "Rechercher"
3. La carte s'affiche automatiquement avec la position du colis

### **3. Affichage de la Carte**
- **Carte principale** : Position actuelle du colis
- **Points colorés** :
  - 🔴 **Rouge** : Position du colis
  - 🔵 **Bleu** : Expéditeur
  - 🟢 **Vert** : Destinataire
- **Ligne bleue** : Itinéraire de livraison

## 📱 **Fonctionnalités Avancées**

### **Pour Utilisateurs Connectés**
- **GPS Temps Réel** : Bouton "Activer GPS" pour suivi en direct
- **Informations du chauffeur** : Photo, nom, téléphone
- **Mise à jour automatique** : Toutes les 10 secondes

### **Pour Tous les Utilisateurs**
- **Carte statique** : Position actuelle du colis
- **Informations de base** : Coordonnées, statut, horaires
- **Partage** : Lien direct vers le suivi

## 🎯 **États de la Carte**

### **✅ Colis en Transit**
- Carte affichée avec position actuelle
- Itinéraire visible
- Mise à jour en temps réel

### **✅ Colis Livré**
- Position finale affichée
- Statut "Livré" visible
- Horodatage de livraison

### **⚠️ Colis en Attente**
- Carte sans position actuelle
- Message "Localisation en cours"
- Informations de base disponibles

### **❌ Colis Annulé**
- Carte désactivée
- Message d'annulation
- Pas de position affichée

## 🔧 **Configuration Technique**

### **Données Requises**
```typescript
interface TrackingInfo {
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  lastUpdate?: Date;
  route?: {
    distance: number;
    duration: number;
    waypoints: Array<{ lat: number; lng: number }>;
  };
}
```

### **Composants Utilisés**
- `ColisMap` : Carte principale
- `RealTimeTracking` : Suivi GPS temps réel
- `TrackingMap` : Carte simplifiée

## 📊 **Exemple d'Utilisation**

### **URLs de Suivi**
```
Recherche: http://10.10.0.5:9595/#/colis/tracking
Public: http://10.10.0.5:9595/#/colis/tracking/BD616084
```

### **Données d'Exemple**
```json
{
  "trackingNumber": "BD616084",
  "status": "in_transit",
  "currentLocation": {
    "latitude": 6.5244,
    "longitude": 3.3792
  },
  "route": {
    "distance": 1250,
    "duration": 180,
    "waypoints": [
      {"lat": 6.5244, "lng": 3.3792},
      {"lat": 5.3600, "lng": -4.0083}
    ]
  }
}
```

## 🎨 **Interface Utilisateur**

### **Éléments Visuels**
- **Carte interactive** avec grille
- **Points colorés** pour les positions
- **Ligne d'itinéraire** avec flèches
- **Légende** explicative
- **Informations détaillées** en dessous

### **Responsive Design**
- **Desktop** : Carte complète avec toutes les informations
- **Tablet** : Carte adaptée avec informations essentielles
- **Mobile** : Carte compacte avec navigation tactile

## 🔍 **Dépannage**

### **Carte ne s'affiche pas**
1. Vérifiez que le numéro de suivi est valide
2. Actualisez la page
3. Vérifiez la connexion internet

### **Position incorrecte**
1. Vérifiez les données GPS
2. Attendez la prochaine mise à jour
3. Contactez le support

### **Carte lente**
1. Vérifiez la connexion internet
2. Désactivez le suivi temps réel
3. Utilisez la carte statique

## 🚀 **Améliorations Futures**

### **Fonctionnalités Prévues**
- Intégration Google Maps/Leaflet
- Géolocalisation précise
- Notifications push
- Historique des positions
- Estimation de livraison améliorée

### **Optimisations**
- Cache des cartes
- Compression des données
- Mise à jour optimisée
- Interface plus fluide

---

**Status** : ✅ **FONCTIONNEL ET PRÊT**
**Version** : 1.0
**Dernière mise à jour** : $(date) 