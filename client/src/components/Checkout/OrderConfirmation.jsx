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
  AlertCircle
} from 'lucide-react';

const OrderConfirmation = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      // Debug log to check user object
      console.log('User object in OrderConfirmation:', user);
      
      if (!id) {
        setError('Missing order ID');
        setLoading(false);
        return;
      }
      
      if (!user) {
        setError('User authentication required');
        setLoading(false);
        return;
      }
      
      // Get the auth token
      const token = user.token;
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching order details for:', id);
        const response = await axios.get(`http://localhost:8000/orders/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Order details:', response.data);
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, user]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-medium text-gray-700">Loading order details...</h2>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-red-50 p-6 rounded-lg border border-red-100 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Order</h2>
          <p className="text-red-700 mb-6">{error || "We couldn't find the order you're looking for."}</p>
          <Link 
            to="/profile"
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Go to Your Orders
          </Link>
        </div>
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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Order confirmation header */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-100 text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-800 mb-2">Order Confirmed!</h1>
          <p className="text-green-700 mb-2">Thank you for your purchase.</p>
          <p className="text-green-600">
            Your order #{order._id.slice(-6)} has been placed and is being processed.
          </p>
          {order.loyaltyPointsEarned > 0 && (
            <div className="mt-4 bg-amber-50 p-3 rounded-lg inline-block">
              <p className="text-amber-700 font-medium">
                You earned {order.loyaltyPointsEarned} loyalty points with this purchase!
              </p>
            </div>
          )}
        </div>

        {/* Order details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-medium mb-4 pb-2 border-b">Order Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Order Number</p>
                  <p className="text-gray-600">{order._id}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Order Date</p>
                  <p className="text-gray-600">{orderDate}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p className="text-gray-600">{order.paymentMode}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Shipping Address</p>
                  <p className="text-gray-600">{order.address.street}</p>
                  <p className="text-gray-600">{order.address.city}, {order.address.state} {order.address.postalCode}</p>
                  <p className="text-gray-600">{order.address.country}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Estimated Delivery</p>
                  <p className="text-gray-600">{estimatedDelivery}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order items */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-medium mb-4 pb-2 border-b">Order Items</h2>
          
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                <div className="w-20 h-20 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.image_url || '/placeholder.svg'}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tax</span>
              <span>Included</span>
            </div>
            <div className="flex justify-between font-medium text-lg pt-2 border-t">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/profile"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
          >
            View All Orders
          </Link>
          <Link
            to="/products"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 