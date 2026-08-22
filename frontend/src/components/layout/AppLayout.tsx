import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafd] dark:bg-[#131314] font-sans antialiased text-slate-900 dark:text-white">
      {/* Google Top Bar */}
      <Navbar />

      {/* Workspace Body */}
      <div className="flex flex-1 min-w-0">
        {/* Google Left Rail */}
        <Sidebar />

        {/* Workspace Canvas with breathable padding */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
