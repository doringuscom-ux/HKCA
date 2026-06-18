import imageH from '../../assets/Home/About/image.png'
import imageV from '../../assets/Home/About/image1.png'
import { ScrollReveal, WordReveal } from '../common/Animations'

const About = () => {
  return (
    <section className="bg-[#131b23] py-16 sm:py-20 px-6 sm:px-10 font-sans overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        
        {/* Div 1: Text Content */}
        <ScrollReveal variant="slideInLeft" className="w-full lg:w-1/2 flex flex-col text-left">
          <span className="text-[#0084ff] uppercase tracking-[0.3em] text-[11px] font-black mb-6 border-l-2 border-[#0084ff] pl-4">
            Leading Water Sports Federation
          </span>
          
          <WordReveal 
            text="ABOUT HARYANA KAYAKING AND CANOEING ASSOCIATION"
            className="text-white font-heading text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold leading-[1.1] mb-6 tracking-tight max-w-xl"
          />
          
          <div className="space-y-8 text-gray-400 text-sm sm:text-base leading-relaxed font-medium max-w-lg">
            <ScrollReveal delay={0.2}>
              <p>
                HKCA is dedicated to promoting kayaking and canoeing in Haryana, 
                fostering excellence in athletes, and providing world-class training 
                programs to ensure optimal performance.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <p className="border-l border-white/10 pl-6 italic">
                With a commitment to professionalism and growth, HKCA organizes 
                competitions, offers coaching certification, and supports athlete 
                development to empower our water sports community.
              </p>
            </ScrollReveal>
          </div>
        </ScrollReveal>

        {/* Div 2: Image Composition */}
        <ScrollReveal variant="slideInRight" className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end gap-3 sm:gap-6 mt-16 lg:mt-0 relative">
          {/* Horizontal Image */}
          <div className="relative z-10 translate-y-8 sm:translate-y-12">
            <img 
              src={imageH} 
              alt="Two People Kayaking" 
              className="w-[140px] sm:w-[220px] md:w-[320px] h-[35vh] min-h-[220px] object-cover rounded-xl shadow-2xl transition-all duration-700 hover:scale-[1.05] ring-1 ring-white/10"
            />
          </div>

          {/* Vertical Image */}
          <div className="relative z-0 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
            <img 
              src={imageV} 
              alt="Kayaking Aerial View" 
              className="w-[160px] sm:w-[240px] md:w-[350px] h-[45vh] min-h-[300px] object-cover rounded-xl shadow-2xl transition-all duration-700 hover:scale-[1.03] ring-1 ring-white/10"
            />
            {/* Decorative Element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-600/20 blur-3xl rounded-full -z-10" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default About
