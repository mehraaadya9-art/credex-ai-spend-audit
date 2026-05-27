import { AuditFormData, AuditResult, ToolRecommendation, AITool } from '../types';
import { toolPricing, toolLabels } from '../data/plans';

function analyzeCursor(spend: any, toolInfo: any, teamSize: number): Partial<ToolRecommendation> {
  const currentPlan = toolInfo.plans.find((p: any) => p.id === spend.plan);
  const proPlan = toolInfo.plans.find((p: any) => p.id === 'pro');
  const businessPlan = toolInfo.plans.find((p: any) => p.id === 'business');

  if (spend.plan === 'business' && spend.seats <= 2) {
    const projectedSpend = proPlan.price * spend.seats;
    return {
      recommendedPlan: 'pro',
      projectedSpend,
      monthlySavings: spend.monthlySpend - projectedSpend,
      reason: `With only ${spend.seats} seat${spend.seats > 1 ? 's' : ''}, Cursor Pro at $${proPlan.price}/seat is more cost-effective than Business at $${businessPlan.price}/seat. You're overpaying by $${businessPlan.price - proPlan.price}/seat.`,
    };
  }

  if (spend.plan === 'business' && spend.seats >= 3 && spend.seats <= 5) {
    return {
      reason: `Cursor Business provides centralized billing and admin controls for ${spend.seats} seats. Consider if you need these team management features, otherwise Pro could save $${(businessPlan.price - proPlan.price) * spend.seats}/month.`,
    };
  }

  if (spend.plan === 'free' && teamSize <= 3 && spend.seats === 1) {
    return {
      reason: 'Using Cursor Free tier is optimal for small teams. Consider upgrading to Pro when you need increased AI usage or priority features.',
    };
  }

  return {
    reason: `Your Cursor ${currentPlan?.name} plan is well-suited for ${spend.seats} seat${spend.seats > 1 ? 's' : ''} with your current usage pattern.`,
  };
}

function analyzeChatGPT(spend: any, toolInfo: any, teamSize: number): Partial<ToolRecommendation> {
  const currentPlan = toolInfo.plans.find((p: any) => p.id === spend.plan);
  const plusPlan = toolInfo.plans.find((p: any) => p.id === 'plus');
  const teamPlan = toolInfo.plans.find((p: any) => p.id === 'team');
  const enterprisePlan = toolInfo.plans.find((p: any) => p.id === 'enterprise');

  if (spend.plan === 'team' && spend.seats <= 2) {
    const projectedSpend = plusPlan.price * spend.seats;
    return {
      recommendedPlan: 'plus',
      projectedSpend,
      monthlySavings: spend.monthlySpend - projectedSpend,
      reason: `ChatGPT Team (${teamPlan.price}/seat) with only ${spend.seats} seat${spend.seats > 1 ? 's' : ''} is more expensive than individual Plus plans ($${plusPlan.price}/seat). Switch to save $${(teamPlan.price - plusPlan.price) * spend.seats}/month.`,
    };
  }

  if (spend.plan === 'enterprise' && spend.seats <= 10) {
    const projectedSpend = teamPlan.price * spend.seats;
    return {
      recommendedPlan: 'team',
      projectedSpend,
      monthlySavings: spend.monthlySpend - projectedSpend,
      reason: `ChatGPT Enterprise ($${enterprisePlan.price}/seat) may be overkill for ${spend.seats} seats. Team plan at $${teamPlan.price}/seat offers similar features with $${enterprisePlan.price - teamPlan.price}/seat savings.`,
    };
  }

  if (spend.plan === 'team' && spend.seats >= 5) {
    return {
      reason: `ChatGPT Team with ${spend.seats} seats is a good choice. You get admin controls and team management at $${teamPlan.price}/seat.`,
    };
  }

  return {
    reason: `Your ChatGPT ${currentPlan?.name} plan is appropriate for your current needs.`,
  };
}

function analyzeClaude(spend: any, toolInfo: any, teamSize: number): Partial<ToolRecommendation> {
  const currentPlan = toolInfo.plans.find((p: any) => p.id === spend.plan);
  const proPlan = toolInfo.plans.find((p: any) => p.id === 'pro');
  const teamPlan = toolInfo.plans.find((p: any) => p.id === 'team');

  if (spend.plan === 'team' && spend.seats <= 2) {
    const projectedSpend = proPlan.price * spend.seats;
    return {
      recommendedPlan: 'pro',
      projectedSpend,
      monthlySavings: spend.monthlySpend - projectedSpend,
      reason: `Claude Team costs $${teamPlan.price}/seat but with only ${spend.seats} seat${spend.seats > 1 ? 's' : ''}, individual Pro plans ($${proPlan.price}/seat) would save $${(teamPlan.price - proPlan.price) * spend.seats}/month while offering the same features.`,
    };
  }

  if (spend.plan === 'team' && spend.seats >= 3 && spend.seats <= 10) {
    return {
      reason: `Claude Team with ${spend.seats} seats provides good value with collaborative features at $${teamPlan.price}/seat.`,
    };
  }

  if (spend.monthlySpend > 0 && spend.monthlySpend < 15 && spend.seats === 1) {
    return {
      reason: `Your current spend of $${spend.monthlySpend}/month suggests light usage. Consider whether you need a paid plan or if the free tier suffices.`,
    };
  }

  return {
    reason: `Your Claude ${currentPlan?.name} plan fits well with your team size of ${spend.seats} seat${spend.seats > 1 ? 's' : ''}.`,
  };
}

