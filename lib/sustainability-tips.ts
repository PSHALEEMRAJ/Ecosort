/**
 * AI-Powered Sustainability Tips Generator
 * Generates personalized tips based on waste classification patterns
 */

export interface SustainabilityTip {
  id: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  difficulty: "easy" | "moderate" | "challenging"
  category: string
  actionItems: string[]
  estimatedSavings: {
    carbon: number // kg CO2
    cost: number // USD
    time: number // minutes to implement
  }
  relatedWasteTypes: string[]
}

export interface PersonalizedRecommendation {
  tip: SustainabilityTip
  reason: string // Why this tip is recommended
  score: number // Relevance score 0-100
}

// Comprehensive sustainability tips database
const SUSTAINABILITY_TIPS: SustainabilityTip[] = [
  {
    id: "tip_001",
    title: "Start a Home Composting System",
    description:
      "Convert your kitchen and garden waste into nutrient-rich soil amendment. Home composting reduces methane emissions from landfills by up to 25% and eliminates the need for chemical fertilizers.",
    impact: "high",
    difficulty: "moderate",
    category: "organic_waste",
    actionItems: [
      "Purchase or build a compost bin (cost: $20-100)",
      "Collect brown materials (leaves, paper, cardboard)",
      "Add green materials (food scraps, grass clippings)",
      "Maintain proper moisture and aeration",
      "Use finished compost in gardens within 3-6 months",
    ],
    estimatedSavings: {
      carbon: 45,
      cost: 200,
      time: 30,
    },
    relatedWasteTypes: ["organic", "paper", "cardboard"],
  },
  {
    id: "tip_002",
    title: "Switch to Reusable Shopping Bags",
    description:
      "One reusable bag can replace up to 1,000 single-use plastic bags over its lifetime. Reduce plastic pollution while saving money on replacement bags.",
    impact: "high",
    difficulty: "easy",
    category: "plastic_reduction",
    actionItems: [
      "Invest in 3-5 durable reusable bags ($25-50)",
      "Keep them in your car or near your door",
      "Use them for every shopping trip",
      "Hand wash occasionally to maintain quality",
      "Share benefits with friends and family",
    ],
    estimatedSavings: {
      carbon: 12,
      cost: 50,
      time: 5,
    },
    relatedWasteTypes: ["plastic"],
  },
  {
    id: "tip_003",
    title: "Participate in E-Waste Recycling Programs",
    description:
      "Electronic waste contains valuable materials like gold, copper, and rare earth elements. Responsible recycling recovers these materials and prevents toxic contamination of soil and water.",
    impact: "high",
    difficulty: "easy",
    category: "e_waste",
    actionItems: [
      "Identify local e-waste collection centers",
      "Back up and securely wipe data from devices",
      "Store e-waste safely until collection day",
      "Donate working electronics to charity first",
      "Keep receipts for tax deductions if applicable",
    ],
    estimatedSavings: {
      carbon: 85,
      cost: 0,
      time: 15,
    },
    relatedWasteTypes: ["e-waste"],
  },
  {
    id: "tip_004",
    title: "Reduce Single-Use Plastics in Daily Life",
    description:
      "Eliminate common single-use plastics (straws, bottles, bags, packaging) by switching to sustainable alternatives. This prevents 50+ kg of plastic waste annually per person.",
    impact: "high",
    difficulty: "moderate",
    category: "plastic_reduction",
    actionItems: [
      "Use reusable water bottles and coffee cups",
      "Refuse plastic straws and use alternatives",
      "Buy products with minimal packaging",
      "Choose package-free items from bulk stores",
      "Request plastic-free options from businesses",
    ],
    estimatedSavings: {
      carbon: 35,
      cost: 150,
      time: 20,
    },
    relatedWasteTypes: ["plastic", "general"],
  },
  {
    id: "tip_005",
    title: "Optimize Your Recycling Efforts",
    description:
      "Proper recycling contamination prevention ensures 95% of collected materials actually get recycled. Clean and sorted materials increase facility efficiency and material value.",
    impact: "medium",
    difficulty: "easy",
    category: "recycling",
    actionItems: [
      "Rinse all containers thoroughly",
      "Remove plastic liners from paper bags",
      "Flatten boxes to save space",
      "Check local recycling guidelines for your area",
      "Keep recyclables dry and clean",
    ],
    estimatedSavings: {
      carbon: 15,
      cost: 30,
      time: 10,
    },
    relatedWasteTypes: ["recyclable", "plastic", "glass", "metal"],
  },
  {
    id: "tip_006",
    title: "Support Circular Economy Brands",
    description:
      "Choose brands that design products for longevity and recyclability. Supporting circular economy businesses drives systemic change toward sustainable consumption.",
    impact: "medium",
    difficulty: "moderate",
    category: "consumption",
    actionItems: [
      "Research brands' sustainability practices",
      "Prioritize products with recycled content",
      "Buy from companies with take-back programs",
      "Choose repairable over disposable products",
      "Support local and certified sustainable brands",
    ],
    estimatedSavings: {
      carbon: 60,
      cost: 0,
      time: 30,
    },
    relatedWasteTypes: ["general", "recyclable"],
  },
  {
    id: "tip_007",
    title: "Create a Home Upcycling Station",
    description:
      "Transform waste materials into useful items through creative reuse. Upcycling extends product lifecycles and sparks creativity while reducing landfill waste.",
    impact: "medium",
    difficulty: "challenging",
    category: "upcycling",
    actionItems: [
      "Collect suitable waste items (jars, containers, fabric)",
      "Learn upcycling techniques (DIY courses, videos)",
      "Create storage, decor, or gift items",
      "Share creations with community",
      "Sell or donate upcycled items",
    ],
    estimatedSavings: {
      carbon: 25,
      cost: 100,
      time: 60,
    },
    relatedWasteTypes: ["general", "plastic", "textile", "wood"],
  },
  {
    id: "tip_008",
    title: "Organize Community Cleanup Events",
    description:
      "Community cleanups not only remove waste but build social connection around environmental values. Regular cleanups prevent litter from reaching ecosystems.",
    impact: "high",
    difficulty: "challenging",
    category: "community",
    actionItems: [
      "Choose a local area needing cleanup",
      "Recruit volunteers from community",
      "Arrange proper waste disposal",
      "Provide supplies (bags, gloves, tools)",
      "Document impact and share results",
    ],
    estimatedSavings: {
      carbon: 200,
      cost: 0,
      time: 120,
    },
    relatedWasteTypes: ["general", "plastic", "hazardous"],
  },
  {
    id: "tip_009",
    title: "Implement Paperless Living",
    description:
      "Go digital to reduce paper waste by 90%. Each person produces 57 kg of paper waste annually; going paperless prevents this while saving money.",
    impact: "medium",
    difficulty: "moderate",
    category: "paper_reduction",
    actionItems: [
      "Switch to digital billing and statements",
      "Use cloud storage for important documents",
      "Unsubscribe from physical mail",
      "Use digital note-taking applications",
      "Print only when absolutely necessary",
    ],
    estimatedSavings: {
      carbon: 22,
      cost: 80,
      time: 15,
    },
    relatedWasteTypes: ["recyclable", "paper"],
  },
  {
    id: "tip_010",
    title: "Reduce Food Waste Through Smart Shopping",
    description:
      "Plan meals and shop strategically to reduce food waste. Food waste represents 10% of global greenhouse gas emissions and wasted resources.",
    impact: "high",
    difficulty: "moderate",
    category: "food_waste",
    actionItems: [
      "Plan weekly meals before shopping",
      "Buy only what you need",
      "Check expiration dates before purchase",
      "Store food properly to extend freshness",
      "Compost unavoidable food scraps",
    ],
    estimatedSavings: {
      carbon: 40,
      cost: 600,
      time: 30,
    },
    relatedWasteTypes: ["organic"],
  },
]

