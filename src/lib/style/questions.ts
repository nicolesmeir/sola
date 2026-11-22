/**
 * The 4-question style questionnaire. Content comes from the Stitch screens
 * `personal_style_questionnaire_simplified_step_1` and `personal_style_questionnaire_3`.
 */
export type QuestionOption = {
  id: string;
  label: string;
  description: string;
  image?: string;
  swatches?: string[];
  icon?: string;
};

export type Question = {
  id: "aesthetic" | "palette" | "silhouette" | "occasions";
  eyebrow: string;
  title: string;
  subtitle: string;
  kind: "image" | "swatch" | "icon" | "chips";
  multiple: boolean;
  options: QuestionOption[];
};

export const QUESTIONS: Question[] = [
  {
    id: "aesthetic",
    eyebrow: "Aesthetic Mood",
    title: "What is your core daily aesthetic?",
    subtitle: "Select the signature tone that best matches your lifestyle. Choose one or more.",
    kind: "image",
    multiple: true,
    options: [
      { id: "quiet-luxury", label: "Quiet Luxury Minimalist", description: "Clean lines, neutral palette & cashmere", image: "/questionnaire/quiet-luxury.jpg" },
      { id: "french-classic", label: "Downtown French Classic", description: "Effortless trench coats, denim & loafers", image: "/questionnaire/french-classic.jpg" },
      { id: "academic-tailored", label: "Academic Tailored", description: "Structured blazers, wool trousers & oxfords", image: "/questionnaire/academic-tailored.jpg" },
      { id: "elevated-casual", label: "Elevated Casual", description: "Textured knits, relaxed silhouettes & flats", image: "/questionnaire/elevated-casual.jpg" },
    ],
  },
  {
    id: "palette",
    eyebrow: "Tone & Palette",
    title: "Which colours feel most like you?",
    subtitle: "This sets the tonal baseline for your daily recommendations.",
    kind: "swatch",
    multiple: true,
    options: [
      { id: "warm-neutrals", label: "Warm Neutrals & Cream", description: "Oatmeal, raw linen, ivory & warm hazel", swatches: ["#E9DFD0", "#F6F0E6", "#C8B69B", "#8A6F55"] },
      { id: "earthy", label: "Earthy Terracotta & Olive", description: "Clay, moss, sage & bronze", swatches: ["#B8664A", "#6B6B3A", "#A3AD8F", "#8C6A3F"] },
      { id: "soft-pastels", label: "Soft Pastels & Rose Quartz", description: "Powder rose, sea salt, washed celadon", swatches: ["#E8B4B8", "#F4E3E1", "#D9E4E1", "#C9D8C5"] },
      { id: "noir-navy", label: "Timeless Noir & Navy", description: "Midnight navy, charcoal, stark bone", swatches: ["#1F2A44", "#2F2E2C", "#EDE8DE", "#000000"] },
    ],
  },
  {
    id: "silhouette",
    eyebrow: "Silhouette & Proportion",
    title: "How do you like your clothes to fit?",
    subtitle: "The balance of volume and tailoring you feel best in.",
    kind: "icon",
    multiple: false,
    options: [
      { id: "relaxed", label: "Relaxed & Oversized", description: "Effortless drape, boyfriend cuts & slouchy knits", icon: "aspect_ratio" },
      { id: "tailored", label: "Tailored & Structured", description: "Defined waists, clean seams & sharp lapels", icon: "architecture" },
      { id: "flowing", label: "Feminine & Flowing", description: "Silky fabrics, A-line skirts & soft pleats", icon: "water_drop" },
    ],
  },
  {
    id: "occasions",
    eyebrow: "Campus & Life",
    title: "Where do you spend most of your week?",
    subtitle: "Pick everything that applies — SOLA will dress you for it.",
    kind: "chips",
    multiple: true,
    options: [
      { id: "lectures", label: "Lecture halls & labs", description: "" },
      { id: "library", label: "Library study sessions", description: "" },
      { id: "presentations", label: "Presentations", description: "" },
      { id: "brunch-evenings", label: "Weekend brunch & evenings", description: "" },
      { id: "internship", label: "Internship & work days", description: "" },
      { id: "gym", label: "Gym & active days", description: "" },
    ],
  },
];

export type QuestionnaireAnswers = Partial<Record<Question["id"], string[]>>;

/** Human-readable answers for AI prompts. */
export function describeAnswers(answers: QuestionnaireAnswers): string {
  return QUESTIONS.map((q) => {
    const picked = (answers[q.id] ?? [])
      .map((id) => q.options.find((o) => o.id === id))
      .filter(Boolean)
      .map((o) => `${o!.label}${o!.description ? ` (${o!.description})` : ""}`);
    return `- ${q.title} ${picked.length ? picked.join("; ") : "no answer"}`;
  }).join("\n");
}
