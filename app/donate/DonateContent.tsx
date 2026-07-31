'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  GraduationCap, 
  Home as HomeIcon, 
  ShieldCheck, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Coins, 
  BookOpen, 
  Utensils, 
  Laptop, 
  Car, 
  Users, 
  QrCode, 
  Building,
  User,
  Mail,
  Phone,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Script from 'next/script';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color: string };
  modal?: { ondismiss: () => void };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: { error: { description: string } }) => void) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface DesignationOption {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  shortDesc?: string;
  desc?: string;
}

const DESIGNATION_OPTIONS: DesignationOption[] = [
  { 
    value: 'general', 
    label: 'Daily Needs & Shelter', 
    icon: HomeIcon,
    shortDesc: 'nutritious meals, clothing, healthcare, and shelter.',
    desc: 'Every day, nineteen girls need meals, clothing, healthcare, and a safe home. Your gift keeps the lights on and the table full.'
  },
  { 
    value: 'education', 
    label: 'Education Sponsorship', 
    icon: GraduationCap,
    shortDesc: 'tuition fees, coaching, and study materials.',
    desc: 'Your education sponsorship covers tuition fees, study materials, and coaching support for a girl making her way through college or vocational training.'
  },
  { 
    value: 'beyond_steps_home', 
    label: 'Beyond Steps — A Home of Their Own', 
    icon: Building,
    shortDesc: 'help us purchase a flat for girls stepping into adulthood.',
    desc: 'Help us purchase a flat where our girls can live together as they step into adulthood. Target: ₹1,50,00,000. Every rupee counts.'
  },
  { 
    value: 'beyond_steps_laptops', 
    label: 'Beyond Steps — Laptops', 
    icon: Laptop,
    shortDesc: 'equipping 10 girls to study and work.',
    desc: '10 laptops. 10 girls equipped to study and work. ₹20,000 per laptop. ₹2,00,000 total.'
  },
  { 
    value: 'beyond_steps_higher_ed', 
    label: 'Beyond Steps — Higher Education Fund', 
    icon: BookOpen,
    shortDesc: 'financial support for college degrees.',
    desc: "Sponsor a girl's college degree. ₹10,000/month per girl. Change the course of her life."
  }
];

