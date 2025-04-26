import React from 'react';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-amber-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif text-center mb-8 text-gray-800">GitaSpeaks – Refund and Cancellation Policy</h1>
        
        <div className="max-w-4xl mx-auto space-y-8 text-lg leading-relaxed text-gray-700">
          <div className="text-right">
            <p className="mb-4 text-sm text-muted-foreground mb-8 text-gray-600"><strong>Effective Date: 26th April 2025</strong></p>
          </div>

          <section>
            <h2 className="text-2xl font-serif text-gray-800 mb-4">1. Subscriptions and Payments</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>GitaSpeaks offers monthly and yearly subscription plans.</li>
              <li>Payments are processed securely through third-party payment gateways.</li>
              <li>All prices are listed in INR (for Indian users) and USD (for international users).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-gray-800 mb-4">2. Free Trial Access</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>New users are eligible for a limited number of free chats before upgrading to a paid plan.</li>
              <li>We encourage users to explore the platform through the free trial to ensure it meets their needs before subscribing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-gray-800 mb-4">3. Refund Policy</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All purchases are non-refundable.</li>
              <li>Once a subscription is activated, we do not offer partial or full refunds, except in cases of proven accidental duplicate payments.</li>
              <li>We believe the free trial period provides sufficient opportunity to experience GitaSpeaks before making a payment decision.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-gray-800 mb-4">4. Failed Transactions or Duplicate Charges</h2>
            <p>
              If you experience duplicate billing or any payment processing error, please contact us at{' '}
              <a href="mailto:contact@gitaspeaks.com" className="text-[#973B00] hover:text-[#BA4D00]">
                contact@gitaspeaks.com
              </a>{' '}
              within 7 days of the transaction. We will review and resolve genuine cases promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-gray-800 mb-4">5. Changes to This Policy</h2>
            <p>
              GitaSpeaks reserves the right to modify this Refund and Cancellation Policy at any time. Changes will be posted on this page with an updated effective date. Continued use of the platform after changes indicates acceptance of the revised policy.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-serif text-gray-800 mb-4">Contact Us</h2>
            <p>
              If you have any questions about this policy or encounter billing issues, please contact:
            </p>
            <p className="mt-2">
              Email:{' '}
              <a href="mailto:contact@gitaspeaks.com" className="text-[#973B00] hover:text-[#BA4D00]">
                contact@gitaspeaks.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 