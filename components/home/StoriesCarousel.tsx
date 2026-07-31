'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';

export default function StoriesCarousel() {
  const stories = [
    {
      name: 'Nisha',
      age: 21,
      story: 'Nisha was told she was a burden to her family and was to be abandoned but she was rescued and brought to Steps Home.',
      img: '/profile/Nisha.png',
    },
    {
      name: 'Bharathi',
      age: 21,
      story: 'Bharathi was abandoned and left to fend for herself outside a movie theater with her sisters, but they were brought to Steps Home.',
      img: '/profile/Bharathi.png',
    },
    {
      name: 'Teresa',
      age: 20,
      story: "Teresa and her sister were brought to Steps after her mother was unable to provide for them.",
      img: '/profile/teresa.png',
    },
  ];

  return (
    <section className="py-24 bg-brand-bg" aria-label="Stories of transformation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-brand-dark mb-4">Stories of Transformation</h2>
          <p className="text-lg text-brand-muted max-w-2xl mx-auto">
            Meet the brave girls who are rewriting their destinies with your support.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {stories.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-glass group hover:-translate-y-2 transition-all duration-300"
            >
              <div className="aspect-4/3 overflow-hidden relative">
                <Image
                  src={story.img}
                  alt={`${story.name}, age ${story.age}, at STEPS Home`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-brand-primary">
                  Age {story.age}
                </div>
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-serif font-bold text-brand-dark mb-3">{story.name}</h3>
                <p className="text-brand-muted mb-6 leading-relaxed">{story.story}</p>
                {/* <Link
                  href="/donate"
                  className="inline-block w-full text-center bg-brand-accent/20 text-brand-primary font-bold py-3 rounded-xl hover:bg-brand-primary hover:text-white transition-colors"
                >
                  Sponsor {story.name}
                </Link> */}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
