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
      <div className="relative isolate min-h-screen text-white">
        {/* Background art */}
        <Image
          src="/zutchi-landing.png"
          alt="Zutchi skyline background"
          fill
          priority
          className="pointer-events-none select-none object-cover object-bottom"
        />

        {/* Hero */}
        <div className="relative z-10 flex flex-col items-center gap-3 lg:gap-6 pt-12 lg:pt-24 px-2 lg:px-4 text-center">
          <div className="w-full flex justify-center">
            <Image
              src="/zutchi-banner.png"
              alt="Zutchi"
              width={350}
              height={308}
              priority
              className="w-full max-w-[350px] h-auto sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px]"
            />
          </div>

          <p className="text-center text-sm sm:text-base md:text-lg lg:text-xl text-black max-w-lg lg:max-w-2xl px-2 lg:px-4 leading-relaxed">
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
              className="px-4 lg:px-8 py-2 lg:py-4 text-sm lg:text-lg bg-zutchi-green text-white hover:bg-zutchi-moss"
              onClick={login}
            >
              <Play className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
              Play
            </Button>
          </motion.div>
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.1 }}
            className="mt-6"
          >
            <Image
              src="/cats-for-use/home/V87.png" // put your file in /public with this name
              alt="Zutchi cat"
              width={240}
              height={360}
              priority={false}
              className="w-56 md:w-72 h-auto drop-shadow-[0_6px_24px_rgba(0,0,0,0.25)] pointer-events-none select-none"
            />
          </motion.div>
        </div>
      </div>

      {/* ===== LEARN / FAQ / CONTACT ===== */}
      <section
        id="learn"
        className="relative isolate scroll-mt-24 text-black min-h-[70vh]"
      >
        {/* Background stack (behind everything in this section) */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/design.png"
            alt="Zutchi learn background"
            fill
            className="pointer-events-none object-cover object-right"
            priority={false}
          />
          {/* Gradient wash above the image but still behind content */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/72 to-white/64" />
        </div>

        <div className="relative mx-auto max-w-6xl px-2 lg:px-6 py-8 lg:py-16 space-y-8 lg:space-y-16">
          {/* ====== THE PROBLEM & SOLUTION ====== */}
          <div className="rounded-xl lg:rounded-[22px] border border-zinc-200 bg-white/90 p-4 lg:p-6 xl:p-10 shadow-sm backdrop-blur">
            <div className="grid gap-6 lg:gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold leading-tight text-red-600">The Problem</h2>
                <p className="mt-3 text-sm lg:text-base text-zinc-700">
                  Web3 is powerful but intimidating. Most products focus on speculation, not users.
                  What everyone actually wants? <strong>Fun</strong>
                </p>
                <p className="mt-2 text-sm lg:text-base text-zinc-700">
                  There's <strong>no game built on Zircuit today</strong> — an opportunity to create something engaging that showcases the ecosystem.
                </p>
              </div>

              <div>
                <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold leading-tight text-zutchi-green">The Solution: Zutchi</h2>
                <p className="mt-3 text-sm lg:text-base text-zinc-700">
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
          <div className="rounded-xl lg:rounded-[22px] border border-zinc-200 bg-white/90 p-4 lg:p-6 xl:p-10 shadow-sm backdrop-blur">
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight mb-4 lg:mb-6">Core Gameplay</h2>
            <p className="mb-6 lg:mb-8 text-zinc-700">Your pet has <strong>4 key needs</strong>:</p>

            <div className="grid gap-4 lg:gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl lg:rounded-2xl border border-zinc-200 bg-white p-4 lg:p-6 shadow-sm">
                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg lg:rounded-xl bg-orange-500 mb-3 lg:mb-4" />
                <h3 className="text-base lg:text-lg font-semibold mb-2">Food</h3>
                <p className="text-sm text-zinc-700">
                  Feed it with tokens; part of what's spent flows back into the community.
                </p>
              </div>

              <div className="rounded-xl lg:rounded-2xl border border-zinc-200 bg-white p-4 lg:p-6 shadow-sm">
                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg lg:rounded-xl bg-blue-500 mb-3 lg:mb-4" />
                <h3 className="text-base lg:text-lg font-semibold mb-2">Sleep</h3>
                <p className="text-sm text-zinc-700">
                  A natural break mechanic.
                </p>
              </div>

              <div className="rounded-xl lg:rounded-2xl border border-zinc-200 bg-white p-4 lg:p-6 shadow-sm">
                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg lg:rounded-xl bg-zutchi-green mb-3 lg:mb-4" />
                <h3 className="text-base lg:text-lg font-semibold mb-2">Work</h3>
                <p className="text-sm text-zinc-700">
                  Your pet "works" by providing liquidity or participating in governance, growing the Zircuit ecosystem.
                </p>
              </div>

              <div className="rounded-xl lg:rounded-2xl border border-zinc-200 bg-white p-4 lg:p-6 shadow-sm">
                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg lg:rounded-xl bg-purple-500 mb-3 lg:mb-4" />
                <h3 className="text-base lg:text-lg font-semibold mb-2">Social-Fun</h3>
                <p className="text-sm text-zinc-700">
                  Connect with others on-chain, attend events, or play mini-games.
                </p>
              </div>
            </div>
          </div>

          {/* ====== WHAT WE BUILD & WHAT'S NEXT ====== */}
          <div className="grid gap-6 lg:gap-8 md:grid-cols-2">
            <div className="rounded-xl lg:rounded-[22px] border border-zinc-200 bg-white/90 p-4 lg:p-6 xl:p-8 shadow-sm backdrop-blur">
              <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold leading-tight mb-4">What we actually build</h2>
              <ul className="grid gap-3 text-sm text-zinc-700">
                <li>• <strong>Onboarding funnel</strong>: Start Web2-simple, grow into a Web3 power user</li>
                <li>• <strong>Token utility</strong>: Native ZRC becomes essential (feeding, marketplace, rewards)</li>
                <li>• <strong>Ecosystem engagement</strong>: Pets incentivize activity across DeFi, governance, and community</li>
                <li>• <strong>Retention</strong>: Pets evolve, socialize, and become tradable assets</li>
              </ul>
            </div>

            <div className="rounded-xl lg:rounded-[22px] border border-zinc-200 bg-white/90 p-4 lg:p-6 xl:p-8 shadow-sm backdrop-blur">
              <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold leading-tight mb-4">What's Next</h2>
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
          <div className="grid gap-6 lg:gap-10 md:grid-cols-3">
            <aside className="md:col-span-1">
              <div className="rounded-xl lg:rounded-2xl border border-zinc-200 bg-white/90 p-4 lg:p-6 shadow-sm backdrop-blur">
                <h2 className="text-3xl lg:text-4xl font-bold leading-tight">FAQ</h2>
                <p className="mt-3 text-zinc-700">
                  The most common questions—kept short and clear.
                </p>
              </div>
            </aside>

            <div className="md:col-span-2 relative z-10 rounded-xl lg:rounded-2xl border border-zinc-200 bg-white/90 shadow-sm backdrop-blur">
              <dl className="divide-y divide-zinc-300">
                <div className="px-4 lg:px-6 py-4 lg:py-5">
                  <dt className="text-sm lg:text-base font-medium">Who can play Zutchi?</dt>
                  <dd className="mt-2 text-sm text-zinc-700">
                    Anyone. Try the demo without a wallet; connect later to mint your pet NFT and use ZRC.
                  </dd>
                </div>

                <div className="px-4 lg:px-6 py-4 lg:py-5">
                  <dt className="text-sm lg:text-base font-medium">What is ZRC used for?</dt>
                  <dd className="mt-2 text-sm text-zinc-700">
                    In-game currency for food, toys, and boosts. Some actions in <em>Work</em> can earn small amounts.
                  </dd>
                </div>

                <div className="px-4 lg:px-6 py-4 lg:py-5">
                  <dt className="text-sm lg:text-base font-medium">Can my pet die?</dt>
                  <dd className="mt-2 text-sm text-zinc-700">
                    If stats hit zero for too long, yes. In production, the NFT is burned; you can mint a new pet to restart.
                  </dd>
                </div>

                <div className="px-4 lg:px-6 py-4 lg:py-5">
                  <dt className="text-sm lg:text-base font-medium">Are gas fees a problem?</dt>
                  <dd className="mt-2 text-sm text-zinc-700">
                    We minimize/batch on-chain actions; the core loop is designed to be affordable and simple.
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* ====== CONTACT ====== */}
          <div className="rounded-xl lg:rounded-[22px] border border-zinc-200 bg-white/90 p-4 lg:p-6 xl:p-10 shadow-sm backdrop-blur">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h3 className="text-lg lg:text-xl font-semibold">Contact us</h3>
                <p className="mt-1 text-sm text-zinc-700">DM or email—we'll get back fast.</p>
                <a
                  href="mailto:hello@decenzio.com"
                  className="mt-2 inline-block text-sm text-zutchi-teal hover:text-zutchi-moss"
                >
                  hello@decenzio.com
                </a>
              </div>

              <div className="flex items-center gap-3 lg:gap-4">
                <a
                  href="https://x.com/DecenzioHQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X / Twitter"
                  className="rounded-xl lg:rounded-2xl bg-zutchi-green p-2.5 lg:p-3 text-white transition-colors hover:bg-zutchi-moss"
                >
                  <Twitter className="h-5 w-5 lg:h-6 lg:w-6" />
                </a>
                <a
                  href="https://t.me/+mbnWmN610sVlNDNh"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="rounded-xl lg:rounded-2xl bg-zutchi-green p-2.5 lg:p-3 text-white transition-colors hover:bg-zutchi-moss"
                >
                  <Users className="h-5 w-5 lg:h-6 lg:w-6" />
                </a>
                <a
                  href="mailto:hello@decenzio.com"
                  aria-label="Email"
                  className="rounded-xl lg:rounded-2xl bg-zutchi-forest p-2.5 lg:p-3 text-white transition-colors hover:bg-zutchi-moss"
                >
                  <Mail className="h-5 w-5 lg:h-6 lg:w-6" />
                </a>
              </div>
            </div>

            <div className="mt-6 lg:mt-10 flex flex-col sm:flex-row sm:items-center justify-between border-t border-zinc-200 pt-4 lg:pt-6 text-sm text-zinc-600 gap-2">
              <span>Zutchi.com</span>
              <span>© 2025 Zutchi</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
