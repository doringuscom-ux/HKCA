import { ScrollReveal, WordReveal } from '../common/Animations'
import ikcaLogo from '../../assets/Home/our partner/Untitled design.png'
import hoaLogo from '../../assets/Home/our partner/Untitled design1.png'


const Partners = () => {
  const affiliations = [
    {
      logo: ikcaLogo,
      title: "INDIAN KAYAKING & CANOEING ASSOCIATION",
      designation: "( National Governing Body )",
      location: "India",
      affiliationText: "affiliated with",
      affiliateName: "International Canoe Federation"
    },
    {
      logo: hoaLogo,
      title: "HARYANA OLYMPIC ASSOCIATION",
      designation: "( State Level Body )",
      location: "Haryana",
      affiliationText: "affiliated with",
      affiliateName: "Indian Olympic Association"
    }
  ]

  return (
    <section className="bg-[#131b23] py-20 sm:py-24 px-6 sm:px-10 font-sans relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        <WordReveal 
          text="AFFILIATED WITH"
          className="text-gray-400 text-center font-['Inter'] text-xs font-black tracking-[0.4em] uppercase mb-16"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-6xl">
          {affiliations.map((item, idx) => (
            <ScrollReveal 
              key={idx}
              variant={idx === 0 ? "slideInLeft" : "slideInRight"}
              className="group"
            >
              <div className="h-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 flex flex-col items-center text-center shadow-2xl relative transition-all duration-500 hover:bg-white/[0.07]">
                {/* Logo Area */}
                <div className="p-4 rounded-3xl mb-4 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1 min-h-[110px] flex items-center justify-center w-full">
                  <img 
                    src={item.logo} 
                    alt={`${item.title} Logo`} 
                    className="h-20 md:h-24 w-auto object-contain drop-shadow-2xl"
                  />
                </div>

                {/* Official Title */}
                <h3 className="text-white font-heading font-bold text-xl md:text-2xl tracking-wide mb-2 leading-tight uppercase min-h-[56px] flex items-center">
                  {item.title}
                </h3>

                {/* Designation */}
                <div className="flex flex-col items-center space-y-1 mb-6">
                  <span className="text-blue-500 font-['Inter'] font-bold text-xs md:text-sm tracking-[0.2em] uppercase">
                    {item.designation}
                  </span>
                  <span className="text-white/60 font-['Inter'] font-medium text-xs tracking-widest uppercase">
                    {item.location}
                  </span>
                </div>

                {/* Affiliation Divider */}
                <div className="flex items-center gap-4 w-full mb-6">
                  <div className="h-[1px] flex-1 bg-linear-to-r from-transparent to-white/10" />
                  <span className="text-white/30 font-heading italic text-base md:text-lg lowercase tracking-widest">
                    {item.affiliationText}
                  </span>
                  <div className="h-[1px] flex-1 bg-linear-to-l from-transparent to-white/10" />
                </div>

                {/* Affiliate Title */}
                <div className="inline-block px-6 py-2.5 bg-white/5 border border-white/5 rounded-full w-full">
                  <h4 className="text-white font-heading font-semibold text-base md:text-lg tracking-wide uppercase">
                    {item.affiliateName}
                  </h4>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-6 left-6 w-6 h-6 border-t border-l border-white/10 rounded-tl-lg" />
                <div className="absolute bottom-6 right-6 w-6 h-6 border-b border-r border-white/10 rounded-br-lg" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Partners
