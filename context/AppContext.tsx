import React, { createContext, useContext, useState } from 'react';
import { UserState, SharedRecord, ClinicalRecord, SharingPreferences, Transaction, PatientRequest, RequestStatus } from '../types';
import { MY_CLINIC_NAME, NETWORK_RECORDS } from '../constants';

interface AppContextType {
  user: UserState;
  networkRecords: SharedRecord[];
  
  // Actions
  optIn: () => void;
  optOut: () => void;
  calculateQualityScore: (attributes: Record<string, boolean>) => number;
  getMultiplier: (score: number) => number;
  shareRecord: (recordId: string, attributes: Record<string, boolean>, timing: any) => void;
  unlockRecord: (recordId: string) => boolean;
  requestRecord: (patientName: string, dob: string, clinicName: string, existingRecordId?: string) => boolean;
  rateRecord: (recordId: string, rating: number) => void;
  updateSharingPreferences: (prefs: Partial<SharingPreferences>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial State
  const [user, setUser] = useState<UserState>({
    id: 'user-clinic-001',
    tokens: 0, // Start with 0 credits for opted-out state
    isParticipating: false, // Start as not participating
    clinicName: MY_CLINIC_NAME,
    badges: ['network_verified'],
    totalContributions: 0,
    totalRetrievals: 0,
    monthlyShares: 0,
    unlockedRecordIds: [],
    transactions: [],
    sentRequests: [], // Track outgoing requests
    preferences: {
      attributes: {
        diagnosis: true,
        subjective: true,
        objective: true,
        proms: true,
        treatment: true,
        sessions: true,
        patientStatus: true
      },
      anonymizeName: true
    }
  });

  const [networkRecords, setNetworkRecords] = useState<SharedRecord[]>(NETWORK_RECORDS);

  // Opt-in logic (Conceptual join, but true participation is triggered by first share)
  const optIn = () => {
    // Unlike before, NO free tokens are given.
    setUser(prev => ({
      ...prev,
      isParticipating: true, // Allow them to access the dashboard views
    }));
  };

  // Opt-out logic
  const optOut = () => {
    setUser(prev => ({
      ...prev,
      isParticipating: false,
      tokens: 0, // Forfeit credits
      badges: prev.badges.filter(b => b === 'founding_member')
    }));
  };

  // Quality Scoring System
  const calculateQualityScore = (attributes: Record<string, boolean>): number => {
    // Weights based on new specifications
    // Note: If an attribute key is missing in the object but required, it treats as false.
    let score = 0; 

    if (attributes.diagnosis) score += 10;
    if (attributes.subjective) score += 15;
    if (attributes.objective) score += 20;
    if (attributes.proms) score += 15;
    if (attributes.treatment) score += 20;
    if (attributes.sessions) score += 5;
    if (attributes.patientStatus) score += 15;
    
    return Math.min(score, 100);
  };

  const getMultiplier = (score: number): number => {
    if (score >= 90) return 1.0;
    if (score >= 60) return 0.7;
    if (score >= 30) return 0.4;
    return 0.3; // Minimal
  };

  // Share record logic (Contribution)
  const shareRecord = (recordId: string, attributes: Record<string, boolean>, timing: any) => {
    const score = calculateQualityScore(attributes);
    const creditsEarned = getMultiplier(score);

    setUser(prev => {
      const newMonthly = prev.monthlyShares + 1;
      let newBadges = [...prev.badges];
      
      // First contribution logic
      if (!prev.badges.includes('network_verified')) {
        newBadges.push('network_verified');
      }

      // Top Contributor Logic
      if (newMonthly >= 15 && !newBadges.includes('top_contributor')) {
        newBadges.push('top_contributor');
      }

      const transaction: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'contribution',
        date: new Date().toISOString(),
        creditsChange: creditsEarned,
        qualityScore: score,
        details: `Shared record ${recordId}`
      };

      return {
        ...prev,
        tokens: parseFloat((prev.tokens + creditsEarned).toFixed(2)),
        totalContributions: prev.totalContributions + 1,
        monthlyShares: newMonthly,
        badges: newBadges,
        isParticipating: true, // Ensure they are marked participating after first share
        transactions: [transaction, ...prev.transactions]
      };
    });
  };

