import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — STEPS Home',
  description: 'Terms and conditions governing your use of the STEPS Home website and donation services.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-brand-dark mb-8">Terms of Service</h1>
        <p className="text-brand-muted mb-6">Last updated: April 2026</p>

        <div className="prose prose-lg max-w-none text-brand-text space-y-8">
          <section>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">1. About STEPS Home</h2>
            <p className="text-brand-muted leading-relaxed">
              STEPS Home is a registered charitable trust dedicated to rescuing, rehabilitating, and 
              empowering underprivileged girls. This website is operated by STEPS Home, registered in 
              Chennai, Tamil Nadu, India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">2. Donations</h2>
            <ul className="list-disc pl-6 text-brand-muted space-y-2">
              <li>All donations are voluntary and non-refundable unless processed in error.</li>
              <li>Donations are processed securely through Razorpay payment gateway.</li>
              <li>A donation receipt will be issued for all successful transactions.</li>
              <li>Donations to STEPS Home are eligible for tax exemption under <strong>Section 80G</strong> of the Income Tax Act, 1961.</li>
              <li>STEPS Home reserves the right to allocate donations to where they are most needed, regardless of designation preference.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">3. Tax Exemption</h2>
            <p className="text-brand-muted leading-relaxed">
              STEPS Home is registered under Section 12A of the Income Tax Act. Donations qualify 
              for deduction under Section 80G. Upon successful donation, you will receive a receipt 
              with our 80G registration number that can be used for tax filing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">4. Refund Policy</h2>
            <ul className="list-disc pl-6 text-brand-muted space-y-2">
              <li>Donations are generally non-refundable as they are charitable contributions.</li>
              <li>In case of duplicate or erroneous transactions, please contact us within 7 days.</li>
              <li>Refund requests will be reviewed on a case-by-case basis.</li>
              <li>Approved refunds will be processed within 10 business days to the original payment method.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">5. Volunteer Applications</h2>
            <p className="text-brand-muted leading-relaxed">
              Submitting a volunteer application does not guarantee acceptance. STEPS Home reserves the 
              right to accept or decline volunteer applications based on organizational needs, background 
              checks, and suitability. All volunteers must comply with our child protection policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">6. Intellectual Property</h2>
            <p className="text-brand-muted leading-relaxed">
              All content on this website, including text, images, logos, and design elements, is the 
              property of STEPS Home and is protected by copyright laws. You may not reproduce, distribute, 
              or use any content without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">7. Website Usage</h2>
            <ul className="list-disc pl-6 text-brand-muted space-y-2">
              <li>You agree not to misuse this website or attempt to gain unauthorized access.</li>
              <li>You agree not to submit false information through any form.</li>
              <li>We reserve the right to block access for abusive or fraudulent behavior.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">8. Limitation of Liability</h2>
            <p className="text-brand-muted leading-relaxed">
              STEPS Home provides this website on an &quot;as is&quot; basis. We make no warranties regarding 
              availability, accuracy, or completeness of content. STEPS Home shall not be liable for any 
              indirect, incidental, or consequential damages arising from the use of this website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">9. Governing Law</h2>
            <p className="text-brand-muted leading-relaxed">
              These terms are governed by the laws of India. Any disputes shall be subject to the 
              exclusive jurisdiction of the courts in Chennai, Tamil Nadu.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">10. Contact</h2>
            <p className="text-brand-muted leading-relaxed">
              For questions about these terms:
            </p>
            <p className="text-brand-muted">
              <strong>Email:</strong> <a href="mailto:isactara@gmail.com" className="text-brand-primary hover:underline">isactara@gmail.com</a><br />
              <strong>Phone:</strong> <a href="tel:+919884026250" className="text-brand-primary hover:underline">98840 26250</a><br />
              <strong>Address:</strong> No:6, Kandigai Road, TVS Nagar, Korathur North, Chennai - 600 076.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
