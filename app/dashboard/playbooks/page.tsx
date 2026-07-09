"use client"
import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { fetchDashboard, getToken, type DashboardData } from "@/lib/api"
import { useRouter } from "next/navigation"
import { GitBranch } from "lucide-react"

export default function PlaybooksPage() {
  const router = useRouter()
  const [dashboard, setDashboard] = React.useState<DashboardData | null>(null)
  const [search, setSearch] = React.useState("")
  const [refreshing, setRefreshing] = React.useState(false)

  React.useEffect(() => {
    if (!getToken()) router.replace("/login")
    else {
      fetchDashboard().then(setDashboard)
    }
  }, [router])

  return (
    <DashboardLayout
      dashboard={dashboard}
      search={search}
      setSearch={setSearch}
      onRefresh={() => {}}
      refreshing={refreshing}
    >
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-border bg-card shadow-sm h-[60vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="h-20 w-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-emerald-500/20">
          <GitBranch className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold mb-3 tracking-tight">Playbooks & Automation</h2>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          Configure automated outreach sequences, retention discounts, and value review flows based on ML risk scores.
        </p>
      </div>
    </DashboardLayout>
  )
}
