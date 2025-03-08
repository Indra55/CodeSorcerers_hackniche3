import React from 'react';
import { useLocation } from 'react-router-dom';

const ProductDetails = () => {
  const location = useLocation();
  const { product } = location.state;

  return (
    <div className="flex flex-col md:flex-row p-6 bg-white shadow-lg rounded-lg m-6 transition-transform duration-300 hover:scale-105">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full md:w-1/3 h-auto object-cover rounded-md transition-opacity duration-300 hover:opacity-90"
      />
      <div className="md:ml-8 mt-4 md:mt-0 text-gray-800">
        <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
        <p className="text-gray-500 mb-1">{product.brand}</p>
        <p className="text-blue-600 font-bold mb-2">${product.price}</p>
        <p className="text-yellow-500 mb-2">⭐ {product.rating} ({product.reviews} reviews)</p>
        <p
          className={`mb-2 ${
            product.availability ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {product.availability ? 'In Stock' : 'Out of Stock'}
        </p>
        <p className="text-sm text-gray-600 mb-4">Loyalty Points: {product.loyaltypoints}</p>
        <p className="text-gray-700 mb-4">{product.description}</p>
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          View on Website
        </a>
      </div>
    </div>
  );
};

export default ProductDetails;