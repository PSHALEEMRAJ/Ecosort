/**
 * Waste Classification Engine v3 - Multi-Model Ensemble
 *
 * Accuracy pipeline:
 * 1. Image preprocessing: center-crop + resize to 224x224
 * 2. Multi-crop inference: center + 4 corner crops averaged for robustness
 * 3. MobileNet V2 classification (ImageNet pretrained, 1000 classes)
 * 4. COCO-SSD object detection for cross-verification (80 object classes)
 * 5. Exact-match mapping: 200+ ImageNet class names mapped to waste categories
 * 6. Keyword fallback with phrase-length weighting
 * 7. Ensemble fusion: MobileNet(0.6) + COCO-SSD(0.4) weighted combination
 * 8. Sub-category detection and confidence calibration
 */

import * as tf from "@tensorflow/tfjs"
import * as mobilenet from "@tensorflow-models/mobilenet"
import type * as cocoSsdTypes from "@tensorflow-models/coco-ssd"

export type WasteCategory =
  | "recyclable"
  | "organic"
  | "e-waste"
  | "plastic"
  | "hazardous"
  | "general"

export type SubCategory =
  | "paper"
  | "glass"
  | "metal"
  | "cardboard"
  | "food_waste"
  | "garden_waste"
  | "electronics"
  | "batteries"
  | "appliances"
  | "bottles"
  | "packaging"
  | "bags"
  | "chemicals"
  | "medical"
  | "automotive"
  | "furniture"
  | "textiles"
  | "ceramics"
  | "mixed"
  | "unknown"

export interface ClassificationResult {
  category: WasteCategory
  subCategory: SubCategory
  confidence: number
  topPredictions: Array<{
    className: string
    probability: number
    mappedCategory: WasteCategory
  }>
  disposalInstructions: string
  recyclable: boolean
  environmentalImpact: string
  detectedMaterial: string
  detectedObjects: Array<{ class: string; score: number }>
  modelsUsed: string[]
}

