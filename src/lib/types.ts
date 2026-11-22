export const CATEGORIES = [
  "top",
  "bottom",
  "dress",
  "outerwear",
  "shoes",
  "bag",
  "accessory",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  top: "Tops",
  bottom: "Bottoms",
  dress: "Dresses",
  outerwear: "Outerwear",
  shoes: "Shoes",
  bag: "Bags",
  accessory: "Accessories",
};

export const FORMALITIES = ["casual", "smart-casual", "formal"] as const;
export type Formality = (typeof FORMALITIES)[number];

export const SEASONS = ["all", "warm", "cold"] as const;
export type Season = (typeof SEASONS)[number];

export type ClothingItem = {
  id: string;
  user_id: string;
  image_path: string;
  name: string;
  category: Category;
  colors: string[];
  style_tags: string[];
  season: Season | null;
  formality: Formality | null;
  ai_confidence: number | null;
  user_corrected: boolean;
  created_at: string;
};

/** ClothingItem plus a short-lived signed URL for display. */
export type ClothingItemWithUrl = ClothingItem & { image_url: string };

export type StyleSummary = {
  aesthetic: string;
  palette: { name: string; hex: string }[];
  key_formulas: string[];
  summary: string;
};

export type OnboardingStep = "style" | "inspiration" | "wardrobe" | "review" | "done";
export const ONBOARDING_ORDER: OnboardingStep[] = [
  "style",
  "inspiration",
  "wardrobe",
  "review",
  "done",
];
