/**
 * Advanced Carbon Footprint & Environmental Impact Calculator
 * Calculates CO2 emissions, water savings, and resource conservation
 */

export interface CarbonMetrics {
  carbonFootprint: number // kg CO2
  waterSavings: number // liters
  energySavings: number // kWh
  landfillAvoidance: number // kg
  recycledMaterialValue: number // USD
  equivalents: {
    carMiles: number
    treesSaved: number
    plasticsBottles: number
  }
}

export interface LifecycleAssessment {
  production: number
  transportation: number
  usage: number
  endOfLife: number
  total: number
}

export interface ImpactScenario {
  landfill: CarbonMetrics
  recycling: CarbonMetrics
  composting: CarbonMetrics
  upcycling: CarbonMetrics
  bestCase: CarbonMetrics
}

// Waste-specific carbon coefficients (kg CO2 per kg of waste)
const CARBON_COEFFICIENTS: Record<string, number> = {
  recyclable: 0.08, // Paper, cardboard
  plastic: 0.25, // High impact if landfilled
  "e-waste": 3.5, // Significant extraction + processing
  organic: 0.002, // Minimal if composted, high if landfilled (methane)
  hazardous: 2.1, // Special processing required
  general: 0.15, // Average mixed waste
  glass: 0.05,
  metal: 0.12,
  textile: 0.18,
  wood: 0.06,
}

// Recycling credits (emissions avoided)
const RECYCLING_CREDITS: Record<string, number> = {
  recyclable: 0.9, // 90% emissions avoided through recycling
  plastic: 2.8, // High virgin production emissions
  "e-waste": 4.2, // Complex manufacturing avoidance
  organic: 4.1, // Methane avoidance + soil building
  glass: 0.85,
  metal: 2.5, // High mining/smelting avoidance
  textile: 1.8,
  wood: 0.7,
}

// Water usage (liters per kg)
const WATER_USAGE: Record<string, number> = {
  recyclable: 0.5,
  plastic: 1.2,
  "e-waste": 50, // Significant water for processing
  organic: 0.1,
  hazardous: 5,
  general: 0.8,
  glass: 0.2,
  metal: 0.6,
  textile: 120, // Very water-intensive
  wood: 0.3,
}

// Energy usage (kWh per kg)
const ENERGY_USAGE: Record<string, number> = {
  recyclable: 0.02,
  plastic: 0.08,
  "e-waste": 0.5,
  organic: 0.001,
  hazardous: 0.3,
  general: 0.03,
  glass: 0.01,
  metal: 0.15,
  textile: 0.12,
  wood: 0.008,
}

/**
 * Calculate comprehensive carbon footprint for a waste item
 */
export function calculateCarbonFootprint(
  wasteType: string,
  weight: number = 1, // in kg
  scenario: "landfill" | "recycling" | "composting" | "upcycling" = "landfill"
): CarbonMetrics {
  const baseCarbon = CARBON_COEFFICIENTS[wasteType] || CARBON_COEFFICIENTS.general
  const waterPerKg = WATER_USAGE[wasteType] || WATER_USAGE.general
  const energyPerKg = ENERGY_USAGE[wasteType] || ENERGY_USAGE.general

  let carbonFootprint = baseCarbon * weight

  // Adjust based on disposal scenario
  if (scenario === "recycling") {
    const credit = RECYCLING_CREDITS[wasteType] || 1.0
    carbonFootprint = Math.max(0, carbonFootprint - credit * weight)
  } else if (scenario === "composting") {
    // Organic waste: avoid methane emissions
    if (wasteType === "organic") {
      carbonFootprint = 0.05 * weight // Minimal processing
    }
  } else if (scenario === "upcycling") {
    carbonFootprint = 0.1 * weight // Minimal processing
  }

  const waterSavings = waterPerKg * weight * (scenario !== "landfill" ? 0.8 : 0)
  const energySavings = energyPerKg * weight * (scenario !== "landfill" ? 0.7 : 0)

  return {
    carbonFootprint: Math.round(carbonFootprint * 1000) / 1000,
    waterSavings: Math.round(waterSavings * 100) / 100,
    energySavings: Math.round(energySavings * 1000) / 1000,
    landfillAvoidance: scenario !== "landfill" ? weight : 0,
    recycledMaterialValue: calculateMaterialValue(wasteType, weight),
    equivalents: calculateEquivalents(carbonFootprint),
  }
}

/**
 * Calculate lifecycle assessment for waste item
 */
export function calculateLifecycleAssessment(
  wasteType: string,
  weight: number = 1
): LifecycleAssessment {
  // Simplified LCA stages
  const production = CARBON_COEFFICIENTS[wasteType] * weight * 0.5 // 50% of footprint
  const transportation = CARBON_COEFFICIENTS[wasteType] * weight * 0.1
  const usage = CARBON_COEFFICIENTS[wasteType] * weight * 0.3
  const endOfLife = CARBON_COEFFICIENTS[wasteType] * weight * 0.1

  return {
    production,
    transportation,
    usage,
    endOfLife,
    total: production + transportation + usage + endOfLife,
  }
}

/**
 * Compare impact scenarios for waste item
 */
