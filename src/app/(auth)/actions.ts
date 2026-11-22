"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; info?: string } | undefined;

const credentials = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Your password needs at least 8 characters."),
});

export async function signUp(_prev: AuthState, form: FormData): Promise<AuthState> {
  const parsed = credentials
    .extend({ name: z.string().trim().min(1, "Please tell us your first name.").max(40) })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { display_name: parsed.data.name } },
  });
  if (error) return { error: friendly(error.message) };
  if (!data.session) {
    return { info: "Almost there — check your inbox to confirm your email, then log in." };
  }
  redirect("/onboarding/style");
}

export async function logIn(_prev: AuthState, form: FormData): Promise<AuthState> {
  const parsed = credentials.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: friendly(error.message) };
  redirect("/stylist");
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

function friendly(message: string) {
  if (/invalid login credentials/i.test(message)) return "That email and password don't match.";
  if (/already registered/i.test(message)) return "An account with this email already exists — try logging in.";
  if (/email not confirmed/i.test(message)) return "Please confirm your email first — check your inbox.";
  return "Something went wrong. Please try again.";
}
