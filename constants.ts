
import { RepairTicket, TicketStatus, Priority, Part, BudgetStatus } from './types';

export const MOCK_INVENTORY: Part[] = [
  {
    id: 'PRT-001',
    name: 'Tela iPhone 13 Original',
    sku: 'LCD-IP13-ORG',
    quantity: 5,
    minQuantity: 2,
    costPrice: 400.00,
    sellPrice: 800.00
  },
  {
    id: 'PRT-002',
    name: 'Bateria Samsung S22',
    sku: 'BAT-S22-STD',
    quantity: 1,
    minQuantity: 3,
    costPrice: 120.00,
    sellPrice: 250.00
  },
  {
    id: 'PRT-003',
    name: 'Conector USB-C Universal',
    sku: 'CON-USBC-001',
    quantity: 50,
    minQuantity: 10,
    costPrice: 5.00,
    sellPrice: 80.00
  }
];

export const MOCK_TICKETS: RepairTicket[] = [
  {
    id: 'ORD-2024-001',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    customer: {
      id: 'CUST-1',
      name: 'João Silva',
      phone: '11999991234',
      email: 'joao@example.com'
    },
    device: {
      brand: 'Apple',
      model: 'iPhone 13',
      color: 'Azul',
      passcode: '123456'
    },
    issueDescription: 'A tela está trincada e o touch não responde em algumas áreas.',
    technicalReport: 'Substituição do display frontal necessária. FaceID intacto.',
    estimatedCost: 1200.00,
    budget: {
      laborCost: 400,
      parts: [
        { partId: 'PRT-001', name: 'Tela iPhone 13 Original', quantity: 1, unitPrice: 800 }
      ],
      totalCost: 1200,
      status: BudgetStatus.APPROVED
    },
    status: TicketStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    technicianNotes: ['Dispositivo aberto', 'Display removido', 'Aguardando peça']
  },
  {
    id: 'ORD-2024-002',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    finishedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    customer: {
      id: 'CUST-2',
      name: 'Maria Oliveira',
      phone: '21988885678',
      email: 'maria@example.com'
    },
    device: {
      brand: 'Samsung',
      model: 'Galaxy S22',
      color: 'Preto'
    },
    issueDescription: 'Não carrega, conector parece solto.',
    status: TicketStatus.READY,
    priority: Priority.NORMAL,
    estimatedCost: 350.00,
    budget: {
      laborCost: 270,
      parts: [
         { partId: 'PRT-003', name: 'Conector USB-C Universal', quantity: 1, unitPrice: 80 }
      ],
      totalCost: 350,
      status: BudgetStatus.APPROVED
    },
    technicalReport: 'Limpeza e ressolda do conector USB-C. Teste de carga OK.',
    technicianNotes: ['Reparo concluído', 'Testado por 2h']
  }
];

export const STATUS_LABELS: Record<TicketStatus, string> = {
  [TicketStatus.PENDING]: 'Aguardando Análise',
  [TicketStatus.DIAGNOSING]: 'Em Diagnóstico',
  [TicketStatus.APPROVAL_NEEDED]: 'Aguardando Aprovação',
  [TicketStatus.IN_PROGRESS]: 'Em Reparo',
  [TicketStatus.READY]: 'Pronto',
  [TicketStatus.DELIVERED]: 'Entregue',
  [TicketStatus.CANCELED]: 'Cancelado'
};

export const STATUS_COLORS: Record<TicketStatus, string> = {
  [TicketStatus.PENDING]: 'bg-gray-100 text-gray-800 border border-gray-200',
  [TicketStatus.DIAGNOSING]: 'bg-blue-50 text-blue-700 border border-blue-100',
  [TicketStatus.APPROVAL_NEEDED]: 'bg-orange-50 text-orange-700 border border-orange-100',
  [TicketStatus.IN_PROGRESS]: 'bg-purple-50 text-purple-700 border border-purple-100',
  [TicketStatus.READY]: 'bg-green-50 text-green-700 border border-green-100',
  [TicketStatus.DELIVERED]: 'bg-cyan-600 text-white border border-cyan-600', // Changed from dark slate to Cyan
  [TicketStatus.CANCELED]: 'bg-red-50 text-red-700 border border-red-100'
};
