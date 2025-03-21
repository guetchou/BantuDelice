
import { useContext } from 'react';
import { useCart as useCartFromContext } from '@/contexts/CartContext';
import type { CartItem } from '@/types/cart';

// Exporter le hook de contexte
export default useCartFromContext;
