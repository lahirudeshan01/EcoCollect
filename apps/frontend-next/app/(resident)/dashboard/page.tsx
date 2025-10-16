"use client";
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@ecocollect/ui';
import config from '@ecocollect/config';

const { API_BASE } = config;

type Account = {
  address?: string;
  balance?: number;
  pickups?: Array<{ date: string; notes?: string }>;
};

export default function ResidentDashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [acct, setAcct] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [pickDate, setPickDate] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simple role-aware nav content
  const nav = useMemo(() => ({ email, role: role.toUpperCase() || 'USER' }), [email, role]);

  // Protect route: require session and USER role; redirect ADMINs to /settings
  useEffect(() => {
    (async () => {
      try {
        const me = await fetch(`${API_BASE}/auth/session`, { credentials: 'include' });
        if (!me.ok) { router.replace('/login' as any); return; }
        const m = await me.json();
        const upper = String(m?.role || '').toUpperCase();
        if (upper === 'ADMIN') { router.replace('/settings' as any); return; }
        setRole(upper);
        setEmail(m?.email || '');
      } catch { router.replace('/login' as any); return; }
    })();
    // Fetch account info
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/accounts/me`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch account');
        const data = await res.json();
        setAcct(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function submitPickup(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const csrf = await (await fetch(`${API_BASE}/csrf-token`, { credentials: 'include' })).json();
      const res = await fetch(`${API_BASE}/accounts/pickups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf?.csrfToken || '',
        },
        credentials: 'include',
        body: JSON.stringify({ date: pickDate, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to schedule pickup');
      setMessage('Pickup scheduled successfully');
      setAcct(data);
      setPickDate('');
      setNotes('');
    } catch (e: any) {
      setError(e.message || 'Failed to schedule pickup');
    }
  }

  const pickups = acct?.pickups || [];

  async function logout() {
    try {
      const csrf = await (await fetch(`${API_BASE}/csrf-token`, { credentials: 'include' })).json();
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { 'X-CSRF-Token': csrf?.csrfToken || '' },
        credentials: 'include',
      });
    } finally {
      router.replace('/login' as any);
    }
  }

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      {/* Nav */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Signed in as <span className="font-medium text-gray-900">{nav.email || 'user'}</span> · Role: <span className="font-medium">{nav.role}</span>
        </div>
        <Button variant="secondary" onClick={logout}>Logout</Button>
      </div>

      <h1 className="text-2xl font-semibold">Welcome, {email || 'Resident'}!</h1>

      {loading ? (
        <div className="text-gray-600">Loading your account…</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <>
          {/* Waste History */}
          <section className="rounded border bg-white p-4">
            <h2 className="mb-3 text-lg font-medium">Your Waste History</h2>
            {pickups.length === 0 ? (
              <div className="text-sm text-gray-600">No pickups yet. Schedule your first pickup below.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">Date</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pickups.map((p, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-3 py-2">{new Date(p.date).toLocaleDateString()}</td>
                        <td className="px-3 py-2">{p.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Schedule a Special Pickup */}
          <section className="rounded border bg-white p-4">
            <h2 className="mb-3 text-lg font-medium">Schedule a Special Pickup</h2>
            <form className="space-y-4" onSubmit={submitPickup}>
              <div>
                <label className="block text-sm font-medium">Pickup Date</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded border px-3 py-2"
                  value={pickDate}
                  onChange={(e) => setPickDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Notes</label>
                <textarea
                  className="mt-1 w-full rounded border px-3 py-2"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., bulky items, access instructions"
                />
              </div>
              {message && <div className="text-sm text-emerald-700">{message}</div>}
              {error && <div className="text-sm text-red-600">{error}</div>}
              <Button type="submit">Submit Request</Button>
            </form>
          </section>
        </>
      )}
    </main>
  );
}
