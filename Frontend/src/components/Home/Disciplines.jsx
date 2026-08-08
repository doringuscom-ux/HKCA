import React from 'react';
import { Link } from 'react-router-dom';
import img1 from '../../assets/Home/Highlights/1.png';
import img2 from '../../assets/Home/Highlights/2.png';
import img3 from '../../assets/Home/Highlights/3.png';
import img4 from '../../assets/Home/Highlights/4.png';
import img5 from '../../assets/Home/Highlights/5.png';
import img6 from '../../assets/Home/Highlights/6.png';
import img7 from '../../assets/Home/Highlights/7.png';

const Disciplines = () => {
  const disciplines = [
    { name: "CANOE SPRINT", desc: "Speed. Power. Precision.", img: "https://res.cloudinary.com/dyfkf3vic/image/upload/v1775892115/hkca/assets/n4boksb44ammoowfzgg7.jpg", link: "/disciplines/canoe-sprint" },
    { name: "CANOE SLALOM", desc: "Technical. Turbulent. Thrilling.", img: img2, link: "/disciplines/canoe-slalom-kayak-cross" },
    { name: "PARACANOE", desc: "Inclusive. Resilient. Elite.", img: img3, link: "/disciplines/paracanoe" },
    { name: "DRAGON BOAT", desc: "Teamwork. Heritage. Pulse.", img: "https://res.cloudinary.com/dyfkf3vic/image/upload/v1775892113/hkca/assets/qj9hdj57esdmhyxetxlf.jpg", link: "/disciplines/dragon-boat" },
    { name: "CANOE MARATHON", desc: "Endurance. Strategy. Stamina.", img: img5, link: "/disciplines/canoe-marathon" },
    { name: "CANOE POLO", desc: "Dynamic. Contact. Competitive.", img: "https://res.cloudinary.com/dyfkf3vic/image/upload/v1775892114/hkca/assets/paabqefyn1kvfevowvd7.jpg", link: "/disciplines/canoe-polo" },
    { name: "STAND UP PADDLING", desc: "Balance. Core. Nature.", img: img7, link: "/disciplines/stand-up-paddling" },
    { name: "WILDWATER", desc: "Untamed. Rapid. Fearless.", img: img2, link: "/disciplines/wildwater-canoeing" }
  ];

  // Repeat the images set a few times to ensure a seamless infinite scroll
  const scrollCards = [...disciplines, ...disciplines, ...disciplines];

  return (
    <section className="bg-[#0b1118] py-16 sm:py-24 overflow-hidden relative border-y border-white/5">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
        <h2 className="text-white text-xs md:text-sm font-black uppercase tracking-[0.5em] text-center mb-3">
          Disciplines
        </h2>
        <div className="h-0.5 w-16 bg-blue-600 mx-auto" />
      </div>

      <div className="relative flex overflow-x-hidden group pb-4">
        <div className="flex animate-marquee whitespace-nowrap items-stretch gap-6 pl-6">
          {scrollCards.map((card, index) => (
            <Link 
              to={card.link}
              key={index} 
              className="bg-white rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(37,99,235,0.2)] min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] flex flex-col cursor-pointer border border-white/10 block hover:no-underline"
            >
              {/* Image Section */}
              <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
                <img 
                  src={card.img} 
                  alt={card.name} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
              
              {/* Text Section */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center bg-white text-center">
                <h3 className="font-black text-xl sm:text-[22px] text-slate-900 tracking-tighter mb-2">{card.name}</h3>
                <p className="font-bold text-slate-500 italic text-[13px] sm:text-[14px]">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Gradient overlays for smooth fading at the edges */}
        <div className="absolute top-0 left-0 w-20 sm:w-40 h-full bg-gradient-to-r from-[#0b1118] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-20 sm:w-40 h-full bg-gradient-to-l from-[#0b1118] to-transparent z-10 pointer-events-none" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
};

export default Disciplines;
