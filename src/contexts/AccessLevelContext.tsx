import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePaymentPlan } from '@/hooks/usePaymentPlan';

export type AccessLevel = 'free' | 'coach' | 'payment';

interface AccessLevelContextType {
  accessLevel: AccessLevel;
  hasCoach: boolean;
  hasPaymentPlan: boolean;
  canAccessLibrary: boolean;
  canAccessProgress: boolean;
  canAccessPrograms: boolean;
  canAccessMessages: boolean;
  canAccessBlog: boolean;
}

const AccessLevelContext = createContext<AccessLevelContextType | undefined>(undefined);

interface AccessLevelProviderProps {
  children: ReactNode;
}

export const AccessLevelProvider: React.FC<AccessLevelProviderProps> = ({ children }) => {
  const { profile } = useAuth();
  const { planStatus } = usePaymentPlan();

  const hasCoach = Boolean(profile?.coach_id);
  const hasPaymentPlan = planStatus.hasActivePlan;

  // Determine access level
  let accessLevel: AccessLevel = 'free';
  if (hasPaymentPlan) {
    accessLevel = 'payment';
  } else if (hasCoach) {
    accessLevel = 'coach';
  }

  const canAccessLibrary = hasCoach || hasPaymentPlan;
  const canAccessProgress = hasPaymentPlan; // Only payment plan users
  const canAccessPrograms = hasCoach || hasPaymentPlan;
  const canAccessMessages = hasCoach || hasPaymentPlan;
  const canAccessBlog = hasCoach || hasPaymentPlan;

  const value: AccessLevelContextType = {
    accessLevel,
    hasCoach,
    hasPaymentPlan,
    canAccessLibrary,
    canAccessProgress,
    canAccessPrograms,
    canAccessMessages,
    canAccessBlog,
  };

  return (
    <AccessLevelContext.Provider value={value}>
      {children}
    </AccessLevelContext.Provider>
  );
};

export const useAccessLevel = () => {
  const context = useContext(AccessLevelContext);
  if (context === undefined) {
    throw new Error('useAccessLevel must be used within an AccessLevelProvider');
  }
  return context;
};
