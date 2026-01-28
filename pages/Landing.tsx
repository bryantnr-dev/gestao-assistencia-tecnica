import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, User, Wrench } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wrench className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">TechFix Manager</h1>
        <p className="text-gray-500 mb-8">Sistema de Gestão de Assistência Técnica</p>

        <div className="space-y-4">
          <Link 
            to="/admin/dashboard" 
            className="group flex items-center p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 transition-all cursor-pointer"
          >
            <div className="bg-gray-100 p-3 rounded-full group-hover:bg-white transition-colors">
              <Shield className="w-6 h-6 text-gray-600 group-hover:text-primary" />
            </div>
            <div className="ml-4 text-left">
              <h3 className="font-semibold text-slate-800">Área do Técnico</h3>
              <p className="text-sm text-gray-500">Gerenciar ordens e clientes</p>
            </div>
          </Link>

          <Link 
            to="/client" 
            className="group flex items-center p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 transition-all cursor-pointer"
          >
            <div className="bg-gray-100 p-3 rounded-full group-hover:bg-white transition-colors">
              <User className="w-6 h-6 text-gray-600 group-hover:text-primary" />
            </div>
            <div className="ml-4 text-left">
              <h3 className="font-semibold text-slate-800">Área do Cliente</h3>
              <p className="text-sm text-gray-500">Consultar status do reparo</p>
            </div>
          </Link>
        </div>
        
        <p className="mt-8 text-xs text-gray-400">
          &copy; 2024 TechFix Solutions. v1.0.0
        </p>
      </div>
    </div>
  );
};