import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/apiConfig';
import {
  RiCalendarLine,
  RiMapPinLine,
  RiTimeLine,
  RiUserLine,
  RiFlagLine,
  RiArrowRightLine,
  RiLoader4Line,
  RiErrorWarningLine
} from 'react-icons/ri';
import EventRegistrationModal from '../components/events/EventRegistrationModal';
import { useAuth } from '../context/AuthContext';
import { validateProfileCompletion } from '../utils/profileValidation';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });

  const fetchRegistrationStatus = async () => {
    if (!user) return;
    try {
      const regRes = await api.get('/user-events/my-registrations');
      const activeReg = regRes.data.find(r => r.event._id === id && r.status !== 'cancelled');
      setRegistration(activeReg);
      setIsRegistered(activeReg?.status === 'confirmed');
    } catch (error) {
      console.error('Error fetching registration status:', error);
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/admin/events/${id}`);
        setEvent(response.data);
        await fetchRegistrationStatus();
      } catch (error) {
        console.error('Error fetching event data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, user]);

  useEffect(() => {
    if (!event?.date) return;

    const timer = setInterval(() => {
      const target = new Date(event.date).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [event]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#070b14]">
        <RiLoader4Line className="animate-spin text-blue-500" size={50} />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#070b14] text-white">
        <h2 className="text-2xl font-bold mb-4">Event not found</h2>
        <button onClick={() => navigate('/events')} className="bg-blue-600 px-6 py-3 rounded-xl transition">Back to Events</button>
      </div>
    );
  }

  return (
    <div className="bg-[#070b14] min-h-screen text-white font-sans selection:bg-blue-500/30 pb-20">

      {/* Hero Section */}
      <div className="relative w-full overflow-hidden min-h-[500px] flex items-center pt-24 pb-16 bg-[#070b14]">
        {/* Subtle Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-emerald-900/10" />

        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7">
              {/* Upcoming Event Badge */}
              <div className="inline-block px-3 py-1 text-[9px] mb-6 font-black uppercase tracking-[0.2em] text-white bg-blue-600/40 backdrop-blur-md rounded-md border border-white/10 shadow-xl">
                UPCOMING EVENT
              </div>

              {/* Main Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.1] tracking-tight mb-6">
                <span className="block text-white drop-shadow-2xl">
                  {event.title.split(',')[0]}
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400 mt-1">
                  {event.title.includes(',') ? event.title.split(',')[1] : ''}
                </span>
              </h1>

              {/* Countdown Timer */}
              <div className="flex gap-3 mb-8">
                {[
                  { label: 'DAYS', value: timeLeft.days },
                  { label: 'HOURS', value: timeLeft.hours },
                  { label: 'MINS', value: timeLeft.minutes },
                  { label: 'SECS', value: timeLeft.seconds }
                ].map((t, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-1.5">
                      <span className="text-lg font-black text-white">{t.value}</span>
                    </div>
                    <span className="text-[8px] font-black text-gray-500 tracking-widest">{t.label}</span>
                  </div>
                ))}
              </div>



              {/* Quick Info Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#0d121f]/40 backdrop-blur-md border border-white/10 p-3.5 rounded-xl flex items-center gap-3.5 transition-colors hover:bg-[#0d121f]/60">
                  <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                    <RiCalendarLine size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">DATE</p>
                    <p className="text-white font-bold text-xs">
                      {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="bg-[#0d121f]/40 backdrop-blur-md border border-white/10 p-3.5 rounded-xl flex items-center gap-3.5 transition-colors hover:bg-[#0d121f]/60">
                  <div className="w-10 h-10 bg-emerald-600/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                    <RiMapPinLine size={20} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">LOCATION</p>
                    <p className="text-white font-bold text-xs truncate max-w-[120px]">{event.location.split(',')[0]}</p>
                  </div>
                </div>

                <div className="bg-[#0d121f]/40 backdrop-blur-md border border-white/10 p-3.5 rounded-xl flex items-center gap-3.5 transition-colors hover:bg-[#0d121f]/60">
                  <div className="w-10 h-10 bg-orange-600/10 rounded-lg flex items-center justify-center border border-orange-500/20">
                    <RiTimeLine size={20} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">DEADLINE</p>
                    <p className="text-white font-bold text-xs">
                      {new Date(event.registrationDeadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image Frame */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-[2.5rem] opacity-20 blur-2xl group-hover:opacity-30 transition duration-1000" />
              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-blue-900/20 transform hover:scale-[1.02] transition-all duration-500">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Section */}
            <section className="bg-[#0d121f] border border-white/5 rounded-3xl p-8 lg:p-10 shadow-2xl">
              <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
                <span className="w-1.5 h-7 bg-blue-600 rounded-full" />
                Event Overview
              </h2>
              <div className="space-y-6">
                <p className="text-gray-400 text-sm lg:text-base leading-[1.8] font-medium whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </section>

            {/* Timeline Section */}
            <section className="bg-[#0d121f] border border-white/5 rounded-3xl p-6 lg:p-8 shadow-2xl">
              <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
                <span className="w-1.5 h-7 bg-blue-600 rounded-full" />
                Event Timeline
              </h2>

              <div className="relative py-4">
                {/* Thin Dotted Line */}
                <div className="absolute top-[44px] left-[10%] right-[10%] h-px border-t border-dashed border-gray-700 hidden md:block" />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
                  {[
                    { label: 'Event Date', date: event.date, color: 'text-blue-500', border: 'border-blue-500/30', icon: <RiCalendarLine size={24} /> },
                    { label: 'Venue', value: event.location.split(',')[0], color: 'text-emerald-500', border: 'border-emerald-500/30', icon: <RiMapPinLine size={24} /> },
                    { label: 'Registration Deadline', date: event.registrationDeadline, color: 'text-orange-500', border: 'border-orange-500/30', icon: <RiUserLine size={24} /> },
                    { label: 'DURATION', value: event.duration || 'Whole Day', color: 'text-purple-500', border: 'border-purple-500/30', icon: <RiTimeLine size={24} /> }
                  ].map((step, i) => (
                    <div key={i} className="relative flex flex-col items-center text-center z-10">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">{step.label}</p>
                      <div className={`w-14 h-14 bg-[#0d121f] ${step.border} border-2 rounded-full flex items-center justify-center mb-4 shadow-xl ${step.color} transition-transform hover:scale-110`}>
                        {step.icon}
                      </div>
                      <p className="text-white font-black text-sm">
                        {step.date ? new Date(step.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : step.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            <section className="bg-[#0d121f] border border-white/5 rounded-3xl p-6 lg:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">REGISTRATION OPEN</span>
              </div>

              <h3 className="text-xl font-black text-white mb-6">Tournament Details</h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="text-blue-500 mt-0.5">
                    <RiTimeLine size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-0.5">DURATION</p>
                    <p className="text-gray-200 font-bold text-[13px]">{event.duration || 'Whole Day Event'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-blue-500 mt-0.5">
                    <RiMapPinLine size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-0.5">VENUE</p>
                    <p className="text-gray-200 font-bold text-[13px] leading-relaxed">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-blue-500 mt-0.5">
                    <RiTimeLine size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-0.5">STATUS</p>
                    <p className="text-emerald-500 font-bold text-[13px]">Registration Open</p>
                  </div>
                </div>
              </div>

              {/* Join Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isRegistered || (event.registrationDeadline && new Date() > new Date(event.registrationDeadline))}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.98]"
              >
                {isRegistered ? 'ALREADY JOINED' : 'JOIN EVENT'} <RiArrowRightLine size={18} />
              </button>

              {/* Map Section */}
              {event.mapUrl && (
                <div className="mt-10 pt-10 border-t border-white/5">
                  <h4 className="text-sm font-bold text-white mb-6">Venue Location</h4>
                  <div className="w-full h-56 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                    <iframe
                      src={event.mapUrl}
                      className="w-full h-full border-0 grayscale opacity-80"
                      allowFullScreen=""
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <EventRegistrationModal
          event={event}
          onClose={() => setIsModalOpen(false)}
          onDashboardUpdate={fetchRegistrationStatus}
        />
      )}
    </div>
  );
};

export default EventDetailsPage;
