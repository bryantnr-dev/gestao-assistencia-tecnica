
import React, { useState } from 'react';
import { useRepair } from '../../context/RepairContext';
import { Link, useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../components/StatusBadge';
import { TicketStatus } from '../../types';
import { STATUS_LABELS } from '../../constants';
import { Search, Filter, Eye, Trash2, FileText } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { tickets, deleteTicket } = useRepair();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const navigate = useNavigate();

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.device.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === TicketStatus.PENDING || t.status === TicketStatus.APPROVAL_NEEDED).length,
    inProgress: tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
    ready: tickets.filter(t => t.status === TicketStatus.READY).length
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Painel de Controle</h1>
          <p className="text-gray-500">Gerenciamento de Ordens e Serviços</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 min-w-[100px]">
                <span className="block text-gray-500">Atenção</span>
                <span className="text-xl font-bold text-orange-600">{stats.pending}</span>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 min-w-[100px]">
                <span className="block text-gray-500">Em Reparo</span>
                <span className="text-xl font-bold text-blue-600">{stats.inProgress}</span>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 min-w-[100px]">
                <span className="block text-gray-500">Prontos</span>
                <span className="text-xl font-bold text-green-600">{stats.ready}</span>
            </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por cliente, ID ou modelo..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto bg-white">
          <Filter className="h-5 w-5 text-gray-500" />
          <select 
            className="border border-gray-300 bg-white rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-primary outline-none flex-1 cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Todos os Status</option>
            {Object.keys(TicketStatus).map((key) => (
              <option key={key} value={key}>
                {STATUS_LABELS[key as TicketStatus]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID / Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aparelho</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-primary">{ticket.id}</div>
                    <div className="text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{ticket.customer.name}</div>
                    <div className="text-xs text-gray-500">{ticket.customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{ticket.device.model}</div>
                    <div className="text-xs text-gray-500">{ticket.device.brand}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={ticket.status} />
                    {ticket.budget && ticket.budget.status === 'APPROVED' && (
                        <span className="ml-2 text-xs text-green-600 font-bold">Aprovado</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.budget?.totalCost 
                        ? `R$ ${ticket.budget.totalCost.toFixed(2)}` 
                        : ticket.estimatedCost ? `~ R$ ${ticket.estimatedCost.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                    <button 
                      onClick={() => navigate(`/admin/ticket/${ticket.id}`)} 
                      className="text-gray-500 hover:text-primary p-2 rounded-full hover:bg-blue-50 transition-colors" 
                      title="Ver Detalhes"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => navigate(`/admin/ticket/${ticket.id}`)} 
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors" 
                      title="Gerenciar Orçamento"
                    >
                      <FileText className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => deleteTicket(ticket.id)} 
                      className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors" 
                      title="Excluir"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Nenhuma ordem de serviço encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
