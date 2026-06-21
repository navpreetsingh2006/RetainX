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
  Bot,
  Send,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  fetchDashboard,
  triggerCustomerNudge,
  exportCustomersCsv,
  clearToken,
  getToken,
  fetchPrediction,
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

  // Layout & Dropdown states
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // ML Sandbox Simulation inputs
  const [simLogins, setSimLogins] = React.useState(15)
  const [simTickets, setSimTickets] = React.useState(2)
  const [simInvoiceDays, setSimInvoiceDays] = React.useState(5)

  // ML Sandbox API results
  const [simRisk, setSimRisk] = React.useState(40)
  const [modelSource, setModelSource] = React.useState<'flask' | 'fallback'>('fallback')
  const [predicting, setPredicting] = React.useState(false)

  // Chatbot states
  const [chatOpen, setChatOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Array<{ sender: 'user' | 'bot', text: string, time: string }>>([])
  const [chatInput, setChatInput] = React.useState("")
  const [chatTyping, setChatTyping] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    // Seed initial bot message
    setMessages([
      {
        sender: 'bot',
        text: "Hi! I'm ReatainX Copilot. I analyze your customer database and metrics. Ask me anything about your current risk profiles, or select a prompt below!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
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

  // Debounced API call for ML Sandbox prediction
  React.useEffect(() => {
    if (!getToken()) return
    const delayDebounceFn = setTimeout(async () => {
      setPredicting(true)
      try {
        const res = await fetchPrediction(simLogins, simTickets, simInvoiceDays)
        if (res.success) {
          setSimRisk(res.risk)
          setModelSource(res.source)
        }
      } catch {
        // Local analytical fallback
        let base = 40
        base -= simLogins * 1.5
        base += simTickets * 8
        base += simInvoiceDays * 1.2
        setSimRisk(Math.max(5, Math.min(99, Math.round(base))))
        setModelSource('fallback')
      } finally {
        setPredicting(false)
      }
    }, 250)

    return () => clearTimeout(delayDebounceFn)
  }, [simLogins, simTickets, simInvoiceDays])

  const triggerBotResponse = (inputText: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages((prev) => [...prev, { sender: 'user', text: inputText, time }])
    setChatTyping(true)

    setTimeout(() => {
      const textLower = inputText.toLowerCase()
      let reply = ""

      const activeMetrics = dashboard?.metrics
      const activeCustomers = dashboard?.customers ?? []

      if (textLower.includes("risk") || textLower.includes("summarize") || textLower.includes("overall")) {
        const highRisk = activeCustomers.filter(c => c.risk >= 70)
        const medRisk = activeCustomers.filter(c => c.risk >= 45 && c.risk < 70)
        reply = `ReatainX Database Summary:
Monitored Accounts: ${activeCustomers.length}
Average Churn Risk: ${activeMetrics?.avgChurnRiskFormatted ?? "0%"}
Total Monitored MRR: ${activeMetrics?.monitoredMrrFormatted ?? "$0"}

Risk Segments:
🔴 High Risk (>=70%): ${highRisk.length} (${highRisk.map(c => c.name).join(", ") || "None"})
🟡 Med Risk (45-69%): ${medRisk.length} (${medRisk.map(c => c.name).join(", ") || "None"})
🟢 Low Risk (<45%): ${activeCustomers.filter(c => c.risk < 45).length}

I suggest reviewing playbooks for critical high-risk accounts.`
      } else if (textLower.includes("critical") || textLower.includes("highest") || textLower.includes("high-risk")) {
        const highRisk = activeCustomers.filter(c => c.risk >= 70)
        if (highRisk.length === 0) {
          reply = "No critical accounts found in the database (all are below 70% risk). Great job!"
        } else {
          reply = `Critical Retention Targets (Risk >= 70%):
${highRisk.map(c => `• ${c.name}: Risk ${c.risk}%, Health ${c.health}/100, Playbook: "${c.playbook}"`).join("\n")}

You can initiate a Slack CSM nudge for these targets from the accounts panel.`
        }
      } else if (textLower.includes("mrr") || textLower.includes("revenue") || textLower.includes("billing") || textLower.includes("money")) {
        reply = `Revenue Retention Intelligence:
• Monitored MRR: ${activeMetrics?.monitoredMrrFormatted ?? "$0"} (Trend: ${activeMetrics?.mrrTrend ?? ""})
• Recovered Revenue: ${activeMetrics?.recoveredRevenueFormatted ?? "$0"} (Trend: ${activeMetrics?.recoveredTrend ?? ""})
• Active Playbooks: ${activeMetrics?.activePlaybooksFormatted ?? "0"}`
      } else {
        // Check for specific customer name
        const found = activeCustomers.find(c => textLower.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(textLower))
        if (found) {
          reply = `Account File: ${found.name}
• Email: ${found.email}
• Churn Risk: ${found.risk}%
• Health Score: ${found.health}/100
• MRR: $${found.mrr.toLocaleString()}
• Playbook: "${found.playbook}"

${found.risk >= 70 ? "⚠️ Highly critical! CSM outreach is recommended." : "✅ Account status is stable."}`
        } else {
          reply = `I am ReatainX Copilot, synced with your Postgres datastore. 

You can ask me:
1. "Analyze overall risk" for a summary segment.
2. "Identify critical accounts" to list highest targets.
3. "Summarize MRR metrics" for financial trend values.
4. Or mention a customer's name (e.g. "Acme" or "DevFlow") to view their detailed log card.`
        }
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ])
      setChatTyping(false)
    }, 600)
  }

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
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300 relative">

      {/* DESKTOP SIDEBAR */}
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
              { label: "Overview Insights", icon: <BarChart3 className="h-4 w-4" />, active: true, href: "/dashboard" },
              { label: "Customer Health", icon: <Users className="h-4 w-4" />, href: "/dashboard" },
              { label: "Automations & Playbooks", icon: <GitBranch className="h-4 w-4" />, href: "/dashboard" },
              { label: "ML Sandbox", icon: <Sparkles className="h-4 w-4" />, href: "/dashboard" },
              { label: "Settings & Profile", icon: <Settings className="h-4 w-4" />, href: "/dashboard/profile" },
            ].map((item, idx) => (
              <Link key={idx} href={item.href} className="block">
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${item.active
                    ? "bg-indigo-600 text-white"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Profile Area with Dropdown Menu */}
        <div className="px-4 relative">
          {dropdownOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-card border border-border rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="px-3 py-1.5 border-b border-border/40 text-[9px] text-muted-foreground font-semibold">
                Account Settings
              </div>
              <Link href="/dashboard/profile" className="block w-full">
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <User className="h-3.5 w-3.5 text-indigo-500" />
                  <span>My Profile</span>
                </button>
              </Link>
              <Link href="/pricing" className="block w-full">
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                  <span>Upgrade Subscription</span>
                </button>
              </Link>
              <hr className="border-border/40 my-1.5" />
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full p-3 border border-border rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors flex items-center justify-between text-left focus:outline-none"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                {userInitials}
              </div>
              <div className="text-[10px] min-w-0 truncate">
                <p className="font-bold truncate">{dashboard?.user.name}</p>
                <p className="text-muted-foreground truncate">{dashboard?.user.email}</p>
              </div>
            </div>
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-64 bg-card border-r border-border p-6 flex flex-col justify-between animate-in slide-in-from-left duration-250">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-sm">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <span>Retain<span className="text-indigo-600 dark:text-indigo-400">AI</span></span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg border border-border hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="space-y-1">
                {[
                  { label: "Overview Insights", icon: <BarChart3 className="h-4 w-4" />, active: true, href: "/dashboard" },
                  { label: "Customer Health", icon: <Users className="h-4 w-4" />, href: "/dashboard" },
                  { label: "Automations & Playbooks", icon: <GitBranch className="h-4 w-4" />, href: "/dashboard" },
                  { label: "ML Sandbox", icon: <Sparkles className="h-4 w-4" />, href: "/dashboard" },
                  { label: "Settings & Profile", icon: <Settings className="h-4 w-4" />, href: "/dashboard/profile" },
                ].map((item, idx) => (
                  <Link key={idx} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <button
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-colors mb-1 ${item.active
                        ? "bg-indigo-600 text-white"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  setDropdownOpen(true)
                }}
                className="w-full p-3 border border-border rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                    {userInitials}
                  </div>
                  <div className="text-[10px] truncate max-w-[120px]">
                    <p className="font-bold truncate">{dashboard?.user.name}</p>
                    <p className="text-muted-foreground truncate">{dashboard?.user.email}</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div className="flex-grow" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-grow flex flex-col min-w-0">

        {/* HEADER */}
        <header className="h-16 border-b border-border/40 bg-card/50 backdrop-blur-sm px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-grow md:max-w-md">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-xl border border-border md:hidden bg-muted/30 hover:bg-muted"
            >
              <Menu className="h-4 w-4" />
            </button>

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

            {/* Header Dropdown (especially useful for Mobile, Tablet, iPad screens) */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white font-bold text-xs flex items-center justify-center focus:outline-none hover:opacity-85 transition-opacity"
              >
                {userInitials}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-border/40 text-[9px] text-muted-foreground font-semibold">
                    Admin Profile
                  </div>
                  <Link href="/dashboard/profile" className="block w-full">
                    <button
                      onClick={() => setDropdownOpen(false)}
                      className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <User className="h-3.5 w-3.5 text-indigo-500" />
                      <span>My Profile</span>
                    </button>
                  </Link>
                  <Link href="/pricing" className="block w-full">
                    <button
                      onClick={() => setDropdownOpen(false)}
                      className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                      <span>Pricing Plans</span>
                    </button>
                  </Link>
                  <hr className="border-border/40 my-1.5" />
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* WORKSPACE AREA */}
        <main className="p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Welcome Alert */}
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

          {/* Metrics Grid */}
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

          {/* Core Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Customer targets table */}
            <div className="lg:col-span-8 bg-card border border-border rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold">High-Risk Retention Targets</h3>
                  <p className="text-[10px] text-muted-foreground">Customers who triggered risk flags in the last 48 hours.</p>
                </div>
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="px-2.5 py-1 border rounded bg-muted text-[10px] font-mono text-muted-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
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

            {/* Sandbox simulation component */}
            <div className="lg:col-span-4 bg-card border border-border rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <h3 className="text-sm font-bold">ML Model Risk Sandbox</h3>
                      <p className="text-[9px] text-muted-foreground">Simulate customer behavior to estimate churn score.</p>
                    </div>
                  </div>

                  {/* Model Active Source Badge */}
                  <span className={`text-[8px] font-mono px-2 py-0.5 border rounded-full font-bold transition-all ${modelSource === 'flask'
                      ? "text-cyan-500 border-cyan-500/20 bg-cyan-500/10"
                      : "text-indigo-600 dark:text-indigo-400 border-indigo-500/20 bg-indigo-500/10"
                    }`}>
                    {modelSource === 'flask' ? "Flask ML Model" : "Local Simulator"}
                  </span>
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

              <div className="pt-4 border-t border-border/40 space-y-4 relative">
                {predicting && (
                  <div className="absolute inset-0 bg-card/60 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-xl">
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-muted-foreground">Estimated Churn Likelihood</span>
                  <span className={`text-base font-extrabold font-mono px-2 py-0.5 border rounded-full transition-colors ${getRiskColor(simRisk)}`}>
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

          {/* Secondary Stats widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Retention feed log */}
            <div className="bg-card border border-border rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
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

            {/* Connected Sync Pipelines */}
            <div className="bg-card border border-border rounded-2xl shadow-sm p-5 sm:p-6 space-y-4 flex flex-col justify-between">
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

      {/* AI Chatbot Floating Trigger & Box */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {!chatOpen ? (
          <button
            onClick={() => setChatOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Bot className="h-6 w-6" />
          </button>
        ) : (
          <div className="w-[calc(100vw-32px)] sm:w-[380px] md:w-[400px] h-[500px] bg-card/95 border border-border/80 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200">

            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-950 via-indigo-900 to-violet-950 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-cyan-400" />
                <div>
                  <h4 className="text-xs font-bold">ReatainX Copilot</h4>
                  <p className="text-[9px] text-indigo-300">Context-Aware AI Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3 text-xs leading-relaxed max-h-[340px]">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-muted border border-border rounded-tl-none text-foreground'
                      }`}
                  >
                    <p className="text-[11px] whitespace-pre-wrap">{msg.text}</p>
                    <span className="text-[8px] text-muted-foreground/60 block text-right mt-1">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              {chatTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted border border-border p-3 rounded-2xl rounded-tl-none">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                  </div>
                </div>
              )}
            </div>

            {/* Predefined prompts */}
            <div className="px-4 py-2 border-t border-border/40 bg-muted/20 flex flex-wrap gap-1.5">
              {[
                { label: "🔍 Summarize Risk", prompt: "Summarize the customer churn risks." },
                { label: "⚠️ Critical Targets", prompt: "Identify the accounts at highest risk." },
                { label: "📊 Financials", prompt: "What are my monitored MRR stats?" },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => triggerBotResponse(chip.prompt)}
                  className="px-2 py-1 text-[10px] border border-border hover:border-indigo-500/50 bg-background rounded-full font-semibold transition-colors focus:outline-none"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (chatInput.trim()) {
                  triggerBotResponse(chatInput.trim())
                  setChatInput("")
                }
              }}
              className="p-3 border-t border-border/40 bg-card flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask about risk, metrics, playbooks..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-grow text-xs px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors focus:outline-none"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  )
}

