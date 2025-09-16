import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { ReportsPage } from "@/components/reports-page"

export default function AdminReportsPage() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-background">
        <Navigation userRole="admin" />
        <main className="flex-1 lg:ml-64">
          <ReportsPage />
        </main>
      </div>
    </AuthGuard>
  )
}
