// ✅ Import useCart từ CartContext (đã được export)
import { useCart as useCartContext } from '../contexts/CartContext';

export const useCart = () => {
  return useCartContext();
};