// ==========================================
// EXACT PHRASE MAPPING (highest accuracy)
// ==========================================
const EXACT_CLASS_MAP: Record<string, { category: WasteCategory; sub: SubCategory }> = {
  // Recyclable - Paper/Cardboard
  "envelope": { category: "recyclable", sub: "paper" },
  "book jacket": { category: "recyclable", sub: "paper" },
  "comic book": { category: "recyclable", sub: "paper" },
  "crossword puzzle": { category: "recyclable", sub: "paper" },
  "menu": { category: "recyclable", sub: "paper" },
  "packet": { category: "recyclable", sub: "paper" },
  "paper towel": { category: "recyclable", sub: "paper" },
  "toilet tissue": { category: "recyclable", sub: "paper" },
  // Recyclable - Glass
  "wine bottle": { category: "recyclable", sub: "glass" },
  "beer bottle": { category: "recyclable", sub: "glass" },
  "pop bottle": { category: "recyclable", sub: "glass" },
  "beer glass": { category: "recyclable", sub: "glass" },
  "goblet": { category: "recyclable", sub: "glass" },
  "cocktail shaker": { category: "recyclable", sub: "glass" },
  "whiskey jug": { category: "recyclable", sub: "glass" },
  "vase": { category: "recyclable", sub: "glass" },
  // Recyclable - Metal
  "can opener": { category: "recyclable", sub: "metal" },
  "corkscrew": { category: "recyclable", sub: "metal" },
  "frying pan": { category: "recyclable", sub: "metal" },
  "wok": { category: "recyclable", sub: "metal" },
  "caldron": { category: "recyclable", sub: "metal" },
  "coffeepot": { category: "recyclable", sub: "metal" },
  "teapot": { category: "recyclable", sub: "metal" },
  "dutch oven": { category: "recyclable", sub: "metal" },
  "soup bowl": { category: "recyclable", sub: "metal" },
  "mixing bowl": { category: "recyclable", sub: "metal" },
  "measuring cup": { category: "recyclable", sub: "metal" },
  "ladle": { category: "recyclable", sub: "metal" },
  "bucket": { category: "recyclable", sub: "metal" },
  "pail": { category: "recyclable", sub: "metal" },
  "mailbox": { category: "recyclable", sub: "metal" },
  "safe": { category: "recyclable", sub: "metal" },
  "file cabinet": { category: "recyclable", sub: "metal" },

  // Organic - Food
  "banana": { category: "organic", sub: "food_waste" },
  "apple": { category: "organic", sub: "food_waste" },
  "orange": { category: "organic", sub: "food_waste" },
  "lemon": { category: "organic", sub: "food_waste" },
  "fig": { category: "organic", sub: "food_waste" },
  "pineapple": { category: "organic", sub: "food_waste" },
  "strawberry": { category: "organic", sub: "food_waste" },
  "pomegranate": { category: "organic", sub: "food_waste" },
  "jackfruit": { category: "organic", sub: "food_waste" },
  "custard apple": { category: "organic", sub: "food_waste" },
  "broccoli": { category: "organic", sub: "food_waste" },
  "cauliflower": { category: "organic", sub: "food_waste" },
  "cucumber": { category: "organic", sub: "food_waste" },
  "zucchini": { category: "organic", sub: "food_waste" },
  "artichoke": { category: "organic", sub: "food_waste" },
  "bell pepper": { category: "organic", sub: "food_waste" },
  "mushroom": { category: "organic", sub: "food_waste" },
  "Granny Smith": { category: "organic", sub: "food_waste" },
  "ear": { category: "organic", sub: "food_waste" },
  "corn": { category: "organic", sub: "food_waste" },
  "acorn squash": { category: "organic", sub: "food_waste" },
  "butternut squash": { category: "organic", sub: "food_waste" },
  "spaghetti squash": { category: "organic", sub: "food_waste" },
  "head cabbage": { category: "organic", sub: "food_waste" },
  "pizza": { category: "organic", sub: "food_waste" },
  "cheeseburger": { category: "organic", sub: "food_waste" },
  "hotdog": { category: "organic", sub: "food_waste" },
  "pretzel": { category: "organic", sub: "food_waste" },
  "bagel": { category: "organic", sub: "food_waste" },
  "French loaf": { category: "organic", sub: "food_waste" },
  "meat loaf": { category: "organic", sub: "food_waste" },
  "potpie": { category: "organic", sub: "food_waste" },
  "burrito": { category: "organic", sub: "food_waste" },
  "carbonara": { category: "organic", sub: "food_waste" },
  "chocolate sauce": { category: "organic", sub: "food_waste" },
  "dough": { category: "organic", sub: "food_waste" },
  "guacamole": { category: "organic", sub: "food_waste" },
  "ice cream": { category: "organic", sub: "food_waste" },
  "ice lolly": { category: "organic", sub: "food_waste" },
  "trifle": { category: "organic", sub: "food_waste" },
  "espresso": { category: "organic", sub: "food_waste" },
  "eggnog": { category: "organic", sub: "food_waste" },
  // Organic - Garden
  "daisy": { category: "organic", sub: "garden_waste" },
  "rose": { category: "organic", sub: "garden_waste" },
  "sunflower": { category: "organic", sub: "garden_waste" },
  "flowerpot": { category: "organic", sub: "garden_waste" },
  "hay": { category: "organic", sub: "garden_waste" },
  "coral fungus": { category: "organic", sub: "garden_waste" },
  "bolete": { category: "organic", sub: "garden_waste" },
  "agaric": { category: "organic", sub: "garden_waste" },
  "stinkhorn": { category: "organic", sub: "garden_waste" },
  "earthstar": { category: "organic", sub: "garden_waste" },
  "hen-of-the-woods": { category: "organic", sub: "garden_waste" },

  // E-Waste - Electronics
  "desktop computer": { category: "e-waste", sub: "electronics" },
  "notebook": { category: "e-waste", sub: "electronics" },
  "laptop": { category: "e-waste", sub: "electronics" },
  "hand-held computer": { category: "e-waste", sub: "electronics" },
  "computer keyboard": { category: "e-waste", sub: "electronics" },
  "mouse": { category: "e-waste", sub: "electronics" },
  "monitor": { category: "e-waste", sub: "electronics" },
  "screen": { category: "e-waste", sub: "electronics" },
  "television": { category: "e-waste", sub: "electronics" },
  "iPod": { category: "e-waste", sub: "electronics" },
  "cellular telephone": { category: "e-waste", sub: "electronics" },
  "dial telephone": { category: "e-waste", sub: "electronics" },
  "pay-phone": { category: "e-waste", sub: "electronics" },
  "remote control": { category: "e-waste", sub: "electronics" },
  "joystick": { category: "e-waste", sub: "electronics" },
  "web site": { category: "e-waste", sub: "electronics" },
  "printer": { category: "e-waste", sub: "electronics" },
  "modem": { category: "e-waste", sub: "electronics" },
  "hard disc": { category: "e-waste", sub: "electronics" },
  "abacus": { category: "e-waste", sub: "electronics" },
  "digital watch": { category: "e-waste", sub: "electronics" },
  "digital clock": { category: "e-waste", sub: "electronics" },
  "analog clock": { category: "e-waste", sub: "electronics" },
  "wall clock": { category: "e-waste", sub: "electronics" },
  "stopwatch": { category: "e-waste", sub: "electronics" },
  "cassette player": { category: "e-waste", sub: "electronics" },
  "CD player": { category: "e-waste", sub: "electronics" },
  "tape player": { category: "e-waste", sub: "electronics" },
  "radio": { category: "e-waste", sub: "electronics" },
  "loudspeaker": { category: "e-waste", sub: "electronics" },
  "microphone": { category: "e-waste", sub: "electronics" },
  "headphone": { category: "e-waste", sub: "electronics" },
  "Polaroid camera": { category: "e-waste", sub: "electronics" },
  "reflex camera": { category: "e-waste", sub: "electronics" },
  "projector": { category: "e-waste", sub: "electronics" },
  // E-Waste - Appliances
  "space heater": { category: "e-waste", sub: "appliances" },
  "vacuum": { category: "e-waste", sub: "appliances" },
  "electric fan": { category: "e-waste", sub: "appliances" },
  "iron": { category: "e-waste", sub: "appliances" },
  "toaster": { category: "e-waste", sub: "appliances" },
  "microwave": { category: "e-waste", sub: "appliances" },
  "waffle iron": { category: "e-waste", sub: "appliances" },
  "dishwasher": { category: "e-waste", sub: "appliances" },
  "refrigerator": { category: "e-waste", sub: "appliances" },
  "washer": { category: "e-waste", sub: "appliances" },
  "washing machine": { category: "e-waste", sub: "appliances" },
  "rotisserie": { category: "e-waste", sub: "appliances" },

  // Plastic
  "water bottle": { category: "plastic", sub: "bottles" },
  "water jug": { category: "plastic", sub: "bottles" },
  "plastic bag": { category: "plastic", sub: "bags" },
  "shopping basket": { category: "plastic", sub: "bags" },
  "trash can": { category: "plastic", sub: "packaging" },
  "ashcan": { category: "plastic", sub: "packaging" },
  "plate": { category: "plastic", sub: "packaging" },
  "tray": { category: "plastic", sub: "packaging" },
  "Crock Pot": { category: "plastic", sub: "packaging" },
  "tennis ball": { category: "plastic", sub: "packaging" },
  "golf ball": { category: "plastic", sub: "packaging" },
  "ping-pong ball": { category: "plastic", sub: "packaging" },
  "rugby ball": { category: "plastic", sub: "packaging" },
  "soccer ball": { category: "plastic", sub: "packaging" },
  "basketball": { category: "plastic", sub: "packaging" },
  "volleyball": { category: "plastic", sub: "packaging" },
  "frisbee": { category: "plastic", sub: "packaging" },
  "sunglasses": { category: "plastic", sub: "packaging" },
  "sunglass": { category: "plastic", sub: "packaging" },
  "rubber eraser": { category: "plastic", sub: "packaging" },
  "diaper": { category: "plastic", sub: "packaging" },
  "Band Aid": { category: "plastic", sub: "packaging" },
  "ballpoint": { category: "plastic", sub: "packaging" },
  "fountain pen": { category: "plastic", sub: "packaging" },
  "toothbrush": { category: "plastic", sub: "packaging" },
  "running shoe": { category: "plastic", sub: "packaging" },
  "Loafer": { category: "plastic", sub: "packaging" },
  "sandal": { category: "plastic", sub: "packaging" },
  "clog": { category: "plastic", sub: "packaging" },

  // Hazardous
  "syringe": { category: "hazardous", sub: "medical" },
  "stethoscope": { category: "hazardous", sub: "medical" },
  "pill bottle": { category: "hazardous", sub: "medical" },
  "face powder": { category: "hazardous", sub: "chemicals" },
  "perfume": { category: "hazardous", sub: "chemicals" },
  "lotion": { category: "hazardous", sub: "chemicals" },
  "paintbrush": { category: "hazardous", sub: "chemicals" },
  "torch": { category: "hazardous", sub: "chemicals" },
  "lighter": { category: "hazardous", sub: "chemicals" },
  "matchstick": { category: "hazardous", sub: "chemicals" },
  "candle": { category: "hazardous", sub: "chemicals" },
  "gas pump": { category: "hazardous", sub: "automotive" },

  // General Waste
  "pillow": { category: "general", sub: "textiles" },
  "quilt": { category: "general", sub: "textiles" },
  "sleeping bag": { category: "general", sub: "textiles" },
  "teddy": { category: "general", sub: "textiles" },
  "Windsor tie": { category: "general", sub: "textiles" },
  "bow tie": { category: "general", sub: "textiles" },
  "sock": { category: "general", sub: "textiles" },
  "poncho": { category: "general", sub: "textiles" },
  "kimono": { category: "general", sub: "textiles" },
  "lab coat": { category: "general", sub: "textiles" },
  "apron": { category: "general", sub: "textiles" },
  "jean": { category: "general", sub: "textiles" },
  "jersey": { category: "general", sub: "textiles" },
  "sweatshirt": { category: "general", sub: "textiles" },
  "suit": { category: "general", sub: "textiles" },
  "rocking chair": { category: "general", sub: "furniture" },
  "folding chair": { category: "general", sub: "furniture" },
  "barber chair": { category: "general", sub: "furniture" },
  "studio couch": { category: "general", sub: "furniture" },
  "desk": { category: "general", sub: "furniture" },
  "dining table": { category: "general", sub: "furniture" },
  "bookcase": { category: "general", sub: "furniture" },
  "china cabinet": { category: "general", sub: "furniture" },
  "wardrobe": { category: "general", sub: "furniture" },
  "four-poster": { category: "general", sub: "furniture" },
  "park bench": { category: "general", sub: "furniture" },
}

