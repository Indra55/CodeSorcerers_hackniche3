// components/products/ProductCard.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <Link 
      to={`/products/${product.id}`}
      className="group relative block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-out"
    >
      {/* Image Container */}
      <div className="relative aspect-square">
        {/* Main Product Image */}
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Image Gallery Indicators */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
          {product.images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                setCurrentImageIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Price Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="text-white font-semibold text-lg">
            ${product.price.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        <h3 className="text-gray-900 font-medium truncate">{product.name}</h3>
        <div className="flex items-center mt-1">
          <span className="text-sm text-gray-500">{product.category}</span>
        </div>
      </div>

      {/* Quick View Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          // Handle quick view modal
        }}
        className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm hover:bg-white"
      >
        Quick View
      </button>
    </Link>
  );
};

export default ProductCard;