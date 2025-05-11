import React from 'react';
import { Menu, Bell, Database, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <nav className="bg-white shadow-sm py-3 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-1 mr-2 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1 rounded">
            <Database size={20} />
          </div>
          <span className="font-bold text-lg text-blue-600 hidden md:block">CRM Platform</span>
        </div>
      </div>

      <div className="hidden md:flex items-center px-4 py-2 bg-gray-100 rounded-lg w-1/3">
        <Search size={18} className="text-gray-500 mr-2" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none focus:outline-none w-full text-sm" 
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-700 rounded-full hover:bg-gray-100 relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <img 
              src={user?.picture || 'https://randomuser.me/api/portraits/women/17.jpg'} 
              alt="User" 
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700 hidden md:block">{user?.name || 'Jane Doe'}</span>
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
              <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
              <button 
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;