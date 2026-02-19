import React, { createContext, useContext, useMemo, useState } from 'react';

export type CartItem = {
  id: string;
  merchant_id: string;
  name: string;
  price: number;
  image_url?: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  merchantId: string | null;
  total: number;
  add: (p: Omit<CartItem, 'quantity'>) => void;
  remove: (id: string) => void;
  changeQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType>({
  items: [],
  merchantId: null,
  total: 0,
  add: () => {},
  remove: () => {},
  changeQty: () => {},
  clear: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [merchantId, setMerchantId] = useState<string | null>(null);

  function add(p: Omit<CartItem, 'quantity'>) {
    if (merchantId && merchantId !== p.merchant_id) {
      setItems([]);
      setMerchantId(p.merchant_id);
      setItems([{ ...p, quantity: 1 }]);
      return;
    }
    if (!merchantId) setMerchantId(p.merchant_id);
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === p.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [...prev, { ...p, quantity: 1 }];
    });
  }

  function remove(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function changeQty(id: string, qty: number) {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)));
  }

  function clear() {
    setItems([]);
    setMerchantId(null);
  }

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, merchantId, total, add, remove, changeQty, clear }),
    [items, merchantId, total],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

