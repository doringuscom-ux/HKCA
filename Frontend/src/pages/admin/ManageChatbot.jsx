import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  RiRobotLine, 
  RiRefreshLine, 
  RiAddLine, 
  RiDeleteBinLine, 
  RiHistoryLine, 
  RiBookOpenLine,
  RiCheckLine,
  RiInformationLine,
  RiLoader4Line,
  RiChat1Line,
  RiShieldCheckLine,
  RiEditLine,
  RiEyeLine
} from 'react-icons/ri';

const CHATBOT_API = 'http://localhost:5005/api';

const ManageChatbot = () => {
  const [activeTab, setActiveTab] = useState('knowledge');
  const [knowledge, setKnowledge] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  
  // Form State
  const [showModal, setShowModal] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [formData, setFormData] = useState({
    intent: '',
    category: 'core',
    utterances: '',
    answers: ''
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'knowledge') {
        const res = await axios.get(`${CHATBOT_API}/knowledge`);
        setKnowledge(res.data);
      } else {
        const res = await axios.get(`${CHATBOT_API}/history`);
        setHistory(res.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await axios.post(`${CHATBOT_API}/sync`);
      alert('AI Re-training completed successfully!');
    } catch (err) {
      alert('Sync failed. Is the chatbot server running?');
    } finally {
      setSyncing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        utterances: formData.utterances.split('\n').filter(u => u.trim()),
        answers: formData.answers.split('\n').filter(a => a.trim())
      };
      await axios.post(`${CHATBOT_API}/knowledge`, payload);
      setShowModal(false);
      setFormData({ intent: '', category: 'core', utterances: '', answers: '' });
      fetchData();
    } catch (err) {
      alert('Error saving knowledge');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this intent?')) return;
    try {
      await axios.delete(`${CHATBOT_API}/knowledge/${id}`);
      fetchData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg shadow-blue-200">
                <RiRobotLine size={24} />
             </div>
             <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Chatbot <span className="text-blue-600">Training.</span></h1>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest pl-12">Train your AI with human-friendly questions & answers</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSync}
            disabled={syncing}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg ${
              syncing 
                ? 'bg-emerald-50 text-emerald-600 cursor-not-allowed' 
                : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200 hover:shadow-emerald-300'
            }`}
          >
            {syncing ? <RiLoader4Line className="animate-spin" size={16} /> : <RiRefreshLine size={16} />}
            {syncing ? 'Updating Brain...' : 'Publish to Website'}
          </button>
          
          <button
            onClick={() => {
               setFormData({ intent: '', category: 'core', utterances: '', answers: '' });
               setIsViewOnly(false);
               setShowModal(true);
            }}
            className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all"
          >
            <RiAddLine size={16} /> Add Knowledge
          </button>
        </div>
      </div>

      {/* Stats / Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 flex items-center justify-between group hover:border-blue-200 transition-all">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Knowledge Base</p>
            <h3 className="text-4xl font-black text-gray-900">{knowledge.length} <span className="text-sm font-bold text-gray-400">Intents</span></h3>
          </div>
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
             <RiBookOpenLine size={28} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 flex items-center justify-between group hover:border-emerald-200 transition-all">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Response Rate</p>
            <h3 className="text-4xl font-black text-gray-900">100% <span className="text-sm font-bold text-emerald-500">Active</span></h3>
          </div>
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
             <RiShieldCheckLine size={28} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 flex items-center justify-between group hover:border-purple-200 transition-all">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Questions</p>
            <h3 className="text-4xl font-black text-gray-900">{history.length} <span className="text-sm font-bold text-gray-400">Asked</span></h3>
          </div>
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
             <RiChat1Line size={28} />
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-50">
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`flex-1 py-8 px-6 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
              activeTab === 'knowledge' ? 'bg-blue-50 text-blue-600 border-b-4 border-blue-600' : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            <RiBookOpenLine size={18} /> Knowledge Library
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-8 px-6 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
              activeTab === 'history' ? 'bg-blue-50 text-blue-600 border-b-4 border-blue-600' : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            <RiHistoryLine size={18} /> What Users are Asking
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'knowledge' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Topic & Group</th>
                    <th className="py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">What User might ask</th>
                    <th className="py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">How Bot will reply</th>
                    <th className="py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {knowledge.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-8 pl-4">
                        <span className="bg-gray-900 text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest mb-2 inline-block shadow-sm">
                          {item.category}
                        </span>
                        <h4 className="font-bold text-gray-800 text-sm truncate max-w-[150px]">{item.intent}</h4>
                      </td>
                      <td className="py-8">
                        <div className="flex flex-wrap gap-1.5 max-w-sm">
                          {item.utterances.slice(0, 3).map((u, i) => (
                            <span key={i} className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md">"{u}"</span>
                          ))}
                          {item.utterances.length > 3 && <span className="text-[10px] font-black text-gray-400">+{item.utterances.length - 3} more</span>}
                        </div>
                      </td>
                      <td className="py-8">
                        <p className="text-xs text-gray-500 font-medium italic line-clamp-2 max-w-md">
                          "{item.answers[0]}"
                        </p>
                      </td>
                      <td className="py-8 text-right pr-4">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                              onClick={() => {
                                setFormData({
                                  intent: item.intent,
                                  category: item.category,
                                  utterances: item.utterances.join('\n'),
                                  answers: item.answers.join('\n')
                                });
                                setIsViewOnly(true);
                                setShowModal(true);
                              }}
                              className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                              title="View Knowledge"
                           >
                              <RiEyeLine size={20} />
                           </button>
                           <button 
                              onClick={() => {
                                setFormData({
                                  intent: item.intent,
                                  category: item.category,
                                  utterances: item.utterances.join('\n'),
                                  answers: item.answers.join('\n')
                                });
                                setIsViewOnly(false);
                                setShowModal(true);
                              }}
                              className="p-3 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
                              title="Edit Knowledge"
                           >
                              <RiEditLine size={20} />
                           </button>
                           <button 
                              onClick={() => handleDelete(item._id)}
                              className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                              title="Delete Knowledge"
                           >
                              <RiDeleteBinLine size={20} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">When</th>
                    <th className="py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">User's Question</th>
                    <th className="py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Topic Matched</th>
                    <th className="py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Accuracy</th>
                    <th className="py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right pr-4">Train AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {history.map((msg) => (
                    <tr key={msg._id} className={`hover:bg-gray-50/50 transition-colors ${msg.intent === 'fallback' ? 'bg-red-50/30' : ''}`}>
                      <td className="py-6 pl-4 font-bold text-gray-400 text-[10px] w-32">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-6">
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                             msg.intent === 'fallback' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                           }`}>
                              <RiChat1Line size={16} />
                           </div>
                           <p className="text-sm font-bold text-gray-800 line-clamp-1">{msg.userMessage}</p>
                        </div>
                      </td>
                      <td className="py-6">
                         <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest ${
                            msg.intent === 'fallback' ? 'text-red-600' : 'text-blue-600'
                         }`}>
                            {msg.intent === 'fallback' ? 'Unknown' : msg.intent}
                         </span>
                      </td>
                      <td className="py-6">
                         <div className="flex items-center gap-2">
                           <div className="flex-1 h-1.5 bg-gray-100 rounded-full max-w-[60px] overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${msg.score > 0.6 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                                style={{ width: `${msg.score * 100}%` }} 
                              />
                           </div>
                           <span className="text-[10px] font-black text-gray-400">{(msg.score * 100).toFixed(0)}%</span>
                         </div>
                      </td>
                      <td className="py-6 text-right pr-4">
                         <button 
                            onClick={() => {
                               setFormData({
                                  intent: '',
                                  category: 'core',
                                  utterances: msg.userMessage,
                                  answers: ''
                               });
                               setIsViewOnly(false);
                               setActiveTab('knowledge');
                               setShowModal(true);
                            }}
                            className="p-3 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Add to Knowledge Library"
                         >
                            <RiAddLine size={20} />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Knowledge Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="bg-gray-900 p-10 text-white flex justify-between items-center">
                 <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">
                        {isViewOnly ? 'View' : formData.intent ? 'Edit' : 'Add'} <span className="text-blue-500">Knowledge.</span>
                    </h3>
                    <p className="text-blue-200/50 text-[10px] font-black uppercase tracking-widest mt-1">
                        {isViewOnly ? 'Review training patterns' : 'Train the AI with new patterns'}
                    </p>
                 </div>
                 <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors">
                    <RiCloseLine size={32} />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Topic Name (Short ID)</label>
                       <input 
                          type="text" 
                          placeholder="e.g. membership-info"
                          className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 font-bold text-gray-800 focus:bg-white focus:border-blue-500/30 outline-none transition-all"
                          value={formData.intent}
                          onChange={(e) => setFormData({...formData, intent: e.target.value})}
                          required
                          readOnly={isViewOnly || formData.intent !== ''}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Topic Group</label>
                       <select 
                          className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 font-bold text-gray-800 focus:bg-white focus:border-blue-500/30 outline-none transition-all appearance-none"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          disabled={isViewOnly}
                       >
                          <option value="core">About HKCA</option>
                          <option value="how-to">How-to/Guides</option>
                          <option value="event">Event Details</option>
                          <option value="general">Hi/Hello Chat</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sample Questions (Ways users might ask)</label>
                    <p className="text-[9px] text-gray-400 font-bold -mt-1 ml-1">Add 3-5 different ways a user might ask this. One per line.</p>
                    <textarea 
                       rows="4" 
                       placeholder="How do I join?&#10;What is the fee?&#10;How to register?"
                       className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 font-bold text-gray-800 focus:bg-white focus:border-blue-500/30 outline-none transition-all resize-none mt-2"
                       value={formData.utterances}
                       onChange={(e) => setFormData({...formData, utterances: e.target.value})}
                       required
                       readOnly={isViewOnly}
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">AI Response (Bot's reply)</label>
                    <p className="text-[9px] text-gray-400 font-bold -mt-1 ml-1">This is the final answer the user will see. Use clear language.</p>
                    <textarea 
                       rows="4" 
                       placeholder="You can join HKCA by visiting the registration page..."
                       className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 font-bold text-gray-800 focus:bg-white focus:border-blue-500/30 outline-none transition-all resize-none mt-2"
                       value={formData.answers}
                       onChange={(e) => setFormData({...formData, answers: e.target.value})}
                       required
                       readOnly={isViewOnly}
                    />
                 </div>

                 {!isViewOnly && (
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3"
                    >
                        {loading ? <RiLoader4Line className="animate-spin" size={20} /> : <RiCheckLine size={20} />}
                        {loading ? 'Saving Knowledge...' : formData.intent ? 'Update Knowledge' : 'Add Knowledge to Brain'}
                    </button>
                 )}
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

// Placeholder for RiCloseLine which might not be imported
const RiCloseLine = ({ size }) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height={size} width={size} xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path></svg>
);

export default ManageChatbot;
