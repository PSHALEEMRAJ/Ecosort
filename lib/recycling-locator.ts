/**
 * Recycling Locator & Facility Integration System
 * Finds local recycling facilities and provides disposal guidance
 */

export interface RecyclingFacility {
  id: string
  name: string
  type: "curbside" | "drop-off" | "special" | "hazmat" | "composting"
  address: string
  coordinates: { lat: number; lng: number }
  acceptedMaterials: string[]
  hours: {
    monday?: string
    tuesday?: string
    wednesday?: string
    thursday?: string
    friday?: string
    saturday?: string
    sunday?: string
  }
  phone?: string
  website?: string
  distance: number // in km
  rating: number // 1-5
  reviews?: string[]
}

export interface DisposalRoute {
  steps: Array<{
    order: number
    action: string
    facility?: RecyclingFacility
    instructions: string
  }>
  estimatedTime: number // minutes
  estimatedCost: number // USD
  environmentalBenefit: string
}

// Mock facilities database
const RECYCLING_FACILITIES: RecyclingFacility[] = [
  {
    id: "fac_001",
    name: "Green Valley Recycling Center",
    type: "drop-off",
    address: "123 Eco Drive, Portland, OR 97201",
    coordinates: { lat: 45.5152, lng: -122.6784 },
    acceptedMaterials: ["plastic", "paper", "glass", "metal", "cardboard"],
    hours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 8:00 PM",
      saturday: "9:00 AM - 5:00 PM",
      sunday: "Closed",
    },
    phone: "(503) 555-0123",
    website: "greenvalleyrecycling.org",
    distance: 2.3,
    rating: 4.8,
    reviews: [
      "Very clean and well-organized facility",
      "Staff is helpful and knowledgeable",
      "Great sorting system for different materials",
    ],
  },
  {
    id: "fac_002",
    name: "E-Waste Solutions",
    type: "special",
    address: "456 Tech Boulevard, Portland, OR 97202",
    coordinates: { lat: 45.5289, lng: -122.6820 },
    acceptedMaterials: ["electronics", "e-waste", "batteries", "cables"],
    hours: {
      monday: "10:00 AM - 5:00 PM",
      tuesday: "10:00 AM - 5:00 PM",
      wednesday: "10:00 AM - 5:00 PM",
      thursday: "10:00 AM - 5:00 PM",
      friday: "10:00 AM - 6:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed",
    },
    phone: "(503) 555-0456",
    website: "ewastesolutions.com",
    distance: 3.1,
    rating: 4.6,
  },
  {
    id: "fac_003",
    name: "Community Compost Hub",
    type: "composting",
    address: "789 Garden Lane, Portland, OR 97203",
    coordinates: { lat: 45.4952, lng: -122.6584 },
    acceptedMaterials: ["organic", "yard waste", "food scraps", "leaves"],
    hours: {
      monday: "9:00 AM - 4:00 PM",
      tuesday: "9:00 AM - 4:00 PM",
      wednesday: "9:00 AM - 4:00 PM",
      thursday: "9:00 AM - 4:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "10:00 AM - 3:00 PM",
      sunday: "Closed",
    },
    phone: "(503) 555-0789",
    website: "communitycompost.org",
    distance: 1.8,
    rating: 4.9,
  },
  {
    id: "fac_004",
    name: "Hazmat Collection Center",
    type: "hazmat",
    address: "321 Safety Street, Portland, OR 97204",
    coordinates: { lat: 45.5441, lng: -122.6501 },
    acceptedMaterials: ["hazardous waste", "chemicals", "paint", "batteries", "oils"],
    hours: {
      saturday: "9:00 AM - 1:00 PM",
      sunday: "Closed",
    },
    phone: "(503) 555-0321",
    website: "portlandgov.com/hazmat",
    distance: 5.2,
    rating: 4.7,
  },
]

/**
 * Find nearby recycling facilities
 */
export function findNearbyFacilities(
  userCoords: { lat: number; lng: number },
  wasteType?: string,
  maxDistance: number = 10
): RecyclingFacility[] {
  let facilities = RECYCLING_FACILITIES.map((fac) => ({
    ...fac,
    distance: calculateDistance(userCoords, fac.coordinates),
  }))

  // Filter by waste type if provided
  if (wasteType) {
    facilities = facilities.filter((fac) =>
      fac.acceptedMaterials.some((mat) =>
        mat.toLowerCase().includes(wasteType.toLowerCase()) ||
        wasteType.toLowerCase().includes(mat.toLowerCase())
      )
    )
  }

  // Filter by distance
  facilities = facilities.filter((fac) => fac.distance <= maxDistance)

  // Sort by distance, then by rating
  return facilities.sort((a, b) => {
    if (a.distance !== b.distance) {
      return a.distance - b.distance
    }
    return b.rating - a.rating
  })
}

/**
 * Get disposal route for specific waste item
 */
