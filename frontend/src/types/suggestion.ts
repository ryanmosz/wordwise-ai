export type SuggestionType = 
  | 'grammar' 
  | 'tone' 
  | 'persuasive' 
  | 'conciseness' 
  | 'headline' 
  | 'readability' 
  | 'vocabulary' 
  | 'ab_test';

export interface Suggestion {
  id: string;
  startIndex: number;
  endIndex: number;
  type: SuggestionType;
  originalText: string;
  suggestionText: string;
  explanation: string;
  confidence: number;
  accepted?: boolean | null; // null = pending, true = accepted, false = rejected
} 