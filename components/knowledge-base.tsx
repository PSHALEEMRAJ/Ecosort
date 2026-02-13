"use client"

import { useState } from "react"
import {
  Search,
  Recycle,
  Leaf,
  Cpu,
  Droplets,
  AlertTriangle,
  Trash2,
  ChevronDown,
  ExternalLink,
  Lightbulb,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface KnowledgeCategory {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  borderColor: string
  description: string
  items: string[]
  tips: string[]
  facts: string[]
}

const categories: KnowledgeCategory[] = [
  {
    id: "recyclable",
    label: "Recyclable Waste",
    icon: Recycle,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    description:
      "Materials that can be processed and manufactured into new products, reducing the need for raw materials.",
    items: [
      "Paper and cardboard (newspapers, magazines, boxes)",
      "Glass bottles and jars (clear, green, brown)",
      "Aluminum and steel cans",
      "Certain plastics (PET #1, HDPE #2)",
      "Cartons (milk, juice, soup)",
      "Clean tin foil and metal lids",
    ],
    tips: [
      "Rinse containers before recycling to remove food residue",
      "Flatten cardboard boxes to save space in recycling bins",
      "Remove caps and lids as they are often a different material",
      "Don't bag recyclables - put them loose in the recycling bin",
      "Check local guidelines as recycling rules vary by location",
    ],
    facts: [
      "Recycling one aluminum can saves enough energy to power a TV for 3 hours",
      "Glass can be recycled endlessly without loss in quality",
      "Recycling paper uses 70% less energy than making it from raw materials",
    ],
  },
  {
    id: "organic",
    label: "Organic Waste",
    icon: Leaf,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    description:
      "Biodegradable waste from plants or animals that can decompose naturally and be composted.",
    items: [
      "Fruit and vegetable scraps",
      "Coffee grounds and tea bags",
      "Eggshells and nut shells",
      "Yard trimmings and leaves",
      "Bread and grains",
      "Wood chips and sawdust",
    ],
    tips: [
      "Start a compost bin at home for kitchen scraps",
      "Avoid composting meat, dairy, or oily foods as they attract pests",
      "Layer green (nitrogen) and brown (carbon) materials in compost",
      "Keep compost moist but not waterlogged",
      "Turn compost regularly to speed up decomposition",
    ],
    facts: [
      "Food waste in landfills produces methane, a greenhouse gas 25x more potent than CO2",
      "Composting can reduce household waste by up to 30%",
      "Finished compost enriches soil and reduces the need for chemical fertilizers",
    ],
  },
  {
    id: "e-waste",
    label: "Electronic Waste",
    icon: Cpu,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    description:
      "Discarded electronic devices and components that contain valuable materials and potentially hazardous substances.",
    items: [
      "Smartphones and tablets",
      "Laptops and desktop computers",
      "TVs and monitors",
      "Printers and scanners",
      "Batteries and chargers",
      "Cables, headphones, and peripherals",
    ],
    tips: [
      "Wipe personal data before recycling devices",
      "Check if manufacturers offer take-back programs",
      "Many retailers like Best Buy accept e-waste for free",
      "Never throw batteries in regular trash - they can cause fires",
      "Consider donating working electronics to schools or charities",
    ],
    facts: [
      "Only 20% of global e-waste is formally recycled each year",
      "One metric ton of circuit boards contains 40-800x more gold than a ton of ore",
      "E-waste is the fastest growing waste stream, growing 3-5% per year globally",
    ],
  },
  {
    id: "plastic",
    label: "Plastic Waste",
    icon: Droplets,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    description:
      "Synthetic materials that can persist in the environment for hundreds of years if not properly managed.",
    items: [
      "PET bottles (#1) - water, soda bottles",
      "HDPE containers (#2) - milk jugs, detergent bottles",
      "PVC (#3) - pipes, some packaging",
      "LDPE (#4) - plastic bags, squeeze bottles",
      "PP (#5) - yogurt containers, bottle caps",
      "PS (#6) - styrofoam, disposable cups",
    ],
    tips: [
      "Check the recycling number on the bottom of plastic items",
      "Types 1 and 2 are the most widely recycled plastics",
      "Reduce single-use plastic by using reusable bags and bottles",
      "Clean and dry plastics before recycling",
      "Avoid buying products with excessive plastic packaging",
    ],
    facts: [
      "8 million tons of plastic enter the ocean every year",
      "A plastic bottle can take 450 years to decompose",
      "Only 9% of all plastic ever produced has been recycled globally",
    ],
  },
  {
    id: "hazardous",
    label: "Hazardous Waste",
    icon: AlertTriangle,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    description:
      "Waste that poses substantial or potential threats to public health or the environment and requires special handling.",
    items: [
      "Paint and paint thinners",
      "Cleaning chemicals and solvents",
      "Pesticides and herbicides",
      "Motor oil and automotive fluids",
      "Fluorescent bulbs and CFLs",
      "Medications and medical waste",
    ],
    tips: [
      "Never pour chemicals down the drain or into the trash",
      "Store hazardous materials in their original containers",
      "Contact your local waste authority for collection schedules",
      "Many pharmacies accept unused medications for safe disposal",
      "Keep hazardous waste away from children and pets",
    ],
    facts: [
      "Improper disposal of just one gallon of motor oil can contaminate a million gallons of water",
      "Mercury from one fluorescent bulb can pollute 6,000 gallons of water",
      "The US generates over 7.6 billion tons of hazardous waste annually",
    ],
  },
  {
    id: "general",
    label: "General Waste",
    icon: Trash2,
    color: "text-neutral-400",
    bgColor: "bg-neutral-500/10",
    borderColor: "border-neutral-500/20",
    description:
      "Non-recyclable, non-hazardous waste that typically goes to landfill. Always check if items can be recycled or composted first.",
    items: [
      "Broken ceramics and pottery",
      "Heavily soiled paper or cardboard",
      "Certain mixed-material packaging",
      "Broken mirrors and window glass",
      "Worn-out textiles not suitable for donation",
      "Disposable diapers and sanitary products",
    ],
    tips: [
      "Always check if something can be recycled before putting it in general waste",
      "Consider donating usable items instead of throwing them away",
      "Try to reduce general waste by choosing reusable alternatives",
      "Compress bulky items to minimize landfill space",
      "Consider upcycling or repurposing items creatively",
    ],
    facts: [
      "The average person generates about 4.4 pounds of waste per day",
      "Landfills are the third-largest source of methane emissions",
      "Zero-waste lifestyles can reduce household waste by over 90%",
    ],
  },
]

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = searchQuery
    ? categories.filter(
        (cat) =>
          cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.items.some((item) =>
            item.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : categories

  return (
    <div className="flex flex-col gap-8">
      {/* Search */}
      <div className="relative mx-auto w-full max-w-xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search waste categories, items, or tips..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-12 py-3.5 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="Search knowledge base"
        />
      </div>

      {/* Quick Tips */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
        <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
          <Lightbulb className="h-5 w-5 text-primary" />
          Quick Waste Sorting Guide
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "When in doubt, check the recycling symbol on the item",
            "Rinse food containers before recycling them",
            "Batteries and electronics never go in regular trash",
            "Compost food scraps to reduce methane from landfills",
            "Reduce first, then reuse, then recycle",
            "Check local guidelines - rules differ by municipality",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Cards */}
      <div className="flex flex-col gap-4">
        {filtered.map((cat) => {
          const Icon = cat.icon
          const isExpanded = expandedId === cat.id

          return (
            <div
              key={cat.id}
              className={cn(
                "rounded-xl border transition-all",
                cat.borderColor,
                isExpanded ? cat.bgColor : "bg-card"
              )}
            >
              <button
                onClick={() =>
                  setExpandedId(isExpanded ? null : cat.id)
                }
                className="flex w-full items-center justify-between p-6 text-left"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-lg",
                      cat.bgColor
                    )}
                  >
                    <Icon className={cn("h-6 w-6", cat.color)} />
                  </div>
                  <div>
                    <h3
                      className={cn(
                        "font-heading text-lg font-semibold",
                        cat.color
                      )}
                    >
                      {cat.label}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {cat.description}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              </button>

              {isExpanded && (
                <div className="border-t border-border/50 px-6 pb-6 pt-4">
                  <div className="grid gap-6 lg:grid-cols-3">
                    {/* Common Items */}
                    <div>
                      <h4 className="font-heading text-sm font-semibold text-foreground">
                        Common Items
                      </h4>
                      <ul className="mt-3 flex flex-col gap-2">
                        {cat.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span
                              className={cn(
                                "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                                cat.color.replace("text-", "bg-")
                              )}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tips */}
                    <div>
                      <h4 className="font-heading text-sm font-semibold text-foreground">
                        Disposal Tips
                      </h4>
                      <ul className="mt-3 flex flex-col gap-2">
                        {cat.tips.map((tip, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Facts */}
                    <div>
                      <h4 className="font-heading text-sm font-semibold text-foreground">
                        Did You Know?
                      </h4>
                      <div className="mt-3 flex flex-col gap-3">
                        {cat.facts.map((fact, i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-background/50 p-3 text-sm text-muted-foreground"
                          >
                            {fact}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <Search className="mx-auto h-10 w-10 text-muted-foreground/30" />
            <p className="mt-4 font-heading text-lg font-semibold text-muted-foreground">
              No results found
            </p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              Try searching for a different term or browse all categories.
            </p>
          </div>
        )}
      </div>

      {/* AI Model Info */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
          <Cpu className="h-5 w-5 text-primary" />
          About Our AI Model
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Base Model",
              value: "MobileNet V2",
              desc: "Google's efficient CNN pretrained on ImageNet (1.4M images, 1000 classes)",
            },
            {
              label: "Transfer Learning",
              value: "Custom Mapping Layer",
              desc: "300+ keyword mappings from ImageNet classes to 6 waste categories",
            },
            {
              label: "Accuracy Method",
              value: "Weighted Voting",
              desc: "Top-5 predictions aggregated with probability weighting for robust results",
            },
            {
              label: "Runtime",
              value: "TensorFlow.js",
              desc: "Runs entirely in your browser - no data sent to servers, fully private",
            },
          ].map((info) => (
            <div
              key={info.label}
              className="rounded-lg border border-border bg-secondary/30 p-4"
            >
              <p className="text-xs text-muted-foreground">{info.label}</p>
              <p className="mt-1 font-heading text-sm font-semibold text-foreground">
                {info.value}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {info.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
