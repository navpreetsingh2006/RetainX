"use client"

import * as React from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  TrendingDown,
  Zap,
  ShieldCheck,
  Users,
  BarChart3,
  CheckCircle,
  Sparkles,
  ChevronRight,
  Database,
  Smartphone
} from "lucide-react"

export default function Page() {
  // Calculator State
  const [mrr, setMrr] = React.useState(50000)
  const [churnRate, setChurnRate] = React.useState(5)
  const [retentionRate, setRetentionRate] = React.useState(30)

  // Calculations
  const monthlyRevenueLost = mrr * (churnRate / 100)
  const yearlyRevenueLost = monthlyRevenueLost * 12
  const potentialYearlySavings = yearlyRevenueLost * (retentionRate / 100)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-indigo-500/30">
      <Header />

      {/* Main Content */}
      <main className="flex-grow">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 lg:pt-32 lg:pb-40">
          {/* Background Gradients */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-background to-background dark:from-indigo-950/20 dark:via-background dark:to-background" />
          <div className="absolute top-20 right-0 -z-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-500/10" />
          <div className="absolute bottom-20 left-10 -z-10 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-600/10" />

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto space-y-8">

              {/* Feature Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-200/50 bg-indigo-50/50 dark:border-indigo-500/20 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:scale-105 transition-transform duration-200 cursor-pointer">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                <span>AI-Powered Retention Engine v3.2</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                Predict Customer Churn.<br />
                <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  Retain Your Revenue.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                RetainAI integrates with your billing and product database to analyze usage trends and flag high-risk customers before they hit cancel. Automate direct playbooks to retain them.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-xl shadow-indigo-500/20 rounded-xl px-8 font-semibold transition-all duration-200 hover:-translate-y-0.5">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="border-border hover:bg-muted/50 rounded-xl px-8 font-semibold transition-all duration-200 hover:-translate-y-0.5">
                    Explore Demo Dashboard
                  </Button>
                </Link>
              </div>

              {/* Dashboard Preview mockup */}
              <div className="relative mt-16 rounded-2xl border border-border/60 bg-card p-4 shadow-2xl dark:shadow-indigo-500/5 animate-in fade-in-50 slide-in-from-bottom-8 duration-1000 max-w-5xl mx-auto">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-destructive" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground ml-2 font-mono">app.retainai.com/dashboard</span>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground">Live Feed</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Mock Left Column - High Churn Risks */}
                  <div className="md:col-span-2 border border-border/40 rounded-xl p-4 bg-muted/20 text-left">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-semibold">High Churn Risk Customers</h3>
                      <span className="text-xs text-destructive bg-destructive/10 px-2 py-0.5 rounded-full font-medium">8 at High Risk</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: "Acme Enterprise", risk: "84%", trend: "-24% activity", mrr: "$4,500/mo", health: "Poor", color: "text-destructive bg-destructive/10" },
                        { name: "Global Logistics", risk: "72%", trend: "No logins 10d", mrr: "$1,800/mo", health: "Critical", color: "text-destructive bg-destructive/10" },
                        { name: "DevFlow SaaS", risk: "59%", trend: "-42% api calls", mrr: "$3,200/mo", health: "Warning", color: "text-yellow-600 bg-yellow-500/10 dark:text-yellow-400" },
                      ].map((customer, idx) => (
                        <div key={idx} className="flex flex-wrap items-center justify-between p-3 rounded-lg border border-border/40 bg-background/50 hover:bg-background transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                              {customer.name[0]}
                            </div>
                            <div>
                              <p className="text-xs font-semibold">{customer.name}</p>
                              <p className="text-[10px] text-muted-foreground">{customer.trend}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 mt-2 sm:mt-0">
                            <div>
                              <p className="text-[10px] text-muted-foreground text-right">MRR</p>
                              <p className="text-xs font-mono font-bold">{customer.mrr}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground text-right">Churn Risk</p>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${customer.color}`}>
                                {customer.risk}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mock Right Column - Retention Playbook Triggers */}
                  <div className="border border-border/40 rounded-xl p-4 bg-muted/20 text-left flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold mb-4">Autopilot Interventions</h3>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg border border-border/40 bg-background/50">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">EMAIL CAMPAIGN</span>
                            <span className="text-[9px] text-muted-foreground">10m ago</span>
                          </div>
                          <p className="text-xs font-semibold">Value Review Triggered</p>
                          <p className="text-[10px] text-muted-foreground mt-1">Sent custom usage breakdown to Acme Enterprise CEO.</p>
                        </div>
                        <div className="p-3 rounded-lg border border-border/40 bg-background/50">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400">DISCOUNT OFFER</span>
                            <span className="text-[9px] text-muted-foreground">2h ago</span>
                          </div>
                          <p className="text-xs font-semibold">Renewal Offer Sent</p>
                          <p className="text-[10px] text-muted-foreground mt-1">20% loyalty incentive dispatched to Global Logistics.</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-border/40 pt-4 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Autopilot Mode</span>
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* LOGO CLOUD */}
        <section className="py-12 border-y border-border/40 bg-muted/10 transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6">
              Empowering fast-growing teams at
            </p>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5 items-center justify-items-center opacity-65 grayscale hover:grayscale-0 transition-all duration-300">
              <span className="text-lg font-extrabold tracking-tight">STRIPE</span>
              <span className="text-lg font-extrabold tracking-tight">HUBSPOT</span>
              <span className="text-lg font-extrabold tracking-tight">SALESFORCE</span>
              <span className="text-lg font-extrabold tracking-tight">ZENDESK</span>
              <span className="text-lg font-extrabold tracking-tight hidden lg:block">INTERCOM</span>
            </div>
          </div>
        </section>

        {/* DYNAMIC CHURN CALCULATOR WIDGET */}
        <section className="py-24 bg-muted/20 dark:bg-muted/5 relative overflow-hidden transition-colors duration-300">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                See How Much Churn is Costing You
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Drag the sliders below to calculate your estimated annual revenue leakage and discover how much RetainAI can save you.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-card border border-border rounded-3xl p-6 md:p-10 shadow-xl">

              {/* Controls */}
              <div className="lg:col-span-7 space-y-8">

                {/* MRR Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-foreground">Monthly Recurring Revenue (MRR)</label>
                    <span className="text-lg font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                      ${mrr.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="1000000"
                    step="5000"
                    value={mrr}
                    onChange={(e) => setMrr(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$5k</span>
                    <span>$500k</span>
                    <span>$1M</span>
                  </div>
                </div>

                {/* Churn Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-foreground">Current Monthly Churn Rate</label>
                    <span className="text-lg font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                      {churnRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={churnRate}
                    onChange={(e) => setChurnRate(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1%</span>
                    <span>10%</span>
                    <span>20%</span>
                  </div>
                </div>

                {/* AI Improvement Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      Target Churn Reduction
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">Est. 30% Avg</span>
                    </label>
                    <span className="text-lg font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                      {retentionRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={retentionRate}
                    onChange={(e) => setRetentionRate(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>10%</span>
                    <span>30% (Average)</span>
                    <span>60%</span>
                  </div>
                </div>

              </div>

              {/* Calculations Box */}
              <div className="lg:col-span-5 flex flex-col justify-center rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-8 text-white shadow-inner relative overflow-hidden">
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-xl" />

                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-100">Annual Revenue Leaked</p>
                <p className="text-3xl font-mono font-black mt-1 text-white">${Math.round(yearlyRevenueLost).toLocaleString()}</p>

                <hr className="border-white/20 my-6" />

                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-200 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Potential Annual Savings
                  </p>
                  <p className="text-4xl font-mono font-black text-cyan-300">
                    ${Math.round(potentialYearlySavings).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-indigo-100 mt-2">
                    *Based on a {retentionRate}% recovery rate of churned accounts using Retain AI&apos;s triggers.
                  </p>
                </div>

                <Link href="/pricing" className="mt-8">
                  <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl shadow-md py-6 transition-all duration-200 hover:scale-[1.02]">
                    View Subscription Plans
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* CORE FEATURES HIGHLIGHT */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Stop Churn at Scale
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Complete Toolset for Customer Success & Ops
            </p>
            <p className="mt-4 text-base text-muted-foreground">
              Don`&apos;`t just watch customers leave. Detect signs of fatigue, target accounts accurately, and automate communication in one unified pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
                title: "AI Churn Scoring",
                desc: "Our machine learning models constantly evaluate account health. Get precise, explainable churn probability scores for every single customer."
              },
              {
                icon: <BarChart3 className="h-6 w-6 text-violet-600 dark:text-violet-400" />,
                title: "Behavioral Analytics",
                desc: "Track critical product event drop-offs, user login anomalies, API utilization dips, and key license seats abandonment in real-time."
              },
              {
                icon: <Users className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />,
                title: "Automated Playbooks",
                desc: "Deploy custom discount codes, schedule automated value review check-ins, or ping account executives instantly via Slack or email."
              },
              {
                icon: <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
                title: "Health Index Reporting",
                desc: "Segment customer cohorts by revenue tier, health score index, or customer lifetime value to prioritize high-value rescue attempts."
              },
              {
                icon: <Database className="h-6 w-6 text-rose-600 dark:text-rose-400" />,
                title: "Ecosystem Integrations",
                desc: "One-click connection with Stripe, HubSpot, Salesforce, Segment, and Postgres database integrations to sync state effortlessly."
              },
              {
                icon: <Smartphone className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
                title: "Multi-Channel Alerts",
                desc: "Receive urgent high-risk alerts in Slack, MS Teams, email, or customize webhooks to trigger in-app messages to your customers."
              }
            ].map((feature, idx) => (
              <div key={idx} className="group relative rounded-2xl border border-border p-6 bg-card hover:border-indigo-500/40 hover:shadow-lg transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-muted/60 dark:bg-muted/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* METRICS & PROOF */}
        <section className="py-20 bg-indigo-900/5 dark:bg-indigo-950/20 border-y border-border/40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-y-12 md:grid-cols-3 md:gap-x-12 text-center">
              <div>
                <p className="text-5xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 font-mono">35%</p>
                <p className="mt-2 text-base font-semibold text-foreground">Average Churn Reduction</p>
                <p className="mt-1 text-sm text-muted-foreground">Within first 90 days of onboarding</p>
              </div>
              <div>
                <p className="text-5xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 font-mono">$2.4M</p>
                <p className="mt-2 text-base font-semibold text-foreground">Annual Revenue Recovered</p>
                <p className="mt-1 text-sm text-muted-foreground">Average recovery across mid-market clients</p>
              </div>
              <div>
                <p className="text-5xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 font-mono">&lt; 2hr</p>
                <p className="mt-2 text-base font-semibold text-foreground">Integration Setup</p>
                <p className="mt-1 text-sm text-muted-foreground">Standard SQL, Stripe & HubSpot sync</p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Success Stories
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by Top Revenue Teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "RetainAI helped us discover that 60% of our churn risk was related to api latency spikes. Once we built an alert to contact customers during downtime, our churn plummeted by 42%.",
                author: "Sarah Jenkins",
                role: "VP of Customer Success, DevFlow",
                initials: "SJ"
              },
              {
                quote: "Before RetainAI, customer success was reactively reading emails. Now, the team wakes up with a prioritised dashboard detailing exactly who needs help, and why. Best investment this year.",
                author: "Marcus Vance",
                role: "COO, Global Logistics SaaS",
                initials: "MV"
              },
              {
                quote: "Our playbooks run on autopilot. When an enterprise trial user drops active sessions, RetainAI schedules a CS sync automatically. It's like having an extra ops engineer on staff.",
                author: "Leah Chen",
                role: "Director of Operations, BizSync",
                initials: "LC"
              }
            ].map((t, idx) => (
              <div key={idx} className="flex flex-col justify-between p-8 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  {t.quote}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{t.author}</h4>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
          <div className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-950 dark:from-indigo-950 dark:via-indigo-900/80 dark:to-slate-950 px-6 py-20 text-center shadow-2xl rounded-3xl sm:px-16">
            <div className="absolute inset-0 -z-10 opacity-30 mix-blend-overlay bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent" />
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Start Protecting Your Subscription Revenue Today
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base text-indigo-200 leading-relaxed">
              Join hundreds of SaaS businesses using AI forecasting to keep their net revenue retention (NRR) above 110%. Get set up in under two hours.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-white text-indigo-950 hover:bg-indigo-50 font-bold rounded-xl py-6 px-8 shadow-md">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white rounded-xl py-6 px-8 font-semibold">
                  Talk to Sales <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex justify-center gap-8 text-xs text-indigo-300">
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-cyan-400" /> 14-day free trial</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-cyan-400" /> No credit card required</span>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
