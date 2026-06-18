"use client"

import * as React from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check, HelpCircle, ChevronDown, ChevronUp } from "lucide-react"

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = React.useState<"monthly" | "annual">("annual")
  const [openFaq, setOpenFaq] = React.useState<number | null>(null)

  // Pricing plans configuration
  const plans = [
    {
      name: "Starter",
      description: "Essential analytics for early stage products and teams.",
      price: billingPeriod === "annual" ? 39 : 49,
      features: [
        "Up to 1,000 monitored customers",
        "Standard ML prediction model",
        "Email playbook actions",
        "24-hour sync frequency",
        "Stripe & Chargebee integrations",
        "Email support (24h SLA)",
      ],
      cta: "Start Starter Trial",
      href: "/register?plan=starter",
      popular: false,
    },
    {
      name: "Growth",
      description: "Advanced analytics and automated playbooks for scaling SaaS.",
      price: billingPeriod === "annual" ? 119 : 149,
      features: [
        "Up to 10,000 monitored customers",
        "Customizable ML weight parameters",
        "Slack, Email & HubSpot playbooks",
        "1-hour sync frequency",
        "Full database & CRM integrations",
        "Priority support (2h SLA)",
        "API & Webhooks access",
      ],
      cta: "Start Growth Trial",
      href: "/register?plan=growth",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "Dedicated predictive models and custom SLAs for global platforms.",
      price: "Custom",
      features: [
        "Unlimited monitored customers",
        "Custom ML model training & fine-tuning",
        "Real-time event sync pipeline",
        "Unlimited custom playbook integrations",
        "Dedicated Account & ML Engineer",
        "99.9% uptime SLA guarantee",
        "SOC2 compliance documentation",
      ],
      cta: "Contact Enterprise Sales",
      href: "/contact?intent=enterprise",
      popular: false,
    },
  ]

  // Accordion questions & answers
  const faqs = [
    {
      q: "How accurate are the AI churn predictions?",
      a: "Our machine learning models average 92% to 95% accuracy in flagging customers who will cancel within 30 days. Predictions improve over time as the system ingests more historical usage data and correlates it with actual customer lifespan outcomes."
    },
    {
      q: "How long does the setup process take?",
      a: "For platforms using Stripe, Chargebee, or HubSpot, connection takes less than 15 minutes. Custom database connections (such as Postgres, MySQL, or Redshift) take about 1 to 2 hours of developer configuration using our visual API mapper."
    },
    {
      q: "Is my customer data secure?",
      a: "Absolutely. We are fully compliant with SOC2 Type II and GDPR rules. We do not store or process payment details or sensitive personal identifiers. All customer event records are encrypted end-to-end using TLS 1.3 and stored in isolated instances."
    },
    {
      q: "Can I customize the risk parameters?",
      a: "Yes. On the Growth and Enterprise tiers, you can configure the relative weight of user behaviors (such as support ticket volumes, logins, license additions, API errors, and invoice values) to tailor scores to your product's unique lifecycle."
    },
    {
      q: "What happens if we exceed our plan's monitored customer limit?",
      a: "We won't stop predicting risk. If you exceed your plan's limits, we will send an email notification letting you know, and we'll adjust your plan billing tier on the next monthly billing cycle."
    }
  ]

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-indigo-500/30">
      <Header />

      <main className="flex-grow">
        
        {/* HERO */}
        <section className="py-20 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 -z-10 h-80 bg-gradient-to-b from-indigo-50/30 to-transparent dark:from-indigo-950/10" />
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Pricing Plans</span>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Simple, transparent pricing
              </h1>
              <p className="mt-4 text-base text-muted-foreground">
                Start predicting customer risk with a 14-day free trial. No credit card required, cancel anytime.
              </p>

              {/* Toggle Switch */}
              <div className="mt-10 flex items-center justify-center gap-4">
                <span className={`text-sm ${billingPeriod === "monthly" ? "font-bold text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"}`}>
                  Monthly billing
                </span>
                
                <button
                  onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "annual" : "monthly")}
                  className="relative h-6 w-11 rounded-full bg-muted border border-border flex items-center transition-colors focus:outline-none"
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-indigo-600 transition-transform ${
                      billingPeriod === "annual" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>

                <span className={`text-sm flex items-center gap-1.5 ${billingPeriod === "annual" ? "font-bold text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"}`}>
                  Annual billing 
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                    Save 20%
                  </span>
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* PRICING CARDS */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col justify-between rounded-3xl border p-8 bg-card transition-all duration-300 ${
                  plan.popular
                    ? "border-indigo-600 dark:border-indigo-400 shadow-xl ring-2 ring-indigo-500/10 md:-translate-y-4 scale-[1.02]"
                    : "border-border shadow-sm hover:border-indigo-500/30"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider shadow">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="mt-2 text-xs text-muted-foreground min-h-[36px]">{plan.description}</p>
                  
                  {/* Price */}
                  <div className="mt-6 flex items-baseline">
                    {typeof plan.price === "number" ? (
                      <>
                        <span className="text-4xl font-extrabold tracking-tight font-mono">${plan.price}</span>
                        <span className="ml-1 text-sm text-muted-foreground">/month</span>
                      </>
                    ) : (
                      <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                    )}
                  </div>
                  {plan.popular && typeof plan.price === "number" && (
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                      Billed ${(plan.price * 12).toLocaleString()} annually
                    </p>
                  )}

                  <hr className="border-border/40 my-6" />

                  {/* Feature checklist */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-foreground/90">
                        <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  {plan.name === "Enterprise" ? (
                    <Link href={plan.href}>
                      <Button className="w-full bg-muted border border-border hover:bg-muted/80 text-foreground font-semibold rounded-xl py-6 text-xs transition-transform duration-200 hover:scale-[1.01]">
                        {plan.cta}
                      </Button>
                    </Link>
                  ) : (
                    <Link href={plan.href}>
                      <Button className={`w-full font-bold rounded-xl py-6 text-xs transition-transform duration-200 hover:scale-[1.01] ${
                        plan.popular
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-indigo-500/20"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}>
                        {plan.cta}
                      </Button>
                    </Link>
                  )}
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* DETAILED FEATURES MATRIX HEADER */}
        <section className="py-16 max-w-4xl mx-auto px-6 lg:px-8 border-t border-border/40">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight">Compare Plan Features</h2>
            <p className="text-sm text-muted-foreground mt-2">Find the specific level of prediction details your team requires.</p>
          </div>

          <div className="border border-border/60 rounded-2xl overflow-hidden bg-card text-xs">
            {/* Headers */}
            <div className="grid grid-cols-4 bg-muted/30 border-b border-border/40 p-4 font-bold text-foreground">
              <div>Capabilities</div>
              <div className="text-center">Starter</div>
              <div className="text-center">Growth</div>
              <div className="text-center">Enterprise</div>
            </div>

            {/* Matrix Rows */}
            {[
              { label: "Accuracy Reporting", starter: "Standard", growth: "Advanced", enterprise: "Custom Tailored" },
              { label: "Prediction Frequency", starter: "24 Hours", growth: "1 Hour", enterprise: "Real-time" },
              { label: "Playbook Auto-actions", starter: "Email Only", growth: "Multi-Channel", enterprise: "Unlimited Workflows" },
              { label: "Historical Training", starter: "6 Months", growth: "24 Months", enterprise: "Full History" },
              { label: "Data Integration APIs", starter: "Stripe / Chargebee", growth: "All Sources", enterprise: "Custom Integrators" },
              { label: "Dedicated Manager", starter: "No", growth: "No", enterprise: "Yes" },
            ].map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-4 border-b border-border/20 p-4 last:border-0 hover:bg-muted/10 transition-colors">
                <div className="font-semibold text-muted-foreground">{row.label}</div>
                <div className="text-center">{row.starter}</div>
                <div className="text-center font-semibold text-indigo-600 dark:text-indigo-400">{row.growth}</div>
                <div className="text-center">{row.enterprise}</div>
              </div>
            ))}
          </div>
        </section>

        {/* INTERACTIVE FAQ ACCORDION */}
        <section className="py-24 max-w-4xl mx-auto px-6 lg:px-8 border-t border-border/40">
          <div className="text-center mb-16">
            <HelpCircle className="h-10 w-10 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="mt-2 text-base text-muted-foreground">Everything you need to know about our models and trial periods.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="border border-border/60 rounded-2xl bg-card overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-6 text-left font-semibold text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-xs text-muted-foreground leading-relaxed animate-in slide-in-from-top-2 duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
