
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepair } from '../../context/RepairContext';
import { Priority, TicketStatus, RepairTicket } from '../../types';
import { generateDiagnosis } from '../../services/geminiService';
import { Sparkles, Save, Loader2, User, Smartphone, ClipboardList } from 'lucide-react';

export const NewTicket: React.FC = () => {
  const navigate = useNavigate();
  const { addTicket } = useRepair();
  
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    brand: '',
    model: '',
    color: '',
    passcode: '',
    issueDescription: '',
    technicianObservation: '',
    diagnosis: '',
    estimatedCost: '',
    priority: Priority.NORMAL
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAiDiagnosis = async () => {
    if (!formData.model || !formData.issueDescription) {
      alert("Por favor preencha o Modelo e a Descrição do Problema para usar a IA.");
      return;
    }

    setIsLoadingAi(true);
    const result = await generateDiagnosis(formData.model, formData.issueDescription, formData.technicianObservation);
    setIsLoadingAi(false);

    if (result) {
      setFormData(prev => ({
        ...prev,
        diagnosis: result.diagnosis + `\n\nAção Recomendada: ${result.recommendedAction}`,
        estimatedCost: result.estimatedCost.toString()
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTicket: RepairTicket = {
      id: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString(),
      customer: {
        id: `CUST-${Math.floor(Math.random() * 1000)}`,
        name: formData.customerName,
        phone: formData.customerPhone,
        email: formData.customerEmail
      },
      device: {
        brand: formData.brand,
        model: formData.model,
        color: formData.color,
        passcode: formData.passcode
      },
      issueDescription: formData.issueDescription,
      technicalReport: formData.diagnosis,
      estimatedCost: parseFloat(formData.estimatedCost) || 0,
      status: TicketStatus.PENDING,
      priority: formData.priority,
      technicianNotes: formData.technicianObservation ? [formData.technicianObservation] : []
    };

    addTicket(newTicket);
    navigate('/admin/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Abrir Nova Ordem de Serviço</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Cliente */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-blue-500">
          <h2 className="text-lg font-semibold text-slate-800 mb-6 border-b border-slate-100 pb-2 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Dados do Cliente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
              <input required name="customerName" value={formData.customerName} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Telefone / WhatsApp</label>
              <input required name="customerPhone" value={formData.customerPhone} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Email (Opcional)</label>
              <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
          </div>
        </div>

        {/* Aparelho */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-purple-500">
          <h2 className="text-lg font-semibold text-slate-800 mb-6 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-purple-500" />
            Dados do Aparelho
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Marca</label>
              <input required name="brand" value={formData.brand} onChange={handleInputChange} placeholder="ex: Samsung, Apple" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Modelo</label>
              <input required name="model" value={formData.model} onChange={handleInputChange} placeholder="ex: iPhone 12 Pro" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cor</label>
              <input name="color" value={formData.color} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha de Bloqueio</label>
              <input name="passcode" value={formData.passcode} onChange={handleInputChange} placeholder="Padrão ou PIN" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
            </div>
          </div>
        </div>

        {/* Diagnóstico */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-orange-500 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <Sparkles className="w-24 h-24 text-orange-500" />
           </div>
          <h2 className="text-lg font-semibold text-slate-800 mb-6 border-b border-slate-100 pb-2 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-orange-500" />
            Diagnóstico e Problema
          </h2>
          
          <div className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Relato do Cliente</label>
              <textarea required name="issueDescription" rows={2} value={formData.issueDescription} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="O que o cliente disse que está acontecendo?" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Observações Iniciais do Técnico (Opcional)</label>
              <textarea name="technicianObservation" rows={2} value={formData.technicianObservation} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="Vidro trincado, carcaça amassada, parafuso faltando..." />
            </div>

            <div className="flex items-center justify-end">
                <button 
                  type="button" 
                  onClick={handleAiDiagnosis}
                  disabled={isLoadingAi}
                  className="flex items-center gap-2 text-sm bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-sm"
                >
                  {isLoadingAi ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  Gerar Diagnóstico com IA
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Diagnóstico Técnico</label>
                <textarea name="diagnosis" rows={4} value={formData.diagnosis} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50" placeholder="Diagnóstico final será preenchido aqui..." />
              </div>
              <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Custo Estimado (R$)</label>
                    <input type="number" name="estimatedCost" value={formData.estimatedCost} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Prioridade</label>
                    <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                        {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate('/admin/dashboard')} className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
            Cancelar
          </button>
          <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            <Save className="w-5 h-5" />
            Salvar Ordem de Serviço
          </button>
        </div>

      </form>
    </div>
  );
};
