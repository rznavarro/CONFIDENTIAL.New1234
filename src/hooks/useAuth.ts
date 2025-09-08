import { useState, useCallback } from 'react';
import { useEffect } from 'react';
import { AuthState, User, Team } from '../types';
import { findUserByCredentials } from '../data/users';
import { getTeamById, teamCodes } from '../data/teams';

const AUTH_STORAGE_KEY = 'vortexia_auth_state';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Try to restore auth state from localStorage
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsedState = JSON.parse(stored);
        return {
          ...parsedState,
          isAuthenticated: parsedState.currentStep === 'dashboard'
        };
      }
    } catch (error) {
      console.error('Error restoring auth state:', error);
    }
    
    return {
      isAuthenticated: false,
      user: null,
      selectedTeam: null,
      currentStep: 'login'
    };
  });

  // Persist auth state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  }, [authState]);

  const login = useCallback((email: string, accessCode: string): boolean => {
    const user = findUserByCredentials(email, accessCode);
    if (user) {
      const newState = {
        user,
        selectedTeam: null,
        currentStep: user.role === 'CEO' ? 'dashboard' : 'team-selection',
        isAuthenticated: user.role === 'CEO'
      } as AuthState;
      
      setAuthState(newState);
      return true;
    }
    return false;
  }, []);

  const selectTeam = useCallback((teamId: string) => {
    const team = getTeamById(teamId);
    if (team) {
      const newState = {
        ...authState,
        selectedTeam: team,
        currentStep: authState.user?.role === 'Supervisor' ? 'dashboard' : 'team-verification',
        isAuthenticated: authState.user?.role === 'Supervisor'
      } as AuthState;
      
      setAuthState(newState);
    }
  }, [authState]);

  const verifyTeam = useCallback((teamCode: string): boolean => {
    if (authState.selectedTeam && teamCodes[authState.selectedTeam.id] === teamCode) {
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        currentStep: 'dashboard'
      }));
      return true;
    }
    return false;
  }, [authState.selectedTeam]);

  const logout = useCallback(() => {
    const newState = {
      isAuthenticated: false,
      user: null,
      selectedTeam: null,
      currentStep: 'login'
    } as AuthState;
    
    setAuthState(newState);
    // Clear stored auth state
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const goBackToTeamSelection = useCallback(() => {
    setAuthState(prev => ({
      ...prev,
      selectedTeam: null,
      currentStep: 'team-selection',
      isAuthenticated: false
    }));
  }, []);

  return {
    authState,
    login,
    selectTeam,
    verifyTeam,
    logout,
    goBackToTeamSelection
  };
};
    isAuthenticated: false,
    user: null,
    selectedTeam: null,
    currentStep: 'login'
  });

  const login = useCallback((email: string, accessCode: string): boolean => {
    const user = findUserByCredentials(email, accessCode);
    if (user) {
      setAuthState(prev => ({
        ...prev,
        user,
        currentStep: user.role === 'CEO' ? 'dashboard' : 'team-selection'
      }));
      return true;
    }
    return false;
  }, []);

  const selectTeam = useCallback((teamId: string) => {
    const team = getTeamById(teamId);
    if (team) {
      setAuthState(prev => ({
        ...prev,
        selectedTeam: team,
        currentStep: prev.user?.role === 'Supervisor' ? 'dashboard' : 'team-verification'
      }));
    }
  }, []);

  const verifyTeam = useCallback((teamCode: string): boolean => {
    if (authState.selectedTeam && teamCodes[authState.selectedTeam.id] === teamCode) {
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        currentStep: 'dashboard'
      }));
      return true;
    }
    return false;
  }, [authState.selectedTeam]);

  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      selectedTeam: null,
      currentStep: 'login'
    });
  }, []);

  const goBackToTeamSelection = useCallback(() => {
    setAuthState(prev => ({
      ...prev,
      selectedTeam: null,
      currentStep: 'team-selection'
    }));
  }, []);

  return {
    authState,
    login,
    selectTeam,
    verifyTeam,
    logout,
    goBackToTeamSelection
  };
};