/**
 * Get personalized sustainability tips based on user's waste patterns
 */
export function getPersonalizedTips(
  wasteHistory: Array<{ category: string; count: number }>,
  userLevel: "beginner" | "intermediate" | "advanced" = "beginner"
): PersonalizedRecommendation[] {
  const recommendations: PersonalizedRecommendation[] = []

  for (const tip of SUSTAINABILITY_TIPS) {
    let relevanceScore = 0
    let reason = ""

    // Calculate relevance based on waste history
    for (const waste of wasteHistory) {
      if (tip.relatedWasteTypes.includes(waste.category)) {
        relevanceScore += waste.count * 10
        reason = `You frequently classify ${waste.category} waste. This tip directly helps reduce it.`
      }
    }

    // Adjust by difficulty level
    if (userLevel === "beginner" && tip.difficulty === "easy") {
      relevanceScore += 20
      reason += " This is a great starting point."
    } else if (userLevel === "intermediate" && tip.difficulty === "moderate") {
      relevanceScore += 15
    } else if (userLevel === "advanced" && tip.difficulty === "challenging") {
      relevanceScore += 15
    }

    if (relevanceScore > 0) {
      recommendations.push({
        tip,
        reason,
        score: Math.min(100, relevanceScore),
      })
    }
  }

  // Sort by relevance and return top 5
  return recommendations.sort((a, b) => b.score - a.score).slice(0, 5)
}

/**
 * Get tips by category
 */
export function getTipsByCategory(category: string): SustainabilityTip[] {
  return SUSTAINABILITY_TIPS.filter((tip) => tip.category === category)
}

/**
 * Get tips by difficulty level
 */
export function getTipsByDifficulty(difficulty: "easy" | "moderate" | "challenging"): SustainabilityTip[] {
  return SUSTAINABILITY_TIPS.filter((tip) => tip.difficulty === difficulty)
}

/**
 * Get high-impact tips
 */
export function getHighImpactTips(): SustainabilityTip[] {
  return SUSTAINABILITY_TIPS.filter((tip) => tip.impact === "high").sort(
    (a, b) => b.estimatedSavings.carbon - a.estimatedSavings.carbon
  )
}

/**
 * Calculate total potential savings
 */
export function calculatePotentialSavings(selectedTips: SustainabilityTip[]) {
  return {
    totalCarbon: selectedTips.reduce((sum, tip) => sum + tip.estimatedSavings.carbon, 0),
    totalCost: selectedTips.reduce((sum, tip) => sum + tip.estimatedSavings.cost, 0),
    totalTime: selectedTips.reduce((sum, tip) => sum + tip.estimatedSavings.time, 0),
    carbonTreeEquivalent: Math.round(
      selectedTips.reduce((sum, tip) => sum + tip.estimatedSavings.carbon, 0) / 22
    ),
  }
}

/**
 * Generate weekly tip of the week
 */
export function getWeeklyTip(): SustainabilityTip {
  const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))
  const tipIndex = week % SUSTAINABILITY_TIPS.length
  return SUSTAINABILITY_TIPS[tipIndex]
}

/**
 * Get challenge-based tips
 */
export function getChallengeTips(challengeType: "plastic_free" | "carbon_neutral" | "zero_waste"): SustainabilityTip[] {
  const tipCategories: Record<string, string[]> = {
    plastic_free: ["plastic_reduction", "recycling"],
    carbon_neutral: ["organic_waste", "consumption", "community"],
    zero_waste: ["upcycling", "composting", "recycling"],
  }

  const categories = tipCategories[challengeType] || []
  return SUSTAINABILITY_TIPS.filter((tip) => categories.includes(tip.category))
}
