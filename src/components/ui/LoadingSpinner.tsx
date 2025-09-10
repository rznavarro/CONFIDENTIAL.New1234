import React from 'react';
import { Zap } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="relative mb-6">
          <Zap className="w-16 h-16 text-cyan-400 animate-pulse mx-auto" />
          <div className="absolute inset-0 bg-cyan-400 rounded-full opacity-20 blur-md animate-ping" />
        </div>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
          Cargando Vortexia...
        </h2>
        <p className="text-slate-400 text-sm mt-2">Preparando tu experiencia</p>
      </div>
    </div>
  );
};