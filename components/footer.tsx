"use client"

import * as React from "react"
import Link from "next/link"
import { TrendingUp, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const [email, setEmail] = React.useState("")
  const [subscribed, setSubscribed] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">

          {/* Logo and Pitch */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span>Retain<span className="text-indigo-600 dark:text-indigo-400">AI</span></span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Predict churn before it happens. Our enterprise-grade AI analytics help subscription businesses keep customers engaged and growing.
            </p>
            {/* <div className="flex space-x-5">
              <a href="#" className="text-muted-foreground hover:text-indigo-500 transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-indigo-500 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-indigo-500 transition-colors">
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </a>
            </div> */}
          </div>

          {/* Quick Links */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Product</h3>
                <ul role="list" className="mt-4 space-y-3">
                  <li>
                    <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Interactive Demo
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Company</h3>
                <ul role="list" className="mt-4 space-y-3">
                  <li>
                    <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Stay Updated</h3>
              <p className="mt-4 text-sm text-muted-foreground">
                Get monthly insights, retention tips, and product releases.
              </p>
              <form onSubmit={handleSubmit} className="mt-4 sm:flex sm:max-w-md gap-2">
                <div className="relative flex-grow">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="mt-2 sm:mt-0">
                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium">
                    {subscribed ? "Subscribed!" : "Subscribe"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ReatainX Inc. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
