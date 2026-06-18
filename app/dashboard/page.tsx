"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  TrendingUp,
  Users,
  BarChart3,
  GitBranch,
  Settings,
  Search,
  Bell,
  LogOut,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Sparkles,
  Sun,
  Moon,
  AlertTriangle,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  fetchDashboard,
  triggerCustomerNudge,
  exportCustomersCsv,
  clearToken,
  getToken,
  type DashboardData,
  type Customer,
} from "@/lib/api"

export default function DashboardPage() {
  const router = useRouter()
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [search, setSearch] = React.useState("")
  const [searchDebounced, setSearchDebounced] = React.useState("")
  const [dashboard, setDashboard] = React.useState<DashboardData | null>(null)
  const [actionLoading, setActionLoading] = React.useState<number | null>(null)
  const [exporting, setExporting] = React.useState(false)

  const [simLogins, setSimLogins] = React.useState(15)
  const [simTickets, setSimTickets] = React.useState(2)
  const [simInvoiceDays, setSimInvoiceDays] = React.useState(5)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!getToken()) {
      router.replace("/login")
      return
    }
  }, [router])

  React.useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const loadDashboard = React.useCallback(async () => {
    if (!getToken()) return

    try {
      setError("")
      const data = await fetchDashboard(searchDebounced || undefined)
      setDashboard(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load dashboard"
      if (message.includes("Authentication") || message.includes("token")) {
        clearToken()
        router.replace("/login")
        return
      }
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [searchDebounced, router])

  React.useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const calculateSimulatedRisk = () => {
    let base = 40
    base -= simLogins * 1.5
    base += simTickets * 8
    base += simInvoiceDays * 1.2
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

  const handleTriggerNudge = async (customer: Customer) => {
    setActionLoading(customer.id)
    try {
      await triggerCustomerNudge(customer.id)
      await loadDashboard()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to trigger nudge")
    } finally {
      setActionLoading(null)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      await exportCustomersCsv()
    } catch {
      setError("Failed to export CSV")
    } finally {
      setExporting(false)
    }
  }

  const handleSignOut = () => {
    clearToken()
    router.push("/login")
  }

  const userInitials = dashboard?.user.name
    ? dashboard.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U"

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-muted-foreground">Loading your churn console...</p>
        </div>
      </div>
    )
  }

  const metrics = dashboard?.metrics
  const customers = dashboard?.customers ?? []
  const alerts = dashboard?.alerts ?? []
  const integrations = dashboard?.integrations ?? []

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">

      <aside className="w-64 border-r border-border/40 bg-card hidden md:flex flex-col justify-between py-6">
        <div className="space-y-8">
          <div className="px-6 flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-sm">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span>Retain<span className="text-indigo-600 dark:text-indigo-400">AI</span></span>
          </div>

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

        <div className="px-4 space-y-4">
          <div className="p-3 border border-border rounded-2xl bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                {userInitials}
              </div>
              <div className="text-[10px]">
                <p className="font-bold">{dashboard?.user.name}</p>
                <p className="text-muted-foreground">{dashboard?.user.email}</p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start text-xs rounded-xl text-muted-foreground hover:text-destructive gap-2.5"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      <div className="flex-grow flex flex-col min-w-0">
        <header className="h-16 border-b border-border/40 bg-card/50 backdrop-blur-sm px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-grow md:max-w-md">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search customer account, domains, playbooks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-foreground"
            />
          </div>

          <div className="flex items-center gap-4">
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
              {alerts.length > 0 && (
                <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-destructive rounded-full" />
              )}
            </Button>

            <span className="h-4 w-px bg-border/40" />

            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md font-bold">
              {(dashboard?.user.plan || "trial").toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-indigo-200/50 bg-indigo-50/50 dark:border-indigo-500/20 dark:bg-indigo-950/30 rounded-2xl">
            <div>
              <h2 className="text-sm font-bold flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                Welcome back, {dashboard?.user.name?.split(" ")[0]}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Live metrics for {dashboard?.user.company} — {customers.length} accounts monitored.
              </p>
            </div>
            <Link href="/pricing">
              <Button size="sm" className="bg-indigo-600 text-white rounded-xl text-xs">Upgrade Plan</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Monitored MRR", value: metrics?.monitoredMrrFormatted ?? "$0", trend: metrics?.mrrTrend ?? "", isUp: true },
              { label: "Average Churn Risk", value: metrics?.avgChurnRiskFormatted ?? "0%", trend: metrics?.churnTrend ?? "", isUp: false },
              { label: "Recovered Revenue", value: metrics?.recoveredRevenueFormatted ?? "$0", trend: metrics?.recoveredTrend ?? "", isUp: true },
              { label: "Active Playbooks", value: metrics?.activePlaybooksFormatted ?? "0", trend: "SOC2 Autopilot enabled", isUp: true, detail: true }
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            <div className="lg:col-span-8 bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold">High-Risk Retention Targets</h3>
                  <p className="text-[10px] text-muted-foreground">Customers who triggered risk flags in the last 48 hours.</p>
                </div>
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="px-2 py-0.5 border rounded bg-muted text-[10px] font-mono text-muted-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
                >
                  {exporting ? "Exporting..." : "CSV Export"}
                </button>
              </div>

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
                    {customers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          {search ? "No customers match your search." : "No customers found."}
                        </td>
                      </tr>
                    ) : (
                      customers.map((c) => (
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
                                  className={`h-full rounded-full ${c.health < 40 ? "bg-destructive" : c.health < 70 ? "bg-yellow-500" : "bg-emerald-500"}`}
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
                              disabled={actionLoading === c.id}
                              onClick={() => handleTriggerNudge(c)}
                              className="rounded-lg h-7 px-2.5 text-[10px] border-border hover:bg-muted"
                            >
                              {actionLoading === c.id ? "..." : "Trigger Nudge"}
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

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

              <div className="pt-4 border-t border-border/40 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-muted-foreground">Estimated Churn Likelihood</span>
                  <span className={`text-base font-extrabold font-mono px-2 py-0.5 border rounded-full ${getRiskColor(simRisk)}`}>
                    {simRisk}%
                  </span>
                </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Retention Feed Alerts
              </h3>
              <div className="space-y-3 text-xs">
                {alerts.length === 0 ? (
                  <p className="text-muted-foreground text-[11px]">No alerts yet.</p>
                ) : (
                  alerts.map((log) => (
                    <div key={log.id} className="flex justify-between items-start gap-4 p-2.5 rounded-lg bg-muted/20 border border-border/20">
                      <p className={`text-[11px] ${log.color}`}>{log.text}</p>
                      <span className="text-[9px] text-muted-foreground flex-shrink-0 mt-0.5">{log.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold">Connected Pipelines</h3>
                <p className="text-[10px] text-muted-foreground">Your billing engine and event datastores connected to our ML server.</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {integrations.map((sync) => (
                  <div key={sync.id} className="p-3 border border-border rounded-xl bg-muted/20">
                    <span className="text-xs font-bold block">{sync.name}</span>
                    <span className="text-[9px] font-mono text-emerald-500 font-bold mt-1 block">● {sync.status}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-2">
                <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-emerald-500" /> SOC2 Secure</span>
                <span>Last Sync: {dashboard?.lastSync ?? "—"}</span>
              </div>
            </div>

          </div>

        </main>
      </div>

    </div>
  )
}
