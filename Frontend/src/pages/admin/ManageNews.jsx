import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';
import { 
  RiArticleLine, 
  RiDeleteBin7Line, 
  RiLinksLine, 
  RiUpload2Line, 
  RiLoader4Line, 
  RiErrorWarningLine,
  RiAddCircleLine,
  RiEditLine,
  RiCloseCircleLine,
  RiCheckboxCircleLine,
  RiDraftLine,
  RiFilePdfLine,
  RiCalendarLine,
  RiInformationLine,
  RiImageLine
} from 'react-icons/ri';

const ManageNews = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('Result');
  const [type, setType] = useState('PDF');
  const [status, setStatus] = useState('published');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Image State
  const [isImageUpload, setIsImageUpload] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  
  // PDF State
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/admin/publications/all');
      setItems(response.data);
    } catch (err) {
      console.error('Error fetching publications:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setTitle('');
    setSummary('');
    setCategory('Result');
    setType('PDF');
    setStatus('published');
    setDate(new Date().toISOString().split('T')[0]);
    setImageUrl('');
    setImageFile(null);
    setFileUrl('');
    setError('');
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item._id);
    setTitle(item.title);
    setSummary(item.summary);
    setCategory(item.category);
    setType(item.type);
    setStatus(item.status);
    setDate(item.date ? new Date(item.date).toISOString().split('T')[0] : '');
    setImageUrl(item.imageUrl || '');
    setFileUrl(item.fileUrl || '');
    setIsImageUpload(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBtnLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('category', category);
    formData.append('type', type);
    formData.append('status', status);
    formData.append('date', date);
    
    // Image Handling
    if (isImageUpload && imageFile) {
      formData.append('image', imageFile);
    } else {
      formData.append('imageUrl', imageUrl);
    }

    // PDF Handling (URL only)
    formData.append('fileUrl', fileUrl);

    try {
      if (isEditing) {
        await api.put(`/admin/publications/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/admin/publications', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      resetForm();
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} publication`);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this publication?')) {
      try {
        await api.delete(`/admin/publications/${id}`);
        fetchItems();
      } catch (err) {
        alert('Failed to remove publication');
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
    <div className="space-y-10 animate-fadeIn p-4 sm:p-0">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Results</h1>
          <p className="text-gray-500 mt-2">Publish official results and standings for HKCA events.</p>
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
            <><RiEditLine className="text-blue-600" size={24} /> Edit Item</>
          ) : (
            <><RiAddCircleLine className="text-blue-600" size={24} /> Add New Entry</>
          )}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Headline</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none border"
                placeholder="Result name (e.g., State Championship 2026)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Summary</label>
              <textarea
                required
                rows="3"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none border resize-none"
                placeholder="Brief summary for the card view..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 transition-all outline-none border"
                >
                  <option value="Result">Official Results</option>
                  <option value="News">Latest News / Feed</option>
                  <option value="Results">Legacy Results (Old)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 transition-all outline-none border"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Image Selection */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <RiImageLine /> Cover Image
              </label>
              <div className="flex p-1 bg-gray-100 rounded-2xl w-fit">
                <button
                  type="button"
                  onClick={() => setIsImageUpload(true)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isImageUpload ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setIsImageUpload(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${!isImageUpload ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                >
                  URL
                </button>
              </div>
              {isImageUpload ? (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="block w-full text-xs text-gray-500 p-3 border-2 border-dashed border-gray-200 rounded-2xl"
                />
              ) : (
                <input
                  type="url"
                  value={imageUrl || ''}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-sm outline-none border"
                  placeholder="https://..."
                />
              )}
            </div>

            {/* PDF Link */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <RiFilePdfLine /> PDF Link
              </label>
              <div className="relative">
                <RiLinksLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="url"
                  value={fileUrl || ''}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="block w-full rounded-2xl border-gray-200 bg-gray-50 pl-10 pr-4 py-4 text-sm outline-none border focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="https://drive.google.com/... or https://.../result.pdf"
                />
              </div>
              <p className="text-[11px] text-gray-400 ml-1">Paste a direct link to the PDF (Google Drive, Dropbox, etc.)</p>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100">{error}</div>}

            <button
              type="submit"
              disabled={btnLoading}
              className="w-full bg-blue-600 text-white rounded-2xl py-4 font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              {btnLoading ? <RiLoader4Line className="animate-spin" /> : (isEditing ? 'Update Entry' : 'Publish Submission')}
            </button>
          </div>
        </form>
      </div>

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item._id} className="bg-white rounded-3xl border border-gray-100 p-6 flex gap-4 hover:shadow-lg transition-all">
            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
              <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-600`}>
                  {item.category}
                </span>
                <span className="text-[10px] text-gray-400 font-bold">{new Date(item.date).toLocaleDateString()}</span>
              </div>
              <h3 className="font-bold text-gray-900 truncate">{item.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.summary}</p>
              
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleEdit(item)} className="p-2 bg-gray-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                  <RiEditLine />
                </button>
                <button onClick={() => handleDelete(item._id)} className="p-2 bg-gray-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all">
                   <RiDeleteBin7Line />
                </button>
                {item.fileUrl && (
                  <a href={item.fileUrl} target="_blank" rel="noreferrer" className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-200">
                    <RiFilePdfLine />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageNews;
