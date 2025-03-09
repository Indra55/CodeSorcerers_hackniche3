import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import {
  X, Plus, Minus, ShoppingBag, ArrowRight, ChevronLeft,
  Trash2, AlertTriangle, TruckIcon, ShieldCheck, CreditCard,
  Gift, Award, Heart, CornerDownRight, Sparkles,
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PlaceOrder from './PlaceOrder';

const CheckoutPage = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    clearCart,
    saveForLater,
    moveToWishlist,
  } = useCart();

  // Assuming auth context exists to check login status and get loyalty info
  const { user = null } = useAuth?.() || {};
  const isLoggedIn = !!user;

  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [usePoints, setUsePoints] = useState(false);
  const [showPointsInfo, setShowPointsInfo] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const navigate = useNavigate();

  // Sample addresses (in a real app, these would come from the user's profile)
  const [addresses, setAddresses] = useState([
    {
      id: 'addr1',
      type: 'Home',
      name: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      phone: '(123) 456-7890',
      isDefault: true
    },
    {
      id: 'addr2',
      type: 'Work',
      name: 'John Doe',
      street: '456 Office Blvd',
      city: 'New York',
      state: 'NY',
      postalCode: '10002',
      country: 'USA',
      phone: '(123) 456-7890',
      isDefault: false
    }
  ]);

  // Set default address on component mount
  useEffect(() => {
    const defaultAddress = addresses.find(addr => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
    }
  }, [addresses]);

  // Loyalty points data (would come from user profile in real app)
  const loyaltyInfo = useMemo(() => {
    if (!isLoggedIn || !user) return null;

    return {
      availablePoints: user?.loyaltyPoints || 1250,
      pointsWorth: ((user?.loyaltyPoints || 1250) / 100).toFixed(2), // 100 points = $1
      pointsToEarn: Math.floor(parseFloat(totalPrice) * 10), // 10 points per $1 spent
      tier: user?.loyaltyTier || 'Gold',
      multiplier: user?.loyaltyMultiplier || 1.5, // Gold members get 1.5x points
      adjustedPointsToEarn: Math.floor(parseFloat(totalPrice) * 10 * (user?.loyaltyMultiplier || 1.5)),
    };
  }, [isLoggedIn, user, totalPrice]);

  // Simulate checking for items that are low in stock
  const lowStockItems = useMemo(() => {
    return cart.filter((item) => item.product.stockLevel && item.product.stockLevel < 5)
      .map((item) => item.product.id);
  }, [cart]);

  // Memoized calculations to prevent recalculation on every render
  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );

    // Apply discount if promo success exists
    const promoDiscount = promoSuccess ? subtotal * 0.1 : 0;

    // Apply points discount if using points
    const pointsDiscount = usePoints && loyaltyInfo ? parseFloat(loyaltyInfo.pointsWorth) : 0;

    const totalDiscount = promoDiscount + pointsDiscount;
    const discountedSubtotal = subtotal - totalDiscount;

    const shipping = discountedSubtotal > 100 ? 0 : 15;
    const tax = discountedSubtotal * 0.1;

    return {
      subtotal: subtotal.toFixed(2),
      promoDiscount: promoDiscount.toFixed(2),
      pointsDiscount: pointsDiscount.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      discountedSubtotal: discountedSubtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: (discountedSubtotal + shipping + tax).toFixed(2),
      freeShippingRemaining: discountedSubtotal < 100 ? (100 - discountedSubtotal).toFixed(2) : 0,
      pointsToEarn: loyaltyInfo?.adjustedPointsToEarn || 0
    };
  }, [cart, promoSuccess, usePoints, loyaltyInfo]);

  // Handle promo code application
  const handleApplyPromo = () => {
    setLoading(true);
    setPromoError('');
    setPromoSuccess('');

    // Simulate API call
    setTimeout(() => {
      if (promoCode.toLowerCase() === 'discount10') {
        setPromoSuccess('10% discount applied successfully!');
      } else {
        setPromoError('Invalid promo code. Please try again.');
      }
      setLoading(false);
    }, 1000);
  };

  // Handle toggling points usage
  const handleToggleUsePoints = () => {
    setUsePoints(!usePoints);
  };

  // Handle address selection
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
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
          <h1 className="text-2xl md:text-3xl font-light">Checkout</h1>
          <span className="text-gray-500">{totalItems} items</span>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Checkout Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Shipping Address Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-medium mb-4">Shipping Address</h2>
              
              <div className="space-y-4">
                {addresses.map(address => (
                  <div 
                    key={address.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedAddress?.id === address.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleSelectAddress(address)}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{address.type}</span>
                        {address.isDefault && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          name="address" 
                          checked={selectedAddress?.id === address.id}
                          onChange={() => handleSelectAddress(address)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <p className="mt-2">{address.name}</p>
                    <p className="text-gray-600 text-sm">{address.street}</p>
                    <p className="text-gray-600 text-sm">{address.city}, {address.state} {address.postalCode}</p>
                    <p className="text-gray-600 text-sm">{address.country}</p>
                    <p className="text-gray-600 text-sm mt-1">{address.phone}</p>
                  </div>
                ))}
                
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Add New Address
                </button>
              </div>
            </div>
            
            {/* Payment Method Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-medium mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'COD' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handlePaymentMethodChange('COD')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-md">
                        <CreditCard className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">Pay when you receive your order</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'COD'}
                      onChange={() => handlePaymentMethodChange('COD')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'CARD' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handlePaymentMethodChange('CARD')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-md">
                        <CreditCard className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-sm text-gray-500">Pay securely with your card</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'CARD'}
                      onChange={() => handlePaymentMethodChange('CARD')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'UPI' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handlePaymentMethodChange('UPI')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-md">
                        <CreditCard className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">UPI</p>
                        <p className="text-sm text-gray-500">Pay using UPI apps like Google Pay, PhonePe</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'UPI'}
                      onChange={() => handlePaymentMethodChange('UPI')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-medium mb-4">Order Items</h2>
              
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 border-b pb-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image_url || '/placeholder.svg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-sm text-gray-500">{item.product.brand}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Main summary card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit sticky top-8">
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                  <span>${totals.subtotal}</span>
                </div>

                {/* Promo Discount section (only shown when promo applied) */}
                {promoSuccess && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo Discount (10%)</span>
                    <span>-${totals.promoDiscount}</span>
                  </div>
                )}

                {/* Points Discount section (only shown when points used) */}
                {usePoints && loyaltyInfo && (
                  <div className="flex justify-between text-amber-600">
                    <span>Loyalty Points Discount</span>
                    <span>-${totals.pointsDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  {parseFloat(totals.shipping) === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    <span>${totals.shipping}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>${totals.tax}</span>
                </div>
                <div className="flex justify-between border-t pt-4 font-medium text-lg">
                  <span>Total</span>
                  <span>${totals.total}</span>
                </div>
              </div>

              {/* Loyalty points redemption (only for logged in users) */}
              {isLoggedIn && loyaltyInfo && loyaltyInfo.availablePoints > 0 && (
                <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="usePoints" className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        id="usePoints"
                        checked={usePoints}
                        onChange={handleToggleUsePoints}
                        className="rounded text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-amber-800">Use {loyaltyInfo.availablePoints} points</span>
                    </label>
                    <span className="text-sm font-medium text-amber-800">-${loyaltyInfo.pointsWorth}</span>
                  </div>
                  <p className="text-xs text-amber-700">
                    Apply your available points to get a discount on this order
                  </p>
                </div>
              )}

              {/* Promo code input */}
              <div className="mt-6 mb-6">
                <label htmlFor="promo" className="block text-sm font-medium text-gray-700 mb-1">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                    placeholder="Enter code"
                    disabled={loading || promoSuccess}
                  />
                  <button
                    className={`px-4 py-2 rounded-md transition-colors ${
                      loading ? 'bg-gray-300 cursor-not-allowed' :
                      promoSuccess ? 'bg-green-100 text-green-800 cursor-not-allowed' :
                      'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                    onClick={handleApplyPromo}
                    disabled={loading || promoSuccess || !promoCode}
                  >
                    {loading ? 'Applying...' : promoSuccess ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {promoError && <p className="mt-1 text-sm text-red-600">{promoError}</p>}
                {promoSuccess && <p className="mt-1 text-sm text-green-600">{promoSuccess}</p>}
                <p className="text-xs text-gray-500 mt-2">Try code: "DISCOUNT10" for 10% off</p>
              </div>

              {/* Place Order Button */}
              <PlaceOrder 
                address={selectedAddress}
                paymentMode={paymentMethod}
                totals={totals}
                promoApplied={!!promoSuccess}
                pointsUsed={usePoints}
              />
            </div>

            {/* Trust badges */}
            <div className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                We promise:
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <TruckIcon className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Multiple payment options</span>
                </div>
              </div>
            </div>

            {/* Need help section */}
            <div className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Need help?</h3>
              <p className="text-sm text-gray-500 mb-3">Our customer service team is here to help you</p>
              <Link
                to="/contact"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutPage;