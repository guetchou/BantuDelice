
import { useContext } from 'react';
import { CartContext } from './CartProvider';

export const useCart = () => useContext(CartContext);
export { CartProvider } from './CartProvider';