// ==========================================
// COCO-SSD class-to-waste mapping (80 COCO classes)
// ==========================================
const COCO_CLASS_MAP: Record<string, WasteCategory> = {
  // Organic
  "banana": "organic", "apple": "organic", "orange": "organic",
  "broccoli": "organic", "carrot": "organic", "hot dog": "organic",
  "pizza": "organic", "donut": "organic", "cake": "organic",
  "sandwich": "organic", "potted plant": "organic",
  "bird": "organic", "cat": "organic", "dog": "organic",
  "horse": "organic", "sheep": "organic", "cow": "organic",
  "elephant": "organic", "bear": "organic", "zebra": "organic", "giraffe": "organic",
  // E-Waste
  "laptop": "e-waste", "tv": "e-waste", "remote": "e-waste",
  "cell phone": "e-waste", "keyboard": "e-waste", "mouse": "e-waste",
  "microwave": "e-waste", "oven": "e-waste", "toaster": "e-waste",
  "refrigerator": "e-waste", "clock": "e-waste", "hair drier": "e-waste",
  // Recyclable
  "bottle": "recyclable", "wine glass": "recyclable", "cup": "recyclable",
  "fork": "recyclable", "knife": "recyclable", "spoon": "recyclable",
  "bowl": "recyclable", "vase": "recyclable", "scissors": "recyclable",
  // Plastic
  "sports ball": "plastic", "frisbee": "plastic",
  "skateboard": "plastic", "surfboard": "plastic",
  "tennis racket": "plastic", "baseball bat": "plastic",
  "baseball glove": "plastic", "kite": "plastic",
  "umbrella": "plastic", "handbag": "plastic", "suitcase": "plastic",
  "backpack": "plastic", "toothbrush": "plastic",
  // General
  "chair": "general", "couch": "general", "bed": "general",
  "dining table": "general", "toilet": "general", "sink": "general",
  "book": "general", "teddy bear": "general",
  "tie": "general", "person": "general",
  // Vehicles (general)
  "bicycle": "general", "car": "general", "motorcycle": "general",
  "airplane": "general", "bus": "general", "train": "general",
  "truck": "general", "boat": "general",
  "traffic light": "general", "fire hydrant": "general",
  "stop sign": "general", "parking meter": "general", "bench": "general",
}

