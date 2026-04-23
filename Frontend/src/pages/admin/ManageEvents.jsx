import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';
import { 
  RiCalendarCheckLine, 
  RiDeleteBin7Line, 
  RiLinksLine, 
  RiUpload2Line, 
  RiLoader4Line, 
  RiErrorWarningLine,
  RiMapPin2Line,
  RiTimeLine,
  RiAddCircleLine,
  RiEditLine,
  RiCloseCircleLine,
  RiCheckboxCircleLine,
  RiDraftLine,
  RiGroupLine,
  RiUserSearchLine,
  RiArrowRightSLine,
  RiExternalLinkLine,
  RiMailLine,
  RiPhoneLine,
  RiHashtag,
  RiFileList3Line,
  RiCake2Line,
  RiUserHeartLine,
  RiInformationLine,
  RiHome4Line,
  RiShieldUserLine
} from 'react-icons/ri';

const ManageEvents = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [location, setLocation] = useState('');
  const [isUpload, setIsUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('published');
  const [pricing, setPricing] = useState({
    athlete: 200,
    coach: 500,
    club: 5000
  });
  const [duration, setDuration] = useState('');
  const [mapUrl, setMapUrl] = useState('');

  // Participant Management State
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Cancellation Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelData, setCancelData] = useState({ registrationId: null, reason: '', allowReapply: true });

  // Participant Search/Filter State
  const [participantSearch, setParticipantSearch] = useState('');
  const [participantFilterRole, setParticipantFilterRole] = useState('all');
  const [participantFilterStatus, setParticipantFilterStatus] = useState('all');

  const filteredParticipants = participants.filter(reg => {
    const matchesSearch = 
      (reg.user?.personalInfo?.firstName?.toLowerCase().includes(participantSearch.toLowerCase())) ||
      (reg.user?.personalInfo?.lastName?.toLowerCase().includes(participantSearch.toLowerCase())) ||
      (reg.user?.email?.toLowerCase().includes(participantSearch.toLowerCase()));
    
    const matchesRole = participantFilterRole === 'all' || reg.role === participantFilterRole;
    const matchesStatus = participantFilterStatus === 'all' || reg.status === participantFilterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/admin/events/all');
      setItems(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async (event) => {
    setSelectedEvent(event);
    setShowParticipantsModal(true);
    setParticipantsLoading(true);
    try {
      const response = await api.get(`/admin/events/${event._id}/registrations`);
      setParticipants(response.data);
    } catch (err) {
      console.error('Error fetching participants:', err);
    } finally {
      setParticipantsLoading(false);
    }
  };

  const handleCancelClick = (registrationId) => {
    setCancelData({ registrationId, reason: '', allowReapply: true });
    setShowCancelModal(true);
  };

  const submitCancelRegistration = async () => {
    if (!cancelData.reason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }
    
    try {
      await api.put(`/admin/registrations/${cancelData.registrationId}/status`, { 
        status: 'cancelled',
        cancellationReason: cancelData.reason,
        allowReapply: cancelData.allowReapply
      });
      setShowCancelModal(false);
      // Refresh participants list
      if (selectedEvent) fetchParticipants(selectedEvent);
    } catch (err) {
      alert('Failed to cancel registration: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setTitle('');
    setDescription('');
    setDate('');
    setRegistrationDeadline('');
    setLocation('');
    setImageUrl('');
    setFile(null);
    setIsUpload(false);
    setStatus('published');
    setPricing({
      athlete: 200,
      coach: 500,
      club: 5000
    });
    setDuration('');
    setMapUrl('');
    setError('');
  };

  const handleEdit = (event) => {
    setIsEditing(true);
    setEditId(event._id);
    setTitle(event.title);
    setDescription(event.description);
    // Format date for input field
    const formattedDate = event.date ? new Date(event.date).toISOString().split('T')[0] : '';
    setDate(formattedDate);
    const formattedDeadline = event.registrationDeadline ? new Date(event.registrationDeadline).toISOString().split('T')[0] : '';
    setRegistrationDeadline(formattedDeadline);
    setLocation(event.location);
    setImageUrl(event.imageUrl);
    setIsUpload(false);
    setFile(null);
    setStatus(event.status || 'published');
    setPricing(event.pricing || {
      athlete: 200,
      coach: 500,
      club: 5000
    });
    setDuration(event.duration || '');
    setMapUrl(event.mapUrl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBtnLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('registrationDeadline', registrationDeadline);
    formData.append('location', location);
    formData.append('imageUrl', imageUrl);
    formData.append('isUpload', isUpload);
    formData.append('status', status);
    formData.append('pricing', JSON.stringify(pricing));
    formData.append('duration', duration);
    formData.append('mapUrl', mapUrl);
    
    if (isUpload) {
      if (file) {
        formData.append('image', file);
      } else if (!isEditing) {
        setError('Please select an event banner to upload');
        setBtnLoading(false);
        return;
      }
      if (!imageUrl && !isEditing) {
        setError('Please provide an image URL for the event banner');
        setBtnLoading(false);
        return;
      }
    }

    try {
      if (isEditing) {
        await api.put(`/admin/events/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/admin/events', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      resetForm();
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} event`);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this event?')) {
      try {
        await api.delete(`/admin/events/${id}`);
        fetchItems();
      } catch (err) {
        alert('Failed to remove event');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RiLoader4Line className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fadeIn selection:bg-blue-500/30">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Events</h1>
          <p className="text-gray-500 mt-2">Schedule, edit, and publish your championships and trials.</p>
        </div>
        {isEditing && (
          <button 
            onClick={resetForm}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all border border-gray-200"
          >
            <RiCloseCircleLine size={20} /> Cancel Edit
          </button>
        )}
      </div>

      {/* Form Section */}
      <div className={`bg-white p-8 rounded-3xl border transition-all duration-300 ${isEditing ? 'border-blue-500 shadow-xl shadow-blue-50' : 'border-gray-100 shadow-sm'}`}>
        <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          {isEditing ? (
            <>
              <RiEditLine className="text-blue-600" size={24} />
              Edit Event: <span className="text-blue-600 truncate">{title}</span>
            </>
          ) : (
            <>
              <RiAddCircleLine className="text-blue-600" size={24} />
              Create New Event
            </>
          )}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Event Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none border"
                placeholder="Ex: District Under-19 Trials"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Description</label>
              <textarea
                required
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none border resize-none"
                placeholder="Details about the event, criteria, and highlights..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Event Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Registration Deadline</label>
                <input
                  type="date"
                  required
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none border"
                  placeholder="Ex: City Sports Club"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none border"
                  placeholder="Ex: 3 Days or Whole Day"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Map Embed URL (iframe src)</label>
              <input
                type="text"
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none border"
                placeholder="Ex: https://www.google.com/maps/embed?pb=..."
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 ml-1">Visibility Status</label>
              <div className="flex p-1 bg-gray-100 rounded-2xl w-full">
                <button
                  type="button"
                  onClick={() => setStatus('published')}
                  className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${status === 'published' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <RiCheckboxCircleLine size={18} /> Published
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${status === 'draft' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <RiDraftLine size={18} /> Draft
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                Banner Image
                {isEditing && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">Keep current if no change</span>}
              </label>
              <div className="flex p-1 bg-gray-100 rounded-2xl w-fit">
                <button
                  type="button"
                  onClick={() => setIsUpload(false)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${!isUpload ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <RiLinksLine /> Direct Link
                </button>
                <button
                  type="button"
                  onClick={() => setIsUpload(true)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${isUpload ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <RiUpload2Line /> Upload Image
                </button>
              </div>

              {isUpload ? (
                <div className="space-y-2">
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all cursor-pointer bg-gray-50 rounded-2xl border border-dashed border-gray-300 p-2"
                    />
                  </div>
                </div>
              ) : (
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none border"
                  placeholder="https://images.unsplash.com/..."
                />
              )}
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 ml-1">Event Pricing (₹)</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Athlete</label>
                  <input
                    type="number"
                    value={pricing.athlete}
                    onChange={(e) => setPricing({ ...pricing, athlete: e.target.value })}
                    className="block w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:bg-white focus:border-blue-600 outline-none border"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Coach</label>
                  <input
                    type="number"
                    value={pricing.coach}
                    onChange={(e) => setPricing({ ...pricing, coach: e.target.value })}
                    className="block w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:bg-white focus:border-blue-600 outline-none border"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Club</label>
                  <input
                    type="number"
                    value={pricing.club}
                    onChange={(e) => setPricing({ ...pricing, club: e.target.value })}
                    className="block w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:bg-white focus:border-blue-600 outline-none border"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100 animate-shake">
                <RiErrorWarningLine size={18} />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={btnLoading}
              className={`w-full text-white rounded-2xl px-6 py-4 font-black text-sm transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-2 ${isEditing ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200' : 'bg-green-600 hover:bg-green-700 hover:shadow-green-200'}`}
            >
              {btnLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <RiLoader4Line size={20} className="animate-spin" />
                  Processing...
                </div>
              ) : (
                isEditing ? 'Save Changes' : (status === 'published' ? 'Publish Event' : 'Save as Draft')
              )}
            </button>
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            Manage Content
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{items.length} Total Events</span>
        </h2>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item._id} className={`bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col sm:flex-row group transition-all duration-300 ${item.status === 'draft' ? 'opacity-75 border-orange-100 bg-orange-50/10' : 'border-gray-100 hover:shadow-md'}`}>
              <div className="sm:w-56 h-48 sm:h-auto relative overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {item.status === 'draft' ? (
                    <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider">
                      <RiDraftLine /> Draft
                    </span>
                  ) : (
                    <span className="bg-green-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider">
                      <RiCheckboxCircleLine /> Published
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 truncate pr-16 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1.5 rounded-lg border border-gray-200">
                      <RiCalendarCheckLine size={14} className="text-blue-600" />
                      {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5 bg-red-50 text-red-600 px-2.5 py-1.5 rounded-lg border border-red-100 shadow-sm">
                      <RiTimeLine size={14} />
                      Deadline: {new Date(item.registrationDeadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1.5 rounded-lg border border-gray-200">
                      <RiMapPin2Line size={14} className="text-blue-600" />
                      <span className="truncate max-w-[120px]">{item.location}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-4 line-clamp-2 leading-relaxed font-medium italic">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => fetchParticipants(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all text-xs"
                  >
                    <RiGroupLine size={16} /> Participants
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all text-xs"
                  >
                    <RiEditLine size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all"
                  >
                    <RiDeleteBin7Line size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {items.length === 0 && (
            <div className="col-span-full py-24 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <RiCalendarCheckLine className="text-gray-300" size={40} />
              </div>
              <h3 className="text-gray-900 font-bold text-lg">No events found</h3>
              <p className="text-gray-400 font-medium max-w-sm mx-auto mt-2 text-sm">Start by creating your first event using the form above. You can save it as a draft or publish immediately.</p>
            </div>
          )}
        </div>
      </div>

      {/* Participants Modal */}
      {showParticipantsModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-5xl max-h-[85vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                  <RiGroupLine className="text-blue-600" size={28} />
                  Participants: <span className="text-blue-600 font-extrabold">{selectedEvent?.title}</span>
                </h2>
                <p className="text-gray-500 text-sm font-medium mt-1">Reviewing {participants.length} registered members</p>
              </div>
              <button 
                onClick={() => setShowParticipantsModal(false)}
                className="p-3 hover:bg-gray-200 rounded-2xl transition-all text-gray-400 hover:text-gray-900"
              >
                <RiCloseCircleLine size={28} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {/* Filter Controls */}
              <div className="flex flex-col md:flex-row gap-4 mb-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="flex-1 relative">
                  <RiUserSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search by name or email..."
                    className="w-full bg-white border border-slate-200 rounded-2xl p-4 pl-12 font-bold outline-none focus:border-blue-500 transition-all text-sm"
                    value={participantSearch}
                    onChange={(e) => setParticipantSearch(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <select 
                    className="bg-white border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:border-blue-500 transition-all text-xs appearance-none cursor-pointer"
                    value={participantFilterRole}
                    onChange={(e) => setParticipantFilterRole(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="athlete">Athlete</option>
                    <option value="coach">Coach</option>
                    <option value="club">Club</option>
                  </select>
                  <select 
                    className="bg-white border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:border-blue-500 transition-all text-xs appearance-none cursor-pointer"
                    value={participantFilterStatus}
                    onChange={(e) => setParticipantFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {participantsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <RiLoader4Line className="h-10 w-10 animate-spin text-blue-600" />
                  <p className="text-gray-500 font-bold animate-pulse">Fetching Participant List...</p>
                </div>
              ) : filteredParticipants.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <RiUserSearchLine className="mx-auto text-gray-300 mb-4" size={48} />
                  <h3 className="text-gray-900 font-bold text-lg">No participants match your filters</h3>
                  <p className="text-gray-400 text-sm">Try adjusting your search or filters to see more results.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-left text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                        <th className="px-6 py-2">Profile</th>
                        <th className="px-6 py-2">Registration Info</th>
                        <th className="px-6 py-2 text-center">Payment</th>
                        <th className="px-6 py-2 text-center">Status</th>
                        <th className="px-6 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredParticipants.map((reg) => (
                        <tr key={reg._id} className="group transition-all">
                          <td className="px-6 py-4 bg-gray-50 rounded-l-3xl border-y border-l border-gray-100">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm overflow-hidden">
                                {reg.user?.documents?.photograph ? (
                                  <img src={reg.user.documents.photograph} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <RiShieldUserLine className="text-blue-600" size={24} />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-gray-900 truncate">
                                  {reg.user?.personalInfo?.firstName} {reg.user?.personalInfo?.lastName}
                                </p>
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{reg.role}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 bg-gray-50 border-y border-gray-100">
                            <div className="flex flex-col gap-1">
                              <span className="flex items-center gap-2 text-sm text-gray-600 font-medium tracking-tight">
                                <RiMailLine className="text-gray-400" /> {reg.user?.email}
                              </span>
                              <span className="text-[10px] text-gray-400 font-bold">
                                Registered on {new Date(reg.registrationDate).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 bg-gray-50 border-y border-gray-100 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                                reg.paymentStatus === 'paid' 
                                  ? 'bg-blue-100 text-blue-700 border-blue-200' 
                                  : reg.paymentStatus === 'failed' 
                                  ? 'bg-red-100 text-red-700 border-red-200' 
                                  : 'bg-orange-100 text-orange-700 border-orange-200'
                              }`}>
                                {reg.paymentStatus || 'pending'}
                              </span>
                              <span className="text-[10px] font-bold text-gray-900">₹{reg.amountPaid || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 bg-gray-50 border-y border-gray-100 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border ${
                              reg.status === 'confirmed' 
                                ? 'bg-green-100 text-green-700 border-green-200' 
                                : reg.status === 'cancelled' 
                                ? 'bg-red-100 text-red-700 border-red-200' 
                                : 'bg-gray-100 text-gray-700 border-gray-200'
                            }`}>
                              {reg.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 bg-gray-50 rounded-r-3xl border-y border-r border-gray-100 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedUser(reg.user);
                                  setShowUserDetailModal(true);
                                }}
                                className="p-2.5 bg-white text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-gray-100 group/btn"
                                title="View Full Profile"
                              >
                                <RiFileList3Line size={18} />
                              </button>
                              {reg.status !== 'cancelled' && (
                                <button
                                  onClick={() => handleCancelClick(reg._id)}
                                  className="p-2.5 bg-white text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm border border-gray-100 group/btn"
                                  title="Cancel Registration"
                                >
                                  <RiCloseCircleLine size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showUserDetailModal && selectedUser && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="relative h-56 md:h-64 shrink-0 bg-blue-600">
              <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-indigo-900 opacity-90"></div>
              <div className="absolute bottom-6 md:bottom-8 left-6 sm:left-10 flex flex-col md:flex-row md:items-center gap-6 w-full pr-10 z-10">
                <div className="w-32 h-32 rounded-3xl bg-white p-1.5 shadow-2xl overflow-hidden animate-slideUp shrink-0">
                  {selectedUser.documents?.photograph ? (
                    <img src={selectedUser.documents.photograph} alt="" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <div className="w-full h-full bg-blue-50 flex items-center justify-center rounded-2xl">
                      <RiShieldUserLine className="text-blue-600" size={48} />
                    </div>
                  )}
                </div>
                <div className="animate-fadeIn mt-4 md:mt-0">
                  <h3 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">
                    {selectedUser.personalInfo?.firstName} {selectedUser.personalInfo?.lastName}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="bg-gray-900 text-white shadow-md text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-gray-800">
                      Member ID: {selectedUser._id.slice(-8).toUpperCase()}
                    </span>
                    <span className="bg-emerald-500 text-white shadow-md shadow-emerald-500/20 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-400">
                      ACTIVE MEMBER
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowUserDetailModal(false)}
                className="absolute top-6 right-6 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-2xl transition-all border border-white/20"
              >
                <RiCloseCircleLine size={24} />
              </button>
            </div>

            {/* Profile Content */}
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Left Column: Personal & Contact */}
                <div className="space-y-10">
                  <section className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
                    <h4 className="text-gray-900 font-black text-sm uppercase tracking-widest flex items-center gap-3 mb-6">
                      <RiInformationLine className="text-blue-600" /> Personal Details
                    </h4>
                    <div className="space-y-4 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                      <DetailRow label="Gender" value={selectedUser.personalInfo?.gender} icon={<RiGroupLine />} />
                      <DetailRow label="Birth Date" value={selectedUser.personalInfo?.birthDate ? new Date(selectedUser.personalInfo.birthDate).toLocaleDateString() : 'N/A'} icon={<RiCake2Line />} />
                      <DetailRow label="Blood Group" value={selectedUser.personalInfo?.bloodGroup} icon={<RiUserHeartLine />} />
                    </div>
                  </section>

                  <section className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
                    <h4 className="text-gray-900 font-black text-sm uppercase tracking-widest flex items-center gap-3 mb-6">
                      <RiMapPin2Line className="text-blue-600" /> Contact & Address
                    </h4>
                    <div className="space-y-4 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                      <DetailRow label="Email" value={selectedUser.email} icon={<RiMailLine />} />
                      <DetailRow label="Phone" value={selectedUser.contactInfo?.phone} icon={<RiPhoneLine />} />
                      <div className="pt-2 border-t border-gray-200/50 mt-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Full Address</label>
                        <p className="text-sm text-gray-700 font-bold leading-relaxed">
                          {selectedUser.contactInfo?.address?.line1}, {selectedUser.contactInfo?.address?.line2}<br />
                          {selectedUser.contactInfo?.address?.city}, {selectedUser.contactInfo?.address?.district}<br />
                          {selectedUser.contactInfo?.address?.state} - {selectedUser.contactInfo?.address?.pinCode}
                        </p>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column: Guardian & Documents */}
                <div className="space-y-10">
                  <section className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
                    <h4 className="text-gray-900 font-black text-sm uppercase tracking-widest flex items-center gap-3 mb-6">
                      <RiShieldUserLine className="text-blue-600" /> Parent / Guardian
                    </h4>
                    <div className="space-y-4 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                      <DetailRow label="Father Name" value={selectedUser.guardianInfo?.fatherName} icon={<RiGroupLine />} />
                      <DetailRow label="Phone" value={selectedUser.guardianInfo?.phone} icon={<RiPhoneLine />} />
                      <DetailRow label="Occupation" value={selectedUser.guardianInfo?.occupation} icon={<RiFileList3Line />} />
                    </div>
                  </section>

                  <section className="animate-slideUp" style={{ animationDelay: '0.4s' }}>
                    <h4 className="text-gray-900 font-black text-sm uppercase tracking-widest flex items-center gap-3 mb-6">
                      <RiFileList3Line className="text-blue-600" /> Verified Documents
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <DocButton label="ID Proof" url={selectedUser.documents?.idProof} />
                      <DocButton label="DOB Proof" url={selectedUser.documents?.dobProof} />
                      <DocButton label="Address Proof" url={selectedUser.documents?.addressProof} />
                    </div>
                  </section>
                </div>

              </div>
            </div>
            
            <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setShowUserDetailModal(false)}
                className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Reason Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-red-50">
              <h2 className="text-xl font-black text-red-600 flex items-center gap-2">
                <RiErrorWarningLine size={24} />
                Cancel Registration
              </h2>
              <button 
                onClick={() => setShowCancelModal(false)}
                className="p-2 hover:bg-red-100 rounded-xl transition-all text-red-400 hover:text-red-600"
              >
                <RiCloseCircleLine size={24} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                  Cancellation Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-sm font-medium"
                  placeholder="E.g., Invalid document uploaded. Please update your profile and try again."
                  value={cancelData.reason}
                  onChange={(e) => setCancelData({ ...cancelData, reason: e.target.value })}
                ></textarea>
              </div>
              <label className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="relative flex items-center pt-1">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    checked={cancelData.allowReapply}
                    onChange={(e) => setCancelData({ ...cancelData, allowReapply: e.target.checked })}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">Allow Re-application</p>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">
                    If checked, the user will be able to re-apply for this event after resolving the issue. If unchecked, they cannot apply for this event again.
                  </p>
                </div>
              </label>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={submitCancelRegistration}
                className="px-6 py-2.5 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-colors text-sm shadow-md"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const DetailRow = ({ label, value, icon }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-gray-100 shrink-0">
      {icon}
    </div>
    <div>
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block leading-none mb-1">{label}</label>
      <p className="text-sm text-gray-900 font-bold truncate max-w-[200px]">{value || 'Not provided'}</p>
    </div>
  </div>
);

const DocButton = ({ label, url }) => (
  <a 
    href={url} 
    target="_blank" 
    rel="noopener noreferrer"
    className={`flex items-center justify-between p-3 rounded-2xl border font-bold text-[10px] uppercase tracking-wider transition-all ${
      url ? 'bg-white border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm' : 'bg-gray-100 border-gray-200 text-gray-400 pointer-events-none'
    }`}
  >
    {label}
    <RiExternalLinkLine size={14} />
  </a>
);



export default ManageEvents;
