import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/apiConfig';
import { uploadToCloudinary } from '../utils/cloudinaryHelper';
import { RiFileUploadLine, RiArrowRightLine, RiLoader4Line, RiCheckLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

const DocumentVerifyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [fee, setFee] = useState(0);
  
  const [documentFile, setDocumentFile] = useState(null);
  const [documentUrl, setDocumentUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/document-verification/categories');
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const catName = e.target.value;
    setSelectedCategory(catName);
    const cat = categories.find(c => c.name === catName);
    if (cat) {
      setFee(cat.fee);
    } else {
      setFee(0);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setDocumentUrl(url);
      setDocumentFile(file);
    } catch (err) {
      console.error(err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e, paymentDetails = null) => {
    if (e) e.preventDefault();
    if (!user) {
      alert("Please login first to submit a document for verification.");
      navigate('/login');
      return;
    }
    
    if (!selectedCategory) {
      alert("Please select a document category.");
      return;
    }
    
    if (!documentUrl) {
      alert("Please upload a document.");
      return;
    }

    // Initiate payment if fee is required and payment hasn't been made
    if (fee > 0 && !paymentDetails) {
      setIsSubmitting(true);
      try {
        const { data } = await api.post('/payment/create-doc-verify-order', {
          categoryName: selectedCategory
        });

        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: "INR",
          name: "HKCA Portal",
          description: `Document Verification Fee for ${selectedCategory}`,
          order_id: data.orderId,
          handler: function (response) {
            // Payment successful, proceed to submit
            handleSubmit(null, response);
          },
          prefill: {
            name: user?.username || 'User',
            email: user?.email || '',
          },
          theme: {
            color: "#2563eb",
          },
          modal: {
            ondismiss: function() {
              setIsSubmitting(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error('Payment Error:', err);
        alert(err.response?.data?.message || 'Error initializing payment.');
        setIsSubmitting(false);
      }
      return; // Stop execution until payment is complete
    }

    setIsSubmitting(true);
    try {
      await api.post('/document-verification/submit', {
        documentCategory: selectedCategory,
        documentUrl: documentUrl,
        feePaid: fee,
        transactionId: paymentDetails?.razorpay_payment_id || null,
        paymentStatus: paymentDetails ? 'Completed' : (fee > 0 ? 'Pending' : 'Completed')
      });
      setSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0d1117] pt-32 pb-12 font-sans flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#161b22] p-12 rounded-3xl border border-slate-800 flex flex-col items-center max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
            <RiCheckLine size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Request Submitted</h2>
          <p className="text-slate-400 mb-8">
            Your document verification request has been successfully submitted. We will review it shortly.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] pt-24 pb-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Document <span className="text-blue-500">Verification</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto">
            Upload your firm's documents to get them verified by the administration.
          </p>
        </div>

        <div className="bg-[#161b22] rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-800/50">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="space-y-3">
              <label className="text-sm font-black uppercase tracking-wider text-slate-400">Document Category</label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full bg-[#0d1117] border border-slate-800 text-white px-6 py-4 rounded-2xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold appearance-none"
                required
              >
                <option value="" disabled>Select Category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black uppercase tracking-wider text-slate-400">Upload Document</label>
              <div className={`relative border-2 border-dashed rounded-3xl p-8 transition-all flex flex-col items-center justify-center ${documentUrl ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-800 bg-[#0d1117] hover:border-slate-600'}`}>
                {isUploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <RiLoader4Line className="animate-spin text-blue-500" size={32} />
                    <span className="text-blue-500 font-bold text-sm">Uploading...</span>
                  </div>
                ) : documentUrl ? (
                  <div className="flex flex-col items-center gap-3">
                    <RiCheckLine className="text-emerald-500" size={32} />
                    <span className="text-emerald-500 font-bold text-sm">{documentFile?.name || 'File Uploaded Successfully'}</span>
                    <button 
                      type="button" 
                      onClick={() => { setDocumentUrl(''); setDocumentFile(null); }}
                      className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <RiFileUploadLine className="text-slate-500" size={40} />
                    <span className="text-slate-400 font-medium">Click to browse or drag and drop</span>
                    <span className="text-slate-600 text-xs uppercase tracking-widest">JPG, PNG, PDF</span>
                  </div>
                )}
                {!documentUrl && !isUploading && (
                  <input 
                    type="file" 
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*,.pdf"
                  />
                )}
              </div>
            </div>

            {selectedCategory && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex justify-between items-center">
                <span className="text-blue-400 font-bold">Applicable Fee:</span>
                <span className="text-white text-2xl font-black">₹{fee}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !documentUrl || !selectedCategory}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg py-5 rounded-2xl transition-all flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RiLoader4Line className="animate-spin" size={24} /> Processing...
                </>
              ) : (
                <>
                  Submit Request <RiArrowRightLine size={24} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentVerifyPage;
