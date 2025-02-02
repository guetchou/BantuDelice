import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatSupport from '../ChatSupport';

// Mock Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: '123' } } }),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
    }),
    channel: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
    }),
    removeChannel: jest.fn(),
  },
}));

describe('ChatSupport', () => {
  it('renders chat button when closed', () => {
    render(<ChatSupport />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('opens chat window when button is clicked', () => {
    render(<ChatSupport />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Support Chat')).toBeInTheDocument();
  });

  it('allows sending messages', () => {
    render(<ChatSupport />);
    fireEvent.click(screen.getByRole('button'));
    
    const input = screen.getByPlaceholderText('Écrivez votre message...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.submit(screen.getByRole('form'));
    
    expect(input).toHaveValue('');
  });
});