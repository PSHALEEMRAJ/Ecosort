import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SustainabilityTipsHub } from "@/components/sustainability-tips-hub"

export const metadata = {
  title: "Sustainability Tips - EcoSort AI",
  description: "Personalized sustainability tips, guides, and actionable advice to reduce your environmental impact.",
}

export default function TipsPage() {
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl text-balance">
            Sustainability Tips
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
            Discover actionable tips tailored to your waste patterns. From simple daily changes to transformative 
            lifestyle shifts, find ways to reduce your environmental footprint and make a positive impact.
          </p>
        </div>
        <SustainabilityTipsHub />
      </div>
      <Footer />
    </main>
  )
}
