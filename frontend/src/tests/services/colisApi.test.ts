import { describe, it, expect, beforeEach, jest, afterEach } from '@jest/globals';
import { colisApi, colisApiMock } from '@/services';
import type { CreateColisRequest, UpdateColisRequest, PricingRequest } from '@/services';

// Mock fetch global
global.fetch = jest.fn();

describe('ColisApi Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createColis', () => {
    it('should create a colis successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: '1',
          trackingNumber: 'BD12345678',
          status: 'En attente',
          sender: { name: 'Test', phone: '061234567' },
          recipient: { name: 'Test2', phone: '062345678' },
          package: { type: 'document', weight: 1.5 },
          service: { type: 'standard', insurance: true },
          pricing: { totalPrice: 2500 },
          tracking: { events: [], estimatedDelivery: '2024-07-21T10:00:00Z' },
          createdAt: '2024-07-18T09:00:00Z',
          updatedAt: '2024-07-18T09:00:00Z'
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const colisData: CreateColisRequest = {
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

      const result = await colisApi.createColis(colisData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/colis'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(colisData)
        })
      );
      expect(result.success).toBe(true);
      expect(result.data.trackingNumber).toBe('BD12345678');
    });

    it('should handle API errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const colisData: CreateColisRequest = {
        sender: { name: 'Test', phone: '061234567', address: 'Test', city: 'Test' },
        recipient: { name: 'Test2', phone: '062345678', address: 'Test', city: 'Test' },
        package: { type: 'document', weight: 1.5, description: 'Test' },
        service: { type: 'standard', insurance: false, fragile: false, express: false }
      };

      await expect(colisApi.createColis(colisData)).rejects.toThrow('Network error');
    });
  });

  describe('getColis', () => {
    it('should fetch a colis successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: '1',
          trackingNumber: 'BD12345678',
          status: 'En cours de livraison'
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await colisApi.getColis('1');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/colis/1'),
        expect.objectContaining({
          method: 'GET'
        })
      );
      expect(result.success).toBe(true);
      expect(result.data.trackingNumber).toBe('BD12345678');
    });

    it('should handle 404 errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Colis not found' })
      });

      await expect(colisApi.getColis('999')).rejects.toThrow('Colis not found');
    });
  });

  describe('listColis', () => {
    it('should fetch colis list with pagination', async () => {
      const mockResponse = {
        success: true,
        data: {
          colis: [
            { id: '1', trackingNumber: 'BD12345678' },
            { id: '2', trackingNumber: 'BD87654321' }
          ],
          total: 2,
          page: 1,
          limit: 10
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await colisApi.listColis({ page: 1, limit: 10 });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/colis?page=1&limit=10'),
        expect.objectContaining({
          method: 'GET'
        })
      );
      expect(result.success).toBe(true);
      expect(result.data.colis).toHaveLength(2);
      expect(result.data.total).toBe(2);
    });

    it('should handle filters correctly', async () => {
      const mockResponse = {
        success: true,
        data: {
          colis: [],
          total: 0,
          page: 1,
          limit: 10
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await colisApi.listColis({ 
        status: 'livré', 
        type: 'document',
        search: 'BD12345678'
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/colis?status=livré&type=document&search=BD12345678'),
        expect.any(Object)
      );
    });
  });

  describe('trackColis', () => {
    it('should track a colis successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          colis: {
            id: '1',
            trackingNumber: 'BD12345678',
            status: 'En cours de livraison'
          },
          events: [
            {
              id: '1',
              status: 'Colis créé',
              location: 'Brazzaville',
              timestamp: '2024-07-18T09:00:00Z',
              description: 'Votre colis a été enregistré',
              icon: 'package'
            }
          ],
          estimatedDelivery: '2024-07-20T10:00:00Z'
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await colisApi.trackColis('BD12345678');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/tracking/BD12345678'),
        expect.objectContaining({
          method: 'GET'
        })
      );
      expect(result.success).toBe(true);
      expect(result.data.colis.trackingNumber).toBe('BD12345678');
      expect(result.data.events).toHaveLength(1);
    });
  });

  describe('calculatePricing', () => {
    it('should calculate pricing correctly', async () => {
      const mockResponse = {
        success: true,
        data: {
          basePrice: 2000,
          insuranceFee: 500,
          expressFee: 0,
          totalPrice: 2500,
          estimatedDays: 3
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const pricingData: PricingRequest = {
        from: 'Brazzaville',
        to: 'Pointe-Noire',
        weight: 2.5,
        type: 'document',
        insurance: true,
        express: false
      };

      const result = await colisApi.calculatePricing(pricingData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/tarifs'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(pricingData)
        })
      );
      expect(result.success).toBe(true);
      expect(result.data.totalPrice).toBe(2500);
      expect(result.data.estimatedDays).toBe(3);
    });
  });

  describe('getNotifications', () => {
    it('should fetch notifications with pagination', async () => {
      const mockResponse = {
        success: true,
        data: {
          notifications: [
            {
              id: '1',
              type: 'delivery',
              title: 'Colis livré',
              message: 'Votre colis a été livré',
              timestamp: '2024-07-18T10:00:00Z',
              read: false,
              priority: 'high'
            }
          ],
          total: 1,
          unread: 1
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await colisApi.getNotifications({ page: 1, limit: 20 });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/notifications?page=1&limit=20'),
        expect.objectContaining({
          method: 'GET'
        })
      );
      expect(result.success).toBe(true);
      expect(result.data.notifications).toHaveLength(1);
      expect(result.data.unread).toBe(1);
    });
  });

  describe('getStats', () => {
    it('should fetch statistics', async () => {
      const mockResponse = {
        success: true,
        data: {
          totalShipments: 1247,
          delivered: 1156,
          inTransit: 89,
          pending: 2,
          totalRevenue: 2847500,
          thisMonth: 156,
          national: 892,
          international: 355,
          growthRate: 15.2,
          averageDeliveryTime: 2.3,
          customerSatisfaction: 4.8
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await colisApi.getStats('30d');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/colis/stats?period=30d'),
        expect.objectContaining({
          method: 'GET'
        })
      );
      expect(result.success).toBe(true);
      expect(result.data.totalShipments).toBe(1247);
      expect(result.data.totalRevenue).toBe(2847500);
    });
  });

  describe('uploadImage', () => {
    it('should upload image successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          imageUrl: 'https://storage.example.com/colis/1/test.jpg'
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = await colisApi.uploadImage('1', file);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/colis/1/upload-image'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      );
      expect(result.success).toBe(true);
      expect(result.data.imageUrl).toContain('test.jpg');
    });
  });

  describe('downloadLabel', () => {
    it('should download label as blob', async () => {
      const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        blob: async () => mockBlob
      });

      const result = await colisApi.downloadLabel('1');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/colis/1/label'),
        expect.objectContaining({
          method: 'GET'
        })
      );
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('application/pdf');
    });
  });
});

