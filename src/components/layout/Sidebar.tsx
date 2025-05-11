import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, PieChart, Mail, Settings, HelpCircle } from 'lucide-react';
import { Video as VideoIcon } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside 
      className={`fixed h-full bg-white shadow-md transition-all duration-300 z-10 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="h-full py-5 overflow-y-auto">
        <ul className="space-y-2 px-3">
          <li>
            <NavLink 
              to="/"
              className={({ isActive }) => `
                flex items-center p-3 rounded-lg transition-all
                ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <Home size={20} />
              <span className={`ml-3 font-medium ${!isOpen && 'hidden'}`}>Dashboard</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/customers"
              className={({ isActive }) => `
                flex items-center p-3 rounded-lg transition-all
                ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <Users size={20} />
              <span className={`ml-3 font-medium ${!isOpen && 'hidden'}`}>Customers</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/segments"
              className={({ isActive }) => `
                flex items-center p-3 rounded-lg transition-all
                ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <PieChart size={20} />
              <span className={`ml-3 font-medium ${!isOpen && 'hidden'}`}>Segments</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/campaigns"
              className={({ isActive }) => `
                flex items-center p-3 rounded-lg transition-all
                ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <Mail size={20} />
              <span className={`ml-3 font-medium ${!isOpen && 'hidden'}`}>Campaigns</span>
            </NavLink>
          </li>
          
          <li className="pt-6">
            <div className={`px-3 text-xs font-semibold text-gray-400 uppercase ${!isOpen && 'hidden'}`}>
              Support
            </div>
          </li>

          <li>
  <NavLink 
    to="/demo-video"
    className={({ isActive }) => `
      flex items-center p-3 rounded-lg transition-all
      ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
    `}
  >
    <VideoIcon size={20} />
    <span className={`ml-3 font-medium ${!isOpen && 'hidden'}`}>Demo Video</span>
  </NavLink>
</li>

          
          <li>
            <a 
              href="#settings"
              className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <Settings size={20} />
              <span className={`ml-3 font-medium ${!isOpen && 'hidden'}`}>Settings</span>
            </a>
          </li>
          
          <li>
            <a 
              href="#help"
              className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <HelpCircle size={20} />
              <span className={`ml-3 font-medium ${!isOpen && 'hidden'}`}>Help</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;