import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useLogin } from "@privy-io/react-auth";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import {Button} from "../components/ui/button";

export default function LandingPage() {
  const router = useRouter();
  const { login } = useLogin({
    onComplete: () => router.push("/app"), // after login, go to /app
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

          {/* Play/Login Button */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            className="relative z-20"
          >
            <Button
              size="lg"
              className="px-8 bg-violet-600 text-white hover:bg-violet-700"
              onClick={login}
            >
              <Play className="mr-2 h-5 w-5" />
              Play
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
}
