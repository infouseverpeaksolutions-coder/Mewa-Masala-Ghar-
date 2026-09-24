import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';
import { SEOHead } from '../components/SEOHead';
import api from '../services/api';

export const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const { success: toastSuccess } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Redirect path
  const from = (location.state as any)?.from?.pathname || searchParams.get('redirect') || '/account';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/login', {
        identifier: identifier.trim(),
        password,
      });

      if (res.data?.success) {
        login(res.data.data.accessToken, res.data.data.user);
        toastSuccess(`Welcome back, ${res.data.data.user.name.split(' ')[0]}!`);
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          (err.response?.data?.errors ? err.response.data.errors[0]?.message : 'Invalid credentials. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#FAF6EC]">
      <SEOHead title="Sign In" description="Sign in to your Mewa Masala Ghar account." />
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-[#E7E0D0] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Column: Brand Hero Showcase */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-[#183B23] via-[#2F5D3A] to-[#122E1B] text-white relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-[#D9A441]/15 blur-2xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <Link to="/" className="inline-block transition-transform hover:scale-102">
              <img src="/logo.png" alt="Mewa Masala Ghar" className="h-16 w-auto drop-shadow-md" />
            </Link>
            <div className="w-12 h-0.5 bg-[#D9A441]" />
            <h2 className="text-2xl font-serif font-bold text-white leading-snug">
              Pure Indian Goodness, Rooted in Tradition.
            </h2>
            <p className="text-xs text-white/80 leading-relaxed font-light">
              Sign in to manage your orders, track shipments in real-time, save your favourite items, and enjoy member-only discounts.
            </p>
          </div>

          <div className="space-y-3 relative z-10 pt-8 border-t border-white/15 text-xs text-white/90">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#D9A441]/20 flex items-center justify-center text-[#D9A441]">
                <Check className="w-3 h-3" />
              </div>
              <span>FSSAI Certified: 10021051000123</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#D9A441]/20 flex items-center justify-center text-[#D9A441]">
                <Check className="w-3 h-3" />
              </div>
              <span>Zero Artificial Preservatives or Dyes</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#D9A441]/20 flex items-center justify-center text-[#D9A441]">
                <Check className="w-3 h-3" />
              </div>
              <span>Free Delivery across India on ₹499+</span>
            </div>
          </div>
        </div>

        {/* Right Column: Sign In Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center space-y-6">
          <div>
            <div className="md:hidden mb-4">
              <Link to="/">
                <img src="/logo.png" alt="Mewa Masala Ghar" className="h-12 w-auto" />
              </Link>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#D9A441] block mb-1">
              Welcome Back
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#183B23]">
              Sign In
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Enter your email or phone number to access your account
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Email Address or 10-Digit Mobile
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@example.com or 9820012345"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white transition-all text-zinc-800 placeholder-zinc-400"
                />
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#9E6F18] hover:underline font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white transition-all text-zinc-800 placeholder-zinc-400"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#2F5D3A] focus:ring-[#2F5D3A] h-4 w-4"
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#2F5D3A] hover:bg-[#24492D] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-3 border-t border-zinc-100 text-xs text-zinc-600">
            Don't have an account yet?{' '}
            <Link
              to={`/signup${from !== '/account' ? `?redirect=${encodeURIComponent(from)}` : ''}`}
              className="font-bold text-[#2F5D3A] hover:underline"
            >
              Create an Account
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure 256-bit encrypted authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};
