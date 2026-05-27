import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle,
  Loader2,
  Mail,
  Sparkles,
  User,
  Users,
  Shield,
  Briefcase,
  PartyPopper,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AuditRecord, AuditSubmissionData } from '../types';

export default function EmailCapturePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    companyName: '',
    role: '',
    teamSize: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.companyName || !formData.role || formData.teamSize < 1) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const savedData = sessionStorage.getItem('audit-result-data');
      let auditData: AuditSubmissionData;

      if (savedData) {
        auditData = JSON.parse(savedData);
      } else {
        navigate('/', { replace: true });
        return;
      }

      const auditRecord: AuditRecord = {
        email: formData.email,
        companyName: formData.companyName,
        role: formData.role,
        teamSize: formData.teamSize,
        auditData,
      };

      const { error: dbError } = await supabase.from('audits').insert({
        email: auditRecord.email,
        company_name: auditRecord.companyName,
        role: auditRecord.role,
        team_size: auditRecord.teamSize,
        audit_data: auditRecord.auditData,
      });

      if (dbError) {
        if (dbError.code === '23505') {
          setError('This email has already submitted an audit');
        } else {
          setError('Failed to submit. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      sessionStorage.removeItem('audit-result-data');
    } catch (err) {
      setError('An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center px-4">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 sm:p-12 text-center">
            <div className="relative inline-block mb-8">
              <div className="h-24 w-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 h-12 w-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <PartyPopper className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent mb-4">
              Audit Received Successfully!
            </h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Thank you for completing the AI Spend Audit. Our expert team will review your submission and reach out
              soon with a detailed optimization strategy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                Start New Audit
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/audit-results')}
                className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors group"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600 group-hover:text-slate-900" />
              </button>
              <div className="relative h-12 w-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Sparkles className="h-6 w-6 text-white" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Get Full Report
                </h1>
                <p className="text-sm text-slate-500 hidden sm:block">We'll send your detailed audit report</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                <span className="text-sm text-slate-600 font-medium">Step 3 of 3</span>
                <div className="flex gap-1.5 ml-2">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-sm shadow-blue-500/50"></div>
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-sm shadow-blue-500/50"></div>
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-sm shadow-blue-500/50"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-4">
              <Briefcase className="h-4 w-4" />
              Final Step
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              Complete Your Audit Request
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Enter your details below and we'll send a comprehensive PDF report with personalized recommendations.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 px-6 py-5 sm:px-8 sm:py-6">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white">Your Information</h2>
                <p className="text-blue-100 text-sm mt-1">Complete your audit to receive the full report</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6">
            <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                <Mail className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-800 mb-2">Work Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  placeholder="you@company.com"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-cyan-50 to-white rounded-2xl border border-cyan-100">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/25">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-800 mb-2">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      companyName: e.target.value,
                    })
                  }
                  placeholder="Acme Inc."
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-100">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/25">
                <User className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-800 mb-2">Your Role</label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium shadow-sm"
                >
                  <option value="">Select your role</option>
                  <option value="ceo">CEO / Founder</option>
                  <option value="cto">CTO / VP of Engineering</option>
                  <option value="engineering_manager">Engineering Manager</option>
                  <option value="developer">Software Developer</option>
                  <option value="product_manager">Product Manager</option>
                  <option value="finance">Finance / Operations</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-teal-50 to-white rounded-2xl border border-teal-100">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/25">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-800 mb-2">Team Size</label>
                <select
                  required
                  value={formData.teamSize}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      teamSize: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium shadow-sm"
                >
                  <option value="1">1-5 people</option>
                  <option value="6">6-20 people</option>
                  <option value="21">21-50 people</option>
                  <option value="51">51-100 people</option>
                  <option value="101">101-500 people</option>
                  <option value="501">500+ people</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ArrowLeft className="h-5 w-5 text-red-600 rotate-180" />
                </div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full py-5 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-3 text-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></span>
                <span className="relative flex items-center gap-3">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Complete Audit
                      <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Your data is encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Never shared with third parties</span>
          </div>
        </div>
      </main>
    </div>
  );
}
