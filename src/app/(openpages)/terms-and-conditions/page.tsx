import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions – GitaSpeaks',
  description: 'Terms and Conditions for GitaSpeaks',
};

export default function TermsAndConditions() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions – GitaSpeaks</h1>
      <p className="mb-4"><strong>Effective Date: 10th April, 2025</strong></p>
      <p className="mb-6">Welcome to GitaSpeaks. These Terms and Conditions ("Terms") govern your access to and use of our website, services, and any features provided through our platform. By accessing or using GitaSpeaks, you agree to be bound by these Terms. If you do not agree, please do not use our services.</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Use of the Service</h2>
      <p className="mb-4">GitaSpeaks provides spiritual guidance based on the teachings of the Bhagavad Gita through an AI-powered conversational interface. The service is designed for educational, inspirational, and personal reflection purposes.</p>
      <p className="mb-2">By using the platform, you confirm that:</p>
      <ul className="list-disc pl-8 mb-6">
        <li className="mb-2">You are at least 13 years old.</li>
        <li className="mb-2">You will use the service lawfully and respectfully.</li>
        <li className="mb-2">You will not misuse or exploit any part of the platform or its content.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Disclaimer of Advice</h2>
      <p className="mb-4">The responses provided by the AI on GitaSpeaks are rooted in interpretations of the Bhagavad Gita and are intended to support personal reflection and inner development.</p>
      <p className="mb-4">They do not constitute professional advice in the areas of mental health, medical care, law, finance, or other licensed services.</p>
      <p className="mb-6">You are solely responsible for how you interpret and act upon any guidance provided.</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts and Information</h2>
      <p className="mb-4">You may be required to log in or provide basic information (such as age, gender, location, and areas of concern) to access the full experience of GitaSpeaks.</p>
      <p className="mb-2">By doing so, you agree to:</p>
      <ul className="list-disc pl-8 mb-6">
        <li className="mb-2">Provide accurate and truthful information.</li>
        <li className="mb-2">Keep your login credentials confidential.</li>
        <li className="mb-2">Be responsible for all activity conducted through your account.</li>
      </ul>
      <p className="mb-6">We reserve the right to suspend or terminate your access if we believe your account is being misused.</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Payments and Subscriptions</h2>
      <p className="mb-4">Some features of GitaSpeaks may be offered on a paid basis, such as premium subscriptions or digital spiritual reports.</p>
      <p className="mb-6">All payments are securely processed by trusted third-party providers like Razorpay or Stripe. GitaSpeaks does not store or process your payment card details.</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Intellectual Property</h2>
      <p className="mb-4">All visual designs, vector illustrations (including artwork of Krishna), logos, written content, platform structure, and AI-generated responses are the exclusive property of GitaSpeaks, unless otherwise stated.</p>
      <p className="mb-4">These works are protected by copyright, trademark, and other intellectual property laws.</p>
      <p className="mb-4">You may not copy, reproduce, redistribute, transmit, or use any content from GitaSpeaks for commercial or public use without prior written consent from GitaSpeaks.</p>
      <p className="mb-4">Requests for content usage or licensing must be directed to: contact@gitaspeaks.com.</p>
      <p className="mb-6">Unauthorized use of our intellectual property will be considered a violation and may result in legal action.</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Acceptable Use Policy</h2>
      <p className="mb-2">You agree not to:</p>
      <ul className="list-disc pl-8 mb-6">
        <li className="mb-2">Use the platform for illegal, harmful, or abusive purposes.</li>
        <li className="mb-2">Share or generate discriminatory, threatening, or explicit content through the chat system.</li>
        <li className="mb-2">Attempt to disrupt or reverse-engineer any part of the service.</li>
      </ul>
      <p className="mb-6">We reserve the right to monitor usage and remove access from users who violate these terms.</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
      <p className="mb-4">To the fullest extent permitted by law, GitaSpeaks will not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of the platform.</p>
      <p className="mb-6">The service is provided "as is" and without warranties of any kind, either express or implied, including warranties of merchantability or fitness for a particular purpose.</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">8. Privacy</h2>
      <p className="mb-6">Your use of the platform is governed by our Privacy Policy, which outlines how we collect, use, and protect your data. By using GitaSpeaks, you consent to the practices described in that policy.</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to These Terms</h2>
      <p className="mb-6">We may update these Terms at any time. When changes are made, we will revise the "Effective Date" at the top of this page. Your continued use of the platform indicates acceptance of the revised Terms.</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">10. Governing Law</h2>
      <p className="mb-6">These Terms are governed by the laws of India. Any disputes arising out of your use of the service shall be subject to the exclusive jurisdiction of the courts of Bengaluru, India.</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Information</h2>
      <p className="mb-6">For any questions or concerns regarding these Terms and Conditions, please contact us at:</p>
      <p className="mb-6">Email: contact@gitaspeaks.com</p>
    </div>
  );
}
