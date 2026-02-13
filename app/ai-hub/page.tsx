"use client"

import React from "react"
import { useRouter } from "next/navigation"
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
  ArrowLeft,
} from "lucide-react"

export default function AIHubPage() {
  const router = useRouter()

  const features = [
    {
      icon: BookOpen,
      color: "blue",
      title: "Personalized Learning",
      description: "AI-generated learning paths customized to your waste classification history",
      features: [
        "Dynamic module recommendations",
        "Interactive quizzes",
        "Achievement badges",
      ],
      buttonText: "Start Learning",
      action: () => router.push("/learning-path"),
    },
    {
      icon: MessageSquare,
      color: "purple",
      title: "EcoBot Chatbot",
      description: "AI assistant for instant answers about waste disposal and sustainability",
      features: [
        "Intent recognition",
        "Context-aware responses",
        "Multi-turn conversations",
      ],
      buttonText: "Chat Now",
      action: () => router.push("/ecobot"),
    },
    {
      icon: MapPin,
      color: "green",
      title: "Smart Facility Finder",
      description: "ML-powered recommendations for nearby disposal facilities",
      features: [
        "Location optimization",
        "Rating & reviews",
        "Scheduling assistance",
      ],
      buttonText: "Find Facilities",
      action: () => router.push("/facility-finder"),
    },
    {
      icon: Target,
      color: "amber",
      title: "Sustainability Goals",
      description: "AI-recommended goals with progress tracking and gamification",
      features: [
        "Personalized recommendations",
        "Weekly reports",
        "Leaderboards",
      ],
      buttonText: "Set Goals",
      action: () => router.push("/goals"),
    },
    {
      icon: Zap,
      color: "cyan",
      title: "Analytics & Insights",
      description: "ML-driven analysis of your waste patterns and environmental impact",
      features: [
        "Behavior analysis",
        "Predictive trends",
        "Community benchmarks",
      ],
      buttonText: "View Analytics",
      action: () => router.push("/analytics"),
    },
    {
      icon: Brain,
      color: "red",
      title: "Environmental Calculator",
      description: "Detailed impact metrics including carbon footprint and decomposition time",
      features: [
        "Carbon calculations",
        "LCA data",
        "Equivalents",
      ],
      buttonText: "Calculate Impact",
      action: () => router.push("/impact-calculator"),
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <section className="border-b border-border bg-gradient-to-br from-card to-secondary/30 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
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
              {features.map((feature, index) => {
                const Icon = feature.icon
                const colorClasses = {
                  blue: "bg-blue-500/10 text-blue-500",
                  purple: "bg-purple-500/10 text-purple-500",
                  green: "bg-green-500/10 text-green-500",
                  amber: "bg-amber-500/10 text-amber-500",
                  cyan: "bg-cyan-500/10 text-cyan-500",
                  red: "bg-red-500/10 text-red-500",
                }
                const bulletColor = {
                  blue: "text-blue-500",
                  purple: "text-purple-500",
                  green: "text-green-500",
                  amber: "text-amber-500",
                  cyan: "text-cyan-500",
                  red: "text-red-500",
                }

                return (
                  <Card
                    key={index}
                    className="group border-border p-6 transition-all hover:border-primary hover:shadow-lg"
                  >
                    <div className={`mb-4 rounded-lg ${colorClasses[feature.color as keyof typeof colorClasses]} p-3 w-fit`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {feature.features.map((feat, i) => (
                        <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                          <span className={bulletColor[feature.color as keyof typeof bulletColor]}>•</span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="mt-4 w-full" 
                      size="sm"
                      onClick={feature.action}
                    >
                      {feature.buttonText}
                    </Button>
                  </Card>
                )
              })}
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

          {/* Navigation Footer */}
          <div className="flex gap-3 pt-6">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button 
              onClick={() => router.push("/dashboard")}
              className="gap-2"
            >
              View Dashboard
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
