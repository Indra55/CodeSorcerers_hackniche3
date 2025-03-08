// components/products/ProductGrid.jsx
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
        />
      ))}
    </div>
  );
};

export default ProductGrid;