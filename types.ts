
export enum RecordStatus {
  COMPLETED = 'Completed',
  ONGOING = 'Ongoing',
  DISCHARGED = 'Discharged',
}

export enum PrivacyLevel {
  FULL = 'Full Record',
  SUMMARY = 'Summary Only',
  CUSTOM = 'Custom',
}

export enum DisclosureTiming {
  IMMEDIATE = 'Immediate',
  DELAYED = 'Delayed (30 Days)',
}

export enum RequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface SharingPreferences {
  attributes: {
    diagnosis: boolean;
    subjective: boolean;
    objective: boolean;
    proms: boolean;
    treatment: boolean;
    sessions: boolean;
    patientStatus: boolean;
  };
  anonymizeName: boolean;
}

export interface Transaction {
  id: string;
  type: "contribution" | "retrieval" | "request";
  date: string; // ISO timestamp
  creditsChange: number;
  qualityScore?: number; // 0-100
  details: string;
}

export interface PatientRequest {
  id: string;
  targetClinicName: string;
  patientName: string; // In a real app, this might be a hash or ID until approved
  patientDob: string;
  requestDate: string;
  status: RequestStatus;
  responseRecordId?: string; // ID of the shared record once approved
}

export interface ClinicalRecord {
  id: string;
  patientName: string; // Anonymized when shared
  patientId: string; // Internal ID
  dateOfBirth: string; // ISO Date YYYY-MM-DD
  age: number;
  gender: 'M' | 'F' | 'Other';
  diagnosis: string;
  diagnosisCategory: string; // For filtering (e.g., 'Shoulder', 'Knee')
  icd10: string;
  treatmentDate: string; // ISO date
  status: RecordStatus;
  
  // Funding / Status
  fundingSource?: string; // e.g. Private, Workcover, EPC
  fundingCaseId?: string;

  // Clinical Details
  subjectiveComplaint: string; // Patient stated history
  objectiveFindings: string; // ROM, Strength, Special Tests
  promScores: string; // SPADI, ODI, VISA-A, etc.
  treatmentPlan: string;
  outcome: string;
  
  // Detailed notes (subject to privacy/delay)
  detailedNotes?: string;
  clinicalReasoning?: string;
  
  // Stats
  sessions: number;
  durationWeeks: number;

  // Raw Data (Shorthand/Clinician Notes)
  raw?: {
    subjective: string;
    objective: string;
    treatment: string;
    proms: string;
    notes?: string;
  };
}

export interface SharedRecord extends ClinicalRecord {
  sharedByClinic: string;
  sharedDate: string;
  privacyLevel: PrivacyLevel;
  disclosureTiming: DisclosureTiming;
  tier: 'Bronze' | 'Silver' | 'Gold'; // Clinic tier
  distanceKm: number;
  rating?: number; // 1-5 stars
}

export interface UserState {
  id: string;
  tokens: number; // Renamed conceptually to 'Credits' in UI, but keeping variable name for consistency
  isParticipating: boolean; // Becomes true after first contribution
  clinicName: string;
  badges: string[]; 
  totalContributions: number;
  totalRetrievals: number;
  monthlyShares: number;
  unlockedRecordIds: string[];
  preferences: SharingPreferences;
  transactions: Transaction[];
  sentRequests: PatientRequest[];
}

export interface BadgeDef {
  id: string;
  label: string;
  icon: string;
  color: string;
}
