import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { KnowledgeBase } from "@/components/knowledge-base"

export const metadata = {
  title: "Knowledge Base - EcoSort AI",
  description: "Learn about waste categories, recycling tips, disposal instructions, and the AI model behind EcoSort.",
}

export default function KnowledgePage() {
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl text-balance">
            Waste Knowledge Base
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Everything you need to know about waste categories, proper disposal methods,
            recycling tips, and how our AI classification works.
          </p>
        </div>
        <KnowledgeBase />
      </div>
      <Footer />
    </main>
  )
}
