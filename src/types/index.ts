export type AITool =
  | 'cursor'
  | 'github_copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic_api'
  | 'openai_api'
  | 'gemini'
  | 'windsurf';

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface ToolSpend {
  tool: AITool;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditFormData {
  toolSpends: ToolSpend[];
  teamSize: number;
  primaryUseCase: UseCase;
}

export interface ToolRecommendation {
  tool: AITool;
  currentSpend: number;
  recommendedPlan: string;
  projectedSpend: number;
  monthlySavings: number;
  reason: string;
}

export interface AuditResult {
  totalMonthlySpend: number;
  totalAnnualSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  recommendations: ToolRecommendation[];
  needsConsultation: boolean;
  isEfficient: boolean;
}

export interface AuditSubmissionData {
  formData: AuditFormData;
  auditResult: AuditResult | null;
}

export interface AuditRecord {
  email: string;
  companyName: string;
  role: string;
  teamSize: number;
  auditData: AuditSubmissionData;
}
