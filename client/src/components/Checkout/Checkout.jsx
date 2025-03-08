// src/Products/Checkout/Checkout.jsx
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Check } from 'lucide-react';

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United States",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order processing
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderComplete(true);
      clearCart();

      // Redirect to home after delay
      setTimeout(() => navigate("/"), 3000);
    }, 2000);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-medium mb-4">Your cart is empty</h1>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-12 max-w-md text-center"
      >
        <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-medium mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-6">Thank you for your purchase.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </button>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-light mb-8 text-center">Checkout</h1>

        {/* Progress Indicator */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div className={`flex flex-col items-center ${num > 1 ? 'flex-1' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${step >= num ? 'bg-black text-white' : 'bg-gray-200'}`}>
                  {num}
                </div>
                <p className="text-sm mt-1">
                  {num === 1 ? 'Shipping' : num === 2 ? 'Payment' : 'Review'}
                </p>
              </div>
              {num < 3 && (
                <div className={`flex-1 h-0.5 ${step > num ? 'bg-black' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Checkout Form */}
          <div className="md:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  {/* Shipping Form */}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  {/* Payment Form */}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  {/* Review Section */}
                </motion.div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="md:w-1/3">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm sticky top-8">
              <h2 className="text-xl font-medium mb-4">Order Summary</h2>
              {/* Cart Items */}
              <div className="border-t pt-4">
                {/* Total Calculation */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;