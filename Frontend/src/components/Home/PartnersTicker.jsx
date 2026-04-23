import React from 'react';

const PartnersTicker = () => {
  const images = [
    "https://res.cloudinary.com/dyfkf3vic/image/upload/v1775820144/hkca/assets/lm4yp6i4f2bozp3lnmmw.png",
    "https://res.cloudinary.com/dyfkf3vic/image/upload/v1775820109/hkca/assets/x0jygynir5fbevbzhwjk.jpg",
    "https://res.cloudinary.com/dyfkf3vic/image/upload/v1775820099/hkca/assets/ay60rq81aktrdronefex.png",
    "https://res.cloudinary.com/dyfkf3vic/image/upload/v1775820085/hkca/assets/lkqbl3yyfumi3witzdxa.png"
  ];

  // Repeat the images set a few times to ensure a seamless infinite scroll
  const scrollImages = [...images, ...images, ...images, ...images];

  return (
    <section className="bg-[#131b23] py-16 overflow-hidden relative border-y border-white/5">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[250px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-8">
        <h2 className="text-white text-xs md:text-sm font-black uppercase tracking-[0.5em] text-center mb-2">
          Official Partners
        </h2>
        <div className="h-0.5 w-16 bg-blue-600 mx-auto" />
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee whitespace-nowrap py-3">
          {scrollImages.map((img, index) => (
            <div 
              key={index} 
              className="mx-3 md:mx-4 flex items-center justify-center p-4 md:p-5 bg-white rounded-2xl border border-gray-100 shadow-xl transition-all duration-500 group-hover:[animation-play-state:paused] hover:scale-105 min-w-[120px] md:min-w-[160px]"
            >
              <img 
                src={img} 
                alt={`Partner ${index}`} 
                className="h-10 md:h-12 w-auto object-contain transition-all duration-500"
              />
            </div>
          ))}
        </div>

        {/* Gradient overlays for smooth fading at the edges */}
        <div className="absolute top-0 left-0 w-32 h-full bg-linear-to-r from-[#131b23] to-transparent z-10" />
        <div className="absolute top-0 right-0 w-32 h-full bg-linear-to-l from-[#131b23] to-transparent z-10" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
      `}} />
    </section>
  );
};

export default PartnersTicker;
