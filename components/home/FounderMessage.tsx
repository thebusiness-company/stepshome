'use client';

import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import Image from 'next/image';

export default function FounderMessage() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.50] pointer-events-none"
        style={{
          backgroundImage: "url('/images/Steps-pattern.webp')",
          backgroundRepeat: "repeat",
          backgroundSize: "1000px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-full overflow-hidden border-8 border-brand-bg shadow-sleek relative z-10 max-w-[260px] sm:max-w-sm md:max-w-md mx-auto">
              <Image
                src="/images/steps-founder.webp"
                alt="Isaac and Tara Manogarom, Founders of STEPS Home"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 260px, (max-width: 768px) 384px, 400px"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-brand-accent/20 rounded-full z-0 blur-2xl"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative pt-12"
          >
            <Quote size={48} className="text-brand-accent/50 absolute top-0 left-0 rotate-180" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-5">A Message of Hope</h2>
            <blockquote className="text-lg md:text-xl text-brand-muted leading-relaxed mb-8 italic">
              &ldquo;Isaac and Tara Manogarom adopted two children, and it changed everything. Watching them thrive made them see what the girl child in India was being denied — and they acted.&rdquo;
            </blockquote>
            <div>
              <h4 className="text-xl md:text-2xl font-bold text-brand-primary font-serif">Isaac and Tara Manogarom</h4>
              <p className="text-brand-muted uppercase tracking-wider text-sm font-medium mt-1">Founders, STEPS Home</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
