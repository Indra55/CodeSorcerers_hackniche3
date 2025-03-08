import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../components/Layouts/Header'
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
    pincode: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Current user data:', user);

        // Fetch orders using the correct endpoint
        const ordersResponse = await axios.get(`http://localhost:8000/orders/user/${user.userId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        console.log('Orders response:', ordersResponse.data);
        setOrders(ordersResponse.data);

        // Fetch addresses using the correct endpoint
        const addressesResponse = await axios.get(`http://localhost:8000/address/user/${user.userId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        console.log('Addresses response:', addressesResponse.data);
        setAddresses(addressesResponse.data);
      } catch (error) {
        console.error('Error details:', error.response || error);
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
      const response = await axios.post('http://localhost:8000/address', {
        ...addressData,
        user: user.userId,
        postalCode: addressData.pincode,
        phoneNumber: '1234567890', // Add a default phone number since it's required
        country: 'India' // Add a default country since it's required
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAddresses([...addresses, response.data]);
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await axios.delete(`http://localhost:8000/address/${addressId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAddresses(addresses.filter(addr => addr._id !== addressId));
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleEditAddress = async (addressId, updatedData) => {
    try {
      const response = await axios.patch(`http://localhost:8000/address/${addressId}`, {
        ...updatedData,
        postalCode: updatedData.pincode,
        phoneNumber: updatedData.phoneNumber || '1234567890',
        country: updatedData.country || 'India'
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAddresses(addresses.map(addr => addr._id === addressId ? response.data : addr));
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await handleEditAddress(editingAddress._id, addressForm);
      } else {
        await handleAddAddress({ ...addressForm, userId: user.userId });
      }
      setAddressModalOpen(false);
      setEditingAddress(null);
      setAddressForm({ type: '', street: '', city: '', state: '', pincode: '' });
    } catch (error) {
      console.error('Error submitting address:', error);
    }
  };

  const openEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm(address);
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
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full">
          <Dialog.Title className="text-lg font-semibold mb-4">
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Street</label>
              <input
                type="text"
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pincode</label>
              <input
                type="text"
                value={addressForm.pincode}
                onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setAddressModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                    setAddressForm({ type: '', street: '', city: '', state: '', pincode: '' });
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
                          <p className="text-gray-600">{address.city}, {address.state} {address.pincode}</p>
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
        <Header/>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4 bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">User Dashboard</h2>
            <div className="space-y-4">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-all duration-200 hover:bg-gray-50 ${activeTab === tab.id ? 'bg-yellow-100 text-yellow-700' : 'text-gray-600'}`}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                >
                  <tab.icon className="h-6 w-6" />
                  <span className="text-lg">{tab.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
  
          {/* Main Content Area */}
          <div className="md:w-3/4 space-y-8">
            {/* Move the Back Button here */}
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            >
              <ArrowLeftIcon className="h-5 w-5 text-white" />
              <span className="text-white font-medium">Back to Profile</span>
            </button>
  
            {/* Render Tab Content */}
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Profile;
