"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { advanceTo, requireOnboardingStep, requireProfile, STEP_PATH } from "@/lib/onboarding/guard";
import { QUESTIONS } from "@/lib/style/questions";

const answersSchema = z.object(
  Object.fromEntries(
    QUESTIONS.map((q) => [
      q.id,
      z.array(z.enum(q.options.map((o) => o.id) as [string, ...string[]])).min(1),
    ]),
  ),
);

/** Saves questionnaire answers. `from` = where the form lives (onboarding or /style). */
export async function saveQuestionnaire(
  answers: unknown,
  from: "onboarding" | "profile",
): Promise<{ error: string } | void> {
  const parsed = answersSchema.safeParse(answers);
  if (!parsed.success) return { error: "Please answer every question." };

  const ctx = from === "onboarding" ? await requireOnboardingStep("style") : await requireProfile();
  const { error } = await ctx.supabase
    .from("style_profiles")
    .update({ questionnaire: parsed.data, updated_at: new Date().toISOString() })
    .eq("user_id", ctx.user.id);
  if (error) return { error: "We couldn't save your answers. Please try again." };

  if (from === "onboarding") {
    await advanceTo(ctx, "inspiration");
    redirect(STEP_PATH.inspiration);
  }
}
