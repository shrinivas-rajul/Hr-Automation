import { ShortlistedCandidates } from "@/components/dashboard/shortlisted-candidates"

export default function ShortlistedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Shortlisted Candidates</h2>
        <p className="text-muted-foreground">Manage and schedule interviews with your shortlisted candidates.</p>
      </div>

      <ShortlistedCandidates />
    </div>
  )
}

