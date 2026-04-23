import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';
import { 
  RiMoneyDollarCircleLine, 
  RiUserHeartLine, 
  RiTicketLine, 
  RiLoader4Line, 
  RiCalendarCheckLine,
  RiArrowRightSLine,
  RiShieldCheckLine,
  RiTimeLine
} from 'react-icons/ri';

const DailyReport = () => {
  const [data, setData] = useState({ summary: {}, registrations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDailyReport();
  }, []);

  const fetchDailyReport = async () => {
    try {
      const response = await api.get('/admin/reports/daily');
      setData(response.data);
    } catch (err) {
      console.error('Error fetching daily report:', err);
      setError('Could not load report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RiLoader4Line className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">Generating Report...</p>
      </div>
    );
  }

  const { summary, registrations } = data;

  // Manual calculation for 100% accuracy based on pricing list
  const calculatedStats = registrations.reduce((acc, reg) => {
    // Normalize role to match pricing keys (lowercase)
    const roleKey = (reg.role || '').toLowerCase();
    
    // Get original fee from event pricing, with global fallbacks if missing
    const defaultPricing = { athlete: 200, coach: 500, club: 5000, spectator: 100 };
    const originalFee = reg.event?.pricing?.[roleKey] || defaultPricing[roleKey] || 0;
    
    const discount = originalFee - reg.amountPaid;
    
    acc.gross += originalFee;
    acc.discounts += discount;
    acc.net += reg.amountPaid;
    acc.count += 1;
    return acc;
  }, { gross: 0, discounts: 0, net: 0, count: 0 });

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Today's Revenue Report</h1>
          <p className="text-gray-500 mt-2 font-medium">Real-time summary of registrations and payments for {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <button 
          onClick={fetchDailyReport}
          className="px-6 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
        >
          <RiCalendarCheckLine size={20} />
          Refresh Stats
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Registrations" 
          value={calculatedStats.count} 
          icon={<RiUserHeartLine size={24} />} 
          color="blue"
          subtitle="New sign-ups today"
        />
        <StatCard 
          title="Gross Value" 
          value={`₹${calculatedStats.gross}`} 
          icon={<RiMoneyDollarCircleLine size={24} />} 
          color="slate"
          subtitle="Total value before discounts"
        />
        <StatCard 
          title="Discounts Given" 
          value={`₹${calculatedStats.discounts}`} 
          icon={<RiTicketLine size={24} />} 
          color="orange"
          subtitle="Total savings applied"
        />
        <StatCard 
          title="Net Revenue" 
          value={`₹${calculatedStats.net}`} 
          icon={<RiShieldCheckLine size={24} />} 
          color="emerald"
          subtitle="Actual money received"
        />
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Today's Active Registrations</h3>
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{registrations.length} Entries</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr className="text-left text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                <th className="px-8 py-5">User</th>
                <th className="px-8 py-5">Event & Role</th>
                <th className="px-8 py-5 text-right">Original Fee</th>
                <th className="px-8 py-5 text-right">Discount</th>
                <th className="px-8 py-5 text-right">Final Revenue</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-300">
                        <RiTimeLine size={48} className="mb-4 opacity-20" />
                        <p className="text-lg font-bold text-gray-400">No activity yet for today.</p>
                        <p className="text-sm font-medium">New registrations will appear here automatically.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => {
                  const roleKey = (reg.role || '').toLowerCase();
                  const defaultPricing = { athlete: 200, coach: 500, club: 5000, spectator: 100 };
                  const originalFee = reg.event?.pricing?.[roleKey] || defaultPricing[roleKey] || 0;
                  const discountAmount = originalFee - reg.amountPaid;

                  return (
                    <tr key={reg._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{reg.user?.personalInfo?.firstName} {reg.user?.personalInfo?.lastName}</span>
                          <span className="text-xs text-gray-400">{reg.user?.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-800">{reg.event?.title}</span>
                          <span className="text-[10px] font-black text-blue-600 uppercase italic tracking-wider">{reg.role}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-sm font-bold text-gray-400 line-through">₹{originalFee}</span>
                      </td>
                      <td className="px-8 py-6 text-right space-y-1">
                        {discountAmount > 0 ? (
                          <>
                            <div className="flex items-center justify-end gap-1.5">
                              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">-₹{discountAmount}</span>
                            </div>
                            {reg.couponUsed && (
                              <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100 flex items-center gap-1 justify-end ml-auto w-fit">
                                <RiTicketLine size={10} /> {reg.couponUsed.code}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs font-bold text-gray-300">₹0</span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-sm font-black text-blue-600">₹{reg.amountPaid}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border ${
                          reg.status === 'confirmed' 
                            ? 'bg-green-100 text-green-700 border-green-200' 
                            : reg.status === 'pending'
                            ? 'bg-orange-100 text-orange-700 border-orange-200'
                            : 'bg-red-100 text-red-700 border-red-200'
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl bg-${color}-50 text-${color}-600`}>
        {icon}
      </div>
      <RiArrowRightSLine className="text-gray-200 group-hover:text-blue-600 transition-colors" size={24} />
    </div>
    <div>
      <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-1">{value}</h3>
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{title}</p>
      <p className="text-[10px] text-gray-400 mt-2 font-medium italic opacity-0 group-hover:opacity-100 transition-opacity">{subtitle}</p>
    </div>
  </div>
);

export default DailyReport;
