'use client';

import { motion } from 'motion/react';
import { HouseHeart, Building2, Theater, HeartCrack, Globe, HandHeart, GraduationCap } from 'lucide-react';

export default function Timeline() {
  const events = [
    { year: '2006', title: 'A Home Is Born', desc: 'Arrival of the first 3 girls.', icon: HouseHeart },
    { year: '2013', title: 'Moving In', desc: 'The girls move into the Steps Home Building', icon: Building2 },
    { year: '2017', title: 'Save Her Concert UAE & Sri Lanka', desc: 'Steps Home Girls sing in the UAE and Sri Lanka', icon: Theater },
    { year: '2018', title: 'Global Summit Singapore', desc: '3 Girls were invited to sing in Singapore', icon: Globe },
    { year: '2020', title: 'Isaac Passed', desc: 'Isaac Passed away due to Covid-19', icon: HeartCrack },
    { year: '2022', title: 'Orphan Care Workshop', desc: 'Steps conducted a workshop on Caring for Orphans.', icon: HandHeart },
    { year: '2025', title: 'First College Graduate', desc: 'Bharathi became the first graduate to finish her Bachelors Degree', icon: GraduationCap },
  ];

  return (
    <section className="py-24 bg-white" aria-label="Our journey timeline">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">Our Journey</h2>
          <p className="text-base md:text-lg text-brand-muted">Milestones of hope and transformation.</p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-7 md:left-1/2  top-0 bottom-0 w-1 bg-brand-accent/30 -translate-x-1/2 rounded-full"></div>

          <div className="space-y-12">
            {events.map((event, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex items-center ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} flex-row`}
                >
                  <div className="absolute left-7 md:left-1/2 -translate-x-1/2 w-14 h-14 bg-white border-4 border-brand-accent rounded-full flex items-center justify-center text-brand-primary z-10 shadow-sm">
                    <event.icon size={20} />
                  </div>

                  <div className={`ml-20 md:ml-0 w-full md:w-1/2 ${isEven ? 'md:pl-16' : 'md:pr-16 text-left md:text-right'}`}>
                    <div className="bg-brand-bg p-5 md:p-6 rounded-3xl shadow-glass border border-brand-primary/5 hover:-translate-y-1 transition-transform">
                      <span className="text-brand-primary font-bold text-lg md:text-xl mb-2 block">{event.year}</span>
                      <h3 className="text-xl md:text-2xl font-serif font-bold text-brand-dark mb-2">{event.title}</h3>
                      <p className="text-sm md:text-base text-brand-muted">{event.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
