"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@ecocollect/ui';
import config from '@ecocollect/config';
import toast from 'react-hot-toast';
import Navigation from '../../components/Navigation';
const { API_BASE } = config;

type SystemConfig = {
  billingModels?: Array<{ name?: string; rate?: number }>;
  wasteCategories?: Array<{ key?: string; label?: string }>;
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
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
        setEmail(data?.email || '');
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
      toast.success('Settings saved successfully!', { duration: 3000, icon: '✅' });
    } catch (e: any) {
      setError(e.message || 'Failed to save');
      toast.error(e.message || 'Failed to save', { duration: 4000 });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Navigation email={email} role="ADMIN" currentPage="/settings" />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with icon */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
              <p className="text-sm text-gray-600 mt-1">Configure billing models and waste categories</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 animate-pulse">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Loading configuration...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in-up">
            {/* Billing Model Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Billing Model</h2>
              </div>
              <div className="space-y-5">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-indigo-600">
                    Model Name
                  </label>
                  <input
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none hover:border-gray-300"
                    placeholder="e.g., Flat Rate, Weight-Based"
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-indigo-600">
                    Rate (per unit)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full rounded-xl border-2 border-gray-200 pl-8 pr-4 py-3 transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none hover:border-gray-300"
                      placeholder="0.00"
                      value={billingRate}
                      onChange={(e) => setBillingRate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Waste Categories Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">Waste Categories</h2>
                  <p className="text-xs text-gray-500 mt-1">Enter one category per line in format: key:label</p>
                </div>
              </div>
              <div className="group">
                <textarea
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 font-mono text-sm transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none hover:border-gray-300 resize-none"
                  rows={8}
                  placeholder={"recyclables:Recyclables\norganic:Organic Waste\ngeneral:General Waste\ne-waste:Electronic Waste"}
                  value={wasteCategoriesText}
                  onChange={(e) => setWasteCategoriesText(e.target.value)}
                />
                <div className="mt-2 flex items-start gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Example: <code className="bg-gray-100 px-1.5 py-0.5 rounded">recyclables:Recyclables</code></span>
                </div>
              </div>
            </div>

            {/* Messages */}
            {message && (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
                <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-emerald-800">{message}</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            {/* Action Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={onSave}
                disabled={saving}
                className="group relative px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Settings
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
      </main>
    </>
  );
}
