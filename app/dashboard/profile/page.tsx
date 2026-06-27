"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  TrendingUp, User, Building, Mail, Lock, ArrowLeft, Save,
  Key, ShieldCheck, Sun, Moon, Loader2, Menu, X, Sparkles,
  BarChart3, Users, GitBranch, Settings, LogOut, Bell, Camera, Activity
} from "lucide-react"
import { getToken, clearToken } from "@/lib/api"

interface UserProfile {
  id: number; name: string; email: string; company: string; avatarUrl?: string;
}

async function authFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers as Record<string, string> ?? {}),
  }
  const res = await fetch(path, { ...init, headers })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? "Request failed")
  return data as T
}

export default function ProfilePage() {
  const router = useRouter()
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const [user, setUser] = React.useState<UserProfile | null>(null)
  const [name, setName] = React.useState("")
  const [company, setCompany] = React.useState("")
  const [avatarPreview, setAvatarPreview] = React.useState<string>("")
  const [avatarUrl, setAvatarUrl] = React.useState<string>("")
  const avatarInputRef = React.useRef<HTMLInputElement>(null)

  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")

  const [profileSuccess, setProfileSuccess] = React.useState("")
  const [profileError, setProfileError] = React.useState("")
  const [passwordSuccess, setPasswordSuccess] = React.useState("")
  const [passwordError, setPasswordError] = React.useState("")
  const [profileSaving, setProfileSaving] = React.useState(false)
  const [passwordSaving, setPasswordSaving] = React.useState(false)

  React.useEffect(() => { setMounted(true) }, [])

  React.useEffect(() => {
    if (!getToken()) { router.replace("/login"); return }
    authFetch<{ user: UserProfile }>("/api/auth/profile")
      .then(res => {
        setUser(res.user)
        setName(res.user.name)
        setCompany(res.user.company)
        setAvatarUrl(res.user.avatarUrl ?? "")
        setAvatarPreview(res.user.avatarUrl ?? "")
      })
      .catch(() => { clearToken(); router.replace("/login") })
      .finally(() => setLoading(false))
  }, [router])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string
      setAvatarPreview(dataUrl)
      setAvatarUrl(dataUrl) // store base64 as avatarUrl for demo
    }
    reader.readAsDataURL(file)
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSuccess(""); setProfileError("")
    if (!name || !company) { setProfileError("Name and company are required."); return }
    setProfileSaving(true)
    try {
      const res = await authFetch<{ user: UserProfile; message: string }>("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify({ name, company, avatarUrl: avatarUrl || undefined }),
      })
      setUser(res.user)
      setProfileSuccess(res.message || "Profile updated successfully!")
      // Update localStorage cached user
      localStorage.setItem("user", JSON.stringify(res.user))
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Failed to update profile.")
    } finally { setProfileSaving(false) }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordSuccess(""); setPasswordError("")
    if (!currentPassword || !newPassword || !confirmPassword) { setPasswordError("All fields are required."); return }
    if (newPassword.length < 8) { setPasswordError("New password must be at least 8 characters."); return }
    if (newPassword !== confirmPassword) { setPasswordError("Passwords do not match."); return }
    setPasswordSaving(true)
    try {
      const res = await authFetch<{ message: string }>("/api/auth/password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      setPasswordSuccess(res.message || "Password updated successfully!")
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("")
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to change password.")
    } finally { setPasswordSaving(false) }
  }

  const handleSignOut = () => { clearToken(); router.push("/login") }
  const userInitials = name ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "U"

  const navItems = [
    { label: "Overview", icon: <BarChart3 className="h-4 w-4" />, href: "/dashboard" },
    { label: "Customer Health", icon: <Users className="h-4 w-4" />, href: "/dashboard" },
    { label: "Automations", icon: <GitBranch className="h-4 w-4" />, href: "/dashboard" },
    { label: "ML Charts", icon: <Sparkles className="h-4 w-4" />, href: "/dashboard" },
    { label: "AI Voice Agent", icon: <Activity className="h-4 w-4" />, href: "/voice" },
    { label: "Settings & Profile", icon: <Settings className="h-4 w-4" />, href: "/dashboard/profile", active: true },
  ]

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)" }}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        <p className="text-sm text-slate-400">Loading profile…</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex text-slate-100" style={{ background: "linear-gradient(135deg,#0f0c29 0%,#1e1b4b 50%,#0c0a1e 100%)", fontFamily: "'Inter',sans-serif" }}>

      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col justify-between py-6 flex-shrink-0" style={{ background: "rgba(15,12,41,0.9)", backdropFilter: "blur(20px)", borderRight: "1px solid rgba(99,102,241,0.15)" }}>
        <div className="space-y-6">
          <div className="px-6 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6366f1,#22d3ee)" }}>
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="font-black text-xl tracking-tight">Retain<span className="text-indigo-400">X</span></span>
          </div>
          <nav className="px-3 space-y-1">
            {navItems.map((item, idx) => (
              <Link key={idx} href={item.href}>
                <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${item.active ? "text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                  style={item.active ? { background: "linear-gradient(135deg,rgba(99,102,241,0.8),rgba(34,211,238,0.4))", boxShadow: "0 4px 15px rgba(99,102,241,0.3)" } : {}}>
                  {item.icon}{item.label}
                </button>
              </Link>
            ))}
          </nav>
        </div>
        <div className="px-3">
          <div className="p-3 rounded-2xl flex items-center gap-2.5 mb-2" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="h-8 w-8 rounded-full text-white font-bold text-xs flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6366f1,#22d3ee)" }}>{userInitials}</div>
            )}
            <div className="text-[10px] min-w-0 truncate">
              <p className="font-bold truncate text-white">{name}</p>
              <p className="text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10">
            <LogOut className="h-4 w-4" />Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="w-64 flex flex-col p-6" style={{ background: "rgba(15,12,41,0.98)", borderRight: "1px solid rgba(99,102,241,0.2)" }}>
            <div className="flex items-center justify-between mb-6">
              <span className="font-black text-lg">Retain<span className="text-indigo-400">X</span></span>
              <button onClick={() => setMobileMenuOpen(false)}><X className="h-4 w-4" /></button>
            </div>
            <nav className="space-y-1">
              {navItems.map((item, idx) => (
                <Link key={idx} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold mb-1 ${item.active ? "text-white" : "text-slate-400"}`} style={item.active ? { background: "linear-gradient(135deg,rgba(99,102,241,0.8),rgba(34,211,238,0.4))" } : {}}>
                    {item.icon}{item.label}
                  </button>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-grow" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 px-6 flex items-center justify-between flex-shrink-0" style={{ background: "rgba(15,12,41,0.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(99,102,241,0.15)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="p-1.5 rounded-xl md:hidden" style={{ border: "1px solid rgba(99,102,241,0.2)" }}><Menu className="h-4 w-4" /></button>
            <Link href="/dashboard" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />Back to Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ border: "1px solid rgba(99,102,241,0.2)" }}>
              {mounted && resolvedTheme === "dark" ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-grow overflow-y-auto p-4 sm:p-6 max-w-4xl w-full mx-auto space-y-6">
          <div className="pb-4" style={{ borderBottom: "1px solid rgba(99,102,241,0.15)" }}>
            <h1 className="text-2xl font-black tracking-tight">Account Settings</h1>
            <p className="text-xs text-slate-400 mt-1">Manage your profile, avatar, and security credentials — all saved to the database.</p>
          </div>

          {/* Avatar + Profile Card */}
          <div className="p-6 rounded-2xl space-y-6" style={{ background: "rgba(15,12,41,0.8)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <div className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
              <User className="h-5 w-5 text-indigo-400" />
              <div>
                <h3 className="text-sm font-bold">Personal Profile</h3>
                <p className="text-[10px] text-slate-400">Changes are immediately saved to the database.</p>
              </div>
            </div>

            {/* Avatar Upload */}
            <div className="flex items-center gap-5">
              <div className="relative group">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="h-20 w-20 rounded-2xl object-cover" style={{ border: "2px solid rgba(99,102,241,0.4)" }} />
                ) : (
                  <div className="h-20 w-20 rounded-2xl flex items-center justify-center text-white font-black text-2xl" style={{ background: "linear-gradient(135deg,#6366f1,#22d3ee)", border: "2px solid rgba(99,102,241,0.4)" }}>{userInitials}</div>
                )}
                <button type="button" onClick={() => avatarInputRef.current?.click()} className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.6)" }}>
                  <Camera className="h-5 w-5 text-white" />
                </button>
                <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{name}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
                <button type="button" onClick={() => avatarInputRef.current?.click()} className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                  <Camera className="h-3.5 w-3.5" />Change Avatar
                </button>
                <p className="text-[10px] text-slate-500 mt-0.5">JPG, PNG or GIF · Stored in database</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {profileSuccess && (
                <div className="p-3 rounded-xl text-xs flex items-center gap-2" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399" }}>
                  <ShieldCheck className="h-4 w-4" />{profileSuccess}
                </div>
              )}
              {profileError && (
                <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>{profileError}</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs text-slate-200 focus:outline-none" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Company *</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Corp" className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs text-slate-200 focus:outline-none" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }} />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Email (read-only)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input disabled value={user?.email ?? ""} className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs text-slate-500 cursor-not-allowed" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(99,102,241,0.1)" }} />
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={profileSaving} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white" style={{ background: "linear-gradient(135deg,#6366f1,#22d3ee)", opacity: profileSaving ? 0.7 : 1 }}>
                  {profileSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save Profile to Database
                </button>
              </div>
            </form>
          </div>

          {/* Security Card */}
          <div className="p-6 rounded-2xl space-y-6" style={{ background: "rgba(15,12,41,0.8)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <div className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
              <Key className="h-5 w-5 text-indigo-400" />
              <div>
                <h3 className="text-sm font-bold">Security Credentials</h3>
                <p className="text-[10px] text-slate-400">New password is hashed with bcrypt and stored securely in the database.</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {passwordSuccess && (
                <div className="p-3 rounded-xl text-xs flex items-center gap-2" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399" }}>
                  <ShieldCheck className="h-4 w-4" />{passwordSuccess}
                </div>
              )}
              {passwordError && (
                <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>{passwordError}</div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs text-slate-200 focus:outline-none" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 8 characters" className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs text-slate-200 focus:outline-none" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Match new password" className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs text-slate-200 focus:outline-none" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={passwordSaving} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white" style={{ background: "linear-gradient(135deg,#6366f1,#22d3ee)", opacity: passwordSaving ? 0.7 : 1 }}>
                  {passwordSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Key className="h-3.5 w-3.5" />}
                  Update Password in Database
                </button>
              </div>
            </form>
          </div>

          {/* Account Info */}
          <div className="p-5 rounded-2xl" style={{ background: "rgba(15,12,41,0.6)", border: "1px solid rgba(99,102,241,0.1)" }}>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-300">Account Security Status</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[10px] text-slate-400">
              <div className="p-2 rounded-lg" style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.15)" }}>
                <span className="text-emerald-400 font-bold block">✓ Password Hashed</span>
                bcrypt 10 rounds
              </div>
              <div className="p-2 rounded-lg" style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.15)" }}>
                <span className="text-indigo-400 font-bold block">✓ JWT Auth</span>
                7-day token expiry
              </div>
              <div className="p-2 rounded-lg" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.15)" }}>
                <span className="text-cyan-400 font-bold block">✓ DB Synced</span>
                PostgreSQL + Prisma
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
