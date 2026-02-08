'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItemType {
  id: number;
  productName: string;
  quantity: number;
}

interface CartContextType {
  count: number;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType>({
  count: 0,
  refreshCart: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [count, setCount] = useState(0);
  const API_BASE_URL = "http://127.0.0.1:8000";

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/store/cart-items/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data: CartItemType[] = await res.json();
      setCount(data.reduce((sum, item) => sum + item.quantity, 0));
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  useEffect(() => {
    const loadCart = () => {
      void fetchCart();
    };
    loadCart();
  }, []);

  return (
    <CartContext.Provider value={{ count, refreshCart: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
