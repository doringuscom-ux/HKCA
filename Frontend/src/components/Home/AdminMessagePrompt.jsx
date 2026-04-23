import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  RiNotification3Line, 
  RiCloseLine, 
  RiCursorLine 
} from 'react-icons/ri';

const AdminMessagePrompt = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal if user has an admin message and hasn't dismissed it in this session
    if (user?.adminMessage && !sessionStorage.getItem('dismissedAdminMsg')) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500); // Slight delay for better UX
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('dismissedAdminMsg', 'true');
  };

  const handleOpenProfile = () => {
    navigate('/profile');
    handleClose();
  };

  if (!isOpen || !user?.adminMessage) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-[400px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-visible animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
        >
          <RiCloseLine size={20} />
        </button>

        {/* Purple Header Area with Bell */}
        <div className="flex flex-col items-center pt-10 pb-6">
          <div className="relative">
            <div className="w-28 h-28 bg-[#6366f1] rounded-full flex items-center justify-center shadow-xl shadow-indigo-200 ring-8 ring-white">
              <div className="relative">
                <RiNotification3Line size={56} className="text-[#fbbf24] animate-bounce" />
                {/* Notification Badge */}
                <div className="absolute top-0 -right-2 w-7 h-7 bg-[#ef4444] text-white text-[12px] font-black rounded-full flex items-center justify-center border-[3px] border-white shadow-sm">
                  1
                </div>
              </div>
            </div>
            {/* Animated Pulses */}
            <div className="absolute -left-8 top-12 w-6 h-6 border-2 border-indigo-200 rounded-full opacity-40 animate-ping" />
            <div className="absolute -right-6 top-6 w-4 h-4 border-2 border-indigo-100 rounded-full opacity-30 animate-ping delay-700" />
          </div>
        </div>

        {/* Content Area */}
        <div className="px-10 pb-12 text-center space-y-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Reminder</h2>
          
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100">
            <p className="text-slate-600 font-bold text-sm leading-relaxed italic">
              "{user.adminMessage}"
            </p>
          </div>

          <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest pt-2">
            Action Required in Profile
          </p>

          <button 
            onClick={handleOpenProfile}
            className="w-full mt-4 bg-[#fabf24] hover:bg-[#f59e0b] text-white py-5 rounded-3xl font-black text-xl tracking-tight transition-all duration-300 shadow-lg shadow-amber-200 flex items-center justify-center gap-3 group active:scale-95"
          >
            Open
            <RiCursorLine size={24} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMessagePrompt;
