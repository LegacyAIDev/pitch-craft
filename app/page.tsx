import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-beige-dark/30">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <span className="font-heading text-2xl tracking-wide text-navy sm:text-3xl">
            PitchCraft
          </span>
          <div className="flex items-center gap-6">
            <a
              href="#how-it-works"
              className="hidden text-navy/80 hover:text-navy sm:block"
            >
              How it works
            </a>
            <a
              href="#features"
              className="hidden text-navy/80 hover:text-navy sm:block"
            >
              Features
            </a>
            <Link
              href="/signup"
              className="rounded-lg bg-navy px-5 py-2.5 font-medium text-white transition hover:bg-navy/90"
            >
              Start Free Trial
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-navy px-5 py-2.5 font-medium text-navy transition hover:bg-navy/5"
            >
              Log in
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative overflow-hidden bg-white pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-36"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <p className="font-accent mb-4 text-sm uppercase tracking-widest text-navy/70">
                AI-Powered Proposals
              </p>
              <h1 className="font-heading text-4xl leading-[1.1] tracking-wide text-navy sm:text-5xl lg:text-6xl xl:text-7xl">
                From Discovery Call to Ready-to-Send Proposal in Minutes
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy/80 sm:text-xl">
                AI-powered discovery calls that automatically generate complete
                project proposals. No more manual quoting, formatting, or
                follow-up delays.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-navy px-6 py-3.5 font-semibold text-white transition hover:bg-navy/90"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="#proposal-preview"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-navy px-6 py-3.5 font-semibold text-navy transition hover:bg-navy/5"
                >
                  See Sample Proposal
                </Link>
              </div>
              <div className="mt-12 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-beige/80 px-3 py-1 text-sm font-medium text-navy">
                  500+ agencies close deals faster
                </span>
              </div>
            </div>
            {/* Hero visual: split mockup */}
            <div className="relative">
              <div className="overflow-hidden rounded-xl border border-beige-dark shadow-xl shadow-navy/10">
                <div className="grid grid-cols-2 divide-x divide-beige-dark">
                  <div className="bg-beige/50 p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-xs font-medium text-navy/70">
                        Discovery call
                      </span>
                    </div>
                    <div className="space-y-2 rounded-lg bg-white p-3 text-sm shadow-inner">
                      <div className="h-3 w-3/4 rounded bg-navy/20" />
                      <div className="h-3 w-full rounded bg-navy/10" />
                      <div className="h-3 w-2/3 rounded bg-navy/10" />
                    </div>
                    <div className="mt-4 rounded-lg border border-beige-dark bg-white p-2 text-xs text-navy/60">
                      AI Agent: &quot;What&apos;s your timeline?&quot;
                    </div>
                  </div>
                  <div className="bg-white p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-xs font-medium text-navy/70">
                        Proposal
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs text-navy/80">
                      <div className="border-l-2 border-navy pl-2 font-medium">
                        Executive Summary
                      </div>
                      <div className="h-1 w-full rounded bg-beige" />
                      <div className="h-1 w-4/5 rounded bg-beige" />
                      <div className="border-l-2 border-beige-dark pl-2">
                        Scope &amp; Timeline
                      </div>
                      <div className="h-1 w-3/4 rounded bg-beige" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Solution Section */}
      <section
        id="problem-solution"
        className="bg-beige/40 py-20 sm:py-24"
        aria-label="Problem and solution"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 className="font-heading text-3xl tracking-wide text-navy sm:text-4xl">
                The Problem
              </h2>
              <ul className="mt-8 space-y-4">
                {[
                  "Hours spent writing proposals from scratch",
                  "Inconsistent formatting and pricing",
                  "Delayed follow-ups—momentum lost after discovery",
                  "Scope documentation eating into billable time",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-navy" />
                    <span className="text-lg text-navy/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-heading text-3xl tracking-wide text-navy sm:text-4xl">
                The Solution
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-navy/90">
                AI transforms discovery conversations into professional
                proposals instantly. Set your expertise and templates once—then
                let every call become a ready-to-send proposal.
              </p>
              <div className="mt-8 flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white">
                  ✓
                </span>
                <span className="font-medium text-navy">
                  Same-day proposals. No more cold leads.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="bg-white py-20 sm:py-24"
        aria-label="How it works"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-center text-3xl tracking-wide text-navy sm:text-4xl lg:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-navy/80">
            Four simple steps from discovery to signed proposal.
          </p>
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "1",
                title: "Customize Your AI Agent",
                desc: "Set up your discovery call agent with your expertise, pricing model, and proposal templates.",
              },
              {
                step: "2",
                title: "Conduct Discovery",
                desc: "Share your personalized link for AI-powered discovery calls OR use with Fireflies meeting recordings.",
              },
              {
                step: "3",
                title: "AI Generates Everything",
                desc: "Automatically creates accurate quotes, timelines, and complete project scope.",
              },
              {
                step: "4",
                title: "Send Professional Proposal",
                desc: "Receive a beautifully formatted, ready-to-send proposal document instantly.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-xl bg-beige/50 p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-beige-dark font-heading text-2xl text-navy">
                  {item.step}
                </div>
                <h3 className="font-heading text-xl tracking-wide text-navy">
                  {item.title}
                </h3>
                <p className="mt-3 text-navy/80">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="bg-beige/30 py-20 sm:py-24"
        aria-label="Features"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-center text-3xl tracking-wide text-navy sm:text-4xl lg:text-5xl">
            Everything You Need to Close Deals
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-navy/80">
            Smart discovery and proposal tools built for service providers.
          </p>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Smart Discovery Calls",
                desc: "AI-powered chat + voice conversations with clients",
              },
              {
                title: "Fireflies Integration",
                desc: "Upload meeting recordings for instant proposal generation",
              },
              {
                title: "Complete Proposal Creation",
                desc: "Full project scope, timeline, pricing, and terms",
              },
              {
                title: "Accurate Quote Generation",
                desc: "ML-based pricing predictions from your historical data",
              },
              {
                title: "Professional Formatting",
                desc: "Branded proposals with your logo and styling",
              },
              {
                title: "Customizable Templates",
                desc: "Personalize proposal structure and content",
              },
              {
                title: "Instant Delivery",
                desc: "Send proposals while the discovery call is still fresh",
              },
              {
                title: "Historical Learning",
                desc: "Improves accuracy based on your past projects",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-white">
                  ✓
                </div>
                <div>
                  <h3 className="font-heading text-lg tracking-wide text-navy">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-navy/80">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discovery Options */}
      <section
        id="discovery-options"
        className="bg-white py-20 sm:py-24"
        aria-label="Discovery options"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-center text-3xl tracking-wide text-navy sm:text-4xl lg:text-5xl">
            Two Ways to Generate Proposals
          </h2>
          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            <div className="rounded-2xl border-2 border-navy/20 bg-beige/30 p-8 lg:p-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white font-heading text-xl">
                1
              </div>
              <h3 className="font-heading text-2xl tracking-wide text-navy">
                Live Discovery Agent
              </h3>
              <ul className="mt-6 space-y-3 text-navy/90">
                <li className="flex gap-2">
                  <span className="text-navy">•</span>
                  Custom AI agent for real-time client conversations
                </li>
                <li className="flex gap-2">
                  <span className="text-navy">•</span>
                  Chat + voice capabilities for natural interactions
                </li>
                <li className="flex gap-2">
                  <span className="text-navy">•</span>
                  Instant proposal generation upon call completion
                </li>
                <li className="flex gap-2">
                  <span className="text-navy">•</span>
                  Shareable links for 24/7 client access
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-navy/20 bg-beige/30 p-8 lg:p-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white font-heading text-xl">
                2
              </div>
              <h3 className="font-heading text-2xl tracking-wide text-navy">
                Fireflies Integration
              </h3>
              <ul className="mt-6 space-y-3 text-navy/90">
                <li className="flex gap-2">
                  <span className="text-navy">•</span>
                  Upload any meeting recording from Fireflies
                </li>
                <li className="flex gap-2">
                  <span className="text-navy">•</span>
                  AI analyzes the entire conversation
                </li>
                <li className="flex gap-2">
                  <span className="text-navy">•</span>
                  Extracts requirements, scope, and client preferences
                </li>
                <li className="flex gap-2">
                  <span className="text-navy">•</span>
                  Generates complete proposal from recorded discovery
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Proposal Preview */}
      <section
        id="proposal-preview"
        className="bg-beige/40 py-20 sm:py-24"
        aria-label="Proposal preview"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-center text-3xl tracking-wide text-navy sm:text-4xl lg:text-5xl">
            Professional Proposals, Every Time
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-navy/80">
            Sample structure of a PitchCraft-generated proposal.
          </p>
          <div className="mx-auto mt-12 max-w-2xl overflow-hidden rounded-xl border border-beige-dark bg-white shadow-xl">
            <div className="border-b border-beige-dark bg-beige/50 px-6 py-4">
              <p className="font-accent text-sm text-navy/70">Project Proposal</p>
              <p className="font-heading text-xl text-navy">Acme Co. — Website Redesign</p>
            </div>
            <div className="space-y-6 p-6 text-navy/90">
              {[
                "Executive Summary",
                "Project Scope & Features",
                "Timeline & Milestones",
                "Investment & Pricing",
                "Terms & Conditions",
                "Next Steps",
              ].map((section) => (
                <div key={section} className="border-l-2 border-navy pl-4">
                  <h4 className="font-medium text-navy">{section}</h4>
                  <p className="mt-1 text-sm text-navy/70">
                    Professional, branded content generated from your discovery
                    call.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section
        id="before-after"
        className="bg-white py-20 sm:py-24"
        aria-label="Before and after comparison"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-center text-3xl tracking-wide text-navy sm:text-4xl lg:text-5xl">
            Before vs. After PitchCraft
          </h2>
          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            <div className="rounded-2xl border border-red-200/50 bg-red-50/30 p-8">
              <h3 className="font-heading text-2xl tracking-wide text-navy">
                Before PitchCraft
              </h3>
              <ul className="mt-6 space-y-3 text-navy/90">
                <li>2–3 days to create proposals manually</li>
                <li>Inconsistent pricing and formatting</li>
                <li>Lost momentum after discovery calls</li>
                <li>Hours spent on scope documentation</li>
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-navy/30 bg-beige/40 p-8">
              <h3 className="font-heading text-2xl tracking-wide text-navy">
                After PitchCraft
              </h3>
              <ul className="mt-6 space-y-3 text-navy/90">
                <li>Professional proposals in under 10 minutes</li>
                <li>Consistent, accurate pricing every time</li>
                <li>Strike while the iron is hot</li>
                <li>AI handles all documentation and formatting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section
        id="social-proof"
        className="bg-beige/40 py-20 sm:py-24"
        aria-label="Social proof"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-center text-3xl tracking-wide text-navy sm:text-4xl">
            Trusted by Agencies &amp; Service Providers
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-navy/50">
            {["Acme Agency", "BuildRight", "Scale Labs", "Peak Consulting", "Flow Studio"].map(
              (name) => (
                <span
                  key={name}
                  className="font-heading text-xl tracking-wide sm:text-2xl"
                >
                  {name}
                </span>
              )
            )}
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "95%", label: "quote accuracy" },
              { value: "10x", label: "faster proposals" },
              { value: "40%", label: "higher close rates" },
              { value: "Same-day", label: "proposal delivery" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading text-4xl tracking-wide text-navy sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-navy/80">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-navy px-8 py-4 font-semibold text-white transition hover:bg-navy/90"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-beige-dark bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            <span className="font-heading text-2xl tracking-wide text-navy">
              PitchCraft
            </span>
            <nav className="flex flex-wrap items-center justify-center gap-6 text-navy/80">
              <a href="#how-it-works" className="hover:text-navy">
                How it works
              </a>
              <a href="#features" className="hover:text-navy">
                Features
              </a>
              <a href="#proposal-preview" className="hover:text-navy">
                Sample Proposal
              </a>
              <a href="/login" className="hover:text-navy">
                Log in
              </a>
              <Link href="/signup" className="hover:text-navy">
                Sign up
              </Link>
            </nav>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-navy/60 hover:text-navy"
                aria-label="Twitter"
              >
                𝕏
              </a>
              <a
                href="#"
                className="text-navy/60 hover:text-navy"
                aria-label="LinkedIn"
              >
                in
              </a>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-navy/60">
            © {new Date().getFullYear()} PitchCraft. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
