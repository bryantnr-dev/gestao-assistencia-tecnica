
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { RepairProvider } from './context/RepairContext';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { NewTicket } from './pages/admin/NewTicket';
import { TicketDetails } from './pages/admin/TicketDetails';
import { Inventory } from './pages/admin/Inventory';
import { CustomerHistory } from './pages/admin/CustomerHistory';
import { ClientPortal } from './pages/client/ClientPortal';

const AppContent: React.FC = () => {
    const location = useLocation();
    const showNavbar = location.pathname !== '/';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {showNavbar && <Navbar />}
            <Routes>
                <Route path="/" element={<Landing />} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/new" element={<NewTicket />} />
                <Route path="/admin/ticket/:id" element={<TicketDetails />} />
                <Route path="/admin/inventory" element={<Inventory />} />
                <Route path="/admin/customers" element={<CustomerHistory />} />
                
                {/* Client Routes */}
                <Route path="/client" element={<ClientPortal />} />
            </Routes>
        </div>
    );
}

const App: React.FC = () => {
  return (
    <RepairProvider>
        <Router>
            <AppContent />
        </Router>
    </RepairProvider>
  );
};

export default App;
