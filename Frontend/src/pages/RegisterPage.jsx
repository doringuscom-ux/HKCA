import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  RiUserLine, 
  RiClipboardLine, 
  RiShieldCheckLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCloseLine,
  RiEyeLine,
  RiEyeOffLine,
  RiLockLine,
  RiLoader4Line,
  RiMoneyDollarCircleLine,
  RiQrCodeLine,
  RiBankCardLine
} from 'react-icons/ri';
import api from '../api/apiConfig';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(1); // 1 = Account, 2 = Personal, 3 = Review
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '', 
    role: 'athlete',
    personalInfo: {
      firstName: '',
      lastName: '',
      gender: '',
      birthDate: '',
    }
  });

  const [registrationFees, setRegistrationFees] = useState({ athlete: 0, coach: 0, club: 0 });
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' or 'offline'
  const [regCode, setRegCode] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Fetch Registration Fees
  React.useEffect(() => {
    const fetchFees = async () => {
      try {
        const { data } = await api.get('/admin/settings/registration-fees');
        setRegistrationFees(data);
      } catch (err) {
        console.error('Error fetching fees:', err);
      }
    };
    fetchFees();
  }, []);

  const steps = [
    { id: 1, title: 'Account', icon: RiUserLine },
    { id: 2, title: 'Information', icon: RiClipboardLine },
    { id: 3, title: 'Review', icon: RiShieldCheckLine },
    { id: 4, title: 'Payment', icon: RiMoneyDollarCircleLine },
  ];

  const handleInputChange = (section, field, value) => {
    if (section === 'root') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    }
  };

  const [errors, setErrors] = useState({});

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.username || formData.username.length < 3) newErrors.username = true;
      if (!formData.email || !formData.email.includes('@')) newErrors.email = true;
      if (!formData.password || formData.password.length < 6) newErrors.password = true;
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = true;
      
      const allowedRoles = ['athlete', 'coach', 'club'];
      if (!formData.role || !allowedRoles.includes(formData.role)) {
        newErrors.role = 'Please select a valid role';
      }
    } else if (step === 2) {
      if (!formData.personalInfo.firstName) newErrors.firstName = true;
      if (!formData.personalInfo.lastName) newErrors.lastName = true;
      if (!formData.personalInfo.gender) newErrors.gender = true;
      if (!formData.personalInfo.birthDate) newErrors.birthDate = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2)) return;
    
    setIsSubmitting(true);
    try {
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        personalInfo: formData.personalInfo,
        paymentDetails,
        registrationCode: regCode,
        isRegistered: true
      };

      const result = await register(registrationData);
      if (result.success) {
        navigate('/profile');
      } else {
        alert(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] pt-24 pb-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto px-4">
        {/* Dynamic Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Join the <span className="text-blue-500">HKCA</span> Portal
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto leading-relaxed">
            Quick 2-minute registration. Complete your full profile later to join major events.
          </p>
        </div>

        <div className="bg-[#161b22] rounded-[2.5rem] p-1 shadow-2xl border border-slate-800/50">
          {isModalOpen && (
            <div className="p-8 md:p-12">
              {/* Progress Indicator */}
              <div className="flex justify-between items-center mb-16 relative">
                 {/* Progress Line */}
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-800 -translate-y-1/2 z-0" />
                <div 
                  className="absolute top-1/2 left-0 h-[2px] bg-blue-500 -translate-y-1/2 z-0 transition-all duration-700 ease-out" 
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
                
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${
                        currentStep === step.id ? 'bg-blue-600 text-white scale-110 shadow-blue-500/20' : 
                        currentStep > step.id ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}>
                        {currentStep > step.id ? <RiShieldCheckLine size={20} /> : <Icon size={20} />}
                      </div>
                      <span className={`absolute -bottom-8 whitespace-nowrap text-[8px] font-black uppercase tracking-widest transition-colors duration-500 ${
                        currentStep === step.id ? 'text-blue-400' : 'text-slate-500'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Form Content */}
              <div className="mt-20 min-h-[400px]">
                {/* --- Step 1: Account Setup --- */}
                {currentStep === 1 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Username</label>
                        <div className="relative group">
                          <RiUserLine className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                          <input 
                            type="text" 
                            placeholder="johndoe123"
                            className={`w-full bg-[#0d1117] border ${errors.username ? 'border-red-500' : 'border-slate-800'} text-white pl-12 pr-6 py-5 rounded-3xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold`}
                            onChange={(e) => handleInputChange('root', 'username', e.target.value)}
                            value={formData.username}
                          />
                        </div>
                        {errors.username && <p className="text-red-500 text-[10px] font-bold uppercase ml-1">Min 3 characters required</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Email Address</label>
                        <input 
                          type="email" 
                          placeholder="john@example.com"
                          className={`w-full bg-[#0d1117] border ${errors.email ? 'border-red-500' : 'border-slate-800'} text-white px-6 py-5 rounded-3xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold`}
                          onChange={(e) => handleInputChange('root', 'email', e.target.value)}
                          value={formData.email}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2 relative">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Password</label>
                        <div className="relative group">
                          <RiLockLine className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                          <input 
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`w-full bg-[#0d1117] border ${errors.password ? 'border-red-500' : 'border-slate-800'} text-white pl-12 pr-14 py-5 rounded-3xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold`}
                            onChange={(e) => handleInputChange('root', 'password', e.target.value)}
                            value={formData.password}
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                          >
                            {showPassword ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 relative">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Confirm Password</label>
                        <input 
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`w-full bg-[#0d1117] border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-800'} text-white px-6 py-5 rounded-3xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold`}
                          onChange={(e) => handleInputChange('root', 'confirmPassword', e.target.value)}
                          value={formData.confirmPassword}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Select Role</label>
                      <select
                        className={`w-full bg-[#0d1117] border ${errors.role ? 'border-red-500' : 'border-slate-800'} text-white px-6 py-5 rounded-3xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold`}
                        onChange={(e) => handleInputChange('root', 'role', e.target.value)}
                        value={formData.role}
                      >
                        <option value="athlete">Athlete</option>
                        <option value="coach">Coach</option>
                        <option value="club">Club</option>
                      </select>
                      {errors.role && <p className="text-red-500 text-[10px] font-bold uppercase ml-1">{errors.role}</p>}
                    </div>
                  </div>
                )}

                {/* --- Step 2: Basic Information --- */}
                {currentStep === 2 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">First Name</label>
                        <input 
                          type="text" 
                          placeholder="John" 
                          className={`w-full bg-[#0d1117] border ${errors.firstName ? 'border-red-500' : 'border-slate-800'} text-white px-6 py-5 rounded-3xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold`}
                          onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                          value={formData.personalInfo.firstName}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Last Name</label>
                        <input 
                          type="text" 
                          placeholder="Doe" 
                          className={`w-full bg-[#0d1117] border ${errors.lastName ? 'border-red-500' : 'border-slate-800'} text-white px-6 py-5 rounded-3xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold`}
                          onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                          value={formData.personalInfo.lastName}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Gender</label>
                        <div className="flex gap-4">
                          {['Male', 'Female', 'Other'].map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => handleInputChange('personalInfo', 'gender', g)}
                              className={`flex-1 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all ${
                                formData.personalInfo.gender === g 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Date of Birth</label>
                        <input 
                          type="date" 
                          className={`w-full bg-[#0d1117] border ${errors.birthDate ? 'border-red-500' : 'border-slate-800'} text-white px-6 py-5 rounded-3xl outline-none transition-all font-bold`}
                          onChange={(e) => handleInputChange('personalInfo', 'birthDate', e.target.value)}
                          value={formData.personalInfo.birthDate}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* --- Step 3: Final Review --- */}
                {currentStep === 3 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="bg-blue-500/5 rounded-4xl p-10 border border-blue-500/10 backdrop-blur-3xl">
                      <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                        <RiShieldCheckLine className="text-blue-500" /> Final Review
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                        <div className="space-y-4">
                           <p className="text-slate-500 uppercase text-[10px] font-black tracking-widest">Account Details</p>
                           <p className="text-white font-bold"><span className="text-slate-600">Username:</span> {formData.username}</p>
                           <p className="text-white font-bold"><span className="text-slate-600">Email:</span> {formData.email}</p>
                           <p className="text-white font-bold"><span className="text-slate-600">Role:</span> <span className="capitalize">{formData.role}</span></p>
                        </div>
                        <div className="space-y-4">
                           <p className="text-slate-500 uppercase text-[10px] font-black tracking-widest">Profile Details</p>
                           <p className="text-white font-bold"><span className="text-slate-600">Name:</span> {formData.personalInfo.firstName} {formData.personalInfo.lastName}</p>
                           <p className="text-white font-bold"><span className="text-slate-600">Gender:</span> {formData.personalInfo.gender}</p>
                           <p className="text-white font-bold"><span className="text-slate-600">Birth:</span> {formData.personalInfo.birthDate}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shrink-0">
                            <RiShieldCheckLine size={24} />
                        </div>
                        <p className="text-emerald-500 font-bold text-xs uppercase tracking-widest leading-relaxed">
                            I confirm that my details are accurate. I can complete my full profile later.
                        </p>
                    </div>
                  </div>
                )}

                {/* --- Step 4: Payment & Verification --- */}
                {currentStep === 4 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="bg-slate-900/50 rounded-4xl p-10 border border-slate-800 backdrop-blur-3xl">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                        <div>
                          <h3 className="text-2xl font-black text-white mb-2">Registration Fee</h3>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Selected Role: <span className="text-blue-500">{formData.role}</span></p>
                        </div>
                        <div className="text-4xl font-black text-white bg-blue-500/10 px-8 py-4 rounded-3xl border border-blue-500/20">
                          ₹{registrationFees[formData.role] || 0}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('online')}
                          className={`flex items-center gap-4 p-6 rounded-3xl border transition-all ${
                            paymentMethod === 'online' 
                            ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-500/20' 
                            : 'bg-[#0d1117] border-slate-800 text-slate-500 hover:border-slate-700'
                          }`}
                        >
                          <RiBankCardLine size={24} />
                          <div className="text-left">
                            <p className="font-black text-xs uppercase tracking-widest">Pay Online</p>
                            <p className="text-[10px] opacity-60">Credit/Debit Card, UPI, Netbanking</p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('offline')}
                          className={`flex items-center gap-4 p-6 rounded-3xl border transition-all ${
                            paymentMethod === 'offline' 
                            ? 'bg-emerald-600 border-emerald-400 text-white shadow-xl shadow-emerald-500/20' 
                            : 'bg-[#0d1117] border-slate-800 text-slate-500 hover:border-slate-700'
                          }`}
                        >
                          <RiQrCodeLine size={24} />
                          <div className="text-left">
                            <p className="font-black text-xs uppercase tracking-widest">Offline Code</p>
                            <p className="text-[10px] opacity-60">Enter code for cash payments</p>
                          </div>
                        </button>
                      </div>

                      {paymentMethod === 'offline' && (
                        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Registration Code</label>
                          <input 
                            type="text" 
                            placeholder="ENTER CODE" 
                            className="w-full bg-[#0d1117] border border-slate-800 text-white px-8 py-5 rounded-3xl outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all font-black text-center tracking-[0.5em] uppercase"
                            value={regCode}
                            onChange={(e) => setRegCode(e.target.value)}
                          />
                          <p className="text-[10px] text-slate-500 text-center font-medium">Please enter the code provided by the HKCA Admin for your email: <span className="text-slate-300">{formData.email}</span></p>
                        </div>
                      )}

                      {paymentMethod === 'online' && !paymentDetails && (
                        <div className="mt-8 text-center animate-in fade-in slide-in-from-top-2">
                           <button
                            type="button"
                            onClick={async () => {
                              try {
                                setIsSubmitting(true);
                                const { data } = await api.post('/payment/create-registration-order', {
                                  role: formData.role,
                                  email: formData.email
                                });

                                const options = {
                                  key: data.keyId,
                                  amount: data.amount,
                                  currency: "INR",
                                  name: "HKCA Portal",
                                  description: `Registration Fee for ${formData.role}`,
                                  order_id: data.orderId,
                                  handler: function (response) {
                                    setPaymentDetails(response);
                                  },
                                  prefill: {
                                    name: `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`,
                                    email: formData.email,
                                  },
                                  theme: {
                                    color: "#2563eb",
                                  },
                                };

                                const rzp = new window.Razorpay(options);
                                rzp.open();
                              } catch (err) {
                                alert(err.response?.data?.message || 'Error creating payment order');
                              } finally {
                                setIsSubmitting(false);
                              }
                            }}
                            className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/20"
                           >
                             Initialize Payment
                           </button>
                        </div>
                      )}

                      {paymentMethod === 'online' && paymentDetails && (
                        <div className="mt-8 flex items-center gap-4 bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20 animate-in zoom-in-95">
                           <RiShieldCheckLine className="text-emerald-500" size={32} />
                           <div>
                             <p className="text-emerald-500 font-black text-xs uppercase tracking-widest">Payment Verified</p>
                             <p className="text-emerald-500/70 text-[10px] font-bold">Transaction ID: {paymentDetails.razorpay_payment_id}</p>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* --- Navigation Buttons --- */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-16 gap-6">
                  {currentStep > 1 ? (
                    <button 
                      onClick={handlePrev}
                      className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white/5 border border-slate-800 text-slate-400 rounded-4xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all shadow-sm"
                    >
                      <RiArrowLeftLine /> Back
                    </button>
                  ) : <div className="hidden sm:block"></div>}
                  
                  <button 
                    onClick={handleNext}
                    disabled={isSubmitting || (currentStep === 4 && paymentMethod === 'online' && !paymentDetails && registrationFees[formData.role] > 0)}
                    className={`w-full sm:w-auto flex items-center justify-center gap-4 px-16 py-6 rounded-4xl font-black text-[13px] uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95 group ${
                        currentStep === 4 ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                    } text-white ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <RiLoader4Line className="animate-spin text-white" /> {currentStep === 4 ? 'Finalizing...' : 'Processing...'}
                      </>
                    ) : (
                      <>
                        {currentStep === 4 ? 'Complete Registration' : 'Continue'} <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
