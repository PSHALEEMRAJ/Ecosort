import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WasteClassifier } from "@/components/waste-classifier"

export const metadata = {
  title: "Classify Waste - EcoSort AI",
  description: "Upload a waste image for instant AI classification using our pretrained MobileNet model.",
}

export default function ClassifyPage() {
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl text-balance">
            AI Waste Classification
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Upload any waste image and our pretrained MobileNet V2 model will classify it
            into the correct category with disposal guidance.
          </p>
        </div>
        <WasteClassifier />
      </div>
      <Footer />
    </main>
  )
}
