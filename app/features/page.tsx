"use client"

import * as React from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  Zap,
  Activity,
  GitBranch,
  Database,
  Check,
  Play,
  ArrowRight,
  TrendingDown,
  Lock,
  RefreshCw,
  Cpu,
  BarChart3
} from "lucide-react"

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = React.useState("ai")

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-indigo-500/30">
      <Header />

      <main className="flex-grow">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(115%_120%_at_top_left,rgba(99,102,241,0.05)_0%,transparent_70%)]" />
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Product Capabilities</span>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                Every tool you need to stop churn in its tracks
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                RetainAI combines enterprise-grade machine learning models with powerful workflow automation. Understand why customers leave, predict exactly when they will, and step in instantly.
              </p>
            </div>
          </div>
        </section>

        {/* INTERACTIVE SHOCK-VALUE FEATURE SHOWCASE */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

            {/* Tab navigation */}
            <div className="lg:col-span-4 flex flex-col justify-center space-y-4">
              {[
                { id: "ai", label: "Predictive AI Engine", desc: "Flag accounts based on microscopic changes in product utilization.", icon: <Cpu className="h-5 w-5" /> },
                { id: "playbooks", label: "Retention Playbooks", desc: "Trigger personalized emails, discount codes, or sales notifications.", icon: <GitBranch className="h-5 w-5" /> },
                { id: "integrations", label: "Integrations & Sync", desc: "Pull clean customer events directly from Stripe, SQL, or CRM platforms.", icon: <Database className="h-5 w-5" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-200 ${activeTab === tab.id
                    ? "bg-card border-indigo-500 shadow-md ring-2 ring-indigo-500/10"
                    : "bg-muted/10 border-border/40 hover:bg-muted/30"
                    }`}
                >
                  <div className={`p-2.5 rounded-xl ${activeTab === tab.id ? "bg-indigo-600 text-white" : "bg-muted text-muted-foreground"
                    }`}>
                    {tab.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{tab.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{tab.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Visualizer screen */}
            <div className="lg:col-span-8 border border-border/60 rounded-3xl p-6 bg-card shadow-lg flex flex-col justify-between min-h-[400px] relative overflow-hidden">

              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

              {/* TAB 1 CONTENT - PREDICTIVE AI */}
              {activeTab === "ai" && (
                <div className="animate-in fade-in-40 slide-in-from-right-4 duration-300 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">Explainable AI</span>
                        <h4 className="text-lg font-bold">Risk Assessment Simulator</h4>
                      </div>
                      <span className="text-xs font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full font-bold">Accuracy: 94.2%</span>
                    </div>

                    <div className="bg-muted/30 border border-border/40 rounded-xl p-4 mb-6">
                      <div className="flex justify-between items-center pb-3 border-b border-border/20 mb-3">
                        <span className="text-xs font-bold">Acme Corp</span>
                        <span className="text-xs text-destructive font-mono font-bold">Risk: 78%</span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Session frequency reduction</span>
                            <span className="text-destructive font-semibold">-42% vs avg</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-destructive rounded-full" style={{ width: "42%" }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Open Support Tickets (High Priority)</span>
                            <span className="text-destructive font-semibold">3 unresolved</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-destructive rounded-full" style={{ width: "75%" }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">API Error Rate</span>
                            <span className="text-yellow-600 dark:text-yellow-400 font-semibold">+18% spike</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: "18%" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground border-t border-border/30 pt-4 flex justify-between items-center">
                    <span>Feature Weights: Usage (45%), Support (35%), Billing (20%)</span>
                    <Link href="/dashboard" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1">
                      See live model <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* TAB 2 CONTENT - PLAYBOOKS */}
              {activeTab === "playbooks" && (
                <div className="animate-in fade-in-40 slide-in-from-right-4 duration-300 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-violet-500 tracking-wider">Automated Workflows</span>
                        <h4 className="text-lg font-bold">Active Retention Sequence</h4>
                      </div>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-bold">Enabled</span>
                    </div>

                    {/* Flow Diagram Mockup */}
                    <div className="space-y-4 relative">
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-muted/20">
                        <div className="h-7 w-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">1</div>
                        <div className="text-xs">
                          <p className="font-bold">TRIGGER: Churn Risk Exceeds 70%</p>
                          <p className="text-muted-foreground text-[10px]">Monitored continuously for all Pro & Enterprise accounts.</p>
                        </div>
                      </div>

                      <div className="h-6 w-0.5 bg-border/60 ml-6" />

                      <div className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-muted/20">
                        <div className="h-7 w-7 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold">2</div>
                        <div className="text-xs">
                          <p className="font-bold">ACTION: Alert Customer Success Manager (Slack)</p>
                          <p className="text-muted-foreground text-[10px]">Dispatches account diagnostics to #cs-urgent channel.</p>
                        </div>
                      </div>

                      <div className="h-6 w-0.5 bg-border/60 ml-6" />

                      <div className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-muted/20">
                        <div className="h-7 w-7 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-bold">3</div>
                        <div className="text-xs">
                          <p className="font-bold">ACTION: Dispatch Retention Offer Email</p>
                          <p className="text-muted-foreground text-[10px]">Sends custom meeting link and temporary 15% billing credit.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground border-t border-border/30 pt-4 flex justify-between items-center mt-4">
                    <span>Average rescue rate with this flow: 34.8% of targeted users</span>
                    <span className="font-semibold text-violet-600 dark:text-violet-400">Autopilot Ready</span>
                  </div>
                </div>
              )}

              {/* TAB 3 CONTENT - INTEGRATIONS */}
              {activeTab === "integrations" && (
                <div className="animate-in fade-in-40 slide-in-from-right-4 duration-300 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-cyan-500 tracking-wider">Sync Pipeline</span>
                        <h4 className="text-lg font-bold">Connected Platforms</h4>
                      </div>
                      <span className="text-xs text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full font-bold">Real-time</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { name: "Stripe", type: "Billing & Subscriptions", status: "Active" },
                        { name: "HubSpot", type: "CRM Customer Data", status: "Active" },
                        { name: "PostgreSQL", type: "Product Event DB", status: "Active" },
                        { name: "Segment", type: "Live Activity Tracking", status: "Ready to pair" },
                        { name: "Zendesk", type: "Support Tickets", status: "Active" },
                        { name: "Slack", type: "Internal Notifications", status: "Active" }
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 border border-border/40 rounded-xl bg-muted/10 hover:bg-muted/30 transition-colors">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold">{item.name}</span>
                            <span className={`h-1.5 w-1.5 rounded-full ${item.status === "Active" ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                          </div>
                          <p className="text-[9px] text-muted-foreground">{item.type}</p>
                          <p className="text-[8px] font-mono mt-2 uppercase tracking-wide text-muted-foreground">{item.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground border-t border-border/30 pt-4 flex justify-between items-center mt-6">
                    <span>Database calls encrypted with AES-256 TLS 1.3</span>
                    <a href="#" className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">API Docs</a>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* DETAILS GRID */}
        <section className="py-24 border-t border-border/40 bg-muted/10 transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl font-bold tracking-tight">Granular Insights, Automated Interventions</h2>
              <p className="mt-4 text-base text-muted-foreground">
                We bridge the gap between heavy, unreadable logs and high-converting customer rescue operations.
              </p>
            </div>

            <div className="space-y-24">

              {/* Feature 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Activity className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Deep Customer Health Scoring</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We process raw database event streams to compile a consolidated health index. Understand how many seat logins drop over weekends, how usage correlates with billing size, and receive early warning metrics before a customer makes up their mind to leave.
                  </p>
                  <ul className="space-y-3">
                    {["Flag inactive license seats", "Correlate customer ticket severity with revenue", "Analyze key feature drop-offs in dashboard sessions"].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 rounded-3xl border border-border bg-card shadow-md flex justify-center items-center h-[320px] bg-gradient-to-br from-indigo-50/20 to-cyan-50/20 dark:from-indigo-950/10 dark:to-cyan-950/10">
                  <div className="text-center space-y-4">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Health Matrix</span>
                    <p className="text-sm font-semibold">Interactive Risk Thresholds</p>
                    <div className="flex gap-2">
                      <span className="px-4 py-2 border rounded-xl bg-background text-xs font-semibold text-emerald-500 border-emerald-500/20">90-100: Safe</span>
                      <span className="px-4 py-2 border rounded-xl bg-background text-xs font-semibold text-yellow-500 border-yellow-500/20">60-89: Warning</span>
                      <span className="px-4 py-2 border rounded-xl bg-background text-xs font-semibold text-destructive border-destructive/20">0-59: Danger</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse">
                <div className="lg:order-2 space-y-6">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <GitBranch className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">No-Code Actionable Playbooks</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Customer success teams are often too busy. RetainAI automates high-value, repetitive workflows. Build logical pathways to alert the specific customer success representative, trigger customer satisfaction surveys, or credit billing cycles instantly when high churn thresholds trigger.
                  </p>
                  <ul className="space-y-3">
                    {["Automated Slack alerts with direct account summaries", "Conditional logic branches (revenue/age/tier)", "Direct API webhook integrations to trigger email workflows"].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:order-1 p-8 rounded-3xl border border-border bg-card shadow-md flex justify-center items-center h-[320px] bg-gradient-to-bl from-indigo-50/20 to-cyan-50/20 dark:from-indigo-950/10 dark:to-cyan-950/10">
                  <div className="text-center space-y-4">
                    <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">Visual Workflows</span>
                    <p className="text-sm font-semibold">Drag-and-Drop Editor Preview</p>
                    <div className="h-16 w-48 border border-dashed border-border/80 rounded-xl flex items-center justify-center text-xs text-muted-foreground bg-background">
                      + Add Step to Sequence
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECURITY & DATA COMPLIANCE */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8 border-t border-border/40">
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Lock className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-wider">Enterprise Security</span>
              </div>
              <h3 className="text-2xl font-bold">Data Privacy is Our Priority</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We handle customer tracking profiles with care. RetainAI is SOC2 Type II certified, fully compliant with GDPR regulations, and utilizes end-to-end TLS 1.3 encryption protocols. We never store personal customer credentials.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center md:justify-end text-xs font-mono font-bold text-muted-foreground">
              <span className="px-4 py-2 border rounded-xl bg-muted/20">SOC2 CERTIFIED</span>
              <span className="px-4 py-2 border rounded-xl bg-muted/20">GDPR COMPLIANT</span>
              <span className="px-4 py-2 border rounded-xl bg-muted/20">AES-256 SECURED</span>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
          <div className="relative isolate overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-16 text-center shadow-2xl rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to plug revenue leaks?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-indigo-100 text-sm">
              Connect Stripe or database credentials in less than two hours. Start diagnosing risk profiles instantly.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl px-8 shadow-sm">
                  Start Your Free Trial
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white rounded-xl px-8 font-semibold">
                  View Detailed Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
