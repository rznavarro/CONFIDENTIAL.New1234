import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Card, Button } from '../ui/Card';
import { Logo } from '../ui/Logo';

interface LoginFormProps {
  onLogin: (email: string, accessCode: string) => boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Optimized loading time
    await new Promise(resolve => setTimeout(resolve, 300));

    const success = onLogin(email, accessCode);
    if (!success) {
      setError('Credenciales incorrectas. Verifica tu email y código de acceso.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 lg:p-8">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-4" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
            Acceso al Sistema
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Ingresa tus credenciales corporativas
          </p>
        </div>

        <Card className="space-y-4 sm:space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm sm:text-base font-medium text-slate-300 mb-2">
                Email Corporativo
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@vortexia.com"
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-base transition-all duration-200"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-slate-300 mb-2">
                Código de Acceso
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                <input
                  type={showAccessCode ? "text" : "password"}
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  placeholder="VX001"
                  className="w-full pl-10 sm:pl-12 pr-12 py-3 sm:py-4 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-base transition-all duration-200"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowAccessCode(!showAccessCode)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showAccessCode ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 sm:p-4 bg-red-500/20 border border-red-500/50 rounded-lg animate-shake">
                <p className="text-red-400 text-sm sm:text-base">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !email || !accessCode}
              className="w-full min-h-[48px] sm:min-h-[52px]"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
        </Card>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-slate-500 text-xs sm:text-sm">
            ¿Problemas para acceder? Contacta al administrador del sistema.
          </p>
        </div>
      </div>
    </div>
  );
};