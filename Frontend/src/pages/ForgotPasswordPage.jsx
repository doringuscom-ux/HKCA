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

        {/* Right Side: Instructions */}
        <div className="p-8 sm:p-12 md:p-16 lg:p-24 flex flex-col justify-center">
          <div className="mb-8 sm:mb-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 text-blue-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8">
              <RiShieldFlashLine size={28} className="sm:hidden" />
              <RiShieldFlashLine size={32} className="hidden sm:block" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 tracking-tight">
              Coming <span className="text-blue-600">Soon.</span>
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
              The self-service reset portal is under maintenance
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-slate-50 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all duration-700" />
              
              <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-blue-600 mb-6 flex items-center gap-2">
                <RiInformationLine size={16} /> How to Reset Password:
              </h3>
              
              <ul className="space-y-5 sm:space-y-6">
                <li className="flex gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0 text-blue-600 font-black text-[10px] sm:text-xs">
                    1
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed">
                    Take a clear, well-lit photo of the <span className="text-slate-900 underline decoration-blue-500 decoration-2 underline-offset-4">FRONT SIDE</span> of your Aadhaar Card.
                  </p>
                </li>
                <li className="flex gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0 text-blue-600 font-black text-[10px] sm:text-xs">
                    2
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed">
                    Navigate to our <Link to="/contact" className="text-blue-600 hover:text-blue-800 underline underline-offset-4 transition-colors">Contact Form</Link> and raise a security query.
                  </p>
                </li>
                <li className="flex gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0 text-blue-600 font-black text-[10px] sm:text-xs">
                    3
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed">
                    Attach the photo and mention your username. Admin will verify and reset your password.
                  </p>
                </li>
              </ul>
            </div>

            <Link 
              to="/login"
              className="w-full py-5 sm:py-6 bg-slate-900 text-white rounded-2xl sm:rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs shadow-2xl shadow-slate-200 hover:bg-black hover:-translate-y-1 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <RiArrowLeftLine size={18} /> Return to Login
            </Link>
          </div>

          <div className="mt-8 sm:mt-12 pt-8 sm:pt-10 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest leading-loose">
              HKCA SECURITY PROTOCOL • VERIFICATION REQUIRED
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
