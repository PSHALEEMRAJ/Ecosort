/**
 * Community Features & Social System
 * Enables peer-to-peer knowledge sharing, challenges, and social engagement
 */

export interface CommunityUser {
  id: string
  username: string
  avatar: string
  level: number
  points: number
  totalClassifications: number
  joinedDate: number
  bio?: string
  achievements: string[]
}

export interface CommunityPost {
  id: string
  authorId: string
  author: CommunityUser
  title: string
  content: string
  imageUrl?: string
  category: 'tip' | 'question' | 'achievement' | 'challenge'
  timestamp: number
  likes: number
  comments: Comment[]
  tags: string[]
}

export interface Comment {
  id: string
  authorId: string
  author: CommunityUser
  content: string
  timestamp: number
  likes: number
}

export interface CommunityChallenge {
  id: string
  title: string
  description: string
  goal: number
  metric: 'classifications' | 'carbonSaved' | 'itemsRecycled' | 'streakDays'
  startDate: number
  endDate: number
  participants: string[]
  leaderboard: LeaderboardEntry[]
  rewards: string[]
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  score: number
  achievement: string
}

interface NotificationSettings {
  communityUpdates: boolean
  challengeUpdates: boolean
  friendActivity: boolean
  achievements: boolean
}

class CommunityManager {
  private users: Map<string, CommunityUser>
  private posts: CommunityPost[]
  private challenges: Map<string, CommunityChallenge>
  private userFollowing: Map<string, Set<string>>
  private userNotifications: Map<string, NotificationSettings>
  private currentUserId: string

  constructor() {
    this.users = new Map()
    this.posts = []
    this.challenges = new Map()
    this.userFollowing = new Map()
    this.userNotifications = new Map()
    this.currentUserId = this.getOrCreateUserId()
    this.initializeSampleData()
  }

