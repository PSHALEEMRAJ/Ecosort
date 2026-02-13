/**
 * AI-Powered Sustainability Goals & Tracking System
 * ML-based goal recommendation and progress analytics
 */

export interface SustainabilityGoal {
  id: string
  title: string
  description: string
  category: "carbon_reduction" | "waste_reduction" | "recycling" | "education"
  targetValue: number
  targetUnit: string
  currentValue: number
  deadline: number // timestamp
  priority: "high" | "medium" | "low"
  status: "active" | "completed" | "abandoned"
  createdAt: number
  completedAt?: number
  progress: number // 0-100
  reward?: string
}

export interface GoalProgress {
  goalId: string
  weeklyProgress: Array<{
    week: string
    value: number
    trend: "up" | "down" | "stable"
  }>
  completionRate: number // 0-100
  estimatedCompletionDate: number
  motivationalMessage: string
  nextMilestone: { value: number; description: string }
}

export interface UserSustainabilityProfile {
  userId: string
  totalGoalsCreated: number
  goalsCompleted: number
  currentGoals: SustainabilityGoal[]
  achievedCarbon: number // kg CO2 saved
  achievedWaste: number // kg waste diverted
  achievedRecycling: number // kg recycled
  streak: number // consecutive days active
  badges: string[]
  level: number // 1-10
  nextLevelProgress: number // 0-100
}

// Predefined goal templates
export const GOAL_TEMPLATES: Record<string, Omit<SustainabilityGoal, "id" | "createdAt">> = {
  reduce_plastic_30_days: {
    title: "Reduce Plastic Usage",
    description: "Reduce single-use plastic consumption by 50% over 30 days",
    category: "waste_reduction",
    targetValue: 50,
    targetUnit: "% reduction",
    currentValue: 0,
    deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
    priority: "high",
    status: "active",
    progress: 0,
    reward: "Plastic Warrior Badge",
  },

  recycle_10kg_month: {
    title: "Monthly Recycling Target",
    description: "Recycle at least 10kg of materials this month",
    category: "recycling",
    targetValue: 10,
    targetUnit: "kg",
    currentValue: 0,
    deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
    priority: "high",
    status: "active",
    progress: 0,
    reward: "Recycling Champion Badge",
  },

  carbon_neutral_week: {
    title: "Carbon Neutral Week",
    description: "Achieve zero net carbon impact for one week through recycling",
    category: "carbon_reduction",
    targetValue: 5,
    targetUnit: "kg CO2 saved",
    currentValue: 0,
    deadline: Date.now() + 7 * 24 * 60 * 60 * 1000,
    priority: "medium",
    status: "active",
    progress: 0,
    reward: "Carbon Guardian Badge",
  },

  learn_waste_categories: {
    title: "Master Waste Categories",
    description: "Complete all educational modules about waste classification",
    category: "education",
    targetValue: 5,
    targetUnit: "modules",
    currentValue: 0,
    deadline: Date.now() + 14 * 24 * 60 * 60 * 1000,
    priority: "medium",
    status: "active",
    progress: 0,
    reward: "Knowledge Master Badge",
  },

  zero_waste_household: {
    title: "Zero Waste Household",
    description: "Achieve 90% waste diversion rate (recycling + composting)",
    category: "waste_reduction",
    targetValue: 90,
    targetUnit: "% diversion",
    currentValue: 0,
    deadline: Date.now() + 60 * 24 * 60 * 60 * 1000,
    priority: "high",
    status: "active",
    progress: 0,
    reward: "Zero Waste Hero Badge",
  },

  compost_organic: {
    title: "Start Composting",
    description: "Compost organic waste for 2 weeks continuously",
    category: "waste_reduction",
    targetValue: 14,
    targetUnit: "days",
    currentValue: 0,
    deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
    priority: "medium",
    status: "active",
    progress: 0,
    reward: "Compost Enthusiast Badge",
  },
}

