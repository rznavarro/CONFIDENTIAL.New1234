import React, { useState } from 'react';
import { ArrowLeft, Shield, Lock } from 'lucide-react';
import { Card, Button } from '../ui/Card';
import { Team } from '../../types';

interface TeamVerificationProps {
  team: Team;
  onVerify: (teamCode: string) => boolean;
  onGoBack: () => void;
}

export const TeamVerification: React.FC<TeamVerificationProps> = ({ 
  team, 
  onVerify, 
  onGoBack 
}) => {
  const [teamCode, setTeamCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Optimized loading time
    await new Promise(resolve => setTimeout(resolve, 300));

    const success = onVerify(teamCode);
    if (!success) {
      setError('Código de equipo incorrecto. Verifica con tu supervisor.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div 
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-xl sm:text-2xl"
            style={{ backgroundColor: `${team.color}20`, border: `2px solid ${team.color}` }}
          >
            {team.icon}
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
            Verificación de Equipo
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Ingresa el código de acceso para <br />
            <span className="text-cyan-400 font-semibold">{team.name}</span>
          </p>
        </div>

        <Card className="space-y-4 sm:space-y-6">
          <div className="text-center p-3 sm:p-4 bg-slate-800/30 rounded-lg">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1">{team.name}</h3>
            <p className="text-xs sm:text-sm text-slate-400">Supervisor: {team.supervisor}</p>
            <p className="text-xs text-slate-500 mt-1">
              {team.members.length} {team.members.length === 1 ? 'miembro' : 'miembros'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm sm:text-base font-medium text-slate-300 mb-2">
                Código de Equipo
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                <input
                  type="text"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                  placeholder="Ingresa el código del equipo"
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-base transition-all duration-200"
                  required
                  autoComplete="off"
                />
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
              disabled={isLoading || !teamCode}
              className="w-full min-h-[48px] sm:min-h-[52px]"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                'Acceder al Equipo'
              )}
            </Button>
          </form>

          <button
            onClick={onGoBack}
            className="w-full flex items-center justify-center gap-2 p-3 sm:p-4 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/30"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a selección de equipo
          </button>
        </Card>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-slate-500 text-xs sm:text-sm">
            ¿No tienes el código? Contacta a tu supervisor del equipo.
          </p>
        </div>
      </div>
    </div>
  );
};