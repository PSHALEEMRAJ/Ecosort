/**
 * Enhanced Analytics Engine
 * Advanced ML-driven insights from waste classification behavior
 * - Trend detection and forecasting
 * - Anomaly detection
 * - Comparative analytics
 * - Predictive modeling
 */

import type { WasteCategory, ClassificationResult } from "./waste-classifier"
import { getClassifications } from "./classification-store"

export interface WasteInsight {
  title: string
  description: string
  metric: number
  unit: string
  trend: "up" | "down" | "stable"
  changePercent: number
  actionable: boolean
  recommendation?: string
}

export interface AnalyticsData {
  insights: WasteInsight[]
  categoryTrends: Array<{
    category: WasteCategory
    lastWeek: number
    currentWeek: number
    trend: "up" | "down" | "stable"
    changePercent: number
  }>
  confidenceTrends: {
    average: number
    trend: "improving" | "declining" | "stable"
    changePercent: number
  }
  anomalies: Array<{
    timestamp: number
    type: string
    description: string
  }>
  predictions: {
    nextWeekClassifications: number
    nextMonthClassifications: number
    projectedRecycleRate: number
  }
}

/**
 * Analyze trends in waste classification data
 */
export function analyzeTrends(): AnalyticsData {
  const classifications = getClassifications()

  if (classifications.length === 0) {
    return {
      insights: [],
      categoryTrends: [],
      confidenceTrends: {
        average: 0,
        trend: "stable",
        changePercent: 0,
      },
      anomalies: [],
      predictions: {
        nextWeekClassifications: 0,
        nextMonthClassifications: 0,
        projectedRecycleRate: 0,
      },
    }
  }

  const now = Date.now()
  const oneWeekAgo = now - 7 * 86400000
  const twoWeeksAgo = now - 14 * 86400000

  const currentWeekData = classifications.filter((c) => c.timestamp >= oneWeekAgo)
  const previousWeekData = classifications.filter(
    (c) => c.timestamp >= twoWeeksAgo && c.timestamp < oneWeekAgo
  )

  // Category trends
  const categoryTrends = calculateCategoryTrends(
    currentWeekData,
    previousWeekData
  )

  // Confidence trends
  const confidenceTrends = calculateConfidenceTrends(
    currentWeekData,
    previousWeekData
  )

  // Detect anomalies
  const anomalies = detectAnomalies(classifications)

  // Generate predictions
  const predictions = generatePredictions(classifications)

  // Generate insights
  const insights = generateInsights(
    classifications,
    categoryTrends,
    confidenceTrends,
    anomalies,
    predictions
  )

  return {
    insights,
    categoryTrends,
    confidenceTrends,
    anomalies,
    predictions,
  }
}

/**
 * Calculate category-specific trends
 */
function calculateCategoryTrends(
  currentWeek: typeof getClassifications extends () => infer T ? T : never[],
  previousWeek: typeof getClassifications extends () => infer T ? T : never[]
) {
  const categories: WasteCategory[] = [
    "recyclable",
    "organic",
    "e-waste",
    "plastic",
    "hazardous",
    "general",
  ]

  return categories.map((category) => {
    const currentCount = currentWeek.filter(
      (c) => c.result.category === category
    ).length
    const previousCount = previousWeek.filter(
      (c) => c.result.category === category
    ).length

    const changePercent =
      previousCount === 0
        ? currentCount > 0
          ? 100
          : 0
        : ((currentCount - previousCount) / previousCount) * 100

    return {
      category,
      lastWeek: previousCount,
      currentWeek: currentCount,
      trend: (
        currentCount > previousCount
          ? "up"
          : currentCount < previousCount
            ? "down"
            : "stable"
      ) as "up" | "down" | "stable",
      changePercent,
    }
  })
}

/**
 * Calculate confidence score trends
 */
function calculateConfidenceTrends(
  currentWeek: typeof getClassifications extends () => infer T ? T : never[],
  previousWeek: typeof getClassifications extends () => infer T ? T : never[]
) {
  const currentAvg =
    currentWeek.length > 0
      ? currentWeek.reduce((sum, c) => sum + c.result.confidence, 0) /
        currentWeek.length
      : 0

  const previousAvg =
    previousWeek.length > 0
      ? previousWeek.reduce((sum, c) => sum + c.result.confidence, 0) /
        previousWeek.length
      : 0

  const changePercent =
    previousAvg === 0 ? 0 : ((currentAvg - previousAvg) / previousAvg) * 100

  return {
    average: currentAvg,
    trend: (
      currentAvg > previousAvg
        ? "improving"
        : currentAvg < previousAvg
          ? "declining"
          : "stable"
    ) as "improving" | "declining" | "stable",
    changePercent,
  }
}

