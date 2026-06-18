"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  GitBranch,
  Settings,
  Search,
  Bell,
  LogOut,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Sun,
  Moon,
  Mail,
  AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Simulator State
  const [simLogins, setSimLogins] = React.useState(15)
  const [simTickets, setSimTickets] = React.useState(2)
  const [simInvoiceDays, setSimInvoiceDays] = React.useState(5)

  // Dynamic Churn Probability Logic
  // logins reduce risk, tickets & invoice delay increase risk
  const calculateSimulatedRisk = () => {
    let base = 40
    base -= simLogins * 1.5
    base += simTickets * 8
    base += simInvoiceDays * 1.2

    // clamp between 5 and 99
    return Math.max(5, Math.min(99, Math.round(base)))
  }

  const simRisk = calculateSimulatedRisk()

  const getRiskColor = (risk: number) => {
    if (risk >= 70) return "text-destructive border-destructive/20 bg-destructive/10"
    if (risk >= 45) return "text-yellow-600 dark:text-yellow-400 border-yellow-500/20 bg-yellow-500/10"
    return "text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
  }

  const getRiskBarColor = (risk: number) => {
    if (risk >= 70) return "bg-destructive"
    if (risk >= 45) return "bg-yellow-500"
    return "bg-emerald-500"
  }

  const getSuggestedPlaybook = (risk: number) => {
    if (risk >= 70) return "Urgent CSM outreach + 20% Retention discount"
    if (risk >= 45) return "Automated Value Review email sequence"
    return "No urgent playbooks. Add to standard monthly newsletter."
  }

  // Active High-Risk Customers data
  const [customers, setCustomers] = React.useState([
    { id: 1, name: "Acme Enterprise", email: "ceo@acme.com", risk: 84, mrr: 4500, health: 22, playbook: "Value Review Sent" },
    { id: 2, name: "Global Logistics", email: "ops@globallogistics.com", risk: 72, mrr: 1800, health: 35, playbook: "CSM Call Scheduled" },
    { id: 3, name: "DevFlow SaaS", email: "billing@devflow.io", risk: 59, mrr: 3200, health: 51, playbook: "Discount Offered" },
    { id: 4, name: "Alpha Agency", email: "contact@alpha.agency", risk: 48, mrr: 2100, health: 62, playbook: "None" },
    { id: 5, name: "Stripe Integrators", email: "dev@stripeintegrators.net", risk: 24, mrr: 9500, health: 81, playbook: "None" },
  ])

  // Trigger Action
  const triggerManualAction = (id: number, name: string) => {
    alert(`Playbook "Urgent Nudge" triggered automatically for ${name}. CSM notified via Slack.`)
    setCustomers(prev =>
      prev.map(c => c.id === id ? { ...c, playbook: "Manual CSM Pinged" } : c)
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-border/40 bg-card hidden md:flex flex-col justify-between py-6">
        <div className="space-y-8">

          {/* Logo */}
          <div className="px-6 flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-sm">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span>Retain<span className="text-indigo-600 dark:text-indigo-400">AI</span></span>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1 px-4">
            {[
              { label: "Overview Insights", icon: <BarChart3 className="h-4 w-4" />, active: true },
              { label: "Customer Health", icon: <Users className="h-4 w-4" /> },
              { label: "Automations & Playbooks", icon: <GitBranch className="h-4 w-4" /> },
              { label: "ML Sandbox", icon: <Sparkles className="h-4 w-4" /> },
              { label: "Settings & Billing", icon: <Settings className="h-4 w-4" /> },
            ].map((item, idx) => (
              <button
                key={idx}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${item.active
                    ? "bg-indigo-600 text-white"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* User profile footer info */}
        <div className="px-4 space-y-4">
          <div className="p-3 border border-border rounded-2xl bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                Demo
              </div>
              <div className="text-[10px]">
                <p className="font-bold">Alex Rivera</p>
                <p className="text-muted-foreground">alex@company.com</p>
              </div>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-xs rounded-xl text-muted-foreground hover:text-destructive gap-2.5">
              <LogOut className="h-4 w-4" />
              Sign Out to Home
            </Button>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-grow flex flex-col min-w-0">

        {/* HEADER BAR */}
        <header className="h-16 border-b border-border/40 bg-card/50 backdrop-blur-sm px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-grow md:max-w-md">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search customer account, domains, playbooks..."
              className="text-xs w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-foreground"
            />
          </div>

          <div className="flex items-center gap-4">

            {/* Quick Dark Mode Switch */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl w-8 h-8"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {mounted && resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-400" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-600" />
              )}
            </Button>

            <Button variant="ghost" size="icon" className="relative rounded-xl w-8 h-8">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-destructive rounded-full" />
            </Button>

            <span className="h-4 w-px bg-border/40" />

            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md font-bold">
              PRO SANDBOX
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT BODY */}
        <main className="p-6 md:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">

          {/* Welcome Alert */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-indigo-200/50 bg-indigo-50/50 dark:border-indigo-500/20 dark:bg-indigo-950/30 rounded-2xl">
            <div>
              <h2 className="text-sm font-bold flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400 animate-pulse" /> Welcome to your Churn Console Demo
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">We have imported sample metrics from Stripe billing records and product logs.</p>
            </div>
            <Link href="/pricing">
              <Button size="sm" className="bg-indigo-600 text-white rounded-xl text-xs">Upgrade to Live Production</Button>
            </Link>
          </div>

          {/* METRICS TOP ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Monitored MRR", value: "$340,500", trend: "+4.2% MoM", isUp: true },
              { label: "Average Churn Risk", value: "12.4%", trend: "-3.2% drop", isUp: false },
              { label: "Recovered Revenue", value: "$45,800", trend: "+12% this quarter", isUp: true },
              { label: "Active Playbooks", value: "4 Sequences", trend: "SOC2 Autopilot enabled", isUp: true, detail: true }
            ].map((metric, idx) => (
              <div key={idx} className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                <span className="text-xs font-semibold text-muted-foreground">{metric.label}</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-extrabold tracking-tight font-mono">{metric.value}</span>
                  {metric.detail ? (
                    <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">Autopilot</span>
                  ) : (
                    <span className={`text-[10px] font-bold flex items-center ${metric.isUp ? "text-emerald-500" : "text-destructive"}`}>
                      {metric.isUp ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                      {metric.trend}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* MAIN VISUAL LAYOUT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Table Area (Left Columns) */}
            <div className="lg:col-span-8 bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold">High-Risk Retention Targets</h3>
                  <p className="text-[10px] text-muted-foreground">Customers who triggered risk flags in the last 48 hours.</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 border rounded bg-muted text-[10px] font-mono text-muted-foreground">CSV Export</span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border/40 text-muted-foreground font-semibold">
                      <th className="pb-3">Account Name</th>
                      <th className="pb-3 text-center">Churn Risk</th>
                      <th className="pb-3 text-right">MRR</th>
                      <th className="pb-3 text-center">Health Index</th>
                      <th className="pb-3">Assigned Playbook</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id} className="border-b border-border/20 last:border-0 hover:bg-muted/10 transition-colors">
                        <td className="py-3.5">
                          <div className="font-semibold">{c.name}</div>
                          <div className="text-[10px] text-muted-foreground">{c.email}</div>
                        </td>
                        <td className="py-3.5 text-center">
                          <span className={`px-2 py-0.5 border rounded-full font-bold text-[9px] ${getRiskColor(c.risk)}`}>
                            {c.risk}%
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-mono font-bold">${c.mrr.toLocaleString()}</td>
                        <td className="py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${c.health < 40 ? "bg-destructive" : c.health < 70 ? "bg-yellow-500" : "bg-emerald-500"
                                  }`}
                                style={{ width: `${c.health}%` }}
                              />
                            </div>
                            <span className="font-bold font-mono text-[10px]">{c.health}</span>
                          </div>
                        </td>
                        <td className="py-3.5 text-muted-foreground text-[10px]">{c.playbook}</td>
                        <td className="py-3.5 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => triggerManualAction(c.id, c.name)}
                            className="rounded-lg h-7 px-2.5 text-[10px] border-border hover:bg-muted"
                          >
                            Trigger Nudge
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Sandbox / Simulator (Right Column) */}
            <div className="lg:col-span-4 bg-card border border-border rounded-2xl shadow-sm p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 border-b border-border/40 pb-3 mb-4">
                  <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <h3 className="text-sm font-bold">ML Model Risk Sandbox</h3>
                    <p className="text-[9px] text-muted-foreground">Simulate customer behavior to estimate churn score.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Logins Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <label>Weekly Logins</label>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">{simLogins} logins</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={simLogins}
                      onChange={(e) => setSimLogins(Number(e.target.value))}
                      className="w-full h-1 bg-muted rounded appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  {/* Open Tickets Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <label>Open Tickets (High Priority)</label>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">{simTickets} tickets</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="8"
                      value={simTickets}
                      onChange={(e) => setSimTickets(Number(e.target.value))}
                      className="w-full h-1 bg-muted rounded appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  {/* Overdue Invoices Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <label>Overdue Invoice Days</label>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">{simInvoiceDays} days</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={simInvoiceDays}
                      onChange={(e) => setSimInvoiceDays(Number(e.target.value))}
                      className="w-full h-1 bg-muted rounded appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="pt-4 border-t border-border/40 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-muted-foreground">Estimated Churn Likelihood</span>
                  <span className={`text-base font-extrabold font-mono px-2 py-0.5 border rounded-full ${getRiskColor(simRisk)}`}>
                    {simRisk}%
                  </span>
                </div>

                {/* Risk Progress Bar */}
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${getRiskBarColor(simRisk)}`}
                    style={{ width: `${simRisk}%` }}
                  />
                </div>

                <div className="p-3 bg-muted/20 border border-border rounded-xl space-y-1">
                  <p className="text-[9px] uppercase font-bold text-muted-foreground">Suggested Retention Playbook</p>
                  <p className="text-[11px] font-semibold">{getSuggestedPlaybook(simRisk)}</p>
                </div>
              </div>

            </div>

          </div>

          {/* INTEGRATIONS AND RECENT LOGS BAR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Recent Notifications / Logs */}
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Retention Feed Alerts
              </h3>
              <div className="space-y-3 text-xs">
                {[
                  { text: "Autopilot dispatched: 'High Risk Nudge' to DevFlow SaaS admin.", time: "12m ago", color: "text-indigo-600 dark:text-indigo-400" },
                  { text: "Acme Enterprise dropped logins below weekly threshold of 10.", time: "1h ago", color: "text-destructive" },
                  { text: "Customer Health score for Alpha Agency decreased from 72 to 62.", time: "3h ago", color: "text-yellow-600 dark:text-yellow-400" },
                ].map((log, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-4 p-2.5 rounded-lg bg-muted/20 border border-border/20">
                    <p className="text-[11px]">{log.text}</p>
                    <span className="text-[9px] text-muted-foreground flex-shrink-0 mt-0.5">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected Databases */}
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold">Connected Pipelines</h3>
                <p className="text-[10px] text-muted-foreground">Your billing engine and event datastores connected to our ML server.</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { name: "Stripe", status: "Active" },
                  { name: "HubSpot", status: "Active" },
                  { name: "PostgreSQL", status: "Active" }
                ].map((sync, idx) => (
                  <div key={idx} className="p-3 border border-border rounded-xl bg-muted/20">
                    <span className="text-xs font-bold block">{sync.name}</span>
                    <span className="text-[9px] font-mono text-emerald-500 font-bold mt-1 block">● {sync.status}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-2">
                <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-emerald-500" /> SOC2 Secure</span>
                <span>Last Sync: 4m ago</span>
              </div>
            </div>

          </div>

        </main>
      </div>

    </div>
  )
}
