import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | TajWater',
  description: 'Terms and Conditions for TajWater services and the custom payment portal.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-8">
          <Link href="/" className="text-sm text-[#0097a7] hover:underline">← Back to Home</Link>
        </div>

        <div className="bg-white rounded-3xl border border-[#cce7f0] shadow-sm p-8 sm:p-12 prose prose-slate max-w-none">
          <h1 className="text-3xl font-extrabold text-[#0c2340] mb-2">Terms of Service</h1>
          <p className="text-[#4a7fa5] text-sm mb-8">Last updated: April 2026</p>

          <h2 className="text-lg font-bold text-[#0c2340] mt-8 mb-3">1. Acceptance of Terms</h2>
          <p className="text-[#4a7fa5] leading-relaxed">
            By placing an order, making a payment, or using the TajWater website (including tajwater.ca and pay.tajwater.ca), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
          </p>

          <h2 className="text-lg font-bold text-[#0c2340] mt-8 mb-3">2. Service Description</h2>
          <p className="text-[#4a7fa5] leading-relaxed">
            TajWater provides premium bottled water delivery services within Metro Vancouver. We offer one-time orders, recurring subscription deliveries, and custom invoice settlement services. Service availability is subject to your delivery zone.
          </p>

          <h2 className="text-lg font-bold text-[#0c2340] mt-8 mb-3">3. Orders and Payments</h2>
          <p className="text-[#4a7fa5] leading-relaxed">
            All orders are subject to product availability. Prices are displayed in Canadian dollars (CAD) and include applicable taxes (GST + PST). We process payments securely via Square for both our main shop and our custom payment portal. We reserve the right to cancel or refuse any order or payment.
          </p>

          <h2 className="text-lg font-bold text-[#0c2340] mt-8 mb-3">4. Custom Payment Links (pay.tajwater.ca)</h2>
          <ul className="text-[#4a7fa5] leading-relaxed space-y-1 list-disc list-inside">
            <li><strong>Issuance:</strong> Custom payment links are generated exclusively by TajWater staff for specific invoices, adjustments, or special orders.</li>
            <li><strong>Non-Negotiable:</strong> The amount specified on a custom payment link is set by TajWater and is non-negotiable via the portal.</li>
            <li><strong>Single Use & Non-Transferable:</strong> Links are intended solely for the designated customer and are single-use.</li>
            <li><strong>Acceptable Use:</strong> Payment links must not be shared publicly or paid by unauthorized third parties. Doing so may result in payment reversal and service suspension.</li>
          </ul>

          <h2 className="text-lg font-bold text-[#0c2340] mt-8 mb-3">5. Delivery</h2>
          <p className="text-[#4a7fa5] leading-relaxed">
            Delivery windows are estimates only. TajWater is not liable for delays due to weather, traffic, or other circumstances outside our control. You must ensure someone is available to receive the delivery or provide specific drop-off instructions.
          </p>

          <h2 className="text-lg font-bold text-[#0c2340] mt-8 mb-3">6. Cancellations and Refunds</h2>
          <p className="text-[#4a7fa5] leading-relaxed">
            <strong>Standard Orders:</strong> Orders may be cancelled before dispatch for a full refund. Once an order is out for delivery, cancellations are subject to our discretion.
            <br/><br/>
            <strong>Custom Payments:</strong> Refunds for transactions processed via pay.tajwater.ca must be requested by contacting support within 48 hours of payment.
            <br/><br/>
            Refunds are processed to the original payment method and may take 5–10 business days to appear on your statement.
          </p>

          <h2 className="text-lg font-bold text-[#0c2340] mt-8 mb-3">7. Subscriptions</h2>
          <p className="text-[#4a7fa5] leading-relaxed">
            Subscription plans renew automatically at the selected frequency (weekly, biweekly, or monthly). You may pause or cancel your subscription at any time from your dashboard. No cancellation fees apply.
          </p>

          <h2 className="text-lg font-bold text-[#0c2340] mt-8 mb-3">8. Limitation of Liability</h2>
          <p className="text-[#4a7fa5] leading-relaxed">
            TajWater&apos;s liability is strictly limited to the value of the order or payment in question. We are not liable for indirect, incidental, or consequential damages. Our products are food-grade certified and tested regularly.
          </p>

          <h2 className="text-lg font-bold text-[#0c2340] mt-8 mb-3">9. Changes to Terms</h2>
          <p className="text-[#4a7fa5] leading-relaxed">
            We may update these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.
          </p>

          <h2 className="text-lg font-bold text-[#0c2340] mt-8 mb-3">10. Contact</h2>
          <p className="text-[#4a7fa5] leading-relaxed">
            Questions about these terms? Contact us at{' '}
            <a href="mailto:info@tajwater.ca" className="text-[#0097a7] hover:underline">info@tajwater.ca</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