  // Unlock logic (Retrieval)
  const unlockRecord = (recordId: string): boolean => {
    if (user.unlockedRecordIds.includes(recordId)) return true;
    
    // Strict Check: Must have >= 1.0 credits
    if (user.tokens < 1.0) return false;

    const cost = 1.0;

    const transaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'retrieval',
      date: new Date().toISOString(),
      creditsChange: -cost,
      details: `Unlocked record ${recordId}`
    };

    setUser(prev => ({
      ...prev,
      tokens: parseFloat((prev.tokens - cost).toFixed(2)),
      totalRetrievals: prev.totalRetrievals + 1,
      unlockedRecordIds: [...prev.unlockedRecordIds, recordId],
      transactions: [transaction, ...prev.transactions]
    }));
    return true;
  };

  // Request Record Logic (Clinic A asks Clinic B)
  const requestRecord = (patientName: string, dob: string, targetClinicName: string, existingRecordId?: string): boolean => {
    if (user.tokens < 1.0) return false;

    const requestId = `req-${Date.now()}`;
    const cost = 1.0;

    // 1. Deduct Token Immediately
    const transaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'request',
      date: new Date().toISOString(),
      creditsChange: -cost,
      details: `Requested record for ${patientName} from ${targetClinicName}`
    };

    const newRequest: PatientRequest = {
      id: requestId,
      targetClinicName,
      patientName,
      patientDob: dob,
      requestDate: new Date().toISOString().split('T')[0],
      status: RequestStatus.PENDING
    };

    setUser(prev => ({
      ...prev,
      tokens: parseFloat((prev.tokens - cost).toFixed(2)),
      transactions: [transaction, ...prev.transactions],
      sentRequests: [newRequest, ...prev.sentRequests]
    }));

    // 2. Simulate Clinic B Approval (After 5 seconds)
    setTimeout(() => {
      // Logic to resolve the correct record ID for the approval
      let responseId = existingRecordId;

      // If no ID was passed (e.g. from Global Index), or the ID doesn't exist in our mocked network records
      // we need a fallback for the prototype to work smoothly.
      const recordExists = networkRecords.some(r => r.id === responseId);
      
      if (!responseId || !recordExists) {
        // Try to match by name as a fallback for robustness
        const match = networkRecords.find(r => r.patientName === patientName);
        responseId = match ? match.id : NETWORK_RECORDS[0].id; // Fallback to first record if completely unknown
      }
      
      setUser(prev => {
        const updatedRequests = prev.sentRequests.map(req => {
          if (req.id === requestId) {
            return {
              ...req,
              status: RequestStatus.APPROVED,
              responseRecordId: responseId
            };
          }
          return req;
        });

        // Also add to unlocked IDs so they can view it immediately
        // Ensure responseId is defined before adding
        const unlockedIds = (responseId && !prev.unlockedRecordIds.includes(responseId))
          ? [...prev.unlockedRecordIds, responseId]
          : prev.unlockedRecordIds;

        return {
          ...prev,
          sentRequests: updatedRequests,
          unlockedRecordIds: unlockedIds
        };
      });
    }, 4000); // 4 second delay to simulate network latency/human approval

    return true;
  };

  const rateRecord = (recordId: string, rating: number) => {
    console.log(`Rated record ${recordId} with ${rating} stars`);
  };

  const updateSharingPreferences = (newPrefs: Partial<SharingPreferences>) => {
    setUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...newPrefs }
    }));
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      networkRecords, 
      optIn, 
      optOut, 
      shareRecord, 
      unlockRecord, 
      requestRecord, 
      rateRecord, 
      updateSharingPreferences,
      calculateQualityScore,
      getMultiplier
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};