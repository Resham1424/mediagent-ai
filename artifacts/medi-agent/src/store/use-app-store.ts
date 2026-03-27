import { create } from 'zustand';
import { formatDateTime, generateSessionId } from '@/lib/utils';
import type { TriageResponse, FollowUpResponse } from '@workspace/api-client-react';

export type AgentType = 'SYMPTOM_AGENT' | 'EMERGENCY_AGENT' | 'SPECIALIST_AGENT' | 'SCHEDULING_AGENT' | 'FOLLOWUP_AGENT';

export interface AuditLog {
  id: string;
  timestamp: string;
  agent: AgentType;
  action: string;
  details?: string;
}

export type TabId = 'triage' | 'assessment' | 'specialist' | 'scheduling' | 'followup';

interface PatientInfo {
  name: string;
  age: number;
  gender: string;
}

interface AppState {
  // Session State
  sessionId: string;
  acceptedDisclaimer: boolean;
  setAcceptedDisclaimer: (val: boolean) => void;
  
  // Navigation
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  completedTabs: TabId[];
  markTabComplete: (tab: TabId) => void;

  // Patient Data
  patientInfo: PatientInfo | null;
  setPatientInfo: (info: PatientInfo) => void;

  // AI Responses
  triageData: TriageResponse | null;
  setTriageData: (data: TriageResponse | null) => void;
  followUpData: FollowUpResponse | null;
  setFollowUpData: (data: FollowUpResponse | null) => void;

  // UI State
  isAnalyzing: boolean;
  setIsAnalyzing: (val: boolean) => void;

  // Audit Log
  auditLogs: AuditLog[];
  addLog: (agent: AgentType, action: string, details?: string) => void;
  clearLogs: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  sessionId: generateSessionId(),
  acceptedDisclaimer: false,
  setAcceptedDisclaimer: (val) => set({ acceptedDisclaimer: val }),
  
  activeTab: 'triage',
  setActiveTab: (tab) => set({ activeTab: tab }),
  completedTabs: [],
  markTabComplete: (tab) => set((state) => ({ 
    completedTabs: state.completedTabs.includes(tab) ? state.completedTabs : [...state.completedTabs, tab] 
  })),

  patientInfo: null,
  setPatientInfo: (info) => set({ patientInfo: info }),

  triageData: null,
  setTriageData: (data) => set({ triageData: data }),
  
  followUpData: null,
  setFollowUpData: (data) => set({ followUpData: data }),

  isAnalyzing: false,
  setIsAnalyzing: (val) => set({ isAnalyzing: val }),

  auditLogs: [],
  addLog: (agent, action, details) => set((state) => ({
    auditLogs: [
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: formatDateTime(),
        agent,
        action,
        details
      },
      ...state.auditLogs
    ]
  })),
  clearLogs: () => set({ auditLogs: [] })
}));
