import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { ReviewWorkflow } from "@/components/review-workflow"

export default function ReviewPage() {
  return (
    <AuthGuard allowedRoles={["reviewer"]}>
      <div className="flex min-h-screen bg-background">
        <Navigation userRole="reviewer" />
        <main className="flex-1 lg:ml-64">
          <ReviewWorkflow />
        </main>
      </div>
    </AuthGuard>
  )
}
