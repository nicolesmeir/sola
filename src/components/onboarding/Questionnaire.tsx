"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import { QUESTIONS, type QuestionnaireAnswers, type Question, type QuestionOption } from "@/lib/style/questions";
import { saveQuestionnaire } from "@/app/onboarding/actions";

type Props = {
  initial: QuestionnaireAnswers;
  mode: "onboarding" | "profile";
  onSaved?: () => void;
};

/** One question per screen — layout from Stitch `personal_style_questionnaire_simplified_step_1`. */
export function Questionnaire({ initial, mode, onSaved }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const q = QUESTIONS[index];
  const picked = answers[q.id] ?? [];
  const isLast = index === QUESTIONS.length - 1;

  function toggle(id: string) {
    setError(null);
    setAnswers((a) => {
      const current = a[q.id] ?? [];
      const next = q.multiple
        ? current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
        : [id];
      return { ...a, [q.id]: next };
    });
  }

  function next() {
    if (!picked.length) return setError("Choose at least one option to continue.");
    if (!isLast) return setIndex(index + 1);
    startTransition(async () => {
      const res = await saveQuestionnaire(answers, mode);
      if (res?.error) setError(res.error);
      else onSaved?.();
    });
  }

  return (
    <div className="mx-auto max-w-[1120px]">
      {/* Progress */}
      <div className="pt-space-md">
        <div className="flex items-center justify-between">
          <p className="label-caps text-on-surface">Question {index + 1} of {QUESTIONS.length}</p>
          <p className="label-caps text-on-surface-variant">{q.eyebrow}</p>
        </div>
        <div className="mt-3 h-px w-full bg-surface-variant">
          <div
            className="h-0.5 -translate-y-px bg-secondary transition-all duration-500"
            style={{ width: `${((index + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Heading */}
      <header className="mx-auto mt-space-lg max-w-2xl text-center">
        <p className="label-caps flex items-center justify-center gap-3 text-secondary">
          <span className="h-px w-6 bg-secondary/50" />
          Curation Profile
          <span className="h-px w-6 bg-secondary/50" />
        </p>
        <h1 className="mt-4 font-serif text-headline-lg-mobile md:text-headline-lg">{q.title}</h1>
        <p className="mt-3 text-body-md font-light text-on-surface-variant">{q.subtitle}</p>
      </header>

      {/* Options */}
      <div className="mt-space-lg">
        <Options question={q} picked={picked} onToggle={toggle} />
      </div>

      {error && (
        <p role="alert" className="mt-6 text-center text-body-sm text-error">
          {error}
        </p>
      )}

      {/* Nav */}
      <div className="mt-space-lg flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIndex(index - 1)}
          disabled={index === 0}
          className="label-caps inline-flex items-center gap-2 px-2 py-3 text-on-surface disabled:invisible"
        >
          <Icon name="arrow_back" size={16} /> Back
        </button>
        <button
          type="button"
          onClick={next}
          disabled={pending}
          className="label-caps inline-flex h-12 items-center gap-2 rounded-full bg-primary-container px-7 text-white transition-colors hover:bg-[#363432] disabled:opacity-60"
        >
          {pending ? "Saving…" : isLast ? (mode === "onboarding" ? "Save & continue" : "Save answers") : "Continue"}
          {!pending && <Icon name="arrow_forward" size={16} />}
        </button>
      </div>
    </div>
  );
}

function Options({
  question,
  picked,
  onToggle,
}: {
  question: Question;
  picked: string[];
  onToggle: (id: string) => void;
}) {
  const role = question.multiple ? "checkbox" : "radio";

  if (question.kind === "chips") {
    return (
      <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-3">
        {question.options.map((o) => {
          const on = picked.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              role={role}
              aria-checked={on}
              onClick={() => onToggle(o.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-label-md transition-colors ${
                on
                  ? "border-primary-container bg-primary-container text-white"
                  : "border-blush bg-surface-container-lowest text-on-surface hover:bg-blush-wash"
              }`}
            >
              {o.label}
              <Icon name={on ? "close" : "add"} size={16} />
            </button>
          );
        })}
      </div>
    );
  }

  const cols = question.options.length === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-2 lg:grid-cols-4";
  return (
    <div className={`grid gap-3 md:gap-6 ${cols}`}>
      {question.options.map((o) => (
        <OptionCard
          key={o.id}
          option={o}
          kind={question.kind}
          role={role}
          on={picked.includes(o.id)}
          onClick={() => onToggle(o.id)}
        />
      ))}
    </div>
  );
}

function OptionCard({
  option,
  kind,
  role,
  on,
  onClick,
}: {
  option: QuestionOption;
  kind: Question["kind"];
  role: "checkbox" | "radio";
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={on}
      onClick={onClick}
      className={`group relative flex flex-col rounded-xl border bg-surface-container-lowest p-2.5 text-left transition-all ${
        on ? "border-primary-container ring-1 ring-primary-container" : "border-surface-variant hover:border-outline-variant"
      }`}
    >
      <span
        className={`absolute top-4 right-4 z-10 flex h-6 w-6 md:top-5 md:right-5 md:h-7 md:w-7 items-center justify-center rounded-full ${
          on ? "bg-primary-container text-white" : "border border-white/80 bg-white/60"
        }`}
      >
        {on && <Icon name="check" size={16} />}
      </span>

      {kind === "image" && option.image && (
        <span className="relative block aspect-[4/5] w-full overflow-hidden rounded-lg bg-surface-container-low">
          <Image src={option.image} alt="" fill sizes="(min-width:1024px) 260px, (min-width:640px) 45vw, 90vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        </span>
      )}
      {kind === "swatch" && option.swatches && (
        <span className="flex h-28 w-full overflow-hidden rounded-lg">
          {option.swatches.map((c) => (
            <span key={c} className="flex-1" style={{ background: c }} />
          ))}
        </span>
      )}
      {kind === "icon" && option.icon && (
        <span className="flex h-28 w-full items-center justify-center rounded-lg bg-surface-container-low">
          <Icon name={option.icon} size={36} className="text-secondary" />
        </span>
      )}

      <span className="px-1.5 pt-4 pb-2">
        <span className="block font-serif text-[1.05rem] leading-snug md:text-title-editorial">{option.label}</span>
        <span className="mt-1 block text-body-sm font-light text-on-surface-variant">{option.description}</span>
      </span>
    </button>
  );
}
