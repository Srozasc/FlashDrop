import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { signIn, signUp, signOut, getUser, getToken, refreshSession } from '../lib/auth';
import { api } from '../lib/supabaseRest';

type AuthContextType = {
  user: any | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role?: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userState, setUserState] = useState<any | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadFullProfile(u: any) {
    if (!u) return null;
    try {
      // Intentamos obtener el perfil de la tabla users para tener el rol actualizado
      const profile = await api.getUserProfileById(u.id);
      if (profile) {
        return { ...u, ...profile };
      }
    } catch (e) {
      console.log('Error loading profile:', e);
    }
    return u;
  }

  async function bootstrap() {
    try {
      const t = getToken();
      setTokenState(t || null);
      if (t) {
        const u = await getUser();
        const fullUser = await loadFullProfile(u);
        setUserState(fullUser);
      } else {
        const r = await refreshSession();
        if (r?.access_token) {
          setTokenState(r.access_token);
          const u2 = await getUser();
          const fullUser = await loadFullProfile(u2);
          setUserState(fullUser);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    bootstrap();
  }, []);

  async function doSignIn(email: string, password: string) {
    setLoading(true);
    try {
      await signIn(email, password);
      setTokenState(getToken() || null);
      const u = await getUser();
      const fullUser = await loadFullProfile(u);
      setUserState(fullUser);
    } finally {
      setLoading(false);
    }
  }

  async function doSignUp(email: string, password: string, role: string = 'cliente') {
    setLoading(true);
    try {
      await signUp(email, password, role);
      await doSignIn(email, password);
    } finally {
      setLoading(false);
    }
  }

  function doSignOut() {
    signOut();
    setTokenState(null);
    setUserState(null);
  }

  const value = useMemo(
    () => ({
      user: userState,
      token,
      loading,
      signIn: doSignIn,
      signUp: doSignUp,
      signOut: doSignOut,
    }),
    [userState, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

