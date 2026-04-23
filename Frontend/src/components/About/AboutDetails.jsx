import React from 'react';
import { ScrollReveal } from '../common/Animations';
import { 
  RiWaterFlashLine, 
  RiMedalLine, 
  RiShieldUserLine, 
  RiMapPinLine, 
  RiTrophyLine,
  RiStarLine
} from 'react-icons/ri';

import kayakImg from '../../assets/Home/Highlights/7.png';

const AboutDetails = () => {
  return (
    <section className="bg-slate-50 py-16 sm:py-24 px-6 sm:px-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* About Kayaking & Canoeing - PREMIUM REDESIGN */}
        {/* About Kayaking & Canoeing - COMPACT REDESIGN */}
        <ScrollReveal variant="fadeUp">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            
            {/* Text & Cards Side */}
            <div className="flex flex-col justify-between h-full space-y-10">
              <div className="pt-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-100 bg-blue-50 text-blue-600 font-black uppercase tracking-[0.2em] text-[12px] sm:text-[13px] mb-6 shadow-sm">
                  <RiWaterFlashLine /> Discover The Sport
                </span>
                <h2 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black text-slate-900 leading-[1.05] uppercase tracking-tighter">
                  Kayaking <br className="hidden lg:block" /> & Canoeing
                </h2>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow">
                   <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100/50">
                     <RiWaterFlashLine size={24} />
                   </div>
                   <div>
                     <h3 className="text-slate-900 font-black text-lg mb-2 uppercase tracking-tight">What is Kayaking?</h3>
                     <p className="text-slate-500 text-[14px] leading-relaxed">A high-adrenaline water sport where an athlete uses a double-bladed paddle while sitting in a streamlined kayak to move forward on water.</p>
                   </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow">
                   <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100/50">
                     <RiWaterFlashLine size={24} className="rotate-180" />
                   </div>
                   <div>
                     <h3 className="text-slate-900 font-black text-lg mb-2 uppercase tracking-tight">What is Canoeing?</h3>
                     <p className="text-slate-500 text-[14px] leading-relaxed">A dynamic discipline involving paddling a canoe using a single-bladed paddle, either kneeling or sitting to maneuver courses.</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Image & Olympic Side */}
            <div className="flex flex-col h-full gap-6">
              
              <div className="relative flex-1 min-h-[250px] rounded-[2rem] p-2 bg-white shadow-[0_15px_60px_-15px_rgba(0,132,255,0.15)] group hover:shadow-[0_20px_60px_-15px_rgba(0,132,255,0.3)] transition-all duration-500">
                <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
                  {/* Subtle color enhancement overlay */}
                  <div className="absolute inset-0 bg-blue-600/10 mix-blend-color z-10 opacity-60 group-hover:opacity-0 transition-opacity duration-700" />
                  
                  <img 
                    src={kayakImg} 
                    alt="Kayaking" 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]" 
                  />
                  
                  {/* Floating Action / Text on Hover */}
                  <div className="absolute bottom-5 right-5 bg-white/90 backdrop-blur px-5 py-2.5 rounded-xl shadow-xl border border-white flex items-center gap-2.5 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest mt-0.5">Water Sports</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0f172a] p-6 sm:p-8 rounded-[2.5rem] text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shrink-0">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-yellow-400 shrink-0">
                    <RiTrophyLine size={26} />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-xl uppercase tracking-tighter mb-1">Olympic Recognition</h3>
                    <p className="text-blue-200/80 text-xs font-bold uppercase tracking-widest">Included Since 1936</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 text-[13px] font-medium text-slate-300 bg-white/5 p-4 rounded-2xl shrink-0">
                  <div className="flex items-center gap-2"><RiCheckDoubleLine className="text-blue-400" /> Sprint & Slalom</div>
                  <div className="flex items-center gap-2"><RiCheckDoubleLine className="text-blue-400" /> Paralympics (Paracanoe)</div>
                </div>
              </div>
            </div>

          </div>
        </ScrollReveal>





        {/* Why Join & Affiliation */}
        <ScrollReveal variant="fadeUp">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 bg-slate-900 text-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="relative z-10">
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4">
                  <RiStarLine className="text-blue-400" />
                  Why Join Kayaking & Canoeing?
                </h3>
                <ul className="space-y-4 text-blue-50 text-lg font-light">
                  <li className="flex items-center gap-3"><RiCheckDoubleLine className="text-blue-400 shrink-0" /> Olympic sport with international opportunities</li>
                  <li className="flex items-center gap-3"><RiCheckDoubleLine className="text-blue-400 shrink-0" /> Improves fitness, stamina, and discipline</li>
                  <li className="flex items-center gap-3"><RiCheckDoubleLine className="text-blue-400 shrink-0" /> Adventure + competitive sport</li>
                  <li className="flex items-center gap-3"><RiCheckDoubleLine className="text-blue-400 shrink-0" /> Career opportunities in sports and services</li>
                  <li className="flex items-center gap-3"><RiCheckDoubleLine className="text-blue-400 shrink-0" /> Exposure at national and international level</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-gray-100 p-10 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden group hover:border-blue-200 transition-colors">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-8 flex items-center gap-3">
                  <RiMapPinLine className="text-indigo-500" />
                  Affiliation
                </h3>
                <div className="space-y-6">
                  <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                    <p className="font-bold text-slate-800 text-sm">Indian Kayaking and Canoeing Association</p>
                  </div>
                  <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                    <p className="font-bold text-slate-800 text-sm">Haryana Olympic Association</p>
                  </div>
                  <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                    <p className="font-bold text-slate-800 text-sm">International Canoe Federation</p>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-black">International Governance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

// Simple utility icons if missing from standard import
const RiCheckDoubleLine = ({ className = '', size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 6 7 17 2 12"></polyline>
    <path d="M22 10l-5 5-1.5-1.5"></path>
  </svg>
);

export default AboutDetails;
