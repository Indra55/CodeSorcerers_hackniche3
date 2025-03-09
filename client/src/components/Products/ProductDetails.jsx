import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
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
    colors: ['#000000', '#3B82F6', '#EF4444', '#10B981'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
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
        id: product.id || `${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
        quantity,
        selectedColor: product.colors[selectedColor],
        selectedSize: product.sizes[selectedSize]
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
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
            
            <button 
              onClick={() => setIsWishlist(!isWishlist)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all"
            >
              <Heart className={`w-5 h-5 ${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
            </button>
            
            <button className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all">
              <Share2 className="w-5 h-5 text-gray-500" />
            </button>
          </div>

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
            <Star className="w-5 h-5 text-yellow-500" />
            <p className="text-sm">{product.rating} ({product.reviews} reviews)</p>
          </div>

          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Color</div>
            <div className="flex gap-2">
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(index)}
                  className={`w-8 h-8 rounded-full transition-all duration-200 
                    ${selectedColor === index ? 'ring-2 ring-offset-2 ring-blue-500' : 'ring-1 ring-gray-300'}`}
                  style={{ backgroundColor: color }}
                  aria-label={`Color option ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Size</div>
            <div className="flex gap-2">
              {product.sizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(index)}
                  className={`px-4 py-2 border rounded-full 
                    ${selectedSize === index ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  aria-label={`Size ${size}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-6 py-2 rounded-full w-full hover:bg-blue-700"
            >
              {addedToCart ? 'Go to Cart' : 'Add to Cart'}
            </motion.button>
            <button
              onClick={() => setIsWishlist(!isWishlist)}
              className={`p-2 bg-white rounded-full shadow-md ${isWishlist ? 'text-red-500' : 'text-gray-500'}`}
            >
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">You may also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.length > 0 ? (
            recommendations.map((recommendedProduct, index) => (
              <div key={index} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src={recommendedProduct.image_url}
                  alt={recommendedProduct.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-sm font-semibold">{recommendedProduct.name}</h3>
                  <p className="text-sm text-gray-500">${recommendedProduct.price}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No recommendations available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
