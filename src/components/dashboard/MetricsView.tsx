import React from 'react';
import { BarChart3, DollarSign, TrendingUp, Users, Calendar, MessageSquare, Target, Award } from 'lucide-react';
import { Card } from '../ui/Card';
import { User } from '../../types';
import { generateUserMetrics, generateTeamMetrics, getCompanyMetrics } from '../../data/metrics';
import { users, getUsersByTeam } from '../../data/users';

interface MetricsViewProps {
  user: User;
}

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}> = ({ title, value, icon, color, subtitle }) => (
  <Card className="relative overflow-hidden">
    <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-5`} />
    <div className="relative p-4 lg:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-2xl lg:text-3xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="text-xs lg:text-sm text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      <h3 className="text-sm lg:text-base font-medium text-slate-300">{title}</h3>
    </div>
  </Card>
);

export const MetricsView: React.FC<MetricsViewProps> = ({ user }) => {
  const userMetrics = generateUserMetrics(user.id, user.role);
  
  // Métricas específicas por rol
  const renderUserMetrics = () => {
    const baseMetrics = [
      {
        title: 'Contactos LinkedIn',
        value: userMetrics.linkedinContacts,
        icon: <Users className="w-6 h-6 text-white" />,
        color: 'from-blue-500 to-cyan-500'
      },
      {
        title: 'Mensajes Enviados',
        value: userMetrics.messagesSent,
        icon: <MessageSquare className="w-6 h-6 text-white" />,
        color: 'from-purple-500 to-violet-500'
      },
      {
        title: 'Respuestas Recibidas',
        value: userMetrics.responses,
        icon: <TrendingUp className="w-6 h-6 text-white" />,
        color: 'from-green-500 to-emerald-500'
      },
      {
        title: user.role === 'CEO' ? 'Ingresos Totales' : 'Ganancias Personales',
        value: `$${userMetrics.personalEarnings.toLocaleString()}`,
        icon: <DollarSign className="w-6 h-6 text-white" />,
        color: 'from-amber-500 to-orange-500'
      }
    ];

    // Métricas adicionales para CEO
    if (user.role === 'CEO' && userMetrics.meetings !== undefined) {
      baseMetrics.push(
        {
          title: 'Reuniones',
          value: userMetrics.meetings,
          icon: <Calendar className="w-6 h-6 text-white" />,
          color: 'from-indigo-500 to-purple-500'
        },
        {
          title: 'Ventas Totales',
          value: userMetrics.sales || 0,
          icon: <Award className="w-6 h-6 text-white" />,
          color: 'from-rose-500 to-pink-500'
        }
      );
    }

    return baseMetrics;
  };

  // Métricas de equipo para supervisores
  const renderTeamMetrics = () => {
    if (user.role !== 'Supervisor' || !user.team) return null;

    const teamMembers = getUsersByTeam(user.team);
    const teamRevenue = generateTeamMetrics(user.team);
    
    // Calcular métricas agregadas del equipo
    const teamTotalContacts = teamMembers.reduce((sum, member) => {
      const memberMetrics = generateUserMetrics(member.id, member.role);
      return sum + memberMetrics.linkedinContacts;
    }, 0);

    const teamTotalMessages = teamMembers.reduce((sum, member) => {
      const memberMetrics = generateUserMetrics(member.id, member.role);
      return sum + memberMetrics.messagesSent;
    }, 0);

    const teamTotalResponses = teamMembers.reduce((sum, member) => {
      const memberMetrics = generateUserMetrics(member.id, member.role);
      return sum + memberMetrics.responses;
    }, 0);

    return (
      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Target className="w-6 h-6 text-purple-400" />
          Métricas del Equipo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <MetricCard
            title="Miembros del Equipo"
            value={teamMembers.length}
            icon={<Users className="w-6 h-6 text-white" />}
            color="from-cyan-500 to-blue-500"
          />
          <MetricCard
            title="Contactos del Equipo"
            value={teamTotalContacts}
            icon={<Users className="w-6 h-6 text-white" />}
            color="from-blue-500 to-indigo-500"
          />
          <MetricCard
            title="Mensajes del Equipo"
            value={teamTotalMessages}
            icon={<MessageSquare className="w-6 h-6 text-white" />}
            color="from-purple-500 to-pink-500"
          />
          <MetricCard
            title="Ingresos del Equipo"
            value={`$${teamRevenue.toLocaleString()}`}
            icon={<DollarSign className="w-6 h-6 text-white" />}
            color="from-green-500 to-emerald-500"
          />
        </div>
      </div>
    );
  };

  // Métricas globales para CEO
  const renderCompanyMetrics = () => {
    if (user.role !== 'CEO') return null;

    const companyMetrics = getCompanyMetrics();
    const allUsers = users.filter(u => u.id !== user.id);

    return (
      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Award className="w-6 h-6 text-yellow-400" />
          Métricas de la Empresa
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <MetricCard
            title="Total Empleados"
            value={allUsers.length}
            icon={<Users className="w-6 h-6 text-white" />}
            color="from-blue-500 to-cyan-500"
          />
          <MetricCard
            title="Ingresos Totales"
            value={`$${companyMetrics.monthlyRevenue?.toLocaleString() || '0'}`}
            icon={<DollarSign className="w-6 h-6 text-white" />}
            color="from-green-500 to-emerald-500"
            subtitle="Este mes"
          />
          <MetricCard
            title="Ventas Totales"
            value={companyMetrics.sales || 0}
            icon={<Award className="w-6 h-6 text-white" />}
            color="from-purple-500 to-violet-500"
          />
          <MetricCard
            title="Contactos Totales"
            value={companyMetrics.linkedinContacts}
            icon={<TrendingUp className="w-6 h-6 text-white" />}
            color="from-amber-500 to-orange-500"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          Mis Métricas
        </h2>
        <p className="text-slate-400">
          {user.role === 'CEO' 
            ? 'Vista ejecutiva de todas las métricas de la empresa'
            : user.role === 'Supervisor'
            ? 'Tus métricas personales y del equipo que supervisas'
            : 'Tus métricas personales de rendimiento'
          }
        </p>
      </div>

      {/* Métricas Personales */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Rendimiento Personal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {renderUserMetrics().map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>

      {/* Métricas del Equipo (solo para supervisores) */}
      {renderTeamMetrics()}

      {/* Métricas de la Empresa (solo para CEO) */}
      {renderCompanyMetrics()}

      {/* Análisis de Rendimiento */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Análisis de Rendimiento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {userMetrics.messagesSent > 0 
                ? Math.round((userMetrics.responses / userMetrics.messagesSent) * 100)
                : 0}%
            </p>
            <p className="text-sm text-slate-400">Tasa de Respuesta</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">
              {userMetrics.linkedinContacts > 0 
                ? Math.round((userMetrics.messagesSent / userMetrics.linkedinContacts) * 100)
                : 0}%
            </p>
            <p className="text-sm text-slate-400">Tasa de Contacto</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">
              {userMetrics.responses > 0 && userMetrics.personalEarnings > 0
                ? Math.round(userMetrics.personalEarnings / userMetrics.responses)
                : 0}
            </p>
            <p className="text-sm text-slate-400">Valor por Respuesta</p>
          </div>
        </div>
      </Card>

      {/* Estado del Sistema */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Estado del Sistema</h3>
            <p className="text-slate-400 text-sm">Todas las métricas se actualizan en tiempo real</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 font-medium">Sistema Activo</span>
          </div>
        </div>
      </Card>
    </div>
  );
};