'use client';

import React, { useState } from 'react';
import { Mail, User, Phone, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function NewsletterForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot field
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'duplicate' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (status === 'submitting') return;

    // Client-side quick checks
    if (!name.trim() || name.trim().length < 2) {
      setStatus('error');
      setMessage('Please enter your name (at least 2 characters).');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          website, // Honeypot field sent as-is
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.message && data.message.includes('already subscribed')) {
          setStatus('duplicate');
        } else {
          setStatus('success');
        }
        setMessage(data.message || "You're subscribed successfully.");
        // Reset inputs on success
        setName('');
        setPhone('');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Unable to subscribe right now. Please try again later.');
      }
    } catch {
      setStatus('error');
      setMessage('Unable to subscribe right now. Please try again later.');
    }
  };

  return (
    <section className="bg-white text-[#1f2a44] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center space-y-4 mb-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-bg text-brand-primary border backdrop-blur-sm">
            <Mail size={14} /> Newsletter Sign-Up
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-dark tracking-tight">
            Stay close to our story.
          </h2>
          <p className="text-brand-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Get updates from Steps Home — new stories, milestones, and ways you can help.
          </p>
        </div>

        {/* Subscription Form Card */}
        <div className="bg-brand-bg backdrop-blur-md border border-brand-accent/20 rounded-3xl p-6 sm:p-8 md:p-10 shadow-md">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Honeypot anti-spam field (hidden from visual UI and assistive tech) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website-field">Website</label>
              <input
                type="text"
                id="website-field"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Name Field */}
              <div>
                <label htmlFor="newsletter-name" className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">
                  Name <span className="text-[#ff7b7b]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    id="newsletter-name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    required
                    maxLength={100}
                    autoComplete="name"
                    disabled={status === 'submitting'}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-brand-muted/40 rounded-xl text-brand-dark placeholder-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-[#4fa6a0] focus:border-transparent transition-all text-sm disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Phone Number Field */}
              <div>
                <label htmlFor="newsletter-phone" className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    id="newsletter-phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    maxLength={20}
                    autoComplete="tel"
                    disabled={status === 'submitting'}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-brand-muted/40 rounded-xl text-brand-dark placeholder-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-[#4fa6a0] focus:border-transparent transition-all text-sm disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="newsletter-email" className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">
                  Email address <span className="text-[#ff7b7b]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    id="newsletter-email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    maxLength={254}
                    autoComplete="email"
                    disabled={status === 'submitting'}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-brand-muted/40 rounded-xl text-brand-dark placeholder-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-[#4fa6a0] focus:border-transparent transition-all text-sm disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-[#1f2a44] to-[#4fa6a0] hover:from-[#2a3859] hover:to-[#5bc2bb] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base cursor-pointer"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Keep Me Updated</span>
                )}
              </button>
            </div>
          </form>

          {/* Feedback Messages with Accessible Live Region */}
          <div aria-live="polite" className="mt-4">
            {(status === 'success' || status === 'duplicate') && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3 animate-fadeIn">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="font-medium">{message}</p>
              </div>
            )}

            {status === 'error' && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 animate-fadeIn">
                <AlertCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
                <p className="font-medium">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
