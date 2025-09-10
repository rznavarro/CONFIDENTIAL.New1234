import React, { useState } from 'react';
import { X, DollarSign, User, Mail, Phone, Calculator } from 'lucide-react';
import { Card, Button } from '../ui/Card';
import { Deal, DealFormData, User as UserType } from '../../types';
import { createDeal } from '../../data/metrics';

interface DealFormProps {
  user: UserType;
  onClose: () => void;
  onDealCreated: () => void;
}

export const DealForm: React.FC<DealFormProps> = ({ user, onClose, onDealCreated }) => {
  const [formData, setFormData] = useState<DealFormData>({
    clientName: '',
    email: '',
    phone: '',
    servicePrice: 0,
    creationCost: user.role === 'CEO' ? 0 : undefined,
    commission: user.role !== 'CEO' ? 0 : undefined
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newDeal: Deal = {
      id: Date.now().toString(),
      ...formData,
      createdBy: user.id,
      createdAt: new Date(),
      status: 'closed' // Auto-close for demo purposes
    };

    createDeal(newDeal);
    onDealCreated();
    onClose();
    setIsLoading(false);
  };

  const handleInputChange = (field: keyof DealFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 safe-area-inset">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white">Crear Nuevo Deal</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors touch-manipulation"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-sm sm:text-base font-medium text-slate-300 mb-2">
              Nombre del Cliente
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                placeholder="Nombre completo"
                className="form-input pl-10 sm:pl-12"
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-slate-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="cliente@empresa.com"
                className="form-input pl-10 sm:pl-12"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-slate-300 mb-2">
              Teléfono
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+56 9 1234 5678"
                className="form-input pl-10 sm:pl-12"
                required
                autoComplete="tel"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-slate-300 mb-2">
              Precio del Servicio
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              <input
                type="number"
                value={formData.servicePrice}
                onChange={(e) => handleInputChange('servicePrice', Number(e.target.value))}
                placeholder="0"
                min="0"
                className="form-input pl-10 sm:pl-12"
                required
              />
            </div>
          </div>

          {user.role === 'CEO' && (
            <div>
              <label className="block text-sm sm:text-base font-medium text-slate-300 mb-2">
                Costo de Creación
              </label>
              <div className="relative">
                <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                <input
                  type="number"
                  value={formData.creationCost || 0}
                  onChange={(e) => handleInputChange('creationCost', Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  className="form-input pl-10 sm:pl-12"
                />
              </div>
            </div>
          )}

          {user.role !== 'CEO' && (
            <div>
              <label className="block text-sm sm:text-base font-medium text-slate-300 mb-2">
                Comisión
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                <input
                  type="number"
                  value={formData.commission || 0}
                  onChange={(e) => handleInputChange('commission', Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  className="form-input pl-10 sm:pl-12"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={isLoading || !formData.clientName || !formData.email || !formData.phone || !formData.servicePrice}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creando Deal...
              </>
            ) : (
              'Crear Deal'
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};