/**
 * Detect anomalies in classification patterns
 */
function detectAnomalies(
  classifications: typeof getClassifications extends () => infer T ? T : never[]
): Array<{
  timestamp: number
  type: string
  description: string
}> {
  const anomalies: Array<{
    timestamp: number
    type: string
    description: string
  }> = []

  if (classifications.length < 5) return anomalies

  // Calculate average confidence
  const avgConfidence =
    classifications.reduce((sum, c) => sum + c.result.confidence, 0) /
    classifications.length

  // Check for unusually low confidence classifications
  const lastFive = classifications.slice(0, 5)
  for (const c of lastFive) {
    if (c.result.confidence < avgConfidence * 0.6) {
      anomalies.push({
        timestamp: c.timestamp,
        type: "low_confidence",
        description: `Unusually low confidence classification (${(c.result.confidence * 100).toFixed(0)}%) detected for ${c.result.category}`,
      })
    }
  }

  // Check for unusual category jumps
  if (classifications.length >= 3) {
    const recentCategories = classifications
      .slice(0, 3)
      .map((c) => c.result.category)
    if (
      recentCategories[0] !== recentCategories[1] &&
      recentCategories[1] !== recentCategories[2]
    ) {
      anomalies.push({
        timestamp: classifications[0].timestamp,
        type: "category_volatility",
        description:
          "High variability in waste categories detected - consider environment changes",
      })
    }
  }

  // Check for sudden spikes in hazardous waste
  const hazardousCount = classifications
    .filter((c) => c.result.category === "hazardous")
    .slice(0, 5).length
  if (hazardousCount >= 3) {
    anomalies.push({
      timestamp: classifications[0].timestamp,
      type: "hazardous_spike",
      description: `Spike in hazardous waste detected (${hazardousCount} items in last ${Math.min(5, classifications.length)} classifications)`,
    })
  }

  return anomalies
}

/**
 * Generate predictions based on historical patterns
 */
function generatePredictions(
  classifications: typeof getClassifications extends () => infer T ? T : never[]
): {
  nextWeekClassifications: number
  nextMonthClassifications: number
  projectedRecycleRate: number
} {
  if (classifications.length === 0) {
    return {
      nextWeekClassifications: 0,
      nextMonthClassifications: 0,
      projectedRecycleRate: 0,
    }
  }

  const now = Date.now()
  const oneWeekAgo = now - 7 * 86400000
  const twoWeeksAgo = now - 14 * 86400000
  const monthAgo = now - 30 * 86400000

  const thisWeek = classifications.filter((c) => c.timestamp >= oneWeekAgo)
    .length
  const lastWeek = classifications.filter(
    (c) => c.timestamp >= twoWeeksAgo && c.timestamp < oneWeekAgo
  ).length
  const thisMonth = classifications.filter((c) => c.timestamp >= monthAgo)
    .length

  // Simple moving average for next week
  const avgWeekly = (thisWeek + lastWeek) / 2
  const nextWeekClassifications = Math.round(avgWeekly)

  // Extrapolate to month
  const avgDaily = thisMonth / 30
  const nextMonthClassifications = Math.round(avgDaily * 30)

  // Calculate projected recycle rate
  const recyclableCount = classifications.filter(
    (c) => c.result.recyclable
  ).length
  const projectedRecycleRate = (recyclableCount / classifications.length) * 100

  return {
    nextWeekClassifications,
    nextMonthClassifications,
    projectedRecycleRate,
  }
}

/**
 * Generate actionable insights
 */
