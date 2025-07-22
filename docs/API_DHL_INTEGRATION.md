# 🔑 Intégration API DHL - Documentation Complète

## 📋 Vue d'ensemble
Ce document décrit l'intégration de l'API DHL pour le suivi de colis internationaux dans l'application BantuDelice.

## 🚀 Procédure d'obtention de la clé API DHL

### 1. Créer un compte développeur
- Aller sur : https://developer.dhl.com/
- Cliquer sur "Sign Up" ou "Create Account"
- Remplir le formulaire avec les informations requises
- Vérifier l'email et activer le compte

### 2. Accéder au portail développeur
- Se connecter sur : https://developer.dhl.com/
- Aller dans "My Account" ou "Dashboard"
- Naviguer vers "API Keys" ou "Credentials"

### 3. Souscrire à l'API Tracking
- Dans le catalogue d'APIs, chercher "DHL Parcel DE API"
- Cliquer sur "Subscribe" ou "Get API Key"
- Choisir le plan gratuit (limité à X appels/mois)

### 4. Obtenir les credentials
- **API Key** : clé principale pour l'authentification
- **Client ID** : identifiant de l'application
- **Client Secret** : secret pour l'authentification OAuth2
- **Base URL** : `https://api.dhl.com/parcel/de/v1/`

## ⚙️ Configuration

### Variables d'environnement
```env
DHL_API_KEY=your_dhl_api_key_here
```

### Installation des dépendances
```bash
npm install @nestjs/config
```

## 🔧 Utilisation

### Endpoint de suivi
```
GET /colis-international/{trackingNumber}
```

### Exemple d'appel
```bash
curl -X GET "http://localhost:3000/colis-international/DHL123456789" \
  -H "Accept: application/json"
```

### Réponse attendue
```json
{
  "trackingNumber": "DHL123456789",
  "status": "En transit",
  "transporteur": "DHL",
  "paysDepart": "Allemagne",
  "paysArrivee": "Congo",
  "timeline": [
    {
      "label": "Pris en charge",
      "date": "2024-07-17 08:00",
      "location": "Berlin, Allemagne",
      "description": "Colis pris en charge par DHL"
    },
    {
      "label": "En transit",
      "date": "2024-07-17 13:00",
      "location": "Centre de tri DHL",
      "description": "Colis en cours d'acheminement"
    }
  ]
}
```

## 🛠️ Structure du code

### Service DHL (`dhl.service.ts`)
```typescript
@Injectable()
export class DhlService {
  async trackParcel(trackingNumber: string) {
    // Appel à l'API DHL
    // Parsing de la réponse
    // Retour des données formatées
  }
}
```

### Contrôleur (`colis-international.controller.ts`)
```typescript
@Controller('colis-international')
export class ColisInternationalController {
  @Get(':trackingNumber')
  async getColisInternational(@Param('trackingNumber') trackingNumber: string) {
    // Utilise le service DHL
    // Fallback vers mock si erreur
  }
}
```

## 🔄 Détection automatique

### Logique de détection
- **National** : numéros simples (ex: 123456)
- **International** : numéros complexes (ex: DHL123456789, 1Z999AA1234567890)

### Format des numéros
- **DHL** : généralement 10-14 caractères
- **FedEx** : 12 caractères
- **UPS** : 18 caractères
- **National** : 6-8 chiffres

## 📊 Limites et quotas

### Plan gratuit DHL
- **Appels/mois** : 100-1000 (selon le plan)
- **Rate limiting** : 10 appels/minute
- **Support** : Documentation uniquement

### Plan payant
- **Appels/mois** : Illimité
- **Support** : Email/phone
- **Prix** : Contact DHL Business

## 🚨 Gestion des erreurs

### Erreurs courantes
- **401** : Clé API invalide
- **404** : Numéro de tracking non trouvé
- **429** : Rate limit dépassé
- **500** : Erreur serveur DHL

### Fallback
Si l'API DHL n'est pas disponible :
- Utilisation des données mock
- Log de l'erreur
- Message utilisateur approprié

## 🔐 Sécurité

### Bonnes pratiques
- Ne jamais exposer la clé API côté frontend
- Utiliser des variables d'environnement
- Implémenter un rate limiting côté serveur
- Logger les appels pour le monitoring

### Configuration recommandée
```typescript
// .env
DHL_API_KEY=your_secret_key_here

// dhl.service.ts
constructor(private configService: ConfigService) {
  this.apiKey = this.configService.get<string>('DHL_API_KEY');
}
```

## 📈 Monitoring

### Métriques à surveiller
- Nombre d'appels API/mois
- Taux de succès des appels
- Temps de réponse moyen
- Erreurs par type

### Logs recommandés
```typescript
console.log(`DHL API call: ${trackingNumber} - ${response.status}`);
```

## 🔗 Liens utiles

- **Documentation DHL** : https://developer.dhl.com/api-reference/dhl-parcel-de-api
- **Portail développeur** : https://developer.dhl.com/
- **Support** : developer-support@dhl.com

## 📝 Notes importantes

1. **Test en développement** : Utiliser des numéros de test fournis par DHL
2. **Production** : Vérifier les quotas et limites avant le déploiement
3. **Backup** : Toujours avoir un fallback vers des données mock
4. **Mise à jour** : Vérifier régulièrement les changements d'API DHL

---

**Dernière mise à jour** : 2024-07-18  
**Version** : 1.0.0  
**Auteur** : Équipe BantuDelice 