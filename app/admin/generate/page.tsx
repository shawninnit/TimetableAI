import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { TimetableGenerator } from "@/components/timetable-generator"

export default function GeneratePage() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-background">
        <Navigation userRole="admin" />
        <main className="flex-1 lg:ml-64">
          <TimetableGenerator />
        </main>
      </div>
    </AuthGuard>
  )
}
