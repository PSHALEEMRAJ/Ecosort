import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  TrendingUp,
  Award,
  Brain,
  Zap,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AIInsight {
  id: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  actionItems: string[]
  estimatedCarbonSavings: number
}

interface AnalyticsData {
  userSegment: string
  recyclingRate: number
  habitConsistency: number
  userRank: number
  userPercentile: number
  topCategory: string
  engagementTrend: string
}

export function AIInsightsDashboard() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading insights
    const timer = setTimeout(() => {
      setInsights([
        {
          id: "1",
          title: "Boost Your Recycling Rate",
          description: "Your recycling rate is 45%. Target 70% for maximum environmental impact.",
          impact: "high",
          actionItems: [
            "Learn local recycling guidelines",
            "Find nearby recycling centers",
            "Join community challenges",
          ],
          estimatedCarbonSavings: 15,
        },
        {
          id: "2",
          title: "Build Consistent Habits",
          description: "Your activity is inconsistent. Daily engagement increases impact.",
          impact: "medium",
          actionItems: [
            "Set daily reminders",
            "Track your 7-day streak",
            "Earn consistency badges",
          ],
          estimatedCarbonSavings: 8,
        },
        {
          id: "3",
          title: "E-Waste Specialization",
          description: "You frequently classify electronics. Become an e-waste expert.",
          impact: "medium",
          actionItems: [
            "Complete e-waste module",
            "Learn proper disposal methods",
            "Earn specialist badge",
          ],
          estimatedCarbonSavings: 12,
        },
      ])

      setAnalytics({
        userSegment: "regular",
        recyclingRate: 45,
        habitConsistency: 62,
        userRank: 1247,
        userPercentile: 68,
        topCategory: "plastic",
        engagementTrend: "increasing",
      })

      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-8">
        <div className="flex items-center justify-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Analyzing your sustainability impact...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-border bg-gradient-to-r from-primary/10 to-primary/5 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
              <Brain className="h-6 w-6 text-primary" />
              AI-Powered Insights
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Personalized recommendations to maximize your environmental impact
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">User Segment</p>
            <p className="mt-2 text-xl font-bold text-foreground capitalize">
              {analytics.userSegment}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Recycling Rate</p>
            <p className="mt-2 text-xl font-bold text-foreground">
              {analytics.recyclingRate}%
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Leaderboard Rank</p>
            <p className="mt-2 text-xl font-bold text-foreground">
              #{analytics.userRank}
            </p>
            <p className="mt-1 text-xs text-primary">
              Top {100 - analytics.userPercentile}%
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Engagement Trend</p>
            <div className="mt-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <p className="font-bold text-foreground capitalize">
                {analytics.engagementTrend}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* AI Insights Cards */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold text-foreground">Recommended Actions</h3>
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div
              className="flex cursor-pointer items-start justify-between"
              onClick={() =>
                setExpandedInsight(expandedInsight === insight.id ? null : insight.id)
              }
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "rounded-lg p-2",
                      insight.impact === "high" && "bg-red-500/10",
                      insight.impact === "medium" && "bg-amber-500/10",
                      insight.impact === "low" && "bg-blue-500/10"
                    )}
                  >
                    {insight.impact === "high" && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    {insight.impact === "medium" && (
                      <Zap className="h-5 w-5 text-amber-500" />
                    )}
                    {insight.impact === "low" && (
                      <CheckCircle2 className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{insight.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
              <ArrowRight
                className={cn(
                  "h-5 w-5 transition-transform text-muted-foreground",
                  expandedInsight === insight.id && "rotate-90"
                )}
              />
            </div>

            {/* Expanded Content */}
            {expandedInsight === insight.id && (
              <div className="mt-4 space-y-4 border-t border-border pt-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">ACTION ITEMS</p>
                  <ul className="mt-2 space-y-2">
                    {insight.actionItems.map((item, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-foreground">
                        <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-primary/10 p-3">
                  <p className="text-sm font-medium text-foreground">
                    Estimated CO₂ Savings
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {insight.estimatedCarbonSavings} kg
                  </p>
                </div>

                <Button className="w-full" variant="default">
                  Take Action
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Predictive Analytics */}
      <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/20 p-3">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">AI Prediction</h4>
            <p className="text-sm text-muted-foreground">
              Based on your patterns, you'll save approximately 45 kg CO₂ next month by
              increasing your recycling rate and maintaining daily engagement.
            </p>
          </div>
        </div>
      </Card>

      {/* Learning Recommendation */}
      <Card className="border-blue-500/20 bg-blue-500/5 p-6">
        <div className="flex items-center gap-3">
          <Award className="h-6 w-6 text-blue-500" />
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">Recommended Learning Path</h4>
            <p className="text-sm text-muted-foreground">
              Master plastic waste management - your most frequently classified category
            </p>
          </div>
          <Button size="sm" variant="outline">
            Start Learning
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default AIInsightsDashboard