// ==========================================
// KEYWORD FALLBACK MAPPING
// ==========================================
const WASTE_CATEGORY_KEYWORDS: Record<WasteCategory, string[]> = {
  recyclable: [
    "bottle", "can", "tin", "jar", "container", "carton", "box", "cardboard",
    "paper", "newspaper", "magazine", "envelope", "book", "notebook",
    "glass", "wine bottle", "beer bottle", "water bottle", "pop bottle",
    "aluminum", "metal", "steel", "iron", "brass", "copper", "bronze",
    "cup", "mug", "pitcher", "vase", "bowl", "pot", "pan", "kettle",
    "packet", "wrapper", "bag", "sack", "basket", "crate",
    "mailbox", "letterbox", "bucket", "pail", "barrel",
    "screw", "nail", "bolt", "wrench", "pliers", "screwdriver",
    "hammer", "saw", "drill", "clamp", "chain", "wire",
    "tub", "basin", "sink", "fountain",
  ],
  organic: [
    "banana", "apple", "orange", "lemon", "strawberry", "pineapple", "grape",
    "peach", "pear", "cherry", "plum", "mango", "melon", "watermelon", "kiwi",
    "coconut", "avocado", "fig", "pomegranate", "papaya", "guava",
    "broccoli", "cauliflower", "cucumber", "mushroom", "corn", "ear",
    "tomato", "potato", "onion", "garlic", "carrot", "lettuce", "spinach",
    "pepper", "celery", "radish", "turnip", "beet", "squash", "zucchini",
    "eggplant", "cabbage", "pea", "bean", "lentil", "chickpea",
    "food", "meat", "bread", "pizza", "burger", "sandwich", "hotdog",
    "pasta", "noodle", "rice", "sushi", "taco", "wrap",
    "salad", "soup", "fruit", "vegetable", "leaf", "plant", "flower",
    "tree", "grass", "wood", "timber", "log", "stick", "branch",
    "hay", "straw", "grain", "wheat", "seed", "nut",
    "egg", "cheese", "cake", "chocolate", "cookie", "biscuit", "waffle",
    "coffee", "tea", "juice", "milk", "yogurt", "cream", "butter",
    "potpie", "trifle", "carbonara", "guacamole", "dough", "pretzel",
    "burrito", "cheeseburger", "bagel", "loaf", "meatloaf",
    "ice cream", "ice lolly", "espresso", "eggnog",
    "daisy", "rose", "sunflower", "tulip", "orchid", "lily",
    "fungus", "bolete", "agaric",
  ],
  "e-waste": [
    "computer", "laptop", "keyboard", "mouse", "monitor", "screen", "display",
    "phone", "cellphone", "smartphone", "telephone", "cellular", "mobile",
    "television", "tv", "remote", "speaker", "headphone", "earphone", "earbud",
    "camera", "projector", "printer", "scanner", "copier", "fax",
    "circuit", "chip", "processor", "motherboard", "hard drive", "memory",
    "cable", "wire", "cord", "plug", "socket", "switch", "outlet",
    "battery", "charger", "adapter", "transformer", "power supply",
    "radio", "clock", "watch", "calculator", "console", "gamepad",
    "modem", "router", "hub", "server", "rack", "antenna",
    "iPod", "mp3", "digital", "electronic", "electric",
    "joystick", "controller", "microphone", "webcam", "sensor",
    "notebook computer", "desktop computer", "hand-held computer",
    "space heater", "vacuum", "toaster", "oven", "microwave",
    "washing machine", "dishwasher", "refrigerator", "freezer",
    "blender", "mixer", "dryer", "fan", "heater", "cooler",
    "cassette", "disc", "CD", "DVD", "tape", "VCR",
    "LED", "bulb", "lamp", "flashlight",
  ],
  plastic: [
    "plastic", "polythene", "nylon", "synthetic", "rubber", "silicone",
    "styrofoam", "foam", "polystyrene", "polyethylene", "PVC", "PET",
    "water jug", "measuring cup", "ladle", "spatula", "container",
    "toothbrush", "comb", "hairbrush", "pen", "pencil", "ruler", "eraser",
    "toy", "doll", "ball", "frisbee", "action figure",
    "sunglasses", "goggles", "mask", "helmet", "visor",
    "shoe", "sandal", "flip flop", "slipper", "boot", "sneaker",
    "clothes hanger", "clip", "pin", "button",
    "trash can", "waste bin", "dustbin",
    "straw", "fork", "spoon", "knife", "plate", "cup",
    "diaper", "wrapper", "film", "tape", "shrink wrap",
    "shopping bag", "carrier bag", "bin bag", "garbage bag",
    "tupperware", "lunch box", "food container",
    "shower curtain", "raincoat", "umbrella",
  ],
  hazardous: [
    "chemical", "acid", "toxic", "poison", "biohazard", "corrosive",
    "syringe", "needle", "scalpel", "medical", "surgical",
    "gas mask", "hazmat", "radioactive", "nuclear", "radiation",
    "paint", "spray", "aerosol", "solvent", "glue", "adhesive",
    "mercury", "lead", "asbestos", "pesticide", "arsenic",
    "fire extinguisher", "lighter", "match", "candle", "torch", "flare",
    "medicine", "pill", "capsule", "drug", "prescription", "pharmacy",
    "oil", "gasoline", "fuel", "diesel", "petroleum", "kerosene",
    "fertilizer", "insecticide", "herbicide", "fungicide",
    "bleach", "ammonia", "detergent", "cleaner", "disinfectant",
    "thermometer", "barometer", "gauge", "meter",
    "antifreeze", "brake fluid", "transmission fluid",
    "battery acid", "pool chemical", "chlorine",
  ],
  general: [
    "pillow", "cushion", "blanket", "quilt", "mattress", "bedding",
    "carpet", "rug", "mat", "curtain", "drape", "blind",
    "furniture", "chair", "table", "desk", "bed", "sofa", "couch",
    "bench", "stool", "shelf", "cabinet", "dresser", "wardrobe",
    "door", "window", "wall", "floor", "roof", "tile", "ceiling",
    "brick", "concrete", "stone", "rock", "gravel", "sand",
    "ceramic", "porcelain", "pottery", "clay", "plaster",
    "mirror", "frame", "picture", "painting", "poster",
    "umbrella", "fan", "broom", "mop", "sponge", "duster",
    "towel", "cloth", "fabric", "textile", "linen", "cotton",
    "rope", "chain", "hook", "nail", "screw",
    "lock", "key", "handle", "knob", "hinge", "latch",
    "canopy", "awning", "tent", "tarp",
    "car", "truck", "van", "bus", "vehicle", "automobile",
    "bicycle", "motorcycle", "scooter", "skateboard",
  ],
}

