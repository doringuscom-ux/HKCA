import image1 from '../../assets/Home/Championships & Training Camps/Ravinder.jpeg'
import image2 from '../../assets/Home/Championships & Training Camps/Bijender.jpeg'
import image3 from '../../assets/Home/Championships & Training Camps/Gemini_Generated_Image_tarzjltarzjltarz.png'
import { ScrollReveal } from '../common/Animations'

const Awarde = () => {
  const events = [
      {
      title: "Bijender Singh",
      description: "Canoeing Coach",
      year: "2018-19",
      award: "Bhim Award",
      image: image2
    },
    {
      title: "Ravinder Singh",
      description: "Canoeing Coach",
      year: "2019-20",
      award: "Bhim Award",
      image: image1
    },
  
    {
      title: "Ritu",
      description: "Canoeing Player (Dragon Boat Athlete)",
      year: "2020-21",
      award: "Bhim Award",
      image: image3
    }
  ]

  return (
    <section className="relative bg-[#060f1a] py-10 sm:py-14 px-6 sm:px-10 font-sans overflow-hidden">
      {/* Background decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#0084ff]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <div className="text-center mb-4">
            <h2 className="text-white font-heading text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6">
              Awardees
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Our <span className="text-[#00cce5] font-semibold">Bhim Awardees </span>  - recipients of the Bhim Award, the highest sports honour of Haryana, awarded to sportspersons for outstanding achievements at national and international levels.
            </p>
          </div>
        </ScrollReveal>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {events.map((event, index) => (
            <ScrollReveal
              key={index}
              delay={0.2 + (index * 0.15)}
              variant="fadeUp"
              className="group relative rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-b from-[#0f2035] to-[#091525] hover:border-[#0084ff]/30 transition-all duration-500 hover:translate-y-[-6px] hover:shadow-[0_24px_60px_-12px_rgba(0,132,255,0.2)]"
            >
              {/* Image */}
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover object-[center_50%] transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#091525] via-[#091525]/30 to-transparent" />

                {/* Year badge on image */}
                <div className="absolute top-4 right-4 bg-[#0084ff] text-white text-[10px] font-black px-3 py-1 rounded-full tracking-wider shadow-lg">
                  {event.year}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Award tag */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-[#00cce5] uppercase tracking-widest bg-[#00cce5]/10 border border-[#00cce5]/20 px-3 py-1 rounded-full">
                    🏆 {event.award}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-white font-bold text-lg sm:text-xl tracking-wide mb-1 group-hover:text-[#0084ff] transition-colors duration-300">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {event.description}
                </p>

                {/* Divider line */}
                <div className="mt-5 h-px w-full bg-gradient-to-r from-[#0084ff]/40 via-white/5 to-transparent" />
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Awarde
