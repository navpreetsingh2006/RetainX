"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TrendingUp, ArrowRight, ShieldCheck, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { text } from "stream/consumers"

export default function LoginPage() {
  const router = useRouter()
  const [name, setName] = React.useState("")
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

    // Simulated login redirecting to dashboard demo
    // setTimeout(() => {
    //   setLoading(false)
    //   router.push("/dashboard")
    // }, 1200)
    const handleLogin = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/auth/login',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              name,
              email,
              password,
            }),
          }
        );

        const data = await response.json();

        console.log(data);

        if (response.ok) {
          alert('Login Successful');

          localStorage.setItem(
            'token',
            data.token
          );

          window.location.href = '/dashboard';
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.log(error);

        alert('Server Error');
      }
    };


    return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background text-foreground selection:bg-indigo-500/30">

        {/* LEFT COLUMN - ACCREDITATION PITCH (Hidden on mobile) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-950 p-12 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-40" />

          {/* Top Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight relative z-10">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-indigo-950">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span>Retain<span className="text-cyan-400">AI</span></span>
          </Link>

          {/* Pitch Quote */}
          <div className="space-y-6 relative z-10 max-w-sm">
            <h2 className="text-3xl font-extrabold leading-tight">
              Stop guessing why customers cancel.
            </h2>
            <p className="text-indigo-200 text-sm leading-relaxed">
              "With RetainAI, our account management teams got ahead of usage drops and saved $320k in high-tier subscription contracts this quarter alone."
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

          {/* Footer info */}
          <div className="flex justify-between items-center text-xs text-indigo-300 relative z-10">
            <span>&copy; RetainAI Inc.</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-cyan-400" /> AES-256 Encrypted Sync
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN - AUTHENTICATION FORM */}
        <div className="col-span-1 lg:col-span-7 flex items-center justify-center px-6 py-12 md:px-12 lg:px-16 bg-background relative">

          {/* Toggle Theme Hotkey Guide */}
          <div className="absolute top-6 right-8 text-xs text-muted-foreground font-mono hidden md:block">
            Press <kbd className="px-1.5 py-0.5 border rounded bg-muted">d</kbd> to toggle dark mode
          </div>

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
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="font-semibold text-xs text-foreground/80">Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      required
                      placeholder="John Doe"
                      className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
                {/* Email */}
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
                    <a href="#" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Forgot password?</a>
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

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <hr className="w-full border-border/60" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">Or sign in with</span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setLoading(true)
                  setTimeout(() => {
                    setLoading(false)
                    router.push("/dashboard")
                  }, 1000)
                }}
                className="w-full border-border hover:bg-muted/50 rounded-xl py-6 font-medium text-xs flex justify-center items-center gap-2"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google Workspace SSO
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              By signing in, you agree to our{" "}
              <a href="#" className="underline hover:text-foreground">Terms of Service</a> and{" "}
              <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
            </p>

          </div>
        </div>

      </div>
    )
  }
}
