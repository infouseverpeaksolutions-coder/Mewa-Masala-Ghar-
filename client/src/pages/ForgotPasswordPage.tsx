import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, Loader2, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import api from '../services/api';
import { SEOHead } from '../components/SEOHead';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [devToken, setDevToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setDevToken(null);

    try {
      const res = await api.post('/auth/forgot-password', { email: email.trim() });
      if (res.data?.success) {
        setSuccessMessage(res.data.message || 'Password reset link has been dispatched to your email.');
        if (res.data.token) {
          setDevToken(res.data.token);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to process reset request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-[#FAF6EC]">
      <SEOHead title="Forgot Password" description="Reset your password for Mewa Masala Ghar." />
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E7E0D0] shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block mb-3 transition-transform hover:scale-102">
            <img src="/logo.png" alt="Mewa Masala Ghar" className="h-14 w-auto mx-auto drop-shadow-xs" />
          </Link>
          <div className="w-12 h-12 bg-[#FAF6EC] border border-[#E7E0D0] rounded-2xl flex items-center justify-center mx-auto mb-2 text-[#2F5D3A]">
            <KeyRound className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D9A441] block">Account Recovery</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Enter your registered email address and we'll send you an encrypted password reset link.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold mb-1">Check Your Inbox</strong>
                <p className="leading-relaxed">{successMessage}</p>
              </div>
            </div>

            {devToken && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-2">
                <p className="font-semibold">Development Testing Link:</p>
                <Link
                  to={`/reset-password/${devToken}`}
                  className="block text-[#2F5D3A] font-bold hover:underline break-all"
                >
                  Click here to Reset Password directly &rarr;
                </Link>
              </div>
            )}

            <Link
              to="/login"
              className="w-full py-3.5 px-4 rounded-full bg-[#2F5D3A] hover:bg-[#1F4D2E] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Registered Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF6EC]/40 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white transition-all min-h-[44px]"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-full bg-[#2F5D3A] hover:bg-[#1F4D2E] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98 min-h-[44px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Reset Link...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-xs text-gray-600 hover:text-[#2F5D3A] font-semibold inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
