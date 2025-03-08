// src/Products/ProductList/ProductList.jsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../Products/ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';

const ProductList = ({ initialProducts = [] }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (initialProducts.length > 0) {
      setProducts(initialProducts);
      setLoading(false);
      return;
    }

    const loadProducts = async () => {
      try {
        setTimeout(() => {
          const dummyProducts = Array.from({ length: 12 }, (_, i) => ({
            id: i + 1,
            name: `Product ${i + 1}`,
            brand: `Brand ${(i % 5) + 1}`,
            price: 19.99 + i * 10,
            rating: 3 + (i % 3),
            reviews: 10 + i * 5,
            availability: i % 4 !== 0,
            loyaltypoints: i * 5,
            imageUrl: '/placeholder.svg',
            description: 'Premium quality product for modern lifestyles',
          }));
          setProducts(dummyProducts);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading products:', error);
        setLoading(false);
      }
    };

    loadProducts();
  }, [initialProducts]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-light">New Arrivals</h1>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
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
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select className="w-full p-2 border border-gray-300 rounded-md bg-white">
                  <option>All Categories</option>
                  <option>Tops</option>
                  <option>Bottoms</option>
                  <option>Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <select className="w-full p-2 border border-gray-300 rounded-md bg-white">
                  <option>All Prices</option>
                  <option>Under $50</option>
                  <option>$50 - $100</option>
                  <option>Over $100</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Brand</label>
                <select className="w-full p-2 border border-gray-300 rounded-md bg-white">
                  <option>All Brands</option>
                  <option>Brand 1</option>
                  <option>Brand 2</option>
                  <option>Brand 3</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select className="w-full p-2 border border-gray-300 rounded-md bg-white">
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
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