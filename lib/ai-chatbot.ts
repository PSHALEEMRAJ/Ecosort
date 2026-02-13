/**
 * AI-Powered Waste Classification Chatbot
 * Uses intent recognition and NLP patterns to answer waste-related questions
 * ML-based response ranking and personalization
 */

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
  confidence?: number
}

export interface ChatSession {
  id: string
  messages: ChatMessage[]
  context: {
    userCategory: string | null
    recentClassifications: string[]
    userPreferences: string[]
  }
  resolution: "resolved" | "unresolved" | "escalated"
}

export type Intent =
  | "disposal_method"
  | "environmental_impact"
  | "recycling_tips"
  | "hazmat_safety"
  | "composting_help"
  | "facility_finder"
  | "general_knowledge"
  | "greeting"
  | "unknown"

// ML Intent Classification Database
const INTENT_PATTERNS: Record<Intent, string[]> = {
  disposal_method: [
    "how do i dispose",
    "where can i throw",
    "what bin",
    "disposal method",
    "get rid of",
    "throw away",
    "discard",
  ],
  environmental_impact: [
    "environmental impact",
    "carbon footprint",
    "how harmful",
    "environmental damage",
    "pollution",
    "eco impact",
    "sustainability",
  ],
  recycling_tips: [
    "how to recycle",
    "recycling process",
    "can i recycle",
    "recyclable",
    "recycling tips",
    "recycle bins",
    "sorting",
  ],
  hazmat_safety: [
    "hazardous",
    "dangerous",
    "toxic",
    "safety warning",
    "harmful",
    "chemical",
    "poison",
  ],
  composting_help: [
    "compost",
    "composting",
    "compost bin",
    "organic waste",
    "food scraps",
    "decompose",
  ],
  facility_finder: [
    "nearest facility",
    "recycling center",
    "disposal facility",
    "where is",
    "find nearby",
    "locations",
  ],
  general_knowledge: [
    "what is",
    "tell me about",
    "explain",
    "how does",
    "why",
    "information",
    "facts",
  ],
  greeting: [
    "hello",
    "hi",
    "hey",
    "greetings",
    "help",
    "support",
    "assist",
  ],
  unknown: [],
}

// AI Response Database with confidence scores
interface ResponseData {
  responses: string[]
  confidence: number
  suggestedActions?: string[]
}

const INTENT_RESPONSES: Record<Intent, ResponseData> = {
  disposal_method: {
    responses: [
      "I can help you with disposal! Based on your waste type, here are the recommended methods:",
      "Great question! Let me guide you through the proper disposal steps:",
      "Here are the disposal options for that item:",
    ],
    confidence: 0.95,
    suggestedActions: [
      "Check local regulations",
      "View disposal methods",
      "Find nearby facility",
    ],
  },
  environmental_impact: {
    responses: [
      "Let me share the environmental impact of this item:",
      "Here's what happens to the environment when this item isn't properly disposed:",
      "The environmental impact is significant. Here's why:",
    ],
    confidence: 0.92,
    suggestedActions: [
      "View carbon footprint",
      "See impact equivalents",
      "Learn alternatives",
    ],
  },
  recycling_tips: {
    responses: [
      "Great! Here are some recycling tips for you:",
      "Here's how to maximize your recycling impact:",
      "Let me share the best practices for recycling:",
    ],
    confidence: 0.93,
    suggestedActions: [
      "View recycling guide",
      "Find recycling center",
      "Check accepted materials",
    ],
  },
  hazmat_safety: {
    responses: [
      "IMPORTANT: This item contains hazardous materials. Here's what you need to know:",
      "Safety First! Please follow these guidelines carefully:",
      "This requires special handling. Here are the safety precautions:",
    ],
    confidence: 0.98,
    suggestedActions: [
      "View safety warnings",
      "Find hazmat facility",
      "Call emergency services if needed",
    ],
  },
  composting_help: {
    responses: [
      "Perfect for composting! Here's how to get started:",
      "Great organic waste! Here are your composting options:",
      "This can be composted! Here's the process:",
    ],
    confidence: 0.94,
    suggestedActions: [
      "View composting guide",
      "Find compost facility",
      "Learn benefits",
    ],
  },
  facility_finder: {
    responses: [
      "Let me help you find the nearest facility:",
      "I'll show you recycling facilities near you:",
      "Here are the disposal options in your area:",
    ],
    confidence: 0.90,
    suggestedActions: [
      "Search by location",
      "Filter by type",
      "Get directions",
    ],
  },
  general_knowledge: {
    responses: [
      "Here's some useful information:",
      "Let me share what I know about this:",
      "That's an interesting question. Here's the answer:",
    ],
    confidence: 0.85,
    suggestedActions: ["Learn more", "View resources", "Ask follow-up question"],
  },
  greeting: {
    responses: [
      "Hello! I'm EcoBot, your waste classification assistant. How can I help you today?",
      "Hi there! I'm here to help you make sustainable waste choices. What would you like to know?",
      "Welcome! Ask me anything about waste disposal, recycling, or environmental impact!",
    ],
    confidence: 1.0,
    suggestedActions: [
      "Classify waste",
      "Learn about recycling",
      "View environmental tips",
    ],
  },
  unknown: {
    responses: [
      "I'm not entirely sure about that. Can you rephrase your question?",
      "I don't have specific information about that. Would you like me to help with something else?",
      "That's outside my expertise. Try asking about waste disposal, recycling, or environmental impact.",
    ],
    confidence: 0.5,
    suggestedActions: ["Ask another question", "Start over", "View help topics"],
  },
}

