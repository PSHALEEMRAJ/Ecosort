/**
 * Advanced Analytics & Insights Engine
 * ML-powered data analysis, pattern detection, and predictive analytics
 */

export interface AnalyticsMetrics {
  // Time-series data
  dailyMetrics: Array<{
    date: string
    classifications: number
    carbonSaved: number
    recyclablePercentage: number
    topCategory: string
  }>
  
  // Behavioral patterns
  patterns: {
    peakDay: string
    peakHour: number
    averageItemsPerDay: number
    habitConsistency: number // 0-100
    userSegment: "casual" | "regular" | "power_user" | "expert"
  }
  
  // Predictive analytics
  predictions: {
    estimatedCarbonSavingsNextMonth: number
    estimatedRecyclingRate: number
    recommendedFocusArea: string
    predictedEngagementTrend: "increasing" | "stable" | "decreasing"
  }
  
  // Comparative analytics
  benchmarks: {
    userRank: number
    userPercentile: number
    comparisonToAverage: number // percentage
    communityAverage: number
  }
  
  // Category insights
  categoryAnalysis: Array<{
    category: string
    frequency: number
    percentageOfTotal: number
    trend: "increasing" | "stable" | "decreasing"
    recommendation: string
  }>
}

export interface InsightRecommendation {
  id: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  actionItems: string[]
  estimatedCarbonSavings: number
  difficulty: "easy" | "moderate" | "challenging"
}

/**
 * Classification data structure for analytics
 */
export interface ClassificationRecord {
  timestamp: number
  category: string
  confidence: number
  recyclable: boolean
}

/**
 * Analyze user behavior patterns using machine learning concepts
 */
