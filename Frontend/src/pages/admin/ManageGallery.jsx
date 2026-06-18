import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';
import { RiImageAddLine, RiDeleteBin7Line, RiLinksLine, RiUpload2Line, RiLoader4Line, RiErrorWarningLine } from 'react-icons/ri';

const ManageGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [isUpload, setIsUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);
  const [mediaType, setMediaType] = useState('image'); // 'image' or 'video'
  const [coverImage, setCoverImage] = useState('');

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/admin/gallery');
      setItems(response.data);
    } catch (err) {
      console.error('Error fetching gallery items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const resetForm = () => {
    setTitle('');
    setCategory('General');
    setImageUrl('');
    setFile(null);
    setIsUpload(false);
    setIsEditing(false);
    setEditId(null);
    setMediaType('image');
    setCoverImage('');
    setError('');
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item._id);
    setTitle(item.title);
    setCategory(item.category);
    setMediaType(item.type || 'image');
    setImageUrl(item.imageUrl || '');
    setCoverImage(item.coverImage || '');
    setIsUpload(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBtnLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('isUpload', isUpload);
    formData.append('type', mediaType);
    if (mediaType === 'video') formData.append('coverImage', coverImage);
    
    if (mediaType === 'image' && isUpload) {
      if (!file) {
        setError('Please select an image file to upload');
        setBtnLoading(false);
        return;
      }
      formData.append('image', file);
    } else {
      if (!imageUrl) {
        setError('Please provide an image URL');
        setBtnLoading(false);
        return;
      }
      formData.append('imageUrl', imageUrl);
    }

    try {
      if (isEditing) {
        await api.put(`/admin/gallery/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/admin/gallery', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      resetForm();
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} gallery item`);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/admin/gallery/${id}`);
        fetchItems();
      } catch (err) {
        alert('Failed to delete item');
      }
    }
  };

  const handleSyncYouTube = async () => {
    setIsSyncing(true);
    try {
      const response = await api.post('/admin/gallery/sync-youtube');
      alert(response.data.message || 'YouTube sync successful!');
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to sync with YouTube');
    } finally {
      setIsSyncing(false);
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
    <div className="space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Project Gallery</h1>
          <p className="text-gray-500 mt-2">Add or remove images from the project gallery showcase.</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            {isEditing ? (
              <><RiImageAddLine className="text-blue-600" size={24} /> Edit Gallery Image</>
            ) : (
              <><RiImageAddLine className="text-blue-600" size={24} /> Add New Image</>
            )}
          </h2>
          {isEditing && (
            <button 
              onClick={resetForm}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all border border-gray-200"
            >
              Cancel Edit
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Image Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none border"
                placeholder="Ex: Tournament Final Match"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none border cursor-pointer"
              >
                <option value="General">General</option>
                <option value="Matches">Matches</option>
                <option value="Training">Training</option>
                <option value="Events">Events</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 ml-1">Media Type</label>
              <div className="flex p-1 bg-gray-100 rounded-2xl w-fit">
                <button
                  type="button"
                  onClick={() => { setMediaType('image'); setIsUpload(false); }}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${mediaType === 'image' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                >
                  Image
                </button>
                <button
                  type="button"
                  onClick={() => { setMediaType('video'); setIsUpload(false); }}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${mediaType === 'video' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                >
                  Video / Short
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex p-1 bg-gray-100 rounded-2xl w-fit">
                {mediaType === 'image' && (
                  <>
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
                  </>
                )}
                {mediaType === 'video' && (
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 rounded-xl text-sm font-bold shadow-sm">
                    <RiLinksLine /> Video URL Support
                  </div>
                )}
              </div>

              {isUpload ? (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Select File</label>
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-3.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all cursor-pointer bg-gray-50 rounded-2xl border border-dashed border-gray-300 p-2"
                    />
                  </div>
                </div>
              ) : mediaType === 'image' ? (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Image URL</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none border"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                ) : (
                  <>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Video Link (YouTube/Vimeo)</label>
                    <input
                      type="url"
                      required
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none border"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                  <div className="space-y-2 mt-4">
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                      Cover / Thumbnail Image URL <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="url"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none border"
                      placeholder="https://... (custom thumbnail image URL)"
                    />
                    <p className="text-xs text-gray-400 ml-1">If left blank, YouTube thumbnail will be used automatically.</p>
                  </div>
                  </>
                )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100">
                <RiErrorWarningLine size={18} />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={btnLoading}
              className="w-full bg-blue-600 text-white rounded-2xl px-6 py-4 font-bold text-sm hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {btnLoading ? 'Processing...' : (isEditing ? 'Update Gallery Item' : 'Add to Project Gallery')}
            </button>
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            Existing Items
          </h2>
          <button
            onClick={handleSyncYouTube}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {isSyncing ? <RiLoader4Line className="animate-spin" /> : <RiLinksLine />}
            {isSyncing ? 'Syncing...' : 'Sync YouTube Videos'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                <img
                  src={
                    item.type === 'video' 
                      ? (item.coverImage || (() => {
                          const ytMatch = item.imageUrl?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([^?&]+)/);
                          return ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg` : 'https://via.placeholder.com/300x200?text=Video';
                        })())
                      : item.imageUrl
                  }
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2.5 bg-white text-blue-600 rounded-xl shadow-lg hover:bg-blue-600 hover:text-white transition-all border border-blue-50"
                    title="Edit Title"
                  >
                    <RiImageAddLine size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2.5 bg-white text-red-600 rounded-xl shadow-lg hover:bg-red-600 hover:text-white transition-all border border-blue-50"
                  >
                    <RiDeleteBin7Line size={18} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-bold text-blue-600 uppercase tracking-widest shadow-sm">
                    {item.category}
                  </span>
                  {item.type === 'video' && (
                    <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm">
                      Video
                    </span>
                  )}
                  {item.source === 'youtube' && (
                    <span className="px-3 py-1 bg-red-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm flex items-center gap-1">
                      YouTube
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 truncate">
                  {item.type === 'video' ? '📺 ' : ''}{item.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">Added: {new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
          
          {items.length === 0 && (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">No items found in the gallery.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageGallery;
