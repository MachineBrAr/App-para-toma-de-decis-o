export interface ProItem {
  id: string;
  text: string;
  category: string;
  weight: number; // 1 to 5
  explanation?: string;
  enabled?: boolean;
}

export interface ConItem {
  id: string;
  text: string;
  category: string;
  weight: number; // 1 to 5
  mitigation?: string;
  enabled?: boolean;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface OptionAnalysis {
  id: string;
  name: string;
  pros: ProItem[];
  cons: ConItem[];
  swot: SwotAnalysis;
}

export interface Criterion {
  id: string;
  name: string;
  description?: string;
  defaultWeight: number;
}

export interface CriterionScore {
  optionId: string;
  criterionId: string;
  score: number; // 1 to 10
  reason: string;
}

export interface ComparisonMatrix {
  criteria: Criterion[];
  scores: CriterionScore[];
}

export interface ActionStep {
  step: number;
  title: string;
  description: string;
  timeline: string;
}

export interface DecisionVerdict {
  recommendedOptionId: string;
  recommendedOptionName: string;
  confidenceLevel: string; // Alta, Moderada, Equilibrada
  headline: string;
  rationalVerdict: string;
  theClincher: string;
  gutCheckQuestion: string;
  blindSpots: string[];
  actionPlan: ActionStep[];
}

export interface DecisionAnalysisResponse {
  summary: string;
  optionsAnalysis: OptionAnalysis[];
  comparisonMatrix: ComparisonMatrix;
  verdict: DecisionVerdict;
}

export interface SavedDecision {
  id: string;
  title: string;
  context?: string;
  options: string[];
  language: 'pt' | 'en';
  createdAt: string;
  updatedAt: string;
  data: DecisionAnalysisResponse;
  status: 'pending' | 'decided' | 'reviewing';
  chosenOptionId?: string;
  userNotes?: string;
}

export interface TemplateScenario {
  id: string;
  category: 'carreira' | 'financas' | 'pessoal' | 'negocios' | 'tecnologia';
  title: string;
  description: string;
  options: string[];
  context: string;
  priorities: string[];
}
