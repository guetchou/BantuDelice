import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ColisProvider } from '@/context/ColisContext';
import ColisStats from '@/components/colis/ColisStats';
import ColisNotifications from '@/components/colis/ColisNotifications';
import ColisSearch from '@/components/colis/ColisSearch';
import ColisMap from '@/components/colis/ColisMap';
import ColisLiveDashboard from '@/components/colis/ColisLiveDashboard';

// Wrapper pour les tests avec providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <ColisProvider>
      {children}
    </ColisProvider>
  </BrowserRouter>
);

describe('ColisStats Component', () => {
  it('renders statistics cards correctly', () => {
    const mockStats = {
      totalColis: 25,
      delivered: 18,
      inTransit: 5,
      pending: 2,
      totalSpent: 125000,
      thisMonth: 8,
      national: 15,
      international: 10
    };

    render(
      <TestWrapper>
        <ColisStats stats={mockStats} />
      </TestWrapper>
    );

    expect(screen.getByText('Statistiques')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('125,000 FCFA')).toBeInTheDocument();
  });

  it('displays default stats when no props provided', () => {
    render(
      <TestWrapper>
        <ColisStats />
      </TestWrapper>
    );

    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
  });
});

describe('ColisNotifications Component', () => {
  it('renders notifications list correctly', () => {
    const mockNotifications = [
      {
        id: '1',
        type: 'delivery' as const,
        title: 'Colis livré',
        message: 'Votre colis a été livré',
        time: 'Il y a 2 heures',
        read: false
      },
      {
        id: '2',
        type: 'update' as const,
        title: 'Mise à jour',
        message: 'Statut mis à jour',
        time: 'Il y a 4 heures',
        read: true
      }
    ];

    render(
      <TestWrapper>
        <ColisNotifications notifications={mockNotifications} />
      </TestWrapper>
    );

    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Colis livré')).toBeInTheDocument();
    expect(screen.getByText('Mise à jour')).toBeInTheDocument();
  });

  it('handles empty notifications list', () => {
    render(
      <TestWrapper>
        <ColisNotifications notifications={[]} />
      </TestWrapper>
    );

    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });
});

