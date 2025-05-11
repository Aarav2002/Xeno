import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`flex-1 p-4 md:p-8 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;