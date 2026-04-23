import React from 'react';
import PageHero from '../components/layout/PageHero';

const PrivacyPolicyPage = () => {
  return (
    <div className="font-sans bg-[#0f172a] min-h-screen text-gray-300 pb-20">
      <PageHero 
        subtitle="Legal"
        title="Privacy Policy"
        description="Learn how the Haryana Kayaking and Canoeing Association collects, uses, and protects your personal information."
        height="h-[250px]"
      />
      
      <div className="max-w-4xl mx-auto px-6 mt-12 bg-[#1e293b]/50 p-8 rounded-2xl border border-white/5 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">1. Data Collection</h2>
        <p className="mb-6 leading-relaxed">
          We collect personal information such as names, email addresses, phone numbers, date of birth, and payment details when you register as a member, enroll in a training camp, or participate in an event organized by HKCA. Payment details are processed securely by our authorized payment gateway partners and are not stored on our servers.
        </p>

        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">2. Use of Information</h2>
        <p className="mb-6 leading-relaxed">
          The information collected is used solely for standard association operations. This includes:
        </p>
        <ul className="list-disc pl-6 mb-8 space-y-2">
          <li>Processing event registrations and memberships.</li>
          <li>Sending updates, newsletters, and critical information regarding upcoming camps and championships.</li>
          <li>Verifying athlete identities and maintaining official state records.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">3. Data Protection and Sharing</h2>
        <p className="mb-6 leading-relaxed">
          We implement a variety of security measures to maintain the safety of your personal information. All sensitive information transmitted online is encrypted via Secure Socket Layer (SSL) technology. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website or conducting our business, so long as those parties agree to keep this information confidential.
        </p>

        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">4. Updates to this Policy</h2>
        <p className="mb-6 leading-relaxed">
          HKCA reserves the right to update or modify this Privacy Policy at any time. Any changes will be updated on this page, and we encourage users to review this page periodically.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
