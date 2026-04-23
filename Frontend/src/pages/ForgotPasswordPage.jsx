import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  RiMailLine, 
  RiLockPasswordLine, 
  RiEyeLine, 
  RiEyeOffLine, 
  RiArrowRightLine,
  RiArrowLeftLine,
  RiInformationLine,
  RiShieldFlashLine
} from 'react-icons/ri';
import api from '../api/apiConfig';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
  const [identity, setIdentity] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!identity) {
      setError('Please enter your username or email');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/forgot-password-request', { identity });
      setStep(2);
      setSuccess('OTP has been logged to the server console!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/forgot-password-reset', { identity, otp, newPassword });
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center py-20 px-6 font-sans">
      <div className="max-w-[1100px] w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">
        
        {/* Left Side: Visual */}
        <div className="hidden lg:flex bg-blue-600 p-16 flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="relative z-10">
            <Link to="/login" className="text-white/80 hover:text-white flex items-center gap-2 font-black uppercase tracking-widest text-xs transition-colors mb-20">
              <RiArrowLeftLine size={18} /> Back to Sign In
            </Link>
            
            <div className="space-y-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-10">
                <RiShieldFlashLine size={32} />
              </div>
              <h1 className="text-5xl font-black leading-[1.1] tracking-tight">
                Account <span className="text-blue-200">Recovery.</span>
              </h1>
              <p className="text-blue-100 text-lg font-medium leading-relaxed max-w-md">
                Don't worry, even champions forget things. We'll help you get back to your dashboard in no time.
              </p>
            </div>
          </div>
          
          <div className="relative z-10 pt-10 border-t border-white/10">
            <p className="text-blue-100/60 text-[10px] font-black uppercase tracking-[0.2em]">HKCA Security Protocol</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-16 lg:p-24 flex flex-col justify-center">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              {step === 1 ? 'Forgot Password?' : 'Set New Password.'}
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
              {step === 1 ? 'Step 1: Identify your account' : 'Step 2: Enter OTP and update'}
            </p>
          </div>

          {(error || success) && (
            <div className={`mb-8 p-5 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2 ${error ? 'bg-red-50 border border-red-100' : 'bg-emerald-50 border border-emerald-100'}`}>
              <RiInformationLine className={error ? 'text-red-500' : 'text-emerald-500'} size={20} />
              <p className={`text-xs font-bold leading-relaxed ${error ? 'text-red-600' : 'text-emerald-600'}`}>
                {error || success}
              </p>
            </div>
          )}

          {step === 1 ? (
             <form onSubmit={handleRequestOTP} className="space-y-8">
               <div className="relative group">
                 <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1 group-focus-within:text-blue-600 transition-colors">Username or Email</label>
                 <div className="relative">
                   <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                     <RiMailLine size={20} />
                   </div>
                   <input 
                     type="text"
                     value={identity}
                     onChange={(e) => setIdentity(e.target.value)}
                     className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all text-lg"
                     placeholder="yourname@gmail.com"
                   />
                 </div>
               </div>

               <button 
                 type="submit"
                 disabled={loading}
                 className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-slate-200 hover:bg-black hover:-translate-y-1 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
               >
                 {loading ? 'Requesting...' : 'Request Reset OTP'} <RiArrowRightLine size={18} />
               </button>
             </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="relative group">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-3 ml-1">Verification OTP</label>
                <input 
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full px-5 py-5 bg-blue-50/50 border-2 border-blue-100 rounded-2xl font-black text-2xl tracking-[0.5em] text-center text-slate-900 outline-none focus:border-blue-600 transition-all"
                  placeholder="000000"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">New Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-6 pr-12 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all font-mono"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-500 transition-colors"
                    >
                      {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                    </button>
                  </div>
                </div>
                <div className="relative group">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Confirm Password</label>
                  <input 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all font-mono"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-emerald-500 text-white rounded-3xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-emerald-100 hover:bg-emerald-600 hover:-translate-y-1 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'} <RiArrowRightLine size={18} />
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors py-2"
              >
                Resend OTP / Use Different Account
              </button>
            </form>
          )}

          <div className="mt-12 pt-10 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-xs font-bold italic">
              Wait, I remember my password!{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 transition-colors non-italic">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
