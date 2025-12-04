import React, { useState } from 'react';
import { Menu, Layout as LayoutIcon, Users, Settings, Home, BarChart } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);



  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar collapsed={isSidebarCollapsed} setCollapsed={setIsSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-2">
          <div className="bg-white rounded-lg shadow-sm p-2 min-h-full">
            <Outlet/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;