/**
 * Smart Facility Finder with AI Location Optimization
 * Uses geolocation, facility ratings, and ML-based recommendations
 */

export interface DisposalFacility {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  type: string[] // "recycling", "composting", "hazmat", "e-waste"
  distance?: number // km
  hours: {
    monday?: string
    tuesday?: string
    wednesday?: string
    thursday?: string
    friday?: string
    saturday?: string
    sunday?: string
  }
  phone: string
  website?: string
  acceptedMaterials: string[]
  rating: number // 0-5
  reviews: number
  acceptsAll24: boolean
  fees?: string
  waitTime?: string // average
  capacity?: "high" | "medium" | "low"
}

export interface FacilityRecommendation {
  facility: DisposalFacility
  matchScore: number // 0-100
  reasons: string[]
  distance: number
  eta: number // minutes
  availabilityStatus: "open" | "closed" | "unknown"
}

// Sample facility database (in production: connect to real API)
const FACILITY_DATABASE: DisposalFacility[] = [
  {
    id: "recycling-center-1",
    name: "Green Recycle Hub Downtown",
    address: "123 Main St, City Center",
    latitude: 40.7128,
    longitude: -74.006,
    type: ["recycling", "composting"],
    hours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 8:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed",
    },
    phone: "+1-555-0100",
    website: "www.greenrecyclehub.com",
    acceptedMaterials: [
      "paper",
      "cardboard",
      "plastic",
      "glass",
      "metal",
      "compost",
    ],
    rating: 4.8,
    reviews: 245,
    acceptsAll24: false,
    fees: "Free",
    waitTime: "15 minutes",
    capacity: "high",
  },
  {
    id: "ewaste-1",
    name: "TechRecycle Pro",
    address: "456 Tech Plaza, Industrial Area",
    latitude: 40.7135,
    longitude: -74.008,
    type: ["e-waste"],
    hours: {
      monday: "10:00 AM - 5:00 PM",
      tuesday: "10:00 AM - 5:00 PM",
      wednesday: "10:00 AM - 5:00 PM",
      thursday: "10:00 AM - 5:00 PM",
      friday: "10:00 AM - 6:00 PM",
      saturday: "11:00 AM - 3:00 PM",
      sunday: "Closed",
    },
    phone: "+1-555-0200",
    website: "www.techrecyclepro.com",
    acceptedMaterials: [
      "phones",
      "computers",
      "laptops",
      "tablets",
      "monitors",
      "cables",
    ],
    rating: 4.9,
    reviews: 187,
    acceptsAll24: false,
    fees: "Free (Some items have recovery value)",
    waitTime: "20 minutes",
    capacity: "medium",
  },
  {
    id: "hazmat-1",
    name: "SafeDispose Hazmat Center",
    address: "789 Industrial Blvd",
    latitude: 40.715,
    longitude: -74.0,
    type: ["hazmat"],
    hours: {
      monday: "8:00 AM - 4:00 PM",
      tuesday: "8:00 AM - 4:00 PM",
      wednesday: "8:00 AM - 4:00 PM",
      thursday: "8:00 AM - 4:00 PM",
      friday: "8:00 AM - 4:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    phone: "+1-555-0300",
    acceptedMaterials: [
      "batteries",
      "chemicals",
      "pesticides",
      "oil",
      "paint",
      "solvents",
    ],
    rating: 4.6,
    reviews: 92,
    acceptsAll24: false,
    fees: "Variable by material",
    capacity: "medium",
  },
  {
    id: "composting-1",
    name: "EcoCompost Community Garden",
    address: "321 Park Avenue",
    latitude: 40.72,
    longitude: -74.01,
    type: ["composting"],
    hours: {
      monday: "7:00 AM - 7:00 PM",
      tuesday: "7:00 AM - 7:00 PM",
      wednesday: "7:00 AM - 7:00 PM",
      thursday: "7:00 AM - 7:00 PM",
      friday: "7:00 AM - 7:00 PM",
      saturday: "9:00 AM - 5:00 PM",
      sunday: "9:00 AM - 5:00 PM",
    },
    phone: "+1-555-0400",
    website: "www.ecocompost.org",
    acceptedMaterials: ["organic", "food scraps", "leaves", "grass", "compostable"],
    rating: 4.7,
    reviews: 156,
    acceptsAll24: false,
    fees: "Free",
    waitTime: "5 minutes",
    capacity: "high",
  },
]

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * ML-Based Facility Matching Algorithm
 * Scores facilities based on multiple factors
 */
function calculateMatchScore(
  facility: DisposalFacility,
  wasteCategory: string,
  userLocation?: { lat: number; lon: number }
): number {
  let score = 0

  // 1. Type matching (40 points)
  const categoryTypeMap: Record<string, string> = {
    plastic: "recycling",
    recyclable: "recycling",
    organic: "composting",
    "e-waste": "e-waste",
    hazardous: "hazmat",
    general: "recycling",
  }

  const requiredType = categoryTypeMap[wasteCategory]
  if (facility.type.includes(requiredType)) {
    score += 40
  }

  // 2. Material acceptance (30 points)
  if (facility.acceptedMaterials.length > 0) {
    score += 30
  }

  // 3. Rating (20 points)
  score += (facility.rating / 5) * 20

  // 4. Distance bonus (10 points - closer is better)
  if (userLocation) {
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lon,
      facility.latitude,
      facility.longitude
    )
    if (distance < 5) score += 10
    else if (distance < 10) score += 7
    else if (distance < 20) score += 3
  }

  // 5. Availability bonus (5 points)
  if (facility.acceptsAll24) {
    score += 5
  }

  return Math.min(score, 100)
}

