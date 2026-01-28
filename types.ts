
export enum TicketStatus {
  PENDING = 'PENDING',           // Aguardando Análise
  DIAGNOSING = 'DIAGNOSING',     // Em Diagnóstico
  APPROVAL_NEEDED = 'APPROVAL',  // Aguardando Aprovação
  IN_PROGRESS = 'IN_PROGRESS',   // Em Reparo
  READY = 'READY',               // Pronto para Retirada
  DELIVERED = 'DELIVERED',       // Entregue
  CANCELED = 'CANCELED'          // Cancelado/Reprovado
}

export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum BudgetStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Device {
  brand: string;
  model: string;
  serialNumber?: string;
  passcode?: string;
  color: string;
}

// Inventory Part
export interface Part {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  costPrice: number;
  sellPrice: number;
}

// Part used in a specific repair
export interface RepairPartUsage {
  partId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Budget {
  laborCost: number;
  parts: RepairPartUsage[];
  totalCost: number;
  status: BudgetStatus;
  notes?: string;
}

export interface RepairTicket {
  id: string;
  createdAt: string;
  finishedAt?: string;
  customer: Customer;
  device: Device;
  issueDescription: string;
  technicalReport?: string;
  estimatedCost?: number; // Initial AI estimate
  budget?: Budget; // Detailed final budget
  status: TicketStatus;
  priority: Priority;
  technicianNotes: string[];
}
