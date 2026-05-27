import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  DollarSign,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  BarChart3,
  PiggyBank,
  Zap,
  ChevronRight,
  FileText,
  Loader2,
} from 'lucide-react';
import { AuditFormData, AuditResult } from '../types';
import { generateAudit, formatCurrency, getToolName, getPlanName, getSavingsPercentage } from '../utils/auditLogic';
import { toolPricing } from '../data/plans';

interface ResultData {
  formData: AuditFormData;
  auditResult: AuditResult | null;
}

export default function AuditResultsPage() {
  const navigate = useNavigate();
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem('audit-result-data');
    if (!saved) {
      navigate('/', { replace: true });
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      setResultData(parsed);

      const result = generateAudit(parsed.formData);
      setAuditResult(result);

      parsed.auditResult = result;
      sessionStorage.setItem('audit-result-data', JSON.stringify(parsed));

      // Generate AI summary (placeholder for now)
      generateAISummary(result);
    } catch {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const generateAISummary = async (result: AuditResult) => {
    setIsGeneratingSummary(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Fallback summary when API unavailable
    const fallbackSummary = generateFallbackSummary(result);
    setAiSummary(fallbackSummary);
    setIsGeneratingSummary(false);
  };

  const generateFallbackSummary = (result: AuditResult): string => {
    const toolCount = result.recommendations.length;
    const savingsToolsCount = result.recommendations.filter(r => r.monthlySavings > 0).length;

    if (result.totalMonthlySavings > 0) {
      return `Based on your audit results, you're currently spending ${formatCurrency(result.totalMonthlySpend)}/month on ${toolCount} AI tool${toolCount > 1 ? 's' : ''}. We identified ${savingsToolsCount} optimization opportunit${savingsToolsCount !== 1 ? 'ies' : 'y'} that could save you ${formatCurrency(result.totalMonthlySavings)}/month (${formatCurrency(result.totalAnnualSavings)}/year). The primary opportunity involves right-sizing your team plans to match actual seat usage, potentially reducing costs by up to ${Math.round((result.totalMonthlySavings / result.totalMonthlySpend) * 100)}% while maintaining the same functionality. Consider implementing these changes to optimize your AI tool spend.`;
    } else {
      return `Great news! Your current AI spending of ${formatCurrency(result.totalMonthlySpend)}/month across ${toolCount} tool${toolCount > 1 ? 's' : ''} is already well-optimized. Your plan selections align appropriately with your team size and usage patterns. No immediate changes are recommended, but we suggest reviewing your usage quarterly to ensure continued optimization as your team scales.`;
    }
  };

  if (!auditResult || !resultData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-blue-600 mx-auto animate-pulse" />
          <p className="mt-4 text-slate-600">Generating your audit...</p>
        </div>
      </div>
    );
  }

  const handleGetFullReport = () => {
    navigate('/email-capture');
  };

  const savingsPercentage = auditResult.totalMonthlySpend > 0
    ? ((auditResult.totalMonthlySavings / auditResult.totalMonthlySpend) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors group"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600 group-hover:text-slate-900" />
              </button>
              <div className="h-11 w-11 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Audit Results</h1>
                <p className="text-sm text-slate-500 hidden sm:block">Your personalized savings analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-4 py-2 rounded-full">
                <span>Step 2 of 3</span>
                <div className="flex gap-1.5 ml-2">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <div className="h-2 w-2 rounded-full bg-slate-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-full text-emerald-700 text-sm font-medium mb-4">
              <PiggyBank className="h-4 w-4" />
              Analysis Complete
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              {auditResult.totalMonthlySavings > 0
                ? `Save ${formatCurrency(auditResult.totalAnnualSavings)} per year`
                : 'Your spending is optimized'}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {auditResult.totalMonthlySavings > 0
                ? 'We found opportunities to reduce your AI tool expenses while maintaining productivity.'
                : 'Your current AI tool configuration is well-aligned with your team size and usage patterns.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-slate-600" />
                  </div>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Current</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {formatCurrency(auditResult.totalMonthlySpend)}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>{formatCurrency(auditResult.totalAnnualSpend)}/year</span>
                </div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <TrendingDown className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
                    <Zap className="h-3.5 w-3.5 text-white" />
                    <span className="text-xs font-medium text-white">{savingsPercentage}% saved</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {formatCurrency(auditResult.totalMonthlySavings)}
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-100">
                  <span>{formatCurrency(auditResult.totalAnnualSavings)}/year potential</span>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">Optimized</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {formatCurrency(auditResult.totalMonthlySpend - auditResult.totalMonthlySavings)}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>Recommended monthly spend</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {(auditResult.needsConsultation || auditResult.isEfficient) && (
          <div className="mb-8">
            {auditResult.needsConsultation && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/25">
                  <AlertCircle className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 text-lg mb-2">Enterprise Consultation Recommended</h3>
                  <p className="text-amber-700 leading-relaxed">
                    Your total spend exceeds $200/month. Our enterprise optimization experts at Credex can conduct
                    a comprehensive analysis and create a custom strategy to maximize your ROI on AI investments.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-amber-800 text-sm font-medium">
                    <span>Priority: High</span>
                    <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
                    <span>Response within 24 hours</span>
                  </div>
                </div>
              </div>
            )}
            {auditResult.isEfficient && !auditResult.needsConsultation && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/25">
                  <CheckCircle2 className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 text-lg mb-2">Spending is Already Efficient</h3>
                  <p className="text-green-700 leading-relaxed">
                    Your current AI spending is well-optimized. Potential savings are under $100/month,
                    indicating your tool selections align well with your team size and usage patterns.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-green-800 text-sm font-medium">
                    <span>Status: Optimal</span>
                    <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                    <span>No action required</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Summary Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-blue-200 overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 px-6 py-5 sm:px-8 sm:py-6">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                {isGeneratingSummary ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <Sparkles className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white">AI-Generated Summary</h2>
                <p className="text-blue-100 text-sm mt-1">
                  {isGeneratingSummary ? 'Analyzing your audit data...' : 'Key insights and recommendations'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {isGeneratingSummary ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-600 font-medium">Generating personalized insights...</p>
                <p className="text-sm text-slate-500 mt-2">This may take a moment</p>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-700 text-base leading-relaxed">{aiSummary}</p>
                  <div className="mt-6 pt-5 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Sparkles className="h-4 w-4" />
                      <span>AI-generated summary based on your audit data</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-6 sm:px-8 sm:py-7">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white">Tool-by-Tool Recommendations</h2>
                <p className="text-slate-300 text-sm mt-1">Detailed analysis with specific savings opportunities</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {auditResult.recommendations.map((rec, index) => {
              const toolInfo = toolPricing.find((t) => t.id === rec.tool);
              const hasSavings = rec.monthlySavings > 0;
              const savingsPercent = getSavingsPercentage(rec.monthlySavings, rec.currentSpend);

              return (
                <div key={index} className="p-6 sm:p-8 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white transition-all">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                          <BarChart3 className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 mb-1">{getToolName(rec.tool)}</h3>
                          <p className="text-sm text-slate-600">{toolInfo?.description}</p>
                        </div>
                      </div>

                      {hasSavings && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25">
                          <TrendingDown className="h-5 w-5" />
                          <span>Save {formatCurrency(rec.monthlySavings)}/mo</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Current Plan</div>
                        <div className="text-lg font-bold text-slate-900 mb-1">{getPlanName(rec.tool, rec.recommendedPlan === rec.plan ? rec.plan : rec.plan)}</div>
                        <div className="text-2xl font-black text-slate-700">{formatCurrency(rec.currentSpend)}</div>
                        <div className="text-xs text-slate-500 mt-1">per month</div>
                      </div>

                      {hasSavings && (
                        <>
                          <div className="relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg z-10">
                              <ChevronRight className="h-6 w-6 text-white" />
                            </div>
                          </div>

                          <div className="p-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg shadow-emerald-500/25">
                            <div className="text-xs font-semibold text-emerald-100 uppercase tracking-wider mb-2">Recommended</div>
                            <div className="text-lg font-bold text-white mb-1">{getPlanName(rec.tool, rec.recommendedPlan)}</div>
                            <div className="text-2xl font-black text-white">{formatCurrency(rec.projectedSpend)}</div>
                            <div className="text-xs text-emerald-100 mt-1">per month</div>
                            {savingsPercent > 0 && (
                              <div className="mt-3 pt-3 border-t border-emerald-400/30">
                                <div className="text-sm font-bold text-white">{savingsPercent}% savings</div>
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {!hasSavings && (
                        <div className="sm:col-span-2 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-900 uppercase tracking-wider">Well Optimized</span>
                          </div>
                          <p className="text-sm text-blue-700">Your current plan is cost-effective for your usage</p>
                        </div>
                      )}
                    </div>

                    {rec.reason && (
                      <div className="flex items-start gap-3 p-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md">
                          <Lightbulb className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-amber-900 leading-relaxed">{rec.reason}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 pb-8">
          <button
            onClick={handleGetFullReport}
            className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center gap-3 text-lg hover:-translate-y-0.5"
          >
            Get Full Report
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-sm text-slate-500">We'll send a detailed PDF report to your email</p>
        </div>
      </main>
    </div>
  );
}
