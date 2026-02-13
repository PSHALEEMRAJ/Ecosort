/**
 * Client-side classification history store.
 * In a production app this would be backed by a database.
 * Uses SWR for state sync between components.
 */

import type { WasteCategory, ClassificationResult } from "./waste-classifier"

export interface ClassificationRecord {
  id: string
  timestamp: number
  imageDataUrl: string
  result: ClassificationResult
}

const STORAGE_KEY = "ecosort-classifications"

function getRecords(): ClassificationRecord[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRecords(records: ClassificationRecord[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export function addClassification(
  imageDataUrl: string,
  result: ClassificationResult
): ClassificationRecord {
  const record: ClassificationRecord = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    imageDataUrl,
    result,
  }
  const records = getRecords()
  records.unshift(record)
  // Keep max 50 records
  if (records.length > 50) records.length = 50
  saveRecords(records)
  return record
}

export function getClassifications(): ClassificationRecord[] {
  return getRecords()
}

export function getClassificationStats() {
  const records = getRecords()
  const categoryCounts: Record<WasteCategory, number> = {
    recyclable: 0,
    organic: 0,
    "e-waste": 0,
    plastic: 0,
    hazardous: 0,
    general: 0,
  }

  for (const r of records) {
    categoryCounts[r.result.category]++
  }

  const totalClassifications = records.length
  const recyclableCount =
    categoryCounts.recyclable + categoryCounts.plastic
  const avgConfidence =
    records.length > 0
      ? records.reduce((sum, r) => sum + r.result.confidence, 0) / records.length
      : 0

  // Weekly data for charts
  const weeklyData: Array<{ day: string; count: number }> = []
  const now = Date.now()
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  for (let i = 6; i >= 0; i--) {
    const dayStart = now - i * 86400000
    const dayEnd = dayStart + 86400000
    const count = records.filter(
      (r) => r.timestamp >= dayStart && r.timestamp < dayEnd
    ).length
    const date = new Date(dayStart)
    weeklyData.push({ day: dayNames[date.getDay()], count })
  }

  return {
    categoryCounts,
    totalClassifications,
    recyclableCount,
    avgConfidence,
    weeklyData,
    recentClassifications: records.slice(0, 8),
  }
}

export function clearClassifications() {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}
