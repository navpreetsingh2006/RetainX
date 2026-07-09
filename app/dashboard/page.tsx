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
  Loader2,
  Menu,
  X,
  RefreshCw,
  DollarSign,
  Activity,
  Zap,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  fetchDashboard,
  triggerCustomerNudge,
  exportCustomersCsv,
  fetchPrediction,
  clearToken,
  getToken,
  type DashboardData,
  type Customer,
} from "@/lib/api"

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: BarChart3 },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Playbooks", href: "/dashboard/playbooks", icon: GitBranch },
  { label: "ML Sandbox", href: "/dashboard/sandbox", icon: Sparkles },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

function getRiskColor(risk: number) {
  if (risk >= 70) return "text-destructive border-destructive/20 bg-destructive/10"
  if (risk >= 45) return "text-yellow-600 dark:text-yellow-400 border-yellow-500/20 bg-yellow-500/10"
  return "text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
}

function getRiskBarColor(risk: number) {
  if (risk >= 70) return "bg-destructive"
  if (risk >= 45) return "bg-yellow-500"
  return "bg-emerald-500"
}

function getSuggestedPlaybook(risk: number) {
  if (risk >= 70) return "Urgent CSM outreach + 20% retention discount"
  if (risk >= 45) return "Automated Value Review email sequence"
  return "No urgent playbooks. Add to monthly newsletter."
}

