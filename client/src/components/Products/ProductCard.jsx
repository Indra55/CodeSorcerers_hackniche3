// src/Products/components/ProductCard.jsx
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Star, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleClick = () => {
    // Store the product in localStorage for the details page
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    
    // Use the product ID or _id for the URL parameter (singular 'product' not 'products')
    const productId = product._id || product.id || 'unknown';
    
    // Navigate to the correct route format: /product/:id (singular)
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden">
        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={product.image_url || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="absolute top-3 right-3 z-10">
          <button
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors" />
          </button>
        </div>

        {product.availability ? (
          <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full py-2 flex items-center justify-center gap-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to bag
            </button>
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 bg-gray-200 bg-opacity-90 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="w-full py-2 flex items-center justify-center text-gray-600 text-sm font-medium">
              Out of stock
            </p>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
        </div>

        <p className="text-sm text-gray-500 uppercase tracking-wider">{product.brand}</p>
        <h2 className="text-base font-medium mt-1 line-clamp-1">{product.name}</h2>

        <div className="mt-2 flex items-center justify-between">
          <p className="font-semibold">${product.price.toFixed(2)}</p>
          {product.loyaltypoints > 0 && (
            <p className="text-xs text-green-600">+{product.loyaltypoints} points</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;