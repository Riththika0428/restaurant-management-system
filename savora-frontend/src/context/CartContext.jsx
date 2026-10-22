import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { getDeliveryFee } from '../utils/money.js';

const STORAGE_KEY = 'savora-cart';
const MAX_QUANTITY = 20;

const CartContext = createContext(null);

const readStoredCart = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

const clampQuantity = (qty) => Math.min(Math.max(Math.floor(qty) || 1, 1), MAX_QUANTITY);

function cartReducer(items, action) {
  switch (action.type) {
    case 'ADD': {
      const exists = items.some((item) => item.id === action.item.id);
      if (exists) {
        return items.map((item) =>
          item.id === action.item.id
            ? { ...item, quantity: clampQuantity(item.quantity + action.quantity) }
            : item
        );
      }
      return [...items, { ...action.item, quantity: clampQuantity(action.quantity) }];
    }
    case 'SET_QUANTITY':
      return items.map((item) =>
        item.id === action.id ? { ...item, quantity: clampQuantity(action.quantity) } : item
      );
    case 'REMOVE':
      return items.filter((item) => item.id !== action.id);
    case 'CLEAR':
      return [];
    default:
      return items;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, readStoredCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage can be full or disabled. The cart still works for this session.
    }
  }, [items]);

  const addItem = useCallback((food, quantity = 1) => {
    dispatch({
      type: 'ADD',
      quantity,
      item: { id: food._id, name: food.name, price: Number(food.price), image: food.image || '', category: food.category },
    });
  }, []);

  const setQuantity = useCallback((id, quantity) => dispatch({ type: 'SET_QUANTITY', id, quantity }), []);
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE', id }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const totals = useMemo(() => {
    const subtotal = Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100;
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const deliveryFee = getDeliveryFee(subtotal);
    return { subtotal, totalItems, deliveryFee, grandTotal: Math.round((subtotal + deliveryFee) * 100) / 100 };
  }, [items]);

  const value = useMemo(
    () => ({ items, ...totals, addItem, setQuantity, removeItem, clearCart }),
    [items, totals, addItem, setQuantity, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}