function CustomerCard({
  customer,
  onNudge,
  loading,
}: {
  customer: Customer
  onNudge: () => void
  loading: boolean
}) {
  return (
    <div className="p-4 rounded-2xl border border-border bg-card/50 hover:bg-card transition-colors space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{customer.name}</p>
          <p className="text-[11px] text-muted-foreground truncate">{customer.email}</p>
        </div>
        <span className={`shrink-0 px-2 py-0.5 border rounded-full font-bold text-[10px] ${getRiskColor(customer.risk)}`}>
          {customer.risk}%
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-muted-foreground text-[10px]">MRR</p>
          <p className="font-mono font-bold">${customer.mrr.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-[10px]">Health</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${getRiskBarColor(100 - customer.health)}`}
                style={{ width: `${customer.health}%` }}
              />
            </div>
            <span className="font-mono font-bold text-[10px]">{customer.health}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 pt-1">
        <span className="text-[10px] text-muted-foreground truncate">{customer.playbook}</span>
        <Button
          size="sm"
          variant="outline"
          disabled={loading}
          onClick={onNudge}
          className="shrink-0 rounded-lg h-7 px-2.5 text-[10px]"
        >
          {loading ? "..." : "Nudge"}
        </Button>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [refreshing, setRefreshing] = React.useState(false)
  const [error, setError] = React.useState("")
  const [search, setSearch] = React.useState("")
  const [searchDebounced, setSearchDebounced] = React.useState("")
  const [dashboard, setDashboard] = React.useState<DashboardData | null>(null)
  const [actionLoading, setActionLoading] = React.useState<number | null>(null)
  const [exporting, setExporting] = React.useState(false)

  const [simLogins, setSimLogins] = React.useState(15)
  const [simTickets, setSimTickets] = React.useState(2)
  const [simInvoiceDays, setSimInvoiceDays] = React.useState(5)
  const [simRisk, setSimRisk] = React.useState(40)
  const [predicting, setPredicting] = React.useState(false)
  const [predictionSource, setPredictionSource] = React.useState<"flask" | "fallback">("fallback")

  React.useEffect(() => { setMounted(true) }, [])

  React.useEffect(() => {
    if (!getToken()) router.replace("/login")
  }, [router])

  React.useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const loadDashboard = React.useCallback(async (isRefresh = false) => {
    if (!getToken()) return
    if (isRefresh) setRefreshing(true)
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
      setRefreshing(false)
    }
  }, [searchDebounced, router])

  React.useEffect(() => { loadDashboard() }, [loadDashboard])

  React.useEffect(() => {
    if (!getToken()) return
    const timer = setTimeout(async () => {
      setPredicting(true)
      try {
        const result = await fetchPrediction(simLogins, simTickets, simInvoiceDays)
        setSimRisk(result.risk)
        setPredictionSource(result.source)
      } catch {
        let base = 40 - simLogins * 1.5 + simTickets * 8 + simInvoiceDays * 1.2
        setSimRisk(Math.max(5, Math.min(99, Math.round(base))))
        setPredictionSource("fallback")
      } finally {
        setPredicting(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [simLogins, simTickets, simInvoiceDays])

  const handleTriggerNudge = async (customer: Customer) => {
    setActionLoading(customer.id)
    try {
      await triggerCustomerNudge(customer.id)
      await loadDashboard(true)
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-indigo-50/30 dark:to-indigo-950/20">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl border border-border bg-card shadow-lg">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
          <div className="text-center">
            <p className="font-semibold">Loading Churn Console</p>
            <p className="text-sm text-muted-foreground mt-1">Fetching live data from database...</p>
          </div>
        </div>
      </div>
    )
  }

  const metrics = dashboard?.metrics
  const customers = dashboard?.customers ?? []
  const alerts = dashboard?.alerts ?? []
  const integrations = dashboard?.integrations ?? []

  const metricCards = [
    {
      label: "Monitored MRR",
      value: metrics?.monitoredMrrFormatted ?? "$0",
      trend: metrics?.mrrTrend ?? "",
      isUp: true,
      icon: DollarSign,
      gradient: "from-emerald-500/10 to-emerald-600/5",
      iconColor: "text-emerald-600",
    },
    {
      label: "Avg Churn Risk",
      value: metrics?.avgChurnRiskFormatted ?? "0%",
      trend: metrics?.churnTrend ?? "",
      isUp: false,
      icon: Activity,
      gradient: "from-destructive/10 to-destructive/5",
      iconColor: "text-destructive",
    },
    {
      label: "Recovered Revenue",
      value: metrics?.recoveredRevenueFormatted ?? "$0",
      trend: metrics?.recoveredTrend ?? "",
      isUp: true,
      icon: TrendingUp,
      gradient: "from-indigo-500/10 to-violet-600/5",
      iconColor: "text-indigo-600",
    },
    {
      label: "Active Playbooks",
      value: metrics?.activePlaybooksFormatted ?? "0",
      trend: "Autopilot enabled",
      isUp: true,
      icon: Zap,
      gradient: "from-cyan-500/10 to-cyan-600/5",
      iconColor: "text-cyan-600",
      detail: true,
    },
  ]

  const SidebarContent = () => (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md">
            <TrendingUp className="h-4 w-4" />
          </div>
          <span>Retain<span className="text-indigo-600 dark:text-indigo-400">X</span></span>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/dashboard"
            return (
              <Link key={item.label} href={item.href} onClick={() => setSidebarOpen(false)}>
                <span
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="space-y-3">
        <div className="p-3 border border-border rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white font-bold text-sm flex items-center justify-center shadow-sm">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate">{dashboard?.user.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{dashboard?.user.email}</p>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                {(dashboard?.user.plan || "trial").toUpperCase()} Plan
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start text-sm rounded-xl text-muted-foreground hover:text-destructive gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-indigo-50/20 dark:to-indigo-950/10 text-foreground flex">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 border-r border-border/50 bg-card/80 backdrop-blur-sm flex-col justify-between p-4 shrink-0 sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-60 max-w-[85vw] bg-card border-r border-border flex flex-col justify-between p-4 animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border/40 bg-gradient-to-r from-card/95 via-card/90 to-indigo-50/30 dark:to-indigo-950/20 backdrop-blur-xl shadow-sm">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
          <div className="h-16 sm:h-[72px] px-4 sm:px-6 lg:px-8 flex items-center gap-4 sm:gap-6">

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden shrink-0 rounded-xl h-10 w-10"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo - visible on mobile when sidebar is hidden */}
            <div className="lg:hidden flex items-center gap-2 shrink-0 mr-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-sm">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
              <span className="font-bold text-sm tracking-tight hidden sm:inline">
                Retain<span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </span>
            </div>

            {/* Search bar - expanded */}
            <div className="flex items-center gap-2.5 flex-1 min-w-0 max-w-2xl bg-muted/30 hover:bg-muted/50 focus-within:bg-muted/50 focus-within:ring-2 focus-within:ring-indigo-500/20 border border-border/40 rounded-xl px-4 py-2.5 transition-all duration-200">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search customers, playbooks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-sm w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground"
              />
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-background/80 border border-border/60 rounded shrink-0">
                ⌘K
              </kbd>
            </div>

            {/* Actions - properly spaced */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl h-9 w-9 sm:h-10 sm:w-10 hover:bg-muted/60 hidden sm:flex"
                onClick={() => loadDashboard(true)}
                disabled={refreshing}
                title="Refresh data"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl h-9 w-9 sm:h-10 sm:w-10 hover:bg-muted/60"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                title="Toggle theme"
              >
                {mounted && resolvedTheme === "dark" ? (
                  <Sun className="h-4 w-4 text-yellow-400" />
                ) : (
                  <Moon className="h-4 w-4 text-indigo-600" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-xl h-9 w-9 sm:h-10 sm:w-10 hover:bg-muted/60"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                {alerts.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-destructive rounded-full ring-2 ring-card animate-pulse" />
                )}
              </Button>

              {/* Divider */}
              <div className="hidden sm:block h-8 w-px bg-border/60 mx-1" />

              {/* Plan badge */}
              <div className="hidden sm:flex items-center text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 px-3 py-1.5 rounded-lg">
                {(dashboard?.user.plan || "trial").toUpperCase()}
              </div>

              {/* User avatar & profile */}
              <Link href="/dashboard/profile" className="shrink-0">
                <div className="flex items-center gap-2.5 pl-1 sm:pl-2 group cursor-pointer">
                  <div className="relative">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-md ring-2 ring-background group-hover:ring-indigo-500/30 transition-all duration-200">
                      {userInitials}
                    </div>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full ring-2 ring-background" />
                  </div>
                  <div className="hidden md:block min-w-0">
                    <p className="text-xs font-semibold truncate max-w-[120px] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {dashboard?.user.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                      {dashboard?.user.company}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 overflow-y-auto">

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl flex items-center justify-between gap-2">
              <span>{error}</span>
              <button onClick={() => setError("")} className="shrink-0 p-1 hover:bg-destructive/10 rounded">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Welcome banner */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-indigo-200/50 dark:border-indigo-500/20 bg-gradient-to-r from-indigo-50/80 via-violet-50/50 to-cyan-50/30 dark:from-indigo-950/40 dark:via-violet-950/30 dark:to-cyan-950/20 p-5 sm:p-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  Welcome back, {dashboard?.user.name?.split(" ")[0]}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Live metrics for <span className="font-medium text-foreground">{dashboard?.user.company}</span>
                  {" · "}{customers.length} accounts monitored
                </p>
              </div>
              <Link href="/pricing" className="shrink-0">
                <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm shadow-md shadow-indigo-500/20">
                  Upgrade Plan
                </Button>
              </Link>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {metricCards.map((metric) => (
              <div
                key={metric.label}
                className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${metric.gradient} p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground leading-tight">
                    {metric.label}
                  </span>
                  <metric.icon className={`h-4 w-4 ${metric.iconColor} opacity-80`} />
                </div>
                <p className="text-xl sm:text-2xl font-extrabold tracking-tight font-mono">{metric.value}</p>
                <div className="mt-2">
                  {metric.detail ? (
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Autopilot
                    </span>
                  ) : (
                    <span className={`text-[10px] font-bold flex items-center ${metric.isUp ? "text-emerald-600" : "text-destructive"}`}>
                      {metric.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {metric.trend}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6">

            {/* Customers */}
            <div className="xl:col-span-8 rounded-2xl sm:rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base">High-Risk Retention Targets</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {customers.length} customers · sorted by churn risk
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  disabled={exporting}
                  className="rounded-xl text-xs gap-1.5 self-start sm:self-auto"
                >
                  <Download className="h-3.5 w-3.5" />
                  {exporting ? "Exporting..." : "CSV Export"}
                </Button>
              </div>

              {/* Mobile cards */}
              <div className="lg:hidden p-4 space-y-3">
                {customers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 text-sm">
                    {search ? "No customers match your search." : "No customers found."}
                  </p>
                ) : (
                  customers.map((c) => (
                    <CustomerCard
                      key={c.id}
                      customer={c}
                      loading={actionLoading === c.id}
                      onNudge={() => handleTriggerNudge(c)}
                    />
                  ))
                )}
              </div>

              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 text-muted-foreground text-xs font-semibold">
                      <th className="px-6 py-3 text-left">Account</th>
                      <th className="px-4 py-3 text-center">Risk</th>
                      <th className="px-4 py-3 text-right">MRR</th>
                      <th className="px-4 py-3 text-center">Health</th>
                      <th className="px-4 py-3 text-left">Playbook</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                          {search ? "No customers match your search." : "No customers found."}
                        </td>
                      </tr>
                    ) : (
                      customers.map((c) => (
                        <tr key={c.id} className="border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-semibold">{c.name}</p>
                            <p className="text-xs text-muted-foreground">{c.email}</p>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={`px-2.5 py-1 border rounded-full font-bold text-xs ${getRiskColor(c.risk)}`}>
                              {c.risk}%
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right font-mono font-bold">${c.mrr.toLocaleString()}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${c.health < 40 ? "bg-destructive" : c.health < 70 ? "bg-yellow-500" : "bg-emerald-500"}`}
                                  style={{ width: `${c.health}%` }}
                                />
                              </div>
                              <span className="font-mono font-bold text-xs w-6">{c.health}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-xs text-muted-foreground max-w-[140px] truncate">{c.playbook}</td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={actionLoading === c.id}
                              onClick={() => handleTriggerNudge(c)}
                              className="rounded-lg text-xs"
                            >
                              {actionLoading === c.id ? "Sending..." : "Trigger Nudge"}
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ML Sandbox */}
            <div className="xl:col-span-4 rounded-2xl sm:rounded-3xl border border-border bg-card shadow-sm p-5 sm:p-6 flex flex-col gap-5">
              <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">ML Risk Sandbox</h3>
                  <p className="text-[11px] text-muted-foreground">Live churn prediction model</p>
                </div>
              </div>

              <div className="space-y-5">
                {[
                  { label: "Weekly Logins", value: simLogins, max: 40, setter: setSimLogins, unit: "logins" },
                  { label: "Open Tickets", value: simTickets, max: 8, setter: setSimTickets, unit: "tickets" },
                  { label: "Overdue Invoice Days", value: simInvoiceDays, max: 30, setter: setSimInvoiceDays, unit: "days" },
                ].map((slider) => (
                  <div key={slider.label} className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <label>{slider.label}</label>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">
                        {slider.value} {slider.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={slider.max}
                      value={slider.value}
                      onChange={(e) => slider.setter(Number(e.target.value))}
                      className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-border/50 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-muted-foreground">Churn Likelihood</span>
                  <div className="flex items-center gap-2">
                    {predicting && <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />}
                    <span className={`text-lg font-extrabold font-mono px-3 py-1 border rounded-full ${getRiskColor(simRisk)}`}>
                      {simRisk}%
                    </span>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getRiskBarColor(simRisk)}`}
                    style={{ width: `${simRisk}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground text-center">
                  Source: {predictionSource === "flask" ? "ML Model API" : "Heuristic Engine"}
                </p>
                <div className="p-4 bg-gradient-to-br from-muted/40 to-muted/10 border border-border rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Suggested Playbook</p>
                  <p className="text-xs font-semibold leading-relaxed">{getSuggestedPlaybook(simRisk)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts & Integrations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div className="rounded-2xl sm:rounded-3xl border border-border bg-card shadow-sm p-5 sm:p-6">
              <h3 className="font-bold text-sm flex items-center gap-2 mb-4">
                <AlertTriangle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Retention Feed
                <span className="ml-auto text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {alerts.length} alerts
                </span>
              </h3>
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {alerts.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No alerts yet.</p>
                ) : (
                  alerts.map((log) => (
                    <div key={log.id} className="flex justify-between items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors">
                      <p className={`text-xs leading-relaxed ${log.color}`}>{log.text}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0">{log.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-border bg-card shadow-sm p-5 sm:p-6 flex flex-col">
              <h3 className="font-bold text-sm mb-1">Connected Pipelines</h3>
              <p className="text-xs text-muted-foreground mb-4">Billing & event datastores synced to ML server</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 flex-1">
                {integrations.map((sync) => (
                  <div key={sync.id} className="p-3 sm:p-4 border border-border rounded-xl bg-muted/20 text-center hover:bg-muted/40 transition-colors">
                    <span className="text-xs sm:text-sm font-bold block">{sync.name}</span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold mt-1.5 block">
                      ● {sync.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground pt-4 mt-4 border-t border-border/50">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> SOC2 Secure
                </span>
                <span>Last sync: {dashboard?.lastSync ?? "—"}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