// ==========================================
// SUB-CATEGORY DETECTION
// ==========================================
const SUB_CATEGORY_KEYWORDS: Record<SubCategory, string[]> = {
  paper: ["paper", "newspaper", "magazine", "envelope", "book", "cardstock"],
  glass: ["glass", "bottle", "jar", "goblet", "vase", "crystal"],
  metal: ["metal", "aluminum", "steel", "iron", "brass", "copper", "tin", "can"],
  cardboard: ["cardboard", "carton", "box", "crate"],
  food_waste: ["food", "fruit", "vegetable", "meat", "bread", "pizza", "burger",
    "banana", "apple", "orange", "cake", "cheese", "egg", "rice", "pasta",
    "mushroom", "corn", "broccoli", "salad", "sandwich", "soup"],
  garden_waste: ["plant", "flower", "leaf", "grass", "tree", "branch", "wood",
    "hay", "straw", "seed", "daisy", "rose", "sunflower"],
  electronics: ["computer", "laptop", "phone", "tablet", "keyboard", "mouse",
    "monitor", "television", "tv", "remote", "camera", "printer", "speaker",
    "radio", "clock", "watch", "calculator", "console", "iPod"],
  batteries: ["battery", "cell", "charger", "power bank"],
  appliances: ["refrigerator", "washing machine", "dishwasher", "oven", "toaster",
    "microwave", "blender", "vacuum", "dryer", "heater", "fan", "iron"],
  bottles: ["bottle", "jug", "flask", "canteen"],
  packaging: ["wrapper", "packaging", "container", "bag", "box", "carton", "tray"],
  bags: ["bag", "sack", "pouch", "carrier"],
  chemicals: ["chemical", "paint", "solvent", "acid", "bleach", "cleaner",
    "ammonia", "detergent", "pesticide", "fertilizer"],
  medical: ["syringe", "needle", "medicine", "pill", "capsule", "medical",
    "surgical", "bandage", "stethoscope"],
  automotive: ["oil", "gasoline", "fuel", "diesel", "brake", "antifreeze",
    "transmission", "motor"],
  furniture: ["chair", "table", "desk", "bed", "sofa", "couch", "shelf",
    "cabinet", "dresser", "wardrobe", "bench", "stool"],
  textiles: ["cloth", "fabric", "textile", "clothing", "shirt", "dress",
    "jacket", "coat", "jean", "sock", "towel", "blanket", "quilt",
    "pillow", "curtain", "linen"],
  ceramics: ["ceramic", "porcelain", "pottery", "clay", "tile"],
  mixed: ["mixed", "composite"],
  unknown: [],
}

