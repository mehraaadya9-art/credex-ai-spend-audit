import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowRight, Sparkles, Users, Target, Shield, BarChart3 } from 'lucide-react';
import { AuditFormData, ToolSpend, AITool, UseCase } from '../types';
import { toolPricing, useCaseLabels } from '../data/plans';

const STORAGE_KEY = 'ai-spend-audit-form';

const defaultToolSpend: ToolSpend = {
  tool: 'cursor',
  plan: 'pro',
  monthlySpend: 20,
  seats: 1,
};

export default function SpendInputPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AuditFormData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          toolSpends: [{ ...defaultToolSpend }],
          teamSize: 1,
          primaryUseCase: 'mixed',
        };
      }
    }
    return {
      toolSpends: [{ ...defaultToolSpend }],
      teamSize: 1,
      primaryUseCase: 'mixed',
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleAddTool = () => {
    setFormData((prev) => ({
      ...prev,
      toolSpends: [...prev.toolSpends, { ...defaultToolSpend }],
    }));
  };

  const handleRemoveTool = (index: number) => {
    if (formData.toolSpends.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      toolSpends: prev.toolSpends.filter((_, i) => i !== index),
    }));
  };

  const handleToolChange = (index: number, field: keyof ToolSpend, value: string | number) => {
    setFormData((prev) => {
      const newSpends = [...prev.toolSpends];
      newSpends[index] = { ...newSpends[index], [field]: value };

      if (field === 'tool') {
        const toolInfo = toolPricing.find((t) => t.id === value);
        if (toolInfo && toolInfo.plans.length > 0) {
          newSpends[index].plan = toolInfo.plans[toolInfo.plans.length - 1].id;
          newSpends[index].monthlySpend = toolInfo.plans[toolInfo.plans.length - 1].price;
        }
      }

      if (field === 'plan') {
        const toolInfo = toolPricing.find((t) => t.id === newSpends[index].tool);
        const planInfo = toolInfo?.plans.find((p) => p.id === value);
        if (planInfo) {
          newSpends[index].monthlySpend = planInfo.price * newSpends[index].seats;
        }
      }

      if (field === 'seats') {
        const toolInfo = toolPricing.find((t) => t.id === newSpends[index].tool);
        const planInfo = toolInfo?.plans.find((p) => p.id === newSpends[index].plan);
        if (planInfo) {
          newSpends[index].monthlySpend = planInfo.price * (value as number);
        }
      }

      return { ...prev, toolSpends: newSpends };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultData = {
      formData,
      auditResult: null,
    };
    sessionStorage.setItem('audit-result-data', JSON.stringify(resultData));
    navigate('/audit-results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Sparkles className="h-6 w-6 text-white" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  AI Spend Audit
                </h1>
                <p className="text-sm text-slate-500 hidden sm:block">Optimize your AI tool investments</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                <span className="text-sm text-slate-600 font-medium">Step 1 of 3</span>
                <div className="flex gap-1.5 ml-2">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-sm shadow-blue-500/50"></div>
                  <div className="h-2 w-2 rounded-full bg-slate-300"></div>
                  <div className="h-2 w-2 rounded-full bg-slate-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-4">
              <Shield className="h-4 w-4" />
              Free Analysis Tool
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              Analyze Your AI Spending
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Get personalized recommendations to reduce costs and optimize your AI tool investments in just 2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">Instant Analysis</div>
                <div className="text-sm text-slate-500">Get results in seconds</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
              <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">100% Secure</div>
                <div className="text-sm text-slate-500">Your data stays private</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
              <div className="h-10 w-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">AI-Powered</div>
                <div className="text-sm text-slate-500">Smart recommendations</div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 px-6 py-5 sm:px-8 sm:py-6">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-white">Configure Your AI Tools</h2>
                  <p className="text-blue-100 text-sm mt-1">Add all AI tools your team currently uses</p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8 space-y-5">
              {formData.toolSpends.map((spend, index) => {
                const toolInfo = toolPricing.find((t) => t.id === spend.tool);
                const selectedPlan = toolInfo?.plans.find((p) => p.id === spend.plan);

                return (
                  <div key={index} className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-slate-800 mb-2">AI Tool</label>
                        <select
                          value={spend.tool}
                          onChange={(e) => handleToolChange(index, 'tool', e.target.value as AITool)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium shadow-sm"
                        >
                          {toolPricing.map((tool) => (
                            <option key={tool.id} value={tool.id}>
                              {tool.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {formData.toolSpends.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTool(index)}
                          className="ml-4 p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    {toolInfo && (
                      <div className="flex items-center gap-2 mb-5 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                        <p className="text-sm text-blue-900 font-medium">{toolInfo.description}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Plan</label>
                        <select
                          value={spend.plan}
                          onChange={(e) => handleToolChange(index, 'plan', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium shadow-sm"
                        >
                          {toolInfo?.plans.map((plan) => (
                            <option key={plan.id} value={plan.id}>
                              {plan.name} ({plan.price > 0 ? `$${plan.price}/mo` : 'Free'})
                            </option>
                          ))}
                        </select>
                        {selectedPlan && (
                          <p className="text-xs text-slate-600 mt-2 font-medium">
                            {selectedPlan.type.charAt(0).toUpperCase() + selectedPlan.type.slice(1)} plan
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Seats</label>
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={spend.seats}
                          onChange={(e) => handleToolChange(index, 'seats', parseInt(e.target.value) || 1)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Monthly Spend</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-semibold">$</span>
                          <input
                            type="number"
                            min="0"
                            max="100000"
                            value={spend.monthlySpend}
                            onChange={(e) => handleToolChange(index, 'monthlySpend', parseFloat(e.target.value) || 0)}
                            className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={handleAddTool}
                className="group w-full py-4 px-6 border-2 border-dashed border-slate-300 rounded-2xl text-slate-600 hover:border-blue-400 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all flex items-center justify-center gap-2 font-semibold"
              >
                <Plus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Add Another Tool
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 px-6 py-5 sm:px-8 sm:py-6">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-white">Team Details</h2>
                  <p className="text-cyan-100 text-sm mt-1">Help us understand your team's context</p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-800 mb-2">Team Size</label>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={formData.teamSize}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          teamSize: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-semibold shadow-sm"
                    />
                    <p className="text-xs text-slate-600 mt-2">Total number of team members</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-teal-50 to-white rounded-2xl border border-teal-100">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/25">
                    <Target className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-800 mb-2">Primary Use Case</label>
                    <select
                      value={formData.primaryUseCase}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          primaryUseCase: e.target.value as UseCase,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-semibold shadow-sm"
                    >
                      {Object.entries(useCaseLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-600 mt-2">What you primarily use AI tools for</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 pt-6">
            <button
              type="submit"
              className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all flex items-center gap-3 text-lg hover:-translate-y-0.5"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></span>
              <span className="relative flex items-center gap-3">
                Generate Audit
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Your data is encrypted and never shared
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
