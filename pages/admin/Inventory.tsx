
import React, { useState } from 'react';
import { useRepair } from '../../context/RepairContext';
import { Part } from '../../types';
import { Search, AlertTriangle, Plus, PackageCheck, Edit } from 'lucide-react';

export const Inventory: React.FC = () => {
  const { inventory, addPart, updatePart } = useRepair();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Part>>({
    name: '', sku: '', quantity: 0, minQuantity: 5, costPrice: 0, sellPrice: 0
  });

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (part?: Part) => {
    if (part) {
        setEditingPart(part);
        setFormData(part);
    } else {
        setEditingPart(null);
        setFormData({ name: '', sku: '', quantity: 0, minQuantity: 5, costPrice: 0, sellPrice: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPart) {
        updatePart(editingPart.id, formData);
    } else {
        const newPart: Part = {
            id: `PRT-${Math.floor(Math.random() * 10000)}`,
            name: formData.name!,
            sku: formData.sku!,
            quantity: Number(formData.quantity),
            minQuantity: Number(formData.minQuantity),
            costPrice: Number(formData.costPrice),
            sellPrice: Number(formData.sellPrice)
        };
        addPart(newPart);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Gerenciamento de Estoque</h1>
                <p className="text-gray-500">Controle de peças e componentes</p>
            </div>
            <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4" /> Adicionar Peça
            </button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Buscar peça por nome ou código..."
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qtd.</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Custo (R$)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venda (R$)</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {filteredInventory.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                {item.quantity <= item.minQuantity && (
                                    <div className="flex items-center gap-1 text-xs text-red-600 mt-1 font-bold">
                                        <AlertTriangle className="w-3 h-3" /> Estoque Baixo
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{item.sku}</td>
                            <td className="px-6 py-4 text-sm font-medium">
                                <span className={item.quantity <= item.minQuantity ? 'text-red-600' : 'text-green-600'}>
                                    {item.quantity} un
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{item.costPrice.toFixed(2)}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.sellPrice.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-800 p-2">
                                    <Edit className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-xl font-bold">{editingPart ? 'Editar Peça' : 'Nova Peça'}</h2>
                        <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
                            <input required className="w-full p-2 border rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">SKU / Código</label>
                                <input required className="w-full p-2 border rounded" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Estoque Mínimo</label>
                                <input type="number" className="w-full p-2 border rounded" value={formData.minQuantity} onChange={e => setFormData({...formData, minQuantity: Number(e.target.value)})} />
                            </div>
                        </div>
                         <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Qtd. Atual</label>
                                <input type="number" required className="w-full p-2 border rounded font-bold" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Preço Custo</label>
                                <input type="number" step="0.01" required className="w-full p-2 border rounded" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: Number(e.target.value)})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Preço Venda</label>
                                <input type="number" step="0.01" required className="w-full p-2 border rounded" value={formData.sellPrice} onChange={e => setFormData({...formData, sellPrice: Number(e.target.value)})} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                            <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 flex items-center gap-2">
                                <PackageCheck className="w-4 h-4" /> Salvar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};
