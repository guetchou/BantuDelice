# Guide de Développement - BantuDelice Colis

## 🚀 Vue d'ensemble

Ce guide couvre le développement, le déploiement et la maintenance du module Colis de BantuDelice.

## 📋 Table des matières

1. [Architecture](#architecture)
2. [Installation](#installation)
3. [Développement](#développement)
4. [Tests](#tests)
5. [Déploiement](#déploiement)
6. [Maintenance](#maintenance)
7. [Troubleshooting](#troubleshooting)

## 🏗️ Architecture

### Structure du projet

```
frontend/
├── src/
│   ├── pages/colis/           # Pages du module Colis
│   ├── components/colis/      # Composants spécifiques
│   ├── layouts/              # Layouts de l'application
│   ├── routes/               # Configuration des routes
│   ├── context/              # Gestion d'état globale
│   ├── config/               # Configuration
│   ├── styles/               # Styles CSS
│   └── tests/                # Tests unitaires
├── deploy/                   # Scripts de déploiement
└── docs/                     # Documentation
```

### Technologies utilisées

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **État**: Context API + useReducer
- **Tests**: Jest + React Testing Library
- **Build**: Vite
- **Déploiement**: PM2 + Nginx

### Flux de données

```
User Action → Component → Context → API → Backend
     ↑                                        ↓
     ←────────── State Update ←───────────────←
```

## 🛠️ Installation

### Prérequis

- Node.js 18+
- npm ou pnpm
- Git

### Installation locale

```bash
# Cloner le repository
git clone https://github.com/bantudelice/colis-frontend.git
cd colis-frontend

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env

# Démarrer en développement
npm run dev
```

### Variables d'environnement

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENVIRONMENT=development

# Feature Flags
REACT_APP_ENABLE_MOCK_DATA=true
REACT_APP_ENABLE_ANALYTICS=false

# External Services
REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here
REACT_APP_SENTRY_DSN=your_dsn_here
```

## 💻 Développement

### Conventions de code

#### TypeScript

```typescript
// Interfaces pour les props
interface ComponentProps {
  title: string;
  onAction?: (data: any) => void;
  className?: string;
}

// Types pour les données
type ColisStatus = 'pending' | 'in_transit' | 'delivered' | 'cancelled';

// Enums pour les constantes
enum DeliveryType {
  NATIONAL = 'national',
  INTERNATIONAL = 'international'
}
```

#### React Components

```typescript
// Composant fonctionnel avec hooks
const MyComponent: React.FC<ComponentProps> = ({ title, onAction, className }) => {
  const [state, setState] = useState<StateType>(initialState);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  const handleClick = useCallback(() => {
    onAction?.(data);
  }, [onAction, data]);
  
  return (
    <div className={cn('base-classes', className)}>
      <h1>{title}</h1>
      <button onClick={handleClick}>Action</button>
    </div>
  );
};
```

#### Styling

```typescript
// Utiliser Tailwind CSS avec cn() pour les classes conditionnelles
import { cn } from '@/lib/utils';

const className = cn(
  'base-classes',
  isActive && 'active-classes',
  variant === 'primary' && 'primary-classes',
  className
);
```

### Gestion d'état

#### Context API

```typescript
// Créer un contexte
const ColisContext = createContext<ColisContextType | undefined>(undefined);

// Provider avec reducer
const ColisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(colisReducer, initialState);
  
  const value = {
    state,
    dispatch,
    actions: {
      fetchColis: () => { /* ... */ },
      addColis: (data) => { /* ... */ }
    }
  };
  
  return (
    <ColisContext.Provider value={value}>
      {children}
    </ColisContext.Provider>
  );
};

// Hook personnalisé
export const useColis = () => {
  const context = useContext(ColisContext);
  if (!context) {
    throw new Error('useColis must be used within ColisProvider');
  }
  return context;
};
```

### Routing

```typescript
// Configuration des routes
const colisRoutes: RouteObject[] = [
  {
    path: '/colis',
    element: <ColisLayout />,
    children: [
      { index: true, element: <ColisLandingPage /> },
      { path: 'tracking', element: <ColisTracking /> },
      { path: 'tarifs', element: <ColisTarifsPage /> }
    ]
  }
];

// Navigation programmatique
const navigate = useNavigate();
navigate('/colis/tracking?code=BD12345678');
```

### API Integration

```typescript
// Service API
class ColisAPI {
  private baseURL: string;
  
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || '/api';
  }
  
  async trackColis(trackingNumber: string): Promise<Colis> {
    const response = await fetch(`${this.baseURL}/colis/tracking/${trackingNumber}`);
    if (!response.ok) {
      throw new Error('Colis not found');
    }
    return response.json();
  }
  
  async createColis(data: CreateColisData): Promise<Colis> {
    const response = await fetch(`${this.baseURL}/colis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

// Hook pour l'API
export const useColisAPI = () => {
  const api = useMemo(() => new ColisAPI(), []);
  return api;
};
```

## 🧪 Tests

### Tests unitaires

```typescript
// Test d'un composant
describe('ColisStats', () => {
  it('renders statistics correctly', () => {
    const mockStats = {
      totalColis: 25,
      delivered: 18,
      inTransit: 5,
      pending: 2
    };
    
    render(
      <TestWrapper>
        <ColisStats stats={mockStats} />
      </TestWrapper>
    );
    
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
  });
});
```

### Tests d'intégration

```typescript
// Test du flux complet
describe('Colis Tracking Flow', () => {
  it('tracks a colis successfully', async () => {
    render(
      <TestWrapper>
        <ColisTracking />
      </TestWrapper>
    );
    
    const input = screen.getByPlaceholderText('Numéro de suivi');
    const button = screen.getByText('Suivre');
    
    fireEvent.change(input, { target: { value: 'BD12345678' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Colis trouvé')).toBeInTheDocument();
    });
  });
});
```

### Commandes de test

```bash
# Tests unitaires
npm run test

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch

# Tests E2E
npm run test:e2e

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🚀 Déploiement

### Déploiement automatique

```bash
# Déploiement complet
./deploy/colis-deploy.sh

# Sauvegarde seulement
./deploy/colis-deploy.sh --backup

# Restauration
./deploy/colis-deploy.sh --rollback

# Statut
./deploy/colis-deploy.sh --status
```

### Déploiement manuel

```bash
# Construction
npm run build

# Test de la construction
npm run preview

# Déploiement avec PM2
pm2 start ecosystem.config.js

# Vérification
pm2 status
pm2 logs bantudelice-colis
```

### Configuration PM2

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'bantudelice-colis',
    script: 'serve',
    args: '-s . -l 9595',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 9595
    }
  }]
};
```

## 🔧 Maintenance

### Monitoring

```bash
# Vérifier les logs
tail -f /var/log/bantudelice-colis/deploy.log

# Statut PM2
pm2 status
pm2 monit

# Métriques système
htop
df -h
free -h
```

### Sauvegarde

```bash
# Sauvegarde automatique
./deploy/colis-deploy.sh --backup

# Sauvegarde manuelle
cp -r /var/www/bantudelice-colis /var/backups/bantudelice-colis/backup-$(date +%Y%m%d-%H%M%S)
```

### Mise à jour

```bash
# Pull des changements
git pull origin main

# Mise à jour des dépendances
npm install

# Redéploiement
./deploy/colis-deploy.sh
```

## 🐛 Troubleshooting

### Problèmes courants

#### Application ne démarre pas

```bash
# Vérifier les logs
pm2 logs bantudelice-colis

# Redémarrer l'application
pm2 restart bantudelice-colis

# Vérifier les ports
netstat -tulpn | grep 9595
```

#### Erreurs de build

```bash
# Nettoyer le cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Vérifier les types
npm run type-check
```

#### Problèmes de performance

```bash
# Analyser le bundle
npm run build -- --analyze

# Vérifier les métriques
npm run lighthouse

# Optimiser les images
npm run optimize-images
```

### Debug

```typescript
// Debug en développement
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Debug info:', data);
}

// Debug avec React DevTools
import { useDebugValue } from 'react';

const useCustomHook = () => {
  const [state, setState] = useState(initialState);
  useDebugValue(state, state => `State: ${state}`);
  return [state, setState];
};
```

## 📚 Ressources

### Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

### Outils

- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Communauté

- [Discord BantuDelice](https://discord.gg/bantudelice)
- [GitHub Issues](https://github.com/bantudelice/colis-frontend/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/bantudelice)

## 🤝 Contribution

### Workflow Git

```bash
# Créer une branche feature
git checkout -b feature/nouvelle-fonctionnalite

# Développer
git add .
git commit -m "feat: ajouter nouvelle fonctionnalité"

# Pousser
git push origin feature/nouvelle-fonctionnalite

# Créer une Pull Request
# Merge après review
```

### Standards de commit

```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage
refactor: refactoring
test: tests
chore: tâches de maintenance
```

### Code Review

- Vérifier la qualité du code
- S'assurer que les tests passent
- Vérifier l'accessibilité
- Contrôler les performances
- Valider la sécurité

---

**BantuDelice Colis** - Guide de développement v1.0.0 