function analyzeGitHubCopilot(spend: any, toolInfo: any, teamSize: number): Partial<ToolRecommendation> {
  const currentPlan = toolInfo.plans.find((p: any) => p.id === spend.plan);
  const individualPlan = toolInfo.plans.find((p: any) => p.id === 'individual');
  const businessPlan = toolInfo.plans.find((p: any) => p.id === 'business');
  const enterprisePlan = toolInfo.plans.find((p: any) => p.id === 'enterprise');

  if (spend.plan === 'business' && teamSize <= 3) {
    const projectedSpend = individualPlan.price * spend.seats;
    return {
      recommendedPlan: 'individual',
      projectedSpend,
      monthlySavings: spend.monthlySpend - projectedSpend,
      reason: `GitHub Copilot Business ($${businessPlan.price}/seat) with ${spend.seats} seat${spend.seats > 1 ? 's' : ''} costs more than individual plans ($${individualPlan.price}/seat). For small teams, individual subscriptions save $${(businessPlan.price - individualPlan.price) * spend.seats}/month.`,
    };
  }

  if (spend.plan === 'enterprise' && teamSize <= 20) {
    const projectedSpend = businessPlan.price * spend.seats;
    return {
      recommendedPlan: 'business',
      projectedSpend,
      monthlySavings: spend.monthlySpend - projectedSpend,
      reason: `Copilot Enterprise ($${enterprisePlan.price}/seat) includes advanced features. For ${spend.seats} seats, Business plan at $${businessPlan.price}/seat offers essential features with $${enterprisePlan.price - businessPlan.price}/seat savings.`,
    };
  }

  if (spend.plan === 'business' && teamSize >= 10) {
    return {
      reason: `GitHub Copilot Business with ${spend.seats} seats provides good value. Consider Enterprise for advanced IP protection if needed.`,
    };
  }

  return {
    reason: `Copilot ${currentPlan?.name} plan is suitable for ${spend.seats} seats in a team of ${teamSize}.`,
  };
}

function analyzeGemini(spend: any, toolInfo: any, teamSize: number): Partial<ToolRecommendation> {
  const currentPlan = toolInfo.plans.find((p: any) => p.id === spend.plan);
  const advancedPlan = toolInfo.plans.find((p: any) => p.id === 'advanced');
  const enterprisePlan = toolInfo.plans.find((p: any) => p.id === 'enterprise');

  if (spend.plan === 'enterprise' && spend.seats <= 5) {
    const projectedSpend = advancedPlan.price * spend.seats;
    return {
      recommendedPlan: 'advanced',
      projectedSpend,
      monthlySavings: spend.monthlySpend - projectedSpend,
      reason: `Gemini Enterprise ($${enterprisePlan.price}/seat) for ${spend.seats} seat${spend.seats > 1 ? 's' : ''} exceeds needs. Individual Advanced plans at $${advancedPlan.price}/seat save $${(enterprisePlan.price - advancedPlan.price) * spend.seats}/month.`,
    };
  }

  if (spend.plan === 'enterprise' && spend.seats > 10) {
    return {
      reason: `Gemini Enterprise with ${spend.seats} seats offers enterprise-grade security and compliance features.`,
    };
  }

  return {
    reason: `Gemini ${currentPlan?.name} aligns with your ${spend.seats} seat${spend.seats > 1 ? 's' : ''} usage.`,
  };
}

