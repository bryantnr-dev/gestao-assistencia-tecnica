
import React, { useState } from 'react';
import { useRepair } from '../../context/RepairContext';
import { TicketStatus, Customer } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { Search, User, Phone, Calendar, DollarSign, PenTool } from 'lucide-react';

export const CustomerHistory: React.FC = () => {
  const { tickets } = useRepair();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Derive unique customers from tickets
  const uniqueCustomers = new Map<string, Customer>();
  tickets.forEach(t => {
    uniqueCustomers.set(t.customer.id, t.customer);
  });

  const customers = Array.from(uniqueCustomers.values())
    .filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.phone.includes(searchTerm) || 
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const selectedCustomerTickets = selectedCustomerId 
    ? tickets.filter(t => t.customer.id === selectedCustomerId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-6 h-[calc(100vh-80px)]">
        {/* Left Panel: Customer List */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Clientes
                </h2>
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar nome, tel ou email..." 
                        className="w-full pl-9 p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {customers.map(customer => (
                    <div 
                        key={customer.id}
                        onClick={() => setSelectedCustomerId(customer.id)}
                        className={`p-4 border-b border-slate-200 cursor-pointer transition-all ${
                            selectedCustomerId === customer.id 
                            ? 'bg-blue-50 border-l-4 border-l-blue-600' 
                            : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                        }`}
                    >
                        <div className={`font-medium ${selectedCustomerId === customer.id ? 'text-blue-900' : 'text-slate-700'}`}>
                            {customer.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" /> {customer.phone}
                        </div>
                    </div>
                ))}
                {customers.length === 0 && <div className="p-6 text-center text-gray-400 text-sm">Nenhum cliente encontrado</div>}
            </div>
        </div>

        {/* Right Panel: History Details */}
        <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            {selectedCustomer ? (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-white">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">{selectedCustomer.name}</h1>
                                <div className="text-gray-600 flex gap-4 text-sm mt-1">
                                    <span>{selectedCustomer.email}</span>
                                    <span>•</span>
                                    <span>{selectedCustomer.phone}</span>
                                </div>
                                <div className="mt-2 text-xs text-gray-400">ID: {selectedCustomer.id}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                        <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            Histórico de Serviços
                        </h3>
                        <div className="space-y-6">
                            {selectedCustomerTickets.map(ticket => (
                                <div key={ticket.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm relative hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="font-bold text-lg text-slate-800">{ticket.device.model}</div>
                                            <div className="text-sm text-gray-500">{ticket.device.brand} - {ticket.device.color}</div>
                                        </div>
                                        <StatusBadge status={ticket.status} />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4 bg-slate-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            Entrada: {new Date(ticket.createdAt).toLocaleDateString()}
                                        </div>
                                        {ticket.finishedAt && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-green-500" />
                                                Saída: {new Date(ticket.finishedAt).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3 text-sm">
                                        <span className="font-semibold block mb-1 text-slate-700">Problema Relatado:</span>
                                        <p className="text-gray-600">{ticket.issueDescription}</p>
                                    </div>

                                    {ticket.budget && ticket.budget.status === 'APPROVED' && (
                                        <div className="border-t border-dashed border-gray-200 pt-3 mt-3">
                                            <div className="text-sm font-semibold mb-2 text-slate-700">Resumo Financeiro:</div>
                                            <ul className="list-disc pl-5 text-sm text-gray-600 mb-3 space-y-1">
                                                {ticket.budget.parts.map((part, idx) => (
                                                    <li key={idx}>{part.name} (x{part.quantity}) - R$ {part.unitPrice.toFixed(2)}</li>
                                                ))}
                                                <li>Mão de Obra - R$ {ticket.budget.laborCost.toFixed(2)}</li>
                                            </ul>
                                            <div className="flex justify-end items-center gap-2 text-lg font-bold text-green-700 bg-green-50 p-2 rounded-lg border border-green-100">
                                                <DollarSign className="w-5 h-5" />
                                                Total Pago: R$ {ticket.budget.totalCost.toFixed(2)}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="absolute top-4 right-12 text-xs text-gray-300 font-mono">
                                        {ticket.id}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-slate-50">
                    <User className="w-20 h-20 mb-4 opacity-10" />
                    <p className="text-lg font-medium opacity-50">Selecione um cliente</p>
                    <p className="text-sm opacity-40">O histórico completo aparecerá aqui</p>
                </div>
            )}
        </div>
    </div>
  );
};