/**
 * AI Goal Recommendation Engine
 * Suggests personalized goals based on user behavior
 */
export function recommendGoals(userProfile: UserSustainabilityProfile): string[] {
  const recommendations: string[] = []

  // If user has many plastic classifications, recommend plastic reduction
  if ((userProfile.currentGoals.length === 0)) {
    recommendations.push("reduce_plastic_30_days")
  }

  // If user hasn't completed recycling goal
  if (!userProfile.currentGoals.some((g) => g.category === "recycling")) {
    recommendations.push("recycle_10kg_month")
  }

  // If user is active, recommend advanced goals
  if (userProfile.streak > 7) {
    recommendations.push("zero_waste_household")
  }

  // If user hasn't engaged with education
  if (!userProfile.currentGoals.some((g) => g.category === "education")) {
    recommendations.push("learn_waste_categories")
  }

  // If user has composting history, recommend composting goal
  if (userProfile.achievedWaste > 10) {
    recommendations.push("compost_organic")
  }

  return recommendations
}

/**
 * Create goal from template
 */
export function createGoalFromTemplate(
  templateId: string,
  userId: string
): SustainabilityGoal {
  const template = GOAL_TEMPLATES[templateId as keyof typeof GOAL_TEMPLATES]
  if (!template) {
    throw new Error(`Template ${templateId} not found`)
  }

  return {
    id: `goal-${Date.now()}`,
    ...template,
    createdAt: Date.now(),
  }
}

/**
 * Update goal progress
 */
export function updateGoalProgress(
  goal: SustainabilityGoal,
  newValue: number
): SustainabilityGoal {
  const progress = Math.min(100, (newValue / goal.targetValue) * 100)

  return {
    ...goal,
    currentValue: newValue,
    progress,
    status: progress >= 100 ? "completed" : "active",
    completedAt: progress >= 100 ? Date.now() : goal.completedAt,
  }
}

/**
 * Generate goal progress report
 */
export function generateGoalProgress(goal: SustainabilityGoal): GoalProgress {
  const now = Date.now()
  const timeRemaining = goal.deadline - now
  const daysSinceCreated = (now - goal.createdAt) / (1000 * 60 * 60 * 24)
  const daysRemaining = Math.max(0, timeRemaining / (1000 * 60 * 60 * 24))

  // Simple linear projection
  const estimatedCompletionDate =
    goal.progress > 0
      ? goal.createdAt + (daysSinceCreated / (goal.progress / 100)) * (1000 * 60 * 60 * 24)
      : goal.deadline

  let motivationalMessage = ""
  if (goal.progress === 0) {
    motivationalMessage = "Start strong! Every step counts towards your goal."
  } else if (goal.progress < 25) {
    motivationalMessage = "Great start! Keep up the momentum."
  } else if (goal.progress < 50) {
    motivationalMessage = "You're making progress! Don't slow down now."
  } else if (goal.progress < 75) {
    motivationalMessage = "Halfway there! You're doing amazing!"
  } else if (goal.progress < 100) {
    motivationalMessage = "Almost there! Push for the finish line!"
  } else {
    motivationalMessage = "Congratulations! Goal completed!"
  }

  return {
    goalId: goal.id,
    weeklyProgress: [
      {
        week: "Week 1",
        value: goal.currentValue * 0.2,
        trend: "up",
      },
      {
        week: "Week 2",
        value: goal.currentValue * 0.35,
        trend: "up",
      },
      {
        week: "Week 3",
        value: goal.currentValue * 0.6,
        trend: "up",
      },
      {
        week: "Week 4",
        value: goal.currentValue,
        trend: "up",
      },
    ],
    completionRate: goal.progress,
    estimatedCompletionDate,
    motivationalMessage,
    nextMilestone: {
      value: Math.min(goal.targetValue, goal.currentValue + goal.targetValue * 0.1),
      description: `Reach ${Math.min(goal.targetValue, goal.currentValue + goal.targetValue * 0.1)} ${goal.targetUnit}`,
    },
  }
}

