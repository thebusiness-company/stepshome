'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, User, Sparkles, BookOpen, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Girl {
  id: string;
  name: string;
  age: number;
  description: string;
  img: string;
  sortOrder: number;
}

const fallbackGirls: Girl[] = [
  { id: '1', name: 'Nisha', age: 21, description: '“A Dentist in the making” Nisha is currently in her 3rd year of study at Sree Balaji Dental College to become a dentist. Nisha is very passionate about music as well as creating her own songs.', img: '/profile/Nisha.png', sortOrder: 0 },
  { id: '2', name: 'Karunya', age: 20, description: 'Karu is currently pursuing her 2nd year at WCC with the dream of becoming a fashion designer. She is highly passionate about art and creativity, constantly exploring new ideas and designs to express her talent.', img: '/profile/Karunya.png', sortOrder: 1 },
  { id: '3', name: 'Sarah', age: 20, description: 'Sara is currently pursuing her 2nd year at Crown College with the goal of becoming a nurse. She is passionate about helping others and loves playing the drums in her free time.', img: '/profile/Sara.png', sortOrder: 2 },
  { id: '4', name: 'Pushpa', age: 21, description: 'Pushpa is a 3rd year student at WCC, and wants to be a photographer. She enjoys taking pictures and cooking. Her creativity and dedication make her passionate about pursuing her dreams.', img: '/profile/Pushpa.png', sortOrder: 3 },
  { id: '5', name: 'Meethu', age: 20, description: 'Meethu is currently pursuing B.Tech 2nd year at Karunya Institute of Technology and Sciences. She wants to be a doctor in the future. She likes dancing and taking part in various kinds of activities. She is hard-working and happy and tries her best to achieve her goals.', img: '/profile/Meethu.png', sortOrder: 4 },
  { id: '6', name: 'Punitha', age: 20, description: 'Punitha has completed her degree in Forensic Science from Karunya Institute of Technology and Sciences. Now she is training at an aviation academy to pursue her dream of becoming a cabin crew member. In her free time she enjoys reading books .', img: '/profile/Punitha.png', sortOrder: 5 },
  { id: '7', name: 'Angel', age: 17, description: 'Angel is a 12th grader who studies in a Science group. She dreams of becoming a doctor . She likes to read books in her spare time, which helps her learn new things and expand her knowledge.', img: '/profile/Angel.png', sortOrder: 6 },
  { id: '8', name: 'Jennifer', age: 18, description: 'Jennifer is currently studying in the 12th grade with Home Science. Her dream is to become a chef and is passionate about cooking. She loves trying new recipes and learning different cooking techniques.', img: '/profile/Jennifer.png', sortOrder: 7 },
  { id: '9', name: 'Theresa', age: 22, description: 'Theresa has completed her Home Science degree at Women\'s Christian College. She is now pursuing her dream of becoming a cabin crew member at an aviation academy. She enjoys cooking and loves helping and serving people .', img: '/profile/Theresa.png', sortOrder: 8 },
  { id: '10', name: 'Shreeja', age: 21, description: 'Shreeja has finished her studies in Home Science at Women\'s Christian College. She is presently employed as a hotel manager. She likes cooking very much and enjoys experimenting with new recipes.', img: '/profile/Shreeja.png', sortOrder: 9 },
  { id: '11', name: 'Mary', age: 20, description: 'Mary is currently studying nursing as a second year student in Madras Medical Mission College of Nursing. Her dream is to become a nurse.Mary likes baking and is fond of experimenting with various recipes.', img: '/profile/Mary.png', sortOrder: 10 },
  { id: '12', name: 'Saradha', age: 22, description: 'Saradha has graduated from her B.Sc in Media Production. She is currently pursuing her B.Ed. Her dream is to be a teacher and inspire children. She loves to teach kids in her spare time and edit videos and pictures.', img: '/profile/Saradha.png', sortOrder: 11 },
  { id: '13', name: 'Bharathi', age: 22, description: 'Bharathi graduated with a Bachelor of Science in Artificial Intelligence and is pursuing a Master’s degree in MBA from Saveetha Institute of Medical and Technical Sciences in her second year. She wishes to become a HR manager in the future. She loves cracking jokes and also loves trying different foods.', img: '/profile/Bharathi.png', sortOrder: 12 },
  { id: '14', name: 'Dhivya', age: 20, description: 'Dhivya is a 2nd year Physiotherapy student at the Union Christian College. Her aspiration is to be a nurse one day and she works hard towards realizing her dream. Dancing is another passion of hers.', img: '/profile/Dhivya.png', sortOrder: 13 },
  { id: '15', name: 'Hashini', age: 18, description: 'Hashini is currently studying in the 12th grade with the Science group. She dreams of becoming an engineer in the future. Her hobby is crocheting, and she enjoys creating beautiful handmade items in her free time', img: '/profile/Hashini.png', sortOrder: 14 },
  { id: '16', name: 'Kavinaya', age: 16, description: 'Kavi is currently studying in the 10th grade. She dreams of becoming a police officer. She enjoys playing games in her free time and loves taking on new challenges.', img: '/profile/Kavinaya.png', sortOrder: 15 },
  { id: '17', name: 'Gloria', age: 16, description: 'Gloria is currently studying in the 10th grade. She dreams of becoming an IT professional in the future. She enjoys playing and learning the guitar in her free time.', img: '/profile/Gloria.png', sortOrder: 16 },
  { id: '18', name: 'Bhuvana', age: 9, description: 'Bhuvana joined Steps Home about three months ago and is currently studying in the 7th grade. She dreams of becoming a police officer in the future. She enjoys reading books and playing games .', img: '/profile/Bhuvana.png', sortOrder: 17 },
  { id: '19', name: 'Gopika', age: 7, description: 'Gopika joined Steps Home about three months ago and is currently studying in the 5th grade. She dreams of becoming a Doctor in the future. She likes to play games and do coloring .', img: '/profile/Gopika.png', sortOrder: 18 }
];

