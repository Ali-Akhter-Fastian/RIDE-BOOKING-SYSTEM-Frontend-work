import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { ROUTES } from '../../routes/routeConfig';
import { authApi } from '../../api/authApi';

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState((location.state as { phone?: string } | null)?.phone ?? '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authApi.verifyOtp({ phone, otp });
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (caughtError: unknown) {
      const message = (caughtError as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? 'OTP verification failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="One-time code"
      title="Verify your account"
      description="Complete the sign-up flow by confirming the OTP from your authentication service."
    >
      <div>
        <div className="text-sm uppercase tracking-[0.24em] text-[#94A3B8]">Verify OTP</div>
        <h2 className="mt-2 text-2xl font-semibold text-white">Confirm your phone number</h2>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">Phone number</label>
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#0F131A] px-4 py-3 text-white outline-none transition placeholder:text-[#64748B] focus:border-[#8B5CF6]"
            placeholder="+123456789"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">OTP</label>
          <input
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#0F131A] px-4 py-3 text-white outline-none transition placeholder:text-[#64748B] focus:border-[#8B5CF6]"
            placeholder="Enter the 6-digit code"
            required
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-2xl bg-[#8B5CF6] px-4 py-3 font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between text-sm text-[#94A3B8]">
        <Link to={ROUTES.LOGIN} className="transition hover:text-white">
          Back to sign in
        </Link>
        <Link to={ROUTES.REGISTER} className="transition hover:text-white">
          Create account
        </Link>
      </div>
    </AuthLayout>
  );
}