import { requireOnboardingStep } from "@/lib/onboarding/guard";
import { Questionnaire } from "@/components/onboarding/Questionnaire";
import type { QuestionnaireAnswers } from "@/lib/style/questions";

export const metadata = { title: "Your style — SOLA" };

export default async function StyleStepPage() {
  const ctx = await requireOnboardingStep("style");
  const { data } = await ctx.supabase
    .from("style_profiles")
    .select("questionnaire")
    .eq("user_id", ctx.user.id)
    .single();
  return (
    <Questionnaire
      initial={(data?.questionnaire as QuestionnaireAnswers | null) ?? {}}
      mode="onboarding"
    />
  );
}
