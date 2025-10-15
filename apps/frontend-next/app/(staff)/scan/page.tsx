"use client";
import { Button } from '@ecocollect/ui';

export default function StaffScanPage() {
  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Scan</h1>
      <div className="rounded border bg-white p-4">
        <div className="mb-2 text-gray-600">QR Scanner placeholder</div>
        <div className="aspect-square bg-gray-100 rounded" />
      </div>
      <div className="rounded border bg-white p-4 space-y-2">
        <input className="w-full rounded border px-3 py-2" placeholder="Manual code" />
        <Button>Submit</Button>
      </div>
    </main>
  );
}
