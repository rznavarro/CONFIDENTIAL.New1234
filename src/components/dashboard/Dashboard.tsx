import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { OrganizationChart } from './OrganizationChart';
import { MetricsView } from './MetricsView';
import { TeamView } from './TeamView';
import { DealsView } from './DealsView';
import { ReportsView } from './ReportsView';
import { GoalsView } from './GoalsView';
import { Target } from 'lucide-react';
import { User } from '../../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('team');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'team':
        return <TeamView user={user} />;
      case 'metrics':
        return <MetricsView user={user} />;
      case 'organization':
        return <OrganizationChart currentUser={user} />;
      case 'deals':
        return <DealsView user={user} />;
      case 'reports':
        return <ReportsView user={user} />;
      case 'goals':
        return <GoalsView user={user} />;
      default:
        return <TeamView user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col overflow-hidden">
      <Header user={user} onLogout={onLogout} />
      
      <div className="flex flex-1 relative">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          transition-transform duration-300 ease-in-out lg:transition-none
        `}>
          <Sidebar 
            activeSection={activeSection}
            onSectionChange={(section) => {
              setActiveSection(section);
              setSidebarOpen(false); // Close mobile sidebar when section changes
            }}
            userRole={user.role}
          />
        </div>
        
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-20 left-4 z-30 p-2 bg-slate-800 rounded-lg shadow-lg"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};