function detectSubCategory(className: string, category: WasteCategory): SubCategory {
  const lower = className.toLowerCase()
  for (const [name, mapping] of Object.entries(EXACT_CLASS_MAP)) {
    if (lower.includes(name.toLowerCase()) && mapping.category === category) {
      return mapping.sub
    }
  }
  let bestSub: SubCategory = "unknown"
  let bestLen = 0
  for (const [sub, keywords] of Object.entries(SUB_CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw) && kw.length > bestLen) {
        bestLen = kw.length
        bestSub = sub as SubCategory
      }
    }
  }
  return bestSub
}

// ==========================================
// STATIC DATA
// ==========================================
const DISPOSAL_INSTRUCTIONS: Record<WasteCategory, string> = {
  recyclable: "Clean the item thoroughly and place in the recycling bin. Remove any labels or caps. Flatten cardboard boxes. Separate different materials if possible. Check for recycling symbols.",
  organic: "Place in a composting bin or organic waste container. Avoid mixing with non-biodegradable items. Can be used for home composting to create nutrient-rich soil. Remove any stickers or packaging first.",
  "e-waste": "Take to a certified e-waste recycling center. Never throw in regular trash. Remove batteries separately. Many electronics retailers offer free recycling programs. Wipe personal data before disposal.",
  plastic: "Check the recycling number (1-7) on the item. Types 1 (PET) and 2 (HDPE) are most commonly recycled. Clean and dry before recycling. Remove caps and labels when possible.",
  hazardous: "NEVER place in regular trash. Take to a hazardous waste collection facility. Store separately in sealed containers. Contact local waste authority for special collection schedules.",
  general: "Place in general waste bin for landfill disposal. Consider if the item can be donated or repurposed before discarding. Check if any parts can be separated for recycling.",
}

const ENVIRONMENTAL_IMPACT: Record<WasteCategory, string> = {
  recyclable: "Recycling this item saves energy, reduces mining of raw materials, and prevents greenhouse gas emissions. One recycled can saves enough energy to run a TV for 3 hours.",
  organic: "Composting organic waste reduces methane emissions from landfills and creates natural fertilizer. Food waste in landfills generates methane, 25x more potent than CO2.",
  "e-waste": "Proper e-waste recycling recovers valuable metals like gold, silver, and copper while preventing toxic materials like lead and mercury from contaminating soil and water.",
  plastic: "Recycling plastic reduces ocean pollution and the 8 million tons entering our oceans annually. A single plastic bottle takes 450 years to decompose.",
  hazardous: "Proper hazardous waste disposal prevents soil contamination, water pollution, and protects human health. One gallon of motor oil can contaminate one million gallons of water.",
  general: "While general waste goes to landfill, reducing overall waste and choosing reusable alternatives significantly lowers your environmental footprint. The average person generates 4.4 lbs of waste daily.",
}

