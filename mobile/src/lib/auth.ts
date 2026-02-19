import { ENV } from '../config/env';

let accessToken: string | null = null;
let user: any | null = null;
let refreshToken: string | null = null;

function setToken(token: string | null) {
  accessToken = token;
  if (typeof window !== 'undefined' && window.localStorage) {
    if (token) window.localStorage.setItem('sb_access_token', token);
    else window.localStorage.removeItem('sb_access_token');
  }
}

function setRefreshToken(token: string | null) {
  refreshToken = token;
  if (typeof window !== 'undefined' && window.localStorage) {
    if (token) window.localStorage.setItem('sb_refresh_token', token);
    else window.localStorage.removeItem('sb_refresh_token');
  }
}

function getStoredToken() {
  if (accessToken) return accessToken;
  if (typeof window !== 'undefined' && window.localStorage) {
    const t = window.localStorage.getItem('sb_access_token');
    if (t) accessToken = t;
  }
  return accessToken;
}

function getStoredRefreshToken() {
  if (refreshToken) return refreshToken;
  if (typeof window !== 'undefined' && window.localStorage) {
    const t = window.localStorage.getItem('sb_refresh_token');
    if (t) refreshToken = t;
  }
  return refreshToken;
}

async function request(path: string, init: RequestInit) {
  const url = `${ENV.supabaseUrl}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      apikey: ENV.supabaseAnonKey,
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Auth error');
  }
  return res.json();
}

export async function signUp(email: string, password: string) {
  const data = await request('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return data;
}

export async function signIn(email: string, password: string) {
  const data = await request('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.access_token || null);
  setRefreshToken(data.refresh_token || null);
  user = data.user || null;
  try {
    await ensureProfile(data.user);
  } catch (e) {
    // noop
  }
  return data;
}

export function getToken() {
  return getStoredToken();
}

export async function getUser() {
  const token = getStoredToken();
  if (!token) return null;
  const data = await request('/auth/v1/user', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  user = data;
  return data;
}

export function signOut() {
  setToken(null);
  setRefreshToken(null);
  user = null;
}

export function getCurrentUser() {
  return user;
}

async function ensureProfile(u: any) {
  const token = getToken();
  if (!token || !u?.id) return;

  // Intentar usar el rol de metadata, o default a 'cliente'
  const role = u.user_metadata?.role || 'cliente';

  const body = {
    id: u.id,
    email: u.email,
    name: u.user_metadata?.name || null,
    phone: u.user_metadata?.phone || null,
    role: role,
    is_active: true,
  };
  await fetch(`${ENV.supabaseUrl}/rest/v1/users?on_conflict=id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: ENV.supabaseAnonKey,
      Authorization: `Bearer ${token}`,
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(body),
  });
}

export async function refreshSession() {
  const rt = getStoredRefreshToken();
  if (!rt) return null;
  const data = await request('/auth/v1/token?grant_type=refresh_token', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: rt }),
  });
  setToken(data.access_token || null);
  setRefreshToken(data.refresh_token || null);
  return data;
}

export async function updateAuthUserMetadata(payload: Partial<{ name: string; phone: string }>) {
  const token = getStoredToken();
  if (!token) throw new Error('No session');
  const data = await request('/auth/v1/user', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ data: payload }),
  });
  return data;
}
