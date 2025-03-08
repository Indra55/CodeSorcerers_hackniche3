// src/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import ProductList from '../Products/ProductList';

const HomePage = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative mb-16">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src="/images/hero-spring-collection.jpg"
            alt="New Collection"
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="text-center p-8 bg-white/90 backdrop-blur-sm max-w-2xl rounded-lg">
            <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-wide">
              Spring Collection
            </h1>
            <p className="text-lg mb-6 text-gray-600">
              Discover the latest trends for the new season
            </p>
            <Link 
              to="/new-arrivals"
              className="inline-block px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors rounded-full text-sm font-medium"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <ProductList />

      {/* Category Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Women', 'Men', 'Accessories'].map((category) => (
            <div 
              key={category}
              className="relative overflow-hidden group rounded-xl"
            >
              <img
                src={`/images/${category.toLowerCase()}-category.jpg`}
                alt={`${category} Collection`}
                className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-lg">
                  <h2 className="text-2xl font-light mb-3">{category}</h2>
                  <Link
                    to={`/${category.toLowerCase()}`}
                    className="text-sm font-medium underline hover:text-gray-600 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;