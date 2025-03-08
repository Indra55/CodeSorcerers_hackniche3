// src/layouts/MainLayout.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Heart, Search, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Cart from '../components/Cart/Cart';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/" className="text-2xl font-light hover:opacity-75 transition-opacity">
              STORE
            </Link>

            <nav className="hidden md:flex gap-6">
              {['New', 'Women', 'Men', 'Accessories', 'Sale'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="text-sm uppercase tracking-wide hover:text-gray-600 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block">
                <Search size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block">
                <User size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block">
                <Heart size={20} />
              </button>
              <button 
                className="p-2 relative hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 fixed w-full left-0 z-20 animate-slide-down">
            <nav className="container mx-auto px-4 py-4">
              <div className="space-y-3">
                {['New', 'Women', 'Men', 'Accessories', 'Sale'].map((item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase()}`}
                    className="block py-2 text-lg uppercase hover:bg-gray-50 rounded px-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
              </div>
              <div className="border-t pt-4 mt-4 flex justify-between">
                {[
                  { icon: Search, text: 'Search' },
                  { icon: User, text: 'Account' },
                  { icon: Heart, text: 'Wishlist' }
                ].map((item, index) => (
                  <button 
                    key={index}
                    className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <item.icon size={20} />
                    <span className="text-xs">{item.text}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default MainLayout;