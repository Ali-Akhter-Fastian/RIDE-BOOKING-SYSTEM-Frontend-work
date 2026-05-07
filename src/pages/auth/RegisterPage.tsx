import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { ROUTES } from '../../routes/routeConfig';
import { authApi } from '../../api/authApi';

type RegisterFieldErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

function parseRegisterErrors(caughtError: unknown): RegisterFieldErrors {
  const resp = (caughtError as any)?.response;
  const fallback: RegisterFieldErrors = {
    general: 'Registration failed. Please try again.',
  };

  if (!resp?.data) {
    return fallback;
  }

  const detail = resp.data.detail;

  if (Array.isArray(detail)) {
    const errors: RegisterFieldErrors = {};

    for (const item of detail) {
      const message = item?.msg ?? (typeof item === 'string' ? item : undefined);
      const location = Array.isArray(item?.loc) ? item.loc : [];
      const field = location[location.length - 1];

      if (!message) {
        continue;
      }

      if (field === 'first_name') {
        errors.firstName = message;
      } else if (field === 'last_name') {
        errors.lastName = message;
      } else if (field === 'email') {
        errors.email = message;
      } else if (field === 'password') {
        errors.password = message;
      } else if (field === 'confirm_password') {
        errors.confirmPassword = message;
      } else {
        errors.general = errors.general ?? message;
      }
    }

    return Object.keys(errors).length > 0 ? errors : fallback;
  }

  if (typeof detail === 'string') {
    return { general: detail };
  }

  if (typeof resp.data === 'string') {
    return { general: resp.data };
  }

  return fallback;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('rider');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterFieldErrors>({});
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const inputClassName = (hasError: boolean) =>
    `w-full rounded-2xl border bg-[#0F131A] px-4 py-3 text-white outline-none transition placeholder:text-[#64748B] ${
      hasError ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-[#3B82F6]'
    }`;

  const showFieldError = (field: keyof typeof touched, value: string, message?: string) =>
    touched[field] && (!value.trim() || Boolean(message));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();
    const nextErrors: RegisterFieldErrors = {};

    if (!trimmedFirstName) {
      nextErrors.firstName = 'First name is required.';
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Email is required.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Confirm your password.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (password !== confirmPassword) {
      setErrors({
        password: 'Passwords do not match.',
        confirmPassword: 'Passwords do not match.',
        general: 'Passwords do not match.',
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await authApi.register({
        email: trimmedEmail,
        password,
        confirm_password: confirmPassword,
        first_name: trimmedFirstName,
        last_name: trimmedLastName,
        role,
      });
      navigate(ROUTES.LOGIN);
    } catch (caughtError: unknown) {
      setErrors(parseRegisterErrors(caughtError));
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
            <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">
              First name <span className="text-red-300">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(event) => {
                setFirstName(event.target.value);
                if (errors.firstName && event.target.value.trim()) {
                  setErrors((current) => ({ ...current, firstName: undefined }));
                }
              }}
              onBlur={() => {
                setTouched((current) => ({ ...current, firstName: true }));
                if (!firstName.trim()) {
                  setErrors((current) => ({ ...current, firstName: 'First name is required.' }));
                }
              }}
              aria-invalid={showFieldError('firstName', firstName, errors.firstName)}
              className={inputClassName(Boolean(errors.firstName))}
              placeholder="John"
              required
            />
            {showFieldError('firstName', firstName, errors.firstName) ? (
              <p className="mt-2 text-sm text-red-300">{errors.firstName ?? 'First name is required.'}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">
              Last name <span className="text-[#94A3B8]">(optional)</span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(event) => {
                setLastName(event.target.value);
                if (errors.lastName && event.target.value.trim()) {
                  setErrors((current) => ({ ...current, lastName: undefined }));
                }
              }}
              onBlur={() => setTouched((current) => ({ ...current, lastName: true }))}
              aria-invalid={showFieldError('lastName', lastName, errors.lastName)}
              className={inputClassName(Boolean(errors.lastName))}
              placeholder="Doe"
            />
            {showFieldError('lastName', lastName, errors.lastName) ? (
              <p className="mt-2 text-sm text-red-300">{errors.lastName}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">
            Email <span className="text-red-300">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (errors.email && event.target.value.trim()) {
                setErrors((current) => ({ ...current, email: undefined }));
              }
            }}
            onBlur={() => {
              setTouched((current) => ({ ...current, email: true }));
              if (!email.trim()) {
                setErrors((current) => ({ ...current, email: 'Email is required.' }));
              }
            }}
            aria-invalid={showFieldError('email', email, errors.email)}
            className={inputClassName(Boolean(errors.email))}
            placeholder="user@example.com"
            required
          />
          {showFieldError('email', email, errors.email) ? (
            <p className="mt-2 text-sm text-red-300">{errors.email ?? 'Email is required.'}</p>
          ) : null}
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
            <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">
              Password <span className="text-red-300">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password && event.target.value.trim()) {
                  setErrors((current) => ({ ...current, password: undefined }));
                }
              }}
              onBlur={() => {
                setTouched((current) => ({ ...current, password: true }));
                if (!password) {
                  setErrors((current) => ({ ...current, password: 'Password is required.' }));
                }
              }}
              aria-invalid={showFieldError('password', password, errors.password)}
              className={inputClassName(Boolean(errors.password))}
              placeholder="Create password"
              required
            />
            {showFieldError('password', password, errors.password) ? (
              <p className="mt-2 text-sm text-red-300">{errors.password ?? 'Password is required.'}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">
              Confirm password <span className="text-red-300">*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (errors.confirmPassword && event.target.value.trim()) {
                  setErrors((current) => ({ ...current, confirmPassword: undefined }));
                }
              }}
              onBlur={() => {
                setTouched((current) => ({ ...current, confirmPassword: true }));
                if (!confirmPassword) {
                  setErrors((current) => ({ ...current, confirmPassword: 'Confirm your password.' }));
                }
              }}
              aria-invalid={showFieldError('confirmPassword', confirmPassword, errors.confirmPassword)}
              className={inputClassName(Boolean(errors.confirmPassword))}
              placeholder="Repeat password"
              required
            />
            {showFieldError('confirmPassword', confirmPassword, errors.confirmPassword) ? (
              <p className="mt-2 text-sm text-red-300">{errors.confirmPassword ?? 'Confirm your password.'}</p>
            ) : null}
          </div>
        </div>

        {errors.general ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <div>{errors.general}</div>
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