import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { ReviewerDashboard } from "@/components/reviewer-dashboard"

export default function ReviewerDashboardPage() {
  return (
    <AuthGuard allowedRoles={["reviewer"]}>
      <div className="flex min-h-screen bg-background">
        <Navigation userRole="reviewer" />
        <main className="flex-1 lg:ml-64">
          <ReviewerDashboard />
        </main>
      </div>
    </AuthGuard>
  )
}
