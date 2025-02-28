
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, Search, User } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="header py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold">ECOMM-SK</Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/categories" className="hover:text-gray-600 transition-colors">Categories</Link>
              <Link to="/sale" className="hover:text-gray-600 transition-colors">Sale</Link>
              <Link to="/clearance" className="hover:text-gray-600 transition-colors">Clearance</Link>
              <Link to="/new" className="hover:text-gray-600 transition-colors">New stock</Link>
              <Link to="/trending" className="hover:text-gray-600 transition-colors">Trending</Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex text-sm space-x-4">
              <Link to="/help" className="hover:text-gray-600 transition-colors">Help</Link>
              <Link to="/orders" className="hover:text-gray-600 transition-colors">Orders & Returns</Link>
              {isAuthenticated ? (
                <span className="flex items-center">
                  Hi, {user?.name?.split(' ')[0]}
                  <button 
                    onClick={logout}
                    className="ml-2 text-xs text-gray-500 hover:text-black"
                  >
                    Logout
                  </button>
                </span>
              ) : (
                <Link to="/login" className="hover:text-gray-600 transition-colors">Login</Link>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-1 hover:text-gray-600 transition-colors">
                <Search size={20} />
              </button>
              <Link to="/cart" className="p-1 hover:text-gray-600 transition-colors">
                <ShoppingCart size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 py-2 mt-4 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <button className="p-1 hover:text-gray-600 transition-colors">
              &lt;
            </button>
            <p className="text-sm mx-2">Get 28% off UpOn business Sign Up</p>
            <button className="p-1 hover:text-gray-600 transition-colors">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
