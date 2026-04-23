import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/apiConfig';
import { RiCalendarCheckLine, RiMapPinLine, RiLoader4Line } from 'react-icons/ri';

const EventsContent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventFilter, setEventFilter] = useState('Upcoming'); // 'Upcoming' or 'Completed'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/admin/events');
        // Sort by date Descending (Latest first)
        const sorted = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEvents(sorted);
      } catch (error) {
        console.error('Failed to fetch events', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="bg-[#131b23] py-24 px-6 text-center text-gray-300">
        <RiLoader4Line className="animate-spin text-blue-500 mx-auto" size={40} />
      </section>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventFilter === 'Upcoming' ? eventDate >= today : eventDate < today;
  });

  return (
    <section className="bg-[#131b23] py-12 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Filter Controls */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-[#1a242f] border border-gray-800 p-1 rounded-full shadow-2xl">
            {['Upcoming', 'Completed'].map((filter) => (
              <button
                key={filter}
                onClick={() => setEventFilter(filter)}
                className={`px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  eventFilter === filter 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center text-gray-400 italic py-24 bg-[#1a242f]/30 rounded-[2rem] border-2 border-dashed border-gray-800">
            No {eventFilter.toLowerCase()} events found at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredEvents.map((event) => (
              <div 
                key={event._id} 
                onClick={() => navigate(`/events/${event._id}`)}
                className="bg-[#1a242f] rounded-[1.5rem] overflow-hidden shadow-xl border border-gray-800 transition-all hover:-translate-y-2 flex flex-col cursor-pointer group"
              >
                <div className="h-48 sm:h-56 w-full overflow-hidden shrink-0 relative">
                  <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-linear-to-t from-[#1a242f] via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-6 flex flex-col grow">
                  <h3 className="text-lg md:text-xl font-black text-white line-clamp-2 mb-3 min-h-14 leading-7 group-hover:text-blue-500 transition-colors uppercase tracking-tight">{event.title}</h3>
                  <p className="text-gray-400 text-xs md:text-sm line-clamp-3 mb-6 grow min-h-12 leading-relaxed opacity-80 font-medium italic">{event.description}</p>
                  <div className="mt-auto pt-4 border-t border-gray-800/50 space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
                      <RiCalendarCheckLine className="text-blue-500 shrink-0" size={16} />
                      <span className="truncate">
                        {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
                      <RiMapPinLine className="text-blue-500 shrink-0" size={16} />
                      <span className="truncate">{event.location}</span>
                    </div>
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

export default EventsContent;
