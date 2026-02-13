import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import {
  Users,
  TrendingUp,
  Target,
  Award,
  Trophy,
  MessageSquare,
  Heart,
  Share2,
} from "lucide-react"

export const metadata = {
  title: "Community - EcoSort AI",
  description: "Join sustainability champions and track community impact.",
}

export default function CommunityPage() {
  // ---------------- SAMPLE DATA ----------------

  const leaderboard = [
    { rank: 1, name: "Sarah Green", avatar: "🥇", points: 2450 },
    { rank: 2, name: "Mike Eco", avatar: "🥈", points: 2180 },
    { rank: 3, name: "Elena S", avatar: "🥉", points: 1980 },
  ]

  const challenges = [
    {
      id: 1,
      title: "Zero Waste Week",
      description: "Classify 50 items and achieve zero waste",
      participants: 3421,
      progress: 85,
      reward: "Green Badge",
    },
    {
      id: 2,
      title: "Carbon Offset Challenge",
      description: "Save 100kg of CO2 through proper recycling",
      participants: 2856,
      progress: 72,
      reward: "Climate Savior Badge",
    },
    {
      id: 3,
      title: "Community Educator",
      description: "Share 5 sustainability tips",
      participants: 1923,
      progress: 68,
      reward: "Educator Badge",
    },
  ]

  const communityPosts = [
    {
      id: 1,
      author: "Sarah Green",
      avatar: "👩‍🦱",
      category: "tip",
      title: "Best practices for composting",
      content: "Use a 50/50 mix of green and brown waste for better compost.",
      likes: 342,
      comments: 45,
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      author: "Mike Eco",
      avatar: "👨‍💼",
      category: "achievement",
      title: "Reached 1000 classifications!",
      content: "Proud milestone achieved 🎉",
      likes: 287,
      comments: 32,
      timestamp: "4 hours ago",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground">
            Community & Impact
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of sustainability champions making a real difference.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <StatCard icon={<Users />} label="Active Members" value="15,342" />
          <StatCard icon={<TrendingUp />} label="CO2 Saved" value="45.2K kg" />
          <StatCard icon={<Target />} label="Items Classified" value="982K" />
          <StatCard icon={<Award />} label="Active Challenges" value="12" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Leaderboard */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h2 className="font-semibold">Top Contributors</h2>
            </div>

            <div className="space-y-3">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{user.avatar}</span>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        #{user.rank}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{user.points} pts</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Challenges */}
            <div>
              <h2 className="font-semibold mb-4">Active Challenges</h2>
              <div className="space-y-3">
                {challenges.map((c) => (
                  <Card key={c.id} className="p-4">
                    <h3 className="font-semibold">{c.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {c.description}
                    </p>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{c.participants} joined</span>
                        <span>{c.progress}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full">
                        <div
                          className="h-2 bg-primary rounded-full"
                          style={{ width: `${c.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-muted-foreground">
                        Reward: {c.reward}
                      </span>
                      <Button size="sm" variant="outline">
                        Join
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Posts */}
            <div>
              <h2 className="font-semibold mb-4">Community Feed</h2>
              <div className="space-y-3">
                {communityPosts.map((post) => (
                  <Card key={post.id} className="p-5">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl">{post.avatar}</span>
                      <div>
                        <p className="font-medium">{post.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {post.timestamp}
                        </p>
                      </div>
                    </div>

                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {post.content}
                    </p>

                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" /> {post.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" /> Share
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

// ---------------- REUSABLE COMPONENT ----------------

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <Card className="p-6 flex items-center gap-4">
      <div className="rounded-lg bg-primary/20 p-3 text-primary">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </Card>
  )
}
