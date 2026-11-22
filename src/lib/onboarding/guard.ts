import "server-only";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { ONBOARDING_ORDER, type OnboardingStep } from "@/lib/types";

export const STEP_PATH: Record<OnboardingStep, string> = {
  style: "/onboarding/style",
  inspiration: "/onboarding/inspiration",
  wardrobe: "/onboarding/wardrobe",
  review: "/onboarding/review",
  done: "/stylist",
};

/** Loads the signed-in user's profile, redirecting to /login if signed out. */
export async function requireProfile() {
  const { supabase, user } = await getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, onboarding_step")
    .eq("id", user.id)
    .single();
  return {
    supabase,
    user,
    displayName: (profile?.display_name as string | null) ?? null,
    step: ((profile?.onboarding_step as OnboardingStep | undefined) ?? "style"),
  };
}

/**
 * Onboarding pages: users may revisit earlier steps but not skip ahead.
 * Finished users are sent to the app.
 */
export async function requireOnboardingStep(page: OnboardingStep) {
  const ctx = await requireProfile();
  if (ctx.step === "done") redirect("/stylist");
  if (ONBOARDING_ORDER.indexOf(page) > ONBOARDING_ORDER.indexOf(ctx.step)) {
    redirect(STEP_PATH[ctx.step]);
  }
  return ctx;
}

/** App pages: unfinished users are sent back to their onboarding step. */
export async function requireOnboarded() {
  const ctx = await requireProfile();
  if (ctx.step !== "done") redirect(STEP_PATH[ctx.step]);
  return ctx;
}

/** Moves the user forward (never backwards) in onboarding. */
export async function advanceTo(
  ctx: Awaited<ReturnType<typeof requireProfile>>,
  next: OnboardingStep,
) {
  if (ONBOARDING_ORDER.indexOf(next) > ONBOARDING_ORDER.indexOf(ctx.step)) {
    await ctx.supabase.from("profiles").update({ onboarding_step: next }).eq("id", ctx.user.id);
  }
}
