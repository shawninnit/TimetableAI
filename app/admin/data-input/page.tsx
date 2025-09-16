import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { DataInputDashboard } from "@/components/data-input-dashboard"

export default function DataInputPage() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-background">
        <Navigation userRole="admin" />
        <main className="flex-1 lg:ml-64">
          <DataInputDashboard />
        </main>
      </div>
    </AuthGuard>
  )
}
