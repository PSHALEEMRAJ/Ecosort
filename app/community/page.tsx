import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, AlertCircle } from "lucide-react"

export const metadata = {
  title: "Community - EcoSort AI",
  description: "Community features coming soon.",
}

export default function CommunityPage() {
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="text-center">
          <Card className="p-12 border-border">
            <AlertCircle className="h-16 w-16 mx-auto text-amber-500 mb-6" />
            <h1 className="font-heading text-3xl font-bold text-foreground mb-3">
              Community Features Coming Soon
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              We're building amazing community features including leaderboards, challenges, and social impact tracking. 
              Check back soon!
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button variant="default" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/ai-hub">
                <Button variant="outline">
                  Explore AI Features
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  )
}

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
      description: "Share 5 waste disposal tips with the community",
      participants: 1923,
      progress: 68,
      reward: "Educator Badge",
    },
  ]

  // Sample community posts
  const communityPosts = [
    {
      id: 1,
      author: "Sarah Green",
      avatar: "👩‍🦱",
      category: "tip",
      title: "Best practices for composting at home",
      content: "Here's what I've learned about composting over 2 years...",
      likes: 342,
      comments: 45,
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      author: "Mike Eco",
      avatar: "👨‍💼",
      category: "achievement",
      title: "I reached 1000 classifications!",
      content: "So proud to hit this milestone! 🎉",
      likes: 287,
      comments: 32,
      timestamp: "4 hours ago",
    },
    {
      id: 3,
      author: "Elena Sustainability",
      avatar: "👩‍🔬",
      category: "question",
      title: "Best recycling center in downtown area?",
      content: "Looking for recommendations...",
      likes: 156,
      comments: 28,
      timestamp: "6 hours ago",
    },
  ]

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl text-balance">
            Community & Impact
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Join thousands of sustainability champions making a real difference. Track collective impact,
            compete in challenges, and inspire your community to live more sustainably.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/20 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold text-foreground">15,342</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-500/20 p-3">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CO2 Saved</p>
                <p className="text-2xl font-bold text-foreground">45.2K kg</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-500/20 p-3">
                <Target className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Items Classified</p>
                <p className="text-2xl font-bold text-foreground">982K</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-500/20 p-3">
                <Award className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Challenges</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-amber-500" />
                <h2 className="font-heading text-lg font-semibold text-foreground">Top Contributors</h2>
              </div>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div key={entry.rank} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{entry.avatar}</span>
                      <div>
                        <p className="font-medium text-sm text-foreground">{entry.name}</p>
                        <p className="text-xs text-muted-foreground">#{entry.rank}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{entry.points} pts</Badge>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">View Full Leaderboard</Button>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Challenges Section */}
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Active Challenges
              </h2>
              <div className="space-y-3">
                {challenges.map((challenge) => (
                  <Card key={challenge.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                      </div>
                      <Badge>{challenge.participants.toLocaleString()} joined</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{challenge.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs text-muted-foreground">Reward: {challenge.reward}</span>
                        <Button size="sm" variant="outline">Join Challenge</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Community Posts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Community Feed
                </h2>
                <Button size="sm">Share Something</Button>
              </div>
              <div className="space-y-3">
                {communityPosts.map((post) => (
                  <Card key={post.id} className="p-5 hover:border-primary transition-colors">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">{post.avatar}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">{post.author}</p>
                          <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{post.content}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <Heart className="h-4 w-4" /> {post.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <MessageSquare className="h-4 w-4" /> {post.comments}
                      </button>
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <Share2 className="h-4 w-4" /> Share
                      </button>
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
