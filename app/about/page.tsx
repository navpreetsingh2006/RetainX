"use client"

import * as React from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Sparkles, Users, Award, ShieldAlert, Cpu, Heart, CheckCircle2 } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: <Cpu className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Explainable AI First",
      desc: "No black boxes. We believe predictive models are only as good as they are understandable. We show customer success managers exactly why a churn score is flagged.",
    },
    {
      icon: <Heart className="h-6 w-6 text-violet-600 dark:text-violet-400" />,
      title: "Proactive Relationship Care",
      desc: "Retention isn't about blocking cancellations at the door. It's about providing value early, spotting usage drops, and rebuilding the relationship dynamically.",
    },
    {
      icon: <Users className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />,
      title: "Action-Oriented Insights",
      desc: "Information without action is noise. We don't just dump charts on your ops teams; we trigger immediate, customizable playbooks that do the work.",
    },
    {
      icon: <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Operational Simplicity",
      desc: "Integration shouldn't take six months. We build standard connectors to database and billing engines so you can see churn patterns within two hours.",
    },
  ]

  const milestones = [
    { year: "2024", title: "The Spark", desc: "Founded in San Francisco by SaaS operations leads frustrated with backward-looking churn spreadsheets. Built the first ML engine core." },
    { year: "2025", title: "Series Seed & Growth", desc: "Raised $4.2M from leading enterprise funds. Launched no-code playbooks and automated workflows, expanding to Stripe and HubSpot APIs." },
    { year: "2026", title: "Enterprise Scaling", desc: "Achieved SOC2 Type II compliance. Currently monitoring over 150 million customer endpoints across 400+ companies globally." },
  ]

  const team = [
    { name: "Alex Rivera", role: "CEO & Co-founder", desc: "SaaS Ops veteran. Former VP of Customer Success Ops at Salesforce.", initials: "AR" },
    { name: "Dr. Mei Lin", role: "CTO & Co-founder", desc: "PhD in Machine Learning from Stanford. Former Principal Scientist at Google AI.", initials: "ML" },
    { name: "Sophia Chen", role: "Head of Customer Success", desc: "Retention strategist. Scaled the startup onboarding division at Stripe.", initials: "SC" },
    { name: "Jordan Vance", role: "Head of Product", desc: "UX designer. Led customer experience products at Intercom for 5 years.", initials: "JV" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-indigo-500/30">
      <Header />

      <main className="flex-grow">
        
        {/* STORY HERO */}
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(115%_120%_at_top_left,rgba(99,102,241,0.05)_0%,transparent_70%)]" />
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Our Mission</span>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                Fighting subscription fatigue with proactive AI
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                We believe that great customer relationships are built on understanding. RetainAI was founded to replace late-stage cancellation offers with early-stage value reviews, ensuring companies grow together with their subscribers.
              </p>
            </div>
          </div>
        </section>

        {/* METRICS SHOWCASE */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 border border-border/60 bg-card rounded-3xl shadow-sm text-center">
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 font-mono">150M+</p>
              <p className="text-xs text-muted-foreground mt-1">Daily Events Tracked</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 font-mono">400+</p>
              <p className="text-xs text-muted-foreground mt-1">SaaS Platforms Monitored</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 font-mono">$12M+</p>
              <p className="text-xs text-muted-foreground mt-1">Annual Churn Savings</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 font-mono">SOC2</p>
              <p className="text-xs text-muted-foreground mt-1">Certified Compliant</p>
            </div>
          </div>
        </section>

        {/* CORE VALUES */}
        <section className="py-24 border-t border-border/40 bg-muted/10 transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl font-bold tracking-tight">The Principles that Drive Us</h2>
              <p className="mt-4 text-base text-muted-foreground">
                We design algorithms to protect revenue and strengthen human customer relationships.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, idx) => (
                <div key={idx} className="flex gap-4 p-6 rounded-2xl border border-border bg-card shadow-sm hover:border-indigo-500/30 transition-all duration-300">
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{value.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TIMELINE / MILESTONES */}
        <section className="py-24 max-w-5xl mx-auto px-6 lg:px-8 border-t border-border/40">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Our Journey So Far</h2>
          </div>

          <div className="relative border-l border-border/60 ml-4 md:ml-32 space-y-12">
            {milestones.map((item, idx) => (
              <div key={idx} className="relative pl-8 md:pl-12">
                {/* Year tag left aligned on desktop */}
                <div className="hidden md:block absolute -left-32 top-1 text-right w-24 font-mono font-black text-xl text-indigo-600 dark:text-indigo-400">
                  {item.year}
                </div>
                
                {/* Dot indicator */}
                <div className="absolute -left-[9px] top-1.5 h-4.5 w-4.5 rounded-full border-4 border-background bg-indigo-600" />
                
                {/* Mobile Year Badge */}
                <div className="md:hidden inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold font-mono mb-2">
                  {item.year}
                </div>

                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TEAM GRID */}
        <section className="py-24 border-t border-border/40 bg-muted/10 transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Leadership</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">Meet the RetainAI Pioneers</h2>
              <p className="mt-4 text-sm text-muted-foreground">
                We're a distributed team of engineers, data scientists, and customer operations leaders.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, idx) => (
                <div key={idx} className="group relative rounded-2xl border border-border bg-card p-6 text-center hover:border-indigo-500/30 transition-all duration-300">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
                    {member.initials}
                  </div>
                  <h3 className="font-bold text-base">{member.name}</h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">{member.role}</p>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{member.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
