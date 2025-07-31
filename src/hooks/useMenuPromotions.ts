
import { useState, useEffect } from 'react';
import { MenuItem, MenuPromotion } from '@/types/menu';
import apiClient from '@/integrations/api/client';

/**
 * Hook pour gérer les promotions des menus et les appliquer aux items
 */
export const useMenuPromotions = (restaurantId: string) => {
  const [promotions, setPromotions] = useState<MenuPromotion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      if (!restaurantId) return;
      
      setIsLoading(true);
      try {
        // Dans un cas réel, on récupérerait les promotions depuis l'API
        // const data = await apiClient.restaurants.getPromotions(restaurantId);
        // Simuler des promotions pour la démonstration
        const mockPromotions: MenuPromotion[] = [
          {
            id: '1',
            title: 'Happy Hour',
            description: 'Réduction sur les boissons en fin de journée',
            discount_type: 'percentage',
            discount_value: 15,
            valid_from: new Date(Date.now() - 86400000).toISOString(),
            valid_to: new Date(Date.now() + 86400000 * 7).toISOString(),
            is_active: true,
            promotion_hours: {
              start: '17:00',
              end: '19:00',
              days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
            },
            coupon_code: ''
          },
          {
            id: '2',
            title: 'Menu Déjeuner',
            description: 'Plat + Dessert à prix réduit',
            discount_type: 'fixed_amount',
            discount_value: 500,
            valid_from: new Date(Date.now() - 86400000).toISOString(),
            valid_to: new Date(Date.now() + 86400000 * 30).toISOString(),
            is_active: true,
            promotion_hours: {
              start: '11:30',
              end: '14:00',
              days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
            },
            min_order_value: 2500
          },
          {
            id: '3',
            title: 'Fidélité',
            description: '10% de réduction après 5 commandes',
            discount_type: 'percentage',
            discount_value: 10,
            valid_from: new Date(Date.now() - 86400000 * 30).toISOString(),
            valid_to: new Date(Date.now() + 86400000 * 365).toISOString(),
            is_active: true,
            conditions: ['Minimum 5 commandes précédentes']
          }
        ];
        
        setPromotions(mockPromotions);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch promotions'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, [restaurantId]);

  /**
   * Vérifie si une promotion est actuellement valide
   */
  const isPromotionValid = (promotion: MenuPromotion): boolean => {
    const now = new Date();
    const validFrom = new Date(promotion.valid_from);
    const validTo = new Date(promotion.valid_to);
    
    // Vérifier si la date actuelle est dans la plage de validité
    if (now < validFrom || now > validTo) return false;
    
    // Vérifier si l'heure actuelle est dans la plage horaire de la promotion (si définie)
    if (promotion.promotion_hours) {
      const { start, end, days } = promotion.promotion_hours;
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
      
      if (!days.includes(currentDay)) return false;
      
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTimeMinutes = currentHours * 60 + currentMinutes;
      
      const [startHours, startMinutes] = start.split(':').map(Number);
      const [endHours, endMinutes] = end.split(':').map(Number);
      
      const startTimeMinutes = startHours * 60 + startMinutes;
      const endTimeMinutes = endHours * 60 + endMinutes;
      
      if (currentTimeMinutes < startTimeMinutes || currentTimeMinutes > endTimeMinutes) return false;
    }
    
    return true;
  };

  /**
   * Applique les promotions pertinentes aux items du menu
   */
  const applyPromotionsToMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items.map(item => {
      // Chercher les promotions applicables à cet item
      const applicablePromotions = promotions.filter(promo => 
        promo.is_active && 
        isPromotionValid(promo) && 
        (!promo.menu_item_ids || promo.menu_item_ids.includes(item.id))
      );
      
      if (applicablePromotions.length === 0) return item;
      
      // Utiliser la promotion avec la plus grande réduction
      const bestPromotion = applicablePromotions.reduce((best, current) => {
        // Calculer la valeur de la réduction pour chaque promotion
        let bestValue = 0;
        let currentValue = 0;
        
        if (best.discount_type === 'percentage') {
          bestValue = (item.price * best.discount_value) / 100;
        } else {
          bestValue = best.discount_value;
        }
        
        if (current.discount_type === 'percentage') {
          currentValue = (item.price * current.discount_value) / 100;
        } else {
          currentValue = current.discount_value;
        }
        
        return currentValue > bestValue ? current : best;
      });
      
      // Appliquer la meilleure promotion à l'item
      return {
        ...item,
        promotional_data: {
          is_on_promotion: true,
          discount_type: bestPromotion.discount_type === 'free_item' ? 'fixed_amount' : bestPromotion.discount_type,
          discount_value: bestPromotion.discount_type === 'free_item' ? item.price : bestPromotion.discount_value,
          valid_from: bestPromotion.valid_from,
          valid_to: bestPromotion.valid_to,
          promotion_hours: bestPromotion.promotion_hours,
          conditions: bestPromotion.conditions
        }
      };
    });
  };

  /**
   * Vérifie si un coupon est valide et renvoie la promotion associée
   */
  const validateCoupon = (couponCode: string): MenuPromotion | null => {
    const promotion = promotions.find(
      p => p.coupon_code === couponCode && 
      p.is_active && 
      isPromotionValid(p)
    );
    
    return promotion || null;
  };

  /**
   * Applique un coupon à un panier complet
   */
  const applyCouponToCart = (couponCode: string, cartTotal: number, cartItems: any[]) => {
    const promotion = validateCoupon(couponCode);
    
    if (!promotion) return { success: false, message: 'Code promo invalide ou expiré' };
    
    // Vérifier le montant minimum si défini
    if (promotion.min_order_value && cartTotal < promotion.min_order_value) {
      return { 
        success: false, 
        message: `Le total du panier doit être d'au moins ${promotion.min_order_value.toLocaleString('fr-FR')} XAF pour utiliser ce code` 
      };
    }
    
    // Calculer la réduction
    let discountAmount = 0;
    
    if (promotion.discount_type === 'percentage') {
      discountAmount = (cartTotal * promotion.discount_value) / 100;
    } else if (promotion.discount_type === 'fixed_amount') {
      discountAmount = promotion.discount_value;
    } else if (promotion.discount_type === 'free_item' && promotion.menu_item_ids) {
      // Chercher les articles dans le panier qui sont éligibles pour l'item gratuit
      const eligibleItems = cartItems.filter(item => 
        promotion.menu_item_ids?.includes(item.id)
      );
      
      if (eligibleItems.length > 0) {
        // Utiliser l'article le moins cher comme item gratuit
        const cheapestItem = eligibleItems.reduce((min, item) => 
          item.price < min.price ? item : min
        );
        discountAmount = cheapestItem.price;
      }
    }
    
    return {
      success: true,
      discount: discountAmount,
      message: `Code promo appliqué: ${promotion.title}`,
      promotion
    };
  };

  return {
    promotions,
    isLoading,
    error,
    applyPromotionsToMenuItems,
    validateCoupon,
    applyCouponToCart
  };
};