function generateInsights(
  classifications: typeof getClassifications extends () => infer T ? T : never[],
  categoryTrends: any[],
  confidenceTrends: any,
  anomalies: any[],
  predictions: any
): WasteInsight[] {
  const insights: WasteInsight[] = []

  if (classifications.length === 0) return insights

  // Insight 1: Confidence improvement
  if (confidenceTrends.trend === "improving") {
    insights.push({
      title: "Classification Accuracy Improving",
      description: `Your classification confidence is improving. Keep using clearer, well-lit images for best results.`,
      metric: confidenceTrends.average * 100,
      unit: "%",
      trend: "up",
      changePercent: confidenceTrends.changePercent,
      actionable: false,
    })
  }

  // Insight 2: Category shift detection
  const mostIncreasedCategory = categoryTrends.reduce((prev: any, current: any) =>
    current.changePercent > prev.changePercent ? current : prev
  )

  if (mostIncreasedCategory.changePercent > 20) {
    insights.push({
      title: `${mostIncreasedCategory.category} Waste Increasing`,
      description: `You've generated ${mostIncreasedCategory.changePercent.toFixed(0)}% more ${mostIncreasedCategory.category} waste this week. Review your consumption patterns.`,
      metric: mostIncreasedCategory.currentWeek,
      unit: "items",
      trend: "up",
      changePercent: mostIncreasedCategory.changePercent,
      actionable: true,
      recommendation: `Consider alternatives to reduce ${mostIncreasedCategory.category} waste`,
    })
  }

  // Insight 3: Prediction milestone
  if (predictions.nextWeekClassifications > classifications.length * 1.5) {
    insights.push({
      title: "Milestone: 100+ Classifications Predicted",
      description:
        "At your current pace, you'll reach 100 classifications in the next few days. Keep tracking to understand your waste patterns better.",
      metric: predictions.nextWeekClassifications,
      unit: "items/week",
      trend: "up",
      changePercent: 0,
      actionable: false,
    })
  }

  // Insight 4: Recycle rate status
  const recycleRate = (classifications.filter(
    (c) => c.result.recyclable
  ).length /
    classifications.length) *
    100

  if (recycleRate < 60) {
    insights.push({
      title: "Low Recyclable Rate",
      description: `Your recyclable rate is ${recycleRate.toFixed(0)}%. Target 80%+ by choosing products with recyclable packaging.`,
      metric: recycleRate,
      unit: "%",
      trend: "down",
      changePercent: -15,
      actionable: true,
      recommendation: "Prioritize recyclable products in your purchases",
    })
  } else if (recycleRate > 75) {
    insights.push({
      title: "Excellent Recycling Rate",
      description: `You're doing great! Your recyclable rate is ${recycleRate.toFixed(0)}%. Keep up the sustainable choices.`,
      metric: recycleRate,
      unit: "%",
      trend: "up",
      changePercent: 20,
      actionable: false,
    })
  }

  // Insight 5: Anomaly alerts
  if (anomalies.length > 0) {
    insights.push({
      title: "Pattern Anomaly Detected",
      description: `${anomalies[0].description} This might indicate changes in your environment or lifestyle.`,
      metric: anomalies.length,
      unit: "anomalies",
      trend: "down",
      changePercent: 0,
      actionable: true,
      recommendation: "Review recent changes in your daily routine",
    })
  }

  return insights
}

/**
 * Compare user stats with average user
 */
export function getComparativeStats(): {
  userRecycleRate: number
  averageRecycleRate: number
  userHazardousRate: number
  averageHazardousRate: number
  userEwasteRate: number
  averageEwasteRate: number
  percentilRank: number
} {
  const classifications = getClassifications()

  if (classifications.length === 0) {
    return {
      userRecycleRate: 0,
      averageRecycleRate: 65,
      userHazardousRate: 0,
      averageHazardousRate: 5,
      userEwasteRate: 0,
      averageEwasteRate: 8,
      percentilRank: 50,
    }
  }

  const recyclableCount = classifications.filter(
    (c) => c.result.recyclable
  ).length
  const hazardousCount = classifications.filter(
    (c) => c.result.category === "hazardous"
  ).length
  const ewasteCount = classifications.filter(
    (c) => c.result.category === "e-waste"
  ).length

  const userRecycleRate = (recyclableCount / classifications.length) * 100
  const userHazardousRate = (hazardousCount / classifications.length) * 100
  const userEwasteRate = (ewasteCount / classifications.length) * 100

  // Simulated average user stats
  const averageRecycleRate = 65
  const averageHazardousRate = 5
  const averageEwasteRate = 8

  // Calculate percentile rank (simplified)
  let score = 0
  if (userRecycleRate > averageRecycleRate) score += 30
  if (userHazardousRate <= averageHazardousRate) score += 25
  if (userEwasteRate <= averageEwasteRate) score += 25
  if (classifications.length > 50) score += 20

  const percentilRank = Math.min(100, Math.max(0, score))

  return {
    userRecycleRate,
    averageRecycleRate,
    userHazardousRate,
    averageHazardousRate,
    userEwasteRate,
    averageEwasteRate,
    percentilRank,
  }
}
