"use client"

import * as React from "react"
import Link from "next/link"
import { TrendingUp, Mic, ArrowLeft, Activity, Zap, Brain, MessageSquare, Globe, Sparkles, ChevronRight } from "lucide-react"

export default function VoiceAgentPage() {
  const [particles, setParticles] = React.useState<{ x: number; y: number; delay: number; duration: number }[]>([])
  const [email, setEmail] = React.useState("")
  const [subscribed, setSubscribed] = React.useState(false)
  const [pulse, setPulse] = React.useState(0)

  React.useEffect(() => {
    setParticles(Array.from({ length: 20 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3,
    })))
    const interval = setInterval(() => {
      setPulse(p => (p + 1) % 3)
    }, 600)
    return () => clearInterval(interval)
  }, [])

  const features = [
    { icon: <Mic className="h-5 w-5" />, title: "Real-Time Voice Analysis", desc: "Process customer calls in milliseconds with edge-deployed models" },
    { icon: <Brain className="h-5 w-5" />, title: "Sentiment Intelligence", desc: "Detect churn signals, frustration, and satisfaction in real-time" },
    { icon: <MessageSquare className="h-5 w-5" />, title: "Automatic Transcription", desc: "Full call logs with keyword extraction and action item detection" },
    { icon: <Zap className="h-5 w-5" />, title: "Instant Playbook Triggers", desc: "Auto-route high-risk callers to CSMs with pre-built retention scripts" },
    { icon: <Globe className="h-5 w-5" />, title: "Multilingual Support", desc: "50+ languages with dialect-aware churn risk scoring" },
    { icon: <Activity className="h-5 w-5" />, title: "Live Dashboard Sync", desc: "Voice interactions update customer health scores in real-time" },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0f0c29 0%,#1e1b4b 40%,#0c0a1e 100%)", fontFamily: "'Inter',sans-serif" }}>

      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <div key={i} className="absolute rounded-full opacity-20" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: "4px", height: "4px",
            background: i % 2 === 0 ? "#6366f1" : "#22d3ee",
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }} />
        ))}
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle,#6366f1,transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle,#22d3ee,transparent)" }} />
      </div>

      {/* Nav bar */}
      <nav className="absolute top-0 left-0 right-0 px-6 py-4 flex items-center justify-between z-10" style={{ borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6366f1,#22d3ee)" }}>
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="font-black text-xl text-white tracking-tight">Retain<span className="text-indigo-400">X</span></span>
        </div>
        <Link href="/dashboard">
          <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />Back to Dashboard
          </button>
        </Link>
      </nav>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-4xl w-full pt-20 pb-12">

        {/* Pulsing microphone orb */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Outer pulse rings */}
            {[0, 1, 2].map(i => (
              <div key={i} className="absolute inset-0 rounded-full" style={{
                border: `1px solid rgba(99,102,241,${pulse === i ? 0.6 : 0.1})`,
                transform: `scale(${1.3 + i * 0.4})`,
                transition: "all 0.3s ease",
                animation: `ping ${1.5 + i * 0.5}s ease-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }} />
            ))}
            <div className="relative h-24 w-24 rounded-2xl flex items-center justify-center shadow-2xl" style={{ background: "linear-gradient(135deg,#6366f1,#22d3ee)", boxShadow: "0 0 60px rgba(99,102,241,0.6)" }}>
              <Mic className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold" style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.4)", color: "#fbbf24" }}>
          <Sparkles className="h-3.5 w-3.5" />
          COMING SOON — Q3 2025
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
          AI Voice Agent<br />
          <span style={{ background: "linear-gradient(135deg,#6366f1,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            for Churn Prevention
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          An intelligent voice AI that listens to customer calls in real-time, detects churn signals, and triggers automated retention playbooks — before the customer even hangs up.
        </p>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 text-left">
          {features.map((f, i) => (
            <div key={i} className="p-5 rounded-2xl" style={{ background: "rgba(15,12,41,0.8)", border: "1px solid rgba(99,102,241,0.2)", backdropFilter: "blur(10px)" }}>
              <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}>
                {f.icon}
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{f.title}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Email subscribe */}
        <div className="max-w-md mx-auto">
          <p className="text-xs font-semibold text-slate-400 mb-3">Get notified when we launch → </p>
          {subscribed ? (
            <div className="p-4 rounded-2xl flex items-center justify-center gap-2" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)" }}>
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-bold">You're on the early access list! 🎉</span>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true) }} className="flex gap-2">
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" required
                className="flex-grow px-4 py-3 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)" }}
              />
              <button type="submit" className="px-4 py-3 rounded-xl text-sm font-bold text-white flex items-center gap-1.5" style={{ background: "linear-gradient(135deg,#6366f1,#22d3ee)", boxShadow: "0 4px 20px rgba(99,102,241,0.4)" }}>
                Notify Me <ChevronRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>

        {/* Back to dashboard */}
        <div className="mt-10">
          <Link href="/dashboard">
            <button className="text-xs font-semibold text-slate-500 hover:text-indigo-400 transition-colors">
              ← Return to Dashboard
            </button>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          from { transform: translateY(0px) scale(1); }
          to { transform: translateY(-20px) scale(1.5); }
        }
        @keyframes ping {
          0% { transform: scale(1.3); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
