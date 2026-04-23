import React from 'react';
import PageHero from '../components/layout/PageHero';

const TermsConditionsPage = () => {
  return (
    <div className="font-sans bg-[#0f172a] min-h-screen text-gray-300 pb-20">
      <PageHero 
        subtitle="Legal"
        title="Terms & Conditions"
        description="Please read these terms and conditions carefully before using our platform or registering for any events."
        height="h-[250px]"
      />
      
      <div className="max-w-4xl mx-auto px-6 mt-12 bg-[#1e293b]/50 p-8 rounded-2xl border border-white/5 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">1. Acceptance of Terms</h2>
        <p className="mb-8 leading-relaxed">
          By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. Furthermore, when registering for any Haryana Kayaking and Canoeing Association (HKCA) event or membership, you shall be subject to any posted guidelines or rules applicable to such services.
        </p>

        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">2. Account Registration and Integrity</h2>
        <p className="mb-8 leading-relaxed">
          Users must provide accurate, complete, and current information when creating an account. The submission of fraudulent documents, fake age certificates, or incorrect identity proof will lead to immediate disqualification from events and permanent suspension of the user profile from the HKCA registry. You are fully responsible for all activities that occur under your password or account.
        </p>

        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">3. Code of Conduct</h2>
        <p className="mb-6 leading-relaxed">
          All members and athletes are expected to maintain the highest standards of sportsmanship. Unsportsmanlike conduct, harassment, or violation of safety rules during any HKCA-organized training camp or championship may result in disciplinary action, including expulsion without a refund.
        </p>

        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">4. Event Modifications and Cancellations</h2>
        <p className="mb-6 leading-relaxed">
          HKCA reserves the right to postpone, modify, or cancel events, championships, or training camps due to bad weather, insufficient participation, safety concerns, or other unforeseen circumstances. In such events, standard refund policies will apply according to the terms specified in our Refund & Cancellation Policy.
        </p>
      </div>
    </div>
  );
};

export default TermsConditionsPage;
