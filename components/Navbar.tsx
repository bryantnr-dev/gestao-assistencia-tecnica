
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Smartphone, PlusCircle, LogOut, Package, Users, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');

  const navLinkClass = (path: string) => 
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${location.pathname === path ? 'bg-blue-50 text-primary' : 'text-gray-600 hover:text-primary hover:bg-gray-50'}`;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-800">TechFix</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden md:inline">Painel</span>
                </Link>
                <Link to="/admin/inventory" className={navLinkClass('/admin/inventory')}>
                  <Package className="w-4 h-4" />
                  <span className="hidden md:inline">Estoque</span>
                </Link>
                <Link to="/admin/customers" className={navLinkClass('/admin/customers')}>
                  <Users className="w-4 h-4" />
                  <span className="hidden md:inline">Clientes</span>
                </Link>
                <div className="h-6 w-px bg-gray-200 mx-2"></div>
                <Link to="/admin/new" className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Novo Reparo</span>
                </Link>
                <Link to="/" className="ml-2 text-gray-400 hover:text-gray-600 p-2">
                  <LogOut className="w-5 h-5" />
                </Link>
              </>
            ) : (
              <Link to="/client" className="flex items-center gap-2 text-gray-600 hover:text-primary px-4 py-2 rounded-md font-medium hover:bg-gray-50">
                Consultar Ordem
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
