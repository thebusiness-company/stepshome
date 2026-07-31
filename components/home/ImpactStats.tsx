'use client';

import { motion } from 'motion/react';
import { CalendarHeart,BookOpen, GraduationCap,MessageSquareHeart, HeartHandshake } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, hasStarted]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function ImpactStats() {
  const stats = [
    { icon: HeartHandshake, label: 'Total lives touched', value: 55, suffix: '+' },
    { icon: CalendarHeart, label: 'Years of Service', value: 20, suffix: '+' },
    { icon: GraduationCap, label: 'Girls in college', value: 12, suffix: '' },
    { icon: BookOpen, label: 'Girls in school', value: 7, suffix: '' },
    { icon: MessageSquareHeart, label: 'Girls currently in our care', value: 19, suffix: '+' },
  ];

  return (
    <section className="py-16 md:py-24 bg-brand-bg relative" aria-label="Impact statistics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-brand-dark mb-4">Our Impact</h2>
          <p className="text-lg text-brand-muted max-w-2xl mx-auto">
            Two decades of rescue, love, and transformation — measured in lives, not numbers.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 md:p-8 rounded-3xl shadow-glass text-center hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="inline-flex p-4 bg-brand-accent/20 text-brand-primary rounded-2xl mb-6">
                <stat.icon size={32} />
              </div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-2">
                <Counter end={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="text-brand-muted font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
