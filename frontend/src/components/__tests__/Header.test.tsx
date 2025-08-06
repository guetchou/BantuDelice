import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  removeItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
global.localStorage = localStorageMock as Storage;

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders BantuDelice logo', () => {
    renderWithRouter(<Header />);
    
    const logo = screen.getByText('BantuDelice');
    expect(logo).toBeInTheDocument();
  });

  test('renders search input', () => {
    renderWithRouter(<Header />);
    
    const searchInput = screen.getByPlaceholderText("Que voulez-vous faire aujourd'hui ?");
    expect(searchInput).toBeInTheDocument();
  });

  test('shows login button when user is not authenticated', () => {
    localStorageMock.getItem.mockReturnValue(null);
    renderWithRouter(<Header />);
    
    const loginButton = screen.getByRole('button', { name: /se connecter/i });
    expect(loginButton).toBeInTheDocument();
  });

  test('shows user actions when user is authenticated', () => {
    const mockUser = { name: 'Test User', email: 'test@example.com' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));
    renderWithRouter(<Header />);
    
    const cartButton = screen.getByRole('button', { name: /mon panier/i });
    const profileButton = screen.getByRole('button', { name: /mon profil/i });
    const logoutButton = screen.getByRole('button', { name: /déconnexion/i });
    
    expect(cartButton).toBeInTheDocument();
    expect(profileButton).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
  });
}); 