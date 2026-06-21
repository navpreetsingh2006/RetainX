"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  TrendingUp,
  User,
  Building,
  Mail,
  Lock,
  ArrowLeft,
  Save,
  Key,
  ShieldCheck,
  Sun,
  Moon,
  Loader2,
  Menu,
  X,
  Sparkles,
  BarChart3,
  Users,
  GitBranch,
  Settings,
  LogOut,
  Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  getUser,
  updateProfile,
  updatePassword,
  clearToken,
  getToken,
  type User as ApiUser,
} from "@/lib/api"

export default function ProfilePage() {
  const router = useRouter()
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  // Mobile navigation drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Profile fields state
  const [name, setName] = React.useState("")
  const [username, setUsername] = React.useState("")
  const [company, setCompany] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [plan, setPlan] = React.useState("trial")

  // Password fields state
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")

  // Status messages
  const [profileSuccess, setProfileSuccess] = React.useState("")
  const [profileError, setProfileError] = React.useState("")
  const [passwordSuccess, setPasswordSuccess] = React.useState("")
  const [passwordError, setPasswordError] = React.useState("")
  const [profileSaving, setProfileSaving] = React.useState(false)
  const [passwordSaving, setPasswordSaving] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Check auth and load user
  React.useEffect(() => {
    if (!getToken()) {
      router.replace("/login")
      return
    }

    const currentUser = getUser()
    if (currentUser) {
      setName(currentUser.name || "")
      setUsername(currentUser.username || "")
      setCompany(currentUser.company || "")
      setEmail(currentUser.email || "")
      setPlan(currentUser.plan || "trial")
      setLoading(false)
    } else {
      // If user details not in localStorage, wait a brief moment or redirect
      setLoading(false)
    }
  }, [router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSuccess("")
    setProfileError("")

    if (!name || !company) {
      setProfileError("Name and Company fields are required.")
      return
    }

    setProfileSaving(true)
    try {
      const response = await updateProfile({
        name,
        company,
        username: username || undefined,
        plan,
      })
      setProfileSuccess(response.message || "Profile updated successfully!")
      // Sync plan in current view
      if (response.user) {
        setPlan(response.user.plan || "trial")
      }
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Failed to update profile.")
    } finally {
      setProfileSaving(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordSuccess("")
    setPasswordError("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required.")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.")
      return
    }

    setPasswordSaving(true)
    try {
      const response = await updatePassword({
        currentPassword,
        newPassword,
      })
      setPasswordSuccess(response.message || "Password updated successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to change password.")
    } finally {
      setPasswordSaving(false)
    }
  }

  const handleSignOut = () => {
    clearToken()
    router.push("/login")
  }

  const userInitials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U"

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-muted-foreground">Loading your profile console...</p>
        </div>
      </div>
    )
  }

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
              { label: "Overview Insights", icon: <BarChart3 className="h-4 w-4" />, href: "/dashboard" },
              { label: "Customer Health", icon: <Users className="h-4 w-4" />, href: "/dashboard" },
              { label: "Automations & Playbooks", icon: <GitBranch className="h-4 w-4" />, href: "/dashboard" },
              { label: "ML Sandbox", icon: <Sparkles className="h-4 w-4" />, href: "/dashboard" },
              { label: "Settings & Profile", icon: <Settings className="h-4 w-4" />, active: true, href: "/dashboard/profile" },
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

        <div className="px-4 space-y-4">
          <div className="p-3 border border-border rounded-2xl bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                {userInitials}
              </div>
              <div className="text-[10px] truncate max-w-[120px]">
                <p className="font-bold truncate">{name}</p>
                <p className="text-muted-foreground truncate">{email}</p>
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
                  { label: "Overview Insights", icon: <BarChart3 className="h-4 w-4" />, href: "/dashboard" },
                  { label: "Customer Health", icon: <Users className="h-4 w-4" />, href: "/dashboard" },
                  { label: "Automations & Playbooks", icon: <GitBranch className="h-4 w-4" />, href: "/dashboard" },
                  { label: "ML Sandbox", icon: <Sparkles className="h-4 w-4" />, href: "/dashboard" },
                  { label: "Settings & Profile", icon: <Settings className="h-4 w-4" />, active: true, href: "/dashboard/profile" },
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
              <div className="p-3 border border-border rounded-2xl bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                    {userInitials}
                  </div>
                  <div className="text-[10px] truncate max-w-[120px]">
                    <p className="font-bold truncate">{name}</p>
                    <p className="text-muted-foreground truncate">{email}</p>
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
          </div>
          <div className="flex-grow" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-grow flex flex-col min-w-0">

        {/* HEADER */}
        <header className="h-16 border-b border-border/40 bg-card/50 backdrop-blur-sm px-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-xl border border-border md:hidden bg-muted/30 hover:bg-muted"
            >
              <Menu className="h-4 w-4" />
            </button>
            <Link href="/dashboard" className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-semibold">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Link>
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

            <span className="h-4 w-px bg-border/40" />

            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md font-bold">
              {plan.toUpperCase()}
            </div>
          </div>
        </header>

        {/* WORKSPACE AREA */}
        <main className="p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto max-w-4xl w-full mx-auto flex-grow">

          <div className="flex items-center justify-between pb-4 border-b border-border/40">
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">Account Profile Settings</h1>
              <p className="text-xs text-muted-foreground mt-1">Manage your team settings, dashboard attributes, and security policies.</p>
            </div>
            <Link href="/dashboard" className="sm:hidden p-2 border border-border rounded-xl bg-card text-xs">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6">

            {/* PROFILE DETAILS CARD */}
            <div className="bg-card border border-border rounded-2xl shadow-sm p-5 sm:p-6 space-y-6">
              <div className="flex items-center gap-3 border-b border-border/40 pb-3">
                <User className="h-5 w-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold">Personal Profile Attributes</h3>
                  <p className="text-[10px] text-muted-foreground">These details represent your identity inside ReatainX console.</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4 text-sm">

                {profileSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>{profileSuccess}</span>
                  </div>
                )}

                {profileError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl">
                    {profileError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="p-name" className="font-semibold text-xs text-foreground/80">Full Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        id="p-name"
                        type="text"
                        required
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="p-username" className="font-semibold text-xs text-foreground/80">Username</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        id="p-username"
                        type="text"
                        placeholder="johndoe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="p-company" className="font-semibold text-xs text-foreground/80">Company Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <Building className="h-4 w-4" />
                      </span>
                      <input
                        id="p-company"
                        type="text"
                        required
                        placeholder="Acme Corp"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="p-email" className="font-semibold text-xs text-foreground/80">Work Email Address (Read-only)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        id="p-email"
                        type="email"
                        disabled
                        value={email}
                        className="w-full pl-9 pr-4 py-2 bg-muted/40 text-muted-foreground border border-border rounded-xl cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label htmlFor="p-plan" className="font-semibold text-xs text-foreground/80">Subscription tier (Synchronized to Database)</label>
                  <select
                    id="p-plan"
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors font-medium text-xs"
                  >
                    <option value="trial">Trial Plan (14 Days Free)</option>
                    <option value="growth">Growth Plan ($249/mo)</option>
                    <option value="enterprise">Enterprise Plan (Custom / Custom SLA)</option>
                  </select>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={profileSaving}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-5 px-6 text-xs flex items-center gap-1.5 transition-all shadow-md"
                  >
                    {profileSaving ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    <span>Save Profile Changes</span>
                  </Button>
                </div>

              </form>
            </div>

            {/* SECURITY & PASSWORD CHANGE CARD */}
            <div className="bg-card border border-border rounded-2xl shadow-sm p-5 sm:p-6 space-y-6">
              <div className="flex items-center gap-3 border-b border-border/40 pb-3">
                <Key className="h-5 w-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold">Security Credentials</h3>
                  <p className="text-[10px] text-muted-foreground">Change your password and secure your authentication logs.</p>
                </div>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4 text-sm">

                {passwordSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                {passwordError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl">
                    {passwordError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="p-currpass" className="font-semibold text-xs text-foreground/80">Current Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      id="p-currpass"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="p-newpass" className="font-semibold text-xs text-foreground/80">New Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        id="p-newpass"
                        type="password"
                        required
                        placeholder="At least 8 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="p-confpass" className="font-semibold text-xs text-foreground/80">Confirm New Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        id="p-confpass"
                        type="password"
                        required
                        placeholder="At least 8 characters"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={passwordSaving}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-5 px-6 text-xs flex items-center gap-1.5 transition-all shadow-md"
                  >
                    {passwordSaving ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Key className="h-3.5 w-3.5" />
                    )}
                    <span>Change Secure Password</span>
                  </Button>
                </div>

              </form>
            </div>

          </div>

        </main>
      </div>

    </div>
  )
}
