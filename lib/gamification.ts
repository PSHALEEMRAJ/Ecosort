/**
 * Gamification & Educational System
 * Engages users through challenges, achievements, and learning
 */

export interface UserAchievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: Date
  progress: number // 0-100
  requirement: number
  category: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  earnedCount: number // How many times earned
}

export interface Quest {
  id: string
  name: string
  description: string
  type: "daily" | "weekly" | "special"
  objectives: Array<{
    description: string
    target: number
    current: number
  }>
  rewards: {
    points: number
    coins: number
    experience: number
  }
  difficulty: "easy" | "medium" | "hard"
  expiresAt: Date
}

export interface LevelProgression {
  level: number
  name: string
  minExperience: number
  maxExperience: number
  currentExperience: number
  nextLevelExperience: number
  progressPercent: number
}

// Achievements database
const ACHIEVEMENTS: UserAchievement[] = [
  {
    id: "ach_001",
    name: "First Scan",
    description: "Classify your first waste item",
    icon: "🎯",
    progress: 0,
    requirement: 1,
    category: "beginner",
  },
  {
    id: "ach_002",
    name: "Century Club",
    description: "Classify 100 waste items",
    icon: "💯",
    progress: 0,
    requirement: 100,
    category: "milestone",
  },
  {
    id: "ach_003",
    name: "Millionaire",
    description: "Accumulate 1,000 eco-points",
    icon: "💰",
    progress: 0,
    requirement: 1000,
    category: "points",
  },
  {
    id: "ach_004",
    name: "Perfect Accuracy",
    description: "Achieve 100% accuracy on 10 classifications",
    icon: "✨",
    progress: 0,
    requirement: 10,
    category: "accuracy",
  },
  {
    id: "ach_005",
    name: "Plastic Warrior",
    description: "Classify 50 plastic items",
    icon: "♻️",
    progress: 0,
    requirement: 50,
    category: "specialist",
  },
  {
    id: "ach_006",
    name: "Green Thumb",
    description: "Classify 30 organic items",
    icon: "🌱",
    progress: 0,
    requirement: 30,
    category: "specialist",
  },
  {
    id: "ach_007",
    name: "E-Waste Expert",
    description: "Classify 20 e-waste items",
    icon: "💻",
    progress: 0,
    requirement: 20,
    category: "specialist",
  },
  {
    id: "ach_008",
    name: "7-Day Warrior",
    description: "Maintain a 7-day classification streak",
    icon: "🔥",
    progress: 0,
    requirement: 7,
    category: "streak",
  },
  {
    id: "ach_009",
    name: "Carbon Neutral Champion",
    description: "Save 500 kg CO2 equivalent",
    icon: "🌍",
    progress: 0,
    requirement: 500,
    category: "impact",
  },
  {
    id: "ach_010",
    name: "Community Hero",
    description: "Participate in 5 community challenges",
    icon: "🦸",
    progress: 0,
    requirement: 5,
    category: "community",
  },
]

// Badges database
const BADGES: Badge[] = [
  {
    id: "badge_001",
    name: "Rookie Recycler",
    description: "Classify 10 items in your first week",
    icon: "🟢",
    rarity: "common",
    earnedCount: 0,
  },
  {
    id: "badge_002",
    name: "Eco Enthusiast",
    description: "Maintain a 30-day streak",
    icon: "🟡",
    rarity: "uncommon",
    earnedCount: 0,
  },
  {
    id: "badge_003",
    name: "Waste Master",
    description: "Classify 500+ items",
    icon: "🔴",
    rarity: "rare",
    earnedCount: 0,
  },
  {
    id: "badge_004",
    name: "Planet Protector",
    description: "Achieve 90%+ recycling rate",
    icon: "🟣",
    rarity: "epic",
    earnedCount: 0,
  },
  {
    id: "badge_005",
    name: "Legendary Guardian",
    description: "1000+ classifications with 95%+ accuracy",
    icon: "👑",
    rarity: "legendary",
    earnedCount: 0,
  },
]

/**
 * Get user's achievements with progress
 */
export function getUserAchievements(
  classifications: number,
  accuracy: number,
  carbonSaved: number,
  streak: number
): UserAchievement[] {
  return ACHIEVEMENTS.map((ach) => {
    let progress = 0

    switch (ach.id) {
      case "ach_001":
        progress = classifications > 0 ? 100 : 0
        break
      case "ach_002":
        progress = (classifications / 100) * 100
        break
      case "ach_004":
        progress = accuracy * 100
        break
      case "ach_005":
      case "ach_006":
      case "ach_007":
        // Would need category-specific counts
        progress = Math.min(100, (classifications / ach.requirement) * 100)
        break
      case "ach_008":
        progress = (streak / 7) * 100
        break
      case "ach_009":
        progress = (carbonSaved / 500) * 100
        break
      default:
        progress = 0
    }

    return {
      ...ach,
      progress: Math.min(100, progress),
      unlockedAt: progress >= 100 ? new Date() : undefined,
    }
  })
}

/**
 * Get daily quests
 */
