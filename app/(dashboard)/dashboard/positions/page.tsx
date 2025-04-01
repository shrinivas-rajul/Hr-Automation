import { PositionsManager } from "@/components/dashboard/positions-manager"

export default function PositionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Manage Positions</h2>
        <p className="text-muted-foreground">Create, edit, and manage job positions for your organization.</p>
      </div>

      <PositionsManager />
    </div>
  )
}