export default function GirlsContent() {
  const [girls, setGirls] = useState<Girl[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/girls')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setGirls(data.data);
        } else {
          setGirls(fallbackGirls);
        }
        setLoading(false);
      })
      .catch(() => {
        setGirls(fallbackGirls);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Dynamic ambient backgrounds */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-b from-brand-accent to-transparent blur-[50px] opacity-25 -top-[100px] -right-[100px]"></div>
        <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-b from-brand-accent to-transparent blur-[50px] opacity-25 bottom-[100px] -left-[100px]"></div>
      </div>

      {/* Section 1 — Intro */}
      <section className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-brand-dark mb-6 leading-tight"
          >
            Meet Our Girls
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed"
          >
            Each of them has a name, a story, and a future. They are not statistics. They are daughters, sisters, and survivors.
          </motion.p>
        </div>
      </section>

      {/* Section 2 — Girl Profiles Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            /* Skeleton grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white/50 rounded-3xl h-[450px] animate-pulse border border-brand-accent/10" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {girls.map((girl, i) => (
                <motion.div
                  key={girl.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.05, 0.4) }}
                  className="bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden border border-brand-accent/15 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
                >
                  <div>
                    {/* Image block */}
                    <div className="aspect-square relative overflow-hidden bg-brand-bg">
                      <img
                        src={girl.img}
                        alt={`Photo of ${girl.name}`}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    {/* Copy block */}
                    <div className="p-6 md:p-8">
                      <div className="flex justify-between items-baseline mb-4">
                        <h3 className="text-2xl font-serif font-bold text-brand-dark flex items-center gap-2">
                          <User size={18} className="text-brand-primary shrink-0" />
                          {girl.name}
                        </h3>
                        <span className="text-xs font-bold uppercase tracking-wider bg-brand-accent/25 text-brand-primary px-3 py-1 rounded-full">
                          {girl.age} Years Old
                        </span>
                      </div>
                      <p className="text-brand-muted text-sm leading-relaxed italic block pl-3 border-l-2 border-brand-primary">
                        {girl.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Subtle card bottom */}
                  <div className="px-6 md:px-8 pb-6 pt-2 flex items-center justify-between text-xs font-semibold text-brand-muted/70">
                    <span className="flex items-center gap-1"><Sparkles size={12} className="text-brand-primary" /> Steps Home Family</span>
                    <span>Rescued & Thriving</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 3 — CTA Block */}
      <section className="py-20 bg-white/50 backdrop-blur-sm border-t border-brand-accent/20 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-4"
          >
            You can be part of her story.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-brand-muted mb-8 max-w-xl mx-auto"
          >
            Sponsor a girl&apos;s education, meals, or her future — and change everything.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-dark transition-all hover:scale-105 shadow-btn text-base"
            >
              Donate Now <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
