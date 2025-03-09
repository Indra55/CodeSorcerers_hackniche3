import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import { 
  ShoppingBag, 
  CheckCircle, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';

const PlaceOrder = ({ 
  address, 
  paymentMode = 'COD', 
  totals, 
  promoApplied = false, 
  pointsUsed = false 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  const { user, updateUser, refreshUser } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    // Debug log to check user object
    console.log('Current user object:', user);
    
    // Check if user exists and has the necessary properties
    if (!user) {
      setError('You must be logged in to place an order');
      return;
    }

    // Check for user ID - could be userId or _id depending on your auth implementation
    const userId = user._id || user.userId;
    if (!userId) {
      console.error('User object exists but has no ID:', user);
      setError('User ID not found. Please try logging out and back in.');
      return;
    }

    if (!address) {
      setError('Please select a delivery address');
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare the order data
      const orderData = {
        user: userId,
        items: cart.map(item => ({
          product: item.product._id || item.product.id,
          quantity: item.quantity
        })),
        address,
        paymentMode,
        total: parseFloat(totals.total),
        promoApplied,
        pointsUsed
      };
      
      console.log('Creating order with data:', orderData);

      // Get the auth token
      const token = user.token;
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Make API call to create order
      const response = await axios.post('http://localhost:8000/orders', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Order created successfully:', response.data);
      
      // Update user data with new loyalty points
      if (response.data.newTotalPoints) {
        console.log('Updating user loyalty points to:', response.data.newTotalPoints);
        
        // Option 1: Update user directly
        if (updateUser) {
          const userData = { ...user, loyaltyPoints: response.data.newTotalPoints };
          updateUser(userData);
        }
        
        // Option 2: Refresh user data from server
        if (refreshUser) {
          refreshUser();
        }
      }

      // Set success state
      setSuccess(true);
      setOrderId(response.data.order._id);
      
      // Clear cart after successful order
      clearCart();
      
      // Redirect to order confirmation after a delay
      setTimeout(() => {
        navigate(`/order-confirmation/${response.data.order._id}`);
      }, 2000);
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success && orderId) {
    return (
      <div className="bg-green-50 p-6 rounded-lg border border-green-100 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-800 mb-2">Order Placed Successfully!</h3>
        <p className="text-green-700 mb-4">Your order #{orderId.slice(-6)} has been placed.</p>
        <p className="text-green-600 mb-6">You earned {totals.pointsToEarn} loyalty points with this purchase!</p>
        <button
          onClick={() => navigate(`/order-confirmation/${orderId}`)}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          View Order Details
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className={`w-full py-3 rounded-md flex items-center justify-center gap-2 transition-colors ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing Order...
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            Place Order (${totals.total})
          </>
        )}
      </button>
      
      <p className="text-xs text-gray-500 mt-2 text-center">
        By placing your order, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default PlaceOrder; 