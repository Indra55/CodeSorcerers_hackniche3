import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Search, SlidersHorizontal, AlertTriangle } from 'lucide-react';
import ErrorBoundary from '../../components/ErrorBoundary';
import HeroSection from '../HeroSection';

// Use import.meta.env for environment variables in Vite
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedPrice, setSelectedPrice] = useState('All Prices');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [sortOption, setSortOption] = useState('Newest');

  // Generate a unique key for products without an id
  const getUniqueKey = (product, index) => {
    // Try different properties that could serve as a unique identifier
    return product._id || product.id || `product-${index}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products from API:", API_URL + "/products");
        const response = await fetch(`${API_URL}/products`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Fetched products successfully:", data.length);
        
        // Validate that data is an array
        if (!Array.isArray(data)) {
          throw new Error('Expected an array of products, but received ' + typeof data);
        }
        
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    try {
      if (!Array.isArray(products)) {
        console.warn("Products is not an array:", products);
        return [];
      }
      
      return products
        .filter((product) => {
          if (!product) return false;
          
          const matchesSearch =
            (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()));

          const matchesCategory =
            selectedCategory === 'All Categories' || product.category === selectedCategory;

          const matchesBrand =
            selectedBrand === 'All Brands' || product.brand === selectedBrand;

          const matchesPrice =
            selectedPrice === 'All Prices' ||
            (selectedPrice === 'Under $50' && product.price < 50) ||
            (selectedPrice === '$50 - $100' && product.price >= 50 && product.price <= 100) ||
            (selectedPrice === 'Over $100' && product.price > 100);

          return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
        })
        .sort((a, b) => {
          if (sortOption === 'Price: Low to High') return a.price - b.price;
          if (sortOption === 'Price: High to Low') return b.price - a.price;
          if (sortOption === 'Rating') return b.rating - a.rating;
          // Default sort for newest (using id or _id)
          const aId = a.id || a._id || 0;
          const bId = b.id || b._id || 0;
          return bId - aId;
        });
    } catch (err) {
      console.error("Error filtering products:", err);
      return [];
    }
  }, [products, searchTerm, selectedCategory, selectedBrand, selectedPrice, sortOption]);

  // Handlers
  const handleSearchChange = useCallback((e) => setSearchTerm(e.target.value), []);
  const toggleFilters = useCallback(() => setShowFilters(!showFilters), [showFilters]);
  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    // Trigger re-fetch
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg overflow-hidden animate-pulse">
              
              <div className="aspect-[3/4] bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Unable to load products</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <HeroSection/>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-light">New Arrivals</h1>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <button
              onClick={toggleFilters}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 p-4 rounded-lg mb-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="p-2 border rounded-md">
                <option>All Categories</option>
                <option>Tops</option>
                <option>Bottoms</option>
                <option>Accessories</option>
              </select>
              <select value={selectedPrice} onChange={(e) => setSelectedPrice(e.target.value)} className="p-2 border rounded-md">
                <option>All Prices</option>
                <option>Under $50</option>
                <option>$50 - $100</option>
                <option>Over $100</option>
              </select>
              <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="p-2 border rounded-md">
                <option>All Brands</option>
                <option>Brand 1</option>
                <option>Brand 2</option>
                <option>Brand 3</option>
              </select>
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="p-2 border rounded-md">
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
              </select>
            </div>
          </motion.div>
        )}
      </div>

      <motion.div initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <ErrorBoundary key={getUniqueKey(product, index)} fallbackMessage="Error displaying product">
            <ProductCard 
              product={product} 
            />
          </ErrorBoundary>
        ))}
      </motion.div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
