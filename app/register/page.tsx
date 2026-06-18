"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { TrendingUp, ArrowRight, ShieldCheck, Mail, Lock, User, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { registerUser } from "@/lib/api"

function RegisterPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedPlan = searchParams ? searchParams.get("plan") : null

  const [step, setStep] = React.useState(1)

  const [name, setName] = React.useState("")
  const [company, setCompany] = React.useState("")
  
  const [username, setUsername] = React.useState("")
  const [email, setEmail] = React.useState("")
  
  const [password, setPassword] = React.useState("")

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleNext = () => {
    setError("")
    if (step === 1) {
      if (!name || !company) {
        setError("Please fill out your name and company.")
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!username || !email) {
        setError("Please fill out your username and email.")
        return
      }
      setStep(3)
    }
  }

  const handleBack = () => {
    setError("")
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !company || !password || !username) {
      setError("Please fill out all fields.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setLoading(true)
    setError("")

    try {
      await registerUser({
        name,
        email,
        password,
        company,
        username,
        plan: selectedPlan || "trial",
      })
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background text-foreground selection:bg-indigo-500/30">

      {/* LEFT COLUMN - STATS & FEATURES PITCH (Hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-950 p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-40" />

        {/* Top Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight relative z-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-indigo-950">
            <TrendingUp className="h-4 w-4" />
          </div>
          <span>Retain<span className="text-cyan-400">AI</span></span>
        </Link>

        {/* Core Checklist */}
        <div className="space-y-6 relative z-10 max-w-sm">
          <h2 className="text-3xl font-extrabold leading-tight">
            Protect your growth in under two hours.
          </h2>

          <ul className="space-y-4 text-sm text-indigo-200">
            <li className="flex items-start gap-3">
              <span className="h-5 w-5 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold mt-0.5">✓</span>
              <div>
                <p className="font-semibold text-white">14-Day Full Access Trial</p>
                <p className="text-xs text-indigo-300/80">Explore all features, no credit card required.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="h-5 w-5 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold mt-0.5">✓</span>
              <div>
                <p className="font-semibold text-white">92%+ Accuracy Models</p>
                <p className="text-xs text-indigo-300/80">State-of-the-art predictive customer scoring.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="h-5 w-5 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold mt-0.5">✓</span>
              <div>
                <p className="font-semibold text-white">Autopilot Integrations</p>
                <p className="text-xs text-indigo-300/80">Automated Slack, CRM, and email playbooks.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center text-xs text-indigo-300 relative z-10">
          <span>&copy; RetainAI Inc.</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-cyan-400" /> SOC2 Type II Certified
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN - REGISTRATION FORM */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center px-6 py-12 md:px-12 lg:px-16 bg-background relative">

        <div className="w-full max-w-md space-y-8">

          <div className="text-center lg:text-left">
            <Link href="/" className="lg:hidden flex items-center justify-center gap-2 font-bold text-xl tracking-tight mb-8">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span>Retain<span className="text-indigo-600 dark:text-indigo-400">AI</span></span>
            </Link>

            <h1 className="text-3xl font-extrabold tracking-tight">Create your trial account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          <div className="bg-card border border-border p-8 rounded-3xl shadow-sm">
            <form onSubmit={handleRegister} className="space-y-4 text-sm">

              {selectedPlan && (
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs rounded-xl flex justify-between items-center font-semibold">
                  <span>Selected Trial: {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan</span>
                  <Link href="/pricing" className="text-[10px] underline uppercase">Change</Link>
                </div>
              )}

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl">
                  {error}
                </div>
              )}

              {/* STEP INDICATOR */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-indigo-600' : 'bg-muted'}`} />
                  <div className={`h-2.5 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-indigo-600' : 'bg-muted'}`} />
                  <div className={`h-2.5 w-8 rounded-full transition-colors ${step >= 3 ? 'bg-indigo-600' : 'bg-muted'}`} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">Step {step} of 3</span>
              </div>

              {/* STEP 1: Personal Details */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="font-semibold text-xs text-foreground/80">Full Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="company" className="font-semibold text-xs text-foreground/80">Company Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <Building className="h-4 w-4" />
                      </span>
                      <input
                        id="company"
                        type="text"
                        required
                        placeholder="Acme Corp"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Account Details */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-1.5">
                    <label htmlFor="username" className="font-semibold text-xs text-foreground/80">Dashboard Username</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        id="username"
                        type="text"
                        required
                        placeholder="johndoe123"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

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
                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Security */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-1.5">
                    <label htmlFor="password" className="font-semibold text-xs text-foreground/80">Choose Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        id="password"
                        type="password"
                        required
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BUTTONS */}
              <div className="flex gap-3 pt-2">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="w-1/3 border-border hover:bg-muted/50 rounded-xl py-6 font-medium transition-all"
                  >
                    Back
                  </Button>
                )}
                
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-6 transition-all duration-200"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-6 transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Configuring Models...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <span>Create Free Account</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                )}
              </div>
            </form>

            {step === 1 && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <hr className="w-full border-border/60" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-3 text-muted-foreground">Or</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setError("Google SSO is not configured. Please register with email.")}
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
                  Sign Up with Google
                </Button>
              </>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            No credit card required. Free trials include 14 days of access to the Growth plan capabilities.
          </p>

        </div>
      </div>

    </div>
  )
}

export default function RegisterPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-semibold">Loading Registration...</span>
        </div>
      </div>
    }>
      <RegisterPageContent />
    </React.Suspense>
  )
}
