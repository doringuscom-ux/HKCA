import brookeImg from '../../assets/Home/Slider/brooke-willson-0ZBVhFJNneY-unsplash.jpg'
import { ScrollReveal, WordReveal, HoverScale } from '../common/Animations'

const CTA = () => {
  return (
    <section className="relative w-full py-24 sm:py-32 overflow-hidden">
      {/* Background with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: `url(${brookeImg})` }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <WordReveal 
          text="GET INVOLVED TODAY"
          className="text-white font-heading text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight flex justify-center w-full"
        />
        
        <ScrollReveal delay={0.3} variant="fadeIn">
          <p className="text-white/90 text-sm sm:text-base md:text-lg mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Take the plunge into the exciting world of water sports with HKCA.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.5} variant="scaleUp">
          <HoverScale>
            <button className="bg-[#0084ff] text-white px-10 py-4 font-bold rounded-sm uppercase tracking-wider text-sm hover:bg-blue-600 transition-all duration-300 shadow-xl shadow-[#0084ff]/20">
                Join Association
            </button>
          </HoverScale>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default CTA
