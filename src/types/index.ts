export interface Note {
  id: string;
  content: string;
  originalContent?: string;
  isProcessing: boolean;
  error?: string;
  additionalInstructions?: string;
  sections: NoteSection[];
}

export interface NoteSection {
  id: string;
  heading: string;
  content: string;
  versions: SectionVersion[];
  currentVersion: number;
  isProcessing: boolean;
  error?: string;
}

export interface SectionVersion {
  id: number;
  content: string;
  timestamp: number;
}

export interface ProcessingOptions {
  prompt: string;
  content: string;
  additionalInstructions?: string;
  originalContent?: string;
  removeHeader?: boolean;
}

export interface NoteFormData {
  content: string;
  selectedTherapies: string[];
  selectedConcerns: string[];
  selectedObservations: string[];
  selectedResponses: string[];
  selectedPlans: string[];
  noteType: 'session' | 'assessment';
  isGuided: boolean;
  guidedResponses?: Record<string, string>;
  customInstructions?: string;
}

export interface GuidedQuestion {
  id: string;
  text: string;
  category: string;
}