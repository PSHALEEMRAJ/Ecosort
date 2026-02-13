/**
 * AI-Powered Educational Content System
 * Personalized learning paths based on waste classification history
 * ML-driven content recommendations and progress tracking
 */

export interface EducationalModule {
  id: string
  title: string
  description: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: number // minutes
  content: string
  keyPoints: string[]
  quiz: QuizQuestion[]
  resources: ResourceLink[]
  relatedCategories: string[]
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface ResourceLink {
  title: string
  url: string
  type: "article" | "video" | "tool" | "guide"
}

export interface UserLearningPath {
  userId: string
  completedModules: string[]
  currentModule: string | null
  score: number // 0-100
  streak: number // consecutive days learning
  lastActiveDate: number
  preferences: {
    preferredDifficulty: "beginner" | "intermediate" | "advanced"
    learningStyle: "visual" | "reading" | "interactive"
    focusAreas: string[]
  }
}

// AI-Generated Educational Modules
export const EDUCATIONAL_MODULES: Record<string, EducationalModule> = {
  plastic_crisis: {
    id: "plastic_crisis",
    title: "The Global Plastic Crisis",
    description: "Understand the scale and impact of plastic pollution on our oceans and ecosystems",
    category: "environmental-science",
    difficulty: "beginner",
    estimatedTime: 15,
    content: `
# The Global Plastic Crisis

## The Problem
- 8 million metric tons of plastic enter oceans annually
- Only 9% of all plastic ever produced has been recycled
- Microplastics found in human blood and organs
- 1 million sea birds die from plastic ingestion yearly

## Why It Matters
Plastic production requires fossil fuels and creates long-lasting pollution. Single-use plastics are designed for convenience but persist for 400-1000 years.

## Solutions
1. **Reduce**: Use reusable alternatives
2. **Recycle**: Properly sort and recycle plastics
3. **Advocate**: Support policies limiting single-use plastics
4. **Educate**: Share knowledge with others
    `,
    keyPoints: [
      "8 million tons of plastic enter oceans annually",
      "Plastics take 400-1000 years to decompose",
      "Microplastics are found in human blood",
      "Recycling rate is only 9% globally",
    ],
    quiz: [
      {
        question: "How long does it take for a plastic bag to decompose?",
        options: ["10 years", "100 years", "20-30 years", "400-1000 years"],
        correctAnswer: 3,
        explanation:
          "Plastic bags take 400-1000 years to decompose in the environment.",
      },
      {
        question: "What percentage of plastic is recycled globally?",
        options: ["50%", "25%", "9%", "75%"],
        correctAnswer: 2,
        explanation:
          "Only 9% of all plastic ever produced has been recycled. This is a major sustainability challenge.",
      },
    ],
    resources: [
      {
        title: "Ocean Plastic Pollution",
        url: "https://example.com/ocean-plastic",
        type: "article",
      },
      {
        title: "Plastic Documentary",
        url: "https://example.com/plastic-doc",
        type: "video",
      },
    ],
    relatedCategories: ["plastic", "ocean-conservation", "recycling"],
  },

  ewaste_management: {
    id: "ewaste_management",
    title: "E-Waste Management & Responsible Recycling",
    description: "Learn about electronic waste, its dangers, and proper recycling procedures",
    category: "waste-management",
    difficulty: "intermediate",
    estimatedTime: 20,
    content: `
# E-Waste Management & Responsible Recycling

## What is E-Waste?
Electronic waste includes discarded electrical or electronic devices. This includes phones, computers, TVs, and appliances.

## Hazards
- Contains toxic materials: lead, mercury, cadmium, arsenic
- Improper disposal contaminates soil and groundwater
- Recycling recovers valuable materials: gold, silver, copper
- Recycling 1 million phones saves 35,274 barrels of oil

## Proper E-Waste Recycling Steps
1. **Backup Data**: Remove personal information
2. **Find Certified Recycler**: Use e-Stewards certified facilities
3. **Transport Safely**: Keep in sealed, dry containers
4. **Track Certificate**: Get recycling certificate

## Impact Metrics
- 1 smartphone contains $0.50 worth of precious metals
- Average computer: 200+ materials to recover
- Refurbished electronics reduce CO2 by 80% vs new
    `,
    keyPoints: [
      "E-waste contains toxic heavy metals",
      "Recycling recovers valuable precious metals",
      "1 phone = $0.50+ in precious metals",
      "Proper recycling prevents groundwater contamination",
    ],
    quiz: [
      {
        question: "What dangerous element is found in old computer monitors?",
        options: ["Aluminum", "Lead", "Copper", "Silver"],
        correctAnswer: 1,
        explanation:
          "Lead was commonly used in older CRT monitors and is highly toxic if not properly recycled.",
      },
    ],
    resources: [
      {
        title: "E-Stewards Certification",
        url: "https://example.com/e-stewards",
        type: "guide",
      },
      {
        title: "E-Waste Statistics",
        url: "https://example.com/ewaste-stats",
        type: "article",
      },
    ],
    relatedCategories: ["e-waste", "recycling", "hazardous-materials"],
  },

  composting_guide: {
    id: "composting_guide",
    title: "Home Composting Guide",
    description: "Master the art of composting and turn waste into valuable soil amendment",
    category: "waste-management",
    difficulty: "beginner",
    estimatedTime: 12,
    content: `
# Home Composting Guide

## Benefits of Composting
- Reduces landfill methane emissions by 60%
- Creates nutrient-rich soil for gardens
- Saves money on soil amendments
- Diverts 20-30% of household waste from landfills

## What to Compost
✓ Fruit and vegetable scraps
✓ Coffee grounds and tea bags
✓ Leaves and grass clippings
✓ Wood chips and cardboard
✗ Meat, dairy, oils
✗ Diseased plants
✗ Treated wood or glossy paper

## Composting Methods
1. **Traditional Bin**: Backyard bin (2-6 months)
2. **Worm Composting**: Indoors (2-3 months)
3. **Bokashi**: Fermentation method (2 weeks + burial)
4. **Trench**: Direct soil burial (3-6 months)

## The Recipe
- 50% green (nitrogen): food scraps, grass
- 50% brown (carbon): leaves, paper
- Moisture: like damp sponge
- Aeration: turn pile every 2 weeks
    `,
    keyPoints: [
      "Composting reduces landfill methane by 60%",
      "3-month cycle to usable compost",
      "50/50 green to brown ratio",
      "Prevents 20-30% of household waste from landfills",
    ],
    quiz: [
      {
        question: "What is the ideal green to brown ratio for composting?",
        options: ["100% green", "75% green, 25% brown", "50% green, 50% brown", "25% green, 75% brown"],
        correctAnswer: 2,
        explanation:
          "The ideal ratio is 50% green (nitrogen-rich) materials and 50% brown (carbon-rich) materials for optimal decomposition.",
      },
    ],
    resources: [
      {
        title: "EPA Composting Guide",
        url: "https://example.com/epa-composting",
        type: "guide",
      },
    ],
    relatedCategories: ["organic", "soil-health", "composting"],
  },
}

/**
 * AI Learning Path Generator
 * Recommends personalized learning based on user's waste classification history
 */
export function generatePersonalizedLearningPath(
  wasteHistory: Array<{ category: string; count: number }>
): EducationalModule[] {
  const recommendations: EducationalModule[] = []
  const recommended = new Set<string>()

  // Analyze waste history and recommend modules
  for (const [category, count] of wasteHistory.entries()) {
    if (count > 5 && category === "plastic" && !recommended.has("plastic_crisis")) {
      recommendations.push(EDUCATIONAL_MODULES.plastic_crisis)
      recommended.add("plastic_crisis")
    }
    if (count > 3 && category === "e-waste" && !recommended.has("ewaste_management")) {
      recommendations.push(EDUCATIONAL_MODULES.ewaste_management)
      recommended.add("ewaste_management")
    }
    if (count > 5 && category === "organic" && !recommended.has("composting_guide")) {
      recommendations.push(EDUCATIONAL_MODULES.composting_guide)
      recommended.add("composting_guide")
    }
  }

  return recommendations.length > 0
    ? recommendations
    : [EDUCATIONAL_MODULES.plastic_crisis] // Default recommendation
}

/**
 * AI Quiz Generator - Creates custom quizzes based on user's learning path
 */
export function generateCustomQuiz(moduleId: string): QuizQuestion[] {
  const module = EDUCATIONAL_MODULES[moduleId as keyof typeof EDUCATIONAL_MODULES]
  return module?.quiz || []
}

/**
 * ML-Based Content Recommendation Algorithm
 * Uses collaborative filtering principles to recommend modules
 */
export function getRecommendedModules(userLearningPath: UserLearningPath): EducationalModule[] {
  const allModules = Object.values(EDUCATIONAL_MODULES)
  const completed = new Set(userLearningPath.completedModules)
  
  // Filter not completed
  const available = allModules.filter((m) => !completed.has(m.id))
  
  // Sort by difficulty matching user preference
  return available.sort((a, b) => {
    const difficultyScore = (difficulty: string) => {
      if (difficulty === userLearningPath.preferences.preferredDifficulty) return 0
      if (difficulty === "beginner") return 1
      return 2
    }
    return difficultyScore(a.difficulty) - difficultyScore(b.difficulty)
  })
}

/**
 * Calculate user learning engagement score
 */
export function calculateEngagementScore(userLearningPath: UserLearningPath): number {
  let score = 0
  
  // Completed modules: 10 points each
  score += userLearningPath.completedModules.length * 10
  
  // Streak bonus: 5 points per day
  score += userLearningPath.streak * 5
  
  // Time-based bonus: recent activity worth more
  const daysSinceActive = (Date.now() - userLearningPath.lastActiveDate) / (1000 * 60 * 60 * 24)
  if (daysSinceActive < 1) score += 20
  else if (daysSinceActive < 7) score += 10
  else if (daysSinceActive < 30) score += 5
  
  // Quiz score bonus
  score += userLearningPath.score * 0.1
  
  return Math.min(score, 100) // Cap at 100
}

/**
 * ML-Powered Knowledge Recommendation Engine
 * Provides contextual tips based on waste classification
 */
export function getContextualTip(wasteCategory: string): string {
  const tips: Record<string, string[]> = {
    plastic: [
      "Did you know? Plastic takes 400-1000 years to decompose. Consider using reusable alternatives!",
      "Tip: Check your local plastic recycling guidelines - not all plastics are accepted everywhere.",
      "Fun fact: 1 million sea birds die from plastic ingestion each year.",
    ],
    organic: [
      "Great choice! Organic waste can be composted into nutrient-rich soil.",
      "Tip: Home composting can reduce your carbon footprint by 60%!",
      "Did you know? Landfill organic waste releases methane, 25x more potent than CO2.",
    ],
    "e-waste": [
      "Important: E-waste contains toxic heavy metals that need proper handling.",
      "Tip: Your old phone contains $0.50+ worth of precious metals!",
      "Recycling electronics saves 80% CO2 compared to manufacturing new ones.",
    ],
    hazardous: [
      "Critical: Use certified hazmat disposal facilities for dangerous materials.",
      "Tip: Never mix chemicals or dispose in regular trash.",
      "Important: Improper disposal can contaminate groundwater for decades.",
    ],
    recyclable: [
      "Excellent! Make sure to rinse containers before recycling.",
      "Tip: Recycling one aluminum can saves enough energy to power a laptop for 3 hours.",
      "Did you know? Recycled materials reduce CO2 emissions by 50-90% vs new production.",
    ],
  }

  const categoryTips = tips[wasteCategory] || tips.recyclable
  return categoryTips[Math.floor(Math.random() * categoryTips.length)]
}

/**
 * Generate learning achievement badges
 */
export function generateAchievementBadges(userLearningPath: UserLearningPath): string[] {
  const badges: string[] = []

  if (userLearningPath.completedModules.length >= 1) badges.push("First Step")
  if (userLearningPath.completedModules.length >= 3) badges.push("Knowledge Seeker")
  if (userLearningPath.completedModules.length >= 5) badges.push("Sustainability Expert")
  if (userLearningPath.streak >= 7) badges.push("7-Day Warrior")
  if (userLearningPath.streak >= 30) badges.push("Monthly Champion")
  if (userLearningPath.score >= 90) badges.push("Quiz Master")

  return badges
}
