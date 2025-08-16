import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useLogin } from "@privy-io/react-auth";
import { Play, Twitter, Mail, Users } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

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
          content="Play. Earn. Socialize. Educate. Your digital pet, brought to life!"
        />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-S267TETQ3B"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-S267TETQ3B');
            `,
          }}
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
            Play. Earn. Socialize. Educate. Your digital pet, brought to life!
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
        {/* Scenic background */}
        <Image
          src="/design.png"
          alt="Zutchi learn background"
          fill
          className="pointer-events-none -z-10 object-cover object-right"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/78 via-white/70 to-white/62" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 space-y-16">
          {/* ====== THE PROBLEM & SOLUTION ====== */}
          <div className="rounded-[22px] border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur md:p-10">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold leading-tight md:text-3xl text-red-600">The Problem</h2>
                <p className="mt-3 text-sm md:text-base text-zinc-700">
                  Web3 is powerful but intimidating. Most products focus on speculation, not users.
                  What everyone actually wants? <strong>Fun</strong>
                </p>
                <p className="mt-2 text-sm md:text-base text-zinc-700">
                  There's <strong>no game built on Zircuit today</strong> — an opportunity to create something engaging that showcases the ecosystem.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold leading-tight md:text-3xl text-zutchi-green">The Solution: Zutchi</h2>
                <p className="mt-3 text-sm md:text-base text-zinc-700">
                  Zutchi is a <strong>Web3-native Tamagotchi</strong>, reimagined for today's users.
                </p>
                <ul className="mt-4 grid gap-2 text-sm text-zinc-700">
                  <li>• <strong>Fun & accessible</strong>: Designed so even Web2 users can start with just an email</li>
                  <li>• <strong>Useful</strong>: Tied to real DeFi activity — your pet thrives when you engage with the ecosystem</li>
                  <li>• <strong>Social</strong>: Events, interactions, and mini-games with other players</li>
                  <li>• <strong>Educational</strong>: Learn Web3 concepts naturally while playing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ====== CORE GAMEPLAY ====== */}
          <div className="rounded-[22px] border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur md:p-10">
            <h2 className="text-3xl font-bold leading-tight md:text-4xl mb-6">Core Gameplay</h2>
            <p className="mb-8 text-zinc-700">Your pet has <strong>4 key needs</strong>:</p>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-orange-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Food</h3>
                <p className="text-sm text-zinc-700">
                  Feed it with tokens; part of what's spent flows back into the community.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sleep</h3>
                <p className="text-sm text-zinc-700">
                  A natural break mechanic.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-zutchi-green mb-4" />
                <h3 className="text-lg font-semibold mb-2">Work</h3>
                <p className="text-sm text-zinc-700">
                  Your pet "works" by providing liquidity or participating in governance, growing the Zircuit ecosystem.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-purple-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Social-Fun</h3>
                <p className="text-sm text-zinc-700">
                  Connect with others on-chain, attend events, or play mini-games.
                </p>
              </div>
            </div>
          </div>

          {/* ====== WHAT WE BUILD & WHAT'S NEXT ====== */}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-[22px] border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur md:p-8">
              <h2 className="text-2xl font-bold leading-tight md:text-3xl mb-4">What we actually build</h2>
              <ul className="grid gap-3 text-sm text-zinc-700">
                <li>• <strong>Onboarding funnel</strong>: Start Web2-simple, grow into a Web3 power user</li>
                <li>• <strong>Token utility</strong>: Native ZRC becomes essential (feeding, marketplace, rewards)</li>
                <li>• <strong>Ecosystem engagement</strong>: Pets incentivize activity across DeFi, governance, and community</li>
                <li>• <strong>Retention</strong>: Pets evolve, socialize, and become tradable assets</li>
              </ul>
            </div>

            <div className="rounded-[22px] border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur md:p-8">
              <h2 className="text-2xl font-bold leading-tight md:text-3xl mb-4">What's Next</h2>
              <ul className="grid gap-3 text-sm text-zinc-700">
                <li>• <strong>EIP-6551 integration</strong> → Pets become wallets</li>
                <li>• <strong>Mini-games</strong> → Expanding fun & social layers</li>
                <li>• <strong>AI agents</strong> → Pets as true characters, companions</li>
                <li>• <strong>DeFi integrations</strong> → More ways for pets to "work" and users to engage</li>
              </ul>
              <p className="mt-4 text-sm font-medium text-zutchi-green">
                We're building the first <strong>fun, social, useful</strong> game on Zircuit.
              </p>
            </div>
          </div>

          {/* ====== FAQ ====== */}
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

          {/* ====== CONTACT ====== */}
          <div className="rounded-[22px] border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold">Contact us</h3>
                <p className="mt-1 text-sm text-zinc-700">DM or email—we'll get back fast.</p>
                <a
                  href="mailto:hello@decenzio.com"
                  className="mt-2 inline-block text-sm text-zutchi-teal hover:text-zutchi-moss"
                >
                  hello@decenzio.com
                </a>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="https://x.com/DecenzioHQ"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X / Twitter"
                  className="rounded-2xl bg-zutchi-green p-3 text-white transition-colors hover:bg-zutchi-moss"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a
                  href="https://t.me/+mbnWmN610sVlNDNh"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Telegram"
                  className="rounded-2xl bg-zutchi-green p-3 text-white transition-colors hover:bg-zutchi-moss"
                >
                  <Users className="h-6 w-6" />
                </a>
                <a
                  href="mailto:hello@decenzio.com"
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