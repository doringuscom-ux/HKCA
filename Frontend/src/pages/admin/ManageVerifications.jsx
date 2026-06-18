import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';
import { 
  RiFolderShield2Line, 
  RiCheckLine, 
  RiCloseLine, 
  RiEyeLine, 
  RiAddLine,
  RiDeleteBinLine,
  RiLoader4Line,
  RiEditLine
} from 'react-icons/ri';

const ManageVerifications = () => {
  const [activeTab, setActiveTab] = useState('submissions'); // 'submissions' or 'categories'
  
  // Submissions State
  const [verifications, setVerifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Categories State
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatFee, setNewCatFee] = useState(0);
  const [isSavingCat, setIsSavingCat] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchVerifications();
    fetchCategories();
  }, []);

  const fetchVerifications = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/admin/document-verifications');
      setVerifications(data);
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/admin/settings/document-categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const { data } = await api.put(`/admin/document-verifications/${id}/status`, { status: newStatus });
      setVerifications(prev => prev.map(v => v._id === id ? data : v));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName) return;
    
    setIsSavingCat(true);
    try {
      let updatedCategories = [...categories];
      if (editIndex !== null) {
        updatedCategories[editIndex] = { name: newCatName, fee: Number(newCatFee) };
      } else {
        updatedCategories.push({ name: newCatName, fee: Number(newCatFee) });
      }
      
      const { data } = await api.put('/admin/settings/document-categories', {
        documentCategories: updatedCategories
      });
      setCategories(data);
      setNewCatName('');
      setNewCatFee(0);
      setEditIndex(null);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    } finally {
      setIsSavingCat(false);
    }
  };

  const handleEditClick = (idx, cat) => {
    setEditIndex(idx);
    setNewCatName(cat.name);
    setNewCatFee(cat.fee);
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setNewCatName('');
    setNewCatFee(0);
  };

  const handleDeleteCategory = async (indexToDelete) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    setIsSavingCat(true);
    try {
      const updatedCategories = categories.filter((_, idx) => idx !== indexToDelete);
      const { data } = await api.put('/admin/settings/document-categories', {
        documentCategories: updatedCategories
      });
      setCategories(data);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    } finally {
      setIsSavingCat(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <RiFolderShield2Line size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Document Verifications</h1>
            <p className="text-gray-500 text-sm">Manage user document submissions and categories.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`pb-4 px-2 font-bold transition-all ${
            activeTab === 'submissions' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Submissions
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-4 px-2 font-bold transition-all ${
            activeTab === 'categories' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Manage Categories
        </button>
      </div>

      {activeTab === 'submissions' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fee</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Document</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-400">
                      <RiLoader4Line className="animate-spin inline-block mr-2" size={24} /> Loading...
                    </td>
                  </tr>
                ) : verifications.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-400">No submissions found.</td>
                  </tr>
                ) : (
                  verifications.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-gray-800">{item.user?.username || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{item.user?.email}</div>
                      </td>
                      <td className="p-4 font-medium text-gray-700">{item.documentCategory}</td>
                      <td className="p-4 text-gray-600 font-bold">₹{item.feePaid}</td>
                      <td className="p-4 text-gray-500 text-sm">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <a 
                          href={item.documentUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 px-3 py-1 rounded-lg w-max transition-colors"
                        >
                          <RiEyeLine /> View Doc
                        </a>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          item.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
                          item.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          {item.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(item._id, 'Verified')}
                                className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <RiCheckLine size={20} />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(item._id, 'Rejected')}
                                className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <RiCloseLine size={20} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                {editIndex !== null ? 'Edit Category' : 'Add New Category'}
              </h3>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Category Name</label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-4 py-3 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    placeholder="e.g. Identity Proof"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Fee Amount (₹)</label>
                  <input
                    type="number"
                    value={newCatFee}
                    onChange={(e) => setNewCatFee(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-4 py-3 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSavingCat || !newCatName}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isSavingCat ? <RiLoader4Line className="animate-spin" /> : (editIndex !== null ? <RiCheckLine /> : <RiAddLine />)}
                    {editIndex !== null ? 'Update' : 'Add'}
                  </button>
                  {editIndex !== null && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <RiCloseLine /> Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category Name</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fee Amount</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-8 text-center text-gray-400">No categories found.</td>
                    </tr>
                  ) : (
                    categories.map((cat, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-bold text-gray-800">{cat.name}</td>
                        <td className="p-4 font-medium text-gray-600">₹{cat.fee}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleEditClick(idx, cat)}
                            className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-2"
                            title="Edit Category"
                          >
                            <RiEditLine size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(idx)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Category"
                          >
                            <RiDeleteBinLine size={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVerifications;
