import React from 'react'
import { ScrollReveal, WordReveal, HoverScale } from '../common/Animations'
// Using the actual path confirmed by USER
import presidentImg from '../../assets/Home/President/image.png'
import { RiDoubleQuotesL } from 'react-icons/ri'

const PresidentMessage = () => {
  return (
    <section className="bg-slate-50/40 py-10 sm:py-14 px-6 sm:px-10 overflow-hidden font-sans border-b border-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
        
        {/* Profile Image Column */}
        <ScrollReveal variant="slideInLeft" className="w-full lg:w-auto flex flex-col items-center lg:items-start text-center lg:text-left relative shrink-0">
          <div className="relative group">
            {/* Decorative Frames */}
            <div className="absolute -inset-4 border border-blue-100 rounded-3xl -z-10 group-hover:border-blue-200 transition-colors duration-500" />
            <div className="absolute top-8 -left-8 w-20 h-20 bg-blue-50/50 rounded-full -z-20 blur-2xl" />
            
            <div className="overflow-hidden rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] border-4 border-white aspect-4/5 w-[220px] sm:w-[280px] md:w-[300px] bg-slate-50 relative">
              <img 
                src={presidentImg} 
                alt="Capt. Jaswinder Meenu Beniwal" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            {/* Badge */}
            <div className="absolute -bottom-3 -right-3 bg-[#0084ff] text-white p-4 rounded-xl shadow-2xl z-10 hidden sm:block">
              <RiDoubleQuotesL size={24} className="opacity-50" />
            </div>
          </div>
        </ScrollReveal>

        {/* Message Content Column */}
        <div className="flex-1 w-full bg-white/60 backdrop-blur-md p-6 sm:p-10 rounded-[2.5rem] border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group/card transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,132,255,0.08)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -z-10 group-hover/card:bg-blue-100/50 transition-colors duration-700" />
          
          <ScrollReveal variant="fadeIn" delay={0.2}>
            <span className="text-[#0084ff] uppercase tracking-[0.3em] text-[11px] font-bold mb-3 block">
              Leadership Voice
            </span>
          </ScrollReveal>
          
          <WordReveal 
            text="MESSAGE FROM THE PRESIDENT"
            className="text-[#1a2128] font-heading text-2xl sm:text-3xl md:text-3xl font-bold leading-[1.1] mb-5 tracking-tight"
          />

          <div className="space-y-4 text-slate-600 text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed font-light italic text-left">
            <ScrollReveal variant="fadeUp" delay={0.4}>
              <div className="relative">
                <RiDoubleQuotesL size={40} className="text-blue-50 absolute -left-6 -top-4 -z-10" />
                <p>
                  I extend my heartfelt greetings to all athletes of Haryana. Our mission is to promote 
                  kayaking and canoeing across the state and reach every aspiring sportsperson at the 
                  grassroots level.
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal variant="fadeUp" delay={0.5}>
              <p>
                I encourage all young athletes to come forward and take up water sports with dedication 
                and confidence. We are committed to providing the necessary opportunities, training, 
                and support to help you excel and represent Haryana with pride.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.6}>
              <p className="font-semibold text-[#1a2128] not-italic border-l-4 border-blue-500 pl-6 py-2 bg-blue-50/40 rounded-r-xl">
                Let us work together to make Haryana a leading state in kayaking and canoeing.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal variant="fadeIn" delay={0.8} className="mt-8 pt-6 border-t border-gray-100/60 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left w-full">
              <h4 className="text-[#1a2128] font-heading text-2xl sm:text-3xl font-bold mb-1">
                Capt. Jaswinder Meenu Beniwal
              </h4>
              <div className="flex flex-col gap-1">
                <p className="text-[#0084ff] text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em]">
                    President, HKCA
                </p>
                <p className="text-slate-400 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em]">
                    & Haryana Olympic Association
                </p>
              </div>
            </div>
            
            {/* Signature Area */}
            <div className="hidden md:block opacity-70 group-hover/card:opacity-100 transition-opacity duration-700">
               <span className="font-serif italic text-3xl text-[#0084ff] select-none">Jaswinder Beniwal</span>
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  )
}

export default PresidentMessage
