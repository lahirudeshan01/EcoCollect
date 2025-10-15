"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import config from '@ecocollect/config';
import { Button } from '@ecocollect/ui';

const { API_BASE } = config;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect based on role
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('ecocollect_token') : null;
    const role = typeof window !== 'undefined' ? localStorage.getItem('ecocollect_role') : null;
    if (token && role) {
      const upper = String(role).toUpperCase();
      router.replace(upper === 'ADMIN' ? '/settings' : '/dashboard');
    }
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Login failed');
      // Store token client-side for now; consider HttpOnly cookie in production
  localStorage.setItem('ecocollect_token', data.token);
  localStorage.setItem('ecocollect_role', data.user?.role || 'USER');
  if (data.user?.email) localStorage.setItem('ecocollect_email', data.user.email);
  const role = String(data.user?.role || 'USER').toUpperCase();
  router.replace((role === 'ADMIN' ? '/settings' : '/dashboard') as any);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold">Sign in</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <div className="mt-4 text-sm text-gray-600">
        Tip: Seed an admin first at <a className="underline" href={`${API_BASE}/auth/seed-admin`} target="_blank" rel="noreferrer">{`${API_BASE}/auth/seed-admin`}</a> then sign in with admin@ecocollect.local / admin123
      </div>
    </main>
  );
}