export default function DonateContent() {
  const formRef = useRef<HTMLDivElement>(null);
  
  const [frequency, setFrequency] = useState<'monthly' | 'one-time'>('monthly');
  const [amount, setAmount] = useState<number | 'custom'>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  
  // Donor details
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  
  const [designation, setDesignation] = useState('general');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [reference, setReference] = useState('');

  // Handle default amount settings when toggling frequency
  useEffect(() => {
    if (frequency === 'monthly') {
      setAmount(1000);
    } else {
      setAmount(5000);
    }
    setCustomAmount('');
  }, [frequency]);

  const handleDonate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const donationAmount = amount === 'custom' ? Number(customAmount) : amount;

    if (!donationAmount || donationAmount < 10) {
      setErrorMsg('Minimum donation is ₹10.');
      setStatus('error');
      return;
    }
    if (donationAmount > 1_000_000) {
      setErrorMsg('Maximum donation is ₹10,00,000. For larger donations, please contact us directly.');
      setStatus('error');
      return;
    }

    if (!donorName.trim()) {
      setErrorMsg('Please enter your full name.');
      setStatus('error');
      return;
    }

    if (!donorEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail)) {
      setErrorMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      // Step 1: Create Razorpay order on backend
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: donationAmount,
          frequency,
          designation,
          currency: 'INR',
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim().toLowerCase(),
          donorPhone: donorPhone.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create order.');
      }

      const order = await res.json();

      // Step 2: Open Razorpay Checkout
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'STEPS Home',
        description: `Donation — ${DESIGNATION_OPTIONS.find(d => d.value === designation)?.label || designation} (${frequency})`,
        order_id: order.orderId,
        handler: async (response: RazorpayResponse) => {
          // Step 3: Verify payment on backend
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setReference(verifyData.reference);
              setStatus('success');
            } else {
              setErrorMsg(verifyData.error || 'Payment verification failed.');
              setStatus('error');
            }
          } catch {
            setErrorMsg('Payment verification failed. Please contact us with your payment details.');
            setStatus('error');
          }
        },
        prefill: {
          name: donorName.trim(),
          email: donorEmail.trim(),
          contact: donorPhone.trim() || undefined,
        },
        theme: { color: '#e9498a' },
        modal: {
          ondismiss: () => {
            setStatus('idle');
          },
        },
      };

      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Payment gateway not loaded. Please refresh and try again.');
      }

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: { error: { description: string } }) => {
        setErrorMsg(response.error.description || 'Payment failed.');
        setStatus('error');
      });
      rzp.open();

    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  }, [amount, customAmount, frequency, designation, donorName, donorEmail, donorPhone]);

  const selectCauseAndScroll = (causeValue: string) => {
    setDesignation(causeValue);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const monthlyTiers = [
    { value: 500, label: 'Daily Meals', desc: "Cover a girl's food and daily essentials", icon: Utensils },
    { value: 1000, label: 'Education Support', desc: 'Fund school supplies, books, and materials', icon: BookOpen },
    { value: 3000, label: 'Full Girl Sponsorship', desc: "Fully sponsor one girl's monthly needs", icon: Heart },
  ];

  const oneTimeTiers = [
    { value: 1000, label: 'A Small Gift', desc: 'Provide immediate assistance where needed' },
    { value: 5000, label: 'A Meaningful Gift', desc: 'Help fund daily operations and essentials' },
    { value: 10000, label: 'A Transforming Gift', desc: 'Fund education fees and study materials' },
    { value: 25000, label: 'A Legacy Gift', desc: 'Help build the foundations for their futures' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-transparent relative">
      {/* Load Razorpay SDK */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Decorative background blobs */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-b from-brand-accent to-transparent blur-[50px] opacity-25 -top-[100px] -right-[100px]"></div>
        <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-b from-brand-accent to-transparent blur-[50px] opacity-25 bottom-[100px] -left-[100px]"></div>
      </div>

      {/* Section 1 — Hero */}
      <section className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-brand-dark mb-6 leading-tight"
          >
            Give a Girl a Future
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed"
          >
            Your donation gives a girl safety, education, and the chance to build her own life.
          </motion.p>
        </div>
      </section>

      {/* Section 2 — Donation Flow Container */}
      <section className="py-8" ref={formRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto text-center bg-white/80 backdrop-blur-md p-10 md:p-14 rounded-[2.5rem] shadow-glass border border-white"
            >
              <div className="inline-flex p-4 bg-green-50 text-green-500 rounded-full mb-6">
                <CheckCircle size={56} />
              </div>
              <h2 className="text-3xl font-serif font-bold text-brand-dark mb-3">Thank You!</h2>
              <p className="text-brand-muted mb-6 leading-relaxed">
                Your donation has been processed successfully. Your support makes a direct difference in our girls&apos; lives.
              </p>
              {reference && (
                <div className="bg-brand-bg p-4 rounded-xl border border-brand-accent/20 mb-6">
                  <p className="text-xs text-brand-muted uppercase tracking-wider font-bold mb-1">Receipt Reference</p>
                  <p className="font-mono font-bold text-lg text-brand-primary">{reference}</p>
                </div>
              )}
              <p className="text-sm text-brand-muted/80 mb-8">A receipt and confirmation email will be sent shortly.</p>
              <button
                onClick={() => { setStatus('idle'); setReference(''); }}
                className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-brand-dark transition-all hover:scale-105 shadow-btn"
              >
                Make Another Donation
              </button>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-10 items-start">
              
              {/* Left Column: Detailed Form (monthly / one-time grids) */}
              <div className="lg:col-span-8 bg-white/70 backdrop-blur-md p-6 sm:p-10 rounded-[2.5rem] shadow-glass border border-white">
                <form onSubmit={handleDonate} className="space-y-8">
                  
                  {/* Toggle Frequency */}
                  <div className="flex justify-between items-center border-b border-brand-accent/20 pb-5">
                    <h3 className="font-serif font-bold text-xl text-brand-dark">Donation Frequency</h3>
                    <div className="flex p-1 bg-brand-bg/50 rounded-full border border-brand-accent/20">
                      <button
                        type="button"
                        onClick={() => setFrequency('monthly')}
                        className={cn(
                          'px-6 py-2.5 rounded-full font-bold text-sm transition-all',
                          frequency === 'monthly'
                            ? 'bg-white text-brand-primary shadow-sm scale-105'
                            : 'text-brand-muted hover:text-brand-dark'
                        )}
                      >
                        Monthly
                      </button>
                      <button
                        type="button"
                        onClick={() => setFrequency('one-time')}
                        className={cn(
                          'px-6 py-2.5 rounded-full font-bold text-sm transition-all',
                          frequency === 'one-time'
                            ? 'bg-white text-brand-primary shadow-sm scale-105'
                            : 'text-brand-muted hover:text-brand-dark'
                        )}
                      >
                        One-Time
                      </button>
                    </div>
                  </div>

                  {/* Amount Grid */}
                  <div>
                    <h3 className="font-serif font-bold text-lg text-brand-dark mb-4">Select Gift Amount</h3>
                    
                    {frequency === 'monthly' ? (
                      <div className="grid sm:grid-cols-3 gap-4">
                        {monthlyTiers.map((tier) => {
                          const TierIcon = tier.icon;
                          const isSelected = amount === tier.value;
                          return (
                            <button
                              key={tier.value}
                              type="button"
                              onClick={() => setAmount(tier.value)}
                              className={cn(
                                "p-5 rounded-2xl border-2 text-left transition-all duration-300 relative flex flex-col justify-between group",
                                isSelected 
                                  ? "border-brand-primary bg-brand-primary/5 shadow-md scale-[1.02]" 
                                  : "border-gray-100 bg-white/40 hover:border-brand-accent/40"
                              )}
                            >
                              <div className="flex justify-between items-start w-full mb-3">
                                <div className={cn("p-2 rounded-xl", isSelected ? "bg-brand-primary text-white" : "bg-brand-bg text-brand-primary")}>
                                  <TierIcon size={20} />
                                </div>
                                {isSelected && <span className="w-2 h-2 rounded-full bg-brand-primary" />}
                              </div>
                              <div>
                                <span className="font-mono text-2xl font-bold text-brand-dark">₹{tier.value}</span>
                                <span className="text-xs text-brand-muted font-medium ml-1">/mo</span>
                                <h4 className="font-bold text-brand-dark text-sm mt-2">{tier.label}</h4>
                                <p className="text-xs text-brand-muted mt-1 leading-normal">{tier.desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {oneTimeTiers.map((tier) => {
                          const isSelected = amount === tier.value;
                          return (
                            <button
                              key={tier.value}
                              type="button"
                              onClick={() => setAmount(tier.value)}
                              className={cn(
                                "p-5 rounded-2xl border-2 text-left transition-all duration-300 relative flex flex-col justify-between group",
                                isSelected 
                                  ? "border-brand-primary bg-brand-primary/5 shadow-md scale-[1.02]" 
                                  : "border-gray-100 bg-white/40 hover:border-brand-accent/40"
                              )}
                            >
                              <div className="flex justify-between items-start w-full mb-3">
                                <div className={cn("p-2 rounded-xl bg-brand-bg text-brand-primary group-hover:scale-110 transition-transform")}>
                                  <Coins size={18} />
                                </div>
                                {isSelected && <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />}
                              </div>
                              <div>
                                <span className="font-mono text-2xl font-bold text-brand-dark">₹{tier.value.toLocaleString()}</span>
                                <h4 className="font-bold text-brand-dark text-sm mt-2">{tier.label}</h4>
                                <p className="text-[11px] text-brand-muted mt-1 leading-normal">{tier.desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Custom Button Option */}
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setAmount('custom')}
                        className={cn(
                          "w-full p-4 rounded-2xl border-2 text-center font-bold text-base transition-all",
                          amount === 'custom'
                            ? "border-brand-primary bg-brand-primary text-white shadow-btn"
                            : "border-brand-accent/30 text-brand-primary bg-brand-accent/5 hover:bg-brand-accent/10"
                        )}
                      >
                        Custom Amount (Your Choice)
                      </button>
                    </div>
                  </div>

                  {/* Custom Amount Input field */}
                  {amount === 'custom' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-brand-bg/40 p-5 rounded-2xl border border-brand-accent/20"
                    >
                      <label className="block text-sm font-semibold text-brand-dark mb-2">Enter Custom Gift</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary font-serif font-bold text-xl">₹</span>
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-0 outline-none text-lg font-bold text-brand-text bg-white"
                          placeholder="Amount (₹10 - ₹10,00,000)"
                          min={10}
                          max={1000000}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Designation Selection */}
                  <div>
                    <h3 className="font-serif font-bold text-lg text-brand-dark mb-4">Choose Designation</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {DESIGNATION_OPTIONS.map((opt) => {
                        const OptIcon = opt.icon;
                        const isSelected = designation === opt.value;
                        return (
                          <label
                            key={opt.value}
                            className={cn(
                              "flex gap-4 p-4 rounded-2xl border cursor-pointer transition-all bg-white/40",
                              isSelected 
                                ? "border-brand-primary ring-1 ring-brand-primary" 
                                : "border-gray-100 hover:bg-white"
                            )}
                          >
                            <input
                              type="radio"
                              name="designation"
                              value={opt.value}
                              checked={isSelected}
                              onChange={(e) => setDesignation(e.target.value)}
                              className="text-brand-primary focus:ring-brand-primary w-5 h-5 shrink-0 mt-0.5"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <OptIcon className="text-brand-primary shrink-0" size={16} />
                                <span className="font-bold text-brand-dark text-sm">{opt.label}</span>
                              </div>
                              <p className="text-xs text-brand-muted mt-1 leading-normal">{opt.shortDesc}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Donor Info (Capture Name, Email, Phone) */}
                  <div className="border-t border-brand-accent/20 pt-6">
                    <h3 className="font-serif font-bold text-lg text-brand-dark mb-4">Donor Information</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                        <input
                          type="text"
                          required
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          placeholder="Full Name"
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-100 focus:border-brand-primary outline-none text-sm font-semibold bg-white/50"
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                        <input
                          type="email"
                          required
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          placeholder="Email Address"
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-100 focus:border-brand-primary outline-none text-sm font-semibold bg-white/50"
                        />
                      </div>
                      <div className="relative sm:col-span-2">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                        <input
                          type="tel"
                          value={donorPhone}
                          onChange={(e) => setDonorPhone(e.target.value)}
                          placeholder="Phone Number (Optional)"
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-100 focus:border-brand-primary outline-none text-sm font-semibold bg-white/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Error Notification */}
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 text-red-600 px-5 py-4 rounded-xl text-sm flex items-start gap-3 border border-red-200"
                    >
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Error:</span> {errorMsg || 'Something went wrong. Please try again.'}
                      </div>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-gradient-to-br from-brand-primary to-brand-dark text-white py-4.5 rounded-xl font-bold text-lg hover:opacity-95 transition-all shadow-btn flex items-center justify-center gap-3 disabled:opacity-60 hover:scale-[1.01]"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 size={22} className="animate-spin" />
                        Generating Payment Session...
                      </>
                    ) : (
                      <>
                        <Heart size={22} fill="currentColor" />
                        Complete Donation ({amount === 'custom' ? (customAmount ? `₹${Number(customAmount).toLocaleString()}` : 'Custom') : `₹${amount.toLocaleString()}`})
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-brand-muted flex items-center justify-center gap-1.5 pt-2">
                    <ShieldCheck size={16} className="text-green-500 shrink-0" />
                    Secure payment gateway verification powered by Razorpay.
                  </p>
                </form>
              </div>

              {/* Right Column: General Sidebar Details (Tax/Bank) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Section 4 — Tax Benefits Card */}
                <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-brand-accent/20 shadow-glass">
                  <div className="inline-flex p-3 bg-brand-bg text-brand-primary rounded-xl mb-4">
                    <FileText size={24} />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-brand-dark mb-2">Your Gift Is Tax-Deductible</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    Steps Home holds 80G certification under the Income Tax Act, 1961. Donations made to Steps Home are eligible for a tax deduction under Section 80G.
                  </p>
                </div>

                {/* Section 5 — Bank Details Card */}
                <div className="bg-brand-dark text-white p-8 rounded-[2rem] shadow-sleek relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <TrendingUp size={240} />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <div>
                      <span className="text-brand-accent text-xs font-bold uppercase tracking-wider">Direct Bank Transfer</span>
                      <h3 className="text-xl font-serif font-bold mt-1 mb-3">Bank Details</h3>
                      <div className="space-y-2 text-sm bg-black/20 p-4 rounded-xl border border-white/10 font-mono">
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-white/60">Account Name:</span>
                          <span className="text-white font-bold">Steps Trust</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-white/60">Account No:</span>
                          <span className="text-white font-bold select-all">0777104000051244</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-white/60">IFSC Code:</span>
                          <span className="text-white font-bold select-all">IBKL0000777</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-white/60">Bank Name:</span>
                          <span className="text-white">IDBI Bank</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Branch:</span>
                          <span className="text-white">Anna Nagar</span>
                        </div>
                      </div>
                    </div>

                    {/* QR Code Container */}
                    {/* <div className="border-t border-white/15 pt-5 text-center">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-accent uppercase tracking-wider mb-3">
                        <QrCode size={14} /> Scan with UPI App
                      </div>
                      <div className="bg-white p-3 rounded-2xl inline-block shadow-lg border border-white/10">
                        <img 
                          src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi%3A%2F%2Fpay%3Fpa%3Dsteps%40idbi%26pn%3DSteps%2520Trust%26cu%3DINR" 
                          alt="Steps Trust UPI QR Code"
                          className="w-[150px] h-[150px] object-contain"
                        />
                      </div>
                      <p className="text-[10px] text-white/50 mt-2 font-mono">PN: Steps Trust · VPA: steps@idbi</p>
                    </div> */}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 3 — Give to a Specific Cause */}
      <section className="py-20 bg-white/50 backdrop-blur-sm border-t border-brand-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4"
            >
              Choose Where Your Gift Goes
            </motion.h2>
            <div className="w-12 h-1 bg-brand-primary mx-auto rounded-full mb-4"></div>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-brand-muted max-w-xl mx-auto text-base"
            >
              Directly sponsor one of our core initiatives or post-18 transition campaigns.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* Cause 1: Education */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl border border-brand-accent/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-xl mb-5">
                  <GraduationCap size={24} />
                </div>
                <h3 className="text-xl font-serif font-bold text-brand-dark mb-3">Education Sponsorship</h3>
                <p className="text-brand-muted text-sm leading-relaxed mb-6">
                  Your education sponsorship covers tuition fees, study materials, and coaching support for a girl making her way through college or vocational training.
                </p>
              </div>
              <button
                type="button"
                onClick={() => selectCauseAndScroll('education')}
                className="w-full text-center bg-blue-50 text-blue-700 font-bold py-3 rounded-xl hover:bg-brand-primary hover:text-white transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                Sponsor Education <ArrowRight size={14} />
              </button>
            </motion.div>

            {/* Cause 2: Daily Needs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-3xl border border-brand-accent/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="inline-flex p-3 bg-brand-bg text-brand-primary rounded-xl mb-5">
                  <HomeIcon size={24} />
                </div>
                <h3 className="text-xl font-serif font-bold text-brand-dark mb-3">Daily Needs and Shelter</h3>
                <p className="text-brand-muted text-sm leading-relaxed mb-6">
                  Every day, nineteen girls need meals, clothing, healthcare, and a safe home. Your gift keeps the lights on and the table full.
                </p>
              </div>
              <button
                type="button"
                onClick={() => selectCauseAndScroll('general')}
                className="w-full text-center bg-brand-bg text-brand-primary font-bold py-3 rounded-xl hover:bg-brand-primary hover:text-white transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                Support General Fund <ArrowRight size={14} />
              </button>
            </motion.div>

            {/* Cause 3: Beyond Steps Flat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-3xl border border-brand-accent/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between lg:col-span-1 md:col-span-2 lg:md:col-span-1"
            >
              <div>
                <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-xl mb-5">
                  <Building size={24} />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-serif font-bold text-brand-dark">A Home of Their Own</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 shrink-0">Campaign</span>
                </div>
                <p className="text-brand-muted text-sm leading-relaxed mb-6">
                  Help us purchase a flat where our girls can live together as they step into adulthood. Target: ₹1,50,00,000. Every rupee counts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => selectCauseAndScroll('beyond_steps_home')}
                className="w-full text-center bg-emerald-50 text-emerald-700 font-bold py-3 rounded-xl hover:bg-emerald-650 hover:bg-emerald-600 hover:text-white transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                Support Flat Campaign <ArrowRight size={14} />
              </button>
            </motion.div>

            {/* Cause 4: Beyond Steps Laptops */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl border border-brand-accent/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="inline-flex p-3 bg-amber-50 text-amber-600 rounded-xl mb-5">
                  <Laptop size={24} />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-serif font-bold text-brand-dark">Beyond Steps — Laptops</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200 shrink-0">Campaign</span>
                </div>
                <p className="text-brand-muted text-sm leading-relaxed mb-6">
                  10 laptops. 10 girls equipped to study and work. ₹20,000 per laptop. ₹2,00,000 total.
                </p>
              </div>
              <button
                type="button"
                onClick={() => selectCauseAndScroll('beyond_steps_laptops')}
                className="w-full text-center bg-amber-50 text-amber-700 font-bold py-3 rounded-xl hover:bg-amber-600 hover:text-white transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                Gift a Laptop <ArrowRight size={14} />
              </button>
            </motion.div>

            {/* Cause 5: Higher Education Fund */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-3xl border border-brand-accent/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="inline-flex p-3 bg-purple-50 text-purple-600 rounded-xl mb-5">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-xl font-serif font-bold text-brand-dark mb-3">Higher Education Fund</h3>
                <p className="text-brand-muted text-sm leading-relaxed mb-6">
                  Sponsor a girl&apos;s college degree. ₹10,000/month per girl. Change the course of her life.
                </p>
              </div>
              <button
                type="button"
                onClick={() => selectCauseAndScroll('beyond_steps_higher_ed')}
                className="w-full text-center bg-purple-50 text-purple-700 font-bold py-3 rounded-xl hover:bg-purple-650 hover:bg-purple-600 hover:text-white transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                Sponsor Degree <ArrowRight size={14} />
              </button>
            </motion.div>

            {/* Cause 6: Marriage Settlement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-3xl border border-brand-accent/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="inline-flex p-3 bg-rose-50 text-rose-600 rounded-xl mb-5">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-serif font-bold text-brand-dark mb-3">Marriage Foundation</h3>
                <p className="text-brand-muted text-sm leading-relaxed mb-6">
                  Provide a foundation fund for each girl when she is ready to start her own family — something she would otherwise have no support for.
                </p>
              </div>
              <button
                type="button"
                onClick={() => selectCauseAndScroll('general')}
                className="w-full text-center bg-rose-50 text-rose-700 font-bold py-3 rounded-xl hover:bg-rose-600 hover:text-white transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                Support Foundation <ArrowRight size={14} />
              </button>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
