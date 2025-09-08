import React from 'react';
import { Users, BarChart3, Building, Target, DollarSign, FileText } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userRole: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  userRole 
}) => {
  // All users now have access to all sections
  const allSections = [
    { id: 'team', label: 'Equipo', icon: Users },
    { id: 'metrics', label: 'Métricas', icon: BarChart3 },
    { id: 'deals', label: 'Deals', icon: DollarSign },
    { id: 'reports', label: 'Reportes', icon: FileText },
    { id: 'goals', label: 'Objetivos', icon: Target },
    { id: 'organization', label: 'Organigrama', icon: Building },
  ];

  return (
    <aside className="w-64 bg-slate-900/50 backdrop-blur-sm border-r border-slate-700/50 p-4 lg:p-6 overflow-y-auto">
      <nav className="space-y-2">
        {allSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 lg:px-4 lg:py-3 rounded-lg transition-all duration-200 text-sm lg:text-base
                ${isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }
              `}
            >
              <Icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
              <span className="font-medium">{section.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-6 lg:mt-8 p-3 lg:p-4 bg-slate-800/30 rounded-lg">
        <h3 className="text-xs lg:text-sm font-semibold text-slate-300 mb-2">Estado del Sistema</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs lg:text-sm text-slate-400">Sistema Online</span>
        </div>
      </div>
    </aside>
  );
};