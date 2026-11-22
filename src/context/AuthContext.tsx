import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { UserProfile } from '../types/ink';

type User = { uid: string; email: string | null; displayName: string | null; photoURL: string | null; providerData: { providerId: string }[] };

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<any>;
  signInWithMicrosoft: () => Promise<any>;
  signOut: () => Promise<void>;
  hasRole: (roles: UserProfile['role'][]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const MOCK_USER: User = {
  uid: 'dev-admin-001',
  email: 'colorista@amcor.com',
  displayName: 'Colorista Amcor',
  photoURL: null,
  providerData: [{ providerId: 'google.com' }],
};

const MOCK_PROFILE: UserProfile = {
  uid: 'dev-admin-001',
  email: 'colorista@amcor.com',
  displayName: 'Colorista Amcor',
  photoURL: null,
  role: 'ADMIN',
  provider: 'google',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    (async () => {
      try {
        const { auth } = await import('../firebaseConfig');
        const { onAuthStateChanged } = await import('firebase/auth');
        unsub = onAuthStateChanged(auth, async (u) => {
          if (u) {
            setUser(u as any);
            try {
              const { db } = await import('../firebaseConfig');
              const { doc, getDoc, setDoc, serverTimestamp } = await import('firebase/firestore');
              const ref = doc(db, 'users', u.uid);
              const snap = await getDoc(ref);
              if (snap.exists()) {
                setProfile(snap.data() as UserProfile);
              } else {
                const provider = (u.providerData[0]?.providerId || '').includes('microsoft') ? 'microsoft' : 'google';
                const p: UserProfile = {
                  uid: u.uid,
                  email: u.email,
                  displayName: u.displayName,
                  photoURL: u.photoURL,
                  role: 'OPERADOR',
                  provider,
                };
                await setDoc(ref, { ...p, createdAt: serverTimestamp() });
                setProfile(p);
              }
            } catch {
              setProfile({
                uid: u.uid,
                email: u.email,
                displayName: u.displayName,
                photoURL: u.photoURL,
                role: 'ADMIN',
                provider: 'google',
              });
            }
          } else {
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
        });
      } catch (e) {
        console.warn('Firebase não disponível — modo desenvolvimento (mock login)', e);
        setUser(MOCK_USER);
        setProfile(MOCK_PROFILE);
        setLoading(false);
      }
    })();
    return () => { if (unsub) unsub(); };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { auth, googleProvider } = await import('../firebaseConfig');
      const { signInWithPopup } = await import('firebase/auth');
      return await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setUser(MOCK_USER);
      setProfile(MOCK_PROFILE);
      return { user: MOCK_USER };
    }
  };

  const signInWithMicrosoft = async () => {
    try {
      const { auth, microsoftProvider } = await import('../firebaseConfig');
      const { signInWithPopup } = await import('firebase/auth');
      return await signInWithPopup(auth, microsoftProvider);
    } catch (err) {
      setUser({ ...MOCK_USER, displayName: 'Usuário Microsoft' });
      setProfile({ ...MOCK_PROFILE, provider: 'microsoft', displayName: 'Usuário Microsoft' });
      return { user: MOCK_USER };
    }
  };

  const signOut = async () => {
    try {
      const { auth } = await import('../firebaseConfig');
      const { signOut: fbSignOut } = await import('firebase/auth');
      await fbSignOut(auth);
    } catch { /* ignore */ }
    setUser(null);
    setProfile(null);
  };

  const hasRole = (roles: UserProfile['role'][]) => {
    if (!profile) return false;
    return roles.includes(profile.role);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signInWithMicrosoft, signOut, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
