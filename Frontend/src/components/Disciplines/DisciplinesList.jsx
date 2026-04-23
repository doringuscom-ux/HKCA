import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../api/apiConfig';
import { disciplinesData as rawData } from '../../data/DisciplineData';
import { ScrollReveal } from '../common/Animations';
import { 
  RiLoader4Line, 
  RiTrophyLine,
  RiCompass3Line,
  RiAnchorLine,
  RiSailboatLine,
  RiPulseLine,
  RiGroupLine,
  RiTimerFlashLine,
  RiBoxingLine,
  RiArrowRightUpLine
} from 'react-icons/ri';

// Convert object to array for mapping
const disciplinesData = Object.entries(rawData).map(([slug, data]) => ({
  ...data,
  slug
}));

const iconMap = {
  sprint: <RiTimerFlashLine size={24} />,
  slalom: <RiCompass3Line size={24} />,
  para: <RiPulseLine size={24} />,
  dragon: <RiGroupLine size={24} />,
  marathon: <RiAnchorLine size={24} />,
  polo: <RiBoxingLine size={24} />,
  sup: <RiSailboatLine size={24} />,
  wildwater: <RiTrophyLine size={24} />,
};

const DisciplinesList = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/admin/gallery');
        setGallery(res.data);
      } catch (err) {
        console.error('Failed to fetch gallery for disciplines', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const getDisciplineImage = (discipline) => {
    const match = gallery.find(item => {
      const title = (item.title || '').toLowerCase();
      const category = (item.category || '').toLowerCase();
      return discipline.keywords.some(k => title.includes(k) || category.includes(k));
    });

    return match ? match.imageUrl : discipline.fallbackImg;
  };

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <RiLoader4Line size={40} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <section className="bg-slate-50 py-12 md:py-20 px-6 sm:px-10 overflow-hidden font-sans">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
        {disciplinesData.map((discipline, idx) => (
          <ScrollReveal key={idx} delay={idx * 0.1}>
            <Link 
              to={`/disciplines/${discipline.slug}`}
              className="group relative flex flex-col h-full bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_30px_80px_-20px_rgba(0,132,255,0.15)] transition-all duration-700 hover:-translate-y-3 overflow-hidden"
            >
              {/* Top Section: Hero Image */}
              <div className="relative aspect-[16/10] overflow-hidden shrink-0">
                <img 
                  src={getDisciplineImage(discipline)} 
                  alt={discipline.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-700" />
              </div>

              {/* Bottom Section: Content Area */}
              <div className="p-8 pt-6 flex flex-col flex-1">
                <div className="mb-auto">
                    <div className="flex items-start justify-between mb-3 min-h-[64px]">
                        <h3 className="text-2xl font-black text-[#1a2128] leading-tight uppercase tracking-tighter group-hover:text-blue-600 transition-colors">
                        {discipline.title}
                        </h3>
                        <RiArrowRightUpLine className="text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all mt-1 shrink-0" size={20} />
                    </div>
                  
                    <p className="text-sm font-bold text-gray-500 leading-relaxed italic line-clamp-2 mb-6">
                        {discipline.subtitle}
                    </p>
                </div>

              </div>

              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[4rem] group-hover:bg-blue-500/10 transition-all duration-700" />
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default DisciplinesList;
