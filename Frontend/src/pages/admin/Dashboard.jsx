import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';
import { RiImageLine, RiCalendarEventLine, RiUserLine, RiArrowRightUpLine, RiTicketLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    galleryCount: 0,
    eventCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [galleryRes, eventsRes] = await Promise.all([
          api.get('/admin/gallery'),
          api.get('/admin/events')
        ]);
        setStats({
          galleryCount: galleryRes.data.length,
          eventCount: eventsRes.data.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { 
      name: 'Gallery Items', 
      value: stats.galleryCount, 
      icon: <RiImageLine />, 
      color: 'bg-blue-500',
      link: '/admin/gallery'
    },
    { 
      name: 'Total Events', 
      value: stats.eventCount, 
      icon: <RiCalendarEventLine />, 
      color: 'bg-indigo-500',
      link: '/admin/events'
    },
    { 
      name: 'Account Role', 
      value: 'Administrator', 
      icon: <RiUserLine />, 
      color: 'bg-purple-500',
      link: '#'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Overview</h1>
        <p className="text-gray-500 mt-2">Welcome back to the administrative control panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className={`p-4 rounded-2xl w-fit ${stat.color} text-white mb-4 shadow-lg shadow-${stat.color.split('-')[1]}-200`}>
              {React.cloneElement(stat.icon, { size: 24 })}
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              </div>
              {stat.link !== '#' && (
                <Link to={stat.link} className="flex items-center justify-center p-2 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                  <RiArrowRightUpLine size={20} />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/admin/gallery" className="flex items-center justify-between p-5 border border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                <RiImageLine size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">Upload to Gallery</p>
                <p className="text-sm text-gray-500">Add new photos to the project gallery</p>
              </div>
            </div>
          </Link>
          <Link to="/admin/events" className="flex items-center justify-between p-5 border border-gray-100 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <RiCalendarEventLine size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">Manage Events</p>
                <p className="text-sm text-gray-500">Post upcoming tournaments or trials</p>
              </div>
            </div>
          </Link>
          <Link to="/admin/coupons" className="flex items-center justify-between p-5 border border-gray-100 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <RiTicketLine size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">Manage Coupons</p>
                <p className="text-sm text-gray-500">Create discount codes for events</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
