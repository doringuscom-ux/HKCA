import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';
import { 
  RiTicketLine, 
  RiAddCircleLine, 
  RiDeleteBin7Line, 
  RiLoader4Line, 
  RiErrorWarningLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiTimerLine,
  RiMoneyDollarCircleLine,
  RiPercentLine,
  RiUserHeartLine,
  RiMailLine
} from 'react-icons/ri';

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('fixed');
  const [discountValue, setDiscountValue] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [usageLimit, setUsageLimit] = useState(1);
  const [restrictedEmail, setRestrictedEmail] = useState('');
  const [applicableFor, setApplicableFor] = useState('All');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await api.get('/admin/coupons');
      setCoupons(response.data);
    } catch (err) {
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBtnLoading(true);

    try {
      await api.post('/admin/coupons', {
        code: code.toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        expiryDate,
        usageLimit: Number(usageLimit),
        applicableFor,
        restrictedEmail: restrictedEmail || null
      });
      
      setCode('');
      setDiscountValue('');
      setExpiryDate('');
      setRestrictedEmail('');
      setApplicableFor('All');
      fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create coupon');
    } finally {
      setBtnLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/admin/coupons/${id}`, { isActive: !currentStatus });
      fetchCoupons();
    } catch (err) {
      alert('Failed to update coupon status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this coupon?')) {
      try {
        await api.delete(`/admin/coupons/${id}`);
        fetchCoupons();
      } catch (err) {
        alert('Failed to remove coupon');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RiLoader4Line className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Coupons</h1>
        <p className="text-gray-500 mt-2">Create and manage discount codes for event registrations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Create Coupon Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-10">
            <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <RiAddCircleLine className="text-blue-600" size={24} />
              New Coupon
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 outline-none border uppercase font-black tracking-widest"
                  placeholder="EX: HKCA50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Discount Type</label>
                <div className="flex p-1 bg-gray-100 rounded-2xl w-full">
                  <button
                    type="button"
                    onClick={() => setDiscountType('fixed')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${discountType === 'fixed' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <RiMoneyDollarCircleLine size={18} /> Fixed
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType('percentage')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${discountType === 'percentage' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <RiPercentLine size={18} /> Percentage
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Discount Value {discountType === 'percentage' ? '(%)' : '(₹)'}
                </label>
                <input
                  type="number"
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 outline-none border"
                  placeholder={discountType === 'percentage' ? "Ex: 10" : "Ex: 100"}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 outline-none border"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Restricted Email (Optional)</label>
                <input
                  type="email"
                  value={restrictedEmail}
                  onChange={(e) => setRestrictedEmail(e.target.value)}
                  className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 outline-none border"
                  placeholder="Ex: user@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Applicable For</label>
                <select
                  value={applicableFor}
                  onChange={(e) => setApplicableFor(e.target.value)}
                  className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 outline-none border font-bold"
                >
                  <option value="All">All (Events & Documents)</option>
                  <option value="Events">Event Registration Only</option>
                  <option value="Documents">Document Verification Only</option>
                </select>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100">
                  <RiErrorWarningLine size={18} />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={btnLoading}
                className="w-full bg-blue-600 text-white rounded-2xl px-6 py-4 font-black text-sm hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200 disabled:opacity-50"
              >
                {btnLoading ? <RiLoader4Line className="animate-spin mx-auto" size={20} /> : 'Create Coupon'}
              </button>
            </form>
          </div>
        </div>

        {/* Coupons List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              Active Coupons
            </div>
            <span className="text-xs font-bold text-gray-400 border px-3 py-1 rounded-full uppercase">{coupons.length} Total</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coupons.map((coupon) => (
              <div key={coupon._id} className={`bg-white p-6 rounded-3xl border shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${!coupon.isActive ? 'opacity-70 grayscale bg-gray-50' : 'border-gray-100'}`}>
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Coupon Code</span>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{coupon.code}</h3>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      {coupon.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Discount</p>
                      <p className="font-black text-gray-900 flex items-center gap-1">
                        {coupon.discountType === 'percentage' ? <RiPercentLine /> : '₹'}
                        {coupon.discountValue} {coupon.discountType === 'percentage' ? '%' : ''}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Used By</p>
                      <p className="font-black text-gray-900 flex items-center gap-1">
                        <RiUserHeartLine className="text-blue-600" />
                        {coupon.usedBy?.length || 0} Users
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <RiTimerLine className={new Date(coupon.expiryDate) < new Date() ? 'text-red-500' : 'text-blue-600'} size={14} />
                      Expires on: {new Date(coupon.expiryDate).toLocaleDateString()}
                    </div>
                    {coupon.restrictedEmail && (
                      <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50/50 p-2 rounded-xl border border-blue-100/50">
                        <RiMailLine size={14} />
                        Restricted: {coupon.restrictedEmail}
                      </div>
                    )}
                    {coupon.applicableFor && coupon.applicableFor !== 'All' && (
                      <div className="flex items-center gap-2 text-[10px] font-bold text-purple-600 uppercase tracking-wider bg-purple-50/50 p-2 rounded-xl border border-purple-100/50">
                        <RiTicketLine size={14} />
                        Only for: {coupon.applicableFor}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => toggleStatus(coupon._id, coupon.isActive)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all border ${coupon.isActive ? 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-600 hover:text-white' : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-600 hover:text-white'}`}
                  >
                    {coupon.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-100"
                  >
                    <RiDeleteBin7Line size={18} />
                  </button>
                </div>
              </div>
            ))}

            {coupons.length === 0 && (
              <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <RiTicketLine className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-gray-900 font-bold text-lg">No coupons yet</h3>
                <p className="text-gray-400 text-sm">Created codes will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCoupons;
