import React, { useState, lazy, Suspense } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { User } from '../../types';

// Lazy load all dashboard components for better performance
const OrganizationChart = lazy(() => import('./OrganizationChart'));
const MetricsView = lazy(() => import('./MetricsView'));
const TeamView = lazy(() => import('./TeamView'));
const DealsView = lazy(() => import('./DealsView'));
const ReportsView = lazy(() => import('./ReportsView'));
const GoalsView = lazy(() => import('./GoalsView'));

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const ComponentLoader: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-slate-400 text-sm">Cargando...</p>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('team');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    const commonProps = { user };
    
    switch (activeSection) {
      case 'team':
        return (
          <Suspense fallback={<ComponentLoader />}>
            <TeamView {...commonProps} />
          </Suspense>
        );
      case 'metrics':
        return (
          <Suspense fallback={<ComponentLoader />}>
            <MetricsView {...commonProps} />
          </Suspense>
        );
      case 'organization':
        return (
          <Suspense fallback={<ComponentLoader />}>
            <OrganizationChart currentUser={user} />
          </Suspense>
        );
      case 'deals':
        return (
          <Suspense fallback={<ComponentLoader />}>
            <DealsView {...commonProps} />
          </Suspense>
        );
      case 'reports':
        return (
          <Suspense fallback={<ComponentLoader />}>
            <ReportsView {...commonProps} />
          </Suspense>
        );
      case 'goals':
        return (
          <Suspense fallback={<ComponentLoader />}>
            <GoalsView {...commonProps} />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<ComponentLoader />}>
            <TeamView {...commonProps} />
          </Suspense>
        );
    }
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col overflow-hidden">
      <Header user={user} onLogout={onLogout} />
      
      <div className="flex flex-1 relative">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          transition-transform duration-300 ease-in-out lg:transition-none
          w-64 lg:w-64
        `}>
          <Sidebar 
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            userRole={user.role}
          />
        </div>
        
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-20 left-4 z-30 p-3 bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 hover:bg-slate-700/90 transition-all duration-200"
          aria-label="Abrir menú"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;