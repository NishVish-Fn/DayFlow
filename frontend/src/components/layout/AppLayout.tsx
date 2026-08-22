import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0b0f19] font-sans antialiased text-white">
      {/* Top Outlook Ribbon */}
      <Navbar />

      {/* Main Body */}
      <div className="flex flex-1 min-w-0">
        {/* Left App Sidebar */}
        <Sidebar />

        {/* Workspace Canvas */}
        <main className="flex-1 p-5 sm:p-7 max-w-7xl w-full mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
