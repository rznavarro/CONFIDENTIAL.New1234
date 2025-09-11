import React, { Suspense, lazy } from 'react';
import { useAuth } from './hooks/useAuth';
import { ParticleBackground } from './components/ui/ParticleBackground';
import { LoginForm } from './components/auth/LoginForm';
import { TeamSelection } from './components/auth/TeamSelection';
import { TeamVerification } from './components/auth/TeamVerification';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// Lazy load Dashboard for better performance
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));

function App() {
  const { 
    authState, 
    login, 
    selectTeam, 
    verifyTeam, 
    logout, 
    goBackToTeamSelection 
  } = useAuth();

  // Debug: Log current step
  console.log('Current auth step:', authState.currentStep);
  console.log('Auth state:', authState);

  const renderCurrentStep = () => {
    switch (authState.currentStep) {
      case 'login':
        return <LoginForm onLogin={login} />;
      
      case 'team-selection':
        return (
          <TeamSelection 
            user={authState.user!} 
            onSelectTeam={selectTeam} 
          />
        );
      
      case 'team-verification':
        return (
          <TeamVerification 
            team={authState.selectedTeam!} 
            onVerify={verifyTeam}
            onGoBack={goBackToTeamSelection}
          />
        );
      
      case 'dashboard':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard 
              user={authState.user!} 
              onLogout={logout} 
            />
          </Suspense>
        );
      
      default:
        return <LoginForm onLogin={login} />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {authState.currentStep !== 'dashboard' && <ParticleBackground />}
      <div className="relative z-10">
        {renderCurrentStep()}
      </div>
    </div>
  );
}

export default App;