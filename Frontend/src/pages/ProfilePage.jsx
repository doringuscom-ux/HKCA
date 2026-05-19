import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import EventRegistrationModal from '../components/events/EventRegistrationModal';
import { 
  RiUserLine, 
  RiMailLine, 
  RiPhoneLine, 
  RiMapPinLine, 
  RiEditLine, 
  RiCheckLine,
  RiInformationLine,
  RiShieldUserLine,
  RiParentLine,
  RiFileTextLine,
  RiLoader4Line,
  RiLockPasswordLine,
  RiEyeLine,
  RiEyeOffLine,
  RiKeyLine,
  RiCalendarCheckLine,
  RiExternalLinkLine,
  RiUploadCloud2Line,
  RiErrorWarningLine,
  RiTrophyLine,
  RiMedalLine,
  RiAddLine,
  RiDeleteBinLine
} from 'react-icons/ri';
import api from '../api/apiConfig';
import { uploadToCloudinary } from '../utils/cloudinaryHelper';

const SelectField = ({ label, value, onChange, options, readOnly, info }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between ml-1">
      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </label>
      {info && (
        <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
          {info}
        </span>
      )}
    </div>
    <select 
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={readOnly}
      className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 font-bold text-slate-700 appearance-none bg-no-repeat bg-position-[right_1.25rem_center] bg-size-[1em_1em] ${
        readOnly 
          ? 'bg-slate-50/50 border-slate-100 text-slate-400 cursor-not-allowed' 
          : 'bg-white border-blue-100 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 outline-none cursor-pointer'
      }`}
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` }}
    >
      <option value="">Select {label}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const InputField = ({ label, value, onChange, type = "text", readOnly, placeholder, info }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between ml-1">
      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </label>
      {info && (
        <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
          {info}
        </span>
      )}
    </div>
    <input 
      type={type}
      value={value || ''}
      maxLength={label.toLowerCase().includes('aadhaar') ? 12 : (label.toLowerCase().includes('phone') ? 10 : (label.toLowerCase().includes('pin code') ? 6 : undefined))}
      onInput={(e) => {
        const isNumeric = label.toLowerCase().includes('aadhaar') || 
                          label.toLowerCase().includes('phone') || 
                          label.toLowerCase().includes('pin code');
        if (isNumeric) {
          e.target.value = e.target.value.replace(/\D/g, '');
        }
      }}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      placeholder={placeholder}
      className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 font-bold text-slate-700 ${
        readOnly 
          ? 'bg-slate-50/50 border-slate-100 text-slate-400 cursor-not-allowed' 
          : 'bg-white border-blue-100 ring-4 ring-blue-500/0 focus:ring-blue-500/5 focus:border-blue-400 outline-none'
      }`}
    />
  </div>
);

// ─── Achievement preset titles (admin-curated) ───────────────────────────────
const ACHIEVEMENT_PRESETS = [
  'State Championship Winner',
  'District Championship Winner',
  'Gold Medal – State Games',
  'Silver Medal – State Games',
  'Bronze Medal – State Games',
  'National Championship Participant',
  'Best Player Award',
  'Outstanding Athlete Recognition',
  'Club Level Championship Winner',
  'Inter-District Tournament Winner',
  'Junior Category Champion',
  'Senior Category Champion',
  'Other',
];

const AchievementAddForm = ({ formData, setFormData }) => {
  const [selectedTitle, setSelectedTitle] = useState('');
  const [customTitle, setCustomTitle]     = useState('');
  const [achDate, setAchDate]             = useState('');
  const [achDesc, setAchDesc]             = useState('');
  const [added, setAdded]                 = useState(false);

  const handleAdd = () => {
    const finalTitle = selectedTitle === 'Other' ? customTitle.trim() : selectedTitle;
    if (!finalTitle || !achDate) {
      alert('Achievement title and date are required.');
      return;
    }

    const newAch = { title: finalTitle, date: achDate, description: achDesc, stamp: 'HKCA' };
    setFormData(prev => ({
      ...prev,
      achievements: [...(prev.achievements || []), newAch]
    }));

    // Reset form
    setSelectedTitle('');
    setCustomTitle('');
    setAchDate('');
    setAchDesc('');

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 rounded-[2rem] p-8 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20">
          <RiAddLine size={18} />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Add Your Achievement</h4>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Will be saved when you click Save Changes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Dropdown */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Achievement Title</label>
          <select
            value={selectedTitle}
            onChange={(e) => { setSelectedTitle(e.target.value); setCustomTitle(''); }}
            className="w-full px-5 py-4 rounded-2xl border border-blue-100 bg-white text-slate-700 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '1em 1em' }}
          >
            <option value="">— Select Achievement —</option>
            {ACHIEVEMENT_PRESETS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Custom title if "Other" selected */}
        {selectedTitle === 'Other' && (
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Custom Title</label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. Regional Karate Championship Winner 2024"
              className="w-full px-5 py-4 rounded-2xl border border-blue-100 bg-white text-slate-700 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
            />
          </div>
        )}

        {/* Date */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Date / Year</label>
          <input
            type="text"
            value={achDate}
            onChange={(e) => setAchDate(e.target.value)}
            placeholder="e.g. March 2024"
            className="w-full px-5 py-4 rounded-2xl border border-blue-100 bg-white text-slate-700 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Description <span className="normal-case text-slate-300">(optional)</span></label>
          <input
            type="text"
            value={achDesc}
            onChange={(e) => setAchDesc(e.target.value)}
            placeholder="Brief detail about this achievement..."
            className="w-full px-5 py-4 rounded-2xl border border-blue-100 bg-white text-slate-700 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${
          added
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-blue-300'
        }`}
      >
        {added ? <><RiCheckLine size={18} /> Added! Save Changes to Confirm</> : <><RiAddLine size={18} /> Add Achievement</>}
      </button>
    </div>
  );
};

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [uploadingStates, setUploadingStates] = useState({}); // { field: 'loading' | 'success' | 'error' }
  const [uploadErrors, setUploadErrors] = useState({}); // { field: errorMessage }

  const [showComingSoon, setShowComingSoon] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    otp: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedReg, setSelectedReg] = useState(null);

  // Password Visibility Toggles
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  // Custom Doc State
  const [customDocName, setCustomDocName] = useState('');
  const [customDocFile, setCustomDocFile] = useState(null);
  const [payingReg, setPayingReg] = useState(null);

  const allTabs = [
    { id: 'personal', label: 'Personal', icon: <RiUserLine />, roles: ['admin', 'athlete', 'coach', 'viewer', 'user'] },
    { id: 'club', label: 'Club Info', icon: <RiShieldUserLine />, roles: ['club', 'admin'] },
    { id: 'contact', label: 'Contact', icon: <RiMapPinLine />, roles: ['admin', 'athlete', 'coach', 'club', 'viewer', 'user'] },
    { id: 'documents', label: 'Documents', icon: <RiFileTextLine />, roles: ['admin', 'athlete', 'coach', 'club', 'viewer', 'user'] },
    { id: 'events', label: 'Events Hub', icon: <RiCalendarCheckLine />, roles: ['admin', 'athlete', 'coach', 'club', 'viewer', 'user'] },
    { id: 'achievements', label: 'Achievements', icon: <RiTrophyLine />, roles: ['admin', 'athlete', 'coach', 'club', 'viewer', 'user'] },
    { id: 'security', label: 'Security', icon: <RiLockPasswordLine />, roles: ['admin', 'athlete', 'coach', 'club', 'viewer', 'user'] },
  ];

  const tabs = allTabs.filter(tab => tab.roles.includes(user?.role));

  useEffect(() => {
    // Ensure activeTab is valid for the current role
    if (user && !tabs.find(t => t.id === activeTab)) {
      setActiveTab(tabs[0]?.id || 'personal');
    }
  }, [user, activeTab, tabs]);

  useEffect(() => {
    if (user) {
      setFormData(user);
      fetchRegistrations();
    }
  }, [user]);

  const fetchRegistrations = async () => {
    try {
      const response = await api.get('/user-events/my-registrations');
      setRegistrations(response.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleUserCancel = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }
    setLoading(true);
    try {
      await api.post(`/user-events/cancel/${selectedReg._id}`, { reason: cancelReason });
      setShowCancelModal(false);
      setCancelReason('');
      fetchRegistrations();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel registration');
    } finally {
      setLoading(false);
    }
  };

  const handleReapply = async (eventId, role) => {
    setLoading(true);
    try {
      const response = await api.post(`/user-events/register/${eventId}`, { role });
      alert(response.data.message);
      fetchRegistrations();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to re-apply');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-6">
        <div className="text-center p-10 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 max-w-md w-full">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <RiInformationLine size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Not Logged In</h2>
          <p className="text-slate-500 mb-8 font-medium leading-relaxed">Please login or register to access and manage your member profile details.</p>
          <a href="/register" className="block w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Join the Association
          </a>
        </div>
      </div>
    );
  }

  const handleNestedChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [field]: value
      }
    }));
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...(prev.contactInfo || {}),
        address: {
          ...(prev.contactInfo?.address || {}),
          [field]: value
        }
      }
    }));

    // Auto-fill from PIN code
    if (field === 'pinCode' && value.length === 6) {
      fetch(`https://api.postalpincode.in/pincode/${value}`)
        .then(res => res.json())
        .then(data => {
          if (data[0].Status === 'Success') {
            const postOffice = data[0].PostOffice[0];
            setFormData(prev => ({
              ...prev,
              contactInfo: {
                ...(prev.contactInfo || {}),
                address: {
                  ...(prev.contactInfo?.address || {}),
                  city: postOffice.Block || postOffice.Name,
                  district: postOffice.District,
                  state: postOffice.State,
                  village: postOffice.Block || '',
                  postOffice: postOffice.Name || '',
                  pinCode: value
                }
              }
            }));
          }
        })
        .catch(err => console.error('PIN code lookup failed:', err));
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const requestOTP = async () => {
    setLoading(true);
    try {
      await api.post('/auth/request-password-otp');
      setOtpSent(true);
      alert('OTP has been logged to backend console!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        otp: passwordData.otp
      });
      alert('Password updated successfully!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '', otp: '' });
      setOtpSent(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentChange = async (field, file) => {
    if (!file) return;

    // Reject PDFs — only JPG/PNG allowed
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setUploadErrors(prev => ({ ...prev, [field]: '❌ PDF not allowed. Please upload a JPG or PNG image.' }));
      // Reset the input
      return;
    }

    // Clear any previous error
    setUploadErrors(prev => ({ ...prev, [field]: null }));
    setUploadingStates(prev => ({ ...prev, [field]: 'loading' }));

    try {
      const secureUrl = await uploadToCloudinary(file);
      
      setFormData(prev => ({
        ...prev,
        documents: {
          ...(prev.documents || {}),
          [field]: secureUrl
        }
      }));
      setUploadingStates(prev => ({ ...prev, [field]: 'success' }));
    } catch (error) {
      console.error(`Error uploading ${field}:`, error);
      setUploadingStates(prev => ({ ...prev, [field]: 'error' }));
      setUploadErrors(prev => ({ ...prev, [field]: `Upload failed: ${error.message}` }));
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setSuccess(false);

    // Check if any uploads are still in progress
    const isStillUploading = Object.values(uploadingStates).some(state => state === 'loading');
    if (isStillUploading) {
      alert("Please wait for all document uploads to complete before saving.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.put('/auth/profile', formData);
      setUser(response.data);
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setUploadingStates({}); // Clear upload states after success
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 lg:py-24 font-sans">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div className="space-y-4 w-full">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest flex items-center gap-2">
                <RiShieldUserLine size={14} className="text-blue-400" />
                {user.role} Member
              </span>
              
              {/* Verification Badge */}
              {user.isVerified ? (
                <span className="bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                  <RiCheckLine size={14} /> Verified Profile
                </span>
              ) : (
                <span className={`text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest flex items-center gap-2 border-2 ${
                  user.verificationStatus === 'rejected' 
                  ? 'bg-red-50 text-red-600 border-red-100' 
                  : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {user.verificationStatus === 'rejected' ? <RiErrorWarningLine size={14} /> : <RiLoader4Line className="animate-spin" size={14} />}
                  {user.verificationStatus === 'rejected' ? 'Rejected' : 'Verification Pending'}
                </span>
              )}

              {success && (
                <span className="flex items-center gap-1.5 text-blue-600 text-[10px] font-black uppercase tracking-widest animate-pulse ml-2">
                  <RiCheckLine size={16} /> Changes Saved Successfully
                </span>
              )}
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[0.9]">
              Member <span className="text-blue-600">Profile.</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">
              Manage your HKCA registration details
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-10 py-5 rounded-4xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-sm ${
                  user.isVerified && user.role !== 'admin'
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <RiEditLine size={18} /> {user.isVerified && user.role !== 'admin' ? 'Update Contact Info' : 'Edit Profile'}
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 lg:flex-none px-8 py-5 border border-slate-200 rounded-4xl font-black text-xs uppercase tracking-[0.2em] text-slate-400 hover:bg-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-4xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 disabled:opacity-50"
                >
                  {loading ? <RiLoader4Line className="animate-spin" size={18} /> : <RiCheckLine size={18} />}
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-[2.5rem] p-4 shadow-xl shadow-slate-200/40 border border-slate-100">
              <div className="flex flex-col gap-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-4 px-6 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${
                      activeTab === tab.id 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-4xl p-12 text-white relative overflow-hidden mt-16 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/20 transition-all duration-700" />
              
              <div className="relative z-10 mb-6">
                {user.documents?.photograph ? (
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-blue-500/30 shadow-2xl shadow-blue-500/20 group-hover:scale-105 transition-transform duration-500">
                    <img 
                      src={user.documents.photograph} 
                      alt={user.username} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-blue-400">
                    <RiShieldUserLine size={32} />
                  </div>
                )}
              </div>

              <h4 className="text-lg font-black leading-tight mb-2 relative z-10">Member Status</h4>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6 relative z-10">Registered since {new Date(user.createdAt).toLocaleDateString()}</p>
              <div className="flex items-center gap-2 relative z-10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Active Account</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {/* Status Alert Banner */}
            {(user.verificationStatus === 'pending' || user.verificationStatus === 'rejected') && (
                <div className={`mb-10 p-8 rounded-[2rem] border flex items-center gap-6 animate-fade-in ${
                user.verificationStatus === 'rejected' 
                ? 'bg-red-50 border-red-100 text-red-900' 
                : 'bg-amber-50 border-amber-100 text-amber-900'
              }`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xl ${
                   user.verificationStatus === 'rejected' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                }`}>
                  <RiInformationLine size={32} />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-black uppercase tracking-tight leading-tight mb-1">
                    {user.verificationStatus === 'rejected' ? 'Profile Verification Rejected' : 'Profile Verification in Progress'}
                  </h4>
                  <p className="text-sm font-bold opacity-70 leading-relaxed">
                    {user.verificationStatus === 'rejected' 
                      ? 'Admin has rejected your profile. Please check your documents and re-submit for review.' 
                      : 'Your profile is currently waiting for Admin verification. You will be able to join events once verified.'}
                  </p>
                  
                  {user.adminMessage && (
                    <div className="mt-4 p-4 bg-white/50 rounded-2xl border border-amber-200">
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Note from Admin:</p>
                      <p className="text-xs font-bold text-amber-900 leading-relaxed">"{user.adminMessage}"</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-2xl shadow-slate-200/40 border border-slate-100 min-h-[600px]">
              
              {activeTab === 'personal' && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField 
                      label="First Name" 
                      value={formData.personalInfo?.firstName} 
                      onChange={(val) => handleNestedChange('personalInfo', 'firstName', val)}
                      readOnly={!isEditing || (user.role !== 'admin' && user.isVerified)}
                      info={user.isVerified ? "Locked after verification" : null}
                    />
                    <InputField 
                      label="Last Name (Optional)" 
                      value={formData.personalInfo?.lastName} 
                      onChange={(val) => handleNestedChange('personalInfo', 'lastName', val)}
                      readOnly={!isEditing || (user.role !== 'admin' && user.isVerified)}
                      info={user.isVerified ? "Locked" : null}
                    />
                    <SelectField 
                      label="Gender" 
                      value={formData.personalInfo?.gender} 
                      onChange={(val) => handleNestedChange('personalInfo', 'gender', val)}
                      options={[
                        { label: 'Male', value: 'Male' },
                        { label: 'Female', value: 'Female' },
                        { label: 'Other', value: 'Other' }
                      ]}
                      readOnly={!isEditing || (user.role !== 'admin' && user.isVerified)}
                      info={user.isVerified ? "Locked" : "Editable"}
                    />
                    {(user.role === 'athlete' || user.role === 'coach' || user.role === 'admin') && (
                        <SelectField 
                            label="Blood Group" 
                            value={formData.personalInfo?.bloodGroup} 
                            onChange={(val) => handleNestedChange('personalInfo', 'bloodGroup', val)}
                            options={[
                                { label: 'A +', value: 'A+' },
                                { label: 'A -', value: 'A-' },
                                { label: 'B +', value: 'B+' },
                                { label: 'B -', value: 'B-' },
                                { label: 'O +', value: 'O+' },
                                { label: 'O -', value: 'O-' },
                                { label: 'AB +', value: 'AB+' },
                                { label: 'AB -', value: 'AB-' },
                                { label: 'Unknown', value: 'Unknown' }
                            ]}
                            readOnly={!isEditing || (user.role !== 'admin' && user.isVerified)}
                            info={user.isVerified ? "Locked" : null}
                        />
                    )}
                    <InputField 
                        label="Birth Date" 
                        type="date"
                        value={formData.personalInfo?.birthDate ? formData.personalInfo.birthDate.split('T')[0] : ''} 
                        onChange={(val) => handleNestedChange('personalInfo', 'birthDate', val)}
                        readOnly={!isEditing || (user.role !== 'admin' && user.isVerified)}
                        info={user.isVerified ? "Locked" : null}
                    />
                    <InputField 
                        label="Aadhaar Number" 
                        value={formData.personalInfo?.aadhaarNumber} 
                        onChange={(val) => handleNestedChange('personalInfo', 'aadhaarNumber', val)}
                        readOnly={!isEditing || (user.role !== 'admin' && user.isVerified)}
                        info={user.isVerified ? "Locked" : null}
                        placeholder="12-digit Aadhaar Number"
                        maxLength={12}
                    />
                    {(user.role === 'athlete' || user.role === 'admin') && (
                      <>
                        <InputField 
                          label="Father's Name" 
                          value={formData.guardianInfo?.fatherName} 
                          onChange={(val) => handleNestedChange('guardianInfo', 'fatherName', val)}
                          readOnly={!isEditing || (user.role !== 'admin' && user.isVerified)}
                          info={user.isVerified ? "Locked" : null}
                        />
                        <InputField 
                          label="Mother's Name" 
                          value={formData.guardianInfo?.motherName} 
                          onChange={(val) => handleNestedChange('guardianInfo', 'motherName', val)}
                          readOnly={!isEditing || (user.role !== 'admin' && user.isVerified)}
                          info={user.isVerified ? "Locked" : null}
                        />
                        <InputField 
                          label="Guardian Name" 
                          value={formData.guardianInfo?.guardianName} 
                          onChange={(val) => handleNestedChange('guardianInfo', 'guardianName', val)}
                          readOnly={!isEditing || (user.role !== 'admin' && user.isVerified)}
                          info={user.isVerified ? "Locked" : null}
                          placeholder="If not Father/Mother"
                        />
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'club' && (
                <div className="space-y-10 animate-in fade-in duration-500">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField 
                      label="Club Name" 
                      value={formData.clubInfo?.clubName} 
                      onChange={(val) => handleNestedChange('clubInfo', 'clubName', val)}
                      readOnly={!isEditing}
                      placeholder="Enter Club Name"
                    />
                    <InputField 
                      label="Contact Person" 
                      value={formData.clubInfo?.contactPerson} 
                      onChange={(val) => handleNestedChange('clubInfo', 'contactPerson', val)}
                      readOnly={!isEditing}
                      placeholder="Full Name of Representative"
                    />
                  </div>
                </div>
              )}


              {activeTab === 'contact' && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-50 pb-10">
                    <InputField 
                      label="Primary Email" 
                      value={formData.contactInfo?.email} 
                      onChange={(val) => handleNestedChange('contactInfo', 'email', val)}
                      readOnly={!isEditing}
                      info="Editable anytime"
                    />
                    <InputField 
                      label="Primary Phone" 
                      value={formData.contactInfo?.phone} 
                      onChange={(val) => handleNestedChange('contactInfo', 'phone', val)}
                      readOnly={!isEditing}
                      info="Editable anytime"
                    />
                  </div>
                  <div className="space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">Residential Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="md:col-span-2">
                        <InputField 
                          label="Address Line 1" 
                          value={formData.contactInfo?.address?.line1} 
                          onChange={(val) => handleAddressChange('line1', val)}
                          readOnly={!isEditing}
                        />
                      </div>
                      <InputField 
                        label="City" 
                        value={formData.contactInfo?.address?.city} 
                        onChange={(val) => handleAddressChange('city', val)}
                        readOnly={!isEditing}
                      />
                      <InputField 
                        label="Pin Code" 
                        value={formData.contactInfo?.address?.pinCode} 
                        onChange={(val) => handleAddressChange('pinCode', val)}
                        readOnly={!isEditing}
                      />
                      <InputField 
                        label="District" 
                        value={formData.contactInfo?.address?.district} 
                        onChange={(val) => handleAddressChange('district', val)}
                        readOnly={!isEditing}
                      />
                      <InputField 
                        label="State" 
                        value={formData.contactInfo?.address?.state} 
                        onChange={(val) => handleAddressChange('state', val)} 
                        readOnly={!isEditing} 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                      <InputField 
                        label="Village" 
                        value={formData.contactInfo?.address?.village} 
                        onChange={(val) => handleAddressChange('village', val)} 
                        readOnly={!isEditing} 
                      />
                      <InputField 
                        label="Post Office" 
                        value={formData.contactInfo?.address?.postOffice} 
                        onChange={(val) => handleAddressChange('postOffice', val)} 
                        readOnly={!isEditing} 
                      />
                    </div>
                  </div>
                </div>
              )}
               {activeTab === 'documents' && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  {!(['photograph', 'aadhaarFront', 'aadhaarBack', 'dobProof'].every(k => formData.documents?.[k])) && (
                  <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl mb-8 flex items-start gap-4">
                    <RiInformationLine size={24} className="text-amber-600 shrink-0 mt-1" />
                    <div>
                      <h4 className="text-amber-900 font-black text-sm uppercase tracking-wider mb-1">Compulsory Documents</h4>
                      <p className="text-[11px] text-amber-700 font-bold leading-relaxed">
                        To join tournaments and be verified, you MUST upload all 4 documents below. 
                        Files must be in <span className="underline font-black text-amber-900">JPG or PNG only</span> — PDFs are not accepted. Maximum size: <span className="underline">2MB</span>.
                      </p>
                    </div>
                  </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(['athlete', 'coach', 'admin', 'user'].includes(user.role) ? [
                      { key: 'photograph', label: 'Member Photograph', required: true },
                      { key: 'aadhaarFront', label: 'Aadhaar Card (Front)', required: true },
                      { key: 'aadhaarBack', label: 'Aadhaar Card (Back)', required: true },
                      { key: 'dobProof', label: 'DOB Proof / DMC', required: true },
                      { key: 'idProof', label: 'ID Proof (PAN/Passport)', required: false },
                      { key: 'addressProof', label: 'Address Proof', required: false },
                      { key: 'signature', label: 'Signature', required: false }
                    ] : []).map((doc) => {
                      const url = formData.documents?.[doc.key];
                      const uploadStatus = uploadingStates[doc.key];
                      
                      return (
                        <div key={doc.key} className={`p-6 rounded-3xl border flex flex-col gap-6 group hover:shadow-xl transition-all duration-500 ${
                          url ? 'bg-white border-slate-100' : 'bg-slate-50 border-blue-100/50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                                 url ? 'bg-emerald-50 text-emerald-500' : 'bg-white text-blue-500'
                               }`}>
                                 {uploadStatus === 'loading' ? (
                                   <RiLoader4Line className="animate-spin" size={24} />
                                 ) : url ? (
                                   <RiCheckLine size={24} />
                                 ) : (
                                   <RiFileTextLine size={24} />
                                 )}
                               </div>
                               <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                   {doc.label} {doc.required && <span className="text-red-500">*</span>}
                                 </p>
                                 <div className="flex items-center gap-2">
                                   <p className="font-bold text-slate-700 text-sm">
                                     {uploadStatus === 'loading' ? 'Uploading...' : 
                                      url ? 'Completed' : 'Missing Requirement'}
                                   </p>
                                 </div>
                               </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {url && (
                                  <a 
                                    href={url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                  >
                                    View
                                  </a>
                                )}
                            </div>
                          </div>

                          {isEditing && !user.isVerified && (
                            <div className="space-y-2">
                              <div className="relative">
                                <input 
                                  type="file"
                                  accept="image/jpeg,image/png"
                                  disabled={uploadStatus === 'loading'}
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                                  onChange={(e) => handleDocumentChange(doc.key, e.target.files[0])}
                                />
                                <div className={`flex items-center justify-center gap-2 py-4 bg-white border-2 border-dashed rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                  uploadStatus === 'loading' ? 'border-blue-200 text-blue-400' :
                                  uploadErrors[doc.key] ? 'border-red-200 text-red-400' :
                                  url ? 'border-slate-100 text-slate-400 hover:border-blue-500 hover:text-blue-600' :
                                  'border-blue-200 text-blue-500 hover:bg-blue-50'
                                }`}>
                                  {uploadStatus === 'loading' ? (
                                    <>
                                      <RiLoader4Line className="animate-spin" size={18} />
                                      Uploading...
                                    </>
                                  ) : (
                                    <>
                                      <RiUploadCloud2Line size={18} />
                                      {url ? 'Update (JPG/PNG)' : 'Upload JPG or PNG'}
                                    </>
                                  )}
                                </div>
                              </div>
                              {uploadErrors[doc.key] && (
                                <p className="text-[10px] font-black text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-xl">
                                  {uploadErrors[doc.key]}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Show other existing documents if any (non-primary) */}
                    {Object.keys(formData.documents || {})
                      .filter(key => !['photograph', 'aadhaarFront', 'aadhaarBack', 'dobProof'].includes(key))
                      .map((key) => {
                      const url = formData.documents?.[key];
                      const uploadStatus = uploadingStates[key];
                      
                      return (
                        <div key={key} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-6 group hover:bg-white hover:shadow-xl transition-all duration-500">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
                                 {uploadStatus === 'loading' ? (
                                   <RiLoader4Line className="animate-spin" size={24} />
                                 ) : (
                                   <RiFileTextLine size={24} />
                                 )}
                               </div>
                               <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
                                 <div className="flex items-center gap-2">
                                   <p className="font-bold text-slate-700 text-sm">
                                     {uploadStatus === 'loading' ? 'Uploading...' : 
                                      uploadStatus === 'success' ? 'Uploaded ✅' :
                                      uploadStatus === 'error' ? 'Upload Failed ❌' :
                                      (url ? 'Registered Document' : 'Not Uploaded')}
                                   </p>
                                 </div>
                               </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {url && typeof url === 'string' && (
                                  <a 
                                    href={url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                  >
                                    View
                                  </a>
                                )}
                                {isEditing && !user.isVerified && !['photograph', 'dobProof', 'idProof', 'addressProof', 'signature'].includes(key) && (
                                    <button 
                                        onClick={() => {
                                            const newDocs = { ...formData.documents };
                                            delete newDocs[key];
                                            setFormData({ ...formData, documents: newDocs });
                                        }}
                                        className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <RiDeleteBinLine size={16} />
                                    </button>
                                )}
                            </div>
                          </div>

                          {isEditing && !user.isVerified && (
                            <div className="relative">
                              <input 
                                type="file" 
                                disabled={uploadStatus === 'loading'}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                                onChange={(e) => handleDocumentChange(key, e.target.files[0])}
                              />
                              <div className={`flex items-center justify-center gap-2 py-4 bg-white border-2 border-dashed rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                uploadStatus === 'loading' ? 'border-blue-200 text-blue-400' :
                                uploadStatus === 'success' ? 'border-green-200 text-green-600' :
                                'border-slate-200 text-slate-400 hover:border-blue-500 hover:text-blue-600'
                              }`}>
                                {uploadStatus === 'loading' ? (
                                  <>
                                    <RiLoader4Line className="animate-spin" size={18} />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <RiUploadCloud2Line size={18} />
                                    {uploadStatus === 'success' ? 'Change Again' : 'Change Document'}
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Empty State for documents tab */}
                    {Object.keys(formData.documents || {}).length === 0 && (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                             <RiFileTextLine className="mx-auto text-slate-200 mb-4" size={48} />
                             <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">No documents uploaded yet</p>
                        </div>
                    )}
                  </div>

                  {/* Add Custom Document Section */}
                  {isEditing && (
                    <div className="mt-12 pt-10 border-t border-slate-100 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <RiUploadCloud2Line size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Add Additional Documents</h4>
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest">UPLOAD ANY OTHER SUPPORTING FILES</p>
                        </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <InputField 
                            label="Document Name" 
                            placeholder="e.g. PAN Card, Medical Certificate..." 
                            value={customDocName}
                            onChange={setCustomDocName}
                            />
                        </div>
                        <div className="sm:w-1/3 pt-6 sm:pt-0">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Upload File</label>
                            <div className="relative">
                            <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={(e) => setCustomDocFile(e.target.files[0])}
                                disabled={!customDocName.trim()}
                            />
                            <div className={`px-6 py-4 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-2 ${
                                !customDocName.trim() ? 'bg-slate-50 border-slate-100 text-slate-300' : 
                                customDocFile ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-blue-100 text-blue-500 hover:border-blue-300'
                            }`}>
                                {uploadingStates['CUSTOM'] === 'loading' ? (
                                <RiLoader4Line className="animate-spin" size={18} />
                                ) : customDocFile ? (
                                <><RiCheckLine size={18} /> {customDocFile.name.slice(0, 10)}...</>
                                ) : (
                                <><RiUploadCloud2Line size={18} /> Select File</>
                            )}
                            </div>
                            </div>
                        </div>
                        <div className="sm:pt-6">
                            <button 
                            onClick={async () => {
                                if (!customDocName.trim() || !customDocFile) return;
                                setUploadingStates(prev => ({ ...prev, ['CUSTOM']: 'loading' }));
                                try {
                                    const url = await uploadToCloudinary(customDocFile);
                                    const docKey = customDocName.toLowerCase().replace(/\s/g, '');
                                    setFormData(prev => ({
                                        ...prev,
                                        documents: { ...(prev.documents || {}), [docKey]: url }
                                    }));
                                    setCustomDocName('');
                                    setCustomDocFile(null);
                                    setUploadingStates({});
                                } catch (err) {
                                    alert('Failed to upload custom document: ' + err.message);
                                }
                            }}
                            disabled={!customDocName.trim() || !customDocFile || uploadingStates['CUSTOM'] === 'loading'}
                            className="h-[60px] px-8 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all disabled:opacity-50"
                            >
                            Add Record
                            </button>
                        </div>
                        </div>
                    </div>
                  )}
                  
                  {!isEditing && (
                    <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100 mt-4">
                      <p className="text-xs font-bold text-blue-600 leading-relaxed text-center">
                        Document updates are currently tracked. To change documents, click "Edit Profile" above.
                      </p>
                    </div>
                  )}
                </div>
               )}

              {activeTab === 'security' && (
                <div className="space-y-12 animate-in fade-in duration-500 max-w-2xl">
                  <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 mb-4">
                    <div className="flex gap-4 items-start">
                      <RiKeyLine className="text-blue-600 shrink-0" size={24} />
                      <div>
                        <h4 className="text-blue-900 font-black text-sm uppercase tracking-wider mb-1">Update Your Security</h4>
                        <p className="text-[11px] text-blue-700 font-bold leading-relaxed">Enter your current password to update immediately. If you've forgotten it, you can request an OTP below.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="relative">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Current Password</label>
                      <div className="relative">
                         <input 
                           type={showOldPass ? "text" : "password"} 
                           className="w-full px-6 py-5 bg-white border border-slate-200 rounded-2xl font-bold shadow-sm outline-none focus:border-blue-500 transition-all pr-16"
                           value={passwordData.oldPassword}
                           onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
                         />
                         <button onClick={() => setShowOldPass(!showOldPass)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                           {showOldPass ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
                         </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="relative">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">New Password</label>
                        <div className="relative">
                          <input 
                            type={showNewPass ? "text" : "password"} 
                            className="w-full px-6 py-5 bg-white border border-slate-200 rounded-2xl font-bold shadow-sm outline-none focus:border-blue-500 transition-all pr-12"
                            value={passwordData.newPassword}
                            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          />
                          <button onClick={() => setShowNewPass(!showNewPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                            {showNewPass ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Confirm New Password</label>
                        <div className="relative">
                          <input 
                            type={showConfirmPass ? "text" : "password"} 
                            className="w-full px-6 py-5 bg-white border border-slate-200 rounded-2xl font-bold shadow-sm outline-none focus:border-blue-500 transition-all pr-12"
                            value={passwordData.confirmNewPassword}
                            onChange={(e) => handlePasswordChange('confirmNewPassword', e.target.value)}
                          />
                          <button onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                            {showConfirmPass ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 space-y-8">
                       <button 
                        onClick={updatePassword}
                        disabled={loading || !passwordData.oldPassword || !passwordData.newPassword}
                        className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.3em] text-xs shadow-xl shadow-slate-500/20 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Update Password Now'}
                      </button>

                      <div className="relative flex items-center justify-center py-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <span className="relative bg-white px-6 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">OR USE OTP VERIFICATION</span>
                      </div>

                      {otpSent ? (
                        <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                          <div className="relative">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-3 ml-1">Verification OTP (Logged in Console)</label>
                            <input 
                              type="text" 
                              placeholder="Enter 6-digit OTP"
                              className="w-full px-6 py-6 bg-blue-50/30 border-2 border-blue-100 rounded-3xl font-black text-2xl tracking-[0.5em] text-center outline-none focus:border-blue-500 transition-all"
                              value={passwordData.otp}
                              onChange={(e) => handlePasswordChange('otp', e.target.value)}
                              maxLength={6}
                            />
                          </div>
                          <button 
                            onClick={updatePassword}
                            disabled={loading || !passwordData.otp}
                            className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-[0.3em] text-xs shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50"
                          >
                            Verify & Update via OTP
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setShowComingSoon(true)}
                          className="w-full py-5 bg-slate-50 border border-slate-100 text-slate-400 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-blue-600 hover:border-blue-100 transition-all active:scale-[0.98]"
                        >
                          Request OTP to Server Console
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'events' && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-1">Your Events History.</h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Manage your active registrations</p>
                    </div>
                  </div>

                  {registrations.length === 0 ? (
                    <div className="p-16 bg-slate-50 rounded-4xl border border-dashed border-slate-200 text-center">
                      <RiCalendarCheckLine className="mx-auto text-slate-200 mb-6" size={60} />
                      <h4 className="text-xl font-bold text-slate-400 mb-2">No Active Registrations</h4>
                      <p className="text-slate-400 text-sm font-medium mb-8">Explore upcoming tournaments and events to join the HKCA journey.</p>
                      <a href="/events" className="inline-block px-10 py-4 bg-white border border-slate-200 rounded-2xl font-black uppercase text-[10px] tracking-widest text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        Browse Events
                      </a>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {registrations.map((reg) => (
                        <div key={reg._id} className="group p-8 bg-slate-50 rounded-4xl border border-slate-100 flex flex-col hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex items-center gap-8 w-full">
                               <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                                 <img 
                                   src={reg.event?.imageUrl} 
                                   alt={reg.event?.title} 
                                   className="w-full h-full object-cover"
                                 />
                               </div>
                               <div>
                                 <div className="flex items-center gap-3 mb-2">
                                   <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg">
                                     {reg.role}
                                   </span>
                                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                     Joined on {new Date(reg.registrationDate).toLocaleDateString()}
                                   </span>
                                 </div>
                                 <h4 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer">
                                   {reg.event?.title || 'Event Name Unavailable'}
                                 </h4>
                                 <p className="text-sm font-bold text-slate-500 mt-1">{reg.event?.location || 'Location Unavailable'}</p>
                               </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center justify-center lg:justify-end w-full gap-3 mt-4 lg:mt-0 xl:gap-4">
                              <div className={`px-4 py-2 border rounded-xl font-bold text-[10px] uppercase tracking-wider text-center min-w-[110px] shadow-sm ${
                                reg.status === 'confirmed' 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                  : reg.status === 'cancelled' 
                                  ? 'bg-red-50/50 text-red-600 border-red-100' 
                                  : 'bg-slate-50 text-slate-500 border-slate-100'
                              }`}>
                                {reg.status || 'Pending'}
                              </div>

                              <a 
                                href={`/events/${reg.event?._id}`}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-[10px] uppercase tracking-wider text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                              >
                                Event Info <RiExternalLinkLine size={14} />
                              </a>

                              {/* Action Buttons: Cancel or Re-apply/Re-book */}
                              {reg.status !== 'confirmed' && reg.status !== 'cancelled' && (
                                <button 
                                  onClick={() => setPayingReg(reg)}
                                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                                >
                                  Pay Now
                                </button>
                              )}
                              {reg.status !== 'cancelled' && reg.event?.registrationDeadline && (new Date() < new Date(reg.event?.registrationDeadline)) && (
                                <button 
                                  onClick={() => {
                                    setSelectedReg(reg);
                                    setShowCancelModal(true);
                                  }}
                                  className="px-5 py-2.5 bg-white border border-red-100 text-red-600 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                >
                                  Cancel Registration
                                </button>
                              )}
                            </div>
                          </div>

                          {reg.status === 'cancelled' && (
                            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="bg-red-50/50 border border-red-100 p-4 rounded-2xl flex-1">
                                <div className="flex items-center gap-2 text-red-600 text-[10px] font-black uppercase tracking-widest mb-1">
                                  <RiInformationLine /> Cancellation Reason
                                </div>
                                <p className="text-sm text-slate-600 font-bold italic">{reg.cancellationReason || 'No reason provided.'}</p>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row gap-3">
                                {reg.allowReapply ? (
                                  <button
                                    onClick={() => handleReapply(reg.event?._id, reg.role)}
                                    disabled={
                                      loading || 
                                      reg.event?.registrationOpen === false ||
                                      (reg.event?.registrationDeadline && new Date() > new Date(reg.event?.registrationDeadline))
                                    }
                                    className="px-8 py-4 bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 shrink-0"
                                  >
                                    {loading ? 'Processing...' : 
                                     (reg.event?.registrationOpen === false || (reg.event?.registrationDeadline && new Date() > new Date(reg.event?.registrationDeadline)))
                                       ? 'Closed'
                                       : 'Fix & Re-Apply'}
                                  </button>
                                ) : (
                                  <a
                                    href={`/events/${reg.event?._id}`}
                                    className="px-8 py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black shadow-xl shadow-slate-900/20 transition-all text-center"
                                  >
                                    Start New Booking
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="mb-12">
                    <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Your Hall of Fame.</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Achievements and accolades recognized by HKCA</p>
                  </div>

                  {(!user.achievements || user.achievements.length === 0) ? (
                    <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                      <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-50">
                        <RiTrophyLine size={48} className="text-slate-200" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-400 mb-2">No Achievements Yet</h4>
                      <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto">Participate in tournaments and events to earn recognition and accolades.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {user.achievements.map((achievement, index) => (
                        <div key={index} className="group relative p-8 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 rounded-[3rem] border border-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.1)] hover:shadow-[0_40px_80px_-30px_rgba(59,130,246,0.2)] transition-all duration-700 hover:-translate-y-2 overflow-hidden flex flex-col min-h-[320px]">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-blue-200/30 transition-all duration-700" />
                          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-50/40 rounded-full blur-3xl -ml-24 -mb-24" />
                          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-600/10 to-transparent rounded-br-[4rem] group-hover:from-blue-600/20 transition-all duration-500" />
                          <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-10">
                              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-amber-900/5 border border-amber-50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-xl shadow-lg shadow-amber-500/20">
                                  <RiTrophyLine size={24} />
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-900 mb-1">Year of Glory</span>
                                <span className="text-sm font-black text-slate-900 px-5 py-2 bg-white rounded-2xl shadow-sm border border-slate-50">{achievement.date}</span>
                              </div>
                            </div>
                            <div className="space-y-4 flex-1">
                              <h4 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 uppercase tracking-tight">{achievement.title}</h4>
                              {achievement.description && (
                                <p className="text-sm font-bold text-slate-500 leading-relaxed opacity-70 line-clamp-3">{achievement.description}</p>
                              )}
                            </div>
                            <div className="mt-10 pt-8 border-t border-slate-100/50 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">OFFICIAL RECOGNITION</span>
                              </div>
                              <div className="relative">
                                <div className="absolute inset-0 bg-red-600/5 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="rotate-[-12deg] border-[3px] border-red-600/30 px-4 py-1.5 rounded-lg text-[11px] font-black uppercase text-red-600/60 select-none group-hover:border-red-600/60 group-hover:text-red-700 transition-all duration-500 transform hover:scale-110 cursor-default shadow-sm backdrop-blur-[2px]">
                                  <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-red-600/20" />
                                  <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-red-600/20" />
                                  {achievement.stamp || 'HKCA'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Self-Add Achievement Form — only when admin has unlocked the profile */}
                  {isEditing && !user.isVerified && (
                    <AchievementAddForm formData={formData} setFormData={setFormData} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* User Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-8 duration-500">
            <div className="p-10 border-b border-slate-50">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
                <RiErrorWarningLine size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Cancel Registration?</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Are you sure you want to cancel your registration for <span className="text-slate-900 font-bold">{selectedReg?.event?.title}</span>?
              </p>
            </div>
            
            <div className="p-10 space-y-6">
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Reason for Cancellation <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows="3"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-red-400 transition-all resize-none"
                  placeholder="Tell us why you are cancelling..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-4 border border-slate-200 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                >
                  Keep Booking
                </button>
                <button 
                  onClick={handleUserCancel}
                  disabled={loading || !cancelReason.trim()}
                  className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-200 transition-all disabled:opacity-50"
                >
                  {loading ? <RiLoader4Line className="animate-spin inline mr-2" /> : 'Confirm Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {payingReg && payingReg.event && (
        <EventRegistrationModal 
          event={payingReg.event}
          initialRole={payingReg.role}
          onClose={() => setPayingReg(null)}
          onDashboardUpdate={() => {
            fetchRegistrations();
            setPayingReg(null);
          }}
        />
      )}

      {/* Coming Soon Modal for Password Reset */}
      {showComingSoon && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-8 duration-500 flex flex-col max-h-[90vh]">
            <div className="p-6 sm:p-10 border-b border-slate-50 shrink-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 text-blue-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6">
                <RiInformationLine size={28} className="sm:hidden" />
                <RiInformationLine size={32} className="hidden sm:block" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">Coming Soon!</h2>
              <p className="text-slate-500 font-bold text-sm sm:text-base leading-relaxed">
                Self-service OTP verification is currently under maintenance.
              </p>
            </div>
            
            <div className="p-6 sm:p-10 space-y-6 overflow-y-auto custom-scrollbar">
              <div className="bg-blue-50/50 p-5 sm:p-8 rounded-[2rem] border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-12 -mt-12" />
                
                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4 flex items-center gap-2">
                   INSTRUCTIONS TO CHANGE PASSWORD
                </h4>
                
                <ul className="space-y-5">
                  <li className="flex gap-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white shadow-sm border border-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-black text-[10px] sm:text-xs">
                      1
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed">
                      Take a clear photo of the <span className="text-slate-900 underline decoration-blue-500 decoration-2 underline-offset-4">FRONT SIDE</span> of your Aadhaar Card.
                    </p>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white shadow-sm border border-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-black text-[10px] sm:text-xs">
                      2
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed">
                      Go to the <Link to="/contact" className="text-blue-600 hover:text-blue-800 underline underline-offset-4 transition-colors">Contact Form</Link> and raise a query.
                    </p>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white shadow-sm border border-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-black text-[10px] sm:text-xs">
                      3
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed">
                      Attach the Aadhaar photo and mention your request.
                    </p>
                  </li>
                </ul>

                <div className="mt-6 p-4 bg-white/60 rounded-2xl border border-blue-50 shadow-sm">
                   <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 text-center leading-loose">
                    HKCA Admin will verify your identity and update your password shortly.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setShowComingSoon(false)}
                className="w-full py-4 sm:py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
