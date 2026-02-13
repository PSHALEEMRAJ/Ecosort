/**
 * Community Insights & Analytics System
 * Aggregates anonymous data to provide community-wide sustainability metrics
 */

export interface CommunityInsight {
  id: string
  region: string
  metricType: "recycling_rate" | "carbon_saved" | "participation" | "trending_waste"
  value: number
  trend: "up" | "down" | "stable"
  lastUpdated: Date
  description: string
}

export interface RegionalMetrics {
  region: string
  totalClassifications: number
  averageRecyclingRate: number
  totalCarbonSaved: number
  participantCount: number
  topWasteTypes: Array<{ type: string; percentage: number }>
  trendingInsight: string
}

export interface CommunityChallenge {
  id: string
  name: string
  description: string
  targetMetric: string
  targetValue: number
  startDate: Date
  endDate: Date
  participants: number
  progress: number
  reward?: string
}

export interface UserRanking {
  rank: number
  username: string
  score: number
  itemsClassified: number
  carbonSaved: number
  streak: number
}

// Mock regional data
const REGIONAL_DATA: Record<string, RegionalMetrics> = {
  north_america: {
    region: "North America",
    totalClassifications: 150000,
    averageRecyclingRate: 72,
    totalCarbonSaved: 8500,
    participantCount: 25000,
    topWasteTypes: [
      { type: "Plastic", percentage: 35 },
      { type: "Recyclable", percentage: 28 },
      { type: "Organic", percentage: 22 },
      { type: "E-waste", percentage: 15 },
    ],
    trendingInsight: "Plastic bottle recycling up 18% this month",
  },
  europe: {
    region: "Europe",
    totalClassifications: 200000,
    averageRecyclingRate: 85,
    totalCarbonSaved: 12000,
    participantCount: 32000,
    topWasteTypes: [
      { type: "Recyclable", percentage: 42 },
      { type: "Organic", percentage: 28 },
      { type: "Plastic", percentage: 18 },
      { type: "E-waste", percentage: 12 },
    ],
    trendingInsight: "Composting participation increased by 25%",
  },
  asia: {
    region: "Asia",
    totalClassifications: 180000,
    averageRecyclingRate: 68,
    totalCarbonSaved: 10200,
    participantCount: 28000,
    topWasteTypes: [
      { type: "Plastic", percentage: 40 },
      { type: "Recyclable", percentage: 25 },
      { type: "Organic", percentage: 20 },
      { type: "E-waste", percentage: 15 },
    ],
    trendingInsight: "Community cleanups led to 30% waste diversion increase",
  },
}

/**
 * Get regional sustainability metrics
 */
export function getRegionalMetrics(region: string = "north_america"): RegionalMetrics {
  return REGIONAL_DATA[region] || REGIONAL_DATA.north_america
}

/**
 * Get community insights for display
 */
export function getCommunityInsights(): CommunityInsight[] {
  const insights: CommunityInsight[] = []

  for (const [region, metrics] of Object.entries(REGIONAL_DATA)) {
    insights.push({
      id: `${region}_recycling`,
      region: metrics.region,
      metricType: "recycling_rate",
      value: metrics.averageRecyclingRate,
      trend: "up",
      lastUpdated: new Date(),
      description: `Regional recycling rate: ${metrics.averageRecyclingRate}%`,
    })

    insights.push({
      id: `${region}_carbon`,
      region: metrics.region,
      metricType: "carbon_saved",
      value: metrics.totalCarbonSaved,
      trend: "up",
      lastUpdated: new Date(),
      description: `${metrics.totalCarbonSaved} tonnes CO₂ saved this year`,
    })

    insights.push({
      id: `${region}_participation`,
      region: metrics.region,
      metricType: "participation",
      value: metrics.participantCount,
      trend: "up",
      lastUpdated: new Date(),
      description: `${metrics.participantCount} active community members`,
    })
  }

  return insights
}

/**
 * Get active community challenges
 */
export function getActiveChallenges(): CommunityChallenge[] {
  return [
    {
      id: "plastic_free_week",
      name: "Plastic-Free Week",
      description: "Reduce plastic waste to zero for one week",
      targetMetric: "plastic_items",
      targetValue: 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      participants: 12543,
      progress: 68,
      reward: "Digital Badge + Tree Planting",
    },
    {
      id: "recycle_championship",
      name: "Recycle Championship 2024",
      description: "Classify 100+ waste items correctly",
      targetMetric: "classifications",
      targetValue: 100,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      participants: 25000,
      progress: 45,
      reward: "Eco-Champion Certificate",
    },
    {
      id: "composting_challenge",
      name: "Community Composting Challenge",
      description: "Compost 500kg of organic waste",
      targetMetric: "organic_waste",
      targetValue: 500,
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      participants: 8732,
      progress: 32,
      reward: "Premium Vermicomposting Kit",
    },
  ]
}