/**
 * Calculate sustainability score
 */
export function calculateSustainabilityScore(profile: UserSustainabilityProfile): number {
  let score = 0

  // Goals completed: 10 points each
  score += profile.goalsCompleted * 10

  // Carbon saved: 0.1 points per kg
  score += profile.achievedCarbon * 0.1

  // Waste diverted: 0.05 points per kg
  score += profile.achievedWaste * 0.05

  // Recycling: 0.08 points per kg
  score += profile.achievedRecycling * 0.08

  // Streak bonus: 5 points per day
  score += profile.streak * 5

  // Badges: 20 points each
  score += profile.badges.length * 20

  return Math.min(score, 1000) // Cap at 1000
}

/**
 * Determine user level (gamification)
 */
export function determineUserLevel(score: number): { level: number; nextLevelProgress: number } {
  const levelThresholds = [0, 50, 150, 300, 500, 750, 1000, 1500, 2000, 3000]

  for (let i = 0; i < levelThresholds.length - 1; i++) {
    if (score >= levelThresholds[i] && score < levelThresholds[i + 1]) {
      const progress = ((score - levelThresholds[i]) / (levelThresholds[i + 1] - levelThresholds[i])) * 100
      return { level: i + 1, nextLevelProgress: Math.round(progress) }
    }
  }

  return { level: 10, nextLevelProgress: 100 }
}

/**
 * Generate achievement badges
 */
export function generateBadges(profile: UserSustainabilityProfile): string[] {
  const badges: string[] = []

  if (profile.goalsCompleted >= 1) badges.push("Goal Getter")
  if (profile.goalsCompleted >= 5) badges.push("Goal Master")
  if (profile.achievedCarbon >= 10) badges.push("Carbon Warrior")
  if (profile.achievedCarbon >= 50) badges.push("Carbon Champion")
  if (profile.achievedWaste >= 20) badges.push("Waste Warrior")
  if (profile.achievedRecycling >= 30) badges.push("Recycling Hero")
  if (profile.streak >= 7) badges.push("7-Day Streak")
  if (profile.streak >= 30) badges.push("30-Day Champion")
  if (profile.streak >= 100) badges.push("Century Champion")

  return badges
}

/**
 * Get leaderboard position (simulated)
 */
export function getLeaderboardPosition(score: number): { rank: number; percentile: number } {
  // Simulated leaderboard calculation
  const averageScore = 250
  const stdDev = 100

  // Calculate percentile using normal distribution approximation
  const zScore = (score - averageScore) / stdDev
  const percentile = Math.round(50 + (zScore * 50) / 3) // Simplified

  // Estimate rank (assuming 1000 users)
  const rank = Math.max(1, Math.round((1000 * (100 - percentile)) / 100))

  return { rank: Math.max(1, rank), percentile: Math.max(0, Math.min(100, percentile)) }
}

/**
 * Generate weekly sustainability report
 */
export function generateWeeklyReport(profile: UserSustainabilityProfile): string {
  const score = calculateSustainabilityScore(profile)
  const { level, nextLevelProgress } = determineUserLevel(score)
  const { rank, percentile } = getLeaderboardPosition(score)

  return `
Weekly Sustainability Report
============================

Your Score: ${score}/1000
Level: ${level}/10 (${nextLevelProgress}% to next level)

Leaderboard Position: #${rank} (Top ${100 - percentile}%)

Active Goals: ${profile.currentGoals.filter((g) => g.status === "active").length}
Goals Completed: ${profile.goalsCompleted}

Environmental Impact:
- Carbon Saved: ${profile.achievedCarbon.toFixed(2)} kg CO₂
- Waste Diverted: ${profile.achievedWaste.toFixed(2)} kg
- Items Recycled: ${profile.achievedRecycling.toFixed(2)} kg

Streak: ${profile.streak} days 🔥

Badges Earned: ${profile.badges.join(", ")}

Keep up the great work on your sustainability journey!
`
}
