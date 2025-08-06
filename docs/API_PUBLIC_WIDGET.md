# 🌐 API Publique & Widget BantuDelice - Documentation

## 📋 Vue d'ensemble
API publique et widget JavaScript permettant à d'autres applications/sites d'intégrer le suivi de colis BantuDelice.

## 🔑 API Publique

### Endpoints disponibles

#### 1. Suivi Colis National
```
GET /api/public/colis-national/{trackingNumber}
```

**Paramètres :**
- `trackingNumber` (string) : Numéro de suivi du colis

**Réponse :**
```json
{
  "success": true,
  "data": {
    "trackingNumber": "123456",
    "status": "En cours de livraison",
    "villeDepart": "Brazzaville",
    "villeArrivee": "Pointe-Noire",
    "timeline": [
      {
        "label": "Pris en charge",
        "date": "2024-07-18 09:00",
        "location": "Brazzaville"
      }
    ]
  }
}
```

#### 2. Suivi Colis International
```
GET /api/public/colis-international/{trackingNumber}
```

**Paramètres :**
- `trackingNumber` (string) : Numéro de suivi du colis

**Réponse :**
```json
{
  "success": true,
  "data": {
    "trackingNumber": "DHL123456789",
    "status": "En transit",
    "transporteur": "DHL",
    "paysDepart": "Allemagne",
    "paysArrivee": "Congo",
    "timeline": [
      {
        "label": "Pris en charge",
        "date": "2024-07-17 08:00",
        "location": "Berlin, Allemagne"
      }
    ]
  }
}
```

#### 3. Suivi Universel (Auto-détection)
```
GET /api/public/colis/{trackingNumber}
```

**Paramètres :**
- `trackingNumber` (string) : Numéro de suivi du colis

**Réponse :**
```json
{
  "success": true,
  "data": {
    "trackingNumber": "123456",
    "type": "national",
    "status": "En cours de livraison",
    "timeline": [...]
  }
}
```

### Authentification

#### Clé API
```bash
curl -X GET "https://api.bantudelice.cg/api/public/colis/123456" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Accept: application/json"
```

#### Obtenir une clé API
1. Créer un compte sur https://developer.bantudelice.com/
2. Générer une clé API dans le dashboard
3. Utiliser la clé dans les headers de vos requêtes

### Limites
- **Plan gratuit** : 100 appels/mois
- **Plan pro** : 1000 appels/mois
- **Plan entreprise** : Illimité

## 🎨 Widget JavaScript

### Installation

#### 1. Inclure le script
```html
<script src="https://widget.bantudelice.com/tracking-widget.js"></script>
```

#### 2. Initialiser le widget
```html
<div id="bantudelice-tracking-widget"></div>

<script>
  BantuDeliceWidget.init({
    apiKey: 'YOUR_API_KEY',
    containerId: 'bantudelice-tracking-widget',
    theme: 'light', // 'light' ou 'dark'
    language: 'fr', // 'fr', 'en', 'de'
    showLogo: true
  });
</script>
```

### Configuration

#### Options disponibles
```javascript
{
  apiKey: 'YOUR_API_KEY',           // Requis
  containerId: 'widget-container',   // Requis
  theme: 'light',                   // Optionnel: 'light' ou 'dark'
  language: 'fr',                   // Optionnel: 'fr', 'en', 'de'
  showLogo: true,                   // Optionnel: afficher le logo BantuDelice
  height: '400px',                  // Optionnel: hauteur du widget
  width: '100%',                    // Optionnel: largeur du widget
  onTrackingComplete: function(data) {
    // Callback appelé quand le suivi est terminé
    console.log('Tracking data:', data);
  }
}
```

### Exemple complet
```html
<!DOCTYPE html>
<html>
<head>
  <title>Mon Site E-commerce</title>
  <script src="https://widget.bantudelice.com/tracking-widget.js"></script>
</head>
<body>
  <h1>Suivi de votre commande</h1>
  
  <div id="tracking-widget"></div>
  
  <script>
    BantuDeliceWidget.init({
      apiKey: 'your_api_key_here',
      containerId: 'tracking-widget',
      theme: 'light',
      language: 'fr',
      showLogo: true,
      onTrackingComplete: function(data) {
        // Mettre à jour le statut de la commande
        updateOrderStatus(data.status);
      }
    });
  </script>
</body>
</html>
```

## 🔧 Intégration avancée

### API REST personnalisée
```javascript
// Exemple avec fetch
async function trackParcel(trackingNumber) {
  const response = await fetch(`https://api.bantudelice.cg/api/public/colis/${trackingNumber}`, {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Accept': 'application/json'
    }
  });
  
  const data = await response.json();
  return data;
}

// Utilisation
trackParcel('123456').then(result => {
  console.log('Status:', result.data.status);
  console.log('Timeline:', result.data.timeline);
});
```

### Webhook pour notifications
```javascript
// Configuration webhook
const webhookConfig = {
  url: 'https://your-site.com/webhook/tracking',
  events: ['status_changed', 'delivered']
};

// Recevoir les notifications
app.post('/webhook/tracking', (req, res) => {
  const { trackingNumber, status, event } = req.body;
  
  // Traiter la notification
  notifyCustomer(trackingNumber, status);
  
  res.status(200).json({ received: true });
});
```

## 📊 Statistiques d'utilisation

### Métriques disponibles
- Nombre d'appels API/mois
- Widgets actifs
- Taux de succès
- Temps de réponse moyen

### Dashboard développeur
- Accès sur : https://developer.bantudelice.com/dashboard
- Visualisation des métriques
- Gestion des clés API
- Configuration des webhooks

## 🚨 Gestion des erreurs

### Codes d'erreur
```json
{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Clé API invalide",
    "details": "Vérifiez votre clé API"
  }
}
```

### Codes d'erreur courants
- `INVALID_API_KEY` : Clé API invalide ou expirée
- `RATE_LIMIT_EXCEEDED` : Limite d'appels dépassée
- `TRACKING_NOT_FOUND` : Numéro de suivi non trouvé
- `INVALID_TRACKING_NUMBER` : Format de numéro invalide

## 🔐 Sécurité

### Bonnes pratiques
1. **Ne jamais exposer la clé API** dans le code frontend
2. **Utiliser HTTPS** pour toutes les communications
3. **Implémenter un rate limiting** côté client
4. **Valider les données** avant affichage

### Exemple sécurisé
```javascript
// ✅ Bon : Clé API côté serveur
app.get('/api/tracking/:number', async (req, res) => {
  const result = await fetch(`https://api.bantudelice.cg/api/public/colis/${req.params.number}`, {
    headers: { 'Authorization': `Bearer ${process.env.BANTUDELICE_API_KEY}` }
  });
  res.json(await result.json());
});

// ❌ Mauvais : Clé API côté client
const apiKey = 'your_key_here'; // Ne jamais faire ça
```

## 📞 Support

### Contact
- **Email** : api-support@bantudelice.com
- **Documentation** : https://docs.bantudelice.com/api
- **Discord** : https://discord.gg/bantudelice

### SLA
- **Plan gratuit** : Support par email (48h)
- **Plan pro** : Support par email (24h)
- **Plan entreprise** : Support par phone/email (4h)

---

**Dernière mise à jour** : 2024-07-18  
**Version** : 1.0.0  
**Auteur** : Équipe BantuDelice 