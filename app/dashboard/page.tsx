import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DashboardView } from "@/components/dashboard-view"

export const metadata = {
  title: "Dashboard - EcoSort AI",
  description: "View your waste classification analytics, achievements, and environmental impact.",
}

export default function DashboardPage() {
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track your waste classification activity, view analytics, and earn achievements.
          </p>
        </div>
        <DashboardView />
      </div>
      <Footer />
    </main>
  )
}
