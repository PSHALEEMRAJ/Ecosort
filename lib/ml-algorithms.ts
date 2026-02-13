/**
 * Advanced Machine Learning Algorithms for Waste Classification
 * Implements ensemble methods, confidence calibration, and anomaly detection
 */

export interface MLAlgorithmResult {
  predictions: Array<{
    label: string
    confidence: number
    probability: number
  }>
  ensembleConfidence: number
  anomalyScore: number
  isAnomalous: boolean
  recommendedAction: string
  uncertainty: number
}

export interface ImageFeatures {
  colorHistogram: number[]
  edgeFeatures: number[]
  textureFeatures: number[]
  shapeFeatures: number[]
  spatialFeatures: number[]
}

/**
 * Temperature Scaling - Calibrate model confidence scores
 * Prevents overconfident predictions
 */
export function temperatureScaling(
  logits: number[],
  temperature: number = 1.5
): number[] {
  return logits.map((logit) => {
    const exp_logit = Math.exp(logit / temperature)
    return exp_logit / logits.reduce((sum, l) => sum + Math.exp(l / temperature), 0)
  })
}

/**
 * Ensemble Method: Weighted Averaging
 * Combines predictions from multiple models with learned weights
 */
export function weightedEnsemble(
  predictions: number[][],
  weights: number[] = [0.4, 0.35, 0.15, 0.1] // MobileNet, COCO, Custom, Edge
): number[] {
  const numClasses = predictions[0].length
  const result = new Array(numClasses).fill(0)

  for (let i = 0; i < predictions.length; i++) {
    for (let j = 0; j < numClasses; j++) {
      result[j] += predictions[i][j] * weights[i]
    }
  }

  return result
}

/**
 * Stochastic Ensemble - Multiple forward passes with dropout simulation
 * Provides uncertainty estimation
 */
export function stochasticEnsemble(
  basePredictor: (input: number) => number[],
  input: number,
  numPasses: number = 5,
  dropoutRate: number = 0.3
): { mean: number[]; variance: number[]; uncertainty: number } {
  const predictions: number[][] = []

  for (let i = 0; i < numPasses; i++) {
    // Simulate dropout by randomly zeroing features
    const maskedInput = Math.random() > dropoutRate ? input : 0
    predictions.push(basePredictor(maskedInput))
  }

  const numClasses = predictions[0].length
  const mean = new Array(numClasses).fill(0)
  const variance = new Array(numClasses).fill(0)

  // Calculate mean
  for (let j = 0; j < numClasses; j++) {
    mean[j] = predictions.reduce((sum, pred) => sum + pred[j], 0) / numPasses
  }

  // Calculate variance
  for (let j = 0; j < numClasses; j++) {
    variance[j] = predictions.reduce((sum, pred) => sum + Math.pow(pred[j] - mean[j], 2), 0) / numPasses
  }

  // Total uncertainty (entropy-based)
  const uncertainty = mean.reduce((sum, prob) => sum - prob * Math.log(prob + 1e-10), 0)

  return { mean, variance, uncertainty }
}

/**
 * Isolation Forest - Anomaly Detection
 * Identifies unusual waste items or misclassifications
 */
export function isolationForest(
  features: number[],
  trainingSamples: number[][],
  numTrees: number = 10,
  maxDepth: number = 8
): number {
  let anomalyScore = 0

  for (let t = 0; t < numTrees; t++) {
    const depth = getIsolationDepth(features, trainingSamples, maxDepth, 0)
    // Normalize depth to anomaly score (0-1)
    anomalyScore += depth / maxDepth
  }

  return anomalyScore / numTrees
}

function getIsolationDepth(
  features: number[],
  samples: number[][],
  maxDepth: number,
  currentDepth: number
): number {
  if (currentDepth >= maxDepth || samples.length <= 1) {
    return currentDepth
  }

  // Random feature and split value
  const featureIdx = Math.floor(Math.random() * features.length)
  const randomSample = samples[Math.floor(Math.random() * samples.length)]
  const splitValue = randomSample[featureIdx]

  // Partition samples
  const left = samples.filter((s) => s[featureIdx] < splitValue)
  const right = samples.filter((s) => s[featureIdx] >= splitValue)

  // Recurse on smaller partition (isolation principle)
  if (left.length === 0 || right.length === 0) {
    return currentDepth + 1
  }

  const selectedSamples = left.length < right.length ? left : right
  return getIsolationDepth(features, selectedSamples, maxDepth, currentDepth + 1)
}

/**
 * Monte Carlo Dropout - Uncertainty Estimation
 * Run inference multiple times with different dropouts
 */
export function monteCarloDropout(
  predictions: number[][],
  numSamples: number = 30
): { prediction: number; lowerBound: number; upperBound: number } {
  const means = predictions.map((pred) => Math.max(...pred))
  const meanValue = means.reduce((a, b) => a + b, 0) / means.length

  // Calculate confidence intervals (95%)
  const sorted = means.sort((a, b) => a - b)
  const lowerIdx = Math.floor(sorted.length * 0.025)
  const upperIdx = Math.floor(sorted.length * 0.975)

  return {
    prediction: meanValue,
    lowerBound: sorted[lowerIdx],
    upperBound: sorted[upperIdx],
  }
}

