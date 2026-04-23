import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/apiConfig';
import { RiLoader4Line, RiCloseLine, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

const GalleryContent = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await api.get('/admin/gallery');
        setGallery(response.data);
      } catch (error) {
        console.error('Failed to fetch gallery', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const handleNext = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!selectedImage || gallery.length === 0) return;
    const currentIndex = gallery.findIndex(item => item._id === selectedImage._id);
    const nextIndex = (currentIndex + 1) % gallery.length;
    setSelectedImage(gallery[nextIndex]);
  }, [selectedImage, gallery]);

  const handlePrev = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!selectedImage || gallery.length === 0) return;
    const currentIndex = gallery.findIndex(item => item._id === selectedImage._id);
    const prevIndex = (currentIndex - 1 + gallery.length) % gallery.length;
    setSelectedImage(gallery[prevIndex]);
  }, [selectedImage, gallery]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    if (selectedImage) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, handleNext, handlePrev]);

  // Helper to convert YouTube/Vimeo URLs to embed format
  const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
      // YouTube
      const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([^?&]+)/);
      if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
      
      // Vimeo
      const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
      if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      
      return url;
    } catch (e) {
      return url;
    }
  };

  if (loading) {
    return (
      <section className="bg-[#131b23] py-24 px-6 text-center text-gray-300">
        <RiLoader4Line className="animate-spin text-blue-500 mx-auto" size={40} />
      </section>
    );
  }

  return (
    <>
      <section className="bg-[#131b23] py-12 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {gallery.length === 0 ? (
            <div className="text-center text-gray-400 italic py-12">No gallery items found.</div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {gallery.map((item) => (
                <div 
                  key={item._id} 
                  onClick={() => setSelectedImage(item)}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg bg-[#1a242f] border border-gray-800"
                >
                  <div className="aspect-square w-full relative">
                    {item.type === 'video' ? (
                      <div className="w-full h-full relative">
                        {/* Show coverImage or auto-extracted YouTube thumbnail */}
                        <img
                          src={
                            item.coverImage ||
                            (() => {
                              const ytMatch = item.imageUrl?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([^?&]+)/);
                              return ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg` : null;
                            })()
                          }
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => { e.target.style.display='none'; }}
                        />
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all" />
                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/40 backdrop-blur-md group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-500 z-10">
                            <RiArrowRightSLine size={36} className="ml-1" />
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 bg-indigo-600 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md text-white shadow-lg">
                          Video
                        </div>
                      </div>
                    ) : (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-[#131b23] via-transparent to-transparent opacity-40" />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-[#131b23] via-[#131b23]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6 text-left">
                    <span className="text-blue-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-1.5">{item.category}</span>
                    <h3 className="text-white font-black text-sm md:text-lg leading-tight uppercase tracking-tight line-clamp-2">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md transition-all"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button 
            type="button"
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[60]"
            onClick={() => setSelectedImage(null)}
          >
            <RiCloseLine size={32} />
          </button>

          {/* Navigation Buttons */}
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all hidden md:flex items-center justify-center z-[60]"
            onClick={handlePrev}
          >
            <RiArrowLeftSLine size={40} />
          </button>

          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all hidden md:flex items-center justify-center z-[60]"
            onClick={handleNext}
          >
            <RiArrowRightSLine size={40} />
          </button>
          
          <div 
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedImage.type === 'video' ? (
              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                <iframe
                  src={getEmbedUrl(selectedImage.imageUrl)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedImage.title}
                />
              </div>
            ) : (
              <img 
                src={selectedImage.imageUrl} 
                alt={selectedImage.title} 
                className="w-auto max-h-[75vh] object-contain rounded-xl shadow-2xl transition-all duration-300"
              />
            )}
            <div className="mt-8 flex flex-col items-center gap-2">
              <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight text-center max-w-2xl uppercase">
                {selectedImage.title}
              </h3>
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-widest">
                <span className="text-blue-500">{selectedImage.category}</span>
                <span className="text-gray-600">•</span>
                <div className="flex gap-1.5 text-gray-400">
                  <span>{gallery.findIndex(item => item._id === selectedImage._id) + 1}</span>
                  <span className="opacity-30">/</span>
                  <span>{gallery.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryContent;
