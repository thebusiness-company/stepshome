'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';

export default function DonationBanner() {
  return (
    <section
  className="relative h-150 overflow-hidden flex items-end "
  aria-label="Call to action - Support Us"
>
  <div className="absolute inset-0 z-0">
    <Image
      src="/images/donatebanner.png"
      alt="Children at STEPS Home"
      fill
      className="object-cover object-[center_30%]"
      sizes="100vw"
    />
  </div>

  <div className="relative z-10 w-full max-w-4xl mx-auto px-4 flex justify-center ">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="text-center p-8 px-6 md:px-6 py-4 md:py-8 md:p-18 mb-16 rounded-3xl bg-brand-accent/60 "
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 md:mb-6">
        Be the reason she has a future
      </h2>

      <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto">
        Every donation gives a girl safety, education, and a chance to thrive.
      </p>

      <Link
        href="/donate"
        className="inline-block bg-white text-brand-primary px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-bg transition-all hover:scale-105 shadow-glass"
      >
        Support Us
      </Link>
    </motion.div>
  </div>
</section>
  );
}
