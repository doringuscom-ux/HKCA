import React from 'react'
import bgHero from '../../assets/About/sara-rostenne-7qtU9twnesI-unsplash.jpg'

const PageHero = ({ subtitle, title, description, height = "h-[300px] lg:h-[350px]" }) => {
  return (
    <section className={`relative ${height} min-h-[250px] w-full flex items-center justify-center overflow-hidden`}>
      {/* Background Image with Cinematic Feel */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: `url(${bgHero})` }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#0d1117]/60" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center flex flex-col items-center justify-center">
        {subtitle && (
          <span className="text-blue-400 uppercase tracking-[0.4em] text-[10px] sm:text-[12px] font-black mb-4 sm:mb-6 block animate-pulse drop-shadow-lg">
            {subtitle}
          </span>
        )}
        
        <h1 className="text-white text-[28px] sm:text-[42px] md:text-[52px] lg:text-[60px] font-black leading-[1.1] tracking-tighter uppercase drop-shadow-2xl">
          {title}
        </h1>
        
        {description && (
          <p className="text-white/90 text-[11px] sm:text-[13px] md:text-[14px] max-w-2xl mx-auto leading-relaxed font-medium mt-4 italic drop-shadow-md">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}

export default PageHero
