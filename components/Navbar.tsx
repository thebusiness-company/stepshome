'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'ABOUT US', path: '/mission' },
    // { name: 'Our Girls', path: '/girls' },
    { name: 'Join Us', path: '/join' },
    { name: 'Support Us', path: '/donate' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b-0">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2" aria-label="STEPS Home - Go to homepage">
            <Image
              src="/steps_logo.png"
              alt="STEPS - Make a Difference, Save a Girl Child"
              width={48}
              height={48}
              className="rounded-full"
              priority
            />
            <span className="font-serif font-semibold text-2xl text-brand-primary tracking-tight uppercase not-italic">STEPS Home</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "text-sm font-medium uppercase tracking-[1px] transition-colors hover:text-brand-primary",
                  pathname === link.path ? "text-brand-primary font-bold" : "text-brand-muted"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-card border-t border-pink-100"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium uppercase tracking-[1px]",
                    pathname === link.path
                      ? "text-brand-primary bg-brand-bg font-bold"
                      : "text-brand-muted hover:text-brand-primary hover:bg-brand-bg"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
