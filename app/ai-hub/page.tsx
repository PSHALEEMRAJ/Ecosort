import React from "react"
import AIInsightsDashboard from "@/components/ai-insights-dashboard"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Brain,
  BookOpen,
  MessageSquare,
  MapPin,
  Target,
  Zap,
} from "lucide-react"

export const metadata = {
  title: "AI Intelligence Hub | EcoSort",
  description: "AI-powered insights, learning, and sustainability tracking for waste management",
}

export default function AIHubPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-br from-card to-secondary/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/20 p-3">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                AI Intelligence Hub
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Personalized insights and recommendations powered by machine learning
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* AI Insights */}
          <div>
            <AIInsightsDashboard />
          </div>

          {/* Feature Sections */}
          <div className="space-y-8">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Explore AI-Powered Features
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Educational System */}
              <Card className="group cursor-pointer border-border p-6 transition-all hover:border-primary hover:shadow-lg">
                <div className="mb-4 rounded-lg bg-blue-500/10 p-3 w-fit">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Personalized Learning
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  AI-generated learning paths customized to your waste classification history
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-blue-500">•</span> Dynamic module recommendations
                  </li>
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-blue-500">•</span> Interactive quizzes
                  </li>
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-blue-500">•</span> Achievement badges
                  </li>
                </ul>
                <Button className="mt-4 w-full" size="sm">
                  Start Learning
                </Button>
              </Card>

              {/* AI Chatbot */}
              <Card className="group cursor-pointer border-border p-6 transition-all hover:border-primary hover:shadow-lg">
                <div className="mb-4 rounded-lg bg-purple-500/10 p-3 w-fit">
                  <MessageSquare className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  EcoBot Chatbot
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  AI assistant for instant answers about waste disposal and sustainability
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-purple-500">•</span> Intent recognition
                  </li>
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-purple-500">•</span> Context-aware responses
                  </li>
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-purple-500">•</span> Multi-turn conversations
                  </li>
                </ul>
                <Button className="mt-4 w-full" size="sm">
                  Chat Now
                </Button>
              </Card>

              {/* Facility Finder */}
              <Card className="group cursor-pointer border-border p-6 transition-all hover:border-primary hover:shadow-lg">
                <div className="mb-4 rounded-lg bg-green-500/10 p-3 w-fit">
                  <MapPin className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Smart Facility Finder
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  ML-powered recommendations for nearby disposal facilities
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-green-500">•</span> Location optimization
                  </li>
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-green-500">•</span> Rating & reviews
                  </li>
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-green-500">•</span> Scheduling assistance
                  </li>
                </ul>
                <Button className="mt-4 w-full" size="sm">
                  Find Facilities
                </Button>
              </Card>

              {/* Goals & Tracking */}
              <Card className="group cursor-pointer border-border p-6 transition-all hover:border-primary hover:shadow-lg">
                <div className="mb-4 rounded-lg bg-amber-500/10 p-3 w-fit">
                  <Target className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Sustainability Goals
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  AI-recommended goals with progress tracking and gamification
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-amber-500">•</span> Personalized recommendations
                  </li>
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-amber-500">•</span> Weekly reports
                  </li>
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-amber-500">•</span> Leaderboards
                  </li>
                </ul>
                <Button className="mt-4 w-full" size="sm">
                  Set Goals
                </Button>
              </Card>

              {/* Advanced Analytics */}
              <Card className="group cursor-pointer border-border p-6 transition-all hover:border-primary hover:shadow-lg">
                <div className="mb-4 rounded-lg bg-cyan-500/10 p-3 w-fit">
                  <Zap className="h-6 w-6 text-cyan-500" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Analytics & Insights
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  ML-driven analysis of your waste patterns and environmental impact
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-cyan-500">•</span> Behavior analysis
                  </li>
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-cyan-500">•</span> Predictive trends
                  </li>
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-cyan-500">•</span> Community benchmarks
                  </li>
                </ul>
                <Button className="mt-4 w-full" size="sm">
                  View Analytics
                </Button>
              </Card>

              {/* Impact Calculator */}
              <Card className="group cursor-pointer border-border p-6 transition-all hover:border-primary hover:shadow-lg">
                <div className="mb-4 rounded-lg bg-red-500/10 p-3 w-fit">
                  <Brain className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Environmental Calculator
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Detailed impact metrics including carbon footprint and decomposition time
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-red-500">•</span> Carbon calculations
                  </li>
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-red-500">•</span> LCA data
                  </li>
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-red-500">•</span> Equivalents
                  </li>
                </ul>
                <Button className="mt-4 w-full" size="sm">
                  Calculate Impact
                </Button>
              </Card>
            </div>
          </div>

          {/* Statistics Section */}
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-8">
            <h3 className="font-heading text-xl font-semibold text-foreground">
              AI Impact by the Numbers
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-3xl font-bold text-primary">98%</p>
                <p className="mt-1 text-sm text-muted-foreground">Classification Accuracy</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">45+</p>
                <p className="mt-1 text-sm text-muted-foreground">Supported Categories</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">1M+</p>
                <p className="mt-1 text-sm text-muted-foreground">Items Classified</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </main>
  )
}
