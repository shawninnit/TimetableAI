import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { FacultyDashboard } from "@/components/faculty-dashboard"

export default function FacultyDashboardPage() {
  return (
    <AuthGuard allowedRoles={["faculty"]}>
      <div className="flex min-h-screen bg-background">
        <Navigation userRole="faculty" />
        <main className="flex-1 lg:ml-64">
          <FacultyDashboard />
        </main>
      </div>
    </AuthGuard>
  )
}