function analyzeWindsurf(spend: any, toolInfo: any, teamSize: number): Partial<ToolRecommendation> {
  const currentPlan = toolInfo.plans.find((p: any) => p.id === spend.plan);
  const proPlan = toolInfo.plans.find((p: any) => p.id === 'pro');
  const teamPlan = toolInfo.plans.find((p: any) => p.id === 'team');

  if (spend.plan === 'team' && spend.seats <= 2) {
    const projectedSpend = proPlan.price * spend.seats;
    return {
      recommendedPlan: 'pro',
      projectedSpend,
      monthlySavings: spend.monthlySpend - projectedSpend,
      reason: `Windsurf Team ($${teamPlan.price}/seat) with ${spend.seats} seat${spend.seats > 1 ? 's' : ''} is costlier than Pro ($${proPlan.price}/seat). Switching saves $${(teamPlan.price - proPlan.price) * spend.seats}/month.`,
    };
  }

  if (spend.plan === 'team' && spend.seats >= 3 && spend.seats <= 10) {
    return {
      reason: `Windsurf Team provides collaborative features for ${spend.seats} seats at a competitive $${teamPlan.price}/seat.`,
    };
  }

  return {
    reason: `Windsurf ${currentPlan?.name} is suitable for ${spend.seats} seat${spend.seats > 1 ? 's' : ''}.`,
  };
}

function analyzeAPI(tool: AITool, spend: any, toolInfo: any, teamSize: number): Partial<ToolRecommendation> {
  const currentPlan = toolInfo.plans.find((p: any) => p.id === spend.plan);
  const toolName = toolLabels[tool];

  if (spend.plan === 'committed' && spend.monthlySpend < 500) {
    const projectedSpend = 0;
    return {
      recommendedPlan: 'pay_as_you_go',
      projectedSpend,
      monthlySavings: spend.monthlySpend - projectedSpend,
      reason: `${toolName} committed plan at $${spend.monthlySpend}/month may not be optimal. Pay-as-you-go pricing could be more cost-effective for your usage level, especially if usage varies month to month.`,
    };
  }

  if (spend.plan === 'pay_as_you_go' && spend.monthlySpend > 300) {
    return {
      reason: `High ${toolName} API usage detected ($${spend.monthlySpend}/month). A committed use plan might offer better rates. Contact provider for volume discounts.`,
    };
  }

  if (spend.monthlySpend === 0) {
    return {
      reason: `Using ${toolName} API pay-as-you-go with minimal or no current charges - optimal for testing and development.`,
    };
  }

  return {
    reason: `${toolName} API ${currentPlan?.name} plan with current usage of $${spend.monthlySpend}/month is appropriate.`,
  };
}

export function generateAudit(formData: AuditFormData): AuditResult {
  const recommendations: ToolRecommendation[] = [];
  let totalCurrentSpend = 0;
  let totalProjectedSpend = 0;
  let needsConsultation = false;

  formData.toolSpends.forEach((spend) => {
    const toolInfo = toolPricing.find((t) => t.id === spend.tool);
    if (!toolInfo) return;

    const currentMonthlySpend = spend.monthlySpend;
    totalCurrentSpend += currentMonthlySpend;

    let recommendation: ToolRecommendation = {
      tool: spend.tool,
      currentSpend: currentMonthlySpend,
      recommendedPlan: spend.plan,
      projectedSpend: currentMonthlySpend,
      monthlySavings: 0,
      reason: '',
    };

    let analysis: Partial<ToolRecommendation> = {};

    switch (spend.tool) {
      case 'cursor':
        analysis = analyzeCursor(spend, toolInfo, formData.teamSize);
        break;
      case 'chatgpt':
        analysis = analyzeChatGPT(spend, toolInfo, formData.teamSize);
        break;
      case 'claude':
        analysis = analyzeClaude(spend, toolInfo, formData.teamSize);
        break;
      case 'github_copilot':
        analysis = analyzeGitHubCopilot(spend, toolInfo, formData.teamSize);
        break;
      case 'gemini':
        analysis = analyzeGemini(spend, toolInfo, formData.teamSize);
        break;
      case 'windsurf':
        analysis = analyzeWindsurf(spend, toolInfo, formData.teamSize);
        break;
      case 'anthropic_api':
      case 'openai_api':
        analysis = analyzeAPI(spend.tool, spend, toolInfo, formData.teamSize);
        break;
    }

    recommendation = { ...recommendation, ...analysis };

    if (spend.monthlySpend > 500) {
      needsConsultation = true;
    }

    totalProjectedSpend += recommendation.projectedSpend;
    recommendations.push(recommendation);
  });

  const totalMonthlySavings = totalCurrentSpend - totalProjectedSpend;
  const isEfficient = totalMonthlySavings < 50 && !needsConsultation;

  return {
    totalMonthlySpend: totalCurrentSpend,
    totalAnnualSpend: totalCurrentSpend * 12,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    recommendations,
    needsConsultation,
    isEfficient,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getToolName(tool: AITool): string {
  return toolLabels[tool] || tool;
}

export function getPlanName(tool: AITool, planId: string): string {
  const toolInfo = toolPricing.find((t) => t.id === tool);
  const plan = toolInfo?.plans.find((p) => p.id === planId);
  return plan?.name || planId;
}

export function getSavingsPercentage(saved: number, current: number): number {
  if (current === 0) return 0;
  return Math.round((saved / current) * 100);
}
