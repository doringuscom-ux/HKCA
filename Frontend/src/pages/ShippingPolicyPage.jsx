import React from 'react';
import PageHero from '../components/layout/PageHero';

const ShippingPolicyPage = () => {
  return (
    <div className="font-sans bg-[#0f172a] min-h-screen text-gray-300 pb-20">
      <PageHero 
        subtitle="Legal"
        title="Shipping & Delivery Policy"
        description="Understanding how services and confirmations are delivered after a successful checkout."
        height="h-[250px]"
      />
      
      <div className="max-w-4xl mx-auto px-6 mt-12 bg-[#1e293b]/50 p-8 rounded-2xl border border-white/5 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">1. Digital Nature of Services</h2>
        <p className="mb-6 leading-relaxed">
          The Haryana Kayaking and Canoeing Association (HKCA) platform primarily offers digital services. These include annual memberships, event and championship registrations, and enrollment into training camps. As such, there is generally no physical shipping of goods.
        </p>

        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">2. Digital Delivery and Confirmation</h2>
        <p className="mb-6 leading-relaxed">
          Upon successful payment processing, the delivery of your service is instant. 
        </p>
        <ul className="list-disc pl-6 mb-8 space-y-2">
          <li>For memberships, your account status is updated immediately.</li>
          <li>For event or camp registrations, a confirmation payment receipt and registration slip will be generated instantly in your user dashboard.</li>
          <li>A confirmation email may also be sent to your registered email address with the details of your purchase.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">3. Exceptional Physical Deliveries</h2>
        <p className="mb-6 leading-relaxed">
          In the very rare scenario where physical merchandise (such as jerseys or ID cards) is offered for purchase through the website, specific shipping timelines and costs will be clearly presented during the checkout process. In such cases, domestic shipping generally takes 7-10 business days.
        </p>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;
