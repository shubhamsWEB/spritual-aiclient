import React from 'react';
import Header from '@/components/layout/SecondaryHeader';
import Footer from '@/components/layout/Footer';
export default function PrivacyPolicy() {
  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-[#973B00]">Privacy Policy – GitaSpeaks</h1>
        <p className="text-sm text-muted-foreground mb-8 text-gray-600">Effective Date: 10th April, 2025</p>
        
      <p className="mb-6 text-gray-600">
        GitaSpeaks is committed to protecting your personal information and your right to privacy. 
        This Privacy Policy explains how we collect, use, share, and protect the information you 
        provide when you use our website and services.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#973B00]">Introduction</h2>
      <p className="mb-6 text-gray-600">
        This Privacy Policy applies to all users of GitaSpeaks and governs the collection, use, 
        and safeguarding of information shared on our platform. By using our services, you consent 
        to the practices described herein.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#973B00]">Information We Collect</h2>
      <p className="mb-4 text-gray-600">We may collect and process the following types of data:</p>
      
      <h3 className="text-xl font-medium mt-6 mb-3 text-[#973B00]">a) Personal Information (if provided by you):</h3>
      <ul className="list-disc pl-8 mb-6 space-y-2 text-gray-600">
        <li>Name</li>
        <li>Age</li>
        <li>Gender</li>
        <li>City or location</li>
        <li>Life challenges or concerns shared for spiritual guidance</li>
        <li>Email address (for communication, support, or login)</li>
      </ul>

      <h3 className="text-xl font-medium mt-6 mb-3 text-[#973B00]">b) Usage Data:</h3>
      <ul className="list-disc pl-8 mb-6 space-y-2 text-gray-600">
        <li>Chat messages or queries submitted to the AI system</li>
        <li>Session timestamps and interaction data</li>
        <li>IP address, device information, browser type, and general location</li>
        <li>Referral source and website usage analytics</li>
      </ul>

      <h3 className="text-xl font-medium mt-6 mb-3 text-[#973B00]">c) Payment Information:</h3>
      <ul className="list-disc pl-8 mb-6 space-y-2 text-gray-600">
        <li>We do not store or process any payment card details directly.</li>
        <li>All transactions are securely handled by third-party payment gateways (e.g., Razorpay, Stripe), governed by their own privacy policies.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#973B00]">How We Use Your Information</h2>
      <p className="mb-4 text-gray-600">The information collected may be used for the following purposes:</p>
      <ul className="list-disc pl-8 mb-6 space-y-2 text-gray-600">
        <li>To provide, personalize, and improve the spiritual chat experience</li>
        <li>To deliver relevant responses based on your inputs and preferences</li>
        <li>To manage user sessions, maintain platform performance, and prevent abuse</li>
        <li>To respond to user inquiries and send platform-related notifications</li>
        <li>To analyze engagement and improve the quality of content and features</li>
        <li>To fulfill any legal or regulatory requirements</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#973B00]">Data Protection and Security</h2>
      <ul className="list-disc pl-8 mb-6 space-y-2 text-gray-600">
        <li>We implement industry-standard technical and organizational measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. This includes the use of encrypted databases, secure APIs, and restricted access protocols.</li>
        <li>We do not sell, share, or release your personal data to third parties for advertising or commercial resale.</li>
        <li>However, certain trusted service providers we engage—such as those handling AI processing, authentication, analytics, and hosting—may access or process user data strictly for the purpose of delivering our services. These third parties are bound by confidentiality agreements and may not use your data for any other purpose.</li>
        <li>We regularly review our security infrastructure and apply updates to safeguard user data at all times.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#973B00]">Your Rights and Choices</h2>
      <p className="mb-4 text-gray-600">As a user of GitaSpeaks, you have the right to:</p>
      <ul className="list-disc pl-8 mb-6 space-y-2 text-gray-600">
        <li>Request access to the personal data we hold about you</li>
        <li>Request correction, restriction, or deletion of your data</li>
        <li>Object to certain forms of data processing</li>
        <li>Withdraw consent at any time, where processing is based on your consent</li>
        <li>Delete your account and associated data permanently</li>
      </ul>
      <p className="mb-6 text-gray-600">
        To exercise any of these rights, please contact us at: contact@gitaspeaks.com
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#973B00]">Third-Party Services</h2>
      <p className="mb-4 text-gray-600">GitaSpeaks may utilize third-party service providers for the following:</p>
      <ul className="list-disc pl-8 mb-6 space-y-2 text-gray-600">
        <li>Authentication (e.g., Google Login, Supabase Auth)</li>
        <li>AI response generation (e.g., OpenAI API)</li>
        <li>Cloud infrastructure and hosting (e.g., Vercel, Supabase)</li>
        <li>Payment processing (e.g., Stripe, Razorpay)</li>
      </ul>
      <p className="mb-6 text-gray-600">
        These service providers operate under their own privacy policies and may process user data as required to deliver their specific services. 
        We ensure that all such providers are reputable and adhere to applicable data protection regulations.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#973B00]">Data Retention and Transfers</h2>
      <ul className="list-disc pl-8 mb-6 space-y-2 text-gray-600">
        <li>We retain user data only as long as necessary to fulfil the purposes outlined in this Privacy Policy or to comply with applicable legal obligations.</li>
        <li>Please note that data may be stored on servers located outside your country of residence. By using our services, you consent to such international data transfers, where applicable.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#973B00]">Children's Privacy</h2>
      <p className="mb-6 text-gray-600">
        GitaSpeaks is not intended for users under the age of 13. We do not knowingly collect personal data from children. 
        If we become aware that a child under 13 has provided us with personal information, we will delete such information immediately.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#973B00]">Updates to This Privacy Policy</h2>
      <p className="mb-6 text-gray-600 text-gray-600">
        We reserve the right to update or modify this Privacy Policy at any time. When changes are made, 
        we will revise the "Effective Date" at the top of this page. We encourage users to review this page 
        periodically to stay informed about how we protect their data.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#973B00]">Contact Us</h2>
      <p className="mb-6 text-gray-600">
        If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, you may contact us at:
      </p>
      <p className="mb-6 text-[#973B00]">
        Email: <a href="mailto:contact@gitaspeaks.com" className="text-gray-600 hover:underline">contact@gitaspeaks.com</a>
      </p>
    </div>
      <Footer />
    </div>
  );
}
