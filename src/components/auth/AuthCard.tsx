"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { AuthState } from "@/app/(auth)/actions";

type Props = {
  mode: "signup" | "login";
  action: (prev: AuthState, form: FormData) => Promise<AuthState>;
};

/** Account card — styled after the "portal" card in Stitch `welcome_authentication_sola`. */
export function AuthCard({ mode, action }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const isSignup = mode === "signup";

  return (
    <section className="relative w-full max-w-[420px] overflow-hidden rounded-2xl bg-surface-container-lowest p-7 shadow-[0_24px_48px_-12px_rgba(31,30,29,0.08)] sm:p-9">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-blush/25 blur-3xl"
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="label-caps text-on-surface-variant">
            {isSignup ? "Create your wardrobe" : "Access your wardrobe"}
          </p>
          <h1 className="mt-2 font-serif text-headline-sm font-normal">
            {isSignup ? "Join SOLA" : "Welcome back"}
          </h1>
        </div>
        <nav
          aria-label="Account"
          className="flex shrink-0 rounded-full bg-surface-container p-1 text-[11px] font-medium"
        >
          <Link
            href="/signup"
            aria-current={isSignup ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 ${isSignup ? "bg-primary-container text-white" : "text-on-surface-variant"}`}
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            aria-current={!isSignup ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 ${!isSignup ? "bg-primary-container text-white" : "text-on-surface-variant"}`}
          >
            Log In
          </Link>
        </nav>
      </div>

      <form action={formAction} className="relative mt-8 space-y-5">
        {isSignup && (
          <Field label="First name" name="name" autoComplete="given-name" icon="person" placeholder="Maya" />
        )}
        <Field label="Email" name="email" type="email" autoComplete="email" icon="mail" placeholder="you@email.com" />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          icon="lock"
          placeholder={isSignup ? "At least 8 characters" : "••••••••"}
        />

        {state?.error && (
          <p role="alert" className="rounded-lg bg-error-container/60 px-4 py-3 text-body-sm text-on-error-container">
            {state.error}
          </p>
        )}
        {state?.info && (
          <p role="status" className="rounded-lg bg-blush-wash px-4 py-3 text-body-sm text-on-surface">
            {state.info}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary-container text-label-md font-medium text-white transition-colors hover:bg-[#363432] disabled:opacity-60"
        >
          {pending ? "One moment…" : isSignup ? "Begin Personal Style Setup" : "Enter Your Atelier"}
          {!pending && <Icon name="arrow_forward" size={16} />}
        </button>
      </form>

      <p className="relative mt-6 flex items-center gap-2 rounded-lg bg-surface-container-low px-4 py-3 text-[11px] leading-relaxed text-on-surface-variant">
        <Icon name="verified_user" size={16} />
        Your wardrobe photos stay private to your account.
      </p>
    </section>
  );
}

function Field({
  label,
  icon,
  ...input
}: { label: string; icon: string } & React.ComponentProps<"input">) {
  return (
    <label className="block">
      <span className="label-caps text-on-surface-variant">{label}</span>
      <span className="mt-2 flex h-12 items-center gap-3 rounded-lg border border-transparent bg-surface-container-low px-4 focus-within:border-champagne">
        <Icon name={icon} size={18} className="text-outline" />
        <input
          required
          className="w-full bg-transparent text-body-md outline-none placeholder:text-outline placeholder:italic"
          {...input}
        />
      </span>
    </label>
  );
}
