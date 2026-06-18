"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Menu, X, Sun, Moon, TrendingUp, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by waiting for mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20">
            <TrendingUp className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
            Retain<span className="text-indigo-600 dark:text-indigo-400 font-extrabold">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 relative py-1 hover:text-indigo-600 dark:hover:text-indigo-400",
                  isActive 
                    ? "text-indigo-600 dark:text-indigo-400" 
                    : "text-muted-foreground"
                )}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl w-9 h-9"
            aria-label="Toggle theme"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400 transition-all" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem] text-indigo-600 transition-all" />
            )}
          </Button>

          <Link href="/register">
            <Button variant="ghost" className="font-medium text-sm rounded-xl">
              Sign In
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-indigo-500/10 font-semibold rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5">
              Dashboard Demo
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button & Theme Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl w-9 h-9"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-600" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl w-9 h-9"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/20 bg-background/95 backdrop-blur-lg px-6 py-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "text-base font-semibold py-2 transition-colors",
                  pathname === item.href ? "text-indigo-600 dark:text-indigo-400" : "text-foreground/80"
                )}
              >
                {item.name}
              </Link>
            ))}
            <hr className="border-border/40 my-1" />
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-start rounded-xl gap-2 font-medium">
                <User className="h-4 w-4 text-muted-foreground" />
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold shadow-sm">
                Dashboard Demo
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
