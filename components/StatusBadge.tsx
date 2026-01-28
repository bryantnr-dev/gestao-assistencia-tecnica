import React from 'react';
import { TicketStatus } from '../types';
import { STATUS_LABELS, STATUS_COLORS } from '../constants';

interface StatusBadgeProps {
  status: TicketStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
};