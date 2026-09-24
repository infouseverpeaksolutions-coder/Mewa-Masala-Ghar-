import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import api from '../services/api';
import { SEOHead } from '../components/SEOHead';

export const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });

      if (res.data?.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Password reset link is invalid or has expired. Please request a new one.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-[#FAF6EC]">
      <SEOHead title="Set New Password" description="Create a new password for your Mewa Masala Ghar account." />
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E7E0D0] shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block mb-3 transition-transform hover:scale-102">
            <img src="/logo.png" alt="Mewa Masala Ghar" className="h-14 w-auto mx-auto drop-shadow-xs" />
          </Link>
          <div className="w-12 h-12 bg-[#FAF6EC] border border-[#E7E0D0] rounded-2xl flex items-center justify-center mx-auto mb-2 text-[#2F5D3A]">
            <KeyRound className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D9A441] block">Security Verification</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">Set New Password</h1>
          <p className="text-xs text-gray-500">
            Please enter and confirm your new secure password.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-[#2F5D3A] rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-900">Password Reset Successful!</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your password has been securely updated. You can now log in using your new credentials.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3.5 px-6 rounded-full bg-[#2F5D3A] hover:bg-[#1F4D2E] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                New Password (min 6 characters)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF6EC]/40 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white transition-all min-h-[44px]"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF6EC]/40 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white transition-all min-h-[44px]"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-[#2F5D3A] hover:bg-[#1F4D2E] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98 min-h-[44px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Reset & Save Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
