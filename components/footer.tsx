import { Leaf } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-heading text-sm font-semibold text-foreground">
            EcoSort AI
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Built with TensorFlow.js, MobileNet V2 &amp; Next.js. Empowering smarter waste management through AI.
        </p>
      </div>
    </footer>
  )
}
