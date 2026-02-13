import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CommunityHub } from "@/components/community-hub"

export const metadata = {
  title: "Community & Impact - EcoSort AI",
  description: "Join our global community, view leaderboards, participate in challenges, and track your environmental impact.",
}

export default function CommunityPage() {
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl text-balance">
            Community & Impact
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
            Join thousands of sustainability champions making a real difference. Track collective impact, 
            compete in challenges, and inspire your community to live more sustainably.
          </p>
        </div>
        <CommunityHub />
      </div>
      <Footer />
    </main>
  )
}