/**
 * Get leaderboard rankings
 */
export function getLeaderboard(
  metric: "score" | "carbon_saved" | "streak" = "score",
  limit: number = 10
): UserRanking[] {
  // Mock leaderboard data
  const baseUsers: UserRanking[] = [
    { rank: 1, username: "EcoWarrior_42", score: 9850, itemsClassified: 2143, carbonSaved: 125.5, streak: 47 },
    { rank: 2, username: "GreenMachine", score: 8920, itemsClassified: 1856, carbonSaved: 98.3, streak: 34 },
    { rank: 3, username: "RecycleKing", score: 8102, itemsClassified: 1723, carbonSaved: 91.2, streak: 28 },
    { rank: 4, username: "SustainSally", score: 7654, itemsClassified: 1542, carbonSaved: 82.1, streak: 22 },
    { rank: 5, username: "PlanetPro", score: 7234, itemsClassified: 1423, carbonSaved: 75.8, streak: 18 },
    { rank: 6, username: "EcoChampion", score: 6892, itemsClassified: 1289, carbonSaved: 68.4, streak: 15 },
    { rank: 7, username: "WasteWizard", score: 6451, itemsClassified: 1156, carbonSaved: 61.2, streak: 12 },
    { rank: 8, username: "GreenGuard", score: 5987, itemsClassified: 987, carbonSaved: 52.1, streak: 9 },
    { rank: 9, username: "RecycleStar", score: 5523, itemsClassified: 876, carbonSaved: 46.3, streak: 7 },
    { rank: 10, username: "SustainTeam", score: 5001, itemsClassified: 743, carbonSaved: 39.5, streak: 5 },
  ]

  if (metric === "carbon_saved") {
    return baseUsers.sort((a, b) => b.carbonSaved - a.carbonSaved).slice(0, limit)
  } else if (metric === "streak") {
    return baseUsers.sort((a, b) => b.streak - a.streak).slice(0, limit)
  }

  return baseUsers.slice(0, limit)
}

/**
 * Get community statistics
 */
export function getCommunityStats() {
  const allRegions = Object.values(REGIONAL_DATA)

  const totalClassifications = allRegions.reduce((sum, r) => sum + r.totalClassifications, 0)
  const totalParticipants = allRegions.reduce((sum, r) => sum + r.participantCount, 0)
  const averageRecyclingRate =
    allRegions.reduce((sum, r) => sum + r.averageRecyclingRate, 0) / allRegions.length
  const totalCarbonSaved = allRegions.reduce((sum, r) => sum + r.totalCarbonSaved, 0)

  return {
    totalClassifications,
    totalParticipants,
    averageRecyclingRate: Math.round(averageRecyclingRate),
    totalCarbonSaved,
    regions: Object.keys(REGIONAL_DATA).length,
    treeEquivalent: Math.round(totalCarbonSaved / 22), // Trees needed to offset
    waterSavings: Math.round(totalClassifications * 5), // Liters
    lastUpdated: new Date(),
  }
}

/**
 * Get trending waste types
 */
export function getTrendingWasteTypes(region: string = "north_america"): Array<{
  type: string
  trendPercent: number
  icon: string
}> {
  const metrics = REGIONAL_DATA[region] || REGIONAL_DATA.north_america

  return metrics.topWasteTypes.map((waste) => ({
    type: waste.type,
    trendPercent: waste.percentage,
    icon: getWasteIcon(waste.type),
  }))
}

function getWasteIcon(wasteType: string): string {
  const icons: Record<string, string> = {
    Plastic: "♻️",
    Recyclable: "📄",
    Organic: "🌱",
    "E-waste": "💻",
    Hazardous: "⚠️",
    General: "🗑️",
  }
  return icons[wasteType] || "🗑️"
}

/**
 * Calculate community contribution score
 */
export function calculateCommunityScore(
  userMetrics: {
    itemsClassified: number
    averageAccuracy: number
    participationInChallenges: number
    sharingWithCommunity: boolean
  }
): number {
  let score = 0

  // Classification score (max 40)
  score += Math.min(40, (userMetrics.itemsClassified / 100) * 40)

  // Accuracy score (max 30)
  score += userMetrics.averageAccuracy * 30

  // Challenge participation (max 20)
  score += Math.min(20, (userMetrics.participationInChallenges / 5) * 20)

  // Community sharing bonus (max 10)
  if (userMetrics.sharingWithCommunity) {
    score += 10
  }

  return Math.round(score)
}

/**
 * Generate community report
 */
export function generateCommunityReport() {
  const stats = getCommunityStats()
  const insights = getCommunityInsights()
  const challenges = getActiveChallenges()
  const leaderboard = getLeaderboard()

  return {
    stats,
    insights: insights.slice(0, 6),
    challenges: challenges.slice(0, 3),
    topPerformers: leaderboard.slice(0, 5),
    generatedAt: new Date(),
  }
}
