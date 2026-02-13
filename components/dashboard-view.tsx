"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BarChart3,
  Recycle,
  Target,
  TrendingUp,
  Trash2,
  Award,
  Clock,
  Scan,
  RefreshCw,
  Leaf,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { cn } from "@/lib/utils"
import { getClassificationStats, clearClassifications } from "@/lib/classification-store"
import { CATEGORY_CONFIG, type WasteCategory } from "@/lib/waste-classifier"

const PIE_COLORS = [
  "hsl(217, 91%, 60%)",  // recyclable - blue
  "hsl(142, 71%, 45%)",  // organic - green
  "hsl(38, 92%, 50%)",   // e-waste - amber
  "hsl(187, 92%, 50%)",  // plastic - cyan
  "hsl(0, 72%, 51%)",    // hazardous - red
  "hsl(0, 0%, 55%)",     // general - neutral
]

const CATEGORY_ORDER: WasteCategory[] = [
  "recyclable",
  "organic",
  "e-waste",
  "plastic",
  "hazardous",
  "general",
]

// Gamification achievements
function getAchievements(totalClassifications: number, recyclableCount: number) {
  return [
    {
      name: "First Scan",
      description: "Classify your first waste item",
      unlocked: totalClassifications >= 1,
      threshold: 1,
      current: totalClassifications,
    },
    {
      name: "Eco Starter",
      description: "Classify 5 waste items",
      unlocked: totalClassifications >= 5,
      threshold: 5,
      current: totalClassifications,
    },
    {
      name: "Green Champion",
      description: "Classify 20 waste items",
      unlocked: totalClassifications >= 20,
      threshold: 20,
      current: totalClassifications,
    },
    {
      name: "Recycling Hero",
      description: "Find 10 recyclable items",
      unlocked: recyclableCount >= 10,
      threshold: 10,
      current: recyclableCount,
    },
    {
      name: "Waste Expert",
      description: "Classify 50 waste items",
      unlocked: totalClassifications >= 50,
      threshold: 50,
      current: totalClassifications,
    },
  ]
}

