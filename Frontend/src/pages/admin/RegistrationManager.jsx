import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';
import { 
  RiMoneyDollarCircleLine, 
  RiQrCodeLine, 
  RiAddLine, 
  RiDeleteBinLine, 
  RiMailLine, 
  RiUserLine, 
  RiShieldCheckLine,
  RiLoader4Line,
  RiInformationLine,
  RiClipboardLine
} from 'react-icons/ri';

const RegistrationManager = () => {
  const [fees, setFees] = useState({ athlete: 0, coach: 0, club: 0 });
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingFee, setSubmittingFee] = useState(false);
  const [submittingCode, setSubmittingCode] = useState(false);
  
  const [newCode, setNewCode] = useState({
    email: '',
    role: 'athlete'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [feesRes, codesRes] = await Promise.all([
        api.get('/admin/settings/registration-fees'),
        api.get('/admin/registration-codes')
      ]);
      setFees(feesRes.data);
      setCodes(codesRes.data);
    } catch (err) {
      console.error('Error fetching registration data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeeUpdate = async (e) => {
    e.preventDefault();
    setSubmittingFee(true);
    try {
      await api.put('/admin/settings/registration-fees', fees);
      alert('Registration fees updated successfully');
    } catch (err) {
      alert('Failed to update fees');
    } finally {
      setSubmittingFee(false);
    }
  };

  const handleGenerateCode = async (e) => {
    e.preventDefault();
    if (!newCode.email) return alert('Email is required');
    setSubmittingCode(true);
    try {
      const { data } = await api.post('/admin/registration-codes', newCode);
      setCodes([data, ...codes]);
      setNewCode({ email: '', role: 'athlete' });
      alert('Registration code generated: ' + data.code);
    } catch (err) {
      alert('Failed to generate code');
    } finally {
      setSubmittingCode(false);
    }
  };

  const handleDeleteCode = async (id) => {
    if (!window.confirm('Delete this code?')) return;
    try {
      await api.delete(`/admin/registration-codes/${id}`);
      setCodes(codes.filter(c => c._id !== id));
    } catch (err) {
      alert('Failed to delete code');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RiLoader4Line className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-gray-500 font-bold animate-pulse">Loading Registration Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
              <RiMoneyDollarCircleLine size={32} />
            </div>
            Registration Management
          </h1>
          <p className="text-gray-500 mt-3 text-lg font-medium max-w-xl">
            Configure registration fees and manage offline payment codes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Fees Configuration */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <RiClipboardLine size={20} />
              </div>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">Set Fees</h2>
            </div>

            <form onSubmit={handleFeeUpdate} className="space-y-6">
              {Object.keys(fees).map((role) => (
                <div key={role} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 capitalize">{role} Fee (₹)</label>
                  <input 
                    type="number"
                    value={fees[role]}
                    onChange={(e) => setFees({ ...fees, [role]: Number(e.target.value) })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all"
                    placeholder={`Enter ${role} fee`}
                  />
                </div>
              ))}
              <button 
                type="submit"
                disabled={submittingFee}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
              >
                {submittingFee ? 'Updating...' : 'Save All Fees'}
              </button>
            </form>
          </div>

          <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
            <div className="flex items-start gap-4">
              <RiInformationLine size={24} className="text-emerald-600 shrink-0 mt-1" />
              <div>
                <p className="text-emerald-900 font-bold text-sm mb-2 uppercase tracking-widest">Note on Fees</p>
                <p className="text-emerald-700 text-xs leading-relaxed font-medium">
                  If a fee is set to ₹0, users for that role will be registered immediately without payment verification.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Generator & List */}
        <div className="lg:col-span-2 space-y-8">
          {/* Generator */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <RiQrCodeLine size={20} />
              </div>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">Generate Offline Code</h2>
            </div>

            <form onSubmit={handleGenerateCode} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">User Email</label>
                <div className="relative">
                  <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email"
                    value={newCode.email}
                    onChange={(e) => setNewCode({ ...newCode, email: e.target.value.toLowerCase() })}
                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-200 transition-all"
                    placeholder="user@example.com"
                    required
                  />
                </div>
              </div>
              <div className="md:col-span-1 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">User Role</label>
                <select
                  value={newCode.role}
                  onChange={(e) => setNewCode({ ...newCode, role: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-200 transition-all"
                >
                  <option value="athlete">Athlete</option>
                  <option value="coach">Coach</option>
                  <option value="club">Club</option>
                </select>
              </div>
              <div className="md:col-span-1 flex items-end">
                <button 
                  type="submit"
                  disabled={submittingCode}
                  className="w-full py-4 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submittingCode ? <RiLoader4Line className="animate-spin" /> : <RiAddLine size={18} />}
                  Generate Code
                </button>
              </div>
            </form>
          </div>

          {/* List */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
                <h2 className="text-lg font-black text-gray-900 tracking-tight">Active Registration Codes</h2>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white border border-gray-100 rounded-lg text-slate-400">
                {codes.length} Codes
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] border-b border-gray-100">
                    <th className="px-6 py-5">Code</th>
                    <th className="px-6 py-5">Assigned To</th>
                    <th className="px-6 py-5">Role</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {codes.map((code) => (
                    <tr key={code._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <span className="font-black text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 font-mono tracking-wider">
                          {code.code}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                          <RiMailLine size={14} className="text-slate-400" />
                          {code.email}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {code.role}
                      </td>
                      <td className="px-6 py-5">
                        {code.isUsed ? (
                          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 w-fit">
                            <RiShieldCheckLine size={14} /> Used
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 w-fit">
                            <RiLoader4Line size={14} className="animate-pulse" /> Unused
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => handleDeleteCode(code._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-gray-100"
                        >
                          <RiDeleteBinLine size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {codes.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-20 text-center text-gray-400 italic font-bold">
                        No registration codes generated yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationManager;
