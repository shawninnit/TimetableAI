import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminDashboardPage() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-background">
        <Navigation userRole="admin" />
        <main className="flex-1 lg:ml-64">
          <AdminDashboard />
        </main>
      </div>
    </AuthGuard>
  )
}
