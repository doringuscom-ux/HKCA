import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/apiConfig';
import { 
  RiMailOpenLine, 
  RiMailSendLine, 
  RiDeleteBinLine, 
  RiLoader4Line,
  RiTimeLine,
  RiUser3Line,
  RiInboxArchiveLine,
  RiCloseLine,
  RiSearchLine,
  RiFilter3Line,
  RiCheckboxCircleLine,
  RiHistoryLine,
  RiAttachmentLine,
  RiExternalLinkLine,
  RiEyeLine,
  RiImageLine
} from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';

const ManageInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'new' | 'read'
  const [previewFile, setPreviewFile] = useState(null); // URL of file to preview in-page

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/admin/inquiries/list');
      setInquiries(res.data);
    } catch (err) {
      console.error('Failed to fetch inquiries', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'read' ? 'new' : 'read';
    try {
      const res = await api.patch(`/admin/inquiries/${id}/status`, { status: newStatus });
      setInquiries(inquiries.map(i => i._id === id ? res.data : i));
      if (selectedInquiry?._id === id) setSelectedInquiry(res.data);
    } catch (err) {
      console.error('Status update failed', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry permanently?')) return;
    
    try {
      await api.delete(`/admin/inquiries/${id}`);
      setInquiries(inquiries.filter(i => i._id !== id));
      if (selectedInquiry?._id === id) setSelectedInquiry(null);
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete inquiry');
    }
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(inquiry => {
      const matchesSearch = 
        inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || inquiry.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  }, [inquiries, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: inquiries.length,
      new: inquiries.filter(i => i.status === 'new').length,
      read: inquiries.filter(i => i.status === 'read').length,
    };
  }, [inquiries]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <RiLoader4Line size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Stats */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Inquiry Manager</h1>
          <p className="text-gray-500 font-medium">Filter, search and manage contact submissions</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           <div className="bg-blue-50 px-5 py-3 rounded-2xl border border-blue-100 min-w-[120px]">
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 block mb-1">Total</span>
              <span className="text-xl font-black text-blue-700">{stats.total}</span>
           </div>
           <div className="bg-orange-50 px-5 py-3 rounded-2xl border border-orange-100 min-w-[120px]">
              <span className="text-[9px] font-black uppercase tracking-widest text-orange-500 block mb-1">New</span>
              <span className="text-xl font-black text-orange-700">{stats.new}</span>
           </div>
           <div className="bg-green-50 px-5 py-3 rounded-2xl border border-green-100 min-w-[120px]">
              <span className="text-[9px] font-black uppercase tracking-widest text-green-500 block mb-1">Resolved</span>
              <span className="text-xl font-black text-green-700">{stats.read}</span>
           </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, email or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-bold text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
           {['all', 'new', 'read'].map((s) => (
             <button
               key={s}
               onClick={() => setFilterStatus(s)}
               className={`px-6 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
                 filterStatus === s 
                 ? 'bg-white text-blue-600 shadow-sm ring-1 ring-blue-100' 
                 : 'text-gray-400 hover:text-gray-600'
               }`}
             >
               {s}
             </button>
           ))}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredInquiries.map((inquiry) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={inquiry._id}
              className={`rounded-[2rem] border transition-all duration-500 overflow-hidden flex flex-col group ${
                inquiry.status === 'read' 
                ? 'bg-green-50/30 border-green-100/50 shadow-[0_10px_30px_-15px_rgba(34,197,94,0.1)]' 
                : 'bg-white border-gray-100 shadow-sm hover:shadow-xl'
              }`}
            >
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                     inquiry.status === 'read' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'
                   }`}>
                      {inquiry.status === 'read' ? <RiCheckboxCircleLine size={20} /> : <RiUser3Line size={20} />}
                   </div>
                   <div className="text-right">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        {formatDate(inquiry.createdAt)}
                      </span>
                      {inquiry.status === 'new' && (
                        <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-600 text-[8px] font-black rounded-full uppercase tracking-widest mt-1 animate-pulse">
                          New
                        </span>
                      )}
                   </div>
                </div>

                <div className="mb-4">
                  <h3 className={`font-black text-lg uppercase leading-tight truncate ${
                    inquiry.status === 'read' ? 'text-green-800' : 'text-slate-900'
                  }`}>
                    {inquiry.subject}
                  </h3>
                  <p className="text-blue-600 text-xs font-black uppercase tracking-wider mt-1">{inquiry.name}</p>
                  <p className="text-slate-400 text-xs font-bold leading-tight mt-0.5">{inquiry.email}</p>
                </div>

                <p className={`text-sm line-clamp-3 font-medium p-4 rounded-xl border h-24 ${
                  inquiry.status === 'read' 
                  ? 'bg-white/60 border-green-50 text-green-700/70' 
                  : 'bg-slate-50 border-gray-50 text-slate-500'
                }`}>
                  {inquiry.message}
                </p>
              </div>

              <div className={`p-4 border-t flex items-center gap-3 ${
                inquiry.status === 'read' ? 'bg-green-100/20 border-green-100/30' : 'bg-slate-50/50 border-gray-100'
              }`}>
                 <button 
                   onClick={() => setSelectedInquiry(inquiry)}
                   className="flex-1 bg-white border border-gray-200 text-slate-800 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                 >
                   View
                 </button>
                 
                 <button 
                    onClick={() => handleStatusToggle(inquiry._id, inquiry.status)}
                    title={inquiry.status === 'read' ? "Mark as New" : "Mark as Resolved"}
                    className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all border ${
                      inquiry.status === 'read' 
                      ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-500/20' 
                      : 'bg-white text-slate-400 border-slate-200 hover:text-green-600 hover:border-green-200'
                    }`}
                 >
                   {inquiry.status === 'read' ? <RiHistoryLine size={20} /> : <RiCheckboxCircleLine size={20} />}
                 </button>

                 <button 
                   onClick={() => handleDelete(inquiry._id)}
                   className="w-12 h-12 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                 >
                   <RiDeleteBinLine size={20} />
                 </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredInquiries.length === 0 && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-gray-400">
             <RiInboxArchiveLine size={64} className="mb-4 opacity-20" />
             <p className="font-black uppercase tracking-widest text-sm text-center">
               {searchTerm ? `No results for "${searchTerm}"` : `No ${filterStatus} inquiries found`}
             </p>
          </div>
        )}
      </div>

      {/* Message Modal */}
      <AnimatePresence>
        {selectedInquiry && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInquiry(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden border bg-white border-gray-100 flex flex-col max-h-[90vh]"
            >
              <div className="p-6 sm:p-10 overflow-y-auto flex-1 custom-scrollbar">
                <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-100">
                  <div className="pr-4 sm:pr-8">
                    <div className="flex flex-wrap items-center gap-3 mb-3 relative z-10">
                       <span className={`px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] text-[9px] ${
                         selectedInquiry.status === 'read' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                       }`}>
                         {selectedInquiry.status === 'read' ? 'Resolved' : 'New Inquiry'}
                       </span>
                       <span className="text-slate-400 text-[11px] font-bold flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                          <RiTimeLine /> {formatDate(selectedInquiry.createdAt)}
                       </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight uppercase relative z-10">
                      {selectedInquiry.subject}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setSelectedInquiry(null)}
                    className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex shrink-0 items-center justify-center hover:bg-slate-100 hover:text-red-500 transition-all relative z-20"
                  >
                    <RiCloseLine size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Info Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                       <div className="w-11 h-11 bg-white shadow-sm rounded-xl flex shrink-0 items-center justify-center text-blue-500">
                          <RiUser3Line size={20} />
                       </div>
                       <div className="overflow-hidden">
                          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Sender</p>
                          <p className="font-bold text-slate-900 text-sm truncate">{selectedInquiry.name}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                       <div className="w-11 h-11 bg-white shadow-sm rounded-xl flex shrink-0 items-center justify-center text-blue-500">
                          <RiMailSendLine size={20} />
                       </div>
                       <div className="overflow-hidden">
                          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Email Address</p>
                          <a href={`mailto:${selectedInquiry.email}`} className="font-bold text-blue-600 hover:underline text-sm truncate block">{selectedInquiry.email}</a>
                       </div>
                    </div>
                  </div>

                  {/* Message Container */}
                  <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
                    
                    <p className="text-[10px] font-black uppercase text-white/50 tracking-widest mb-6 flex items-center gap-2">
                      <RiMailOpenLine size={14} /> Message Content
                    </p>
                    
                    <div className="text-slate-50 font-medium text-[15px] sm:text-base leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-800/50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-blue-500/50 [&::-webkit-scrollbar-thumb]:rounded-full relative z-10">
                       {selectedInquiry.message}
                    </div>
                  </div>

                  {/* Document Attachment Section */}
                  {selectedInquiry.documentUrl && (
                     <div className="mt-2">
                        <div className="bg-blue-50/50 border border-blue-100/50 p-4 sm:p-5 rounded-3xl transition-all shadow-sm">
                           <div className="flex items-center gap-4 mb-5 pb-4 border-b border-blue-100/30">
                              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                                 <RiAttachmentLine size={22} />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Attached Document</p>
                                 <p className="font-bold text-slate-700 text-xs sm:text-sm">User securely attached an image</p>
                              </div>
                           </div>
                           
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <button 
                                onClick={() => setPreviewFile(selectedInquiry.documentUrl)}
                                className="flex-1 px-5 py-3.5 bg-white text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm border border-blue-100 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 group"
                              >
                                 <RiEyeLine size={16} className="group-hover:scale-110 transition-transform" /> Quick Preview
                              </button>
                              <a 
                                href={selectedInquiry.documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 px-5 py-3.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md border border-slate-900 hover:bg-blue-600 hover:border-blue-600 transition-all flex items-center justify-center gap-2 group"
                              >
                                 <RiExternalLinkLine size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /> Next Page
                              </a>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-gray-100">
                    <button 
                      onClick={() => handleStatusToggle(selectedInquiry._id, selectedInquiry.status)}
                      className="w-full px-6 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 border shadow-sm bg-green-600 text-white border-green-600 hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/25"
                    >
                      {selectedInquiry.status === 'read' ? (
                        <><RiHistoryLine size={16} /> Mark as Unread</>
                      ) : (
                        <><RiCheckboxCircleLine size={16} /> Mark as Resolved</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full-Screen In-Page Preview Lightbox */}
      <AnimatePresence>
        {previewFile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewFile(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl h-full max-h-[85vh] flex flex-col items-center justify-center gap-6"
            >
               <button 
                onClick={() => setPreviewFile(null)}
                className="absolute -top-12 sm:top-0 -right-4 sm:-right-16 text-white/60 hover:text-white transition-colors flex items-center gap-2 font-black uppercase tracking-widest text-xs"
               >
                 Close <RiCloseLine size={28} />
               </button>
               
               <div className="w-full h-full bg-white/5 rounded-3xl p-2 sm:p-4 border border-white/10 shadow-2xl relative overflow-hidden group">
                  <img 
                    src={previewFile} 
                    alt="Document Preview" 
                    className="w-full h-full object-contain rounded-2xl shadow-inner shadow-black/50"
                  />
                  
                  {/* Floating Action Button */}
                  <a 
                    href={previewFile}
                    download
                    className="absolute bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-blue-500 hover:-translate-y-1 transition-all opacity-0 group-hover:opacity-100"
                  >
                    Download Original
                  </a>
               </div>
               
               <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em]">Internal Document Viewer</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageInquiries;
