import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | TajWater',
  description: 'Privacy Policy and data protection guidelines for TajWater and pay.tajwater.ca.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-8">
          <Link href="/" className="text-sm text-[#0097a7] hover:underline">← Back to Home</Link>
        </div>

        <div className="bg-white rounded-3xl border border-[#cce7f0] shadow-sm p-8 sm:p-12 prose prose-slate max-w-none">
          <h1 className="text-3xl font-extrabold text-[#0c2340] mb-2">Privacy Policy</h1>
          <p className="text-[#4a7fa5] text-sm mb-8">Last updated: April 2026 · PIPEDA compliant</p>

          <p className="text-[#4a7fa5] leading-relaxed">
            TajWater (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information in accordance with the Personal Information Protection and Electronic Documents Act (PIPEDA).
          </p>

          <h2 className="text-lg font-bold text-[#0c2340] mt-8 mb-3">1. Information We Collect</h2>
          <p className="text-[#4a7fa5] leading-relaxed mb-2">We collect information across our primary platform (tajwater.ca) and our custom payment portal (pay.tajwater.ca):</p>
          <ul className="text-[#4a7fa5] leading-relaxed space-y-1 list-disc list-inside">
            <li><strong>Account information:</strong> Name, email address, phone number</li>
            <li><strong>Delivery information:</strong> Delivery address and zone</li>
            <li><strong>Payment metadata:</strong> Order history, products ordered, delivery dates, and custom payment link metadata</li>
            <li><strong>Financial data:</strong> Processed securely by Square — we never store full credit card numbers</li>
            <li><strong>Usage data:</strong> Pages visited, browser type, IP address, and timestamp data (collected automatically for security and analytics)</li>
            <li><strong>Communications:</strong> Support tickets, emails, and SMS messages</li>
          </ul>

          <h2 className="text-lg font-bold text-[#0c2340] mt-8 mb-3">2. How We Use Your Information</h2>
          <ul className="text-[#4a7fa5] leading-relaxed space-y-1 list-disc list-inside">
            <li>To process, fulfill, and deliver your orders</li>
            <li>To manage your subscriptions and user account</li>
            <li>To generate and send custom payment links (via email or SMS)</li>
            <li>To send transactional messages: order confirmations, invoices, and delivery updates</li>
            <li>To provide customer support and respond to inquiries</li>
            <li>To improve our website functionality, payment portals, and general services</li>
            <li>To comply with legal, tax, and accounting obligations</li>
          </ul>

          <h2 className="text-lg font-bold text-[#0c2340] mt-8 mb-3">3. Information Sharing & Payment Processing</h2>
          <p className="text-[#4a7fa5] leading-relaxed">
            We do not sell your personal information. Data is shared exclusively with trusted third-party service providers required to operate our business:
          </p>
          <ul className="text-[#4a7fa5] leading-relaxed space-y-1 list-disc list-inside mt-2 mb-4">
            <li><strong>Square</strong> — Processes all credit card payments (tajwater.ca/shop and pay.tajwater.ca). Square is PCI-DSS Level 1 compliant. TajWater does not process or store sensitive card data.</li>
            <li><strong>Supabase</strong> — Hosts our database, user authentication, and secure session management.</li>
            <li><strong>Resend</strong> — Delivers all transactional emails, including custom payment links and receipts.</li>
            <li><strong>Delivery Personnel</strong> — Provided only with your name, delivery address, and specific delivery notes necessary to complete the service.</li>
            <li><strong>Law Enforcement</strong> — Only when strictly required by law.</li>
          </ul>

          <h2 className="text-lg font-bold text-[#0c2340] mt-8 mb-3">4. Data Retention & Link Expiry</h2>
          <p className="text-[#4a7fa5] leading-relaxed">
            We adhere to data minimization principles. We retain account information as long as your account remains active. Order records and completed custom payment links are retained for 7 years to fulfill Canada Revenue Agency (CRA) tax and audit requirements. Unpaid custom payment links expire automatically after 30 days. You may request the deletion of your account and personal data at any time, subject to our legal retention obligations.
          </p>

          <h2 className="text-lg font-bold text-[#0c2340] mt-8 mb-3">5. Your Rights (PIPEDA)</h2>
          <p className="text-[#4a7fa5] leading-relaxed">Under PIPEDA, you have the right to:</p>
          <ul className="text-[#4a7fa5] leading-relaxed space-y-1 list-disc list-inside mt-2">
            <li>Access the personal information we hold about you</li>
            <li>Request corrections to inaccurate or incomplete data</li>
            <li>Withdraw your consent for certain non-essential data uses</li>
            <li>Request the deletion of your account and personal data</li>
            <li>File a complaint with the Office of the Privacy Commissioner of Canada</li>
          </ul>

          <h2 className="text-lg font-bold text-[#0c2340] mt-8 mb-3">6. Security Measures</h2>
          <p className="text-[#4a7fa5] leading-relaxed">
            We employ industry-standard security protocols to protect your data. This includes end-to-end SSL encryption on all domains (tajwater.ca and pay.tajwater.ca), secure token-based authentication, and Row-Level Security within our database infrastructure to ensure data isolation. 
          </p>

          <h2 className="text-lg font-bold text-[#0c2340] mt-8 mb-3">7. Cookies</h2>
          <p className="text-[#4a7fa5] leading-relaxed">
            We utilize essential cookies for authentication, session management, and preventing cross-site request forgery (CSRF). We may also deploy analytics cookies to evaluate website usage. You may disable non-essential cookies via your browser preferences.
          </p>

          <h2 className="text-lg font-bold text-[#0c2340] mt-8 mb-3">8. Contact Our Privacy Officer</h2>
          <p className="text-[#4a7fa5] leading-relaxed">
            For privacy inquiries, access requests, or to register a complaint, please contact us at:{' '}
            <a href="mailto:privacy@tajwater.ca" className="text-[#0097a7] hover:underline">privacy@tajwater.ca</a>
            <br />
            TajWater · Metro Vancouver, BC, Canada
          </p>
        </div>
      </div>
    </div>
  )
}
