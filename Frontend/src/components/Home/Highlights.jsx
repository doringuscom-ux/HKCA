import React from 'react'
import { ScrollReveal, WordReveal } from '../common/Animations'

// Placeholder images - user will store actual images in src/assets/Highlights/
import img1 from '../../assets/Home/Highlights/1.png'
import img2 from '../../assets/Home/Highlights/2.png'
import img3 from '../../assets/Home/Highlights/3.png'
import img4 from '../../assets/Home/Highlights/4.png'
import img5 from '../../assets/Home/Highlights/5.png'
import img6 from '../../assets/Home/Highlights/6.png'
import img7 from '../../assets/Home/Highlights/7.png'

const Highlights = () => {
  return (
    <section className="bg-[#131b23] py-24 px-6 sm:px-10 font-sans border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 flex flex-col items-center">
          <ScrollReveal variant="fadeIn" delay={0.1}>
            <span className="text-[#0084ff] uppercase tracking-[0.2em] text-[13px] font-bold mb-4 block">
              Experience the Action
            </span>
          </ScrollReveal>
          <ScrollReveal variant="fadeUp" delay={0.2}>
            <h2 className="text-white font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4 tracking-tight uppercase text-center">
              ACTIVITY'S &nbsp; & &nbsp; HIGHLIGHTS
            </h2>
          </ScrollReveal>

          {/* Activity Badge Pills */}
          <ScrollReveal delay={0.6} variant="fadeIn">
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "State Championships & District Competitions",
                "Coaching Camps & Training Programs",
                "Talent Identification Programs",
                "Participation in National Championships",
                "Water Sports Awareness Programs",
                "Collaboration with Government & Sports Authorities",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 hover:border-[#0084ff]/40 hover:bg-[#0084ff]/10 transition-all duration-300">
                  <span className="w-5 h-5 rounded-full bg-[#0084ff] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-gray-300 text-sm font-medium whitespace-nowrap">{item}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Dynamic Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Column 1 */}
          <ScrollReveal variant="fadeUp" delay={0.2} className="space-y-6">
            <div className="overflow-hidden rounded-sm group shadow-xl">
              <img 
                src={img1} 
                alt="Action 1" 
                className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="overflow-hidden rounded-sm group shadow-xl">
              <img 
                src={img5} 
                alt="Action 5" 
                className="w-full h-[350px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </ScrollReveal>

          {/* Column 2 */}
          <ScrollReveal variant="fadeUp" delay={0.4} className="space-y-6">
            <div className="overflow-hidden rounded-sm group shadow-xl">
              <img 
                src={img3} 
                alt="Action 3" 
                className="w-full h-[280px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="overflow-hidden rounded-sm group shadow-xl">
              <img 
                src={img4} 
                alt="Action 4" 
                className="w-full h-[280px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="overflow-hidden rounded-sm group shadow-xl">
              <img 
                src={img7} 
                alt="Action 7" 
                className="w-full h-[240px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </ScrollReveal>

          {/* Column 3 */}
          <ScrollReveal variant="fadeUp" delay={0.6} className="space-y-6">
            <div className="overflow-hidden rounded-sm group shadow-xl">
              <img 
                src={img2} 
                alt="Action 2" 
                className="w-full h-[550px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="overflow-hidden rounded-sm group shadow-xl">
              <img 
                src={img6} 
                alt="Action 6" 
                className="w-full h-[270px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </ScrollReveal>

        </div>



      </div>
    </section>
  )
}

export default Highlights
