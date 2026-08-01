'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { HeartHandshake, Briefcase, Building2, CheckCircle, Loader2 } from 'lucide-react';

export default function JoinContent() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    helpType: 'Teaching / Tutoring',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        helpType: 'Teaching / Tutoring',
        message: '',
      });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit');
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-b from-brand-accent to-transparent blur-[40px] opacity-30 -top-[100px] -right-[100px]"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-b from-brand-accent to-transparent blur-[40px] opacity-30 -bottom-[50px] -left-[50px]"></div>
      </div>

      {/* Header */}
      <section className="bg-brand-dark text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="floral-join" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M10,0 C15,5 15,15 10,20 C5,15 5,5 10,0 Z" fill="currentColor" />
              <path d="M0,10 C5,5 15,5 20,10 C15,15 5,15 0,10 Z" fill="currentColor" />
            </pattern>
            <rect width="100" height="100" fill="url(#floral-join)" />
          </svg>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif font-bold mb-6"
          >
            Walk With Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-brand-accent leading-relaxed max-w-2xl mx-auto"
          >
            Whether you give your time, your skills, or your resources, there is a place for you in the Steps Home family.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-transparent">
        <h4 className="text-3xl font-serif font-bold text-brand-primary mb-12 relative z-10 text-center w-full"> Ways to Get Involved</h4>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
            {[
              {
                icon: HeartHandshake,
                title: 'Volunteer',
                desc: 'Spend time with our girls as a mentor, tutor, or event volunteer. Your presence matters more than you know.',
              },
              {
                icon: Briefcase,
                title: 'Internships',
                desc: 'Are you a student or young professional? Intern with Steps Home and gain real-world experience while making a genuine difference.',
              },
              {
                icon: Building2,
                title: 'Corporate Partners',
                desc: 'Help us build a more sustainable future through CSR partnerships, sponsorships, and in-kind contributions that go directly to the girls.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sleek border border-brand-primary/5 text-center"
              >
                <div className="inline-flex p-4 bg-brand-bg text-brand-primary rounded-full mb-6">
                  <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-brand-dark mb-4">{item.title}</h3>
                <p className="text-brand-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Volunteer Form */}
          <div className="max-w-3xl mx-auto glass-card overflow-hidden">
            <div className="p-6 md:p-8 lg:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">Volunteer Sign Up</h2>
                <p className="text-brand-muted">Fill out the form below and our team will get back to you shortly.</p>
              </div>

              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-serif font-bold text-brand-dark mb-2">Thank You!</h3>
                  <p className="text-brand-muted mb-6">Your application has been submitted successfully. We&apos;ll get back to you shortly.</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="text-brand-primary font-bold hover:underline"
                  >
                    Submit another application
                  </button>
                </motion.div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-brand-text mb-2">First Name <span className="text-red-500">*</span></label>
                      <input
                        id="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#ddd] focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all bg-white"
                        placeholder="Jane"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-brand-text mb-2">Last Name <span className="text-red-500">*</span></label>
                      <input
                        id="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#ddd] focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all bg-white"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-brand-text mb-2">Email Address<span className="text-red-500">*</span></label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#ddd] focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all bg-white"
                      placeholder="jane@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-brand-text mb-2">Phone Number<span className="text-red-500">*</span></label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#ddd] focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all bg-white"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label htmlFor="helpType" className="block text-sm font-medium text-brand-text mb-2">How would you like to help?<span className="text-red-500">*</span></label>
                    <select
                      id="helpType"
                      value={formData.helpType}
                      onChange={(e) => setFormData({ ...formData, helpType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#ddd] focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all bg-white"
                    >
                      <option>Teaching / Tutoring</option>
                      <option>Mentoring</option>
                      <option>Event Organization</option>
                      <option>Fundraising</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-brand-text mb-2">Message (Optional)</label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#ddd] focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all resize-none bg-white"
                      placeholder="Tell us a bit about yourself..."
                    ></textarea>
                  </div>

                  {status === 'error' && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-linear-to-br from-brand-primary to-brand-dark text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-btn flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
