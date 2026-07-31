'use client';

import { motion } from 'motion/react';
import { Target, Heart } from 'lucide-react';

export default function VisionMission() {
  return (
    <section className="py-20 bg-brand-bg relative z-10 -mt-10 rounded-t-[3rem]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-glass border border-white hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="bg-brand-accent/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-brand-primary">
              <Target size={32} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">Our Vision</h2>
            <p className="text-lg text-brand-muted leading-relaxed">
              A world where no girl is forgotten, and every girl has the chance to flourish.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-brand-primary to-brand-dark p-8 md:p-10 rounded-3xl shadow-btn text-white hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white">
              <Heart size={32} />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-white/90 leading-relaxed">
              To find, foster, and free abandoned girls aged 5 to 18 — rescuing them from abuse and abandonment.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