/**
 * Calibrated Uncertainty - Combines multiple uncertainty sources
 */
export function getCalibratedUncertainty(
  modelUncertainty: number,
  aleatoric: number, // Data uncertainty
  epistemic: number // Model uncertainty
): number {
  // Combined uncertainty (Bayesian approach)
  const totalUncertainty = Math.sqrt(
    Math.pow(aleatoric, 2) + Math.pow(epistemic, 2)
  )

  // Normalize to 0-1 range
  return Math.min(1, totalUncertainty)
}

/**
 * Extract features from image for advanced analysis
 */
export function extractImageFeatures(canvas: HTMLCanvasElement): ImageFeatures {
  const ctx = canvas.getContext("2d")!
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  // Color Histogram
  const colorHistogram = new Array(256).fill(0)
  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
    colorHistogram[Math.floor(brightness)]++
  }

  // Edge Features (Sobel-like filter)
  const edges = detectEdges(canvas)

  // Texture Features (using variance of gradients)
  const textures = calculateTextureFeatures(canvas)

  // Shape Features
  const shapes = calculateShapeFeatures(canvas)

  // Spatial Features
  const spatial = calculateSpatialFeatures(canvas)

  return {
    colorHistogram: colorHistogram.slice(0, 64), // Reduced for efficiency
    edgeFeatures: edges,
    textureFeatures: textures,
    shapeFeatures: shapes,
    spatialFeatures: spatial,
  }
}

function detectEdges(canvas: HTMLCanvasElement): number[] {
  const ctx = canvas.getContext("2d")!
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  const width = canvas.width

  let edgeSum = 0
  let edgeVariance = 0
  let edgeCount = 0

  for (let i = 1; i < data.length - 1; i += 4) {
    if ((i / 4) % width === 0) continue

    const gx =
      -data[i - 4] +
      data[i + 4] -
      2 * data[i - 4 * width] +
      2 * data[i + 4 * width]
    const gy =
      -data[i - 4 * width] +
      data[i + 4 * width] -
      2 * data[i - 4] +
      2 * data[i + 4]

    const magnitude = Math.sqrt(gx * gx + gy * gy)
    edgeSum += magnitude
    edgeCount++
  }

  return [
    edgeSum / edgeCount,
    edgeVariance / edgeCount,
  ]
}

function calculateTextureFeatures(canvas: HTMLCanvasElement): number[] {
  const ctx = canvas.getContext("2d")!
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  let variance = 0
  let mean = 0

  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
    mean += brightness
  }

  mean /= data.length / 4

  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
    variance += Math.pow(brightness - mean, 2)
  }

  variance /= data.length / 4

  return [
    mean / 255,
    Math.sqrt(variance) / 255,
  ]
}

function calculateShapeFeatures(canvas: HTMLCanvasElement): number[] {
  // Simplified shape analysis
  const width = canvas.width
  const height = canvas.height
  const aspectRatio = width / height

  // Compute center of mass
  const ctx = canvas.getContext("2d")!
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  let totalBrightness = 0
  let cx = 0
  let cy = 0

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3

      totalBrightness += brightness
      cx += x * brightness
      cy += y * brightness
    }
  }

  cx /= totalBrightness
  cy /= totalBrightness

  // Normalized center position
  const centerX = cx / width
  const centerY = cy / height

  return [aspectRatio, centerX, centerY]
}

function calculateSpatialFeatures(canvas: HTMLCanvasElement): number[] {
  // Divide image into grid and analyze each cell
  const ctx = canvas.getContext("2d")!
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  const width = canvas.width
  const height = canvas.height

  const gridSize = 4
  const cellWidth = Math.floor(width / gridSize)
  const cellHeight = Math.floor(height / gridSize)

  const features: number[] = []

  for (let gy = 0; gy < gridSize; gy++) {
    for (let gx = 0; gx < gridSize; gx++) {
      let cellBrightness = 0
      let pixelCount = 0

      for (let y = gy * cellHeight; y < (gy + 1) * cellHeight; y++) {
        for (let x = gx * cellWidth; x < (gx + 1) * cellWidth; x++) {
          const idx = (y * width + x) * 4
          cellBrightness += (data[idx] + data[idx + 1] + data[idx + 2]) / 3
          pixelCount++
        }
      }

      features.push(cellBrightness / pixelCount / 255)
    }
  }

  return features
}

/**
 * Adaptive Confidence Threshold
 * Adjusts confidence based on image quality and uncertainty
 */
export function getAdaptiveThreshold(
  imageQuality: number,
  uncertainty: number
): number {
  // Lower quality images need higher confidence
  const qualityFactor = 1 + (1 - imageQuality / 100) * 0.3

  // Higher uncertainty increases threshold
  const uncertaintyFactor = 1 + uncertainty * 0.2

  // Base threshold with adaptive adjustments
  const baseThreshold = 0.65
  return Math.min(0.95, baseThreshold * qualityFactor * uncertaintyFactor)
}