export function compareImpactScenarios(
  wasteType: string,
  weight: number = 1
): ImpactScenario {
  return {
    landfill: calculateCarbonFootprint(wasteType, weight, "landfill"),
    recycling: calculateCarbonFootprint(wasteType, weight, "recycling"),
    composting: wasteType === "organic" 
      ? calculateCarbonFootprint(wasteType, weight, "composting")
      : calculateCarbonFootprint(wasteType, weight, "landfill"),
    upcycling: calculateCarbonFootprint(wasteType, weight, "upcycling"),
    bestCase: calculateCarbonFootprint(wasteType, weight, "recycling"),
  }
}

/**
 * Calculate monetary value of recycled materials
 */
function calculateMaterialValue(wasteType: string, weight: number): number {
  const pricePerKg: Record<string, number> = {
    recyclable: 0.05, // Paper/cardboard
    plastic: 0.15, // HDPE, PET
    "e-waste": 2.5, // Precious metals
    organic: 0, // Typically free
    hazardous: -1.0, // Disposal cost
    general: 0,
    glass: 0.03,
    metal: 0.5, // Aluminum, copper
    textile: 0.1,
    wood: 0.08,
  }

  return Math.round((pricePerKg[wasteType] || 0) * weight * 100) / 100
}

/**
 * Calculate equivalent environmental metrics
 */
function calculateEquivalents(carbonKg: number) {
  return {
    carMiles: Math.round(carbonKg / 0.22), // Average car emits 0.22 kg CO2 per mile
    treesSaved: Math.round(carbonKg / 22), // Tree sequesters ~22 kg CO2/year
    plasticsBottles: Math.round(carbonKg / 0.03), // PET bottle ~30g CO2
  }
}

/**
 * Calculate annual environmental impact
 */
export function calculateAnnualImpact(classificationHistory: Array<{
  category: string
  weight?: number
  scenario?: string
}>) {
  let totalCarbon = 0
  let totalWater = 0
  let totalEnergy = 0
  let totalLandfillAvoidance = 0
  let totalValue = 0

  for (const item of classificationHistory) {
    const metrics = calculateCarbonFootprint(
      item.category,
      item.weight || 0.5,
      (item.scenario as any) || "recycling"
    )

    totalCarbon += metrics.carbonFootprint
    totalWater += metrics.waterSavings
    totalEnergy += metrics.energySavings
    totalLandfillAvoidance += metrics.landfillAvoidance
    totalValue += metrics.recycledMaterialValue
  }

  return {
    totalCarbon: Math.round(totalCarbon * 100) / 100,
    totalWater: Math.round(totalWater * 100) / 100,
    totalEnergy: Math.round(totalEnergy * 1000) / 1000,
    totalLandfillAvoidance: Math.round(totalLandfillAvoidance * 100) / 100,
    totalValue: Math.round(totalValue * 100) / 100,
    equivalents: calculateEquivalents(totalCarbon),
    itemsProcessed: classificationHistory.length,
  }
}

/**
 * Get personalized sustainability recommendations
 */
export function getSustainabilityRecommendations(category: string): string[] {
  const recommendations: Record<string, string[]> = {
    recyclable: [
      "Rinse containers before recycling to improve sortation",
      "Remove plastic liners from paper bags",
      "Flatten boxes to save collection space",
      "Keep recyclables dry to prevent contamination",
      "Check local guidelines for accepted materials",
    ],
    plastic: [
      "Choose reusable bags and containers to eliminate single-use plastic",
      "Look for plastic alternatives made from ocean waste or recycled content",
      "Participate in plastic reduction challenges",
      "Support brands committing to plastic-free packaging",
      "Learn about different plastic types (1-7) for proper recycling",
    ],
    "e-waste": [
      "Donate working electronics to extend product lifecycle",
      "Use manufacturer take-back programs for old devices",
      "Extract data-bearing media before recycling",
      "Wait to upgrade to consolidate fewer trips to recyclers",
      "Join e-waste collection events in your community",
    ],
    organic: [
      "Start home composting to create soil amendment",
      "Share compost with local gardens or farms",
      "Request green waste collection if not available",
      "Separate organic waste to improve collection efficiency",
      "Learn which materials are home-compostable vs industrial-only",
    ],
    hazardous: [
      "Attend municipal hazardous waste collection events",
      "Never mix chemicals or dispose down drains",
      "Store safely in sealed containers",
      "Find certified disposal facilities through EPA",
      "Consider safer alternatives to hazardous products",
    ],
    general: [
      "Practice the 5 R's: Refuse, Reduce, Reuse, Repair, Recycle",
      "Buy products with minimal packaging",
      "Support circular economy brands",
      "Donate items in good condition",
      "Shop secondhand before buying new",
    ],
  }

  return recommendations[category] || recommendations.general
}

/**
 * Calculate environmental score (0-100)
 */
export function calculateEcoScore(
  recyclablePercentage: number,
  hazardousPercentage: number,
  compostsPercentage: number
): number {
  let score = 50 // Base score

  // Reward high recycling rate
  score += recyclablePercentage * 0.3

  // Penalize hazardous waste
  score -= hazardousPercentage * 0.4

  // Reward composting
  score += compostsPercentage * 0.2

  return Math.min(100, Math.max(0, score))
}
