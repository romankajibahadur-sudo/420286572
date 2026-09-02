import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, MountainSnow, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { BOOTSTRAP, bootstrapPasswordUnchanged } from '../lib/db';
import { useSeo } from '../lib/hooks';
import { SITE } from '../lib/site';
import { pex } from '../lib/utils';

const inputCls =
  'w-full rounded-xl border border-night-900/12 bg-white py-3.5 pl-11 pr-4 text-sm text-night-900 placeholder:text-night-900/35 transition focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/25';

export default function Login() {
  useSeo(`Staff Sign In | ${SITE.fullName}`, 'Secure staff access to the Ascent Himalaya admin dashboard.');
  const { user, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') || '/admin';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [firstRun, setFirstRun] = useState(false);

  useEffect(() => {
    bootstrapPasswordUnchanged().then(setFirstRun).catch(() => setFirstRun(false));
  }, []);

  if (!loading && user) return <Navigate to={next} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const err = await signIn(identifier, password);
    setBusy(false);
    if (err) {
      setError(err);
      setPassword('');
      return;
    }
    navigate(next, { replace: true });
  };

  return (
    <main className="grid min-h-screen bg-sand-50 lg:grid-cols-[1.05fr_1fr]">
      {/* visual side */}
      <aside className="relative hidden overflow-hidden bg-night-950 lg:block" aria-hidden>
        <img src={pex(20839113, 1400, 1800)} alt="" className="absolute inset-0 size-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-t from-night-950/95 via-night-950/40 to-night-950/60" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex w-fit items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-ember-500 text-white">
              <MountainSnow className="size-5.5" />
            </span>
            <span className="leading-none text-white">
              <span className="block font-display text-lg font-semibold tracking-tight">{SITE.name}</span>
              <span className="block text-[9px] font-extrabold uppercase tracking-[0.34em] opacity-60">{SITE.line}</span>
            </span>
          </Link>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-ember-300 backdrop-blur">
              <ShieldCheck className="size-3.5" /> Secure staff area
            </span>
            <p className="mt-6 font-display text-4xl font-medium leading-tight tracking-tight text-white">
              The control room for<br />every <em className="italic text-ember-300">journey</em>.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
              Manage itineraries, pricing, the photo gallery and traveller bookings — all from one place.
            </p>
          </div>
        </div>
      </aside>

      {/* form side */}
      <section className="flex items-center justify-center px-5 py-20 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <Link to="/" className="mx-auto mb-8 flex w-fit items-center gap-2.5 lg:hidden">
            <span className="grid size-11 place-items-center rounded-xl bg-ember-500 text-white">
              <MountainSnow className="size-6" />
            </span>
            <span className="leading-none text-night-900">
              <span className="block font-display text-xl font-semibold">{SITE.name}</span>
              <span className="block text-[9px] font-extrabold uppercase tracking-[0.34em] opacity-60">{SITE.line}</span>
            </span>
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full bg-night-900/5 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-night-900/50">
            <Lock className="size-3" aria-hidden /> Staff access only
          </span>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-night-900">Sign in to the dashboard</h1>
          <p className="mt-2 text-sm text-night-900/55">
            Enter the credentials issued by your administrator. Travellers don’t need an account — booking is open to everyone.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-3" aria-label="Staff sign in">
            <div>
              <label htmlFor="identifier" className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-night-900/45">
                User ID or email
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-night-900/35" aria-hidden />
                <input
                  id="identifier"
                  required
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. admin"
                  className={inputCls}
                  aria-invalid={!!error}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-night-900/45">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-night-900/35" aria-hidden />
                <input
                  id="password"
                  required
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className={`${inputCls} pr-12`}
                  aria-invalid={!!error}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-night-900/40 transition hover:text-night-900"
                >
                  {showPw ? <EyeOff className="size-4.5" aria-hidden /> : <Eye className="size-4.5" aria-hidden />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
              >
                <AlertCircle className="mt-0.5 size-4.5 shrink-0" aria-hidden />
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-ember-500 py-4 text-sm font-extrabold text-white transition-all duration-300 hover:bg-ember-600 hover:shadow-[0_14px_30px_-10px_rgba(242,105,46,0.55)] disabled:opacity-60 cursor-pointer"
            >
              {busy ? (
                <span className="size-4.5 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </>
              )}
            </button>
          </form>

          {firstRun && (
            <div className="mt-6 rounded-xl border border-amber-300/70 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
              <p className="font-extrabold uppercase tracking-[0.14em]">First-time setup</p>
              <p className="mt-1.5">
                Sign in with the initial administrator account, then change the password immediately from
                <strong> Users → your account → Reset password</strong>.
              </p>
              <p className="mt-2 font-mono text-[13px] font-bold">
                {BOOTSTRAP.userId} / {BOOTSTRAP.password}
              </p>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-night-900/40">
            Lost your credentials? Ask an administrator to reset them. Back to{' '}
            <Link to="/" className="font-bold text-ember-600 hover:underline">the website</Link>.
          </p>
        </motion.div>
      </section>
    </main>
  );
}
