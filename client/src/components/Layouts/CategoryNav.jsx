// components/layout/CategoryNav.jsx
import { Link } from 'react-router-dom';

const CategoryNav = () => {
  const categories = [
    { name: 'Electronics', href: '/category/electronics' },
    { name: 'Fashion', href: '/category/fashion' },
    { name: 'Home & Kitchen', href: '/category/home-kitchen' },
    { name: 'Beauty', href: '/category/beauty' },
    { name: 'Sports', href: '/category/sports' },
    { name: 'Books', href: '/category/books' },
    { name: 'Toys', href: '/category/toys' },
  ];

  return (
    <nav className="items-center border-t ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden md:flex items-center h-12 gap-20 justify-center w-full overflow-x-auto">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.href}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {category.name}
            </Link>
          ))}
        </div>
        
        {/* Mobile dropdown */}
        <div className="md:hidden relative">
          <select 
            className="w-full h-12 pl-4 pr-8 text-sm border-none bg-transparent focus:ring-0"
            onChange={(e) => window.location.href = e.target.value}
          >
            <option value="">Browse Categories</option>
            {categories.map((category) => (
              <option key={category.name} value={category.href}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;