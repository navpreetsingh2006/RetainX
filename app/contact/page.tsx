"use client"

import * as React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import "@/app/globals.css"
import { Mail, Phone, MapPin, Clock, CheckCircle2, AlertCircle } from "lucide-react"

export default function ContactPage() {
  // Form State
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [company, setCompany] = React.useState("")
  const [mrr, setMrr] = React.useState("")
  const [message, setMessage] = React.useState("")

  // UX States
  const [loading, setLoading] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validations
    if (!name || !email || !message) {
      setError("Please fill out all required fields.")
      return
    }

    setLoading(true)
    setError("")

    // Mock API call
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)

      // Clear inputs
      setName("")
      setEmail("")
      setCompany("")
      setMrr("")
      setMessage("")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-indigo-500/30">
      <Header />

      <main className="flex-grow">

        {/* HERO */}
        <section className="py-20 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 -z-10 h-80 bg-gradient-to-b from-indigo-50/30 to-transparent dark:from-indigo-950/10" />
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Connect with Us</span>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Let's talk customer retention
            </h1>
            <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto">
              Want to see a customized prediction model using your historical database? Have a pricing question? Drop us a note, and we'll reply in under 2 hours.
            </p>
          </div>
        </section>

        {/* CONTENT SECTION */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Contact details - Left Column */}
            <div className="lg:col-span-5 space-y-8">

              <div className="bg-card border border-border p-8 rounded-3xl space-y-6 shadow-sm">
                <h3 className="text-lg font-bold">Contact Information</h3>
                <p className="text-sm text-muted-foreground">
                  Reach out directly or schedule a virtual session with our integration leads.
                </p>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-muted-foreground">Email sales</p>
                      <a href="mailto:hello@ReatainX.com" className="font-medium hover:underline">hello@ReatainX.com</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-muted-foreground">Call our office</p>
                      <a href="tel:+15550192834" className="font-medium hover:underline">+1 (555) 019-2834</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-muted-foreground">HQ location</p>
                      <p className="font-medium">100 Pine St, San Francisco, CA 94111</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-muted-foreground">Office hours</p>
                      <p className="font-medium">Monday - Friday: 9 AM - 6 PM PST</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Mockup SVG */}
              <div className="border border-border/60 rounded-3xl p-6 bg-card shadow-sm h-60 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-900/5 dark:bg-indigo-950/15 pointer-events-none" />
                <div className="absolute top-1/3 left-1/4 h-2 w-2 bg-indigo-600 rounded-full animate-ping" />
                <div className="absolute top-1/3 left-1/4 h-2 w-2 bg-indigo-600 rounded-full" />

                <div className="absolute top-1/2 left-2/3 h-2 w-2 bg-indigo-600 rounded-full" />
                <div className="absolute top-1/4 left-1/2 h-2 w-2 bg-indigo-600 rounded-full" />

                {/* SVG mock map contours */}
                <svg className="absolute inset-0 h-full w-full opacity-10 dark:opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M10,20 Q30,40 50,20 T90,30" fill="none" stroke="currentColor" strokeWidth="1" />
                  <path d="M5,60 Q40,80 60,50 T95,70" fill="none" stroke="currentColor" strokeWidth="1" />
                  <path d="M30,10 Q60,40 70,80" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>

                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest relative">Global Coverage</span>
                <p className="text-xs text-muted-foreground relative z-10">We host databases in US-East, US-West, EU-Central, and AP-Southeast to ensure data residency compliance.</p>
              </div>

            </div>

            {/* Interactive Form - Right Column */}
            <div className="lg:col-span-7 bg-card border border-border p-8 rounded-3xl shadow-sm">
              <h3 className="text-lg font-bold mb-6">Send an Inquiry</h3>

              {submitted ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-6 rounded-2xl space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6" />
                    <span className="font-bold">Inquiry Sent Successfully!</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    Thank you for contacting ReatainX. An integration lead has been assigned to your ticket and will follow up with an email draft containing benchmark reports within two hours.
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline" className="text-xs rounded-xl">
                    Submit Another Ticket
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-sm">

                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-xl flex items-center gap-2 text-xs">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="font-semibold text-xs text-foreground/80">Full Name *</label>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="font-semibold text-xs text-foreground/80">Work Email *</label>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="company" className="font-semibold text-xs text-foreground/80">Company Name</label>
                      <input
                        id="company"
                        type="text"
                        placeholder="Acme Corp"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="mrr" className="font-semibold text-xs text-foreground/80">Monthly Recurring Revenue (MRR)</label>
                      <select
                        id="mrr"
                        value={mrr}
                        onChange={(e) => setMrr(e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                      >
                        <option value="">Select MRR range</option>
                        <option value="under-10k">Under $10,000 / mo</option>
                        <option value="10k-50k">$10,000 - $50,000 / mo</option>
                        <option value="50k-250k">$50,000 - $250,000 / mo</option>
                        <option value="over-250k">Over $250,000 / mo</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="font-semibold text-xs text-foreground/80">How can we help? *</label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      placeholder="Tell us about your tech stack and current monthly churn metrics..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors resize-none"
                    />
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
                        <span>Processing Inquiry...</span>
                      </div>
                    ) : "Submit Sales Inquiry"}
                  </Button>

                </form>
              )}

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
