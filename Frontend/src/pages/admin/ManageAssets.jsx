import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';
import { 
  RiFileUploadLine, 
  RiDeleteBin7Line, 
  RiFileCopyLine, 
  RiCheckLine,
  RiLoader4Line,
  RiExternalLinkLine,
  RiImage2Line
} from 'react-icons/ri';

const ManageAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]); // Array of IDs
  
  // Form State
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState([]); // Support multiple files

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const [assetsRes, galleryRes, eventsRes, resultsRes] = await Promise.all([
        api.get('/admin/assets'),
        api.get('/admin/gallery'),
        api.get('/admin/events/all'),
        api.get('/admin/publications/all')
      ]);

      const consolidated = [
        ...assetsRes.data.map(item => ({ ...item, source: 'Library' })),
        ...galleryRes.data.map(item => ({ ...item, source: 'Gallery', url: item.imageUrl })),
        ...eventsRes.data.map(item => ({ ...item, source: 'Event', url: item.imageUrl })),
        ...resultsRes.data.map(item => ({ ...item, source: 'Result', url: item.imageUrl }))
      ].filter(item => item.url && !item.url.includes('.pdf')) // Filter out non-images
       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setAssets(consolidated);
      setSelectedIds([]); // Reset selection on refresh
    } catch (err) {
      console.error('Error fetching consolidated assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert('Please select at least one file');

    setUploading(true);
    const formData = new FormData();
    
    // If only one file and title provided, use single upload
    if (files.length === 1 && title) {
      formData.append('title', title);
      formData.append('image', files[0]);
      try {
        await api.post('/admin/assets', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalizeUpload();
      } catch (err) {
        handleError(err);
      }
    } else {
      // Bulk upload
      files.forEach(file => {
        formData.append('images', file);
      });
      try {
        await api.post('/admin/assets/bulk', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalizeUpload();
      } catch (err) {
        handleError(err);
      }
    }
  };

  const finalizeUpload = () => {
    setTitle('');
    setFiles([]);
    if (document.getElementById('fileInput')) {
      document.getElementById('fileInput').value = '';
    }
    fetchAssets();
    setUploading(false);
  };

  const handleError = (err) => {
    alert('Upload failed: ' + (err.response?.data?.message || err.message));
    setUploading(false);
  };

  const handleDelete = async (asset) => {
    const sourceMap = {
      Library: { url: '/admin/assets', label: 'Library Asset' },
      Gallery: { url: '/admin/gallery', label: 'Gallery Entry' },
      Event: { url: '/admin/events', label: 'Full Event Listing' },
      Result: { url: '/admin/publications', label: 'Official Result Page' }
    };

    const config = sourceMap[asset.source];
    
    if (window.confirm(`Paka Confirm Delete?\n\nDeleting this image will also PERMANENTLY REMOVE the associated ${config.label} from the site.`)) {
      try {
        await api.delete(`${config.url}/${asset._id}`);
        fetchAssets();
      } catch (err) {
        alert(`Delete failed for ${asset.source}: ` + (err.response?.data?.message || err.message));
      }
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === assets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(assets.map(a => a._id));
    }
  };

  const handleBulkDelete = async () => {
    const count = selectedIds.length;
    if (count === 0) return;

    if (window.confirm(`PAKA CONFIRM DELETE?\n\nYou are about to delete ${count} selected items. This will also delete their associated site content. Are you sure?`)) {
      setLoading(true);
      try {
        const sourceMap = {
          Library: '/admin/assets',
          Gallery: '/admin/gallery',
          Event: '/admin/events',
          Result: '/admin/publications'
        };

        const deletePromises = selectedIds.map(id => {
          const asset = assets.find(a => a._id === id);
          const url = sourceMap[asset.source];
          return api.delete(`${url}/${id}`);
        });

        await Promise.all(deletePromises);
        alert('Items deleted successfully');
        fetchAssets();
      } catch (err) {
        alert('Some items failed to delete');
        fetchAssets();
      }
    }
  };

  const copyToClipboard = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RiLoader4Line className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const getSourceBadge = (source) => {
    const styles = {
      Library: 'bg-blue-600 text-white',
      Gallery: 'bg-purple-600 text-white',
      Event: 'bg-indigo-600 text-white',
      Result: 'bg-emerald-600 text-white'
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${styles[source] || 'bg-gray-600 text-white'}`}>
        {source}
      </span>
    );
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Media Library</h1>
          <p className="text-gray-500 mt-2">Find and grab links for EVERY image on your site in one place.</p>
        </div>
        
        {assets.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={selectAll}
              className="px-6 py-3 rounded-2xl text-sm font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
            >
              {selectedIds.length === assets.length ? 'Deselect All' : 'Select All'}
            </button>
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-6 py-3 rounded-2xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center gap-2"
              >
                <RiDeleteBin7Line size={18} />
                Delete ({selectedIds.length})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <RiFileUploadLine className="text-blue-600" size={24} />
          Upload New Library Asset
        </h2>
        
        <form onSubmit={handleUpload} className="flex flex-col md:flex-row items-end gap-6">
          <div className="flex-1 space-y-2 w-full">
            <label className="text-sm font-semibold text-gray-700 ml-1">Asset Name (Optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:bg-white focus:border-blue-600 transition-all outline-none border"
              placeholder={files.length > 1 ? "Auto-named (Bulk)" : "Ex: Homepage Banner"}
              disabled={files.length > 1}
            />
          </div>

          <div className="flex-1 space-y-2 w-full">
            <label className="text-sm font-semibold text-gray-700 ml-1">Select Image</label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all cursor-pointer bg-gray-50 rounded-2xl border border-dashed border-gray-300 p-2"
            />
            {files.length > 0 && (
              <p className="text-[11px] text-blue-600 font-bold mt-2 ml-1">
                {files.length} {files.length === 1 ? 'file' : 'files'} selected for upload
              </p>
            )}
          </div>

            <button
              type="submit"
              disabled={uploading || files.length === 0}
              className="bg-blue-600 text-white rounded-2xl px-8 py-4 font-bold text-sm hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 disabled:opacity-70 h-[58px]"
            >
              {uploading ? (
                <div className="flex items-center gap-2">
                  <RiLoader4Line className="animate-spin" size={20} />
                  {files.length > 1 ? `Uploading ${files.length}...` : 'Uploading...'}
                </div>
              ) : (
                `Upload ${files.length > 1 ? `${files.length} Assets` : 'Asset'}`
              )}
            </button>
        </form>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {assets.map((asset) => (
          <div 
            key={asset._id} 
            className={`bg-white rounded-3xl border shadow-sm overflow-hidden group hover:shadow-md transition-all relative ${
              selectedIds.includes(asset._id) ? 'ring-4 ring-blue-500 border-blue-500' : 'border-gray-100'
            }`}
          >
            {/* Selection Checkbox */}
            <div className={`absolute top-3 left-3 z-10 transition-all duration-300 ${selectedIds.includes(asset._id) ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100'}`}>
              <button
                onClick={() => toggleSelection(asset._id)}
                className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                  selectedIds.includes(asset._id) 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white/80 backdrop-blur border-white/50 text-transparent'
                }`}
              >
                <RiCheckLine size={20} />
              </button>
            </div>

            <div 
              className="aspect-square relative overflow-hidden bg-gray-100 cursor-pointer"
              onClick={() => toggleSelection(asset._id)}
            >
              <img
                src={asset.url}
                alt={asset.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(asset); }}
                  className="p-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors"
                  title={`Delete ${asset.source} Item`}
                >
                  <RiDeleteBin7Line size={16} />
                </button>
              </div>
              <div className="absolute bottom-3 left-3">
                {getSourceBadge(asset.source)}
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 truncate text-sm">{asset.title}</h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <a 
                  href={asset.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <RiExternalLinkLine size={18} />
                </a>
              </div>

              <button
                onClick={() => copyToClipboard(asset.url, asset._id)}
                className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all border ${
                  copiedId === asset._id 
                    ? 'bg-green-50 border-green-200 text-green-600' 
                    : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-white hover:border-blue-600 hover:text-blue-600'
                }`}
              >
                {copiedId === asset._id ? (
                  <><RiCheckLine size={16} /> Link Copied!</>
                ) : (
                  <><RiFileCopyLine size={16} /> Copy Direct Link</>
                )}
              </button>
            </div>
          </div>
        ))}

        {assets.length === 0 && (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
            <RiImage2Line className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-400 font-medium">Your media library is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAssets;
