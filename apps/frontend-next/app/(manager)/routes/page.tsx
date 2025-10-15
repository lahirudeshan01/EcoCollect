"use client";
import { Button } from '@ecocollect/ui';
import config from '@ecocollect/config';
const { API_BASE } = config;

export default function ManagerRoutesPage() {
  async function onOptimize() {
    alert(`Would POST to ${API_BASE}/routes/optimize`);
  }
  return (
    <main className="max-w-5xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Route Optimization</h1>
      <div className="rounded border bg-white p-4">
        <div className="mb-3 text-gray-600">Map placeholder</div>
        <div className="h-48 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded" />
      </div>
      <div className="rounded border bg-white p-4">
        <div className="mb-3 text-gray-600">Routes table placeholder</div>
        <div className="h-32 bg-gray-100 rounded" />
      </div>
      <Button onClick={onOptimize}>Optimize routes</Button>
    </main>
  );
}
