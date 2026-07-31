'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/homebanner2.png"
          alt="Happy children smiling at STEPS Home"
          fill
          className="object-cover object-[center_10%]"
          priority
          sizes="100vw"
        />

        {/* Gradient overlay for readability (dark at top and bottom, clear in middle) */}
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/0 to-black/0" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-full h-full flex flex-col justify-between mx-auto px-4 pt-16 pb-16 text-center">
        
        {/* Top: Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white drop-shadow-lg leading-tight"
        >
          Every Girl Deserves <span className='italic'>a Home and a Future</span>
        </motion.h1>

        {/* Middle Spacer (keeps the faces clear) */}
        <div className="grow min-h-20" />

        {/* Bottom: Subtext & CTA Buttons */}
        <div className="flex flex-col items-center">
          {/* Subtext */}
          <motion.p
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2 }}
  className="mb-8 max-w-2xl mx-auto text-base sm:text-lg md:text-xl lg:text-2xl font-medium leading-relaxed text-white/95"
>
  <span className="inline bg-brand-accent/40  px-3 py-1 rounded">
    For 20 years, we have rescued and restored girls from abandonment and abuse.
  </span>
</motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-xs sm:max-w-none"
          >
            <Link
              href="/donate"
              className="w-full sm:w-auto text-center bg-brand-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-dark transition-all hover:scale-105 shadow-btn whitespace-nowrap"
            >
              Donate Now
            </Link>

            <Link
              href="/join"
              className="w-full sm:w-auto text-center bg-white/90 backdrop-blur-sm text-brand-dark px-8 py-4 rounded-xl font-bold text-lg hover:bg-white transition-all hover:scale-105 shadow-glass whitespace-nowrap"
            >
              Join Us
            </Link>
          </motion.div>
        </div>

    </div>
    </section>
  );
}