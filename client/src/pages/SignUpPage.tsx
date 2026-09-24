import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, User, Phone, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';
import { SEOHead } from '../components/SEOHead';
import api from '../services/api';

export const SignUpPage: React.FC = () => {
  const { login, user } = useAuth();
  const { success: toastSuccess } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, redirectPath]);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!termsAccepted) {
      setError('Please accept the Terms of Service & Privacy Policy to create your account.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() ? phone.trim() : undefined,
        password,
      });

      if (res.data?.success) {
        login(res.data.data.accessToken, res.data.data.user);
        toastSuccess('Account created successfully! Please check your email for activation.');
        navigate(redirectPath, { replace: true });
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          (err.response?.data?.errors ? err.response.data.errors[0]?.message : 'Registration failed. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#FAF6EC]">
      <SEOHead title="Create an Account" description="Join Mewa Masala Ghar to get premium dry fruits, spices, and nutrition delivered to your doorstep." />
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-[#E7E0D0] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Column: Brand Hero */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-[#183B23] via-[#2F5D3A] to-[#122E1B] text-white relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-[#D9A441]/15 blur-2xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <Link to="/" className="inline-block transition-transform hover:scale-102">
              <img src="/logo.png" alt="Mewa Masala Ghar" className="h-16 w-auto drop-shadow-md" />
            </Link>
            <div className="w-12 h-0.5 bg-[#D9A441]" />
            <h2 className="text-2xl font-serif font-bold text-white leading-snug">
              Begin Your Journey to Natural Health & Wellness.
            </h2>
            <p className="text-xs text-white/80 leading-relaxed font-light">
              Create an account to unlock verified customer reviews, fast 1-click reorders, saved shipping addresses, and exclusive member discounts.
            </p>
          </div>

          <div className="space-y-3 relative z-10 pt-8 border-t border-white/15 text-xs text-white/90">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#D9A441]/20 flex items-center justify-center text-[#D9A441]">
                <Check className="w-3 h-3" />
              </div>
              <span>Authentic Stone-Ground High-Curcumin Spices</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#D9A441]/20 flex items-center justify-center text-[#D9A441]">
                <Check className="w-3 h-3" />
              </div>
              <span>Ayurvedic Pediatric-Tested Baby Porridges</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#D9A441]/20 flex items-center justify-center text-[#D9A441]">
                <Check className="w-3 h-3" />
              </div>
              <span>Export Grade Multani Mitti & Pure Clays</span>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center space-y-5">
          <div>
            <div className="md:hidden mb-4">
              <Link to="/">
                <img src="/logo.png" alt="Mewa Masala Ghar" className="h-12 w-auto" />
              </Link>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#D9A441] block mb-1">
              New Customer
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#183B23]">
              Create Account
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Fill in your details to register in less than a minute
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Priya Sharma"
                  className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white transition-all text-zinc-800 placeholder-zinc-400"
                />
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priya@example.com"
                    className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white transition-all text-zinc-800 placeholder-zinc-400"
                  />
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9820012345"
                    className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white transition-all text-zinc-800 placeholder-zinc-400"
                  />
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-10 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white transition-all text-zinc-800 placeholder-zinc-400"
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

              {/* Password strength hint */}
              {password.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className="flex-1 grid grid-cols-4 gap-1 h-1">
                    <div className={`rounded-full ${strength >= 1 ? 'bg-rose-500' : 'bg-zinc-200'}`} />
                    <div className={`rounded-full ${strength >= 2 ? 'bg-amber-500' : 'bg-zinc-200'}`} />
                    <div className={`rounded-full ${strength >= 3 ? 'bg-emerald-500' : 'bg-zinc-200'}`} />
                    <div className={`rounded-full ${strength >= 4 ? 'bg-emerald-600' : 'bg-zinc-200'}`} />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    {strength <= 1 ? 'Weak' : strength <= 3 ? 'Moderate' : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white transition-all text-zinc-800 placeholder-zinc-400"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="rounded text-[#2F5D3A] focus:ring-[#2F5D3A] h-4 w-4 mt-0.5"
              />
              <span className="text-xs text-zinc-600 leading-snug">
                I agree to the{' '}
                <Link to="/terms" target="_blank" className="text-[#9E6F18] font-medium hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy-policy" target="_blank" className="text-[#9E6F18] font-medium hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2F5D3A] hover:bg-[#24492D] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-zinc-100 text-xs text-zinc-600">
            Already have an account?{' '}
            <Link
              to={`/login${redirectPath !== '/account' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
              className="font-bold text-[#2F5D3A] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