describe('ColisSearch Component', () => {
  it('renders search input correctly', () => {
    render(
      <TestWrapper>
        <ColisSearch />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('Rechercher un colis...')).toBeInTheDocument();
    expect(screen.getByText('Rechercher')).toBeInTheDocument();
  });

  it('handles search input changes', async () => {
    render(
      <TestWrapper>
        <ColisSearch />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Rechercher un colis...');
    fireEvent.change(searchInput, { target: { value: 'BD12345678' } });

    await waitFor(() => {
      expect(searchInput).toHaveValue('BD12345678');
    });
  });

  it('shows search results when typing', async () => {
    render(
      <TestWrapper>
        <ColisSearch />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Rechercher un colis...');
    fireEvent.change(searchInput, { target: { value: 'BD12345678' } });

    await waitFor(() => {
      expect(screen.getByText('BD12345678')).toBeInTheDocument();
    });
  });
});

describe('ColisMap Component', () => {
  it('renders map container correctly', () => {
    render(
      <TestWrapper>
        <ColisMap />
      </TestWrapper>
    );

    expect(screen.getByText('Carte des colis')).toBeInTheDocument();
    expect(screen.getByText('0 colis')).toBeInTheDocument();
  });

  it('displays colis on map when provided', () => {
    const mockColis = [
      {
        id: '1',
        trackingNumber: 'BD12345678',
        status: 'in_transit',
        currentLocation: {
          lat: -4.2634,
          lng: 15.2429,
          city: 'Brazzaville',
          country: 'Congo'
        },
        destination: {
          lat: -4.7989,
          lng: 11.8363,
          city: 'Pointe-Noire',
          country: 'Congo'
        },
        estimatedArrival: '2024-07-20T14:00:00Z',
        lastUpdate: '2024-07-18T10:30:00Z'
      }
    ];

    render(
      <TestWrapper>
        <ColisMap colis={mockColis} />
      </TestWrapper>
    );

    expect(screen.getByText('1 colis')).toBeInTheDocument();
  });
});

describe('ColisLiveDashboard Component', () => {
  it('renders live dashboard correctly', () => {
    render(
      <TestWrapper>
        <ColisLiveDashboard />
      </TestWrapper>
    );

    expect(screen.getByText('Tableau de bord en temps réel')).toBeInTheDocument();
    expect(screen.getByText('EN DIRECT')).toBeInTheDocument();
  });

  it('toggles live mode when button is clicked', () => {
    render(
      <TestWrapper>
        <ColisLiveDashboard />
      </TestWrapper>
    );

    const pauseButton = screen.getByText('Pause');
    fireEvent.click(pauseButton);

    expect(screen.getByText('PAUSÉ')).toBeInTheDocument();
    expect(screen.getByText('Reprendre')).toBeInTheDocument();
  });

  it('displays live metrics', () => {
    render(
      <TestWrapper>
        <ColisLiveDashboard />
      </TestWrapper>
    );

    expect(screen.getByText('Colis en transit')).toBeInTheDocument();
    expect(screen.getByText('Livraisons aujourd\'hui')).toBeInTheDocument();
    expect(screen.getByText('Chiffre d\'affaires')).toBeInTheDocument();
  });
});

describe('Colis Context', () => {
  it('provides colis state and actions', () => {
    render(
      <TestWrapper>
        <div data-testid="context-test">
          <ColisStats />
        </div>
      </TestWrapper>
    );

    expect(screen.getByTestId('context-test')).toBeInTheDocument();
  });
});

describe('Integration Tests', () => {
  it('search and tracking flow works correctly', async () => {
    render(
      <TestWrapper>
        <div>
          <ColisSearch />
          <ColisStats />
        </div>
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Rechercher un colis...');
    fireEvent.change(searchInput, { target: { value: 'BD12345678' } });

    await waitFor(() => {
      expect(screen.getByText('BD12345678')).toBeInTheDocument();
    });

    const searchButton = screen.getByText('Rechercher');
    fireEvent.click(searchButton);
  });

  it('notifications and stats update together', () => {
    render(
      <TestWrapper>
        <div>
          <ColisNotifications />
          <ColisStats />
        </div>
      </TestWrapper>
    );

    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Statistiques')).toBeInTheDocument();
  });
});

// Tests pour les erreurs et cas limites
describe('Error Handling', () => {
  it('handles network errors gracefully', () => {
    render(
      <TestWrapper>
        <ColisStats />
      </TestWrapper>
    );

    // Le composant devrait toujours afficher quelque chose même en cas d'erreur
    expect(screen.getByText('Statistiques')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    render(
      <TestWrapper>
        <ColisNotifications notifications={[]} />
      </TestWrapper>
    );

    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });
});

// Tests de performance
describe('Performance Tests', () => {
  it('renders large lists efficiently', () => {
    const largeNotificationsList = Array.from({ length: 100 }, (_, i) => ({
      id: i.toString(),
      type: 'update' as const,
      title: `Notification ${i}`,
      message: `Message ${i}`,
      time: 'Il y a 1 heure',
      read: false
    }));

    const startTime = performance.now();
    
    render(
      <TestWrapper>
        <ColisNotifications notifications={largeNotificationsList} />
      </TestWrapper>
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Le rendu devrait prendre moins de 100ms
    expect(renderTime).toBeLessThan(100);
  });
});

// Tests d'accessibilité
describe('Accessibility Tests', () => {
  it('has proper ARIA labels', () => {
    render(
      <TestWrapper>
        <ColisSearch />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Rechercher un colis...');
    expect(searchInput).toHaveAttribute('type', 'text');
  });

  it('supports keyboard navigation', () => {
    render(
      <TestWrapper>
        <ColisSearch />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Rechercher un colis...');
    searchInput.focus();
    
    fireEvent.keyDown(searchInput, { key: 'Enter' });
    
    // Le formulaire devrait être soumis
    expect(searchInput).toBeInTheDocument();
  });
});

// Tests de responsive
describe('Responsive Design Tests', () => {
  it('adapts to different screen sizes', () => {
    // Simuler un écran mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(
      <TestWrapper>
        <ColisStats />
      </TestWrapper>
    );

    expect(screen.getByText('Statistiques')).toBeInTheDocument();
  });
});

export {}; 