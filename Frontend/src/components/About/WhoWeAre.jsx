import React from 'react'
import imgWho1 from '../../assets/Home/Highlights/4.png'
import imgWho2 from '../../assets/Home/About/image.png'

const WhoWeAre = () => {
  return (
    <section className="bg-[#0b1118] py-16 sm:py-20 px-6 sm:px-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          
          {/* Left Col - Massive Title & Content */}
          <div className="w-full lg:w-1/2">
            <div className="mb-10">
              <span className="inline-flex items-center gap-3 text-blue-500 font-sans tracking-[0.3em] text-xs font-bold mb-6 uppercase bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Introducing HKCA
              </span>
              
              <h2 className="text-white font-heading text-4xl sm:text-5xl lg:text-[3.2rem] xl:text-[3.8rem] font-black leading-[1] tracking-tighter uppercase">
                <span className="text-blue-500 font-sans tracking-[0.3em] text-xs sm:text-sm mb-3 block font-bold drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">About</span>
                <span className="hover:text-blue-400 transition-colors duration-500 whitespace-nowrap">Haryana Kayaking</span> <br className="hidden sm:block" />
                <span className="text-gray-600 font-light italic mr-3">&</span> 
                <span className="hover:text-blue-400 transition-colors duration-500">Canoeing</span>{' '}
                <br className="hidden lg:block" />
                <span className="text-blue-400/80 text-3xl sm:text-4xl lg:text-[3rem] tracking-normal block mt-1">Association</span>
              </h2>
            </div>

            <div className="flex flex-col space-y-5 text-gray-400 text-[14px] sm:text-[15px] leading-[1.7] font-light">
              <p className="text-gray-300 font-medium text-[16px] border-l-4 border-blue-500 pl-5">
                The Haryana Kayaking and Canoeing Association (HKCA) is the official state body dedicated to the promotion and development of kayaking, canoeing, and allied water sports in Haryana. The Association works to identify talent, provide training, and create opportunities for athletes to compete at national and international levels.
              </p>
              <p className="pl-5">
               Kayaking and canoeing are Olympic sports governed globally by the International Canoe Federation and in India by the Indian Kayaking and Canoeing Association.
              </p>
              <p className="pl-5">
               With a commitment to professionalism and growth, HKCA organizes competitions, offers coaching certification, and supports athlete development to empower our water sports community.
              </p>
              
              <div className="pt-6 pl-5">
                <button className="group relative inline-flex items-center justify-center gap-4 bg-white text-[#0b1118] px-8 py-4 rounded-full font-black text-[11px] uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                  <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" />
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">Read Our Story</span>
                  <div className="relative z-10 w-7 h-7 rounded-full bg-[#0b1118] text-white flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-colors duration-300">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Col - Overlapping Image Collage */}
          <div className="w-full lg:w-1/2 h-[400px] sm:h-[480px] relative mt-10 lg:mt-0 lg:ml-10">
            {/* Image 1 */}
            <div className="absolute top-0 right-0 w-[75%] h-[65%] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-8 border-[#0b1118] z-10 bg-slate-800 group">
              <div className="absolute inset-0 bg-blue-500/10 mix-blend-color z-10 group-hover:opacity-0 transition-opacity duration-700" />
              <img 
                src={imgWho1} 
                alt="HKCA Activity 1" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]" 
              />
            </div>
            
            {/* Image 2 */}
            <div className="absolute bottom-0 left-0 w-[70%] h-[60%] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border-8 border-[#0b1118] z-20 bg-slate-800 group">
              <div className="absolute inset-0 bg-blue-500/10 mix-blend-color z-10 group-hover:opacity-0 transition-opacity duration-700" />
              <img 
                src={imgWho2} 
                alt="HKCA Activity 2" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]" 
              />
            </div>

            {/* Accent Badge */}
            <div className="absolute top-[45%] left-1/2 -translate-x-1/4 -translate-y-1/2 w-32 h-32 sm:w-36 sm:h-36 bg-blue-600 rounded-full flex items-center justify-center flex-col text-white z-30 shadow-[0_0_40px_rgba(37,99,235,0.4)] border-8 border-[#0b1118] hover:scale-110 transition-transform duration-500 cursor-default">
               <span className="text-3xl sm:text-4xl font-black tracking-tighter">1985</span>
               <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-bold mt-1 text-blue-200">Est. Year</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default WhoWeAre
