'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        <h1 className="text-[120px] leading-none font-serif font-bold text-brand-primary/20 mb-4">404</h1>
        <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">Page Not Found</h2>
        <p className="text-brand-muted text-lg mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-brand-primary to-brand-dark text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-btn"
          >
            <Home size={18} />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-white text-brand-dark px-6 py-3 rounded-xl font-bold hover:bg-brand-bg transition-colors shadow-glass"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
