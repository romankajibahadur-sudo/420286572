import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  authenticate, ensureBootstrapAdmin, getAccount, getSessionUid, setSession, setUserPassword,
  type Account,
} from './db';
import { can, canEdit, type Permission } from './roles';

/**
 * Staff authentication for the admin dashboard.
 *
 * Credentials are verified against PBKDF2-SHA256 hashes held in the database —
 * no third-party identity provider, no social sign-in, and no plain-text
 * passwords at any point. This is intentionally separate from the public
 * website, which requires no visitor accounts at all.
 */
interface AuthContextValue {
  user: Account | null;
  loading: boolean;
  isAdmin: boolean;
  /** Role may view this dashboard section */
  allows: (perm: Permission) => boolean;
  /** Role may modify data (board members are read-only) */
  canEdit: boolean;
  signIn: (identifier: string, password: string) => Promise<string | null>;
  changePassword: (password: string) => Promise<string | null>;
  signOut: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore an existing session on boot.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await ensureBootstrapAdmin();
        const uid = getSessionUid();
        if (uid) {
          const account = await getAccount(uid);
          if (alive && account && account.status === 'active') setUser(account);
          else if (account && account.status !== 'active') setSession(null);
        }
      } catch (e) {
        console.error('Session restore failed', e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const signIn = useCallback(async (identifier: string, password: string) => {
    if (!identifier.trim()) return 'Please enter your user ID or email.';
    if (!password) return 'Please enter your password.';
    const result = await authenticate(identifier, password);
    if (!result.ok) return result.error;
    setSession(result.account.uid);
    setUser(result.account);
    return null;
  }, []);

  const changePassword = useCallback(
    async (password: string) => {
      if (!user) return 'You are not signed in.';
      if (password.length < 8) return 'Password must be at least 8 characters.';
      const res = await setUserPassword(user.uid, password);
      if (!res.ok) return res.error ?? 'Could not update the password.';
      const fresh = await getAccount(user.uid);
      if (fresh) setUser(fresh);
      return null;
    },
    [user],
  );

  const signOut = useCallback(() => {
    setSession(null);
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    if (!user) return;
    const fresh = await getAccount(user.uid);
    if (!fresh || fresh.status === 'disabled') {
      setSession(null);
      setUser(null);
      return;
    }
    setUser(fresh);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === 'admin',
        allows: (perm) => can(user?.role, perm),
        canEdit: canEdit(user?.role),
        signIn,
        changePassword,
        signOut,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
