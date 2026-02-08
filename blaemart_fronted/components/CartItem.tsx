"use client";

import React from "react";

interface CartItemProps {
  id: number;
  productName: string;
  quantity: number;
  onRemove?: (id: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ id, productName, quantity, onRemove }) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div>
        <h4 className="font-semibold">{productName}</h4>
        <p className="text-gray-500">Quantity: {quantity}</p>
      </div>
      {onRemove && (
        <button
          onClick={() => onRemove(id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Remove
        </button>
      )}
    </div>
  );
};

export default CartItem;