export function getDailyQuests(): Quest[] {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return [
    {
      id: "quest_daily_001",
      name: "Daily Classifier",
      description: "Classify 5 waste items today",
      type: "daily",
      objectives: [
        {
          description: "Classify 5 items",
          target: 5,
          current: 0,
        },
      ],
      rewards: { points: 50, coins: 10, experience: 25 },
      difficulty: "easy",
      expiresAt: tomorrow,
    },
    {
      id: "quest_daily_002",
      name: "Accuracy Master",
      description: "Achieve 90%+ accuracy on your classifications",
      type: "daily",
      objectives: [
        {
          description: "Reach 90% accuracy",
          target: 90,
          current: 0,
        },
      ],
      rewards: { points: 75, coins: 15, experience: 40 },
      difficulty: "medium",
      expiresAt: tomorrow,
    },
    {
      id: "quest_daily_003",
      name: "Sustainability Buff",
      description: "Learn about a new sustainability topic",
      type: "daily",
      objectives: [
        {
          description: "Complete a tutorial or read a tip",
          target: 1,
          current: 0,
        },
      ],
      rewards: { points: 40, coins: 5, experience: 20 },
      difficulty: "easy",
      expiresAt: tomorrow,
    },
  ]
}

/**
 * Get weekly quests
 */
export function getWeeklyQuests(): Quest[] {
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)

  return [
    {
      id: "quest_weekly_001",
      name: "Weekly Challenge",
      description: "Classify 50 items this week",
      type: "weekly",
      objectives: [
        {
          description: "Reach 50 classifications",
          target: 50,
          current: 0,
        },
      ],
      rewards: { points: 300, coins: 50, experience: 150 },
      difficulty: "medium",
      expiresAt: nextWeek,
    },
    {
      id: "quest_weekly_002",
      name: "Plastic Reduction Week",
      description: "Classify 20 plastic items",
      type: "weekly",
      objectives: [
        {
          description: "Find and classify plastic waste",
          target: 20,
          current: 0,
        },
      ],
      rewards: { points: 250, coins: 40, experience: 120 },
      difficulty: "medium",
      expiresAt: nextWeek,
    },
  ]
}

/**
 * Get user's badges
 */
export function getUserBadges(): Badge[] {
  return BADGES.map((badge) => ({
    ...badge,
  }))
}

/**
 * Calculate level progression
 */
export function calculateLevelProgression(totalExperience: number): LevelProgression {
  const levels = [
    { level: 1, name: "Novice", minExp: 0, maxExp: 100 },
    { level: 2, name: "Apprentice", minExp: 100, maxExp: 300 },
    { level: 3, name: "Enthusiast", minExp: 300, maxExp: 600 },
    { level: 4, name: "Expert", minExp: 600, maxExp: 1200 },
    { level: 5, name: "Master", minExp: 1200, maxExp: 2000 },
    { level: 6, name: "Legend", minExp: 2000, maxExp: 3000 },
  ]

  let currentLevel = levels[0]
  for (const level of levels) {
    if (totalExperience >= level.minExp) {
      currentLevel = level
    }
  }

  const nextLevel =
    levels.find((l) => l.level === currentLevel.level + 1) ||
    levels[levels.length - 1]

  const currentExp = totalExperience - currentLevel.minExp
  const nextExp = nextLevel.maxExp - currentLevel.minExp
  const progressPercent = (currentExp / nextExp) * 100

  return {
    level: currentLevel.level,
    name: currentLevel.name,
    minExperience: currentLevel.minExp,
    maxExperience: nextLevel.maxExp,
    currentExperience: currentExp,
    nextLevelExperience: nextExp,
    progressPercent,
  }
}

/**
 * Calculate experience gained from classification
 */
export function calculateExperience(
  accuracy: number,
  difficulty: "easy" | "medium" | "hard" = "medium",
  streak: number = 1
): number {
  const baseExp = {
    easy: 10,
    medium: 25,
    hard: 50,
  }

  let exp = baseExp[difficulty]

  // Accuracy bonus
  exp += accuracy * 10

  // Streak multiplier
  const streakMultiplier = 1 + streak * 0.1
  exp *= streakMultiplier

  return Math.round(exp)
}

/**
 * Get specific achievement details
 */
export function getAchievementDetails(achievementId: string): UserAchievement | undefined {
  return ACHIEVEMENTS.find((ach) => ach.id === achievementId)
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category: string): UserAchievement[] {
  return ACHIEVEMENTS.filter((ach) => ach.category === category)
}

/**
 * Check if achievement is unlocked
 */
export function isAchievementUnlocked(achievement: UserAchievement): boolean {
  return achievement.unlockedAt !== undefined && achievement.progress >= 100
}

/**
 * Get next achievement to unlock
 */
export function getNextAchievement(achievements: UserAchievement[]): UserAchievement | undefined {
  return achievements.find((ach) => !isAchievementUnlocked(ach))
}

/**
 * Get leaderboard statistics
 */
export function getLeaderboardStats() {
  return {
    totalPlayers: 125000,
    averageLevel: 3.2,
    topPlayer: {
      username: "EcoLegend",
      level: 12,
      totalPoints: 450000,
    },
    monthlyGrowth: "15%",
  }
}

/**
 * Get achievement unlock hints
 */
export function getAchievementHints(achievement: UserAchievement): string[] {
  const hints: Record<string, string[]> = {
    ach_002: [
      "You've classified " + achievement.progress + "% of items needed",
      "Classify 1-2 items daily to reach 100 quickly",
      "Try different waste types to reach the goal",
    ],
    ach_008: [
      "Your current streak is: " + Math.round(achievement.requirement * (achievement.progress / 100)),
      "Login daily to maintain your streak",
      "Even one classification per day counts!",
    ],
  }

  return hints[achievement.id] || ["Keep going! You're making progress."]
}
