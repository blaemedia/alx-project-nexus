'use client';

import React, { useState } from "react";

interface CartItemProps {
  id: number;               // Cart item ID from API
  productName: string;
  quantity: number;
  onRemoved?: () => void | Promise<void>;  // ✅ optional callback
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  productName,
  quantity,
  onRemoved,
}) => {
  const [isRemoving, setIsRemoving] = useState(false);

  // In CartItem.tsx
const handleRemove = async () => {
  try {
    setIsRemoving(true);

    const res = await fetch(`http://127.0.0.1:8000/store/cart-items/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access")}`, // ✅ Bearer
      },
    });

    if (!res.ok) throw new Error(`Failed to remove item: ${res.status}`);

    if (onRemoved) await onRemoved();
  } catch (err) {
    console.error(err);
    alert("Failed to remove item. Try again.");
  } finally {
    setIsRemoving(false);
  }
};

  return (
    <div className="flex justify-between items-center p-4 border-b rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div>
        <h4 className="font-semibold">{productName}</h4>
        <p className="text-gray-500">Quantity: {quantity}</p>
      </div>
      <button
        onClick={handleRemove}
        disabled={isRemoving}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
      >
        {isRemoving ? "Removing..." : "Remove"}
      </button>
    </div>
  );
};

export default CartItem;
