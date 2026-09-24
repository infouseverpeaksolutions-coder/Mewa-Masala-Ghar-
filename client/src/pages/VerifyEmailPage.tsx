import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowRight, Loader2, MailCheck } from 'lucide-react';
import api from '../services/api';
import { SEOHead } from '../components/SEOHead';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setErrorMessage('No verification token provided in URL.');
      return;
    }

    const verify = async () => {
      try {
        const res = await api.post('/auth/verify-email', { token });
        if (res.data?.success) {
          setSuccess(true);
        } else {
          setErrorMessage(res.data?.message || 'Verification failed. The token may be expired.');
        }
      } catch (err: any) {
        setErrorMessage(err.response?.data?.message || 'Verification token is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-[#FAF6EC]">
      <SEOHead title="Email Verification" />
      <div className="max-w-md w-full text-center p-8 bg-white rounded-3xl border border-[#E7E0D0] shadow-sm">
        <Link to="/" className="inline-block mb-4 transition-transform hover:scale-102">
          <img src="/logo.png" alt="Mewa Masala Ghar" className="h-14 w-auto mx-auto drop-shadow-xs" />
        </Link>
        {loading ? (
          <div className="py-12 space-y-4">
            <Loader2 className="w-12 h-12 text-[#2F5D3A] animate-spin mx-auto" />
            <h2 className="text-xl font-serif font-bold text-[#183B23]">Verifying your email...</h2>
            <p className="text-sm text-zinc-500">Please wait while we confirm your account security.</p>
          </div>
        ) : success ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-[#2F5D3A] rounded-2xl flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#183B23]">Email Verified Successfully!</h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Your Mewa Masala Ghar account is fully activated. You can now access special member benefits, faster checkout, and loyalty points.
            </p>
            <div className="pt-4 flex flex-col gap-3">
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#2F5D3A] text-white rounded-xl text-sm font-semibold hover:bg-[#24492D] transition shadow-xs"
              >
                Sign In to Your Account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/"
                className="text-xs text-[#9E6F18] font-medium hover:underline"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-rose-900">Verification Link Expired</h2>
            <p className="text-zinc-600 text-sm leading-relaxed">{errorMessage}</p>
            <div className="pt-4 flex flex-col gap-3">
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#2F5D3A] text-white rounded-xl text-sm font-semibold hover:bg-[#24492D] transition"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
