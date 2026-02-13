"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

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

type ViewType =
  | "overview"
  | "chatbot"
  | "learning"
  | "facilities"
  | "goals"
  | "analytics"
  | "calculator"

export default function AIHubPage() {
  const router = useRouter()

  const [view, setView] = useState<ViewType>("overview")
  const [chatInput, setChatInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "Hi! I'm EcoBot 🌱 Ask me about recycling, composting or waste disposal.",
    },
  ])

  // ---------------- CHATBOT LOGIC ----------------
  const getResponse = (input: string) => {
    const text = input.toLowerCase()

    if (text.includes("recycle"))
      return "Most plastics (#1-7), paper, glass, and metals are recyclable. Rinse before disposal."

    if (text.includes("battery"))
      return "Batteries are hazardous waste. Please take them to an authorized e-waste center."

    if (text.includes("compost"))
      return "Organic waste like food scraps and vegetable peels can be composted in a green bin."

    if (text.includes("plastic"))
      return "Avoid single-use plastics. Reuse or recycle responsibly."

    return "I can help with recycling, composting, hazardous waste and sustainability tips!"
  }

  const handleSend = async () => {
    if (!chatInput.trim()) return

    const userMsg = chatInput
    setChatInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMsg }])
    setLoading(true)

    await new Promise((r) => setTimeout(r, 700))

    const reply = getResponse(userMsg)
    setMessages((prev) => [...prev, { role: "assistant", content: reply }])
    setLoading(false)
  }

  // ---------------- DATA ----------------
  const learningModules = [
    { title: "Plastic Crisis", progress: 100 },
    { title: "Composting 101", progress: 65 },
    { title: "E-Waste Management", progress: 30 },
  ]

  const facilities = [
    { name: "Downtown Recycling Center", rating: 4.8, distance: "0.5 km" },
    { name: "Green Compost Hub", rating: 4.6, distance: "1.2 km" },
    { name: "E-Waste Solutions", rating: 4.9, distance: "2.3 km" },
  ]

  const goals = [
    { title: "Reach 70% Recycling Rate", current: 45, target: 70 },
    { title: "Save 100kg CO2", current: 62, target: 100 },
  ]

  // ---------------- COMPONENTS ----------------

  const Overview = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <FeatureCard icon={<MessageSquare />} title="EcoBot" onClick={() => setView("chatbot")} />
      <FeatureCard icon={<BookOpen />} title="Learning" onClick={() => setView("learning")} />
      <FeatureCard icon={<MapPin />} title="Facilities" onClick={() => setView("facilities")} />
      <FeatureCard icon={<Target />} title="Goals" onClick={() => setView("goals")} />
      <FeatureCard icon={<Zap />} title="Analytics" onClick={() => setView("analytics")} />
      <FeatureCard icon={<Brain />} title="Impact Calculator" onClick={() => setView("calculator")} />
    </div>
  )

  const Chatbot = () => (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6 h-[450px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${msg.role === "user" ? "bg-primary text-white" : "bg-secondary"
                  }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <Loader2 className="animate-spin" />}
        </div>

        <div className="flex gap-2 mt-4">
          <input
            className="flex-1 border rounded px-3 py-2 bg-background"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask something..."
          />
          <Button size="sm" onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  )

  const Learning = () => (
    <div className="space-y-4 max-w-2xl mx-auto">
      {learningModules.map((module, i) => (
        <Card key={i} className="p-4">
          <h3 className="font-semibold">{module.title}</h3>
          <div className="w-full bg-secondary h-2 rounded-full mt-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${module.progress}%` }}
            />
          </div>
          <p className="text-xs mt-1">{module.progress}% complete</p>
        </Card>
      ))}
    </div>
  )

  const Facilities = () => (
    <div className="space-y-4 max-w-2xl mx-auto">
      {facilities.map((f, i) => (
        <Card key={i} className="p-4">
          <h3 className="font-semibold">{f.name}</h3>
          <p className="text-sm text-muted-foreground">
            ⭐ {f.rating} • {f.distance}
          </p>
        </Card>
      ))}
    </div>
  )

  const Goals = () => (
    <div className="space-y-4 max-w-2xl mx-auto">
      {goals.map((g, i) => (
        <Card key={i} className="p-4">
          <h3 className="font-semibold">{g.title}</h3>
          <div className="w-full bg-secondary h-2 rounded-full mt-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${(g.current / g.target) * 100}%` }}
            />
          </div>
          <p className="text-xs mt-1">
            {g.current}/{g.target}
          </p>
        </Card>
      ))}
    </div>
  )

  const Analytics = () => (
    <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
      <Card className="p-6">
        <p className="text-sm">Recycling Rate</p>
        <p className="text-3xl font-bold text-primary">68%</p>
      </Card>
      <Card className="p-6">
        <p className="text-sm">Items Classified</p>
        <p className="text-3xl font-bold text-primary">487</p>
      </Card>
    </div>
  )

  const Calculator = () => (
    <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
      <Card className="p-6">
        <p>CO2 Saved</p>
        <p className="text-3xl font-bold text-green-500">23.4 kg</p>
      </Card>
      <Card className="p-6">
        <p>Waste Diverted</p>
        <p className="text-3xl font-bold text-blue-500">142 lbs</p>
      </Card>
    </div>
  )

  const FeatureCard = ({
    icon,
    title,
    onClick,
  }: {
    icon: React.ReactNode
    title: string
    onClick: () => void
  }) => (
    <Card onClick={onClick} className="p-6 cursor-pointer hover:border-primary transition">
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <Button size="sm" className="mt-4 w-full">
        Open
      </Button>
    </Card>
  )

  // ---------------- MAIN RETURN ----------------

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 max-w-6xl mx-auto px-4 py-8">
        {view !== "overview" && (
          <Button variant="ghost" onClick={() => setView("overview")} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}

        {view === "overview" && <Overview />}
        {view === "chatbot" && <Chatbot />}
        {view === "learning" && <Learning />}
        {view === "facilities" && <Facilities />}
        {view === "goals" && <Goals />}
        {view === "analytics" && <Analytics />}
        {view === "calculator" && <Calculator />}
      </div>

      <Footer />
    </main>
  )
}
