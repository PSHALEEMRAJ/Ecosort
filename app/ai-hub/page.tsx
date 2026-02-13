"use client"

import React, { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Brain,
  BookOpen,
  MessageSquare,
  MapPin,
  Target,
  Zap,
  ArrowLeft,
  Send,
  Loader2,
} from "lucide-react"

type FeatureView = "overview" | "chatbot" | "learning" | "facilities" | "goals" | "analytics" | "calculator"

export default function AIHubPage() {
  const [currentView, setCurrentView] = useState<FeatureView>("overview")
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([
    { role: "assistant", content: "Hi! I'm EcoBot. Ask me anything about waste disposal, recycling, composting, or environmental impact!" }
  ])
  const [chatInput, setChatInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // AI Chatbot - Intent-based responses
  const generateChatbotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes("how") && (input.includes("dispose") || input.includes("throw"))) {
      return "For most items, check your local waste guidelines. Recyclables go in the blue bin, organics in green, and general waste in black. For hazardous items like batteries or electronics, find a local e-waste facility."
    }
    if (input.includes("recycle") || input.includes("recyclable")) {
      return "Most plastics (#1-7), paper, cardboard, glass, and metals are recyclable. Avoid contamination by rinsing containers. Check Earth911.com to find nearby recycling centers."
    }
    if (input.includes("compost")) {
      return "Start composting by collecting food scraps and yard waste. Maintain a 50:50 ratio of brown (dry) and green (wet) materials. Add water and turn weekly for 2-3 months of decomposition."
    }
    if (input.includes("carbon") || input.includes("environmental")) {
      return "By recycling one aluminum can, you save enough energy to power a laptop for 3 hours. Composting diverts methane-producing waste from landfills. Every action counts!"
    }
    if (input.includes("hazard") || input.includes("danger") || input.includes("toxic")) {
      return "Hazardous waste includes batteries, paint, chemicals, and e-waste. Never dispose in regular trash. Contact your local hazmat facility for proper disposal options."
    }
    
    return "I can help with waste disposal, recycling, composting, environmental impact, and more! What would you like to know?"
  }

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return
    
    setIsProcessing(true)
    const userMessage = chatInput
    setChatInput("")
    
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }])
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const response = generateChatbotResponse(userMessage)
    setChatMessages(prev => [...prev, { role: "assistant", content: response }])
    setIsProcessing(false)
  }

  // Learning modules
  const learningModules = [
    { id: 1, title: "Plastic Crisis", difficulty: "Beginner", progress: 100, completed: true },
    { id: 2, title: "Composting 101", difficulty: "Beginner", progress: 65, completed: false },
    { id: 3, title: "E-Waste Management", difficulty: "Intermediate", progress: 30, completed: false },
  ]

  // Facilities data
  const facilities = [
    { name: "Downtown Recycling Center", distance: "0.5 km", rating: 4.8, type: "Mixed Recycling" },
    { name: "Green Organics Compost", distance: "1.2 km", rating: 4.6, type: "Composting" },
    { name: "E-Waste Solutions", distance: "2.3 km", rating: 4.9, type: "Electronic Waste" },
  ]

  // Goals data
  const goals = [
    { title: "Achieve 70% Recycling Rate", current: 45, target: 70, timeframe: "This Month" },
    { title: "Save 100kg CO2", current: 62, target: 100, timeframe: "This Quarter" },
  ]

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Header */}
        {currentView !== "overview" && (
          <div className="border-b border-border bg-card p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView("overview")}
              className="gap-2 mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Overview
            </Button>
          </div>
        )}

        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Overview */}
          {currentView === "overview" && (
            <>
              <div className="mb-12 text-center">
                <h1 className="font-heading text-4xl font-bold text-foreground">AI Intelligence Hub</h1>
                <p className="mt-3 text-lg text-muted-foreground">
                  Explore AI-powered features for better waste management
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="p-6 cursor-pointer hover:border-primary transition-colors" onClick={() => setCurrentView("chatbot")}>
                  <MessageSquare className="h-6 w-6 text-purple-500 mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">EcoBot Chatbot</h3>
                  <p className="text-sm text-muted-foreground mb-4">Ask AI anything about waste, recycling, or sustainability</p>
                  <Button size="sm" className="w-full">Chat Now</Button>
                </Card>

                <Card className="p-6 cursor-pointer hover:border-primary transition-colors" onClick={() => setCurrentView("learning")}>
                  <BookOpen className="h-6 w-6 text-blue-500 mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Learning Paths</h3>
                  <p className="text-sm text-muted-foreground mb-4">AI-curated education on waste management</p>
                  <Button size="sm" className="w-full">Start Learning</Button>
                </Card>

                <Card className="p-6 cursor-pointer hover:border-primary transition-colors" onClick={() => setCurrentView("facilities")}>
                  <MapPin className="h-6 w-6 text-green-500 mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Find Facilities</h3>
                  <p className="text-sm text-muted-foreground mb-4">Locate nearby disposal and recycling facilities</p>
                  <Button size="sm" className="w-full">Find Nearest</Button>
                </Card>

                <Card className="p-6 cursor-pointer hover:border-primary transition-colors" onClick={() => setCurrentView("goals")}>
                  <Target className="h-6 w-6 text-amber-500 mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Set Goals</h3>
                  <p className="text-sm text-muted-foreground mb-4">AI recommends sustainable goals for you</p>
                  <Button size="sm" className="w-full">Set Goals</Button>
                </Card>

                <Card className="p-6 cursor-pointer hover:border-primary transition-colors" onClick={() => setCurrentView("analytics")}>
                  <Zap className="h-6 w-6 text-cyan-500 mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Analytics</h3>
                  <p className="text-sm text-muted-foreground mb-4">ML-driven insights into your waste patterns</p>
                  <Button size="sm" className="w-full">View Analytics</Button>
                </Card>

                <Card className="p-6 cursor-pointer hover:border-primary transition-colors" onClick={() => setCurrentView("calculator")}>
                  <Brain className="h-6 w-6 text-red-500 mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Impact Calculator</h3>
                  <p className="text-sm text-muted-foreground mb-4">Calculate your environmental impact</p>
                  <Button size="sm" className="w-full">Calculate</Button>
                </Card>
              </div>
            </>
          )}

          {/* Chatbot View */}
          {currentView === "chatbot" && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">EcoBot - AI Waste Assistant</h2>
              <Card className="p-6 h-96 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.role === "user" ? "bg-primary text-white" : "bg-secondary text-foreground"}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isProcessing && <div className="flex gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /></div>}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleChatSubmit()}
                    placeholder="Ask about waste disposal..."
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    disabled={isProcessing}
                  />
                  <Button onClick={handleChatSubmit} disabled={isProcessing} size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Learning View */}
          {currentView === "learning" && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">AI-Personalized Learning Paths</h2>
              <div className="space-y-3">
                {learningModules.map((module) => (
                  <Card key={module.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{module.title}</h3>
                        <p className="text-sm text-muted-foreground">{module.difficulty}</p>
                      </div>
                      {module.completed && <span className="text-green-500 text-sm">✓ Completed</span>}
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2"><div className="bg-primary h-2 rounded-full" style={{width: `${module.progress}%`}} /></div>
                    <p className="text-xs text-muted-foreground mt-2">{module.progress}% Complete</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Facilities View */}
          {currentView === "facilities" && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">Nearby Disposal Facilities</h2>
              <div className="space-y-3">
                {facilities.map((facility, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{facility.name}</h3>
                      <span className="text-sm text-amber-500">★ {facility.rating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{facility.type} • {facility.distance} away</p>
                    <Button size="sm" className="mt-3">Get Directions</Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Goals View */}
          {currentView === "goals" && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Sustainability Goals</h2>
              <div className="space-y-3">
                {goals.map((goal, i) => (
                  <Card key={i} className="p-4">
                    <h3 className="font-semibold text-foreground mb-2">{goal.title}</h3>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">{goal.current}/{goal.target}</span>
                      <span className="text-muted-foreground">{goal.timeframe}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2"><div className="bg-primary h-2 rounded-full" style={{width: `${(goal.current/goal.target)*100}%`}} /></div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Analytics View */}
          {currentView === "analytics" && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Analytics & Insights</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Recycling Rate</p>
                  <p className="text-3xl font-bold text-primary">68%</p>
                  <p className="text-xs text-green-500 mt-1">↑ 12% this month</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Items Classified</p>
                  <p className="text-3xl font-bold text-primary">487</p>
                  <p className="text-xs text-green-500 mt-1">Your rank: #542</p>
                </Card>
              </div>
            </div>
          )}

          {/* Calculator View */}
          {currentView === "calculator" && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Environmental Impact</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="p-6 bg-green-500/10 border-green-500/20">
                  <p className="text-sm text-muted-foreground">CO2 Saved This Month</p>
                  <p className="text-3xl font-bold text-green-500">23.4 kg</p>
                  <p className="text-xs text-muted-foreground mt-2">≈ Driving 58 miles</p>
                </Card>
                <Card className="p-6 bg-blue-500/10 border-blue-500/20">
                  <p className="text-sm text-muted-foreground">Waste Diverted</p>
                  <p className="text-3xl font-bold text-blue-500">142 lbs</p>
                  <p className="text-xs text-muted-foreground mt-2">From landfills</p>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
              <Card className="p-6 h-96 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.role === "user" ? "bg-primary text-white" : "bg-secondary text-foreground"}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isProcessing && <div className="flex gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /></div>}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleChatSubmit()}
                    placeholder="Ask about waste disposal..."
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    disabled={isProcessing}
                  />
                  <Button onClick={handleChatSubmit} disabled={isProcessing} size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Learning View */}
          {currentView === "learning" && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">AI-Personalized Learning Paths</h2>
              <div className="space-y-3">
                {learningModules.map((module) => (
                  <Card key={module.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{module.title}</h3>
                        <p className="text-sm text-muted-foreground">{module.difficulty}</p>
                      </div>
                      {module.completed && <span className="text-green-500 text-sm">✓ Completed</span>}
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2"><div className="bg-primary h-2 rounded-full" style={{width: `${module.progress}%`}} /></div>
                    <p className="text-xs text-muted-foreground mt-2">{module.progress}% Complete</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Facilities View */}
          {currentView === "facilities" && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">Nearby Disposal Facilities</h2>
              <div className="space-y-3">
                {facilities.map((facility, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{facility.name}</h3>
                      <span className="text-sm text-amber-500">★ {facility.rating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{facility.type} • {facility.distance} away</p>
                    <Button size="sm" className="mt-3">Get Directions</Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Goals View */}
          {currentView === "goals" && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Sustainability Goals</h2>
              <div className="space-y-3">
                {goals.map((goal, i) => (
                  <Card key={i} className="p-4">
                    <h3 className="font-semibold text-foreground mb-2">{goal.title}</h3>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">{goal.current}/{goal.target}</span>
                      <span className="text-muted-foreground">{goal.timeframe}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2"><div className="bg-primary h-2 rounded-full" style={{width: `${(goal.current/goal.target)*100}%`}} /></div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Analytics View */}
          {currentView === "analytics" && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Analytics & Insights</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Recycling Rate</p>
                  <p className="text-3xl font-bold text-primary">68%</p>
                  <p className="text-xs text-green-500 mt-1">↑ 12% this month</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Items Classified</p>
                  <p className="text-3xl font-bold text-primary">487</p>
                  <p className="text-xs text-green-500 mt-1">Your rank: #542</p>
                </Card>
              </div>
            </div>
          )}

          {/* Calculator View */}
          {currentView === "calculator" && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Environmental Impact</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="p-6 bg-green-500/10 border-green-500/20">
                  <p className="text-sm text-muted-foreground">CO2 Saved This Month</p>
                  <p className="text-3xl font-bold text-green-500">23.4 kg</p>
                  <p className="text-xs text-muted-foreground mt-2">≈ Driving 58 miles</p>
                </Card>
                <Card className="p-6 bg-blue-500/10 border-blue-500/20">
                  <p className="text-sm text-muted-foreground">Waste Diverted</p>
                  <p className="text-3xl font-bold text-blue-500">142 lbs</p>
                  <p className="text-xs text-muted-foreground mt-2">From landfills</p>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}

    {
      icon: BookOpen,
      color: "blue",
      title: "Personalized Learning",
      description: "AI-generated learning paths customized to your waste classification history",
      features: [
        "Dynamic module recommendations",
        "Interactive quizzes",
        "Achievement badges",
      ],
      buttonText: "Start Learning",
      action: () => router.push("/learning-path"),
    },
    {
      icon: MessageSquare,
      color: "purple",
      title: "EcoBot Chatbot",
      description: "AI assistant for instant answers about waste disposal and sustainability",
      features: [
        "Intent recognition",
        "Context-aware responses",
        "Multi-turn conversations",
      ],
      buttonText: "Chat Now",
      action: () => router.push("/ecobot"),
    },
    {
      icon: MapPin,
      color: "green",
      title: "Smart Facility Finder",
      description: "ML-powered recommendations for nearby disposal facilities",
      features: [
        "Location optimization",
        "Rating & reviews",
        "Scheduling assistance",
      ],
      buttonText: "Find Facilities",
      action: () => router.push("/facility-finder"),
    },
    {
      icon: Target,
      color: "amber",
      title: "Sustainability Goals",
      description: "AI-recommended goals with progress tracking and gamification",
      features: [
        "Personalized recommendations",
        "Weekly reports",
        "Leaderboards",
      ],
      buttonText: "Set Goals",
      action: () => router.push("/goals"),
    },
    {
      icon: Zap,
      color: "cyan",
      title: "Analytics & Insights",
      description: "ML-driven analysis of your waste patterns and environmental impact",
      features: [
        "Behavior analysis",
        "Predictive trends",
        "Community benchmarks",
      ],
      buttonText: "View Analytics",
      action: () => router.push("/analytics"),
    },
    {
      icon: Brain,
      color: "red",
      title: "Environmental Calculator",
      description: "Detailed impact metrics including carbon footprint and decomposition time",
      features: [
        "Carbon calculations",
        "LCA data",
        "Equivalents",
      ],
      buttonText: "Calculate Impact",
      action: () => router.push("/impact-calculator"),
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <section className="border-b border-border bg-gradient-to-br from-card to-secondary/30 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/20 p-3">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                AI Intelligence Hub
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Personalized insights and recommendations powered by machine learning
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* AI Insights */}
          <div>
            <AIInsightsDashboard />
          </div>

          {/* Feature Sections */}
          <div className="space-y-8">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Explore AI-Powered Features
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon
                const colorClasses = {
                  blue: "bg-blue-500/10 text-blue-500",
                  purple: "bg-purple-500/10 text-purple-500",
                  green: "bg-green-500/10 text-green-500",
                  amber: "bg-amber-500/10 text-amber-500",
                  cyan: "bg-cyan-500/10 text-cyan-500",
                  red: "bg-red-500/10 text-red-500",
                }
                const bulletColor = {
                  blue: "text-blue-500",
                  purple: "text-purple-500",
                  green: "text-green-500",
                  amber: "text-amber-500",
                  cyan: "text-cyan-500",
                  red: "text-red-500",
                }

                return (
                  <Card
                    key={index}
                    className="group border-border p-6 transition-all hover:border-primary hover:shadow-lg"
                  >
                    <div className={`mb-4 rounded-lg ${colorClasses[feature.color as keyof typeof colorClasses]} p-3 w-fit`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {feature.features.map((feat, i) => (
                        <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                          <span className={bulletColor[feature.color as keyof typeof bulletColor]}>•</span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="mt-4 w-full" 
                      size="sm"
                      onClick={feature.action}
                    >
                      {feature.buttonText}
                    </Button>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Statistics Section */}
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-8">
            <h3 className="font-heading text-xl font-semibold text-foreground">
              AI Impact by the Numbers
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-3xl font-bold text-primary">98%</p>
                <p className="mt-1 text-sm text-muted-foreground">Classification Accuracy</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">45+</p>
                <p className="mt-1 text-sm text-muted-foreground">Supported Categories</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">1M+</p>
                <p className="mt-1 text-sm text-muted-foreground">Items Classified</p>
              </div>
            </div>
          </Card>

          {/* Navigation Footer */}
          <div className="flex gap-3 pt-6">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button 
              onClick={() => router.push("/dashboard")}
              className="gap-2"
            >
              View Dashboard
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
