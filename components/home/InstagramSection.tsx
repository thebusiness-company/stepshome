'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export default function InstagramSection() {
  const images = [
    { id: 1, img: '/images/life4.png', alt: 'Children learning in classroom' },
    { id: 2, img: '/images/life1.png', alt: 'Girls playing together' },
    { id: 3, img: '/images/life3.png', alt: 'Community event at STEPS Home' },
    { id: 4, img: '/images/life2.png', alt: 'Daily life at STEPS Home' },
  ];

  return (
    <section className="py-24 bg-white" aria-label="Life at our home gallery">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-brand-dark mb-4">Life at Our Home</h2>
          <p className="text-lg text-brand-muted max-w-2xl mx-auto">
            A safe place where every girl is fed, loved, educated, and truly seen.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer shadow-sleek"
            >
              <Image
                src={img.img}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
