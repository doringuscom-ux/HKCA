import image1 from '../../assets/Home/WhyChooseUs/1.png'
import image2 from '../../assets/Home/WhyChooseUs/2.png'
import { ScrollReveal, WordReveal } from '../common/Animations'

const WhyChooseUs = () => {
  const features = [
    "Professional Coaching from Experts",
    "Competitive Opportunities at National Level",
    "Comprehensive Athlete Development Programs",
    "State Championships & District Competitions",
    "Talent Identification Programs",
    "Water Sports Awareness Programs",
    "Collaboration with Government & Sports Authorities",
  ];

  return (
    <section className="bg-[#131b23] py-16 sm:py-20 px-6 sm:px-10 font-sans overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 sm:gap-24">
        
        {/* Div 1: Image Composition (Now on the Left) */}
        <ScrollReveal variant="slideInLeft" className="w-full lg:w-1/2 flex items-start justify-center lg:justify-start gap-3 sm:gap-4 lg:order-1 order-2 mt-20 lg:mt-0">
          {/* Horizontal/Staggered Lower Image */}
          <div className="mt-8 sm:mt-10 md:mt-14">
            <img 
              src={image1} 
              alt="Experience" 
              className="w-[280px] sm:w-[350px] md:w-[420px] h-[40vh] min-h-[250px] object-cover rounded-sm shadow-2xl transition-all duration-700 hover:scale-[1.03] hover:z-20 relative"
            />
          </div>

          {/* Vertical/Higher Image */}
          <div className="relative">
            <img 
              src={image2} 
              alt="Expert Coaching" 
              className="w-[280px] sm:w-[350px] md:w-[420px] h-[55vh] min-h-[350px] object-cover rounded-sm shadow-2xl transition-all duration-700 hover:scale-[1.02] hover:z-20 relative"
            />
          </div>
        </ScrollReveal>

        {/* Div 2: Text Content (Now on the Right) */}
        <ScrollReveal variant="slideInRight" className="w-full lg:w-1/2 flex flex-col text-left lg:order-2 order-1">
          <span className="text-[#0084ff] uppercase tracking-[0.2em] text-[13px] font-bold mb-4">
            Why Choose Us
          </span>
          
          <WordReveal 
            text="UNMATCHED EXPERTISE AND SUPPORT"
            className="text-white font-heading text-2xl sm:text-3xl md:text-[38px] font-bold leading-[1.1] mb-8 tracking-tight max-w-lg"
          />
          
          <div className="space-y-6 text-gray-300 text-sm sm:text-base leading-relaxed font-normal max-w-md mb-8">
            <ScrollReveal variant="fadeIn" delay={0.3}>
              <p>
                Benefit from our dedicated coaching and premium training programs 
                designed for every aspiring athlete.
              </p>
            </ScrollReveal>
          </div>

          <ul className="space-y-4">
            {features.map((feature, index) => (
              <ScrollReveal 
                key={index} 
                delay={0.5 + (index * 0.1)} 
                variant="fadeUp"
                className="flex items-center gap-3 group"
              >
                <div className="shrink-0 w-5 h-5 rounded-full border border-[#0084ff] flex items-center justify-center group-hover:bg-[#0084ff] transition-colors duration-300">
                  <svg 
                    className="w-3 h-3 text-[#0084ff] group-hover:text-white transition-colors duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth="3"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-300 text-[15px] font-medium tracking-wide group-hover:text-[#0084ff] transition-colors duration-300">
                   {feature}
                </span>
              </ScrollReveal>
            ))}
          </ul>
        </ScrollReveal>

      </div>
    </section>
  )
}

export default WhyChooseUs
