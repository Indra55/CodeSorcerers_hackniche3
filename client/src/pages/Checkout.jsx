// src/pages/CheckoutPage.jsx
import React from 'react';
import Checkout from '../components/Checkout/Checkout';

const CheckoutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Secure Checkout</h1>
        <Checkout />
      </div>
    </div>
  );
};

export default CheckoutPage;