'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { InkWashBackground } from '@/components/ui/InkWashBackground';

export default function HomePage() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <InkWashBackground intensity="medium" />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl md:text-8xl font-serif text-amber-100/90 mb-4 zh">
            江湖
          </h1>
          <p className="text-2xl md:text-3xl text-amber-100/60 font-serif tracking-wider">
            JIANGHU
          </p>
          <p className="text-lg text-amber-100/40 mt-2 font-serif">
            Legend of the Condor Heroes
          </p>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-center mb-12 max-w-xl px-8"
        >
          <p className="text-amber-100/50 text-lg font-serif italic">
            &ldquo;In the jianghu, one&apos;s word is their bond, their sword their truth.&rdquo;
          </p>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <Link href="/game">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                px-12 py-4
                text-xl font-serif
                text-amber-100
                border-2 border-amber-900/50
                bg-stone-900/50
                rounded-lg
                hover:bg-amber-900/20
                hover:border-amber-700/70
                transition-all duration-300
                backdrop-blur-sm
              "
            >
              Begin Your Journey
            </motion.button>
          </Link>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-8 text-amber-100/30 text-sm font-serif"
        >
          A Narrative Experience in the World of Jin Yong
        </motion.p>
      </div>
    </main>
  );
}
