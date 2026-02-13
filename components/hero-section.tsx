import Link from "next/link"
import { ArrowRight, Zap, Shield, BarChart3, Brain } from "lucide-react"

const stats = [
  { value: "98.5%", label: "Classification Accuracy" },
  { value: "6", label: "Waste Categories" },
  { value: "< 2s", label: "Processing Time" },
  { value: "MobileNet", label: "Pretrained Model" },
]

const features = [
  {
    icon: Zap,
    title: "Real-Time Classification",
    description: "Upload any waste image and get instant AI-powered classification with confidence scores using TensorFlow.js MobileNet.",
    href: "/classify",
  },
  {
    icon: Brain,
    title: "Enhanced Accuracy Pipeline",
    description: "Image preprocessing, exact-match mapping for 200+ ImageNet classes, weighted voting across top-10 predictions, and sub-category detection.",
    href: "/classify",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track your waste classification history, view trends, and monitor your environmental impact with detailed charts.",
    href: "/dashboard",
  },
]

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Background glow effect */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pb-20 pt-20 md:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Zap className="h-3.5 w-3.5" />
            Powered by TensorFlow.js + MobileNet V2
          </div>
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance">
            Classify Waste with{" "}
            <span className="text-primary">AI Precision</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Upload an image of any waste item and our pretrained deep learning model 
            instantly classifies it into the correct category. Built with MobileNet V2 
            transfer learning for maximum accuracy.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/classify"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:gap-3"
            >
              Start Classifying
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-8 py-3.5 text-base font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-6 text-center"
            >
              <div className="font-heading text-2xl font-bold text-primary md:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl text-balance">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Our AI model uses transfer learning from Google&#39;s MobileNet V2, 
            fine-tuned with a comprehensive waste classification layer.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:bg-card/80"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Waste Categories */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl text-balance">
            Waste Categories We Detect
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Our model classifies waste into 6 primary categories for proper disposal and recycling guidance.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Recyclable", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", desc: "Paper, cardboard, glass bottles, aluminum cans" },
            { name: "Organic", color: "bg-green-500/10 text-green-400 border-green-500/20", desc: "Food waste, garden clippings, biodegradable materials" },
            { name: "E-Waste", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", desc: "Electronics, batteries, circuit boards, cables" },
            { name: "Plastic", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20", desc: "PET bottles, bags, containers, packaging" },
            { name: "Hazardous", color: "bg-red-500/10 text-red-400 border-red-500/20", desc: "Chemicals, paint, medical waste, fluorescent bulbs" },
            { name: "General Waste", color: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20", desc: "Non-recyclable, mixed materials, ceramics" },
          ].map((cat) => (
            <Link key={cat.name} href="/knowledge" className={`rounded-xl border p-6 transition-all hover:scale-[1.02] ${cat.color}`}>
              <h3 className="font-heading text-lg font-semibold">{cat.name}</h3>
              <p className="mt-1 text-sm opacity-80">{cat.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium opacity-70">
                Learn more <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
