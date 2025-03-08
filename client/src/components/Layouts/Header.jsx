import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SearchBox } from '../search';
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  UserIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import CategoryNav from './CategoryNav';

const Header = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
    { name: 'Orders', href: '/orders' },
    { name: 'Rewards', href: '/rewards' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b w-full">
  <div className="w-full px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Left: Logo & Mobile Menu Button */}
      <div className="flex items-center">
        <button
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
        <Link to="/" className="flex-shrink-0">
          <h1 className="font-bold text-2xl text-blue-600 hover:text-blue-700 transition-colors">
            ShopMart
          </h1>
        </Link>
      </div>

      {/* Center: Search Box */}
      <div className="flex-1 max-w-2xl mx-4 hidden md:block">
        <SearchBox />
      </div>

      {/* Right: Icons */}
      <div className="flex items-center space-x-4">
        <Link
          to="/cart"
          className="p-2 rounded-lg hover:bg-gray-100 relative focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ShoppingCartIcon className="h-6 w-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">
            {user?.cartItemsCount || 0}
          </span>
        </Link>

        <button
          className="p-2 rounded-lg hover:bg-gray-100 relative focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => {/* Add notification handler */}}
        >
          <BellIcon className="h-6 w-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">
            {user?.notificationsCount || 0}
          </span>
        </button>

        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="User menu"
          >
            <UserIcon className="h-6 w-6 text-gray-600" />
            <span className="ml-2 text-gray-700 hidden lg:inline">
              Hi, {user?.name || user?.firstName || 'Guest'}
            </span>
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hidden md:inline">
              {user?.loyaltyPoints || 0} pts
            </span>
          </button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                onClick={() => setProfileMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                onClick={() => setProfileMenuOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Mobile Menu */}
    {isMobileMenuOpen && (
      <div className="md:hidden py-4 border-t">
        <nav className="grid gap-2 px-4">
          <div className="mb-4">
            <SearchBox />
          </div>
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    )}
    <CategoryNav />
  </div>
</header>

  );
};

export default Header;