export const CATEGORY_CONFIG: Record<
  WasteCategory,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  recyclable: {
    label: "Recyclable",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  organic: {
    label: "Organic",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  "e-waste": {
    label: "E-Waste",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  plastic: {
    label: "Plastic",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
  hazardous: {
    label: "Hazardous",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  general: {
    label: "General Waste",
    color: "text-neutral-400",
    bgColor: "bg-neutral-500/10",
    borderColor: "border-neutral-500/20",
  },
}

// ==========================================
// MAPPING FUNCTIONS
// ==========================================
function mapToWasteCategory(className: string): WasteCategory {
  const lowerName = className.toLowerCase()
  // Tier 1: Exact class name lookup
  const classNames = className.split(",").map((s) => s.trim())
  for (const name of classNames) {
    if (EXACT_CLASS_MAP[name]) return EXACT_CLASS_MAP[name].category
  }
  // Tier 2: Keyword scoring
  let bestCategory: WasteCategory = "general"
  let bestScore = 0
  for (const [category, keywords] of Object.entries(WASTE_CATEGORY_KEYWORDS)) {
    let score = 0
    for (const keyword of keywords) {
      if (lowerName.includes(keyword.toLowerCase())) {
        score += keyword.length * keyword.length
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestCategory = category as WasteCategory
    }
  }
  return bestCategory
}

// ==========================================
// MODEL LOADING
// ==========================================
let mobilenetModel: mobilenet.MobileNet | null = null
let cocoModel: cocoSsdTypes.ObjectDetection | null = null
let cocoLoadFailed = false

export async function loadModel(
  onProgress?: (msg: string) => void
): Promise<{ mobilenet: mobilenet.MobileNet; coco: cocoSsdTypes.ObjectDetection | null }> {
  await tf.ready()
  if (tf.getBackend() !== "webgl") {
    try { await tf.setBackend("webgl") } catch { /* fallback to cpu */ }
  }

  // Load MobileNet
  if (!mobilenetModel) {
    onProgress?.("Loading MobileNet V2 (image classifier)...")
    mobilenetModel = await mobilenet.load({ version: 2, alpha: 1.0 })
  }

  // Load COCO-SSD (object detector) - graceful fallback
  if (!cocoModel && !cocoLoadFailed) {
    try {
      onProgress?.("Loading COCO-SSD (object detector)...")
      const cocoSsd = await import("@tensorflow-models/coco-ssd")
      cocoModel = await cocoSsd.load({ base: "lite_mobilenet_v2" })
    } catch {
      cocoLoadFailed = true
    }
  }

  onProgress?.("Models ready!")
  return { mobilenet: mobilenetModel, coco: cocoModel }
}

// ==========================================
// IMAGE PREPROCESSING
// ==========================================
function createCrop(
  img: HTMLImageElement,
  sx: number, sy: number, sSize: number, outSize: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = outSize
  canvas.height = outSize
  const ctx = canvas.getContext("2d")!
  ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, outSize, outSize)
  return canvas
}

function getMultiCrops(img: HTMLImageElement): HTMLCanvasElement[] {
  const size = Math.min(img.width, img.height)
  const cropSize = Math.floor(size * 0.85)
  const outSize = 224

  // Center crop
  const cx = (img.width - size) / 2
  const cy = (img.height - size) / 2
  const centerCrop = createCrop(img, cx, cy, size, outSize)

  // 4 corner crops (smaller region for diversity)
  const crops = [centerCrop]
  const offsets = [
    [0, 0],
    [img.width - cropSize, 0],
    [0, img.height - cropSize],
    [img.width - cropSize, img.height - cropSize],
  ]
  for (const [ox, oy] of offsets) {
    crops.push(createCrop(img, ox, oy, cropSize, outSize))
  }
  return crops
}

// ==========================================
// MAIN CLASSIFICATION (Multi-Model Ensemble)
// ==========================================
export async function classifyImage(
  imageElement: HTMLImageElement,
  onProgress?: (msg: string) => void
): Promise<ClassificationResult> {
  const models = await loadModel(onProgress)
  const modelsUsed: string[] = ["MobileNet V2"]

  // ------- MobileNet multi-crop inference -------
  onProgress?.("Running MobileNet multi-crop inference...")
  const crops = getMultiCrops(imageElement)

  // Classify each crop and collect all predictions
  const allMobilenetPreds: Array<{ className: string; probability: number }> = []
  for (const crop of crops) {
    const preds = await models.mobilenet.classify(crop, 10)
    allMobilenetPreds.push(...preds)
  }

  // Aggregate: average probabilities for duplicate class names
  const classAggregator = new Map<string, { totalProb: number; count: number }>()
  for (const pred of allMobilenetPreds) {
    const key = pred.className
    const existing = classAggregator.get(key)
    if (existing) {
      existing.totalProb += pred.probability
      existing.count++
    } else {
      classAggregator.set(key, { totalProb: pred.probability, count: 1 })
    }
  }
  const aggregatedPreds = Array.from(classAggregator.entries())
    .map(([className, { totalProb, count }]) => ({
      className,
      probability: totalProb / count,
      appearedInCrops: count,
    }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 15)

  // Map to waste categories with rank-based weighting
  const mobilenetScores: Record<WasteCategory, number> = {
    recyclable: 0, organic: 0, "e-waste": 0, plastic: 0, hazardous: 0, general: 0,
  }
  const mobilenetVotes: Record<WasteCategory, number> = {
    recyclable: 0, organic: 0, "e-waste": 0, plastic: 0, hazardous: 0, general: 0,
  }

  const mappedPredictions = aggregatedPreds.map((p, rank) => {
    const cat = mapToWasteCategory(p.className)
    const rankWeight = Math.exp(-0.25 * rank)
    // Bonus for predictions that appear in multiple crops (more reliable)
    const cropBonus = 1 + (p.appearedInCrops - 1) * 0.15
    const weight = p.probability * rankWeight * cropBonus
    mobilenetScores[cat] += weight
    mobilenetVotes[cat]++
    return { className: p.className, probability: p.probability, mappedCategory: cat }
  })

  // ------- COCO-SSD object detection -------
  let detectedObjects: Array<{ class: string; score: number }> = []
  const cocoScores: Record<WasteCategory, number> = {
    recyclable: 0, organic: 0, "e-waste": 0, plastic: 0, hazardous: 0, general: 0,
  }

  if (models.coco) {
    try {
      onProgress?.("Running COCO-SSD object detection...")
      modelsUsed.push("COCO-SSD")
      // Use center crop for COCO-SSD
      const centerCanvas = createCrop(
        imageElement,
        (imageElement.width - Math.min(imageElement.width, imageElement.height)) / 2,
        (imageElement.height - Math.min(imageElement.width, imageElement.height)) / 2,
        Math.min(imageElement.width, imageElement.height),
        300 // COCO-SSD works well with 300x300
      )
      const cocoDetections = await models.coco.detect(centerCanvas, 10, 0.15)
      detectedObjects = cocoDetections.map((d) => ({ class: d.class, score: d.score }))

      for (const det of cocoDetections) {
        const cat = COCO_CLASS_MAP[det.class] ?? "general"
        cocoScores[cat] += det.score
      }
    } catch {
      // COCO-SSD failed for this image, continue with MobileNet only
    }
  }

  // ------- Ensemble Fusion -------
  onProgress?.("Fusing ensemble results...")
  const MOBILENET_WEIGHT = models.coco && detectedObjects.length > 0 ? 0.6 : 1.0
  const COCO_WEIGHT = models.coco && detectedObjects.length > 0 ? 0.4 : 0.0

  const fusedScores: Record<WasteCategory, number> = {
    recyclable: 0, organic: 0, "e-waste": 0, plastic: 0, hazardous: 0, general: 0,
  }
  for (const cat of Object.keys(fusedScores) as WasteCategory[]) {
    fusedScores[cat] = mobilenetScores[cat] * MOBILENET_WEIGHT + cocoScores[cat] * COCO_WEIGHT
  }

  // Find winner
  let bestCategory: WasteCategory = "general"
  let bestScore = 0
  for (const [cat, score] of Object.entries(fusedScores)) {
    if (score > bestScore) {
      bestScore = score
      bestCategory = cat as WasteCategory
    }
  }

  // Confidence calibration
  const totalFused = Object.values(fusedScores).reduce((a, b) => a + b, 0)
  let confidence = totalFused > 0 ? bestScore / totalFused : 0

  // Consensus bonus from MobileNet votes
  const totalVotes = Object.values(mobilenetVotes).reduce((a, b) => a + b, 0)
  const voteRatio = totalVotes > 0 ? mobilenetVotes[bestCategory] / totalVotes : 0
  confidence = confidence * 0.65 + voteRatio * 0.25

  // COCO agreement bonus: if COCO top detection matches MobileNet, boost confidence
  if (detectedObjects.length > 0) {
    const topCocoClass = detectedObjects[0].class
    const topCocoCategory = COCO_CLASS_MAP[topCocoClass] ?? "general"
    if (topCocoCategory === bestCategory) {
      confidence += 0.1
    }
  }

  confidence = Math.min(Math.max(confidence, 0.05), 0.99)

  // Detect sub-category and material
  const topClassName = aggregatedPreds[0]?.className ?? ""
  const subCategory = detectSubCategory(topClassName, bestCategory)
  const topForCategory = mappedPredictions.find((p) => p.mappedCategory === bestCategory)
  const detectedMaterial = topForCategory
    ? topForCategory.className.split(",")[0].trim()
    : "Unknown item"

  return {
    category: bestCategory,
    subCategory,
    confidence,
    topPredictions: mappedPredictions.slice(0, 5),
    disposalInstructions: DISPOSAL_INSTRUCTIONS[bestCategory],
    recyclable: bestCategory === "recyclable" || bestCategory === "plastic",
    environmentalImpact: ENVIRONMENTAL_IMPACT[bestCategory],
    detectedMaterial,
    detectedObjects: detectedObjects.slice(0, 5),
    modelsUsed,
  }
}
