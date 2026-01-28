
import React, { useState } from 'react';
import { useRepair } from '../../context/RepairContext';
import { RepairTicket, TicketStatus } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { Search, Smartphone, CheckCircle, Clock, AlertCircle, ChevronRight, ArrowLeft, Calendar } from 'lucide-react';

export const ClientPortal: React.FC = () => {
  const { tickets } = useRepair();
  const [searchTerm, setSearchTerm] = useState('');
  const [foundTickets, setFoundTickets] = useState<RepairTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<RepairTicket | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setHasSearched(true);
    setSelectedTicket(null);

    const term = searchTerm.toLowerCase().trim();

    // Search by ID, Phone, or Name
    const results = tickets.filter(t => 
      t.id.toLowerCase().includes(term) ||
      t.customer.phone.replace(/\D/g, '').includes(term.replace(/\D/g, '')) ||
      t.customer.name.toLowerCase().includes(term)
    );

    setFoundTickets(results);

    // If only one result, auto-select it
    if (results.length === 1) {
      setSelectedTicket(results[0]);
    }
  };

  const getProgressPercentage = (status: TicketStatus) => {
    switch(status) {
      case TicketStatus.PENDING: return 10;
      case TicketStatus.DIAGNOSING: return 30;
      case TicketStatus.APPROVAL_NEEDED: return 40;
      case TicketStatus.IN_PROGRESS: return 60;
      case TicketStatus.READY: return 90;
      case TicketStatus.DELIVERED: return 100;
      default: return 0;
    }
  };

  const handleBackToList = () => {
    setSelectedTicket(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 pb-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Acompanhe seu Reparo</h1>
        <p className="text-gray-500">Digite seu número de celular, nome ou o número da OS.</p>
      </div>

      {/* Search Box */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-10">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ex: 11999998888 ou João Silva"
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none text-lg"
            />
          </div>
          <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Consultar
          </button>
        </form>
      </div>

      {/* No Results State */}
      {hasSearched && foundTickets.length === 0 && (
        <div className="text-center p-10 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
          <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">Nenhum reparo encontrado</h3>
          <p className="text-gray-500">Verifique os dados e tente novamente.</p>
        </div>
      )}

      {/* Results List (if multiple and none selected) */}
      {hasSearched && foundTickets.length > 0 && !selectedTicket && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">
            Encontramos {foundTickets.length} registro(s):
          </h2>
          {foundTickets.map(ticket => (
            <div 
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary transition-all cursor-pointer flex justify-between items-center group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-full text-primary">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{ticket.device.model}</h3>
                  <p className="text-sm text-gray-500">{ticket.device.brand} • {new Date(ticket.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={ticket.status} />
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed View */}
      {selectedTicket && (
        <div className="space-y-6 animate-fade-in">
          {foundTickets.length > 1 && (
             <button onClick={handleBackToList} className="flex items-center text-sm text-gray-500 hover:text-primary mb-4">
                <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para lista
             </button>
          )}

          {/* Header Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-gray-500" />
                  {selectedTicket.device.model}
                </h2>
                <p className="text-gray-500 text-sm">{selectedTicket.device.brand} • {selectedTicket.device.color}</p>
              </div>
              <div className="mt-2 md:mt-0 text-right">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Número da OS</div>
                <div className="text-lg font-mono font-bold text-primary">{selectedTicket.id}</div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                <span>Progresso</span>
                <span className="text-primary">{Math.round(getProgressPercentage(selectedTicket.status))}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${getProgressPercentage(selectedTicket.status)}%` }}
                ></div>
              </div>
              <div className="mt-4 flex justify-center">
                <StatusBadge status={selectedTicket.status} />
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Previsão / Data
                </h3>
                <p className="text-sm text-gray-600">Entrada: {new Date(selectedTicket.createdAt).toLocaleDateString()}</p>
                {selectedTicket.finishedAt && (
                   <p className="text-sm text-green-600 font-medium mt-1">Concluído: {new Date(selectedTicket.finishedAt).toLocaleDateString()}</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Laudo Técnico
                </h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {selectedTicket.technicalReport || "Aguardando análise técnica..."}
                </p>
              </div>
            </div>

             {/* Financial Info (Simplified for Client) */}
             {(selectedTicket.budget?.status === 'APPROVED' || selectedTicket.status === 'READY' || selectedTicket.status === 'DELIVERED') && (
                <div className="mt-6 p-4 border border-blue-100 bg-blue-50 rounded-xl flex justify-between items-center">
                    <div>
                        <p className="text-sm text-blue-700 font-medium">Valor Total do Serviço</p>
                        <p className="text-xs text-blue-500">Inclui peças e mão de obra</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">
                        R$ {selectedTicket.budget?.totalCost.toFixed(2)}
                    </p>
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};
