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
      const activeReg = regRes.data.find(r => r.event?._id === id && r.status !== 'cancelled');
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
    <div className="bg-[#070b14] min-h-screen text-white font-sans selection:bg-blue-500/30 pb-10">

      {/* Hero Section */}
      <div className="relative w-full overflow-hidden min-h-[400px] flex items-center pt-16 pb-4 bg-[#070b14]">
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

              {/* Urgency Badge */}
              <div className="flex items-center gap-4 mb-6 animate-bounce-slow">
                <div className="flex items-center gap-2 bg-red-600/20 border border-red-500/40 px-4 py-1.5 rounded-full shadow-lg shadow-red-900/20">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(239,68,68,1)]" />
                  <span className="text-[11px] font-black text-red-400 uppercase tracking-wider">REGISTRATION CLOSING SOON</span>
                </div>
                <span className="text-[11px] font-black text-white/70 uppercase tracking-wider">Limited Slots Available</span>
              </div>

              {/* Countdown Timer */}
              <div className="flex gap-3 sm:gap-5 mb-10">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Mins', value: timeLeft.minutes },
                  { label: 'Secs', value: timeLeft.seconds, pulse: true }
                ].map((t, i) => (
                  <div key={i} className="group relative">
                    {/* Glow Background */}
                    <div className="absolute inset-0 bg-blue-600/15 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className={`relative w-16 h-20 sm:w-20 sm:h-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center justify-center shadow-2xl transition-all duration-500 group-hover:-translate-y-1 group-hover:border-blue-500/50 ${t.pulse ? 'ring-1 ring-blue-500/20 animate-pulse-subtle' : ''}`}>
                      <span className={`text-xl sm:text-2xl font-black text-white mb-0.5 tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] ${t.pulse ? 'text-blue-400' : ''}`}>
                        {String(t.value).padStart(2, '0')}
                      </span>
                      <span className="text-[7px] sm:text-[8px] font-black text-blue-500 uppercase tracking-[0.2em]">
                        {t.label}
                      </span>
                    </div>
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
        {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 mt-0 relative z-20 space-y-10">
        
        {/* PART 1: Overview & Details */}
        <section className="bg-[#0d121f] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Overview Text */}
            <div className="lg:col-span-7 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/5">
              <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
                <span className="w-1.5 h-7 bg-blue-600 rounded-full" />
                Event Overview
              </h2>
              <p className="text-gray-400 text-sm lg:text-base leading-[1.8] font-medium whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            {/* Tournament Details Sidebar (Integrated) */}
            <div className="lg:col-span-5 p-8 lg:p-12 bg-white/2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">REGISTRATION OPEN</span>
              </div>
              <h3 className="text-xl font-black text-white mb-8">Tournament Details</h3>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-500/20 text-blue-500 shrink-0">
                    <RiTimeLine size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">DURATION</p>
                    <p className="text-white font-bold text-sm">{event.duration || '2 Days'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-600/10 rounded-xl flex items-center justify-center border border-emerald-500/20 text-emerald-500 shrink-0">
                    <RiMapPinLine size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">VENUE</p>
                    <p className="text-white font-bold text-sm leading-relaxed">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-600/10 rounded-xl flex items-center justify-center border border-orange-500/20 text-orange-500 shrink-0">
                    <RiTimeLine size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">STATUS</p>
                    <p className="text-emerald-500 font-bold text-sm">Registration Open</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isRegistered || (event.registrationDeadline && new Date() > new Date(event.registrationDeadline))}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 active:scale-[0.98]"
              >
                {isRegistered ? 'ALREADY JOINED' : 'JOIN EVENT'} <RiArrowRightLine size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* PART 2: Timeline & Map */}
        <section className="bg-[#0d121f] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Timeline Content */}
            <div className="lg:col-span-7 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/5">
              <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-4">
                <span className="w-1.5 h-7 bg-blue-600 rounded-full" />
                Event Timeline
              </h2>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-12 ml-6">Key event details at a glance</p>
              
              <div className="relative pt-10 pb-4">
                {/* Main Connecting Line */}
                <div className="absolute top-[70px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-gray-700 to-transparent hidden md:block" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 md:gap-4 relative">
                  {[
                    { label: 'EVENT DATE', value: event.date ? new Date(event.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : 'N/A', subValue: event.date ? new Date(event.date).getFullYear() : '', color: 'blue', icon: <RiCalendarLine size={28} /> },
                    { label: 'VENUE', value: event.location.split(',')[0], subValue: event.location.split(',')[1] || 'Main Arena', color: 'emerald', icon: <RiMapPinLine size={28} /> },
                    { label: 'DEADLINE', value: event.registrationDeadline ? new Date(event.registrationDeadline).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : 'N/A', subValue: event.registrationDeadline ? new Date(event.registrationDeadline).getFullYear() : '', color: 'orange', icon: <RiUserLine size={28} /> },
                    { label: 'DURATION', value: event.duration || '2 Days', subValue: 'Event Duration', color: 'purple', icon: <RiTimeLine size={28} /> }
                  ].map((step, i) => {
                    const colorClasses = {
                      blue: 'border-blue-500/30 text-blue-500 group-hover:border-blue-500 group-hover:shadow-blue-500/20 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]',
                      emerald: 'border-emerald-500/30 text-emerald-500 group-hover:border-emerald-500 group-hover:shadow-emerald-500/20 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
                      orange: 'border-orange-500/30 text-orange-500 group-hover:border-orange-500 group-hover:shadow-orange-500/20 bg-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
                      purple: 'border-purple-500/30 text-purple-500 group-hover:border-purple-500 group-hover:shadow-purple-500/20 bg-purple-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                    };
                    const currentStyles = colorClasses[step.color];

                    return (
                      <div key={i} className="relative flex flex-col items-center group">
                        {/* Top Label */}
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mb-6 transition-colors group-hover:text-white">{step.label}</p>
                        
                        {/* Central Circle & Icon */}
                        <div className="relative mb-8">
                          {/* Connecting Line Dot */}
                          <div className={`absolute -top-[14px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-[#0d121f] ${currentStyles.split(' ').find(c => c.startsWith('bg-'))} z-20 ${currentStyles.split(' ').find(c => c.startsWith('shadow-['))} hidden md:block`} />
                          
                          <div className={`w-20 h-20 bg-[#0d121f] border-2 ${currentStyles.split(' ').find(c => c.startsWith('border-'))} rounded-full flex items-center justify-center shadow-2xl ${currentStyles.split(' ').find(c => c.startsWith('text-'))} transition-all duration-500 group-hover:scale-110 ${currentStyles.split(' ').filter(c => c.startsWith('group-hover:')).join(' ')} relative z-10`}>
                            {step.icon}
                          </div>
                        </div>

                        {/* Bottom Data Card */}
                        <div className="bg-white/3 border border-white/5 rounded-2xl p-4 w-32 text-center transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/20 group-hover:-translate-y-1">
                          <p className="text-white font-black text-sm mb-1">{step.value}</p>
                          <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">{step.subValue}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center">
              <h4 className="text-sm font-black text-white mb-6 flex items-center gap-2">
                <RiMapPinLine className="text-blue-500" />
                Venue Location
              </h4>
              <div className="w-full h-64 rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10 group">
                {event.mapUrl ? (
                  <iframe
                    src={event.mapUrl}
                    className="w-full h-full border-0 transition-transform duration-700 group-hover:scale-105"
                    allowFullScreen=""
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-500 italic text-sm">
                    Map not available
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

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