export function getDisposalRoute(
  wasteType: string,
  userCoords: { lat: number; lng: number }
): DisposalRoute {
  const facilities = findNearbyFacilities(userCoords, wasteType)

  if (facilities.length === 0) {
    return {
      steps: [
        {
          order: 1,
          action: "Prepare waste item",
          instructions: `Clean and prepare the ${wasteType} item for disposal. Remove any contaminants.`,
        },
        {
          order: 2,
          action: "Check local guidelines",
          instructions: "Visit your local city or county waste management website for specific instructions.",
        },
        {
          order: 3,
          action: "Use Earth911 locator",
          instructions: "Visit Earth911.com to find the nearest specialized facility for this material.",
        },
      ],
      estimatedTime: 120,
      estimatedCost: 0,
      environmentalBenefit: "Ensures proper disposal preventing environmental contamination",
    }
  }

  const primaryFacility = facilities[0]
  const steps = [
    {
      order: 1,
      action: "Prepare waste",
      facility: undefined,
      instructions: `Clean the ${wasteType} and prepare it for recycling. Remove any contaminants or residue.`,
    },
    {
      order: 2,
      action: "Transport to facility",
      facility: primaryFacility,
      instructions: `Take the item to ${primaryFacility.name} (${primaryFacility.distance}km away). Open hours: ${getNextOpenHours(primaryFacility)}`,
    },
    {
      order: 3,
      action: "Drop off at facility",
      facility: primaryFacility,
      instructions: `Follow facility instructions for sorting and placement. Staff is available to assist if needed.`,
    },
  ]

  return {
    steps,
    estimatedTime: Math.round(primaryFacility.distance * 5), // Rough estimate
    estimatedCost: 0,
    environmentalBenefit: `Prevents ${getWastePollutionImpact(wasteType)} and allows material recovery`,
  }
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number }
): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(coord2.lat - coord1.lat)
  const dLng = toRad(coord2.lng - coord1.lng)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * Get next open hours for a facility
 */
function getNextOpenHours(facility: RecyclingFacility): string {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  const today = new Date().getDay()

  for (let i = 0; i < 7; i++) {
    const dayIndex = (today + i) % 7
    const dayName = days[dayIndex] as keyof typeof facility.hours
    const hours = facility.hours[dayName]

    if (hours && hours !== "Closed") {
      return hours
    }
  }

  return "Check website"
}

/**
 * Get pollution impact description for waste type
 */
function getWastePollutionImpact(wasteType: string): string {
  const impacts: Record<string, string> = {
    plastic: "1000+ years of ocean pollution",
    "e-waste": "toxic leaching into groundwater",
    hazardous: "soil contamination and health hazards",
    organic: "methane emissions (28x more potent than CO2)",
    glass: "persistent environmental presence",
    metal: "mining emissions for virgin material",
    general: "unnecessary landfill pressure",
  }

  return impacts[wasteType] || "environmental harm"
}

/**
 * Get facility recommendations based on waste history
 */
export function getFacilityRecommendations(
  wasteHistory: Array<{ category: string; count: number }>,
  userCoords: { lat: number; lng: number }
): RecyclingFacility[] {
  const recommendedFacilities: RecyclingFacility[] = []

  for (const item of wasteHistory) {
    const facilities = findNearbyFacilities(userCoords, item.category, 15)
    recommendedFacilities.push(...facilities)
  }

  // Remove duplicates and sort by rating
  const unique = Array.from(new Map(recommendedFacilities.map((f) => [f.id, f])).values())
  return unique.sort((a, b) => b.rating - a.rating)
}

/**
 * Get facility hours as human-readable text
 */
export function getFacilityHoursText(facility: RecyclingFacility): string {
  const hours = facility.hours
  const lines: string[] = []

  for (const [day, time] of Object.entries(hours)) {
    if (time) {
      lines.push(`${day.charAt(0).toUpperCase() + day.slice(1)}: ${time}`)
    }
  }

  return lines.join("\n")
}

/**
 * Check if facility is currently open
 */
export function isFacilityOpen(facility: RecyclingFacility): boolean {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  const now = new Date()
  const dayName = days[now.getDay()] as keyof typeof facility.hours
  const hours = facility.hours[dayName]

  if (!hours || hours === "Closed") {
    return false
  }

  // Simple check - just verify hours are defined
  return true
}

/**
 * Get facility by ID
 */
export function getFacilityById(id: string): RecyclingFacility | undefined {
  return RECYCLING_FACILITIES.find((f) => f.id === id)
}

/**
 * Add facility to user's favorites (would persist to database)
 */
export function addFacilityToFavorites(facilityId: string): void {
  // This would typically store in database or localStorage
  console.log(`Added facility ${facilityId} to favorites`)
}

/**
 * Get disposal schedule recommendation
 */
export function getDisposalSchedule(
  wasteTypes: string[],
  userCoords: { lat: number; lng: number }
): Array<{
  wasteType: string
  facilities: RecyclingFacility[]
  recommendedFrequency: string
  nextScheduledDate: Date
}> {
  return wasteTypes.map((type) => ({
    wasteType: type,
    facilities: findNearbyFacilities(userCoords, type, 20).slice(0, 3),
    recommendedFrequency: getRecommendedFrequency(type),
    nextScheduledDate: getNextScheduledDate(type),
  }))
}

function getRecommendedFrequency(wasteType: string): string {
  const frequencies: Record<string, string> = {
    organic: "Weekly",
    plastic: "Bi-weekly",
    "e-waste": "Quarterly",
    hazardous: "As needed",
    general: "Weekly",
  }
  return frequencies[wasteType] || "Monthly"
}

function getNextScheduledDate(wasteType: string): Date {
  const now = new Date()
  const daysToAdd = {
    organic: 7,
    plastic: 14,
    "e-waste": 90,
    hazardous: 0,
    general: 7,
  }

  const days = daysToAdd[wasteType as keyof typeof daysToAdd] || 30
  const nextDate = new Date(now)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}
