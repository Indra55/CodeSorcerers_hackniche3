// pages/ProductsPage.jsx
import ProductGrid from '../components/products/ProductGrid';

const ProductsPage = () => {
  const sampleProducts = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 199.99,
      category: 'Electronics',
      images: [
        '/images/headphones-1.jpg',
        '/images/headphones-2.jpg',
        '/images/headphones-3.jpg'
      ]
    },
    // ... more products
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <ProductGrid products={sampleProducts} />
    </div>
  );
};

export default ProductsPage;