import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';
import { 
  RiShieldUserLine, 
  RiMailLine,
  RiTimeLine,
  RiLoader4Line,
  RiPhoneLine,
  RiInformationLine,
  RiFileList3Line,
  RiCloseLine,
  RiUserLine,
  RiMapPinLine,
  RiParentLine,
  RiFileTextLine,
  RiDownload2Line,
  RiExternalLinkLine,
  RiDeleteBinLine,
  RiCheckDoubleLine,
  RiCloseCircleLine,
  RiErrorWarningLine,
  RiFilter3Line,
  RiSearchLine,
  RiKeyLine,
  RiTrophyLine,
  RiAddLine,
  RiEditLine
} from 'react-icons/ri';

const DetailSection = ({ title, children, icon: Icon }) => (
  <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
        <Icon size={18} />
      </div>
      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">{title}</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

const EditableItem = ({ label, section, field, value, isEditingFull, tempData, handleFieldChange, type = "text" }) => {
  // Format date for the HTML5 date input (YYYY-MM-DD)
  const displayValue = (type === 'date' && tempData[section]?.[field]) 
    ? new Date(tempData[section][field]).toISOString().split('T')[0] 
    : tempData[section]?.[field] || '';

  const handleInputFilter = (e) => {
    // Filter non-numeric input for phone, aadhaar, and pin fields
    const isNumericField = label.toLowerCase().includes('phone') || 
                           label.toLowerCase().includes('aadhaar') || 
                           label.toLowerCase().includes('pin code');
    if (isNumericField) {
      const filtered = e.target.value.replace(/\D/g, '');
      if (filtered !== e.target.value) {
        e.target.value = filtered;
      }
    }
  };

  const getMaxLength = () => {
    if (label.toLowerCase().includes('aadhaar')) return 12;
    if (label.toLowerCase().includes('phone')) return 10;
    if (label.toLowerCase().includes('pin code')) return 6;
    return undefined;
  };

  return (
    <div className="space-y-1.5 animate-in fade-in duration-300">
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">{label}</p>
      {isEditingFull ? (
          <input 
            type={type}
            className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all shadow-sm"
            value={displayValue}
            maxLength={getMaxLength()}
            onInput={handleInputFilter}
            onChange={(e) => handleFieldChange(section, field, e.target.value)}
          />
      ) : (
          <p className="text-sm font-bold text-slate-800 bg-slate-50/50 px-4 py-2.5 rounded-xl border border-transparent">{value || 'N/A'}</p>
      )}
    </div>
  );
};

const UserProfileModal = ({ 
  user, 
  onClose, 
  setUsers, 
  users, 
  setSelectedUser,
  adminNote,
  setAdminNote,
  sendingNote,
  setSendingNote,
  handleVerifyUser
}) => {
  if (!user) return null;

  // Use internal state for editing within the modal to keep ManageUsers clean
  const [isEditingFull, setIsEditingFull] = React.useState(false);
  const [tempData, setTempData] = React.useState(user);
  const [savingEdits, setSavingEdits] = React.useState(false);
  const [editingAchIdx, setEditingAchIdx] = React.useState(null);

  const handleFieldChange = (section, field, value) => {
      setTempData(prev => ({
          ...prev,
          [section]: { ...prev[section], [field]: value }
      }));
  };

  const handleLocalAddressChange = (field, value) => {
      setTempData(prev => ({
          ...prev,
          contactInfo: {
              ...prev.contactInfo,
              address: {
                  ...prev.contactInfo?.address,
                  [field]: value
              }
          }
      }));
  };

  const handleSaveFullEdits = async () => {
      setSavingEdits(true);
      try {
          const res = await api.put(`/admin/users/${user._id}/profile`, tempData);
          setUsers(users.map(u => u._id === user._id ? res.data.user : u));
          setSelectedUser(res.data.user);
          setIsEditingFull(false);
          alert('User profile updated successfully by admin');
      } catch (err) {
          alert('Failed to save profile changes: ' + (err.response?.data?.message || err.message));
      } finally {
          setSavingEdits(false);
      }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-gray-50 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 ring-4 ring-blue-50">
                <RiUserLine size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">Member Profile</h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 rounded-md text-slate-500 italic">ID: {user._id}</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                        user.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                        user.role === 'athlete' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                        {user.role}
                    </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isEditingFull ? (
                  <button 
                      onClick={() => setIsEditingFull(true)}
                      className="px-6 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100"
                  >
                      Edit Details
                  </button>
              ) : (
                  <div className="flex items-center gap-2">
                       <button 
                          onClick={handleSaveFullEdits}
                          disabled={savingEdits}
                          className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                      >
                          {savingEdits ? 'Saving...' : 'Save Edits'}
                      </button>
                      <button 
                          onClick={() => { setIsEditingFull(false); setTempData(user); }}
                          className="px-6 py-2.5 bg-slate-100 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all shadow-sm"
                      >
                          Cancel
                      </button>
                  </div>
              )}
              <button 
                  onClick={onClose}
                  className="p-3 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl transition-colors group"
              >
                  <RiCloseLine size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* 1. Basic / Personal Info */}
          {(user.role !== 'club') && (
            <DetailSection title="Personal Details" icon={RiUserLine}>
              <EditableItem label="First Name" section="personalInfo" field="firstName" value={user.personalInfo?.firstName} isEditingFull={isEditingFull} tempData={tempData} handleFieldChange={handleFieldChange} />
              <EditableItem label="Middle Name" section="personalInfo" field="middleName" value={user.personalInfo?.middleName} isEditingFull={isEditingFull} tempData={tempData} handleFieldChange={handleFieldChange} />
              <EditableItem label="Last Name" section="personalInfo" field="lastName" value={user.personalInfo?.lastName} isEditingFull={isEditingFull} tempData={tempData} handleFieldChange={handleFieldChange} />
              <EditableItem label="Gender" section="personalInfo" field="gender" value={user.personalInfo?.gender} isEditingFull={isEditingFull} tempData={tempData} handleFieldChange={handleFieldChange} />
              <EditableItem label="Birth Date" section="personalInfo" field="birthDate" value={user.personalInfo?.birthDate ? new Date(user.personalInfo.birthDate).toLocaleDateString() : null} isEditingFull={isEditingFull} tempData={tempData} handleFieldChange={handleFieldChange} type="date" />
              <EditableItem label="Blood Group" section="personalInfo" field="bloodGroup" value={user.personalInfo?.bloodGroup} isEditingFull={isEditingFull} tempData={tempData} handleFieldChange={handleFieldChange} />
              <EditableItem label="Aadhaar Number" section="personalInfo" field="aadhaarNumber" value={user.personalInfo?.aadhaarNumber} isEditingFull={isEditingFull} tempData={tempData} handleFieldChange={handleFieldChange} />
              {user.role === 'athlete' && (
                <>
                  <EditableItem label="Father's Name" section="guardianInfo" field="fatherName" value={user.guardianInfo?.fatherName} isEditingFull={isEditingFull} tempData={tempData} handleFieldChange={handleFieldChange} />
                  <EditableItem label="Mother's Name" section="guardianInfo" field="motherName" value={user.guardianInfo?.motherName} isEditingFull={isEditingFull} tempData={tempData} handleFieldChange={handleFieldChange} />
                </>
              )}
            </DetailSection>
          )}

          {/* 2. Club Info - FOR CLUB ROLE */}
          {user.role === 'club' && (
            <DetailSection title="Club Information" icon={RiShieldUserLine}>
              <EditableItem label="Club Name" section="clubInfo" field="clubName" value={user.clubInfo?.clubName} isEditingFull={isEditingFull} tempData={tempData} handleFieldChange={handleFieldChange} />
              <EditableItem label="Contact Person" section="clubInfo" field="contactPerson" value={user.clubInfo?.contactPerson} isEditingFull={isEditingFull} tempData={tempData} handleFieldChange={handleFieldChange} />
            </DetailSection>
          )}


          {/* 4. Contact & Address */}
          <DetailSection title="Contact & Address" icon={RiMapPinLine}>
            <EditableItem label="Email Address" section="contactInfo" field="email" value={user.email || user.contactInfo?.email} isEditingFull={isEditingFull} tempData={tempData} handleFieldChange={handleFieldChange} />
            <EditableItem label="Phone Number" section="contactInfo" field="phone" value={user.contactInfo?.phone || user.personalInfo?.phone} isEditingFull={isEditingFull} tempData={tempData} handleFieldChange={handleFieldChange} />
            <div className="col-span-full border-t border-gray-50 pt-4 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 col-span-full">Permanent Address</p>
              <div className="space-y-4 col-span-full">
                 {isEditingFull ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">Address Line 1</p>
                             <input 
                                  type="text"
                                  className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all shadow-sm"
                                  value={tempData.contactInfo?.address?.line1 || ''}
                                  onChange={(e) => handleLocalAddressChange('line1', e.target.value)}
                             />
                         </div>
                         <div className="space-y-1.5">
                             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">City</p>
                             <input 
                                  type="text"
                                  className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all shadow-sm"
                                  value={tempData.contactInfo?.address?.city || ''}
                                  onChange={(e) => handleLocalAddressChange('city', e.target.value)}
                             />
                         </div>
                         <div className="space-y-1.5">
                             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">State</p>
                             <input 
                                  type="text"
                                  className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all shadow-sm"
                                  value={tempData.contactInfo?.address?.state || ''}
                                  onChange={(e) => handleLocalAddressChange('state', e.target.value)}
                             />
                         </div>
                         <div className="space-y-1.5">
                             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">Pin Code</p>
                             <input 
                                  type="text"
                                  className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all shadow-sm"
                                  value={tempData.contactInfo?.address?.pinCode || ''}
                                  onChange={(e) => handleLocalAddressChange('pinCode', e.target.value)}
                             />
                         </div>
                     </div>
                 ) : (
                  <p className="text-sm font-bold text-gray-700 leading-relaxed bg-slate-50/50 p-4 rounded-xl">
                    {[
                      user.contactInfo?.address?.line1,
                      user.contactInfo?.address?.city,
                      user.contactInfo?.address?.state,
                      user.contactInfo?.address?.pinCode
                    ].filter(Boolean).join(', ') || 'Address not provided'}
                  </p>
                 )}
              </div>
            </div>
          </DetailSection>

          {/* 5. Documents */}
          <DetailSection title="Registration Documents" icon={RiFileTextLine}>
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.documents && Object.entries(user.documents).map(([key, url]) => (
                url && (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-blue-200 hover:bg-white transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                        <RiFileTextLine size={16} />
                      </div>
                      <p className="text-xs font-black uppercase tracking-widest text-gray-600">{key.replace(/([A-Z])/g, ' $1')}</p>
                    </div>
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 hover:bg-blue-600 hover:text-white text-blue-600 rounded-lg transition-all"
                      title="View Document"
                    >
                      <RiExternalLinkLine size={18} />
                    </a>
                  </div>
                )
              ))}
              {(!user.documents || Object.values(user.documents).every(v => !v)) && (
                  <p className="text-xs font-bold text-gray-400 italic">No documents uploaded</p>
              )}
            </div>
          </DetailSection>
          
          {/* 6. Achievements Section */}
          <DetailSection title="Achievements" icon={RiTrophyLine}>
            <div className="col-span-full space-y-4">
              {(tempData.achievements || []).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(tempData.achievements || []).map((achievement, index) => (
                    <div key={index} className={`bg-slate-50 rounded-2xl p-4 border transition-all ${editingAchIdx === index ? 'border-blue-400 ring-4 ring-blue-500/5 bg-white' : 'border-slate-100'} flex flex-col gap-4 group`}>
                      {editingAchIdx === index ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">Title</p>
                              <input 
                                type="text"
                                className="w-full px-4 py-2 bg-white border border-blue-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-400 transition-all"
                                value={achievement.title}
                                onChange={(e) => {
                                  const newAchs = [...tempData.achievements];
                                  newAchs[index].title = e.target.value;
                                  setTempData({ ...tempData, achievements: newAchs });
                                }}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">Date</p>
                              <input 
                                type="text"
                                className="w-full px-4 py-2 bg-white border border-blue-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-400 transition-all"
                                value={achievement.date}
                                onChange={(e) => {
                                  const newAchs = [...tempData.achievements];
                                  newAchs[index].date = e.target.value;
                                  setTempData({ ...tempData, achievements: newAchs });
                                }}
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-1.5">
                              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">Description</p>
                              <textarea 
                                className="w-full px-4 py-2 bg-white border border-blue-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-400 transition-all min-h-[60px]"
                                value={achievement.description || ''}
                                onChange={(e) => {
                                  const newAchs = [...tempData.achievements];
                                  newAchs[index].description = e.target.value;
                                  setTempData({ ...tempData, achievements: newAchs });
                                }}
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-1.5">
                              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">Stamp Text</p>
                              <input 
                                type="text"
                                className="w-full px-4 py-2 bg-white border border-blue-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-400 transition-all"
                                value={achievement.stamp || ''}
                                onChange={(e) => {
                                  const newAchs = [...tempData.achievements];
                                  newAchs[index].stamp = e.target.value;
                                  setTempData({ ...tempData, achievements: newAchs });
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => setEditingAchIdx(null)}
                              className="px-4 py-2 bg-slate-100 text-slate-500 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">{achievement.date}</p>
                                {achievement.stamp && (
                                  <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-red-50 text-red-500 rounded border border-red-100">{achievement.stamp}</span>
                                )}
                              </div>
                              <h4 className="text-sm font-bold text-slate-800">{achievement.title}</h4>
                              {achievement.description && (
                                <p className="text-xs text-slate-500 font-medium">{achievement.description}</p>
                              )}
                            </div>
                            {isEditingFull && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => setEditingAchIdx(index)}
                                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                  title="Edit Achievement"
                                >
                                  <RiEditLine size={16} />
                                </button>
                                <button 
                                  onClick={() => {
                                    const newAchievements = [...tempData.achievements];
                                    newAchievements.splice(index, 1);
                                    setTempData({ ...tempData, achievements: newAchievements });
                                  }}
                                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                  title="Delete Achievement"
                                >
                                  <RiDeleteBinLine size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs font-bold text-slate-400 italic">No achievements recorded yet</p>
                </div>
              )}

              {isEditingFull && (
                <div className="mt-4 p-6 bg-blue-50/30 rounded-2xl border border-blue-100/50 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-800">Add New Achievement</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">Achievement Title</p>
                      <input 
                        type="text"
                        id="new-ach-title"
                        placeholder="e.g. State Championship Winner"
                        className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">Date / Timeframe</p>
                      <input 
                        type="text"
                        id="new-ach-date"
                        placeholder="e.g. March 2024 or Last Month"
                        className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all shadow-sm"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">Description (Optional)</p>
                      <textarea 
                        id="new-ach-desc"
                        placeholder="Additional details about the achievement..."
                        className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all shadow-sm min-h-[80px]"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">Stamp Text (Optional - Defaults to HKCA)</p>
                      <input 
                        type="text"
                        id="new-ach-stamp"
                        placeholder="e.g. OFFICIAL, VERIFIED, WINNER"
                        className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all shadow-sm"
                      />
                    </div>
                    <button 
                      onClick={() => {
                        const titleEl = document.getElementById('new-ach-title');
                        const dateEl = document.getElementById('new-ach-date');
                        const descEl = document.getElementById('new-ach-desc');
                        const stampEl = document.getElementById('new-ach-stamp');
                        
                        if (!titleEl.value || !dateEl.value) {
                          alert('Title and Date are required');
                          return;
                        }

                        const newAchievement = {
                          title: titleEl.value,
                          date: dateEl.value,
                          description: descEl.value,
                          stamp: stampEl.value
                        };

                        setTempData({
                          ...tempData,
                          achievements: [...(tempData.achievements || []), newAchievement]
                        });

                        titleEl.value = '';
                        dateEl.value = '';
                        descEl.value = '';
                        stampEl.value = '';
                      }}
                      className="sm:col-span-2 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    >
                      <RiAddLine size={16} /> Add Achievement
                    </button>
                  </div>
                </div>
              )}
            </div>
          </DetailSection>

          {/* 7. Admin Action Center */}
          <div className="bg-blue-50/50 rounded-3xl border-2 border-dashed border-blue-200 p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20">
                <RiErrorWarningLine size={18} />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Admin Action Center</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Send Note to User (e.g. Correction Required)</label>
                <textarea 
                  className="w-full p-4 bg-white border border-blue-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all min-h-[100px]"
                  placeholder="Enter message for the user... (e.g. Your birth date proof is blurry, please re-upload)"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-4">
                 <button 
                  onClick={async () => {
                      if (!adminNote) return alert('Please enter a note');
                      setSendingNote(true);
                      try {
                          await api.put(`/admin/users/${user._id}/message`, { message: adminNote });
                          setUsers(users.map(u => u._id === user._id ? { ...u, adminMessage: adminNote } : u));
                          // Note: We don't need to manually update local selectedUser as it's passed from Parent
                          alert('Note sent to user profile');
                      } catch (err) {
                          alert('Failed to send note');
                      } finally {
                          setSendingNote(false);
                      }
                  }}
                  disabled={sendingNote || !adminNote}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 overflow-hidden disabled:opacity-50"
                >
                  {sendingNote ? <RiLoader4Line size={16} className="animate-spin" /> : <RiMailLine size={16} />}
                  Send Note Only
                </button>

                <button 
                  onClick={async () => {
                      if (!window.confirm('This will unlock the profile so the user can edit their verified details. Continue?')) return;
                      setSendingNote(true);
                      try {
                          await api.put(`/admin/users/${user._id}/message`, { message: adminNote, unlock: true });
                          const updatedUserForList = { ...user, adminMessage: adminNote, isVerified: false, verificationStatus: 'pending' };
                          setUsers(users.map(u => u._id === user._id ? updatedUserForList : u));
                          alert('Profile unlocked and note sent');
                      } catch (err) {
                          alert('Failed to unlock profile');
                      } finally {
                          setSendingNote(false);
                      }
                  }}
                  disabled={sendingNote}
                  className="px-8 py-3 bg-amber-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center gap-2 overflow-hidden disabled:opacity-50 shadow-lg shadow-amber-500/20"
                >
                  {sendingNote ? <RiLoader4Line size={16} className="animate-spin" /> : <RiKeyLine size={16} />}
                  Unlock for Correction
                </button>
              </div>
            </div>

            {user.adminMessage && (
                <div className="p-4 bg-white rounded-2xl border border-blue-50 group/note relative">
                   <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-black uppercase text-blue-600 mb-1">Current Active Note:</p>
                        <p className="text-xs font-bold text-slate-700 italic">"{user.adminMessage}"</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover/note:opacity-100 transition-opacity">
                         <button 
                            onClick={() => setAdminNote(user.adminMessage)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit Note"
                         >
                            <RiEditLine size={16} />
                         </button>
                         <button 
                            onClick={async () => {
                                if (!window.confirm('Clear this note?')) return;
                                setSendingNote(true);
                                try {
                                    await api.put(`/admin/users/${user._id}/message`, { message: "" });
                                    setUsers(users.map(u => u._id === user._id ? { ...u, adminMessage: "" } : u));
                                    alert('Note cleared');
                                } catch (err) {
                                    alert('Failed to clear note');
                                } finally {
                                    setSendingNote(false);
                                }
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Note"
                         >
                            <RiDeleteBinLine size={16} />
                         </button>
                      </div>
                   </div>
                </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             {user.verificationStatus !== 'verified' && (
               <button 
                  onClick={async () => {
                      await handleVerifyUser(user._id, 'verified');
                      onClose();
                  }}
                  className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2"
               >
                  <RiCheckDoubleLine size={18} />
                  Approve Profile
               </button>
             )}
             {user.verificationStatus !== 'rejected' && (
               <button 
                  onClick={async () => {
                      if (!window.confirm('Are you sure you want to REJECT this profile?')) return;
                      await handleVerifyUser(user._id, 'rejected');
                      onClose();
                  }}
                  className="px-8 py-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
               >
                  <RiCloseCircleLine size={18} />
                  Reject Profile
               </button>
             )}
          </div>
          <button 
              onClick={onClose}
              className="px-10 py-4 bg-slate-900 border border-slate-800 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg w-full sm:w-auto"
          >
              Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [sendingNote, setSendingNote] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, verified, rejected
  const [searchQuery, setSearchQuery] = useState('');
  const [updateLoading, setUpdateLoading] = useState(null);
  const [isEditingData, setIsEditingData] = useState(false);
  const [localUserData, setLocalUserData] = useState(null);
  const [savingEdits, setSavingEdits] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdateLoading(userId);
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to update role: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdateLoading(null);
    }
  };

  const handleVerifyUser = async (userId, status) => {
    setUpdateLoading(userId);
    try {
      await api.put(`/admin/users/${userId}/verify`, { status });
      setUsers(users.map(u => u._id === userId ? { ...u, verificationStatus: status, isVerified: status === 'verified' } : u));
    } catch (err) {
      alert('Failed to update verification status: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdateLoading(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to PERMANENTLY delete this user and all their registrations? This action cannot be undone.')) {
      return;
    }
    setUpdateLoading(userId);
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      alert('User deleted successfully');
    } catch (err) {
      alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdateLoading(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'pending' && user.verificationStatus === 'pending') ||
                         (filterStatus === 'verified' && user.isVerified) ||
                         (filterStatus === 'rejected' && user.verificationStatus === 'rejected');
    
    const searchStr = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
                         user.username?.toLowerCase().includes(searchStr) ||
                         user.email?.toLowerCase().includes(searchStr) ||
                         user.personalInfo?.firstName?.toLowerCase().includes(searchStr) ||
                         user.personalInfo?.lastName?.toLowerCase().includes(searchStr);
                         
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RiLoader4Line className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-gray-500 font-bold animate-pulse">Loading Users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Section */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
              <RiShieldUserLine size={32} />
            </div>
            Manage Users
          </h1>
          <p className="text-gray-500 mt-3 text-lg font-medium max-w-xl">
            Control user roles and access permissions across the HKCA platform.
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap gap-4">
          <div className="bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100 flex items-center gap-4 shadow-inner">
            <div className="text-blue-600 font-black text-3xl">{users.length}</div>
            <div className="text-sm font-bold text-blue-800 uppercase tracking-wider leading-tight">Total<br/>Registered</div>
          </div>
          <div className="bg-amber-50 px-6 py-4 rounded-2xl border border-amber-100 flex items-center gap-4 shadow-inner">
            <div className="text-amber-600 font-black text-3xl">{users.filter(u => u.verificationStatus === 'pending').length}</div>
            <div className="text-sm font-bold text-amber-800 uppercase tracking-wider leading-tight">Pending<br/>Approval</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full relative">
          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, email, or username..." 
            className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100 w-full md:w-auto">
          <RiFilter3Line className="ml-3 text-gray-400" size={20} />
          {['all', 'pending', 'verified', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filterStatus === status 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          <h2 className="text-lg font-black text-gray-900 tracking-tight">System Users</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] border-b border-gray-100">
                <th className="px-6 py-5 whitespace-nowrap">User Profile</th>
                <th className="px-6 py-5 whitespace-nowrap">Contact Info</th>
                <th className="px-6 py-5 whitespace-nowrap">Verification</th>
                <th className="px-6 py-5 whitespace-nowrap">System Role</th>
                <th className="px-6 py-5 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 overflow-hidden shadow-sm">
                        {user.documents?.photograph ? (
                          <img src={user.documents.photograph} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-blue-600 font-black text-xl">
                            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-base">{user.username}</div>
                        {user.personalInfo?.firstName && (
                          <div className="text-xs text-gray-500 font-medium">
                            {user.personalInfo.firstName} {user.personalInfo.lastName}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <RiMailLine size={14} className="text-slate-400" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                        <RiPhoneLine size={14} className="text-slate-400" />
                        {user.contactInfo?.phone || user.personalInfo?.phone || 'No Phone'}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    {user.isVerified ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        <RiCheckDoubleLine size={14} /> Verified
                      </span>
                    ) : (
                      <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                        user.verificationStatus === 'rejected' 
                        ? 'text-red-600 bg-red-50 border-red-100' 
                        : 'text-amber-600 bg-amber-50 border-amber-100'
                      }`}>
                        {user.verificationStatus === 'rejected' ? <RiCloseCircleLine size={14} /> : <RiTimeLine className="animate-pulse" size={14} />}
                        {user.verificationStatus === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      disabled={updateLoading === user._id}
                      className={`text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2.5 outline-none cursor-pointer border transition-all ${
                        user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        user.role === 'athlete' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        user.role === 'coach' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        user.role === 'club' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        'bg-gray-50 text-gray-600 border-gray-200'
                      }`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="athlete">Athlete</option>
                      <option value="coach">Coach</option>
                      <option value="club">Club</option>
                    </select>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                        onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-gray-100"
                        title="View Profile"
                      >
                        <RiFileList3Line size={18} />
                      </button>

                      {user.verificationStatus === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleVerifyUser(user._id, 'verified')}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all border border-emerald-100"
                            title="Verify Profile"
                          >
                            <RiCheckDoubleLine size={18} />
                          </button>
                          <button 
                            onClick={() => handleVerifyUser(user._id, 'rejected')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all border border-red-100"
                            title="Reject Profile"
                          >
                            <RiCloseCircleLine size={18} />
                          </button>
                        </>
                      )}

                      <button 
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-gray-100"
                        title="Delete User"
                      >
                        <RiDeleteBinLine size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="text-center py-20 bg-gray-50 m-6 rounded-2xl border border-dashed border-gray-200">
              <RiInformationLine className="mx-auto text-gray-400 mb-3" size={32} />
              <h3 className="text-gray-900 font-bold">No users registered yet</h3>
            </div>
          )}
        </div>
      </div>
      {/* User Profile Modal */}
      {isModalOpen && (
        <UserProfileModal 
          user={selectedUser} 
          onClose={() => setIsModalOpen(false)} 
          setUsers={setUsers}
          users={users}
          setSelectedUser={setSelectedUser}
          adminNote={adminNote}
          setAdminNote={setAdminNote}
          sendingNote={sendingNote}
          setSendingNote={setSendingNote}
          handleVerifyUser={handleVerifyUser}
        />
      )}
    </div>
  );
};

export default ManageUsers;
