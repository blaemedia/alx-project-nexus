'use client';

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CartItem from "../components/CartItem";

interface Product {
  id: number;
  name: string;
  price: string;
  image?: string;
  description?: string;
  in_stock?: boolean;
}

interface CartItemType {
  id: number;
  product: number;  // Product ID
  quantity: number;
  product_details?: Product;  // Populated from product detail endpoint
}

interface ApiCartItem {
  id: number;
  product: number;
  quantity: number;
  items?: ApiCartItem[];
  cart_items?: ApiCartItem[];
  results?: ApiCartItem[];
}

const API_BASE_URL = "http://127.0.0.1:8000";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingAll, setRemovingAll] = useState(false);

  // Memoized product fetch function
  const fetchProduct = useCallback(async (productId: number): Promise<Product | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/store/products/${productId}/`, {
        headers: {
          'accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.warn(`Product ${productId} not found: ${response.status}`);
        return null;
      }
      
      const data = await response.json();
      return {
        id: data.id,
        name: data.name,
        price: data.price,
        image: data.image,
        description: data.description,
        in_stock: data.in_stock,
      };
    } catch (err) {
      console.error(`Error fetching product ${productId}:`, err);
      return null;
    }
  }, []);

  // Fetch all cart items with product details
  const fetchCartWithProducts = useCallback(async (token: string): Promise<CartItemType[]> => {
    try {
      // Fetch cart items
      const cartResponse = await fetch(`${API_BASE_URL}/store/cart-items/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json',
        },
      });

      if (!cartResponse.ok) {
        if (cartResponse.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(`Failed to load cart: ${cartResponse.status}`);
      }

      const cartData: ApiCartItem = await cartResponse.json();
      
      // Extract cart items array
      let items: ApiCartItem[] = [];
      if (Array.isArray(cartData)) {
        items = cartData;
      } else if (cartData && typeof cartData === 'object') {
        if (Array.isArray(cartData.items)) items = cartData.items;
        else if (Array.isArray(cartData.cart_items)) items = cartData.cart_items;
        else if (Array.isArray(cartData.results)) items = cartData.results;
        else items = [];
      }

      // Fetch product details for each unique product
      const uniqueProductIds = [...new Set(items.map(item => item.product))];
      const productPromises = uniqueProductIds.map(id => fetchProduct(id));
      const products = await Promise.all(productPromises);
      
      // Create a map for quick lookup
      const productMap = new Map<number, Product>();
      products.forEach((product, index) => {
        if (product) {
          productMap.set(uniqueProductIds[index], product);
        }
      });

      // Combine cart items with product details
      const itemsWithProducts = items.map(item => ({
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        product_details: productMap.get(item.product),
      }));

      return itemsWithProducts;
    } catch (err) {
      console.error("Error fetching cart with products:", err);
      throw err;
    }
  }, [fetchProduct]);

  // Load cart data
  useEffect(() => {
    const loadCart = async () => {
      const token = localStorage.getItem("access");
      
      if (!token) {
        setError("Please login to view your cart");
        setLoading(false);
        return;
      }

      try {
        const cartItemsWithProducts = await fetchCartWithProducts(token);
        setCartItems(cartItemsWithProducts);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load cart";
        setError(errorMessage);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [fetchCartWithProducts]);

  // Refresh cart
  const refreshCart = useCallback(async () => {
    const token = localStorage.getItem("access");
    if (!token) return;

    try {
      const cartItemsWithProducts = await fetchCartWithProducts(token);
      setCartItems(cartItemsWithProducts);
    } catch (err) {
      console.error("Failed to refresh cart:", err);
    }
  }, [fetchCartWithProducts]);

  // Remove all items
  const handleRemoveAll = async () => {
    if (!window.confirm("Are you sure you want to remove all items from your cart?")) {
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      alert("Please login to manage your cart");
      return;
    }

    setRemovingAll(true);

    try {
      const deletePromises = cartItems.map(item =>
        fetch(`${API_BASE_URL}/store/cart-items/${item.id}/`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json',
          },
        })
      );

      await Promise.all(deletePromises);
      setCartItems([]);
      alert("All items have been removed from your cart");
    } catch (err) {
      console.error("Failed to remove all items:", err);
      alert("Failed to remove all items. Please try again.");
    } finally {
      setRemovingAll(false);
    }
  };

  // Calculate total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product_details?.price 
        ? parseFloat(item.product_details.price) 
        : 0;
      return total + (price * item.quantity);
    }, 0);
  };

  // Calculate total items
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
          Your Shopping Cart
        </h1>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 mb-4">{error}</p>
            <button
              onClick={() => router.push("/SignIn")}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Go to Login
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some items to your cart to see them here</p>
            <button
              onClick={() => router.push("/ShopPage")}
              className="px-6 py-3 bg-[#FF4400] text-white rounded-lg hover:bg-[#FF383C] font-medium"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Summary */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Total Items: <span className="text-[#FF4400]">{totalItems}</span>
                  </p>
                  <p className="text-gray-600 text-sm">
                    {cartItems.length} unique item{cartItems.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">Estimated Total:</p>
                  <p className="text-2xl font-bold text-[#FF4400]">
                    ₦{calculateTotal().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Product Image - Using Next.js Image */}
                      {item.product_details?.image && (
                        <div className="w-24 h-24 shrink-0 overflow-hidden rounded-lg border relative">
                          <Image
                            src={
                              item.product_details.image.startsWith('http')
                                ? item.product_details.image
                                : `${API_BASE_URL}${item.product_details.image}`
                            }
                            alt={item.product_details.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        {/* Product Name */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {item.product_details?.name || `Product ${item.product}`}
                        </h3>
                        
                        {/* Product Description */}
                        {item.product_details?.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {item.product_details.description}
                          </p>
                        )}
                        
                        {/* Stock Status */}
                        {item.product_details?.in_stock !== undefined && (
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                            item.product_details.in_stock 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.product_details.in_stock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        )}
                        
                        {/* Price and Quantity Info */}
                        <div className="mt-3 space-y-2">
                          <p className="text-lg font-semibold text-gray-900">
                            ₦{parseFloat(item.product_details?.price || "0").toLocaleString()} each
                          </p>
                          
                          <div className="flex items-center gap-4">
                            <span className="text-gray-600">Quantity: {item.quantity}</span>
                            <span className="text-lg font-bold text-[#FF4400]">
                              Subtotal: ₦{(parseFloat(item.product_details?.price || "0") * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        
                        {/* Cart Item Controls */}
                        <div className="mt-4">
                          <CartItem
                            id={item.id}
                            productName={item.product_details?.name || `Product ${item.product}`}
                            quantity={item.quantity}
                            onRemoved={refreshCart}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                onClick={() => router.push("/ShopPage")}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                ← Continue Shopping
              </button>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleRemoveAll}
                  disabled={removingAll || cartItems.length === 0}
                  className={`px-6 py-3 border-2 ${
                    removingAll 
                      ? 'border-red-200 text-red-400 cursor-not-allowed' 
                      : 'border-red-300 text-red-600 hover:bg-red-50'
                  } rounded-lg font-medium flex items-center justify-center gap-2`}
                >
                  {removingAll ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Removing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove All Items
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => alert("Checkout functionality coming soon!")}
                  className="px-8 py-3 bg-[#FF4400] text-white rounded-lg hover:bg-[#FF383C] font-medium"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}