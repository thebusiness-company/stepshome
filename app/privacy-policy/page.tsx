import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — STEPS Home',
  description: 'Learn how STEPS Home collects, uses, and protects your personal information.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-brand-dark mb-8">Privacy Policy</h1>
        <p className="text-brand-muted mb-6">Last updated: April 2026</p>

        <div className="prose prose-lg max-w-none text-brand-text space-y-8">
          <section>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">1. Information We Collect</h2>
            <p className="text-brand-muted leading-relaxed">When you interact with STEPS Home, we may collect the following information:</p>
            <ul className="list-disc pl-6 text-brand-muted space-y-2">
              <li><strong>Contact Information:</strong> Name, email address, phone number when you volunteer, donate, or subscribe to our newsletter.</li>
              <li><strong>Donation Information:</strong> Donation amount, frequency, designation, and payment reference. We do <strong>not</strong> store credit card or bank account numbers — all payment processing is handled by Razorpay.</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, browser type, and device information (collected via analytics).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-brand-muted space-y-2">
              <li>To process your donations and issue tax exemption receipts (Section 80G).</li>
              <li>To respond to your volunteer applications and inquiries.</li>
              <li>To send newsletters and updates (only if you subscribed).</li>
              <li>To improve our website and services.</li>
              <li>To comply with legal and regulatory requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">3. Payment Security</h2>
            <p className="text-brand-muted leading-relaxed">
              All payment transactions are processed through <strong>Razorpay</strong>, a PCI-DSS Level 1 compliant payment gateway. 
              STEPS Home does not store, process, or have access to your credit/debit card details. 
              All payment data is encrypted using industry-standard SSL/TLS encryption.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">4. Data Protection</h2>
            <ul className="list-disc pl-6 text-brand-muted space-y-2">
              <li>All data is stored in encrypted databases with restricted access.</li>
              <li>Admin access is protected by authenticated sessions with HMAC-signed tokens.</li>
              <li>All API endpoints enforce rate limiting to prevent abuse.</li>
              <li>HTTPS is enforced on all pages.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">5. Data Sharing</h2>
            <p className="text-brand-muted leading-relaxed">
              We <strong>do not</strong> sell, trade, or rent your personal information to third parties. 
              We may share information only with:
            </p>
            <ul className="list-disc pl-6 text-brand-muted space-y-2">
              <li><strong>Payment processors</strong> (Razorpay) for transaction processing.</li>
              <li><strong>Government authorities</strong> when required by law (e.g., tax compliance).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">6. Your Rights</h2>
            <p className="text-brand-muted leading-relaxed">You have the right to:</p>
            <ul className="list-disc pl-6 text-brand-muted space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data (subject to legal retention requirements).</li>
              <li>Unsubscribe from newsletters at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">7. Cookies</h2>
            <p className="text-brand-muted leading-relaxed">
              We use essential cookies for admin authentication. We do not use third-party tracking cookies. 
              By using our website, you consent to the use of essential cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">8. Contact Us</h2>
            <p className="text-brand-muted leading-relaxed">
              For any privacy-related concerns, please contact us at:
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
