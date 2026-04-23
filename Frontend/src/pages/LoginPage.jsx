import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  RiUserLine, 
  RiLockLine, 
  RiEyeLine, 
  RiEyeOffLine, 
  RiArrowRightLine,
  RiInformationLine
} from 'react-icons/ri';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');
    
    const result = await login(username, password);
    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center py-20 px-6 font-sans">
      <div className="max-w-[1100px] w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">
        
        {/* Left Side: Brand/Visual */}
        <div className="hidden lg:flex bg-slate-900 p-16 flex-col justify-between relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-[100px] -ml-32 -mb-32" />
          
          <div className="relative z-10">
            <Link to="/" className="text-white text-2xl font-black tracking-tighter flex items-center gap-2 mb-20">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">H</span>
              </div>
              HKCA PORTAL.
            </Link>
            
            <div className="space-y-6">
              <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
                Welcome Back to the <span className="text-blue-500 text-glow-blue">Association.</span>
              </h1>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                Access your member dashboard, manage your registration details, and stay updated with upcoming events.
              </p>
            </div>
          </div>
          
          <div className="relative z-10 pt-10 border-t border-slate-800">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="avatar" />
                  </div>
                ))}
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Joined by 2,000+ athletes</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 md:p-16 lg:p-24 flex flex-col justify-center">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Sign In.</h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4 animate-shake">
              <RiInformationLine className="text-red-500 shrink-0 mt-0.5" size={20} />
              <p className="text-red-600 text-xs font-bold leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {/* Username Input */}
              <div className="relative group">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1 group-focus-within:text-blue-600 transition-colors">Username or Email</label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                    <RiUserLine size={20} />
                  </div>
                  <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="flex justify-between items-end mb-3 ml-1">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-blue-600 transition-colors">Password</label>
                  <Link to="/forgot-password" size={14} className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 hover:text-blue-700 transition-colors cursor-pointer">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                    <RiLockLine size={20} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-16 pr-16 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-slate-200 hover:bg-black hover:-translate-y-1 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In to Portal <RiArrowRightLine size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-xs font-bold">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 transition-colors">Join the Association</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
