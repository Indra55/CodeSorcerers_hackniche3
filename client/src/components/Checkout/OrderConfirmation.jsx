import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  CheckCircle, 
  Truck, 
  Package, 
  Calendar, 
  MapPin, 
  CreditCard,
  Loader2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

const OrderConfirmation = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orderId } = useParams();
  const { user } = useAuth();

  // Debug log to check user object
  console.log('OrderConfirmation - Current user object:', user);
  console.log('OrderConfirmation - Order ID from params:', orderId);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      // Validate order ID
      if (!orderId) {
        console.error('No order ID provided in URL parameters');
        setError('Order ID not found. Please check your URL.');
        setLoading(false);
        return;
      }

      // Check if user is authenticated
      if (!user) {
        console.error('User not authenticated');
        setError('You must be logged in to view order details');
        setLoading(false);
        return;
      }

      // Get user ID - could be userId or _id depending on your auth implementation
      const userId = user._id || user.userId;
      if (!userId) {
        console.error('User object exists but has no ID:', user);
        setError('User ID not found. Please try logging out and back in.');
        setLoading(false);
        return;
      }

      // Get the auth token
      const token = user.token;
      if (!token) {
        console.error('Authentication token not found');
        setError('Authentication token not found. Please try logging out and back in.');
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching order details for order ID: ${orderId}`);
        const response = await axios.get(`http://localhost:8000/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Order details fetched successfully:', response.data);
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.response?.data?.message || 'Failed to load order details');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Order</h3>
        <p className="text-red-700 mb-6">{error}</p>
        <Link 
          to="/profile" 
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to Your Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100 text-center">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-yellow-800 mb-2">Order Not Found</h3>
        <p className="text-yellow-700 mb-6">We couldn't find the order you're looking for.</p>
        <Link 
          to="/profile" 
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to Your Orders
        </Link>
      </div>
    );
  }

  // Format date for display
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate estimated delivery date (5-7 days from order date)
  const deliveryDate = new Date(order.createdAt);
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const estimatedDelivery = deliveryDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="text-center mb-6">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Order Confirmed!</h2>
        <p className="text-gray-600">Thank you for your purchase</p>
      </div>
      
      <div className="border-t border-b border-gray-200 py-4 my-4">
        <p className="text-sm text-gray-500">Order #{order._id?.slice(-6) || 'N/A'}</p>
        <p className="text-sm text-gray-500">
          Placed on {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">Items</h3>
        <div className="space-y-3">
          {order.items?.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                  {item.product?.image ? (
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-10 h-10 object-contain" 
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{item.product?.name || 'Product'}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium">${(item.product?.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="font-medium">{order.address?.type || 'Delivery Address'}</p>
          <p className="text-gray-600">{order.address?.street}</p>
          <p className="text-gray-600">
            {order.address?.city}, {order.address?.state} {order.address?.postalCode}
          </p>
          <p className="text-gray-600">{order.address?.phone}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">Payment Information</h3>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="font-medium">Payment Method</p>
          <p className="text-gray-600">{order.paymentMode || 'Cash on Delivery'}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-gray-600">Subtotal</p>
            <p className="font-medium">${order.total?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping</p>
            <p className="font-medium">$0.00</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax</p>
            <p className="font-medium">Included</p>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
            <p className="font-semibold">Total</p>
            <p className="font-bold">${order.total?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-green-600 mb-4">
          You earned {order.loyaltyPointsEarned || 0} loyalty points with this purchase!
        </p>
        <Link 
          to="/profile" 
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to Your Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation; 