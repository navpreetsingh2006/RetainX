"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
  Sparkles,
  Sun,
  Moon,
  Menu,
  X,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { clearToken, type DashboardData } from "@/lib/api"

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: BarChart3 },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Playbooks", href: "/dashboard/playbooks", icon: GitBranch },
  { label: "ML Sandbox", href: "/dashboard/sandbox", icon: Sparkles },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  dashboard: DashboardData | null
  search: string
  setSearch: (val: string) => void
  onRefresh: () => void
  refreshing: boolean
}

export function DashboardLayout({
  children,
  dashboard,
  search,
  setSearch,
  onRefresh,
  refreshing,
}: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  React.useEffect(() => { setMounted(true) }, [])

  const handleSignOut = () => {
    clearToken()
    router.push("/login")
  }

  const userInitials = dashboard?.user?.name
    ? dashboard.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U"

  const alerts = dashboard?.alerts ?? []

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
            const isActive = pathname === item.href
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
              <p className="font-semibold text-sm truncate">{dashboard?.user?.name || "User"}</p>
              <p className="text-[11px] text-muted-foreground truncate">{dashboard?.user?.email || "user@example.com"}</p>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                {(dashboard?.user?.plan || "trial").toUpperCase()} Plan
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

            {/* Logo */}
            <div className="lg:hidden flex items-center gap-2 shrink-0 mr-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-sm">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
              <span className="font-bold text-sm tracking-tight hidden sm:inline">
                Retain<span className="text-indigo-600 dark:text-indigo-400">X</span>
              </span>
            </div>

            {/* Search bar */}
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

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl h-9 w-9 sm:h-10 sm:w-10 hover:bg-muted/60 hidden sm:flex"
                onClick={onRefresh}
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

              <div className="hidden sm:block h-8 w-px bg-border/60 mx-1" />

              <div className="hidden sm:flex items-center text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 px-3 py-1.5 rounded-lg">
                {(dashboard?.user?.plan || "trial").toUpperCase()}
              </div>

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
                      {dashboard?.user?.name || "User"}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                      {dashboard?.user?.company || "Company"}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