  private getOrCreateUserId(): string {
    let userId = localStorage.getItem('ecosort_user_id')
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('ecosort_user_id', userId)
    }
    return userId
  }

  private initializeSampleData(): void {
    const sampleUsers: CommunityUser[] = [
      {
        id: this.currentUserId,
        username: 'You',
        avatar: '👤',
        level: 1,
        points: 0,
        totalClassifications: 0,
        joinedDate: Date.now(),
        achievements: [],
      },
      {
        id: 'user_eco_warrior',
        username: 'EcoWarrior',
        avatar: '🌍',
        level: 5,
        points: 2500,
        totalClassifications: 156,
        joinedDate: Date.now() - 90 * 24 * 60 * 60 * 1000,
        bio: 'Passionate about sustainability!',
        achievements: ['Master Classifier', 'Carbon Savior', '100 Classifications'],
      },
      {
        id: 'user_green_thumb',
        username: 'GreenThumb',
        avatar: '🌱',
        level: 3,
        points: 1200,
        totalClassifications: 78,
        joinedDate: Date.now() - 45 * 24 * 60 * 60 * 1000,
        bio: 'Making every day Earth Day',
        achievements: ['Recycling Expert', '50 Classifications'],
      },
    ]

    sampleUsers.forEach(user => {
      this.users.set(user.id, user)
      this.userFollowing.set(user.id, new Set())
      this.userNotifications.set(user.id, {
        communityUpdates: true,
        challengeUpdates: true,
        friendActivity: true,
        achievements: true,
      })
    })

    // Create sample posts
    this.posts = [
      {
        id: 'post_1',
        authorId: 'user_eco_warrior',
        author: this.users.get('user_eco_warrior')!,
        title: 'Amazing Tips for Zero-Waste Living',
        content: 'Here are my top 5 tips for reducing household waste: 1) Use reusable containers 2) Buy in bulk 3) Compost food waste...',
        category: 'tip',
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
        likes: 24,
        comments: [],
        tags: ['zero-waste', 'tips', 'lifestyle'],
      },
      {
        id: 'post_2',
        authorId: 'user_green_thumb',
        author: this.users.get('user_green_thumb')!,
        title: 'Reached 50 Classifications!',
        content: 'Just hit my 50th waste classification! So proud of my sustainability journey 🎉',
        category: 'achievement',
        timestamp: Date.now() - 5 * 60 * 60 * 1000,
        likes: 15,
        comments: [],
        tags: ['achievement', 'milestone'],
      },
    ]

    // Create sample challenges
    const challenge1: CommunityChallenge = {
      id: 'challenge_1',
      title: 'September Recycling Sprint',
      description: 'Classify 50 waste items this month',
      goal: 50,
      metric: 'classifications',
      startDate: Date.now(),
      endDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
      participants: ['user_eco_warrior', 'user_green_thumb', this.currentUserId],
      leaderboard: [
        { rank: 1, userId: 'user_eco_warrior', username: 'EcoWarrior', score: 48, achievement: '🏆' },
        { rank: 2, userId: 'user_green_thumb', username: 'GreenThumb', score: 32, achievement: '🥈' },
        { rank: 3, userId: this.currentUserId, username: 'You', score: 12, achievement: '🥉' },
      ],
      rewards: ['Bronze Recycler Badge', '500 points', 'Feature in newsletter'],
    }

    this.challenges.set(challenge1.id, challenge1)
  }

  createPost(
    title: string,
    content: string,
    category: 'tip' | 'question' | 'achievement' | 'challenge',
    tags: string[] = [],
    imageUrl?: string
  ): CommunityPost {
    const post: CommunityPost = {
      id: `post_${Date.now()}`,
      authorId: this.currentUserId,
      author: this.users.get(this.currentUserId)!,
      title,
      content,
      category,
      timestamp: Date.now(),
      likes: 0,
      comments: [],
      tags,
      ...(imageUrl && { imageUrl }),
    }

    this.posts.push(post)
    return post
  }

  likePost(postId: string): boolean {
    const post = this.posts.find(p => p.id === postId)
    if (post) {
      post.likes++
      return true
    }
    return false
  }

  commentOnPost(postId: string, content: string): Comment | null {
    const post = this.posts.find(p => p.id === postId)
    if (!post) return null

    const comment: Comment = {
      id: `comment_${Date.now()}`,
      authorId: this.currentUserId,
      author: this.users.get(this.currentUserId)!,
      content,
      timestamp: Date.now(),
      likes: 0,
    }

    post.comments.push(comment)
    return comment
  }

  getFeedPosts(limit: number = 10): CommunityPost[] {
    return this.posts
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
  }

  getPostsByCategory(category: string, limit: number = 10): CommunityPost[] {
    return this.posts
      .filter(p => p.category === category)
      .sort((a, b) => b.likes - a.likes)
      .slice(0, limit)
  }

  searchPosts(query: string): CommunityPost[] {
    const q = query.toLowerCase()
    return this.posts.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.tags.some(tag => tag.toLowerCase().includes(q))
    )
  }

  followUser(userId: string): boolean {
    const followers = this.userFollowing.get(this.currentUserId)
    if (followers) {
      followers.add(userId)
      return true
    }
    return false
  }

  getActiveChallenges(): CommunityChallenge[] {
    const now = Date.now()
    return Array.from(this.challenges.values()).filter(c => c.startDate <= now && now < c.endDate)
  }

  participateInChallenge(challengeId: string): boolean {
    const challenge = this.challenges.get(challengeId)
    if (challenge && !challenge.participants.includes(this.currentUserId)) {
      challenge.participants.push(this.currentUserId)
      return true
    }
    return false
  }

  updateChallengeProgress(challengeId: string, progress: number): void {
    const challenge = this.challenges.get(challengeId)
    if (challenge) {
      const entry = challenge.leaderboard.find(e => e.userId === this.currentUserId)
      if (entry) {
        entry.score = progress
        challenge.leaderboard.sort((a, b) => b.score - a.score)
        challenge.leaderboard.forEach((e, i) => {
          e.rank = i + 1
        })
      }
    }
  }

  getLeaderboard(challengeId: string): LeaderboardEntry[] {
    return this.challenges.get(challengeId)?.leaderboard || []
  }

  getUserProfile(userId: string): CommunityUser | null {
    return this.users.get(userId) || null
  }

  updateUserProfile(updates: Partial<CommunityUser>): void {
    const user = this.users.get(this.currentUserId)
    if (user) {
      this.users.set(this.currentUserId, { ...user, ...updates })
    }
  }

  addAchievement(achievement: string): void {
    const user = this.users.get(this.currentUserId)
    if (user && !user.achievements.includes(achievement)) {
      user.achievements.push(achievement)
      user.points += 100
      user.level = Math.floor(user.points / 500) + 1
    }
  }

  getCurrentUserStats(): {
    level: number
    points: number
    rank: number
    achievements: number
  } {
    const user = this.users.get(this.currentUserId)
    if (!user) {
      return { level: 1, points: 0, rank: 0, achievements: 0 }
    }

    const allUsers = Array.from(this.users.values()).sort((a, b) => b.points - a.points)
    const rank = allUsers.findIndex(u => u.id === this.currentUserId) + 1

    return {
      level: user.level,
      points: user.points,
      rank,
      achievements: user.achievements.length,
    }
  }
}

export const communityManager = new CommunityManager()