describe('ColisApiMock Service', () => {
  beforeEach(() => {
    colisApiMock.resetMockData();
  });

  describe('createColis', () => {
    it('should create a mock colis', async () => {
      const colisData: CreateColisRequest = {
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

      const result = await colisApiMock.createColis(colisData);

      expect(result.success).toBe(true);
      expect(result.data.trackingNumber).toMatch(/^BD\d{8}$/);
      expect(result.data.status).toBe('En attente');
      expect(result.data.sender.name).toBe('Test');
      expect(result.data.recipient.name).toBe('Test2');
    });

    it('should handle simulated errors', async () => {
      // Force une erreur simulée
      jest.spyOn(Math, 'random').mockReturnValue(0.01); // Probabilité d'erreur élevée

      const colisData: CreateColisRequest = {
        sender: { name: 'Test', phone: '061234567', address: 'Test', city: 'Test' },
        recipient: { name: 'Test2', phone: '062345678', address: 'Test', city: 'Test' },
        package: { type: 'document', weight: 1.5, description: 'Test' },
        service: { type: 'standard', insurance: false, fragile: false, express: false }
      };

      await expect(colisApiMock.createColis(colisData)).rejects.toThrow('Erreur simulée du serveur');
    });
  });

  describe('getColis', () => {
    it('should return existing mock colis', async () => {
      const result = await colisApiMock.getColis('1');

      expect(result.success).toBe(true);
      expect(result.data.trackingNumber).toBe('BD12345678');
      expect(result.data.status).toBe('En cours de livraison');
    });

    it('should throw error for non-existent colis', async () => {
      await expect(colisApiMock.getColis('999')).rejects.toThrow('Colis non trouvé');
    });
  });

  describe('listColis', () => {
    it('should return paginated colis list', async () => {
      const result = await colisApiMock.listColis({ page: 1, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.data.colis).toHaveLength(2);
      expect(result.data.total).toBe(2);
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
    });

    it('should filter by status', async () => {
      const result = await colisApiMock.listColis({ status: 'livré' });

      expect(result.success).toBe(true);
      expect(result.data.colis.every(c => c.status === 'Livré')).toBe(true);
    });
  });

  describe('trackColis', () => {
    it('should return tracking information', async () => {
      const result = await colisApiMock.trackColis('BD12345678');

      expect(result.success).toBe(true);
      expect(result.data.colis.trackingNumber).toBe('BD12345678');
      expect(result.data.events).toBeInstanceOf(Array);
      expect(result.data.estimatedDelivery).toBeDefined();
    });
  });

  describe('calculatePricing', () => {
    it('should calculate pricing correctly', async () => {
      const pricingData: PricingRequest = {
        from: 'Brazzaville',
        to: 'Pointe-Noire',
        weight: 2.5,
        type: 'document',
        insurance: true,
        express: false
      };

      const result = await colisApiMock.calculatePricing(pricingData);

      expect(result.success).toBe(true);
      expect(result.data.basePrice).toBeGreaterThan(0);
      expect(result.data.insuranceFee).toBeGreaterThan(0);
      expect(result.data.totalPrice).toBe(result.data.basePrice + result.data.insuranceFee);
      expect(result.data.estimatedDays).toBeGreaterThan(0);
    });
  });

  describe('getNotifications', () => {
    it('should return notifications', async () => {
      const result = await colisApiMock.getNotifications();

      expect(result.success).toBe(true);
      expect(result.data.notifications).toHaveLength(3);
      expect(result.data.unread).toBeGreaterThan(0);
    });

    it('should filter unread notifications', async () => {
      const result = await colisApiMock.getNotifications({ read: false });

      expect(result.success).toBe(true);
      expect(result.data.notifications.every(n => !n.read)).toBe(true);
    });
  });

  describe('getStats', () => {
    it('should return statistics', async () => {
      const result = await colisApiMock.getStats();

      expect(result.success).toBe(true);
      expect(result.data.totalShipments).toBeGreaterThan(0);
      expect(result.data.totalRevenue).toBeGreaterThan(0);
      expect(result.data.customerSatisfaction).toBeGreaterThan(0);
    });

    it('should handle different periods', async () => {
      const result = await colisApiMock.getStats('7d');

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('initiatePayment', () => {
    it('should initiate payment successfully', async () => {
      const result = await colisApiMock.initiatePayment('1', {
        method: 'momo',
        amount: 2500,
        phoneNumber: '061234567'
      });

      expect(result.success).toBe(true);
      expect(result.data.paymentId).toMatch(/^PAY[A-Z0-9]+$/);
      expect(result.data.status).toBe('processing');
    });
  });

  describe('uploadImage', () => {
    it('should upload image successfully', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = await colisApiMock.uploadImage('1', file);

      expect(result.success).toBe(true);
      expect(result.data.imageUrl).toContain('test.jpg');
    });
  });

  describe('downloadLabel', () => {
    it('should download label as blob', async () => {
      const result = await colisApiMock.downloadLabel('1');

      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('application/pdf');
    });
  });
}); 