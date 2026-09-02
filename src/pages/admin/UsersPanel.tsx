import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle, Check, KeyRound, Pencil, Search, ShieldCheck, Trash2, UserPlus, X,
} from 'lucide-react';
import {
  createUser, deleteUser, listUsers, setUserPassword, updateUser, type Account,
} from '../../lib/db';
import { passwordStrength } from '../../lib/crypto';
import { ROLES, roleLabel, roleTone, type Role } from '../../lib/roles';
import { useAuth } from '../../lib/auth';
import { useToast } from '../../components/ui';
import { cn } from '../../utils/cn';
import { PanelCard } from './Panels';

const field =
  'w-full rounded-lg border border-night-900/12 bg-white px-3.5 py-2.5 text-sm text-night-900 placeholder:text-night-900/35 transition focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/20';
const labelCls = 'block text-[11px] font-extrabold uppercase tracking-[0.14em] text-night-900/45 mb-1.5';

const initials = (n: string) => n.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

/* ---------------- Create / edit modal ---------------- */

function UserModal({
  account, onClose, onSaved,
}: { account: Account | null; onClose: () => void; onSaved: () => void }) {
  const { push } = useToast();
  const isNew = account === null;
  const [f, setF] = useState({
    name: account?.name ?? '',
    userId: account?.userId ?? '',
    email: account?.email ?? '',
    role: (account?.role ?? 'staff') as Role,
    status: (account?.status ?? 'active') as 'active' | 'disabled',
    password: '',
    confirm: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (p: Partial<typeof f>) => setF((x) => ({ ...x, ...p }));
  const strength = passwordStrength(f.password);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!f.name.trim()) return setError('Full name is required.');
    if (!/^[a-zA-Z0-9._-]{3,}$/.test(f.userId.trim()))
      return setError('User ID must be at least 3 characters — letters, numbers, dot, dash or underscore only.');
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email.trim())) return setError('That email address is not valid.');
    if (isNew || f.password) {
      if (f.password.length < 8) return setError('Password must be at least 8 characters.');
      if (f.password !== f.confirm) return setError('The two passwords do not match.');
    }

    setBusy(true);
    try {
      if (isNew) {
        const res = await createUser({
          name: f.name, userId: f.userId, email: f.email,
          password: f.password, role: f.role, status: f.status,
        });
        if (!res.ok) { setError(res.error ?? 'Could not create the account.'); return; }
        push(`Account created for ${f.name}`);
      } else {
        const res = await updateUser(account!.uid, {
          name: f.name.trim(), userId: f.userId.trim(), email: f.email.trim(), role: f.role, status: f.status,
        });
        if (!res.ok) { setError(res.error ?? 'Could not update the account.'); return; }
        if (f.password) await setUserPassword(account!.uid, f.password);
        push(`${f.name} updated`);
      }
      onSaved();
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] overflow-y-auto bg-night-950/70 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose} role="dialog" aria-modal="true" aria-label={isNew ? 'Add user' : 'Edit user'}
    >
      <motion.form
        initial={{ opacity: 0, y: 28, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()} onSubmit={submit}
        className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-lift sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-semibold text-night-900">{isNew ? 'Add team member' : 'Edit account'}</h3>
            <p className="mt-0.5 text-sm text-night-900/50">
              {isNew ? 'Issue credentials and assign a role.' : `Update details for ${account?.name}.`}
            </p>
          </div>
          <button type="button" onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-full border border-night-900/12 transition hover:bg-night-900/5" aria-label="Close">
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="u-name">Full name *</label>
            <input id="u-name" className={field} value={f.name} onChange={(e) => set({ name: e.target.value })} placeholder="Pasang Tamang" />
          </div>
          <div>
            <label className={labelCls} htmlFor="u-id">User ID / username *</label>
            <input id="u-id" className={field} value={f.userId} onChange={(e) => set({ userId: e.target.value })} placeholder="p.tamang" autoComplete="off" />
          </div>
          <div>
            <label className={labelCls} htmlFor="u-email">Email <span className="normal-case opacity-60">(optional)</span></label>
            <input id="u-email" type="email" className={field} value={f.email} onChange={(e) => set({ email: e.target.value })} placeholder="name@company.com" autoComplete="off" />
          </div>
          <div>
            <label className={labelCls} htmlFor="u-pw">{isNew ? 'Password *' : 'New password'}</label>
            <input id="u-pw" type="password" className={field} value={f.password} onChange={(e) => set({ password: e.target.value })} placeholder={isNew ? 'Min. 8 characters' : 'Leave blank to keep current'} autoComplete="new-password" />
            {f.password && (
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-night-900/10">
                  <div
                    className={cn('h-full rounded-full transition-all duration-300',
                      strength.score <= 1 ? 'bg-rose-500' : strength.score === 2 ? 'bg-amber-500' : 'bg-emerald-500')}
                    style={{ width: `${(strength.score / 4) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-night-900/45">{strength.label}</span>
              </div>
            )}
          </div>
          <div>
            <label className={labelCls} htmlFor="u-confirm">Confirm password{isNew ? ' *' : ''}</label>
            <input id="u-confirm" type="password" className={field} value={f.confirm} onChange={(e) => set({ confirm: e.target.value })} placeholder="Re-enter password" autoComplete="new-password" />
          </div>
          <div>
            <label className={labelCls} htmlFor="u-role">Role *</label>
            <select id="u-role" className={field} value={f.role} onChange={(e) => set({ role: e.target.value as Role })}>
              {ROLES.map((r) => <option key={r.slug} value={r.slug}>{r.label}</option>)}
            </select>
            <p className="mt-1.5 text-[11px] leading-snug text-night-900/45">{ROLES.find((r) => r.slug === f.role)?.blurb}</p>
          </div>
          <div>
            <label className={labelCls} htmlFor="u-status">Status</label>
            <select id="u-status" className={field} value={f.status} onChange={(e) => set({ status: e.target.value as 'active' | 'disabled' })}>
              <option value="active">Active — can sign in</option>
              <option value="disabled">Disabled — access blocked</option>
            </select>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            <AlertCircle className="mt-0.5 size-4.5 shrink-0" aria-hidden />{error}
          </p>
        )}

        <p className="mt-4 flex items-start gap-2 rounded-xl bg-sand-100 px-4 py-3 text-[11px] leading-relaxed text-night-900/55">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
          Passwords are salted and hashed with PBKDF2-SHA256 (150,000 iterations) before being stored. Plain text is never saved and cannot be recovered — only reset.
        </p>

        <div className="mt-6 flex justify-end gap-3 border-t border-night-900/10 pt-5">
          <button type="button" onClick={onClose} className="rounded-xl border border-night-900/15 px-6 py-3 text-sm font-bold text-night-900/70 transition hover:bg-night-900/5 cursor-pointer">Cancel</button>
          <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-ember-500 px-7 py-3 text-sm font-extrabold text-white transition hover:bg-ember-600 disabled:opacity-60 cursor-pointer">
            {busy ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden /> : <Check className="size-4" aria-hidden />}
            {isNew ? 'Create account' : 'Save changes'}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

/* ---------------- Reset password modal ---------------- */

function ResetModal({ account, onClose, onSaved }: { account: Account; onClose: () => void; onSaved: () => void }) {
  const { push } = useToast();
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) return setError('Password must be at least 8 characters.');
    if (pw !== confirm) return setError('The two passwords do not match.');
    setBusy(true);
    await setUserPassword(account.uid, pw);
    setBusy(false);
    push(`Password reset for ${account.name}`);
    onSaved();
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] grid place-items-center bg-night-950/70 p-4 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true">
      <motion.form initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }} onClick={(e) => e.stopPropagation()} onSubmit={submit}
        className="w-full max-w-sm rounded-3xl bg-white p-7">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-ember-100 text-ember-600"><KeyRound className="size-5" aria-hidden /></span>
        <h3 className="mt-4 text-center font-display text-xl font-semibold text-night-900">Reset password</h3>
        <p className="mt-1 text-center text-sm text-night-900/55">Set a new password for <strong>{account.name}</strong> ({account.userId}).</p>
        <div className="mt-5 space-y-3">
          <input type="password" className={field} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password" autoComplete="new-password" aria-label="New password" />
          <input type="password" className={field} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" autoComplete="new-password" aria-label="Confirm password" />
        </div>
        {error && <p role="alert" className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{error}</p>}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-night-900/15 py-2.5 text-sm font-bold cursor-pointer">Cancel</button>
          <button type="submit" disabled={busy} className="rounded-xl bg-ember-500 py-2.5 text-sm font-extrabold text-white transition hover:bg-ember-600 disabled:opacity-60 cursor-pointer">Reset</button>
        </div>
      </motion.form>
    </motion.div>
  );
}

/* ---------------- Panel ---------------- */

export function UsersPanel() {
  const { user: me, refresh: refreshMe } = useAuth();
  const { push } = useToast();
  const [users, setUsers] = useState<Account[] | null>(null);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | Role>('all');
  const [modal, setModal] = useState<{ open: boolean; account: Account | null }>({ open: false, account: null });
  const [reset, setReset] = useState<Account | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const load = useCallback(() => listUsers().then(setUsers).catch(() => setUsers([])), []);
  useEffect(() => { void load(); }, [load]);

  const shown = useMemo(() => {
    if (!users) return [];
    const q = query.trim().toLowerCase();
    return users
      .filter((u) => roleFilter === 'all' || u.role === roleFilter)
      .filter((u) => !q || `${u.name} ${u.userId} ${u.email ?? ''} ${roleLabel(u.role)}`.toLowerCase().includes(q));
  }, [users, query, roleFilter]);

  const toggleStatus = async (u: Account) => {
    const status = u.status === 'active' ? 'disabled' : 'active';
    await updateUser(u.uid, { status });
    await load();
    push(`${u.name} ${status === 'active' ? 'enabled' : 'disabled'}`);
  };

  const remove = async (u: Account) => {
    await deleteUser(u.uid);
    setConfirmDel(null);
    await load();
    push(`${u.name}'s account deleted`);
  };

  const adminCount = users?.filter((u) => u.role === 'admin' && u.status === 'active').length ?? 0;

  return (
    <>
      <PanelCard
        title="User management"
        sub={`${users?.length ?? '—'} accounts — issue credentials and control access by role`}
        action={
          <button
            type="button"
            onClick={() => setModal({ open: true, account: null })}
            className="inline-flex items-center gap-2 rounded-xl bg-ember-500 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-ember-600 cursor-pointer"
          >
            <UserPlus className="size-4" aria-hidden /> Add user
          </button>
        }
      >
        {/* filters */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-night-900/35" aria-hidden />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, ID, email…" aria-label="Search users" className={`${field} pl-10`} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(['all', ...ROLES.map((r) => r.slug)] as const).map((r) => (
              <button
                key={r} type="button" onClick={() => setRoleFilter(r as 'all' | Role)}
                className={cn('rounded-full px-3.5 py-1.5 text-xs font-extrabold transition cursor-pointer',
                  roleFilter === r ? 'bg-night-950 text-white' : 'border border-night-900/12 text-night-900/55 hover:border-night-900/35')}
              >
                {r === 'all' ? 'All' : roleLabel(r as Role)}
              </button>
            ))}
          </div>
        </div>

        {users === null ? (
          <div className="space-y-2.5">{[...Array(4)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-2xl bg-night-900/5" />)}</div>
        ) : shown.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-night-900/15 px-6 py-14 text-center text-sm text-night-900/45">
            {query || roleFilter !== 'all' ? 'No accounts match those filters.' : 'No accounts yet — add your first team member.'}
          </p>
        ) : (
          <div className="-mx-1 overflow-x-auto px-1">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-night-900/8 text-[11px] font-extrabold uppercase tracking-[0.14em] text-night-900/40">
                  <th className="pb-3 pr-4">Member</th>
                  <th className="pb-3 pr-4">User ID</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Last login</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((u) => {
                  const isSelf = u.uid === me?.uid;
                  const lastAdmin = u.role === 'admin' && adminCount <= 1;
                  return (
                    <tr key={u.uid} className="border-b border-night-900/5 transition-colors hover:bg-sand-100/60">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-night-950 font-display text-xs font-semibold text-ember-300">
                            {initials(u.name)}
                          </span>
                          <span className="min-w-0">
                            <span className="flex items-center gap-2 font-bold text-night-900">
                              <span className="truncate">{u.name}</span>
                              {isSelf && <span className="rounded-full bg-night-900/5 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-night-900/45">You</span>}
                            </span>
                            <span className="block truncate text-xs text-night-900/45">{u.email || '—'}</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4"><code className="rounded bg-night-900/5 px-2 py-1 font-mono text-xs font-bold text-night-900/70">{u.userId}</code></td>
                      <td className="py-3 pr-4">
                        <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider', roleTone[u.role])}>{roleLabel(u.role)}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <button
                          type="button" onClick={() => toggleStatus(u)} disabled={isSelf}
                          title={isSelf ? 'You cannot disable your own account' : 'Toggle access'}
                          className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold transition disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer',
                            u.status === 'active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-night-900/8 text-night-900/50 hover:bg-night-900/15')}
                        >
                          <span className={cn('size-1.5 rounded-full', u.status === 'active' ? 'bg-emerald-500' : 'bg-night-900/35')} />
                          {u.status === 'active' ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="py-3 pr-4 text-xs text-night-900/50">
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}
                      </td>
                      <td className="py-3 text-right">
                        <div className="inline-flex gap-1.5">
                          <button type="button" onClick={() => setModal({ open: true, account: u })}
                            className="grid size-9 place-items-center rounded-lg border border-night-900/10 text-night-900/60 transition hover:border-ember-500 hover:text-ember-600 cursor-pointer" aria-label={`Edit ${u.name}`}>
                            <Pencil className="size-4" aria-hidden />
                          </button>
                          <button type="button" onClick={() => setReset(u)}
                            className="grid size-9 place-items-center rounded-lg border border-night-900/10 text-night-900/60 transition hover:border-amber-500 hover:text-amber-600 cursor-pointer" aria-label={`Reset password for ${u.name}`}>
                            <KeyRound className="size-4" aria-hidden />
                          </button>
                          {confirmDel === u.uid ? (
                            <button type="button" onClick={() => remove(u)} className="rounded-lg bg-rose-600 px-3 text-xs font-extrabold text-white transition hover:bg-rose-700 cursor-pointer">Confirm</button>
                          ) : (
                            <button type="button" onClick={() => setConfirmDel(u.uid)} disabled={isSelf || lastAdmin}
                              title={isSelf ? 'You cannot delete your own account' : lastAdmin ? 'Cannot delete the last administrator' : 'Delete account'}
                              className="grid size-9 place-items-center rounded-lg border border-night-900/10 text-night-900/60 transition hover:border-rose-500 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer" aria-label={`Delete ${u.name}`}>
                              <Trash2 className="size-4" aria-hidden />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </PanelCard>

      {/* role reference */}
      <div className="mt-6">
        <PanelCard title="Role permissions" sub="What each role can reach in the dashboard">
          <div className="grid gap-3 sm:grid-cols-2">
            {ROLES.map((r) => (
              <div key={r.slug} className="rounded-2xl border border-night-900/8 p-4">
                <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider', roleTone[r.slug])}>{r.label}</span>
                <p className="mt-2.5 text-sm leading-relaxed text-night-900/60">{r.blurb}</p>
              </div>
            ))}
          </div>
        </PanelCard>
      </div>

      <AnimatePresence>
        {modal.open && (
          <UserModal account={modal.account} onClose={() => setModal({ open: false, account: null })}
            onSaved={() => { void load(); void refreshMe(); }} />
        )}
        {reset && <ResetModal account={reset} onClose={() => setReset(null)} onSaved={() => { void load(); void refreshMe(); }} />}
      </AnimatePresence>
    </>
  );
}
