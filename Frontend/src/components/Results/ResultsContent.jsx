import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/apiConfig';
import { RiFilePdfLine, RiCalendarLine, RiLoader4Line, RiExternalLinkLine } from 'react-icons/ri';

const ResultsContent = () => {
  const [allResults, setAllResults] = useState([]);
  const [results, setResults] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Result');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get('/admin/publications');
        // Sort by date Descending
        const sorted = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setAllResults(sorted);
      } catch (error) {
        console.error('Failed to fetch results', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  useEffect(() => {
    // Filter by category. Include legacy 'Results' in 'Result' category
    const filtered = allResults.filter(item => {
      if (activeCategory === 'Result') {
        return item.category === 'Result' || item.category === 'Results';
      }
      return item.category === activeCategory;
    });
    setResults(filtered);
  }, [activeCategory, allResults]);

  const handleView = (item) => {
    if (item.fileUrl) {
      const url = `/view-pdf?url=${encodeURIComponent(item.fileUrl)}&title=${encodeURIComponent(item.title)}`;
      navigate(url);
    }
  };

  if (loading) {
    return (
      <section className="bg-[#131b23] py-24 px-6 text-center text-gray-300">
        <RiLoader4Line className="animate-spin text-blue-500 mx-auto" size={40} />
        <p className="mt-4 font-bold text-sm tracking-widest uppercase">Fetching Records...</p>
      </section>
    );
  }

  return (
    <section className="bg-[#131b23] py-12 md:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Category Filter Toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="flex bg-[#1a242f] p-1.5 rounded-2xl border border-gray-800 shadow-2xl">
            {[
              { id: 'Result', label: 'Competition Results', icon: RiFilePdfLine },
              { id: 'News', label: 'Latest News & Updates', icon: RiCalendarLine }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all duration-500 ${
                  activeCategory === cat.id 
                  ? 'bg-[#00cce5] text-[#131b23] shadow-lg shadow-[#00cce5]/20 scale-105' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <cat.icon size={16} />
                {cat.label}
              </button>
            ))}
          </div>
          
          <div className="hidden lg:flex items-center gap-4 py-3 px-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-3xl animate-pulse">
            <div className="w-2 h-2 rounded-full bg-[#00cce5] shadow-[0_0_10px_rgba(0,204,229,0.5)]"></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Live Feed: {results.length} {activeCategory === 'Result' ? 'Results' : 'Updates'} Posted
            </p>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="text-center text-gray-400 italic py-32 bg-[#1a242f]/30 rounded-[3rem] border-2 border-dashed border-gray-800 animate-in fade-in duration-700">
            <RiCalendarLine className="mx-auto mb-6 text-gray-600 opacity-20" size={60} />
            <p className="text-lg font-bold">No {activeCategory.toLowerCase()} published for this category yet.</p>
            <p className="mt-2 text-sm opacity-60 italic">Please check back later for the latest updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {results.map((item) => (
              <div 
                key={item._id} 
                className="group bg-[#1a242f] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl hover:shadow-black/70 transition-all duration-700 hover:-translate-y-2 flex flex-col relative"
              >
                {/* Image Section */}
                <div className="h-56 w-full overflow-hidden relative shrink-0">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1" />
                  <div className="absolute inset-0 bg-linear-to-t from-[#1a242f] via-[#1a242f]/20 to-transparent opacity-80" />
                  
                  {/* Floating Date Badge */}
                  <div className="absolute bottom-4 left-6 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2 shadow-2xl">
                    <RiCalendarLine className="text-[#00cce5]" size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
                    {activeCategory === 'Result' ? <RiFilePdfLine className="text-red-500" size={14} /> : <RiCalendarLine className="text-blue-400" size={14} />}
                    <span className="text-[9px] font-black uppercase tracking-widest text-white">
                      {activeCategory === 'Result' ? 'Official Result' : 'News Update'}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col grow">
                  <h3 className="text-xl font-black text-white mb-3 leading-tight group-hover:text-[#00cce5] transition-colors line-clamp-2 min-h-[56px] uppercase tracking-tight">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-400 text-[13px] leading-relaxed mb-8 line-clamp-3 min-h-[60px] font-medium opacity-70 italic">
                    {item.summary}
                  </p>

                  <div className="mt-auto space-y-3">
                    <button 
                      onClick={() => handleView(item)}
                      className="w-full bg-[#00cce5] text-[#131b23] py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest hover:bg-white transition-all shadow-xl hover:shadow-[#00cce5]/20 group/btn"
                    >
                      {item.type === 'PDF' ? 'Open Document' : 'Read Article'}
                      <RiExternalLinkLine className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 text-sm pt-0.5" />
                    </button>
                    
                    {item.fileUrl && (
                      <a 
                        href={item.fileUrl} 
                        download
                        className="w-full bg-white/5 text-gray-400 py-3.5 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5 group/dl"
                      >
                        <RiFilePdfLine className="group-hover/dl:text-red-500 transition-colors" /> Download PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ResultsContent;
