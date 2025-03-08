import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserIcon, MapPinIcon, ShoppingBagIcon, CogIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    type: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    phoneNumber: '',
    country: 'India'
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user?.userId) {
          console.error('No user ID available:', user);
          setLoading(false);
          return;
        }

        console.log('User data for requests:', {
          userId: user.userId,
          hasToken: !!user.token,
          tokenPrefix: user.token?.substring(0, 10) + '...'
        });

        // Fetch orders using the correct endpoint
        const ordersResponse = await axios.get(`http://localhost:8000/orders/user/${user.userId}`, {
          headers: { 
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Orders response:', ordersResponse.data);
        setOrders(ordersResponse.data);

        // Fetch addresses with proper headers
        const addressesResponse = await axios.get(`http://localhost:8000/address/user/${user.userId}`, {
          headers: { 
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Addresses response:', addressesResponse.data);
        if (Array.isArray(addressesResponse.data)) {
          setAddresses(addressesResponse.data);
        } else {
          console.error('Invalid address data format:', addressesResponse.data);
          setAddresses([]);
        }
      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      console.log('Fetching user data for userId:', user.userId);
      fetchUserData();
    } else {
      console.log('No user ID found:', user);
      setLoading(false);
    }
  }, [user?.userId, user?.token]);

  const handleAddAddress = async (addressData) => {
    try {
      // Ensure all required fields are present
      const requiredFields = ['type', 'street', 'city', 'state', 'postalCode', 'phoneNumber'];
      const missingFields = requiredFields.filter(field => !addressData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      if (!user?.userId) {
        throw new Error('User ID is required. Please log in again.');
      }

      // Create the address data object with all required fields
      const addressPayload = {
        user: user.userId, // This should be a MongoDB ObjectId string
        type: addressData.type,
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        postalCode: addressData.postalCode,
        phoneNumber: addressData.phoneNumber,
        country: addressData.country || 'India'
      };

      console.log('Sending address payload:', addressPayload); // Debug log

      const response = await axios.post(
        'http://localhost:8000/address', 
        addressPayload,
        {
          headers: { 
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Add address response:', response.data);
      setAddresses(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        payload: error.config?.data
      });
      throw error;
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await axios.delete(`http://localhost:8000/address/${addressId}`, {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      setAddresses(addresses.filter(addr => addr._id !== addressId));
    } catch (error) {
      console.error('Error deleting address:', error.response?.data || error.message);
      throw error;
    }
  };

  const handleEditAddress = async (addressId, updatedData) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/address/${addressId}`,
        {
          ...updatedData,
        },
        {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Edit address response:', response.data);
      setAddresses(addresses.map(addr => addr._id === addressId ? response.data : addr));
      return response.data;
    } catch (error) {
      console.error('Error updating address:', error.response?.data || error.message);
      throw error;
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      type: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      phoneNumber: '',
      country: 'India'
    });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await handleEditAddress(editingAddress._id, addressForm);
      } else {
        await handleAddAddress(addressForm);
      }
      setAddressModalOpen(false);
      setEditingAddress(null);
      resetAddressForm();
    } catch (error) {
      console.error('Error submitting address:', error);
      alert(error.message || 'Error submitting address. Please check all fields and try again.');
    }
  };

  const openEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      type: address.type || '',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postalCode || '',
      phoneNumber: address.phoneNumber || '',
      country: address.country || 'India'
    });
    setAddressModalOpen(true);
  };

  const renderAddressModal = () => (
    <Dialog
      open={isAddressModalOpen}
      onClose={() => setAddressModalOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-4 sm:p-6 mx-4">
          <Dialog.Title className="text-lg sm:text-xl font-semibold mb-4">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </Dialog.Title>
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <input
                type="text"
                placeholder="Home, Work, etc."
                value={addressForm.type}
                onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Street</label>
              <input
                type="text"
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                <input
                  type="text"
                  value={addressForm.postalCode}
                  onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={addressForm.phoneNumber}
                  onChange={(e) => setAddressForm({ ...addressForm, phoneNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setAddressModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
              >
                {editingAddress ? 'Save Changes' : 'Add Address'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'addresses', name: 'Addresses', icon: MapPinIcon },
    { id: 'orders', name: 'Orders', icon: ShoppingBagIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon },
  ];

  const renderTabContent = () => {
    
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <label className="block text-sm font-medium text-gray-600">Full Name</label>
                  <p className="mt-2 text-gray-900 font-medium">{user.name}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <p className="mt-2 text-gray-900 font-medium">{user.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <label className="block text-sm font-medium text-gray-600">Loyalty Points</label>
                  <p className="mt-2 text-gray-900 font-medium">{user.loyaltyPoints || 0} points</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <label className="block text-sm font-medium text-gray-600">Member Since</label>
                  <p className="mt-2 text-gray-900 font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'addresses':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Saved Addresses</h3>
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setAddressForm({
                      type: '',
                      street: '',
                      city: '',
                      state: '',
                      postalCode: '',
                      phoneNumber: '',
                      country: 'India'
                    });
                    setAddressModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add New Address
                </button>
              </div>
              {addresses.length > 0 ? (
                <div className="grid gap-6">
                  {addresses.map((address) => (
                    <div key={address._id} className="p-4 border rounded-lg hover:shadow-lg transition-shadow duration-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{address.type || 'Address'}</p>
                          <p className="text-gray-600 mt-2">{address.street}</p>
                          <p className="text-gray-600">{address.city}, {address.state} {address.postalCode}</p>
                          <p className="text-gray-600 text-sm mt-1">Phone: {address.phoneNumber}</p>
                        </div>
                        <div className="space-x-3">
                          <button
                            onClick={() => openEditAddress(address)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address._id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No addresses saved yet</p>
                  <p className="text-sm text-gray-400 mt-1">Add your first address to get started</p>
                </div>
              )}
            </div>
            {renderAddressModal()}
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Order History</h3>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">Order #{order._id.slice(-6)}</p>
                          <p className="text-gray-600 mt-2">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <div className="mt-2">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-lg">₹{order.total}</p>
                          <button className="mt-3 text-blue-600 hover:text-blue-800 font-medium transition-colors">
                            View Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No orders placed yet</p>
                  <p className="text-sm text-gray-400 mt-1">Your order history will appear here</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Account Settings</h3>
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-800 mb-4">Email Notifications</label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded" />
                      <span className="text-gray-700">Order updates</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded" />
                      <span className="text-gray-700">Promotions and deals</span>
                    </label>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">User Dashboard</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-3">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    className={`flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
                      activeTab === tab.id ? 'bg-yellow-100 text-yellow-700' : 'text-gray-600'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <tab.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-sm sm:text-base lg:text-lg">{tab.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:w-3/4 space-y-6 sm:space-y-8">
            {/* Back Button */}
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 flex items-center justify-center space-x-2"
            >
              <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium">Back to Home</span>
            </button>

            {/* Content Sections */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
