'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Target, Shield, BookOpen, Camera, Sparkles, CalendarDays, Home, Laptop, Car, GraduationCap, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

interface GalleryImage {
  id: string;
  title: string;
  alt: string;
  url: string;
  category: string;
  isActive: boolean;
}

type Category = 'ALL' | 'MEMORIES' | 'EVENTS' | 'DAILY_LIFE';

const CATEGORIES: { key: Category; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: 'ALL', label: 'All Photos', icon: Camera },
  { key: 'MEMORIES', label: 'Memories', icon: Sparkles },
  { key: 'EVENTS', label: 'Events', icon: CalendarDays },
  { key: 'DAILY_LIFE', label: 'Daily Life', icon: Home },
];

const fallbackImages: GalleryImage[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop', alt: 'Happy moments at STEPS Home', title: 'Happy Moments', category: 'MEMORIES', isActive: true },
  { id: '2', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop', alt: 'Learning together at STEPS', title: 'Learning Together', category: 'DAILY_LIFE', isActive: true },
  { id: '3', url: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=800&auto=format&fit=crop', alt: 'Growing up strong at STEPS', title: 'Growing Strong', category: 'MEMORIES', isActive: true },
  { id: '4', url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=800&auto=format&fit=crop', alt: 'Celebrations at STEPS', title: 'Celebrations', category: 'EVENTS', isActive: true },
  { id: '5', url: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=800&auto=format&fit=crop', alt: 'Singing at STEPS', title: 'Music & Song', category: 'EVENTS', isActive: true },
  { id: '6', url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop', alt: 'Sisters at STEPS', title: 'Sisters Forever', category: 'DAILY_LIFE', isActive: true },
];

export default function MissionContent() {
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('ALL');
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setAllImages(data.data.filter((img: GalleryImage) => img.isActive));
        } else {
          setAllImages(fallbackImages);
        }
        setLoaded(true);
      })
      .catch(() => {
        setAllImages(fallbackImages);
        setLoaded(true);
      });
  }, []);

  const filteredImages = activeCategory === 'ALL'
    ? allImages
    : allImages.filter(img => img.category === activeCategory);

  const categoryCounts = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat.key] = cat.key === 'ALL' ? allImages.length : allImages.filter(img => img.category === cat.key).length;
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-b from-brand-accent to-transparent blur-[40px] opacity-30 -top-[100px] -right-[100px]"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-b from-brand-accent to-transparent blur-[40px] opacity-30 -bottom-[50px] -left-[50px]"></div>
      </div>

      {/* Header */}
      <section className="bg-transparent py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.1] font-serif font-bold text-brand-dark mb-6"
          >
            A Home Born of Love
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-brand-muted leading-relaxed"
          >
            What began as one couple's act of love grew into a home for nineteen girls. For twenty years, Steps Home has stood between vulnerable girls and abandonment — offering safety, family, and a future.
          </motion.p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-12 rounded-[2rem] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Target size={120} />
              </div>
              <h2 className="text-3xl font-serif font-bold text-brand-dark mb-6 relative z-10">Our Vision</h2>
              <p className="text-lg text-brand-muted leading-relaxed relative z-10">
                A world where no abandoned girl is forgotten, and every girl has the chance to flourish.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-brand-primary to-brand-dark p-12 rounded-[2rem] text-white relative overflow-hidden shadow-glass"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Heart size={120} />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-6 relative z-10">Our Mission</h2>
              <p className="text-lg text-white/90 leading-relaxed relative z-10">
                To find, foster, and free abandoned girls aged 5 to 18 — rescuing them from abuse and abandonment.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline/Story */}
      <section className="py-20 bg-transparent">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex gap-6 items-start"
            >
              <div className="bg-white p-4 rounded-full shadow-sleek text-brand-primary shrink-0">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-brand-dark mb-3">The Beginning (2005)</h3>
                <p className="text-brand-muted leading-relaxed">
                  Isaac and Tara adopted two children, and it changed everything. Watching them thrive made visible what so many girls in India were being denied. In 2005, they opened their home to three girls — and Steps Home was born.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex gap-6 items-start"
            >
              <div className="bg-white p-4 rounded-full shadow-sleek text-brand-primary shrink-0">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-brand-dark mb-3">Today</h3>
                <p className="text-brand-muted leading-relaxed">
                  Twenty years on, nineteen girls call Steps Home their family. Twelve are in college or working, and seven are still in school. Every girl who walks in stays — for as long as she needs us.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex gap-6 items-start"
            >
              <div className="bg-white p-4 rounded-full shadow-sleek text-brand-primary shrink-0">
                <Heart size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-brand-dark mb-3">Looking Forward — Beyond Steps</h3>
                <p className="text-brand-muted leading-relaxed">
                  Our girls are growing up. Beyond Steps — our next chapter — walks with them into adulthood: a place to live, a college degree, vocational skills, and the foundation to build their own lives.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Beyond Steps: Our Future Plans */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-brand-accent/20 via-white/50 to-brand-primary/5 border-y border-brand-accent/10 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Title and Description */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-brand-primary uppercase tracking-widest text-xs font-bold mb-3 block"
              >
                Beyond Steps — Our Future Plans
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-6 leading-tight"
              >
                What Comes After the Home
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg text-brand-muted leading-relaxed mb-8"
              >
                Under Indian law, girls age out of residential care at 18. But at 18, our girls are still in school. They still need college, job skills, a place to live, and eventually the support to start their own lives.
                <br /><br />
                Beyond Steps is our answer. It is a programme designed to walk alongside every girl through the full transition into independent adulthood — not just until she is of age, but until she is truly ready.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  href="/donate#beyond-steps"
                  className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-dark transition-all hover:scale-105 shadow-btn text-base"
                >
                  Support Beyond Steps &rarr;
                </Link>
              </motion.div>
            </div>

            {/* Right Column: Key Initiatives */}
            <div className="lg:col-span-7 space-y-6">
              {[
                {
                  title: 'A Home of Their Own',
                  desc: 'A flat where our girls can live together safely as they finish college and enter the workforce.',
                  icon: Home,
                  color: 'text-brand-primary bg-brand-primary/10'
                },
                {
                  title: 'Laptops and Learning Tools',
                  desc: 'The equipment every girl needs to study, work, and grow in the modern world.',
                  icon: Laptop,
                  color: 'text-blue-600 bg-blue-50'
                },
                {
                  title: 'Transport',
                  desc: 'A vehicle to get our girls to college, internships, and appointments with independence.',
                  icon: Car,
                  color: 'text-emerald-600 bg-emerald-50'
                },
                {
                  title: 'Higher Education Fund',
                  desc: 'Financial support for each girl to complete a college degree or vocational qualification.',
                  icon: GraduationCap,
                  color: 'text-purple-600 bg-purple-50'
                },
                {
                  title: 'Marriage Settlement',
                  desc: 'A foundation fund for each girl when she is ready to start her own family — something she would otherwise have no support for.',
                  icon: HeartHandshake,
                  color: 'text-rose-600 bg-rose-50'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 35 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-brand-accent/10 shadow-sm hover:shadow-md transition-shadow flex gap-5 items-start"
                >
                  <div className={`p-3.5 rounded-xl shrink-0 ${item.color}`}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-brand-dark mb-1">{item.title}</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Gallery — Category Filtered */}
      <section className="py-20 bg-white/50 backdrop-blur-sm" aria-label="Photo gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-3"
            >
              A Lifetime of Memories
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-brand-muted text-lg"
            >
              Glimpses of love, laughter and life at STEPS Home
            </motion.p>
          </div>

          {/* Category Filter Pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {CATEGORIES.map(cat => {
              const count = categoryCounts[cat.key] || 0;
              const isActive = activeCategory === cat.key;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  disabled={count === 0 && cat.key !== 'ALL'}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                    isActive
                      ? 'bg-brand-primary text-white shadow-btn scale-105'
                      : count === 0 && cat.key !== 'ALL'
                      ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                      : 'bg-white text-brand-muted hover:bg-brand-bg hover:text-brand-primary border border-brand-accent/20 shadow-sm'
                  }`}
                >
                  <Icon size={15} />
                  {cat.label}
                  {/* <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-brand-accent/20 text-brand-primary'}`}>
                    {count}
                  </span> */}
                </button>
              );
            })}
          </motion.div>

          {/* Gallery Grid */}
          {!loaded ? (
            /* Skeleton loading */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-brand-accent/10 animate-pulse" />
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Camera size={48} className="mx-auto text-brand-accent/40 mb-4" />
              <p className="text-brand-muted text-lg">No photos yet in this category.</p>
              <p className="text-brand-muted/60 text-sm mt-1">Upload images from the admin dashboard.</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {filteredImages.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(i * 0.05, 0.4) }}
                  onClick={() => setLightbox(img)}
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 ring-2 ring-transparent hover:ring-brand-primary/30"
                >
                  {/* Image */}
                  <img
                    src={img.url}
                    alt={img.alt || img.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Category badge */}
                  {/* <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/90 text-brand-primary px-2 py-0.5 rounded-full shadow-sm">
                      {img.category === 'DAILY_LIFE' ? 'Daily Life' : img.category.charAt(0) + img.category.slice(1).toLowerCase()}
                    </span>
                  </div> */}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div>
                      <p className="text-white font-semibold text-sm leading-tight">{img.title}</p>
                      <p className="text-white/60 text-xs mt-0.5">Click to view</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Image count info */}
          {/* {loaded && filteredImages.length > 0 && (
            <p className="text-center text-brand-muted/60 text-sm mt-8">
              Showing {filteredImages.length} {filteredImages.length === 1 ? 'photo' : 'photos'}
              {activeCategory !== 'ALL' && ` in ${CATEGORIES.find(c => c.key === activeCategory)?.label}`}
            </p>
          )} */}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            aria-label="Image lightbox"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-brand-dark rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src={lightbox.url}
                alt={lightbox.alt || lightbox.title}
                className="w-full max-h-[70vh] object-contain"
              />
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{lightbox.title}</p>
                  <span className="text-xs font-bold uppercase tracking-wider bg-brand-primary/80 text-white px-2 py-0.5 rounded-full mt-1 inline-block">
                    {lightbox.category === 'DAILY_LIFE' ? 'Daily Life' : lightbox.category.charAt(0) + lightbox.category.slice(1).toLowerCase()}
                  </span>
                </div>
                <button
                  onClick={() => setLightbox(null)}
                  className="text-white/60 hover:text-white text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors"
                >
                  Close ✕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
