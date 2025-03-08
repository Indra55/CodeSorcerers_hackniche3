// src/components/Cart/CartPage.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    clearCart
  } = useCart();

  const calculateTotal = () => {
    const subtotal = cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    const shipping = subtotal > 100 ? 0 : 15;
    const tax = subtotal * 0.1;
    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: (subtotal + shipping + tax).toFixed(2)
    };
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-medium mb-2">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added anything to your cart yet
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-light">Shopping Cart</h1>
          <span className="text-gray-500">{totalItems} items</span>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-6">
            {cart.map((item) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 border-b pb-6"
              >
                <div className="w-32 h-40 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={item.product.images?.[0] || '/placeholder.svg'}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.product.brand}
                      </p>
                      {item.product.color && (
                        <p className="text-sm text-gray-500 mt-1">
                          Color: {item.product.color}
                        </p>
                      )}
                      {item.product.size && (
                        <p className="text-sm text-gray-500">Size: {item.product.size}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-200 rounded-md">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-xl h-fit sticky top-8">
            <h2 className="text-xl font-medium mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span>${calculateTotal().subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${calculateTotal().shipping}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${calculateTotal().tax}</span>
              </div>
              <div className="flex justify-between border-t pt-4 font-medium">
                <span>Total</span>
                <span>${calculateTotal().total}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full mt-6 py-3 bg-black text-white rounded-md flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={clearCart}
              className="w-full mt-4 py-3 border border-black text-black rounded-md hover:bg-gray-100 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CartPage;