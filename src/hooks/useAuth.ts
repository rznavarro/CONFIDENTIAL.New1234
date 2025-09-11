import { useState, useEffect } from 'react';
import { AuthState, User, Team } from '../types';
import { findUserByCredentials } from '../data/users';
import { getTeamById, getTeamByCode } from '../data/teams';

const STORAGE_KEY = 'vortexia_auth_state';

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  selectedTeam: null,
  currentStep: 'login'
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Try to restore auth state from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedState = JSON.parse(stored);
        console.log('Restored auth state:', parsedState);
        // Validate that the stored state has the required structure
        if (parsedState.isAuthenticated && parsedState.user && parsedState.currentStep === 'dashboard') {
          return parsedState;
        }
      }
    } catch (error) {
      console.error('Error restoring auth state:', error);
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
    }
    console.log('Using initial auth state');
    return initialAuthState;
  });

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    try {
      console.log('Saving auth state:', authState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  }, [authState]);

  const login = (email: string, accessCode: string): boolean => {
    const user = findUserByCredentials(email, accessCode);
    
    if (user) {
      // Check if user is a supervisor - they can skip team selection
      if (user.role === 'Supervisor' || user.role === 'CEO') {
        setAuthState({
          isAuthenticated: true,
          user,
          selectedTeam: user.team ? getTeamById(user.team) : null,
          currentStep: 'dashboard'
        });
      } else {
        setAuthState({
          isAuthenticated: true,
          user,
          selectedTeam: null,
          currentStep: 'team-selection'
        });
      }
      return true;
    }
    
    return false;
  };

  const selectTeam = (teamId: string): void => {
    const team = getTeamById(teamId);
    if (team) {
      // Check if user's email is in the team members list or if they're CEO
      const userEmail = authState.user?.email.toLowerCase();
      const isTeamMember = team.members.some(member => member.toLowerCase() === userEmail);
      const isCEO = authState.user?.role === 'CEO';
      
      if (isTeamMember || isCEO) {
        // Skip verification for team members and CEO
        setAuthState(prev => ({
          ...prev,
          selectedTeam: team,
          currentStep: 'dashboard'
        }));
      } else {
        // Require verification for non-team members
        setAuthState(prev => ({
          ...prev,
          selectedTeam: team,
          currentStep: 'team-verification'
        }));
      }
    }
  };

  const verifyTeam = (teamCode: string): boolean => {
    const team = getTeamByCode(teamCode);
    
    if (team && authState.selectedTeam?.id === team.id) {
      setAuthState(prev => ({
        ...prev,
        currentStep: 'dashboard'
      }));
      return true;
    }
    
    return false;
  };

  const goBackToTeamSelection = (): void => {
    setAuthState(prev => ({
      ...prev,
      selectedTeam: null,
      currentStep: 'team-selection'
    }));
  };

  const logout = (): void => {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);
    
    setAuthState(initialAuthState);
  };

  return {
    authState,
    login,
    selectTeam,
    verifyTeam,
    logout,
    goBackToTeamSelection
  };
};