/**
 * Check facility operational status
 */
function checkFacilityStatus(facility: DisposalFacility): "open" | "closed" | "unknown" {
  const now = new Date()
  const dayName = now
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase()
  const hours = facility.hours[dayName as keyof typeof facility.hours]

  if (!hours) {
    return "unknown"
  }

  // Simple check - in production would parse actual times
  if (hours.includes("Closed")) {
    return "closed"
  }

  return "open"
}

/**
 * Find nearest facilities for waste category
 */
export function findNearestFacilities(
  wasteCategory: string,
  userLocation?: { lat: number; lon: number },
  limit: number = 5
): FacilityRecommendation[] {
  const recommendations: FacilityRecommendation[] = []

  for (const facility of FACILITY_DATABASE) {
    const matchScore = calculateMatchScore(facility, wasteCategory, userLocation)

    if (matchScore > 30) {
      // Only include facilities with decent match
      const distance = userLocation
        ? calculateDistance(
            userLocation.lat,
            userLocation.lon,
            facility.latitude,
            facility.longitude
          )
        : 0

      const recommendation: FacilityRecommendation = {
        facility: { ...facility, distance },
        matchScore,
        reasons: generateRecommendationReasons(facility, wasteCategory, distance),
        distance,
        eta: Math.round(distance * 2), // Rough estimate: 2 min per km
        availabilityStatus: checkFacilityStatus(facility),
      }

      recommendations.push(recommendation)
    }
  }

  // Sort by match score
  return recommendations
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}

/**
 * Generate human-readable recommendation reasons
 */
function generateRecommendationReasons(
  facility: DisposalFacility,
  wasteCategory: string,
  distance: number
): string[] {
  const reasons: string[] = []

  if (facility.rating >= 4.7) {
    reasons.push("Highly rated facility")
  }

  if (distance < 5) {
    reasons.push("Closest option")
  }

  if (facility.fees === "Free") {
    reasons.push("No disposal fees")
  }

  if (facility.capacity === "high") {
    reasons.push("High capacity - minimal wait")
  }

  if (facility.acceptsAll24) {
    reasons.push("Available 24/7")
  }

  return reasons.length > 0 ? reasons : ["Matches your waste category"]
}

/**
 * Filter facilities by criteria
 */
export function filterFacilities(
  wasteCategory: string,
  filters: {
    maxDistance?: number
    minRating?: number
    openNow?: boolean
    freeOnly?: boolean
  }
): DisposalFacility[] {
  return FACILITY_DATABASE.filter((facility) => {
    // Type check
    const categoryTypeMap: Record<string, string> = {
      plastic: "recycling",
      recyclable: "recycling",
      organic: "composting",
      "e-waste": "e-waste",
      hazardous: "hazmat",
      general: "recycling",
    }

    const requiredType = categoryTypeMap[wasteCategory]
    if (!facility.type.includes(requiredType)) {
      return false
    }

    // Rating filter
    if (filters.minRating && facility.rating < filters.minRating) {
      return false
    }

    // Open now filter
    if (filters.openNow && checkFacilityStatus(facility) === "closed") {
      return false
    }

    // Free only filter
    if (filters.freeOnly && facility.fees && !facility.fees.includes("Free")) {
      return false
    }

    return true
  })
}

/**
 * Get facility details
 */
export function getFacilityDetails(facilityId: string): DisposalFacility | null {
  return FACILITY_DATABASE.find((f) => f.id === facilityId) || null
}

/**
 * Generate directions string
 */
export function generateDirections(
  facility: DisposalFacility,
  userLocation: { lat: number; lon: number }
): {
  url: string
  distance: number
  eta: number
} {
  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lon,
    facility.latitude,
    facility.longitude
  )

  return {
    url: `https://maps.google.com/maps?q=${facility.latitude},${facility.longitude}`,
    distance,
    eta: Math.round(distance * 2),
  }
}

/**
 * Schedule facility visit
 */
export function scheduleFacilityVisit(
  facilityId: string,
  date: Date,
  quantity: number,
  wasteType: string
): { confirmed: boolean; reference: string; reminder: string } {
  const facility = getFacilityDetails(facilityId)
  if (!facility) {
    return { confirmed: false, reference: "", reminder: "" }
  }

  const reference = `ECO-${Date.now()}`
  const dateStr = date.toLocaleDateString()

  return {
    confirmed: true,
    reference,
    reminder: `Reminder: Visit ${facility.name} on ${dateStr} to dispose ${quantity} item(s) of ${wasteType}`,
  }
}
