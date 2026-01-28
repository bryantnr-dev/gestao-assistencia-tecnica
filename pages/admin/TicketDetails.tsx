
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRepair } from '../../context/RepairContext';
import { TicketStatus, BudgetStatus, RepairPartUsage, Priority } from '../../types';
import { STATUS_LABELS, STATUS_COLORS } from '../../constants';
import { StatusBadge } from '../../components/StatusBadge';
import { Save, ArrowLeft, Trash2, Plus, FileCheck, XCircle, Calculator, MessageCircle, Edit2, Check, X } from 'lucide-react';

export const TicketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTicketById, updateTicketStatus, updateTicketBudget, updateTicketDetails, inventory } = useRepair();
  
  const ticket = getTicketById(id || '');

  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  // Budget State
  const [laborCost, setLaborCost] = useState<number>(0);
  const [selectedPartId, setSelectedPartId] = useState<string>('');
  const [addedParts, setAddedParts] = useState<RepairPartUsage[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (ticket) {
        setEditForm({
            customerName: ticket.customer.name,
            customerPhone: ticket.customer.phone,
            brand: ticket.device.brand,
            model: ticket.device.model,
            color: ticket.device.color,
            issueDescription: ticket.issueDescription,
            technicalReport: ticket.technicalReport,
            priority: ticket.priority
        });

        if (ticket.budget) {
            setLaborCost(ticket.budget.laborCost);
            setAddedParts(ticket.budget.parts);
            setNotes(ticket.budget.notes || '');
        } else if (ticket.estimatedCost) {
            setLaborCost(ticket.estimatedCost * 0.4);
        }
    }
  }, [ticket]);

  if (!ticket) return <div>Ticket not found</div>;

  // --- WhatsApp Logic ---
  const sendWhatsApp = (phone: string, message: string) => {
      const cleanPhone = phone.replace(/\D/g, '');
      const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
  };

  const getStatusMessage = (status: TicketStatus) => {
      const map: Record<string, string> = {
          [TicketStatus.PENDING]: `Olá ${ticket.customer.name}, sua ordem de serviço ${ticket.id} para o ${ticket.device.model} foi criada e está aguardando análise.`,
          [TicketStatus.DIAGNOSING]: `Olá ${ticket.customer.name}, iniciamos o diagnóstico do seu ${ticket.device.model} (OS: ${ticket.id}).`,
          [TicketStatus.APPROVAL_NEEDED]: `Olá ${ticket.customer.name}, o orçamento para o reparo do seu ${ticket.device.model} está pronto! Valor total: R$ ${ticket.budget?.totalCost.toFixed(2)}. Podemos prosseguir?`,
          [TicketStatus.IN_PROGRESS]: `Olá ${ticket.customer.name}, o reparo do seu ${ticket.device.model} foi iniciado. Em breve daremos notícias!`,
          [TicketStatus.READY]: `Olá ${ticket.customer.name}, boas notícias! Seu ${ticket.device.model} está pronto para retirada. Total: R$ ${ticket.budget?.totalCost.toFixed(2)}.`,
          [TicketStatus.CANCELED]: `Olá ${ticket.customer.name}, a ordem de serviço ${ticket.id} foi cancelada/reprovada.`
      };
      return map[status] || `Olá, atualização sobre sua OS ${ticket.id}.`;
  };

  // --- Budget Logic ---
  const handleAddPart = () => {
    const partFromStock = inventory.find(p => p.id === selectedPartId);
    if (partFromStock) {
        const newItem: RepairPartUsage = {
            partId: partFromStock.id,
            name: partFromStock.name,
            quantity: 1,
            unitPrice: partFromStock.sellPrice
        };
        setAddedParts([...addedParts, newItem]);
        setSelectedPartId('');
    }
  };

  const removePart = (index: number) => {
    const newParts = [...addedParts];
    newParts.splice(index, 1);
    setAddedParts(newParts);
  };

  const calculateTotal = () => {
    const partsTotal = addedParts.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    return partsTotal + Number(laborCost);
  };

  const saveBudget = (status: BudgetStatus) => {
    updateTicketBudget(ticket.id, {
        laborCost: Number(laborCost),
        parts: addedParts,
        totalCost: calculateTotal(),
        status,
        notes
    });

    let newTicketStatus = ticket.status;
    if (status === BudgetStatus.APPROVED) newTicketStatus = TicketStatus.IN_PROGRESS;
    else if (status === BudgetStatus.REJECTED) newTicketStatus = TicketStatus.CANCELED;
    else newTicketStatus = TicketStatus.APPROVAL_NEEDED;

    updateTicketStatus(ticket.id, newTicketStatus);
    
    // Prompt to send WhatsApp
    const msg = getStatusMessage(newTicketStatus);
    if(confirm(`Orçamento salvo! Deseja notificar o cliente no WhatsApp?\n\nMensagem: "${msg}"`)) {
        sendWhatsApp(ticket.customer.phone, msg);
    }
  };

  // --- Edit Logic ---
  const saveEdits = () => {
      updateTicketDetails(ticket.id, {
          customer: { ...ticket.customer, name: editForm.customerName, phone: editForm.customerPhone },
          device: { ...ticket.device, brand: editForm.brand, model: editForm.model, color: editForm.color },
          issueDescription: editForm.issueDescription,
          technicalReport: editForm.technicalReport,
          priority: editForm.priority
      });
      setIsEditing(false);
      
      if(confirm("Dados atualizados. Enviar confirmação via WhatsApp?")) {
          sendWhatsApp(editForm.customerPhone, `Olá ${editForm.customerName}, atualizamos os detalhes da sua OS ${ticket.id}. Qualquer dúvida entre em contato.`);
      }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newStatus = e.target.value as TicketStatus;
      updateTicketStatus(ticket.id, newStatus);
      const msg = getStatusMessage(newStatus);
      if(confirm(`Status alterado para ${STATUS_LABELS[newStatus]}. Enviar WhatsApp?`)) {
          sendWhatsApp(ticket.customer.phone, msg);
      }
  };

  const isBudgetEditable = ticket.status !== TicketStatus.DELIVERED && ticket.status !== TicketStatus.CANCELED;

  return (
    <div className="max-w-6xl mx-auto p-6 pb-20">
        <div className="flex justify-between items-center mb-6">
            <button onClick={() => navigate('/admin/dashboard')} className="flex items-center text-gray-500 hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Dashboard
            </button>
            <div className="flex gap-2">
                 <button 
                    onClick={() => sendWhatsApp(ticket.customer.phone, `Olá ${ticket.customer.name}, somos da Assistência Técnica. Sobre sua OS ${ticket.id}...`)}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                </button>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column: Ticket Info */}
            <div className="w-full lg:w-1/3 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative">
                    <div className="absolute top-4 right-4">
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-600 p-1">
                                <Edit2 className="w-4 h-4" />
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={saveEdits} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check className="w-4 h-4" /></button>
                                <button onClick={() => setIsEditing(false)} className="text-red-600 hover:bg-red-50 p-1 rounded"><X className="w-4 h-4" /></button>
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Status Atual</label>
                        <select 
                            value={ticket.status} 
                            onChange={handleStatusChange}
                            className={`w-full p-2 rounded-lg border font-bold text-sm ${STATUS_COLORS[ticket.status]} cursor-pointer`}
                        >
                            {Object.keys(TicketStatus).map(s => (
                                <option key={s} value={s} className="bg-white text-gray-800">
                                    {STATUS_LABELS[s as TicketStatus]}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="space-y-4 text-sm">
                        <div className="border-b border-gray-100 pb-3">
                            <label className="block text-gray-500 text-xs uppercase font-bold">Cliente</label>
                            {isEditing ? (
                                <div className="space-y-2 mt-1">
                                    <input className="w-full border p-1 rounded" value={editForm.customerName} onChange={e => setEditForm({...editForm, customerName: e.target.value})} placeholder="Nome" />
                                    <input className="w-full border p-1 rounded" value={editForm.customerPhone} onChange={e => setEditForm({...editForm, customerPhone: e.target.value})} placeholder="Telefone" />
                                </div>
                            ) : (
                                <>
                                    <p className="font-medium text-lg text-slate-800">{ticket.customer.name}</p>
                                    <p className="text-gray-500">{ticket.customer.phone}</p>
                                </>
                            )}
                        </div>

                        <div className="border-b border-gray-100 pb-3">
                            <label className="block text-gray-500 text-xs uppercase font-bold">Aparelho</label>
                            {isEditing ? (
                                <div className="space-y-2 mt-1">
                                    <input className="w-full border p-1 rounded" value={editForm.brand} onChange={e => setEditForm({...editForm, brand: e.target.value})} placeholder="Marca" />
                                    <input className="w-full border p-1 rounded" value={editForm.model} onChange={e => setEditForm({...editForm, model: e.target.value})} placeholder="Modelo" />
                                    <input className="w-full border p-1 rounded" value={editForm.color} onChange={e => setEditForm({...editForm, color: e.target.value})} placeholder="Cor" />
                                </div>
                            ) : (
                                <p className="font-medium">{ticket.device.brand} {ticket.device.model} ({ticket.device.color})</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-500 text-xs uppercase font-bold">Problema Relatado</label>
                            {isEditing ? (
                                <textarea className="w-full border p-2 rounded mt-1" rows={3} value={editForm.issueDescription} onChange={e => setEditForm({...editForm, issueDescription: e.target.value})} />
                            ) : (
                                <p className="bg-gray-50 p-2 rounded border border-gray-100 mt-1 text-gray-600">{ticket.issueDescription}</p>
                            )}
                        </div>
                         <div>
                            <label className="block text-gray-500 text-xs uppercase font-bold">Diagnóstico Técnico</label>
                            {isEditing ? (
                                <textarea className="w-full border p-2 rounded mt-1" rows={4} value={editForm.technicalReport} onChange={e => setEditForm({...editForm, technicalReport: e.target.value})} />
                            ) : (
                                <textarea 
                                    className="w-full mt-1 p-2 border rounded bg-yellow-50 border-yellow-100 text-gray-700 text-sm" 
                                    rows={4} 
                                    readOnly 
                                    value={ticket.technicalReport || 'Não informado'}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Budget Manager */}
            <div className="w-full lg:w-2/3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-primary" />
                            Gerenciamento de Orçamento
                        </h2>
                        {ticket.budget?.status && (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                ticket.budget.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                                ticket.budget.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {ticket.budget.status === 'APPROVED' ? 'Aprovado' : 
                                 ticket.budget.status === 'REJECTED' ? 'Reprovado' : 'Rascunho'}
                            </span>
                        )}
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {/* Parts Selector */}
                        {isBudgetEditable && (
                            <div className="flex gap-2 items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Adicionar Peça do Estoque</label>
                                    <select 
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        value={selectedPartId}
                                        onChange={(e) => setSelectedPartId(e.target.value)}
                                    >
                                        <option value="">Selecione uma peça...</option>
                                        {inventory.map(part => (
                                            <option key={part.id} value={part.id}>
                                                {part.name} (Estoque: {part.quantity}) - R$ {part.sellPrice.toFixed(2)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button 
                                    onClick={handleAddPart}
                                    disabled={!selectedPartId}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2.5 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {/* Parts List */}
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="p-3">Item</th>
                                        <th className="p-3 text-right">Qtd</th>
                                        <th className="p-3 text-right">Unit. (R$)</th>
                                        <th className="p-3 text-right">Total (R$)</th>
                                        <th className="p-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {addedParts.map((item, index) => (
                                        <tr key={index}>
                                            <td className="p-3">{item.name}</td>
                                            <td className="p-3 text-right">{item.quantity}</td>
                                            <td className="p-3 text-right">{item.unitPrice.toFixed(2)}</td>
                                            <td className="p-3 text-right font-medium">{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                            <td className="p-3 text-center">
                                                {isBudgetEditable && (
                                                    <button onClick={() => removePart(index)} className="text-red-400 hover:text-red-600">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {addedParts.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-gray-400">Nenhuma peça adicionada</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Labor and Total */}
                        <div className="flex flex-col items-end gap-4 border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium text-gray-700">Mão de Obra (R$)</label>
                                <input 
                                    type="number" 
                                    className="w-32 p-2 border border-gray-300 rounded-lg text-right font-medium"
                                    value={laborCost}
                                    onChange={(e) => setLaborCost(Number(e.target.value))}
                                    disabled={!isBudgetEditable}
                                />
                            </div>
                            <div className="text-2xl font-bold text-slate-800 flex items-center gap-4">
                                <span>Total do Orçamento:</span>
                                <span className="text-primary">R$ {calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        {isBudgetEditable && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-6 border-t border-gray-100">
                                <button 
                                    onClick={() => saveBudget(BudgetStatus.DRAFT)}
                                    className="flex justify-center items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                                >
                                    <Save className="w-4 h-4" /> Salvar Rascunho
                                </button>
                                <button 
                                    onClick={() => saveBudget(BudgetStatus.REJECTED)}
                                    className="flex justify-center items-center gap-2 px-4 py-3 border border-red-200 bg-red-50 rounded-lg text-red-700 font-medium hover:bg-red-100"
                                >
                                    <XCircle className="w-4 h-4" /> Reprovar
                                </button>
                                <button 
                                    onClick={() => saveBudget(BudgetStatus.APPROVED)}
                                    className="flex justify-center items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 shadow-lg shadow-green-100"
                                >
                                    <FileCheck className="w-4 h-4" /> Aprovar e Enviar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
