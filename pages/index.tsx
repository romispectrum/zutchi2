import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useLogin } from "@privy-io/react-auth";
import { Play, Twitter, Youtube, Mail, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "../components/ui/button";

export default function LandingPage() {
  const router = useRouter();
  const { login } = useLogin({
    onComplete: () => router.push("/app"),
  });

  return (
    <>
      <Head>
        <title>Zutchi • Play</title>
        <meta
          name="description"
          content="Play. Socialize. Earn. Your digital pet, brought to life!"
        />
      </Head>

      {/* HERO */}
      <div className="relative min-h-screen text-white">
        {/* Background art */}
        <Image
          src="/zutchi-landing.png"
          alt="Zutchi skyline background"
          fill
          priority
          className="pointer-events-none select-none object-cover object-bottom"
        />

        {/* Hero */}
        <div className="relative z-10 flex flex-col items-center gap-6 pt-24">
          <Image
            src="/zutchi-banner.png"
            alt="Zutchi"
            width={700}
            height={614}
            priority
          />

          <p className="text-center text-lg md:text-xl text-black">
            Play. Socialize. Earn. Your digital pet, brought to life!
          </p>

          {/* Play/Login Button (Privy) */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            className="relative z-20"
          >
            <Button
              size="lg"
              className="px-8 bg-zutchi-green text-white hover:bg-zutchi-moss"
              onClick={login}
            >
              <Play className="mr-2 h-5 w-5" />
              Play
            </Button>
          </motion.div>
        </div>
      </div>

      {/* ===== LEARN / FAQ / CONTACT ===== */}
      <section id="learn" className="relative scroll-mt-24 text-black">
        {/* Scenic background (use the palette version you saved to /public) */}
        <Image
          src="/design.png"
          alt="Zutchi learn background"
          fill
          className="pointer-events-none -z-10 object-cover object-right"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/78 via-white/70 to-white/62" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 space-y-16">
          {/* ====== LEARN MORE ====== */}
          <div className="rounded-[22px] border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur md:p-10">
            <div className="grid gap-8 md:grid-cols-12">
              <div className="md:col-span-7 self-center">
                <h2 className="text-3xl font-bold leading-tight md:text-5xl">Learn more</h2>
                <p className="mt-3 text-sm md:text-base text-zinc-700">
                  Zutchi is a Tamagotchi × Pou–inspired pet on Zircuit. Keep your cat thriving by
                  balancing <strong>Food</strong>, <strong>Sleep</strong>, <strong>Social</strong>,
                  and <strong>Work</strong>. We abstract Web3 so it stays simple: ZRC for items,
                  evolving NFT metadata, and optional EIP-6551 later.
                </p>
                <ul className="mt-4 grid gap-2 text-sm text-zinc-700">
                  <li>• Each cat is an NFT; stats decay over time, actions restore them</li>
                  <li>• ZRC used for food/toys; time-based sleep; on-chain social mini-games</li>
                  <li>• Scheduler updates NFT metadata based on play</li>
                </ul>
                <Link
                  href="/about"
                  className="mt-5 inline-flex items-center text-sm font-medium text-zutchi-teal hover:text-zutchi-moss"
                >
                  Read the full overview <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <div className="md:col-span-5 grid gap-5">
                <div className="flex items-center justify-between gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <div>
                    <h3 className="text-lg font-semibold">Quick start</h3>
                    <p className="mt-1 text-sm text-zinc-700">
                      Mint your cat and learn the core loop in minutes.
                    </p>
                  </div>
                  <div className="shrink-0 h-12 w-12 rounded-xl bg-zutchi-teal" />
                </div>
                <div className="flex items-center justify-between gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <div>
                    <h3 className="text-lg font-semibold">Rules & on-chain</h3>
                    <p className="mt-1 text-sm text-zinc-700">
                      How stats change, when ZRC is used, and death/burn logic.
                    </p>
                  </div>
                  <div className="shrink-0 h-12 w-12 rounded-xl bg-zutchi-green" />
                </div>
              </div>
            </div>
          </div>

          {/* ====== FAQ (no accordion) ====== */}
          <div className="grid gap-10 md:grid-cols-3">
            <aside className="md:col-span-1">
              <h2 className="text-4xl font-bold leading-tight">FAQ</h2>
              <p className="mt-3 text-zinc-700">
                The most common questions—kept short and clear.
              </p>
            </aside>

            <div className="md:col-span-2 rounded-2xl border border-zinc-200 bg-white/90 shadow-sm backdrop-blur">
              <dl className="divide-y divide-zinc-300">
                <div className="px-6 py-5">
                  <dt className="text-base font-medium">Who can play Zutchi?</dt>
                  <dd className="mt-2 text-sm text-zinc-700">
                    Anyone. Try the demo without a wallet; connect later to mint your pet NFT and use ZRC.
                  </dd>
                </div>

                <div className="px-6 py-5">
                  <dt className="text-base font-medium">What is ZRC used for?</dt>
                  <dd className="mt-2 text-sm text-zinc-700">
                    In-game currency for food, toys, and boosts. Some actions in <em>Work</em> can earn small amounts.
                  </dd>
                </div>

                <div className="px-6 py-5">
                  <dt className="text-base font-medium">Can my pet die?</dt>
                  <dd className="mt-2 text-sm text-zinc-700">
                    If stats hit zero for too long, yes. In production, the NFT is burned; you can mint a new pet to restart.
                  </dd>
                </div>

                <div className="px-6 py-5">
                  <dt className="text-base font-medium">Are gas fees a problem?</dt>
                  <dd className="mt-2 text-sm text-zinc-700">
                    We minimize/batch on-chain actions; the core loop is designed to be affordable and simple.
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* ====== CONTACT (icons row) ====== */}
          <div className="rounded-[22px] border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold">Contact us</h3>
                <p className="mt-1 text-sm text-zinc-700">DM or email—we’ll get back fast.</p>
                <a
                  href="mailto:team@zutchi.com"
                  className="mt-2 inline-block text-sm text-zutchi-teal hover:text-zutchi-moss"
                >
                  team@zutchi.com
                </a>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X / Twitter"
                  className="rounded-2xl bg-zutchi-green p-3 text-white transition-colors hover:bg-zutchi-moss"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Discord"
                  className="rounded-2xl bg-zutchi-green p-3 text-white transition-colors hover:bg-zutchi-moss"
                >
                  {/* <Discord className="h-6 w-6" /> */}
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="rounded-2xl bg-zutchi-teal p-3 text-white transition-colors hover:bg-zutchi-green"
                >
                  <Youtube className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Docs / Notion"
                  className="rounded-2xl bg-zutchi-forest p-3 text-white transition-colors hover:bg-zutchi-moss"
                >
                  <ExternalLink className="h-6 w-6" />
                </a>
                <a
                  href="mailto:team@zutchi.com"
                  aria-label="Email"
                  className="rounded-2xl bg-zutchi-forest p-3 text-white transition-colors hover:bg-zutchi-moss"
                >
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-zinc-200 pt-6 text-sm text-zinc-600">
              <span>Zutchi.com</span>
              <span>© 2025 Zutchi</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
