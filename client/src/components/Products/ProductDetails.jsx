import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import HeroSection from '../HeroSection'

import { Star, Heart, ShoppingBag, ChevronDown, ChevronUp, Check, XCircle, Share2 } from 'lucide-react';

const ProductDetails = ({ productData = null }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState({
    id: '',
    name: '',
    brand: '',
    price: 0,
    rating: 0,
    reviews: 0,
    availability: false,
    description: '',
    images: [],
    colors: ['#000000', '#3B82F6', '#EF4444', '#10B981'], // Added color options
    sizes: ['XS', 'S', 'M', 'L', 'XL'], // Added size options
  });

  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showDescription, setShowDescription] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(2); // Default to Medium
  const [isWishlist, setIsWishlist] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showZoom, setShowZoom] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (productData) {
          setProduct(prev => ({
            ...prev,
            ...productData,
            images: Array.isArray(productData.image_url) ? productData.image_url : [productData.image_url],
          }));
          fetchRecommendations(productData.name);
          setLoading(false);
          return;
        }

        const storedProduct = localStorage.getItem('selectedProduct');
        if (storedProduct) {
          const parsedProduct = JSON.parse(storedProduct);
          setProduct(prev => ({
            ...prev,
            ...parsedProduct,
            images: Array.isArray(parsedProduct.image_url) ? parsedProduct.image_url : [parsedProduct.image_url],
          }));
          fetchRecommendations(parsedProduct.name);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productData]);

  const fetchRecommendations = async (productName) => {
    try {
      // Use template literals correctly with backticks
      const response = await fetch(`http://127.0.0.1:5000/recommend?product_name=${encodeURIComponent(productName)}`);
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data);
      } else {
        setError('Failed to fetch recommendations');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Error fetching recommendations');
    }
  };

  const handleAddToCart = () => {
    try {
      addToCart({
        ...product,
        id: product.id || `${product.name}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        quantity,
        selectedColor: product.colors[selectedColor],
        selectedSize: product.sizes[selectedSize]
      });
      // Added a success animation
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
      // Navigate after delay to show animation
      setTimeout(() => navigate('/cart'), 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const handleMouseEnter = () => {
    setShowZoom(true);
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
    setZoomLevel(1);
  };

  const handleMouseMove = (e) => {
    if (!showZoom) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
   
    // Update transform origin for zoom effect
    e.currentTarget.style.transformOrigin = `${x * 100}% ${y * 100}%`;
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Error Handling */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

    
    <div className="text-sm text-gray-500 mb-4">
        <span className="cursor-pointer hover:text-blue-500" onClick={() => navigate('/')}>Home</span> /
        <span className="cursor-pointer hover:text-blue-500" onClick={() => navigate('/products')}> Products</span> /
        <span className="text-gray-700"> {product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images - FIXED IMAGE SIZE */}
        <div className="lg:w-1/2">
          <div className="relative group">
            <div
              className="overflow-hidden rounded-lg shadow-lg bg-gray-50"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              <div className="aspect-w-1 aspect-h-1 w-full">
                <motion.img
                  src={product.images[selectedImage] || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  style={{
                    maxHeight: '400px',
                    transform: showZoom ? `scale(${zoomLevel})` : 'scale(1)',
                    transition: 'transform 0.2s ease-out'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              {showZoom && (
                <div className="absolute bottom-4 right-4 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                  Hover to zoom
                </div>
              )}
            </div>
           
            {/* Wishlist button */}
            <button
              onClick={() => setIsWishlist(!isWishlist)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all"
            >
              <Heart className={`w-5 h-5 ${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
            </button>
           
            {/* Share button */}
            <button className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all">
              <Share2 className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Image Gallery - FIXED THUMBNAIL SIZE */}
          <div className="mt-4 flex gap-2 justify-center flex-wrap">
            {product.images.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={image}
                  alt={`thumbnail-${index}`}
                  className={`w-16 h-16 object-cover rounded-md cursor-pointer transition-all duration-200
                    ${selectedImage === index ? 'border-2 border-blue-500 shadow-md' : 'border border-gray-200 opacity-70'}`}
                  onClick={() => handleImageClick(index)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2">
          <h1 className="text-2xl font-light mb-1">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-3">{product.brand}</p>
         
          <div className="flex items-center gap-3 mb-4">
            <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
            {product.originalPrice && (
              <p className="text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
            )}
            {product.discountPercentage && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>
         
          <div className="flex items-center gap-2 mb-4">
            {/* Rating */}
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  className={`w-5 h-5 ${index < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' :
                    (index < product.rating ? 'fill-yellow-400 text-yellow-400 opacity-50' : 'text-gray-300')}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({product.reviews} Reviews)</span>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2 mb-5">
            <div className={`flex items-center ${product.availability ? 'text-green-600' : 'text-red-500'}`}>
              {product.availability ? (
                <>
                  <Check className="w-5 h-5 mr-1" />
                  <span className="font-medium">In Stock</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 mr-1" />
                  <span className="font-medium">Out of Stock</span>
                </>
              )}
            </div>
            {product.availability && product.stockCount && (
              <span className="text-sm text-gray-500">({product.stockCount} items left)</span>
            )}
          </div>
         
          {/* Color Selection */}
          <div className="mb-5">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Color</h3>
            <div className="flex gap-3">
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(index)}
                  className={`w-8 h-8 rounded-full transition-all duration-200 ${selectedColor === index ? 'ring-2 ring-offset-2 ring-blue-500' : 'ring-1 ring-gray-300'}`}
                  style={{ backgroundColor: color }}
                  aria-label={`Color option ${index + 1}`}
                />
              ))}
            </div>
          </div>
         
          {/* Size Selection */}
          <div className="mb-5">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Size</h3>
            <div className="flex gap-2">
              {product.sizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(index)}
                  className={`w-10 h-10 flex items-center justify-center rounded-md transition-all duration-200
                    ${selectedSize === index
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  aria-label={`Size ${size}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
         
          {/* Quantity Selector */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Quantity</h3>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-l-md border border-gray-300"
                disabled={quantity <= 1}
              >
                <span className="text-xl font-medium">-</span>
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 h-10 border-t border-b border-gray-300 text-center"
                min="1"
              />
              <button
                onClick={() => setQuantity(prev => prev + 1)}
                className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-r-md border border-gray-300"
              >
                <span className="text-xl font-medium">+</span>
              </button>
            </div>
          </div>
         
          {/* Add to Cart Button */}
          <motion.button
            onClick={handleAddToCart}
            className={`w-full bg-black text-white py-3 px-6 rounded-md font-medium transition-all
              ${!product.availability && 'opacity-50 cursor-not-allowed'}
              ${addedToCart && 'bg-green-600'}`}
            disabled={!product.availability}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {addedToCart ? (
              <span className="flex items-center justify-center">
                <Check className="w-5 h-5 mr-2" />
                Added to Cart
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
              </span>
            )}
          </motion.button>
         
          {/* Free Shipping Notice */}
          <div className="mt-4 text-sm text-gray-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Free shipping on orders over $50
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-10 bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Product Description</h2>
          <button
            onClick={() => setShowDescription(prev => !prev)}
            className="text-blue-600 text-sm flex items-center hover:text-blue-800 transition-colors"
          >
            {showDescription ? 'Show Less' : 'Show More'}
            {showDescription ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </button>
        </div>
        <div className={`text-gray-700 ${showDescription ? '' : 'line-clamp-3'}`}>
          <p className="leading-relaxed">{product.description}</p>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
              whileHover={{ y: -5 }}
            >
              <div className="relative overflow-hidden group h-40">
                <img
                  src={rec.image_url || '/placeholder.svg'}
                  alt={rec.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => navigate(`/product/${rec.name}`)}
                    className="bg-white text-gray-900 px-3 py-1 rounded-md text-xs font-medium transform -translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium mb-1 truncate">{rec.name}</h3>
                <p className="text-gray-900 font-bold">${rec.price.toFixed(2)}</p>
                {rec.originalPrice && (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-500 text-sm line-through">${rec.originalPrice.toFixed(2)}</p>
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">Sale</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
