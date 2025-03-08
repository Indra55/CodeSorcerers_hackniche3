// src/pages/Products/[slug]/ProductPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetails from '../../../components/Product/ProductDetails';
import { useCart } from '../../../context/CartContext';

const ProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Try cache first
        const cachedProduct = localStorage.getItem(`product-${slug}`);
        if (cachedProduct) {
          setProduct(JSON.parse(cachedProduct));
          setLoading(false);
          return;
        }

        // API call
        const response = await fetch(`/api/products/${slug}`);
        if (!response.ok) throw new Error('Product not found');
        
        const data = await response.json();
        localStorage.setItem(`product-${slug}`, JSON.stringify(data));
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Gallery Skeleton */}
          <div className="md:w-1/2 space-y-4">
            <div className="bg-gray-100 aspect-square rounded-xl" />
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-1/4 h-20 bg-gray-100 rounded-lg" />
              ))}
            </div>
          </div>
          
          {/* Product Info Skeleton */}
          <div className="md:w-1/2 space-y-6">
            <div className="h-8 bg-gray-100 rounded w-3/4" />
            <div className="h-6 bg-gray-100 rounded w-1/2" />
            <div className="h-10 bg-gray-100 rounded w-1/4" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-gray-100 rounded w-full" />
              ))}
            </div>
            <div className="h-12 bg-gray-100 rounded-xl w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
        <p className="text-gray-600">Please try another product</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <ProductDetails 
        product={product} 
        onAddToCart={() => addToCart(product)}
      />
    </div>
  );
};

export default ProductPage;