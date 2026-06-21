"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TrendingUp, ArrowRight, ShieldCheck, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { loginUser } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Please enter your credentials.")
      return
    }

    setLoading(true)
    setError("")

    try {
      await loginUser(email, password)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background text-foreground selection:bg-indigo-500/30">

      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-950 p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-40" />

        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight relative z-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-indigo-950">
            <TrendingUp className="h-4 w-4" />
          </div>
          <span>Retain<span className="text-cyan-400">AI</span></span>
        </Link>

        <div className="space-y-6 relative z-10 max-w-sm">
          <h2 className="text-3xl font-extrabold leading-tight">
            Stop guessing why customers cancel.
          </h2>
          <p className="text-indigo-200 text-sm leading-relaxed">
            &quot;With ReatainX, our account management teams got ahead of usage drops and saved $320k in high-tier subscription contracts this quarter alone.&quot;
          </p>
          <div className="border-t border-white/20 pt-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center">
              CS
            </div>
            <div>
              <p className="text-xs font-bold">Christian Smith</p>
              <p className="text-[10px] text-indigo-300">Director of Ops, DevFlow</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-indigo-300 relative z-10">
          <span>&copy; ReatainX Inc.</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-cyan-400" /> AES-256 Encrypted Sync
          </span>
        </div>
      </div>

      <div className="col-span-1 lg:col-span-7 flex items-center justify-center px-6 py-12 md:px-12 lg:px-16 bg-background relative">
        <div className="w-full max-w-md space-y-8">

          <div className="text-center lg:text-left">
            <Link href="/" className="lg:hidden flex items-center justify-center gap-2 font-bold text-xl tracking-tight mb-8">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span>Retain<span className="text-indigo-600 dark:text-indigo-400">AI</span></span>
            </Link>

            <h1 className="text-3xl font-extrabold tracking-tight">Sign in to your account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Or{" "}
              <Link href="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                start your 14-day free trial
              </Link>
            </p>
          </div>

          <div className="bg-card border border-border p-8 rounded-3xl shadow-sm">
            <form onSubmit={handleLogin} className="space-y-6 text-sm">

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="font-semibold text-xs text-foreground/80">Work Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="font-semibold text-xs text-foreground/80">Password</label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-6 transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1">
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>

        </div>
      </div>

    </div>
  )
}
