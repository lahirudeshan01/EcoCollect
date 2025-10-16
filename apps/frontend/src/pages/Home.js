import React from "react";

// EcoCollect Home Page
// Single-file React component styled with Tailwind CSS
// Drop this component into a React app (create-react-app, Next.js, Vite) with Tailwind configured.

export default function EcoCollectHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white text-gray-900 antialiased">
      {/* NAV */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12h4l2-3 3 6 3-8 4 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="text-lg font-semibold">EcoCollect</div>
            <div className="text-xs text-gray-500 -mt-0.5">Smart Waste Management</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a className="hover:text-emerald-600 transition">How it works</a>
          <a className="hover:text-emerald-600 transition">Features</a>
          <a className="hover:text-emerald-600 transition cursor-pointer" onClick={() => window.location.href = '/dashboard'}>For Residents</a>
          <a className="hover:text-emerald-600 transition">For Authorities</a>
          <a className="hover:text-emerald-600 transition">Docs</a>
  </nav>

        <div className="hidden md:flex items-center gap-4">
          <button className="px-4 py-2 rounded-md text-sm font-semibold">Sign in</button>
          <button className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-semibold shadow hover:shadow-lg transition">Get Started</button>
        </div>

        {/* mobile menu icon */}
        <button className="md:hidden p-2 rounded-lg bg-white shadow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </header>

      {/* HERO */}
      <main className="max-w-7xl mx-auto px-6">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">EcoCollect — Smart waste made simple.</h1>
            <p className="text-lg text-gray-600 max-w-xl">Monitor bins in real time, optimize collection routes, and reward recycling. EcoCollect brings sensor-driven insights to cities so authorities and residents can work together for cleaner, healthier urban life.</p>

            <div className="flex flex-wrap gap-4">
              <a className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-600 text-white font-semibold shadow hover:translate-y-[-1px] transition">Get Started</a>
              <a className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border text-gray-700 hover:border-emerald-500 transition">View Demo</a>
            </div>

            <div className="mt-4 flex gap-6 items-center text-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <div className="font-semibold">Real-time monitoring</div>
                  <div className="text-gray-500">Sensor & tag based bin status</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h12M3 18h6" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <div className="font-semibold">Route optimization</div>
                  <div className="text-gray-500">Smarter, faster collections</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl p-8 bg-gradient-to-b from-white/80 to-gray-50 shadow-2xl border border-gray-100">
              {/* mock dashboard card */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-500">Live Overview</div>
                  <div className="mt-2 text-2xl font-bold">12,482&nbsp;<span className="text-sm font-medium text-gray-400">kg collected</span></div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Areas online</div>
                  <div className="mt-1 font-semibold">42</div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Current routes</div>
                  <div className="text-xs text-gray-400">updated 2m ago</div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Route A','Route B','Route C'].map((r)=> (
                    <div key={r} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-sm font-semibold">{r}</div>
                      <div className="text-xs text-gray-400 mt-1">18 bins • 4 stops</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 h-28 rounded-md bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center text-emerald-600 text-sm font-medium">Map preview (mock)</div>
              </div>
            </div>

            {/* decorative large translucent circle */}
            <div className="absolute -right-16 top-8 w-44 h-44 rounded-full bg-emerald-100/50 blur-3xl -z-10"></div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-8">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-semibold">Why EcoCollect?</h3>
            <p className="mt-2 text-gray-600">A simple platform that connects households, collection teams and local authorities with data-driven workflows and incentives for recycling.</p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard title="Real-time Bin Monitoring" desc="Sensors & tags report fill-levels automatically." icon={() => (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6v12a4 4 0 01-4 4" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )} />

            <FeatureCard title="Route Optimization" desc="Reduce fuel & time with adaptive routing." icon={() => (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 12h18M12 3v18" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )} />

            <FeatureCard title="Resident Portal" desc="Track waste, schedule collections, pay online." icon={() => (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 20v-1a6 6 0 0116 0v1" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )} />

            <FeatureCard title="Analytics for Authorities" desc="Visualize waste patterns and plan resources." icon={() => (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M4 20h16M8 16V8M12 16v-4M16 16v-8" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )} />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-semibold">How it works</h3>
            <p className="mt-2 text-gray-500">From sensor to action — EcoCollect automates monitoring, route planning and feedback loops so collections are reliable and transparent.</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <StepCard number={1} title="Sensor & Tag" desc="Smart tags and fill-level sensors installed on bins." />
              <StepCard number={2} title="Cloud Processing" desc="Data is aggregated, routed and analyzed in real time." />
              <StepCard number={3} title="Collection & Reward" desc="Trucks follow optimized routes; users earn recycling rewards." />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white rounded-xl p-8">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-semibold">Ready to make waste management smarter?</h4>
              <p className="text-gray-600 mt-2">Start a pilot in your city or community with EcoCollect.</p>
            </div>
            <div className="flex gap-4">
              <button className="px-5 py-3 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:shadow-lg transition">Request Pilot</button>
              <button className="px-5 py-3 rounded-lg border">Contact Sales</button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-12 border-t pt-8 pb-20">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-lg font-semibold">EcoCollect</div>
              <div className="text-gray-500 mt-2">Smart Waste Management for cleaner cities.</div>
            </div>
            <div className="flex gap-8">
              <div>
                <div className="font-semibold">Product</div>
                <div className="text-sm text-gray-500 mt-2">How it works<br/>Features<br/>Demo</div>
              </div>

              <div>
                <div className="font-semibold">Company</div>
                <div className="text-sm text-gray-500 mt-2">About<br/>Careers<br/>Contact</div>
              </div>
            </div>

            <div className="text-right text-sm text-gray-500">
              © {new Date().getFullYear()} EcoCollect. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}


function FeatureCard({title, desc, icon}){
  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center">{icon()}</div>
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-500 mt-1">{desc}</div>
        </div>
      </div>
    </div>
  )
}

function StepCard({number, title, desc}){
  return (
    <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm text-left">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold">{number}</div>
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-500 mt-1">{desc}</div>
        </div>
      </div>
    </div>
  )
}
