import React from 'react'
import PageHero from '../components/layout/PageHero'
import WhoWeAre from '../components/About/WhoWeAre'
import AboutDetails from '../components/About/AboutDetails';

const AboutPage = () => {
  return (
    <div className="font-sans">
      <PageHero 
        subtitle="About Us"
        title="DISCOVER HKCA"
        description="Haryana Kayaking and Canoeing Association is dedicated to promoting water sports excellence, fostering community engagement, and developing athletes across the region through certified training and competitive opportunities."
        height="h-[250px]"
      />
      <WhoWeAre />
      <AboutDetails />

      {/* Floating Scroll Top Button Placeholder */}
      <div className="fixed bottom-10 right-10 z-50">
        <button className="bg-[#0084ff] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95">
          ↑
        </button>
      </div>
    </div>
  )
}

export default AboutPage
