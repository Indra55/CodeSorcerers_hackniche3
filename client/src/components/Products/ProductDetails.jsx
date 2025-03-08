// src/components/Products/ProductDetails/ProductDetails.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { Star, Truck, RotateCcw, Heart, ShoppingBag, ChevronDown, ChevronUp, Share2 } from 'lucide-react';

const ProductDetails = ({ productData = null }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Initialize with safe defaults
  const [product, setProduct] = useState({
    id: '',
    name: '',
    brand: '',
    price: 0,
    rating: 0,
    reviews: 0,
    availability: false,
    loyaltypoints: 0,
    description: '',
    images: [],
    sizes: [],
    colors: [],
    material: '',
    care: '',
    link: '#'
  });

  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showDescription, setShowDescription] = useState(true);
  const [showDelivery, setShowDelivery] = useState(false);

  useEffect(() => {
    const loadProduct = () => {
      try {
        if (productData) {
          setProduct(prev => ({
            ...prev,
            ...productData,
            images: productData.images || [],
            sizes: productData.sizes || [],
            colors: productData.colors || []
          }));
          setLoading(false);
          return;
        }

        const storedProduct = localStorage.getItem('selectedProduct');
        if (storedProduct) {
          const parsedProduct = JSON.parse(storedProduct);
          setProduct(prev => ({
            ...prev,
            ...parsedProduct,
            images: parsedProduct.images || [],
            sizes: parsedProduct.sizes || [],
            colors: parsedProduct.colors || []
          }));
        } else {
          setProduct(prev => ({
            ...prev,
            name: "Premium Cotton T-Shirt",
            brand: "H&M",
            price: 29.99,
            rating: 4.5,
            reviews: 128,
            availability: true,
            loyaltypoints: 30,
            description: "This premium cotton t-shirt is perfect for everyday wear...",
            images: Array(4).fill('/placeholder.svg'),
            sizes: ["XS", "S", "M", "L", "XL"],
            colors: ["Black", "White", "Navy", "Gray"],
            material: "100% Organic Cotton",
            care: "Machine wash cold, tumble dry low"
          }));
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productData]);

  const handleAddToCart = () => {
    try {
      addToCart({
        ...product,
        // Generate unique ID if not available
        id: product.id || `${product.name}-${product.colors?.[0]}-${product.sizes?.[0]}`
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, ''),
        quantity
      });
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8 animate-pulse">
          <div className="md:w-1/2 bg-gray-200 aspect-[3/4] rounded-lg" />
          <div className="md:w-1/2 space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-10 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-12 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Gallery */}
        <div className="lg:w-3/5">
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-2 mt-4 md:mt-0">
              {(product.images || []).map((img, index) => (
                <button
                  key={`img-${index}-${img}`}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-md overflow-hidden transition-colors ${
                    selectedImage === index ? 'border-black' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img || '/placeholder.svg'}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-16 h-20 object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder.svg';
                    }}
                  />
                </button>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 bg-gray-50 rounded-lg overflow-hidden"
            >
              <img
                src={product.images?.[selectedImage] || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-auto object-contain aspect-[3/4]"
                onError={(e) => {
                  e.target.src = '/placeholder.svg';
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-2/5">
          <div className="sticky top-8 space-y-6">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                {product.brand}
              </p>
              <h1 className="text-2xl md:text-3xl font-light mt-1">
                {product.name}
              </h1>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={`star-${i}`}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 0)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-1">
                  ({product.reviews || 0} reviews)
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-2xl font-medium">
                ${(product.price || 0).toFixed(2)}
              </p>
              {product.loyaltypoints > 0 && (
                <p className="text-sm text-green-600">
                  Earn {product.loyaltypoints} loyalty points
                </p>
              )}
            </div>

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Color</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={`color-${index}-${color}`}
                      className={`w-8 h-8 rounded-full border-2 ${
                        index === 0 ? 'border-black' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      aria-label={`Select ${color} color`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Size</p>
                  <button className="text-xs underline hover:text-gray-600">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={`size-${size}`}
                      className="py-2 text-sm border border-gray-200 rounded-md hover:border-black transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Quantity</p>
              <div className="flex items-center border border-gray-200 rounded-md w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-50"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-50"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={!product.availability}
                className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-md transition-colors ${
                  product.availability
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-200 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {product.availability ? 'Add to Bag' : 'Out of Stock'}
              </button>
              <button className="p-2 border border-gray-200 rounded-md hover:bg-gray-50">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Product Details Accordion */}
            <div className="space-y-4">
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="flex justify-between w-full items-center"
                >
                  <span className="font-medium">Product Details</span>
                  {showDescription ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {showDescription && (
                  <div className="mt-2 text-gray-600 space-y-2 text-sm">
                    <p>{product.description}</p>
                    {product.material && (
                      <p>
                        <span className="font-medium">Material:</span>{' '}
                        {product.material}
                      </p>
                    )}
                    {product.care && (
                      <p>
                        <span className="font-medium">Care:</span> {product.care}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;