export function analyzeUserPatterns(
  records: ClassificationRecord[]
): AnalyticsMetrics["patterns"] {
  if (records.length === 0) {
    return {
      peakDay: "N/A",
      peakHour: 0,
      averageItemsPerDay: 0,
      habitConsistency: 0,
      userSegment: "casual",
    }
  }

  // Calculate peak day
  const dayCount = new Map<string, number>()
  records.forEach((r) => {
    const date = new Date(r.timestamp)
    const day = date.toLocaleDateString()
    dayCount.set(day, (dayCount.get(day) || 0) + 1)
  })

  const peakDay =
    Array.from(dayCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "N/A"

  // Calculate peak hour
  const hourCount = new Map<number, number>()
  records.forEach((r) => {
    const hour = new Date(r.timestamp).getHours()
    hourCount.set(hour, (hourCount.get(hour) || 0) + 1)
  })

  const peakHour =
    Array.from(hourCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 0

  // Calculate average items per day
  const uniqueDays = dayCount.size
  const averageItemsPerDay = Math.round(records.length / Math.max(uniqueDays, 1))

  // Calculate habit consistency (coefficient of variation)
  const avg = averageItemsPerDay
  const variance =
    Array.from(dayCount.values()).reduce((sum, count) => {
      return sum + Math.pow(count - avg, 2)
    }, 0) / Math.max(dayCount.size, 1)
  const stdDev = Math.sqrt(variance)
  const habitConsistency = Math.max(0, 100 - (stdDev / Math.max(avg, 1)) * 100)

  // Determine user segment
  let userSegment: "casual" | "regular" | "power_user" | "expert" = "casual"
  if (records.length >= 50) userSegment = "power_user"
  else if (records.length >= 20) userSegment = "regular"
  else if (records.length >= 5) userSegment = "casual"

  return {
    peakDay,
    peakHour,
    averageItemsPerDay,
    habitConsistency: Math.round(habitConsistency),
    userSegment,
  }
}

/**
 * Generate predictive analytics
 */
export function generatePredictions(
  records: ClassificationRecord[],
  currentCarbonSaved: number
): AnalyticsMetrics["predictions"] {
  if (records.length === 0) {
    return {
      estimatedCarbonSavingsNextMonth: 0,
      estimatedRecyclingRate: 0,
      recommendedFocusArea: "Start classifying waste",
      predictedEngagementTrend: "stable",
    }
  }

  // Calculate daily rate
  const daysSinceStart = (Date.now() - records[0].timestamp) / (1000 * 60 * 60 * 24)
  const dailyRate = records.length / Math.max(daysSinceStart, 1)
  const estimatedNextMonth = Math.round(dailyRate * 30)
  const estimatedCarbonNextMonth = Math.round(
    (currentCarbonSaved / records.length) * estimatedNextMonth
  )

  // Calculate recycling percentage
  const recyclableCount = records.filter((r) => r.recyclable).length
  const estimatedRecyclingRate = Math.round((recyclableCount / records.length) * 100)

  // Determine trend
  const recentCount = records.filter(
    (r) => Date.now() - r.timestamp < 7 * 24 * 60 * 60 * 1000
  ).length
  const olderCount = records.filter(
    (r) =>
      Date.now() - r.timestamp >= 7 * 24 * 60 * 60 * 1000 &&
      Date.now() - r.timestamp < 14 * 24 * 60 * 60 * 1000
  ).length

  let predictedEngagementTrend: "increasing" | "stable" | "decreasing" = "stable"
  if (recentCount > olderCount * 1.2) predictedEngagementTrend = "increasing"
  else if (recentCount < olderCount * 0.8) predictedEngagementTrend = "decreasing"

  // Determine focus area
  const categories = new Map<string, number>()
  records.forEach((r) => {
    categories.set(r.category, (categories.get(r.category) || 0) + 1)
  })

  const dominantCategory =
    Array.from(categories.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "general"

  return {
    estimatedCarbonSavingsNextMonth,
    estimatedRecyclingRate,
    recommendedFocusArea: `Improve ${dominantCategory} classification accuracy`,
    predictedEngagementTrend,
  }
}

/**
 * Analyze category distribution
 */
export function analyzeCategoryTrends(
  records: ClassificationRecord[]
): AnalyticsMetrics["categoryAnalysis"] {
  const categoryData = new Map<string, ClassificationRecord[]>()

  records.forEach((r) => {
    if (!categoryData.has(r.category)) {
      categoryData.set(r.category, [])
    }
    categoryData.get(r.category)!.push(r)
  })

  const total = records.length

  return Array.from(categoryData.entries())
    .map(([category, items]) => {
      // Calculate trend
      const recentItems = items.filter(
        (i) => Date.now() - i.timestamp < 7 * 24 * 60 * 60 * 1000
      ).length
      const olderItems = items.filter(
        (i) =>
          Date.now() - i.timestamp >= 7 * 24 * 60 * 60 * 1000 &&
          Date.now() - i.timestamp < 14 * 24 * 60 * 60 * 1000
      ).length

      let trend: "increasing" | "stable" | "decreasing" = "stable"
      if (recentItems > olderItems * 1.2) trend = "increasing"
      else if (recentItems < olderItems * 0.8) trend = "decreasing"

      // Generate recommendation
      const avgConfidence =
        items.reduce((sum, i) => sum + i.confidence, 0) / items.length
      let recommendation = "Keep up the good work with this category"
      if (avgConfidence < 0.7) recommendation = "Consider reviewing this category more carefully"
      if (trend === "increasing") recommendation = "You're classifying more of this category"

      return {
        category,
        frequency: items.length,
        percentageOfTotal: Math.round((items.length / total) * 100),
        trend,
        recommendation,
      }
    })
    .sort((a, b) => b.frequency - a.frequency)
}

/**
 * Compare user to community benchmarks
 */
export function calculateBenchmarks(
  userCarbonSaved: number,
  userRecyclingRate: number
): AnalyticsMetrics["benchmarks"] {
  // Community averages (simulated)
  const communityAverageCarbonSaved = 25
  const communityAverageRecyclingRate = 45
  const totalActiveUsers = 10000

  const userScore = userCarbonSaved * 1.5 + userRecyclingRate * 0.8

  // Simulate percentile distribution
  const userPercentile = Math.min(
    99,
    Math.round(Math.exp(userScore / 50) / Math.exp(3) * 50)
  )
  const userRank = Math.max(1, Math.round((totalActiveUsers * (100 - userPercentile)) / 100))

  const comparisonToAverage = Math.round(
    ((userCarbonSaved - communityAverageCarbonSaved) / communityAverageCarbonSaved) * 100
  )

  return {
    userRank,
    userPercentile: Math.max(0, Math.min(100, userPercentile)),
    comparisonToAverage,
    communityAverage: communityAverageCarbonSaved,
  }
}

/**
 * Generate actionable insights
 */
export function generateInsights(metrics: AnalyticsMetrics): InsightRecommendation[] {
  const insights: InsightRecommendation[] = []

  // Insight 1: Low recycling rate
  if (metrics.predictions.estimatedRecyclingRate < 50) {
    insights.push({
      id: "low_recycling",
      title: "Increase Recycling Rate",
      description: "Your recycling rate is below average. Focus on recyclable items.",
      impact: "high",
      actionItems: [
        "Learn which items are recyclable in your area",
        "Set a recycling goal of 70%",
        "Visit a local recycling center",
      ],
      estimatedCarbonSavings: 15,
      difficulty: "easy",
    })
  }

  // Insight 2: Low habit consistency
  if (metrics.patterns.habitConsistency < 50) {
    insights.push({
      id: "low_consistency",
      title: "Build Consistent Habits",
      description: "Your activity is inconsistent. Try classifying one item daily.",
      impact: "medium",
      actionItems: [
        "Set a daily reminder to classify waste",
        "Join a community challenge",
        "Track your 7-day streak",
      ],
      estimatedCarbonSavings: 8,
      difficulty: "moderate",
    })
  }

  // Insight 3: Dominant category opportunity
  const topCategory = metrics.categoryAnalysis[0]
  if (topCategory && topCategory.percentageOfTotal > 40) {
    insights.push({
      id: "category_specialist",
      title: `Become a ${topCategory.category} Expert`,
      description: `You frequently encounter ${topCategory.category}. Learn disposal best practices.`,
      impact: "medium",
      actionItems: [
        `Take the ${topCategory.category} educational module`,
        "Perfect your disposal technique",
        "Earn category-specific badge",
      ],
      estimatedCarbonSavings: 10,
      difficulty: "easy",
    })
  }

  // Insight 4: Engagement trend
  if (metrics.predictions.predictedEngagementTrend === "decreasing") {
    insights.push({
      id: "engagement_drop",
      title: "Re-engage with Sustainability",
      description: "Your activity has been declining. Let's get back on track!",
      impact: "high",
      actionItems: [
        "Set a new sustainability goal",
        "Check your leaderboard ranking",
        "Claim your achievement badges",
      ],
      estimatedCarbonSavings: 12,
      difficulty: "easy",
    })
  }

  // Insight 5: Excellence recognition
  if (metrics.benchmarks.userPercentile >= 80) {
    insights.push({
      id: "sustainability_champion",
      title: "You're a Sustainability Champion",
      description: "You're in the top 20%! Keep inspiring others.",
      impact: "high",
      actionItems: [
        "Share your journey on social media",
        "Mentor other users",
        "Aim for top 10%",
      ],
      estimatedCarbonSavings: 20,
      difficulty: "challenging",
    })
  }

  return insights
}

/**
 * Generate analytics summary report
 */
export function generateAnalyticsSummary(metrics: AnalyticsMetrics): string {
  const topCategory = metrics.categoryAnalysis[0]

  return `
Advanced Analytics Summary
==========================

User Segment: ${metrics.patterns.userSegment.toUpperCase()}
Peak Activity: ${metrics.patterns.peakDay} at ${metrics.patterns.peakHour}:00
Daily Average: ${metrics.patterns.averageItemsPerDay} items

Predictions (Next Month):
- Estimated Classifications: ${metrics.predictions.estimatedCarbonSavingsNextMonth}
- Recycling Rate: ${metrics.predictions.estimatedRecyclingRate}%
- Engagement Trend: ${metrics.predictions.predictedEngagementTrend.toUpperCase()}

Benchmarks:
- Your Rank: #${metrics.benchmarks.userRank}
- Percentile: Top ${100 - metrics.benchmarks.userPercentile}%
- vs Community: ${metrics.benchmarks.comparisonToAverage > 0 ? "+" : ""}${metrics.benchmarks.comparisonToAverage}%

Top Category: ${topCategory?.category} (${topCategory?.percentageOfTotal}%)

Habit Consistency: ${metrics.patterns.habitConsistency}%

Recommended Focus: ${metrics.predictions.recommendedFocusArea}
`
}
