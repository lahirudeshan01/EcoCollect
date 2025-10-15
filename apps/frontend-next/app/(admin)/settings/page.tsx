"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@ecocollect/ui';
import config from '@ecocollect/config';
const { API_BASE } = config;

export default function AdminSettingsPage() {
  const router = useRouter();
  const [billingModel, setBillingModel] = useState('Flat rate');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const role = typeof window !== 'undefined' ? localStorage.getItem('ecocollect_role') : null;
    const token = typeof window !== 'undefined' ? localStorage.getItem('ecocollect_token') : null;
    if (!token || String(role).toUpperCase() !== 'ADMIN') {
      router.replace('/login' as any);
    }
  }, [router]);

  async function onSave() {
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem('ecocollect_token');
      const res = await fetch(`${API_BASE}/configuration`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ billingModels: [{ name: billingModel }] }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to save settings');
      }
      alert('Settings saved');
    } catch (e: any) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Admin Settings</h1>
      <div className="rounded border bg-white p-4 space-y-2">
        <label className="block text-sm font-medium">Billing model name</label>
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Flat rate"
          value={billingModel}
          onChange={(e) => setBillingModel(e.target.value)}
        />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <Button onClick={onSave} disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</Button>
    </main>
  );
}
