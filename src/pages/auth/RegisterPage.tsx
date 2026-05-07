import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { ROUTES } from '../../routes/routeConfig';
import { authApi } from '../../api/authApi';

export function RegisterPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('rider');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | string[] | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await authApi.register({
        email,
        password,
        confirm_password: confirmPassword,
        first_name: firstName,
        last_name: lastName,
        role,
      });
      navigate(ROUTES.LOGIN);
    } catch (caughtError: unknown) {
      const resp = (caughtError as any)?.response;
      let message: string | string[] = 'Registration failed. Please try again.';
      if (resp?.data) {
        const detail = resp.data.detail;
        if (Array.isArray(detail)) {
          message = detail.map((d: any) => d.msg ?? (typeof d === 'string' ? d : JSON.stringify(d)));
        } else if (typeof detail === 'string') {
          message = detail;
        } else if (typeof resp.data === 'string') {
          message = resp.data;
        }
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Create account"
      title="Start your ride booking journey"
      description="Create a rider, driver, or admin account and connect it to your authentication API when you are ready."
    >
      <div>
        <div className="text-sm uppercase tracking-[0.24em] text-[#94A3B8]">Register</div>
        <h2 className="mt-2 text-2xl font-semibold text-white">Set up your account</h2>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">First name</label>
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0F131A] px-4 py-3 text-white outline-none transition placeholder:text-[#64748B] focus:border-[#3B82F6]"
              placeholder="John"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">Last name</label>
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0F131A] px-4 py-3 text-white outline-none transition placeholder:text-[#64748B] focus:border-[#3B82F6]"
              placeholder="Doe"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#0F131A] px-4 py-3 text-white outline-none transition placeholder:text-[#64748B] focus:border-[#3B82F6]"
            placeholder="user@example.com"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">Role</label>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#0F131A] px-4 py-3 text-white outline-none transition focus:border-[#3B82F6]"
          >
            <option value="rider">Rider</option>
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0F131A] px-4 py-3 text-white outline-none transition placeholder:text-[#64748B] focus:border-[#3B82F6]"
              placeholder="Create password"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0F131A] px-4 py-3 text-white outline-none transition placeholder:text-[#64748B] focus:border-[#3B82F6]"
              placeholder="Repeat password"
              required
            />
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {Array.isArray(error) ? (
              <ul className="list-disc list-inside space-y-1">
                {error.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            ) : (
              <div>{error}</div>
            )}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-2xl bg-[#3B82F6] px-4 py-3 font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between text-sm text-[#94A3B8]">
        <Link to={ROUTES.LOGIN} className="transition hover:text-white">
          Back to sign in
        </Link>
        <Link to={ROUTES.VERIFY_OTP} className="transition hover:text-white">
          Already verified?
        </Link>
      </div>
    </AuthLayout>
  );
}