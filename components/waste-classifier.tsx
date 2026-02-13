"use client"

import { useState, useCallback, useRef } from "react"
import {
  Upload,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Recycle,
  Leaf,
  Info,
  XCircle,
  ImageIcon,
  Camera,
  RotateCcw,
  Sparkles,
  Tag,
  Layers,
  Box,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  classifyImage,
  loadModel,
  CATEGORY_CONFIG,
  type ClassificationResult,
} from "@/lib/waste-classifier"
import { addClassification } from "@/lib/classification-store"

type Status = "idle" | "loading-model" | "classifying" | "done" | "error"

const SAMPLE_IMAGES = [
  {
    label: "Banana",
    url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80",
    expected: "organic",
  },
  {
    label: "Laptop",
    url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
    expected: "e-waste",
  },
  {
    label: "Bottles",
    url: "https://images.unsplash.com/photo-1605187851421-4e73be127638?w=400&q=80",
    expected: "recyclable",
  },
]

export function WasteClassifier() {
  const [status, setStatus] = useState<Status>("idle")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [result, setResult] = useState<ClassificationResult | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [progressMsg, setProgressMsg] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const runClassification = useCallback(async (imgSrc: string) => {
    try {
      setErrorMessage("")
      setResult(null)
      setImageUrl(imgSrc)
      setStatus("loading-model")

      // Create image element
      const img = new Image()
      img.crossOrigin = "anonymous"
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error("Failed to load image"))
        img.src = imgSrc
      })

      setStatus("classifying")

      // Run multi-model ensemble classification
      const classificationResult = await classifyImage(img, (msg) => {
        setProgressMsg(msg)
      })
      setResult(classificationResult)

      // Save compressed thumbnail to history
      const canvas = document.createElement("canvas")
      const maxSize = 200
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
      const thumbDataUrl = canvas.toDataURL("image/jpeg", 0.6)
      addClassification(thumbDataUrl, classificationResult)

      setStatus("done")
    } catch (err) {
      console.error("Classification error:", err)
      setErrorMessage(
        err instanceof Error && err.message.includes("load image")
          ? "Failed to load the image. The URL may be blocked by CORS. Try uploading a local file instead."
          : "Failed to classify image. Please try again with a different image."
      )
      setStatus("error")
    }
  }, [])

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please upload a valid image file (JPG, PNG, WEBP).")
        setStatus("error")
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("Image must be less than 10MB.")
        setStatus("error")
        return
      }
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      runClassification(dataUrl)
    },
    [runClassification]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) handleFileSelect(file)
    },
    [handleFileSelect]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFileSelect(file)
    },
    [handleFileSelect]
  )

  const handleSampleImage = useCallback(
    (url: string) => {
      runClassification(url)
    },
    [runClassification]
  )

  const handleReset = () => {
    setStatus("idle")
    setImageUrl(null)
    setResult(null)
    setErrorMessage("")
    setProgressMsg("")
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (cameraInputRef.current) cameraInputRef.current.value = ""
  }

  const isProcessing = status === "loading-model" || status === "classifying"

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
      {/* Upload Area */}
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Upload Waste Image
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag and drop, take a photo, or try a sample image
          </p>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              if (!isProcessing) fileInputRef.current?.click()
            }
          }}
          aria-label="Upload area. Click or drag and drop an image to classify waste."
          className={cn(
            "relative flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all",
            isProcessing
              ? "cursor-wait border-primary/30 bg-primary/5"
              : imageUrl
                ? "border-border bg-card"
                : "border-border hover:border-primary/50 hover:bg-primary/5"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            disabled={isProcessing}
            aria-label="Upload waste image for classification"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="sr-only"
            disabled={isProcessing}
            aria-label="Take a photo of waste for classification"
          />

          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Uploaded waste image"
              className="max-h-[280px] rounded-lg object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Drop your waste image here
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Supports JPG, PNG, WEBP up to 10MB
                </p>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-3 text-sm font-medium text-foreground">
                {progressMsg || "Initializing AI models..."}
              </p>
              <p className="mt-1 max-w-xs text-center text-xs text-muted-foreground">
                {status === "loading-model"
                  ? "First load downloads MobileNet V2 + COCO-SSD models. Subsequent loads are cached."
                  : "Running multi-crop inference + object detection ensemble..."}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {status === "idle" && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                cameraInputRef.current?.click()
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              <Camera className="h-4 w-4" />
              Take Photo
            </button>
          )}
          {(status === "done" || status === "error") && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              <RotateCcw className="h-4 w-4" />
              Classify Another Image
            </button>
          )}
        </div>

        {/* Sample Images */}
        {status === "idle" && (
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Try a sample image
            </p>
            <div className="grid grid-cols-3 gap-3">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.label}
                  onClick={() => handleSampleImage(sample.url)}
                  className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/30 hover:bg-primary/5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <ImageIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                    {sample.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4" role="alert">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <div>
              <p className="text-sm text-red-300">{errorMessage}</p>
              <button
                onClick={handleReset}
                className="mt-2 text-xs font-medium text-red-400 underline hover:text-red-300"
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Area */}
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Classification Results
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Multi-model ensemble: MobileNet V2 + COCO-SSD
          </p>
        </div>

        {result ? (
          <div className="flex flex-col gap-4">
            {/* Main Result Card */}
            <div
              className={cn(
                "rounded-xl border p-6",
                CATEGORY_CONFIG[result.category].bgColor,
                CATEGORY_CONFIG[result.category].borderColor
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-lg",
                      CATEGORY_CONFIG[result.category].bgColor
                    )}
                  >
                    {result.recyclable ? (
                      <Recycle className={cn("h-6 w-6", CATEGORY_CONFIG[result.category].color)} />
                    ) : (
                      <AlertTriangle className={cn("h-6 w-6", CATEGORY_CONFIG[result.category].color)} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Detected Category</p>
                    <p className={cn("font-heading text-xl font-bold", CATEGORY_CONFIG[result.category].color)}>
                      {CATEGORY_CONFIG[result.category].label}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Confidence</p>
                  <p className="font-heading text-2xl font-bold text-foreground">
                    {(result.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="mt-4">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-background/30">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      result.confidence > 0.7
                        ? "bg-green-500"
                        : result.confidence > 0.4
                          ? "bg-amber-500"
                          : "bg-red-500"
                    )}
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
            </div>

            {/* Material, Sub-category, Models Used */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <p className="text-xs font-medium text-muted-foreground">Material</p>
                </div>
                <p className="mt-1 font-heading text-sm font-semibold text-foreground truncate" title={result.detectedMaterial}>
                  {result.detectedMaterial}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-xs font-medium text-muted-foreground">Sub-Type</p>
                </div>
                <p className="mt-1 font-heading text-sm font-semibold capitalize text-foreground">
                  {result.subCategory.replace(/_/g, " ")}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <p className="text-xs font-medium text-muted-foreground">Models</p>
                </div>
                <p className="mt-1 font-heading text-sm font-semibold text-foreground">
                  {result.modelsUsed.length}x Ensemble
                </p>
              </div>
            </div>

            {/* COCO-SSD Detected Objects */}
            {result.detectedObjects.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
                  <Box className="h-4 w-4 text-amber-400" />
                  COCO-SSD Object Detection
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.detectedObjects.map((obj, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300"
                    >
                      {obj.class}
                      <span className="text-amber-500/60">{(obj.score * 100).toFixed(0)}%</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Top Predictions */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                MobileNet Top Predictions (Multi-Crop)
              </h3>
              <div className="mt-3 flex flex-col gap-2">
                {result.topPredictions.map((pred, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="truncate text-sm text-foreground">
                        {pred.className.split(",")[0]}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-xs",
                          CATEGORY_CONFIG[pred.mappedCategory].bgColor,
                          CATEGORY_CONFIG[pred.mappedCategory].color
                        )}
                      >
                        {CATEGORY_CONFIG[pred.mappedCategory].label}
                      </span>
                    </div>
                    <span className="shrink-0 text-sm font-medium text-muted-foreground">
                      {(pred.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disposal Instructions */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Disposal Instructions
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {result.disposalInstructions}
              </p>
            </div>

            {/* Environmental Impact */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
                <Leaf className="h-4 w-4 text-primary" />
                Environmental Impact
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {result.environmentalImpact}
              </p>
            </div>

            {/* Models Used Badge */}
            <div className="flex flex-wrap gap-2">
              {result.modelsUsed.map((model) => (
                <span
                  key={model}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                >
                  <Layers className="h-3 w-3" />
                  {model}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
            <Info className="h-12 w-12 text-muted-foreground/30" />
            <p className="mt-4 font-heading text-lg font-semibold text-muted-foreground">
              No results yet
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground/70">
              Upload an image or try a sample to see AI classification results
              powered by a multi-model ensemble with MobileNet V2 + COCO-SSD.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
