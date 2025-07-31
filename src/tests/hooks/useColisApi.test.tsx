import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useColis, useColisList, useCreateColis, useTracking, usePricing } from '@/services';
import { colisApiMock } from '@/services';

// Mock des services
jest.mock('@/services', () => ({
  ...jest.requireActual('@/services'),
  colisApi: colisApiMock,
  colisApiMock
}));

describe('useColis Hook', () => {
  beforeEach(() => {
    colisApiMock.resetMockData();
  });

  it('should fetch colis data on mount', async () => {
    const { result } = renderHook(() => useColis('1'));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.trackingNumber).toBe('BD12345678');
  });

  it('should handle errors', async () => {
    // Mock une erreur
    jest.spyOn(colisApiMock, 'getColis').mockRejectedValueOnce(new Error('Test error'));

    const { result } = renderHook(() => useColis('999'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Test error');
    expect(result.current.data).toBe(null);
  });

  it('should update colis data', async () => {
    const { result } = renderHook(() => useColis('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const updateData = { status: 'Livré' };
    
    await act(async () => {
      await result.current.updateColis('1', updateData);
    });

    expect(result.current.data?.status).toBe('Livré');
  });
});

describe('useColisList Hook', () => {
  beforeEach(() => {
    colisApiMock.resetMockData();
  });

  it('should fetch colis list', async () => {
    const { result } = renderHook(() => useColisList({ page: 1, limit: 10 }));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toHaveLength(2);
    expect(result.current.pagination.total).toBe(2);
  });

  it('should handle pagination', async () => {
    const { result } = renderHook(() => useColisList({ page: 1, limit: 1 }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.pagination.hasMore).toBe(true);
  });

  it('should load more data', async () => {
    const { result } = renderHook(() => useColisList({ page: 1, limit: 1 }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.data).toHaveLength(2);
    });
  });

  it('should refresh data', async () => {
    const { result } = renderHook(() => useColisList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialData = result.current.data;

    await act(async () => {
      result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.data).not.toBe(initialData);
    });
  });
});

describe('useCreateColis Hook', () => {
  beforeEach(() => {
    colisApiMock.resetMockData();
  });

  it('should create colis successfully', async () => {
    const { result } = renderHook(() => useCreateColis());

    const colisData = {
      sender: {
        name: 'Test',
        phone: '061234567',
        email: 'test@example.com',
        address: '123 Test Street',
        city: 'Brazzaville'
      },
      recipient: {
        name: 'Test2',
        phone: '062345678',
        email: 'test2@example.com',
        address: '456 Test Avenue',
        city: 'Pointe-Noire'
      },
      package: {
        type: 'document',
        weight: 1.5,
        description: 'Test package'
      },
      service: {
        type: 'standard',
        insurance: true,
        fragile: false,
        express: false
      }
    };

    await act(async () => {
      const newColis = await result.current.createColis(colisData);
      expect(newColis.trackingNumber).toMatch(/^BD\d{8}$/);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeDefined();
  });

  it('should handle creation errors', async () => {
    jest.spyOn(colisApiMock, 'createColis').mockRejectedValueOnce(new Error('Creation failed'));

    const { result } = renderHook(() => useCreateColis());

    const colisData = {
      sender: { name: 'Test', phone: '061234567', address: 'Test', city: 'Test' },
      recipient: { name: 'Test2', phone: '062345678', address: 'Test', city: 'Test' },
      package: { type: 'document', weight: 1.5, description: 'Test' },
      service: { type: 'standard', insurance: false, fragile: false, express: false }
    };

    await act(async () => {
      try {
        await result.current.createColis(colisData);
      } catch (error) {
        // Expected error
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Creation failed');
  });

  it('should reset state', async () => {
    const { result } = renderHook(() => useCreateColis());

    await act(async () => {
      result.current.reset();
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });
});

describe('useTracking Hook', () => {
  beforeEach(() => {
    colisApiMock.resetMockData();
  });

  it('should fetch tracking data', async () => {
    const { result } = renderHook(() => useTracking('BD12345678'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.colis.trackingNumber).toBe('BD12345678');
    expect(result.current.data?.events).toBeInstanceOf(Array);
  });

  it('should update tracking', async () => {
    const { result } = renderHook(() => useTracking('BD12345678'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newEvent = {
      status: 'En transit',
      location: 'Pointe-Noire',
      description: 'Colis en route',
      icon: 'truck' as const
    };

    await act(async () => {
      await result.current.updateTracking('1', newEvent);
    });

    // Vérifier que l'événement a été ajouté
    expect(result.current.data?.events).toHaveLength(3); // 2 initiaux + 1 nouveau
  });
});

describe('usePricing Hook', () => {
  beforeEach(() => {
    colisApiMock.resetMockData();
  });

  it('should calculate pricing', async () => {
    const { result } = renderHook(() => usePricing());

    const pricingData = {
      from: 'Brazzaville',
      to: 'Pointe-Noire',
      weight: 2.5,
      type: 'document',
      insurance: true,
      express: false
    };

    await act(async () => {
      const pricing = await result.current.calculatePricing(pricingData);
      expect(pricing.totalPrice).toBeGreaterThan(0);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.totalPrice).toBeGreaterThan(0);
  });

  it('should handle pricing errors', async () => {
    jest.spyOn(colisApiMock, 'calculatePricing').mockRejectedValueOnce(new Error('Pricing failed'));

    const { result } = renderHook(() => usePricing());

    const pricingData = {
      from: 'Brazzaville',
      to: 'Pointe-Noire',
      weight: 2.5,
      type: 'document',
      insurance: true,
      express: false
    };

    await act(async () => {
      try {
        await result.current.calculatePricing(pricingData);
      } catch (error) {
        // Expected error
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Pricing failed');
  });

  it('should reset pricing state', async () => {
    const { result } = renderHook(() => usePricing());

    await act(async () => {
      result.current.reset();
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });
});

describe('useNotifications Hook', () => {
  beforeEach(() => {
    colisApiMock.resetMockData();
  });

  it('should fetch notifications', async () => {
    const { result } = renderHook(() => useNotifications());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toHaveLength(3);
    expect(result.current.pagination.total).toBe(3);
  });

  it('should mark notification as read', async () => {
    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const firstNotification = result.current.data[0];

    await act(async () => {
      await result.current.markAsRead(firstNotification.id);
    });

    // Vérifier que la notification a été marquée comme lue
    const updatedNotification = result.current.data.find(n => n.id === firstNotification.id);
    expect(updatedNotification?.read).toBe(true);
  });

  it('should mark all notifications as read', async () => {
    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.markAllAsRead();
    });

    // Vérifier que toutes les notifications ont été marquées comme lues
    expect(result.current.data.every(n => n.read)).toBe(true);
  });

  it('should delete notification', async () => {
    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialCount = result.current.data.length;
    const firstNotification = result.current.data[0];

    await act(async () => {
      await result.current.deleteNotification(firstNotification.id);
    });

    expect(result.current.data.length).toBe(initialCount - 1);
    expect(result.current.data.find(n => n.id === firstNotification.id)).toBeUndefined();
  });
});

describe('useStats Hook', () => {
  beforeEach(() => {
    colisApiMock.resetMockData();
  });

  it('should fetch statistics', async () => {
    const { result } = renderHook(() => useStats());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.totalShipments).toBeGreaterThan(0);
    expect(result.current.data?.totalRevenue).toBeGreaterThan(0);
  });

  it('should handle different periods', async () => {
    const { result } = renderHook(() => useStats('7d'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });
});

describe('usePayment Hook', () => {
  beforeEach(() => {
    colisApiMock.resetMockData();
  });

  it('should initiate payment', async () => {
    const { result } = renderHook(() => usePayment());

    const paymentData = {
      method: 'momo' as const,
      amount: 2500,
      phoneNumber: '061234567'
    };

    await act(async () => {
      const payment = await result.current.initiatePayment('1', paymentData);
      expect(payment.paymentId).toMatch(/^PAY[A-Z0-9]+$/);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeDefined();
  });

  it('should check payment status', async () => {
    const { result } = renderHook(() => usePayment());

    await act(async () => {
      const status = await result.current.checkPaymentStatus('PAY123456');
      expect(status.status).toBeDefined();
      expect(status.amount).toBeGreaterThan(0);
    });
  });
});

describe('useImageUpload Hook', () => {
  beforeEach(() => {
    colisApiMock.resetMockData();
  });

  it('should upload image', async () => {
    const { result } = renderHook(() => useImageUpload());

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    await act(async () => {
      const upload = await result.current.uploadImage('1', file);
      expect(upload.imageUrl).toContain('test.jpg');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeDefined();
  });
}); 