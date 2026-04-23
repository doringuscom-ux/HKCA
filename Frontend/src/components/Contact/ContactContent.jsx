import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiMailLine, 
  RiPhoneLine, 
  RiMapPinLine, 
  RiSendPlaneLine,
  RiCheckDoubleLine,
  RiLoader4Line,
  RiAlertLine
} from 'react-icons/ri';
import { ScrollReveal } from '../common/Animations';
import api from '../../api/apiConfig';

const ContactContent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const contactInfo = [
    {
      icon: <RiMapPinLine size={24} />,
      title: "Our Headquarters",
      details: ["SCO 19, Sector 11,", "Panchkula, Haryana 134109"],
      color: "bg-blue-500"
    },
    {
      icon: <RiPhoneLine size={24} />,
      title: "Call Us",
      details: ["+91 93063-70669"],
      color: "bg-indigo-500"
    },
    {
      icon: <RiMailLine size={24} />,
      title: "Email Support",
      details: ["hkca.org.in@gmail.com"],
      color: "bg-cyan-500"
    },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setFileError('Only JPG and PNG images are allowed.');
        setSelectedFile(null);
        e.target.value = null;
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setFileError('File size must be strictly smaller than 2MB.');
        setSelectedFile(null);
        e.target.value = null;
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setFileError('');

    try {
      let documentUrl = '';

      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);
        
        const uploadRes = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        documentUrl = uploadRes.data.secure_url;
      }

      await api.post('/admin/inquiries', { ...formData, documentUrl });
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSelectedFile(null);
    } catch (err) {
      console.error('Submission error:', err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-slate-50 py-16 md:py-24 px-6 sm:px-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Contact info cards */}
          <div className="lg:col-span-5 space-y-8">
            <ScrollReveal variant="slideInLeft">
               <div className="mb-10 text-center lg:text-left">
                  <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[11px] mb-3 block">Reach Out</span>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
                    Connect with <br className="hidden lg:block"/> the Team
                  </h2>
               </div>

               <div className="grid grid-cols-1 gap-6">
                 {contactInfo.map((info, idx) => (
                    <div key={idx} className="flex items-start gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                       <div className={`${info.color} text-white p-4 rounded-2xl shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform`}>
                          {info.icon}
                       </div>
                       <div>
                          <h4 className="font-black text-slate-900 uppercase text-[12px] tracking-widest mb-2 opacity-60">
                            {info.title}
                          </h4>
                          {info.details.map((line, i) => (
                             <p key={i} className="text-slate-700 font-bold text-[15px] leading-relaxed">
                               {line}
                             </p>
                          ))}
                       </div>
                    </div>
                 ))}
               </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ScrollReveal variant="slideInRight">
               <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-50 relative overflow-hidden group min-h-[600px] flex flex-col justify-center">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/[0.03] rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000" />
                  
                  <AnimatePresence mode="wait">
                    {status === 'success' ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-10"
                      >
                         <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                            <RiCheckDoubleLine size={40} />
                         </div>
                         <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Message Sent!</h3>
                         <p className="text-slate-500 font-bold mb-8">Thank you for Reaching out. Our team will get back to you shortly.</p>
                         <button 
                           onClick={() => setStatus(null)}
                           className="text-blue-600 font-black uppercase tracking-widest text-xs hover:underline decoration-2"
                         >
                           Send another inquiry
                         </button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-8 flex items-center gap-3">
                          Send us a Message
                          <div className="h-1 w-12 bg-blue-600 rounded-full" />
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 italic">Full Name</label>
                               <input 
                                 required
                                 type="text" 
                                 value={formData.name}
                                 onChange={(e) => setFormData({...formData, name: e.target.value})}
                                 className="w-full bg-slate-50 border border-blue-100 px-6 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all placeholder:text-slate-400 font-bold text-slate-900" 
                                 placeholder="Jaswinder Singh"
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 italic">Email Address</label>
                               <input 
                                 required
                                 type="email" 
                                 value={formData.email}
                                 onChange={(e) => setFormData({...formData, email: e.target.value})}
                                 className="w-full bg-slate-50 border border-blue-100 px-6 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all placeholder:text-slate-400 font-bold text-slate-900" 
                                 placeholder="jaswinder@gmail.com"
                               />
                            </div>
                          </div>

                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 italic">Subject</label>
                             <input 
                               required
                               type="text" 
                               value={formData.subject}
                               onChange={(e) => setFormData({...formData, subject: e.target.value})}
                               className="w-full bg-slate-50 border border-blue-100 px-6 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all placeholder:text-slate-400 font-bold text-slate-900" 
                               placeholder="Inquiry about Event Participation"
                             />
                          </div>

                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 italic">Your Message</label>
                             <textarea 
                               required
                               rows={5} 
                               value={formData.message}
                               onChange={(e) => setFormData({...formData, message: e.target.value})}
                               className="w-full bg-slate-50 border border-blue-100 px-6 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all placeholder:text-slate-400 font-bold resize-none text-slate-900" 
                               placeholder="Write your message here..."
                             />
                          </div>

                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 italic">Attach Document (JPG/PNG, Max 2MB) [Optional]</label>
                             <input 
                               type="file" 
                               accept=".jpg,.jpeg,.png"
                               onChange={handleFileChange}
                               className="w-full bg-slate-50 border border-blue-100 px-6 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-slate-700 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                             />
                             {fileError && <p className="text-red-500 text-xs font-bold pl-4">{fileError}</p>}
                             {selectedFile && <p className="text-green-600 text-xs font-bold pl-4">Ready to upload: {selectedFile.name}</p>}
                          </div>

                          {status === 'error' && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm font-bold border border-red-100">
                               <RiAlertLine size={18} />
                               Failed to send message. Please try again.
                            </div>
                          )}

                          <button 
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                             {loading ? (
                               <RiLoader4Line className="animate-spin" size={20} />
                             ) : (
                               <>Send Message <RiSendPlaneLine size={18} /></>
                             )}
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactContent;
