import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.name}`, { state: { product } });
  };

  return (
    <section>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${product.name}`}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-60 object-cover transition-opacity duration-300 hover:opacity-90"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
          <p className="text-gray-500">{product.brand}</p>
          <p className="text-blue-600 font-bold mt-2">₹ {product.price}</p>
          <p className="text-yellow-500 text-sm">⭐ {product.rating} ({product.reviews} reviews)</p>
          <p
            className={`text-sm mt-1 ${
              product.availability ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {product.availability ? 'In Stock' : 'Out of Stock'}
          </p>
          <p className="text-sm text-gray-600">Loyalty Points: {product.loyaltypoints}</p>
        </div>
      </div>
    </section>
  );
};

export default ProductCard;