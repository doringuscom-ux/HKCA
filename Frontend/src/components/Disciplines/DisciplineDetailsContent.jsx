import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { disciplinesData } from '../../data/DisciplineData';
import api from '../../api/apiConfig';
import { ScrollReveal, WordReveal } from '../common/Animations';
import { 
  RiInformationLine, 
  RiListCheck2, 
  RiPencilRuler2Line, 
  RiRunLine, 
  RiImageLine,
  RiLoader4Line
} from 'react-icons/ri';

const DisciplineDetailsContent = ({ slug, displayTitle }) => {
  const data = disciplinesData[slug];
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/admin/gallery');
        setGallery(res.data);
      } catch (err) {
        console.error('Failed to fetch gallery for sub-page', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
    // Scroll to top when slug changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!data) {
    return (
      <section className="bg-[#131b23] py-24 px-6 text-center text-gray-300">
        <div className="max-w-4xl mx-auto italic">
          Content for {displayTitle} is currently being curated by HKCA...
        </div>
      </section>
    );
  }

  const matchedImages = gallery.filter(item => {
    const title = (item.title || '').toLowerCase();
    const category = (item.category || '').toLowerCase();
    return data.keywords.some(k => title.includes(k) || category.includes(k));
  }).slice(0, 4);

  return (
    <div className="bg-[#131b23] text-gray-200 font-sans overflow-hidden">
      
      {/* 1. Overview Section */}
      <section className="py-16 md:py-24 px-6 sm:px-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center border-b border-white/5">
        <ScrollReveal variant="slideInLeft">
           <div className="space-y-8">
              <div className="flex items-center gap-3">
                <span className="w-12 h-[2px] bg-blue-600"></span>
                <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-[11px]">{data.subtitle}</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight uppercase tracking-tight">
                An Elite <br /> <span className="text-blue-500">Overview.</span>
              </h2>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed font-bold border-l-4 border-blue-600/20 pl-6">
                {data.overview}
              </p>
           </div>
        </ScrollReveal>
        
        <ScrollReveal variant="slideInRight" className="relative group">
           <div className="aspect-video bg-slate-800 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-10">
              <img 
                src={data.fallbackImg || matchedImages[0]?.imageUrl || "https://images.unsplash.com/photo-1544641045-8869c970423c?q=80&w=1000&auto=format&fit=crop"} 
                alt={data.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-transparent transition-colors duration-500" />
           </div>
           {/* Decorative Elements */}
           <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl z-0" />
           <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl z-0" />
        </ScrollReveal>
      </section>


      {/* 3. Equipment Showroom - Dark Minimalist Cards */}
      <section className="py-12 md:py-16 bg-[#0f161c] relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-full h-full opacity-30">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -translate-x-1/2" />
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] translate-x-1/2" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 font-sans">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h3 className="text-blue-500 uppercase tracking-[0.4em] font-black text-[10px] mb-4">Technical Arsenal</h3>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight uppercase tracking-tight mb-6">THE EQUIPMENT</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.equipment.map((item, idx) => (
              <ScrollReveal key={idx} variant="scaleUp" delay={idx * 0.1}>
                <div className="h-full p-8 bg-white/[0.02] backdrop-blur-3xl border border-white/[0.05] rounded-[2rem] hover:border-blue-500/30 transition-all duration-700 hover:-translate-y-2 group shadow-2xl">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-center mb-6 shadow-lg group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-500 transform group-hover:rotate-12">
                      <RiPencilRuler2Line size={24} />
                   </div>
                   <h4 className="text-lg font-black text-white mb-3 uppercase tracking-tight group-hover:text-blue-400 transition-colors">{item.name}</h4>
                   <p className="text-gray-400 text-[12px] leading-relaxed font-bold opacity-80 group-hover:opacity-100 transition-opacity italic">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DisciplineDetailsContent;
