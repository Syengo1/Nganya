export default function UserDashboard({ params }: { params: { slug: string } }) {
  // The 'slug' will be "@antony" (encoded)
  // We decode it to remove the %40 if necessary, or just display it.
  const username = decodeURIComponent(params.slug)

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {username}</h1>
          <p className="text-muted-foreground mt-1">Here is what's happening with your bookings.</p>
        </div>
      </div>

      {/* Placeholder for Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 bg-white dark:bg-zinc-950 border rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Upcoming Trips</h3>
          <div className="text-2xl font-bold mt-2">0</div>
        </div>
        <div className="p-6 bg-white dark:bg-zinc-950 border rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Saved Nganyas</h3>
          <div className="text-2xl font-bold mt-2">0</div>
        </div>
        <div className="p-6 bg-white dark:bg-zinc-950 border rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Points</h3>
          <div className="text-2xl font-bold mt-2">0</div>
        </div>
      </div>
    </div>
  )
}