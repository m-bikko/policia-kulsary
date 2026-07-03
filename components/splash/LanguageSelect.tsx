"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { locales, localeLabels, type Locale } from "@/lib/i18n/config";

const STORAGE_KEY = "jylyoi-lang";

/** Порядок кнопок как в макете: KAZ → RUS → ENG */
const ORDER: Locale[] = ["kz", "ru", "en"];

const trilingual = {
  choose: ["Тілді таңдаңыз", "Выберите язык", "Choose your language"],
  ministry: "Қазақстан Республикасының Ішкі істер министрлігі",
};

export default function LanguageSelect() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [remembered, setRemembered] = useState<Locale | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && (locales as readonly string[]).includes(saved)) {
      setRemembered(saved as Locale);
    }
    ORDER.forEach((l) => router.prefetch(`/${l}`));
  }, [router]);

  const choose = (locale: Locale) => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    router.push(`/${locale}`);
  };

  const fadeUp = (delay: number) => ({
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-6 py-12">
      <motion.div {...fadeUp(0)} className="relative">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 scale-150 rounded-full bg-gold-500/20 blur-3xl"
        />
        <div className="rounded-full border border-gold-500/40 p-1.5">
          <div className="rounded-full border border-gold-500/70 p-1">
            <Image
              src="/images/logo-mvd.png"
              alt="Эмблема МВД Республики Казахстан"
              width={148}
              height={148}
              priority
              className="rounded-full"
            />
          </div>
        </div>
      </motion.div>

      <motion.h1
        {...fadeUp(0.1)}
        className="mt-8 text-center font-display text-2xl font-semibold tracking-wide text-ink sm:text-3xl"
      >
        Жылыой полициясы
      </motion.h1>

      <motion.p
        {...fadeUp(0.18)}
        className="mt-3 max-w-xs text-center text-sm leading-relaxed text-ink-soft text-balance"
      >
        {trilingual.ministry}
      </motion.p>

      <motion.div {...fadeUp(0.26)} className="mt-8 w-full">
        <p className="gold-divider text-[11px] font-semibold uppercase tracking-[0.2em]">
          {trilingual.choose[0]}
        </p>
      </motion.div>

      <div className="mt-6 flex w-full flex-col gap-3" role="group" aria-label="Тіл / Язык / Language">
        {ORDER.map((locale, i) => {
          const { code, name } = localeLabels[locale];
          const isRemembered = remembered === locale;
          return (
            <motion.button
              key={locale}
              {...fadeUp(0.32 + i * 0.08)}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              onClick={() => choose(locale)}
              className="card-official corner-accents group flex min-h-14 w-full cursor-pointer items-center justify-between rounded-xl px-5 py-3.5 text-left"
            >
              <span className="flex items-baseline gap-3">
                <span className="font-display text-base font-semibold tracking-widest text-gold-400">
                  {code}
                </span>
                <span className="text-sm text-ink-soft transition-colors group-hover:text-ink">
                  {name}
                </span>
              </span>
              <span className="flex items-center gap-2">
                {isRemembered && (
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-gold-400"
                    title="Последний выбор"
                  />
                )}
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-gold-500/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-gold-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>
            </motion.button>
          );
        })}
      </div>

      <motion.p
        {...fadeUp(0.62)}
        className="mt-8 text-center text-xs text-ink-dim"
      >
        102 · Полиция · Police
      </motion.p>
    </main>
  );
}
