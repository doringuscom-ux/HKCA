import React from 'react'
import ctaBg from '../../assets/About/1.png'

const AboutCTA = () => {
  return (
    <section className="relative w-full py-32 sm:py-48 overflow-hidden text-center">
      {/* Background with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: `url(${ctaBg})` }}
      />
      <div className="absolute inset-0 bg-black/65" />

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <h2 className="text-white font-heading text-4xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-2xl uppercase">
          JOIN OUR COMMUNITY
        </h2>
        
        <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light italic tracking-wide">
          Be part of Haryana's water sports revolution today!
        </p>

        <div className="mt-12">
          <button className="bg-[#0084ff] text-white px-12 py-4 rounded-sm font-bold uppercase tracking-[0.2em] text-[13px] hover:bg-blue-600 transition-all duration-300 shadow-2xl shadow-blue-500/20 active:scale-95 group">
            Get Started
            <span className="inline-block ml-3 group-hover:translate-x-2 transition-transform">→</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default AboutCTA
