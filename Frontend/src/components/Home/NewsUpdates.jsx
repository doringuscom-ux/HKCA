import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollReveal, WordReveal } from '../common/Animations'
import { FiArrowRight, FiCalendar, FiLoader, FiAlertCircle } from 'react-icons/fi'
import api from '../../api/apiConfig'

// Dynamic news system - Dummy data removed

const NewsUpdates = () => {
  const navigate = useNavigate()
  const tabs = ['News', 'Upcoming Events', 'Events', 'Results']
  const [activeTab, setActiveTab] = useState('News')
  const [news, setNews] = useState({ News: [], Events: [], Results: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [eventsRes, publicationsRes] = await Promise.all([
          api.get('/admin/events'),
          api.get('/admin/publications')
        ]);

        const formattedEvents = eventsRes.data.map(event => ({
          id: event._id,
          title: event.title,
          date: new Date(event.date).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          }),
          summary: event.description,
          image: event.imageUrl,
          link: `/events/${event._id}`,
          originalDate: event.date,
          type: 'Event'
        }));

        const newsItems = [];
        const results = [];

        publicationsRes.data.forEach(item => {
          const formatted = {
            id: item._id,
            title: item.title,
            date: new Date(item.date).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric'
            }),
            summary: item.summary,
            image: item.imageUrl,
            link: item.fileUrl 
              ? `/view-pdf?url=${encodeURIComponent(item.fileUrl)}&title=${encodeURIComponent(item.title)}`
              : '#',
            type: item.type
          };

          if (item.category === 'News' || item.category === 'General') newsItems.push(formatted);
          else if (item.category === 'Result' || item.category === 'Results') results.push(formatted);
        });

        setNews({
          News: newsItems,
          Events: formattedEvents,
          Results: results
        });
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load latest updates. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  return (
    <section className="bg-white py-8 sm:py-12 px-6 sm:px-10 overflow-hidden font-sans relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-slate-50 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="relative inline-block">
            <WordReveal 
                text="HKCA NEWS & UPDATES"
                className="text-[#1a2128] font-heading text-2xl sm:text-4xl font-bold leading-tight mb-1"
            />
            {/* Hand-drawn SVG Underline Effect */}
            <motion.svg 
              viewBox="0 0 300 15" 
              className="w-full h-4 absolute -bottom-2 left-0 text-[#0084ff] opacity-60"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <path 
                d="M5 10c40-5 120-10 290 0" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinecap="round" 
              />
            </motion.svg>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 bg-slate-50 p-1.5 rounded-2xl mb-8 border border-slate-100 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 sm:px-8 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider transition-all duration-300 ${
                activeTab === tab 
                  ? 'text-white' 
                  : 'text-slate-500 hover:text-[#0084ff]'
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#0084ff] rounded-xl shadow-[0_8px_20px_rgba(0,132,255,0.3)]"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>

        {/* Content List */}
        <div className="w-full space-y-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                >
                  {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
                      <FiLoader className="w-10 h-10 animate-spin mb-4 text-[#0084ff]" />
                      <p className="text-sm font-medium">Fetching updates...</p>
                    </div>
                  ) : error ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-red-400">
                      <FiAlertCircle className="w-10 h-10 mb-4" />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  ) : (() => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    let filteredItems = [];
                    if (activeTab === 'News') {
                      filteredItems = news.News;
                      // Sort by date (descending)
                      filteredItems.sort((a, b) => new Date(b.date) - new Date(a.date));
                    } else if (activeTab === 'Upcoming Events') {
                      filteredItems = news.Events.filter(e => new Date(e.originalDate) >= today);
                    } else if (activeTab === 'Events') {
                      filteredItems = news.Events.filter(e => new Date(e.originalDate) < today);
                      filteredItems.sort((a, b) => new Date(b.originalDate) - new Date(a.originalDate));
                    } else if (activeTab === 'Results') {
                      filteredItems = news.Results;
                    }

                    if (filteredItems.length === 0) {
                      return (
                        <div className="col-span-full py-24 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/50">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                            <FiAlertCircle className="text-slate-300" size={32} />
                          </div>
                          <p className="text-sm font-bold tracking-tight text-slate-500">
                            {activeTab === 'News' ? 'No recent news or feeds available.' :
                             activeTab === 'Upcoming Events' ? 'No future events scheduled.' : 
                             activeTab === 'Events' ? 'No updates found here yet.' : 
                             'No official results found.'}
                          </p>
                          <p className="text-xs text-slate-400 mt-2">Check back later for fresh updates!</p>
                        </div>
                      );
                    }

                    return filteredItems.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => item.link !== '#' && navigate(item.link)}
                        className="flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,132,255,0.08)] transition-all duration-500 group cursor-pointer"
                      >
                        {/* News Image */}
                        <div className="w-full aspect-video overflow-hidden relative block">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-[#1a2128]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        {/* News Content */}
                        <div className="p-5 sm:p-6 flex flex-col grow">
                          <div className="flex items-center gap-2 text-[#0084ff] text-xs font-bold mb-2">
                            <FiCalendar />
                            <span>{item.date}</span>
                          </div>
                          <h3 className="text-[#1a2128] font-heading text-lg sm:text-xl font-bold mb-2 group-hover:text-[#0084ff] transition-colors duration-300 line-clamp-1 min-h-[24px] sm:min-h-[28px]">
                            {item.title}
                          </h3>
                          <p className="text-slate-500 text-sm leading-relaxed mb-4 font-light line-clamp-2 min-h-[40px]">
                            {item.summary}
                          </p>
                          <div className="mt-auto">
                            <div className="inline-flex items-center gap-2 text-[#0084ff] font-bold text-sm tracking-wide group/btn">
                              Read More 
                              <FiArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-2" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer View More */}
        <div className="mt-8 sm:mt-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-[#0084ff] text-white rounded-full font-bold shadow-lg shadow-blue-200 flex items-center gap-2 group"
          >
            View More Updates
            <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <FiArrowRight className="rotate-90" />
            </motion.div>
          </motion.button>
        </div>

      </div>
    </section>
  )
}

export default NewsUpdates
