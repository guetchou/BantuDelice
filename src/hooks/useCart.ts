
import { useContext } from 'react';
import { useCart as useCartFromContext } from '@/contexts/CartContext';
import type { CartItem } from '@/types/cart';

// Réexporter l'interface du contexte
export const useCart = useCartFromContext;

export default useCart;
