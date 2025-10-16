"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@ecocollect/ui';
import config from '@ecocollect/config';
import toast from 'react-hot-toast';
const { API_BASE } = config;

type SystemConfig = {
  billingModels?: Array<{ name?: string; rate?: number }>;
  wasteCategories?: Array<{ key?: string; label?: string }>;
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [billingName, setBillingName] = useState('');
  const [billingRate, setBillingRate] = useState<string>('');
  const [wasteCategoriesText, setWasteCategoriesText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // verify session is ADMIN
    (async () => {
      try {
        const me = await fetch(`${API_BASE}/auth/session`, { credentials: 'include' });
        if (!me.ok) { router.replace('/login' as any); return; }
        const data = await me.json();
        if (String(data?.role).toUpperCase() !== 'ADMIN') { router.replace('/login' as any); return; }
      } catch { router.replace('/login' as any); return; }
      // Fetch current config
      try {
        const res = await fetch(`${API_BASE}/configuration`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to load configuration');
        const data: SystemConfig = await res.json();
        const bm = data.billingModels?.[0] || {};
        setBillingName(bm.name || '');
        setBillingRate(
          typeof bm.rate === 'number' && !Number.isNaN(bm.rate) ? String(bm.rate) : ''
        );
        const wc = (data.wasteCategories || [])
          .map(c => `${c.key || ''}:${c.label || ''}`.trim())
          .filter(Boolean)
          .join('\n');
        setWasteCategoriesText(wc);
      } catch (e: any) {
        setError(e.message || 'Failed to load configuration');
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function onSave() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      // Parse waste categories from textarea: lines of key:label
      const categories = wasteCategoriesText
        .split(/\r?\n/) // split lines
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
          const [key, ...rest] = line.split(':');
          return { key: (key || '').trim(), label: rest.join(':').trim() };
        })
        .filter(c => c.key);

      const rateNum = billingRate ? Number(billingRate) : undefined;
      const payload: SystemConfig = {
        billingModels: [
          {
            name: billingName || undefined,
            rate: typeof rateNum === 'number' && !Number.isNaN(rateNum) ? rateNum : undefined,
          },
        ],
        wasteCategories: categories,
      };
      const csrf = await (await fetch(`${API_BASE}/csrf-token`, { credentials: 'include' })).json();
      const res = await fetch(`${API_BASE}/configuration`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf?.csrfToken || '',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to save settings');
      }
      setMessage('Settings saved');
      toast.success('Settings saved');
    } catch (e: any) {
      setError(e.message || 'Failed to save');
      toast.error(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Admin Settings</h1>
      {loading ? (
        <div className="text-gray-600">Loading configuration…</div>
      ) : (
        <>
          <div className="rounded border bg-white p-4 space-y-2">
            <label className="block text-sm font-medium">Billing model name</label>
            <input
              className="w-full rounded border px-3 py-2"
              placeholder="Flat rate"
              value={billingName}
              onChange={(e) => setBillingName(e.target.value)}
            />
            <label className="mt-3 block text-sm font-medium">Billing rate</label>
            <input
              type="number"
              className="w-full rounded border px-3 py-2"
              placeholder="0"
              value={billingRate}
              onChange={(e) => setBillingRate(e.target.value)}
            />
          </div>
          <div className="rounded border bg-white p-4 space-y-2">
            <label className="block text-sm font-medium">Waste categories (one per line as key:label)</label>
            <textarea
              className="w-full rounded border px-3 py-2"
              rows={6}
              placeholder={"recyclables:Recyclables\norganic:Organic\ngeneral:General"}
              value={wasteCategoriesText}
              onChange={(e) => setWasteCategoriesText(e.target.value)}
            />
          </div>
          {message && <div className="text-sm text-emerald-700">{message}</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}
          <Button onClick={onSave} disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</Button>
        </>
      )}
    </main>
  );
}