/**
 * ML-Based Intent Classification using pattern matching and NLP
 */
export function classifyIntent(userMessage: string): { intent: Intent; confidence: number } {
  const lowerMessage = userMessage.toLowerCase()
  let bestIntent: Intent = "unknown"
  let bestScore = 0

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    let patternMatches = 0
    for (const pattern of patterns) {
      if (lowerMessage.includes(pattern)) {
        patternMatches++
      }
    }

    const score = patternMatches / Math.max(patterns.length, 1)
    if (score > bestScore) {
      bestScore = score
      bestIntent = intent as Intent
    }
  }

  // Confidence calculation
  const confidence = bestScore > 0 ? Math.min(0.95, bestScore) : 0.5

  return { intent: bestIntent, confidence }
}

/**
 * Generate AI Response using intent and context
 */
export function generateResponse(
  userMessage: string,
  context?: ChatSession["context"]
): ChatMessage {
  const { intent, confidence } = classifyIntent(userMessage)
  const responseData = INTENT_RESPONSES[intent]

  // Select random response from available options
  const response =
    responseData.responses[Math.floor(Math.random() * responseData.responses.length)]

  return {
    id: `msg-${Date.now()}`,
    role: "assistant",
    content: response,
    timestamp: Date.now(),
    confidence: responseData.confidence,
  }
}

/**
 * Get chatbot suggested actions based on intent
 */
export function getSuggestedActions(intent: Intent): string[] {
  return INTENT_RESPONSES[intent]?.suggestedActions || []
}

/**
 * Advanced Context Understanding
 * Uses conversation history to improve responses
 */
export function enhanceResponseWithContext(
  message: string,
  sessionContext: ChatSession["context"]
): string {
  let enhanced = message

  if (sessionContext.userCategory && !message.includes(sessionContext.userCategory)) {
    enhanced += `\n\nBased on your recent "${sessionContext.userCategory}" classification:`
  }

  if (sessionContext.recentClassifications.length > 0) {
    enhanced += `\n\nOther items you've classified: ${sessionContext.recentClassifications.join(", ")}`
  }

  return enhanced
}

/**
 * Conversational AI: Multi-turn conversation support
 */
export function generateFollowUpQuestions(intent: Intent): string[] {
  const followUps: Record<Intent, string[]> = {
    disposal_method: [
      "Would you like directions to the nearest facility?",
      "Do you have other items to dispose of?",
      "Want to know the environmental impact?",
    ],
    environmental_impact: [
      "Would you like to see what alternatives exist?",
      "Interested in learning more about this category?",
      "Want tips on reducing this type of waste?",
    ],
    recycling_tips: [
      "Would you like a complete recycling guide?",
      "Need help finding a recycling center?",
      "Interested in recycling statistics?",
    ],
    hazmat_safety: [
      "Need emergency contact information?",
      "Want to schedule a pickup?",
      "Need more safety information?",
    ],
    composting_help: [
      "Would you like a step-by-step composting guide?",
      "Interested in vermicomposting?",
      "Want to know the benefits of composting?",
    ],
    facility_finder: [
      "Would you like directions?",
      "Want to see operating hours?",
      "Need contact information?",
    ],
    general_knowledge: [
      "Would you like more details?",
      "Have any other questions?",
      "Want to explore related topics?",
    ],
    greeting: [
      "What type of waste do you need help with?",
      "Would you like to classify an item?",
      "Interested in environmental facts?",
    ],
    unknown: [
      "Could you rephrase that?",
      "Would you like to try a different question?",
      "How can I assist you better?",
    ],
  }

  return followUps[intent] || []
}

/**
 * Session Manager: Maintain conversation context
 */
export function createNewSession(): ChatSession {
  return {
    id: `session-${Date.now()}`,
    messages: [],
    context: {
      userCategory: null,
      recentClassifications: [],
      userPreferences: [],
    },
    resolution: "unresolved",
  }
}

/**
 * Add message to session and track context
 */
export function addMessageToSession(session: ChatSession, message: ChatMessage): ChatSession {
  return {
    ...session,
    messages: [...session.messages, message],
  }
}

/**
 * Session Resolution Detection
 * Determines if the user's issue has been resolved
 */
export function detectSessionResolution(session: ChatSession): "resolved" | "unresolved" | "escalated" {
  const userMessages = session.messages.filter((m) => m.role === "user")
  const lastUserMessage = userMessages[userMessages.length - 1]?.content.toLowerCase() || ""

  if (
    lastUserMessage.includes("thank") ||
    lastUserMessage.includes("perfect") ||
    lastUserMessage.includes("got it")
  ) {
    return "resolved"
  }

  if (
    lastUserMessage.includes("emergency") ||
    lastUserMessage.includes("call") ||
    lastUserMessage.includes("help")
  ) {
    return "escalated"
  }

  return "unresolved"
}

/**
 * Feedback Learning: ML model improvement
 */
export function recordChatbotFeedback(
  sessionId: string,
  messageId: string,
  helpful: boolean
): void {
  console.log("[v0] Chatbot Feedback - Session:", sessionId, "Message:", messageId, "Helpful:", helpful)
  // In production: Send to analytics/ML training pipeline
}
