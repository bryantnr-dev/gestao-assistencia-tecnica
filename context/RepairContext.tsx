
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RepairTicket, TicketStatus, Part, Budget } from '../types';
import { MOCK_TICKETS, MOCK_INVENTORY } from '../constants';

interface RepairContextType {
  tickets: RepairTicket[];
  inventory: Part[];
  addTicket: (ticket: RepairTicket) => void;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  updateTicketBudget: (id: string, budget: Budget) => void;
  updateTicketDetails: (id: string, details: Partial<RepairTicket> | Partial<RepairTicket['customer']> | Partial<RepairTicket['device']>) => void;
  getTicketById: (id: string) => RepairTicket | undefined;
  deleteTicket: (id: string) => void;
  // Inventory methods
  addPart: (part: Part) => void;
  updatePart: (id: string, updates: Partial<Part>) => void;
  getPartById: (id: string) => Part | undefined;
}

const RepairContext = createContext<RepairContextType | undefined>(undefined);

export const RepairProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<RepairTicket[]>(MOCK_TICKETS);
  const [inventory, setInventory] = useState<Part[]>(MOCK_INVENTORY);

  const addTicket = (ticket: RepairTicket) => {
    setTickets(prev => [ticket, ...prev]);
  };

  const updateTicketStatus = (id: string, status: TicketStatus) => {
    setTickets(prev => prev.map(t => {
        if (t.id === id) {
            return { 
                ...t, 
                status,
                finishedAt: status === TicketStatus.READY || status === TicketStatus.DELIVERED 
                    ? (t.finishedAt || new Date().toISOString()) 
                    : undefined
            };
        }
        return t;
    }));
  };

  const updateTicketBudget = (id: string, budget: Budget) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, budget } : t));
  };

  // Generic update for ticket, customer, or device details
  const updateTicketDetails = (id: string, updates: any) => {
      setTickets(prev => prev.map(t => {
          if (t.id === id) {
              // Handle nested updates manually if needed, or assume updates matches structure
              // Here we act smart: if updates has 'customer' key, we merge it, etc.
              const newCustomer = updates.customer ? { ...t.customer, ...updates.customer } : t.customer;
              const newDevice = updates.device ? { ...t.device, ...updates.device } : t.device;
              
              // If the update keys are top level (like issueDescription)
              return {
                  ...t,
                  ...updates,
                  customer: newCustomer,
                  device: newDevice
              };
          }
          return t;
      }));
  };

  const getTicketById = (id: string) => {
    return tickets.find(t => t.id === id);
  };

  const deleteTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  // Inventory Logic
  const addPart = (part: Part) => {
    setInventory(prev => [...prev, part]);
  };

  const updatePart = (id: string, updates: Partial<Part>) => {
    setInventory(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const getPartById = (id: string) => inventory.find(p => p.id === id);

  return (
    <RepairContext.Provider value={{ 
        tickets, 
        inventory,
        addTicket, 
        updateTicketStatus, 
        updateTicketBudget,
        updateTicketDetails,
        getTicketById, 
        deleteTicket,
        addPart,
        updatePart,
        getPartById
    }}>
      {children}
    </RepairContext.Provider>
  );
};

export const useRepair = () => {
  const context = useContext(RepairContext);
  if (!context) {
    throw new Error('useRepair must be used within a RepairProvider');
  }
  return context;
};