export function DashboardView() {
  const [stats, setStats] = useState<ReturnType<typeof getClassificationStats> | null>(null)

  useEffect(() => {
    setStats(getClassificationStats())
  }, [])

  const handleRefresh = () => {
    setStats(getClassificationStats())
  }

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all classification history?")) {
      clearClassifications()
      setStats(getClassificationStats())
    }
  }

  if (!stats) return null

  const pieData = CATEGORY_ORDER.map((cat) => ({
    name: CATEGORY_CONFIG[cat].label,
    value: stats.categoryCounts[cat],
  })).filter((d) => d.value > 0)

  const achievements = getAchievements(
    stats.totalClassifications,
    stats.recyclableCount
  )

  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <div className="flex flex-col gap-8">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/classify"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Scan className="h-4 w-4" />
          Classify New Image
        </Link>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </button>
        {stats.totalClassifications > 0 && (
          <button
            onClick={handleClearHistory}
            className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
          >
            <Trash2 className="h-4 w-4" />
            Clear History
          </button>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BarChart3}
          label="Total Classifications"
          value={stats.totalClassifications.toString()}
          accent="text-primary"
        />
        <StatCard
          icon={Recycle}
          label="Recyclable Found"
          value={stats.recyclableCount.toString()}
          accent="text-blue-400"
        />
        <StatCard
          icon={Target}
          label="Avg. Confidence"
          value={
            stats.avgConfidence > 0
              ? `${(stats.avgConfidence * 100).toFixed(1)}%`
              : "N/A"
          }
          accent="text-amber-400"
        />
        <StatCard
          icon={Award}
          label="Achievements"
          value={`${unlockedCount}/${achievements.length}`}
          accent="text-cyan-400"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Activity */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            Weekly Activity
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Classifications over the past 7 days
          </p>
          <div className="mt-6 h-[250px]">
            {stats.totalClassifications > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.weeklyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(150 10% 15%)"
                  />
                  <XAxis
                    dataKey="day"
                    stroke="hsl(150 8% 55%)"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(150 8% 55%)"
                    fontSize={12}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(150 15% 7%)",
                      border: "1px solid hsl(150 10% 15%)",
                      borderRadius: "8px",
                      color: "hsl(150 10% 95%)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(152 68% 46%)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="Classify some waste to see your weekly activity trend" />
            )}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
            <Trash2 className="h-5 w-5 text-primary" />
            Category Distribution
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Breakdown of waste types classified
          </p>
          <div className="mt-6 h-[250px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(150 15% 7%)",
                      border: "1px solid hsl(150 10% 15%)",
                      borderRadius: "8px",
                      color: "hsl(150 10% 95%)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No classification data yet. Start classifying waste to see the distribution." />
            )}
          </div>
          {/* Legend */}
          {pieData.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {pieData.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="text-muted-foreground">
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Environmental Impact Summary */}
      {stats.totalClassifications > 0 && (
        <div className="rounded-xl border border-border bg-gradient-to-br from-card to-secondary/20 p-6">
          <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
            <Leaf className="h-5 w-5 text-green-400" />
            Environmental Impact Summary
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your waste sorting contribution to environmental sustainability
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
              <p className="text-sm text-muted-foreground">Recyclables Sorted</p>
              <p className="mt-2 text-2xl font-bold text-green-400">
                {stats.recyclableCount}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Diverted from landfill
              </p>
            </div>
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
              <p className="text-sm text-muted-foreground">Carbon Offset</p>
              <p className="mt-2 text-2xl font-bold text-blue-400">
                ~{Math.round(stats.recyclableCount * 0.5)} kg
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Estimated CO₂ reduction
              </p>
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
              <p className="text-sm text-muted-foreground">E-Waste Tracked</p>
              <p className="mt-2 text-2xl font-bold text-amber-400">
                {stats.categoryCounts["e-waste"] || 0}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Items for safe disposal
              </p>
            </div>
            <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-4">
              <p className="text-sm text-muted-foreground">Eco Score</p>
              <p className="mt-2 text-2xl font-bold text-purple-400">
                {Math.min(100, Math.round((stats.recyclableCount / Math.max(1, stats.totalClassifications)) * 100))}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Sustainability rating
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
          <Award className="h-5 w-5 text-primary" />
          Achievements
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your eco-progress and unlock achievements
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {achievements.map((ach) => (
            <div
              key={ach.name}
              className={cn(
                "rounded-lg border p-4 transition-all",
                ach.unlocked
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-secondary/30 opacity-60"
              )}
            >
              <div className="flex items-center gap-2">
                <Award
                  className={cn(
                    "h-5 w-5",
                    ach.unlocked ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span className="font-heading text-sm font-semibold text-foreground">
                  {ach.name}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {ach.description}
              </p>
              <div className="mt-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-background/50">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      ach.unlocked ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                    style={{
                      width: `${Math.min(
                        (ach.current / ach.threshold) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {Math.min(ach.current, ach.threshold)}/{ach.threshold}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
          <Clock className="h-5 w-5 text-primary" />
          Recent Classifications
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Your last classified waste items
        </p>
        {stats.recentClassifications.length > 0 ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.recentClassifications.map((record) => {
              const config = CATEGORY_CONFIG[record.result.category]
              return (
                <div
                  key={record.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3"
                >
                  <img
                    src={record.imageDataUrl}
                    alt={`Classified as ${config.label}`}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "truncate text-sm font-semibold",
                        config.color
                      )}
                    >
                      {config.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(record.result.confidence * 100).toFixed(0)}% confidence
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState message="No recent classifications. Head to the Classify page to get started!" />
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  accent: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className={cn("h-5 w-5", accent)} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-heading text-2xl font-bold text-foreground">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <BarChart3 className="h-10 w-10 text-muted-foreground/20" />
      <p className="mt-3 max-w-xs text-sm text-muted-foreground">{message}</p>
      <Link
        href="/classify"
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Scan className="h-4 w-4" />
        Start Classifying
      </Link>
    </div>
  )
}
