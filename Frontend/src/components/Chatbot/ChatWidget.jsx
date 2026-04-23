import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiMessage3Line, 
  RiCloseLine, 
  RiSendPlane2Fill, 
  RiRobot2Line,
  RiArrowRightLine,
  RiCustomerService2Line
} from 'react-icons/ri';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SUGGESTIONS = [
  { label: 'About HKCA', query: 'What is HKCA?' },
  { label: 'Event Details', query: 'Give me event details' },
  { label: 'How to Register?', query: 'How to register?' },
  { label: 'President Message', query: 'Who is the President?' }
];

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    { 
      role: 'bot', 
      text: 'Hello! I am your HKCA Assistant. Please select a question below or type your query.', 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      showSuggestions: true 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSend = async (userQuery) => {
    if (userQuery === 'redirect:/contact') {
      setIsOpen(false);
      navigate('/contact');
      return;
    }

    const textToSubmit = typeof userQuery === 'string' ? userQuery : message;
    if (!textToSubmit.trim()) return;

    const userMsg = { 
      role: 'user', 
      text: textToSubmit, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setChat(prev => [...prev, userMsg]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await axios.post('https://hkca-1.onrender.com/api/chat', { message: textToSubmit });

      let finalOptions = response.data.options;
      
      // Auto-append follow-up actions if no dynamic options were provided (except for fallbacks/greetings)
      if (!finalOptions && response.data.intent !== 'fallback' && response.data.intent !== 'greetings.hello') {
         finalOptions = [
             { label: 'Start Again', query: 'Hi' },
             { label: 'Contact Us', query: 'redirect:/contact' }
         ];
      }

      const botMsg = { 
        role: 'bot', 
        text: response.data.answer, 
        isFallback: response.data.intent === 'fallback',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: finalOptions || null
      };
      setChat(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = { role: 'bot', text: 'Connection issue. Please check back later.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setChat(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-[350px] sm:w-[420px] h-[550px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#0f172a] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg border border-blue-400/20">
                  <RiRobot2Line size={26} />
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-tight text-sm">HKCA Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] text-blue-200 uppercase tracking-widest font-black">AI Powered</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <RiCloseLine size={24} />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/50"
            >
              {chat.map((msg, idx) => (
                <div key={idx} className="space-y-3">
                  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-3xl text-[13px] leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'
                    }`}>
                      {msg.text}
                      
                      {msg.isFallback && (
                        <a 
                          href="/contact" 
                          className="mt-3 flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all text-center justify-center"
                        >
                          <RiCustomerService2Line size={16} /> Contact Page
                        </a>
                      )}
                      
                      <p className={`text-[9px] mt-2 font-bold uppercase tracking-widest ${msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>

                  {msg.showSuggestions && (
                    <div className="grid grid-cols-1 gap-2 pl-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quick Actions</p>
                       {SUGGESTIONS.map((s, i) => (
                         <button
                           key={i}
                           onClick={() => handleSend(s.query)}
                           className="text-left bg-white hover:bg-blue-50 border border-slate-100 text-slate-700 px-4 py-3 rounded-2xl text-[12px] font-bold transition-all flex items-center justify-between group shadow-sm"
                         >
                           {s.label}
                           <RiArrowRightLine className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                         </button>
                       ))}
                    </div>
                  )}

                  {msg.options && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                       {msg.options.map((opt, i) => (
                         <button
                           key={i}
                           onClick={() => handleSend(opt.query)}
                           className="text-center bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100 px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm"
                         >
                           {opt.label}
                         </button>
                       ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-3xl rounded-bl-none border border-slate-100 shadow-sm flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-duration:0.8s]" />
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
              className="p-5 bg-white border-t border-slate-100 flex gap-3"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 bg-slate-100 border-none rounded-2xl px-5 py-3 text-[13px] font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400"
              />
              <button 
                type="submit"
                disabled={!message.trim()}
                className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              >
                <RiSendPlane2Fill size={22} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-2xl hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all duration-300 group overflow-hidden relative"
      >
        <AnimatePresence mode='wait'>
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <RiCloseLine size={32} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <RiMessage3Line size={32} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};

export default ChatWidget;
