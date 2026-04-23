import React from 'react';
import PageHero from '../components/layout/PageHero';

const RefundPolicyPage = () => {
  return (
    <div className="font-sans bg-[#0f172a] min-h-screen text-gray-300 pb-20">
      <PageHero 
        subtitle="Legal"
        title="Refund & Cancellation Policy"
        description="Information regarding event registration cancellations, failed transactions, and our refund process."
        height="h-[250px]"
      />
      
      <div className="max-w-4xl mx-auto px-6 mt-12 bg-[#1e293b]/50 p-8 rounded-2xl border border-white/5 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">1. General Refund Rules</h2>
        <p className="mb-6 leading-relaxed">
          Under normal circumstances, fees paid for memberships, event registrations, or training camps are strictly <strong>non-refundable</strong> and non-transferable. Once a payment is successful, the registration is considered final.
        </p>

        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">2. Event Cancellation by HKCA</h2>
        <p className="mb-6 leading-relaxed">
          In the rare event that Haryana Kayaking and Canoeing Association (HKCA) is forced to cancel an event, tournament, or training camp, the refund amount 75 % will be determined by the HKCA executive committee based on the specific circumstances and any non-recoverable administrative costs already incurred. The final decided refund will be initiated to the original payment source within 7-10 working days.
        </p>

        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">3. Failed Transactions</h2>
        <p className="mb-6 leading-relaxed">
          If a transaction fails but the amount is debited from your bank account or credit card, the amount is typically held securely in the banking network. It will be automatically refunded to your original payment method by the payment gateway. This process usually completes within 5-7 working days depending on your bank's policies.
        </p>

        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">4. Dispute Resolution</h2>
        <p className="mb-6 leading-relaxed">
          If you believe there was an error in billing or if you haven't received a registration slip despite successful payment deduction, please reach out to our support team immediately from the Contact Us page. Please include your Transaction ID, Registered Email, and the Date of the transaction.
        </p>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
