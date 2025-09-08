import React from 'react';

interface Metric {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface MetricsViewProps {
  metrics?: Metric[];
  title?: string;
  className?: string;
}

const MetricsView: React.FC<MetricsViewProps> = ({ 
  metrics = [], 
  title = "Métricas del Dashboard",
  className = ""
}) => {
  // Métricas por defecto si no se proporcionan
  const defaultMetrics: Metric[] = [
    {
      id: 'users',
      title: 'Usuarios Activos',
      value: '1,234',
      change: '+12%',
      trend: 'up'
    },
    {
      id: 'revenue',
      title: 'Ingresos',
      value: '$45,678',
      change: '+8%',
      trend: 'up'
    },
    {
      id: 'orders',
      title: 'Pedidos',
      value: '567',
      change: '-3%',
      trend: 'down'
    },
    {
      id: 'conversion',
      title: 'Conversión',
      value: '3.2%',
      change: '+0.5%',
      trend: 'up'
    }
  ];

  const displayMetrics = metrics.length > 0 ? metrics : defaultMetrics;

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <div className={`metrics-view ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayMetrics.map((metric) => (
          <div 
            key={metric.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                {metric.title}
              </h3>
              {metric.trend && (
                <span className={`text-lg ${getTrendColor(metric.trend)}`}>
                  {getTrendIcon(metric.trend)}
                </span>
              )}
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {metric.value}
                </p>
                {metric.change && (
                  <p className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                    {metric.change}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsView;