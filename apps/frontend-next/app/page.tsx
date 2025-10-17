import Link from 'next/link';
import { Button } from '@ecocollect/ui';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-emerald-600" />
          <div>
            <div className="text-lg font-semibold">EcoCollect</div>
            <div className="text-xs text-gray-500">Smart Waste Management</div>
          </div>
        </div>
        <nav className="hidden gap-6 text-sm text-gray-600 md:flex">
          <a className="hover:text-gray-900" href="#how">How it works</a>
          <a className="hover:text-gray-900" href="#features">Features</a>
          <a className="hover:text-gray-900" href="#residents">For Residents</a>
          <a className="hover:text-gray-900" href="#authorities">For Authorities</a>
          <a className="hover:text-gray-900" href="#docs">Docs</a>
        </nav>
        
        {/* Desktop Navigation */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/scan" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Scan QR
          </Link>
          <Link href="/settings" className="text-sm text-gray-700 hover:underline">Sign in</Link>
          <Link href="/dashboard"><span className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">Get Started</span></Link>
        </div>

        {/* Mobile Navigation - Scan QR button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/scan" className="inline-flex items-center justify-center rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700" title="Scan QR">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </Link>
          <Link href="/dashboard" className="inline-flex items-center justify-center rounded-md bg-emerald-600 p-2 text-white hover:bg-emerald-700" title="Dashboard">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-10 md:grid-cols-2 md:py-16">
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">EcoCollect — Smart waste made simple.</h1>
          <p className="text-lg text-gray-600">Monitor bins in real time, optimize collection routes, and reward recycling. EcoCollect brings sensor‑driven insights to cities so authorities and residents can work together for cleaner, healthier urban life.</p>
          <div className="flex gap-3">
            {/* Button without handlers to keep this page Server Component-friendly */}
            <Link href="/dashboard"><span className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">Get Started</span></Link>
            <Link href="/routes" className="inline-flex items-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300">View Demo</Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Feature icon="+" title="Real-time monitoring" desc="Sensor & tag based bin status" />
            <Feature icon="↺" title="Route optimization" desc="Smarter, faster collections" />
            <Feature icon="★" title="Rewards" desc="Incentives for recycling" />
          </div>
        </div>

        {/* Live Overview card */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>Live Overview</div>
            <div>Areas online <span className="ml-1 font-semibold text-gray-900">42</span></div>
          </div>
          <div className="mt-4 text-3xl font-bold">12,482 <span className="text-base font-medium text-gray-500">kg collected</span></div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
            <OverviewPill title="Route A" subtitle="18 bins • 4 stops" />
            <OverviewPill title="Route B" subtitle="18 bins • 4 stops" />
            <OverviewPill title="Route C" subtitle="18 bins • 4 stops" />
          </div>
          <div className="mt-6 rounded-lg bg-emerald-50 p-6 text-center text-emerald-700">Map preview (mock)</div>
        </div>
      </section>

      {/* Quick links to role pages */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 id="features" className="mb-4 text-xl font-semibold">Explore roles</h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
          <li><Link className="text-emerald-700 underline" href="/settings">Admin Settings</Link></li>
          <li><Link className="text-emerald-700 underline" href="/routes">Manager Routes</Link></li>
          <li><Link className="text-emerald-700 underline" href="/dashboard">Resident Dashboard</Link></li>
          <li><Link className="text-emerald-700 underline" href="/scan">Staff Scan</Link></li>
        </ul>
      </section>
    </main>
  );
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">{icon}</div>
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-sm text-gray-500">{desc}</div>
      </div>
    </div>
  );
}

function OverviewPill({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="font-medium">{title}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  );
}
