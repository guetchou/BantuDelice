
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NotificationProvider, useNotifications } from '../NotificationContext';

// Mock API client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: '123' } } }),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      update: jest.fn().mockResolvedValue({ data: null, error: null }),
    }),
    channel: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
    }),
    removeChannel: jest.fn(),
  },
}));

const TestComponent = () => {
  const { notifications, unreadCount } = useNotifications();
  return (
    <div>
      <span>Notifications: {notifications.length}</span>
      <span>Unread: {unreadCount}</span>
    </div>
  );
};

describe('NotificationContext', () => {
  it('provides notification context to children', async () => {
    let component;
    await act(async () => {
      component = render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );
    });
    
    expect(screen.getByText('Notifications: 0')).toBeInTheDocument();
    expect(screen.getByText('Unread: 0')).toBeInTheDocument();
  });
});
