"use client"
import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { fetchDashboard, getToken, type DashboardData } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"

export default function SandboxPage() {
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
        <div className="h-20 w-20 bg-violet-500/10 rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-violet-500/20">
          <Sparkles className="h-10 w-10 text-violet-600 dark:text-violet-400" />
        </div>
        <h2 className="text-2xl font-bold mb-3 tracking-tight">ML Risk Sandbox</h2>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          Train and test machine learning models for predicting churn. View feature importance and model accuracy metrics.
        </p>
      </div>
    </DashboardLayout>
  )
}
