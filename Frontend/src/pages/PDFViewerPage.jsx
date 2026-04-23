import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { RiArrowLeftLine, RiExternalLinkLine, RiDownloadLine, RiLoader4Line } from 'react-icons/ri';
import { motion } from 'framer-motion';

const PDFViewerPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(true);
    const queryParams = new URLSearchParams(location.search);
    const rawPdfUrl = queryParams.get('url');
    const title = queryParams.get('title') || 'HKCA Document';

    // Helper to transform Google Drive links for embedding
    const getEmbedUrl = (url) => {
        if (!url) return '';
        if (url.includes('drive.google.com')) {
            // Transform drive.google.com/file/d/ID/view to drive.google.com/file/d/ID/preview
            return url.replace(/\/view(\?.*)?$/, '/preview').replace(/\/edit(\?.*)?$/, '/preview');
        }
        // For standard PDFs, add toolbar/navpanes control
        return `${url}#toolbar=0&navpanes=0`;
    };

    const pdfUrl = getEmbedUrl(rawPdfUrl);

    if (!pdfUrl) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
                <div className="bg-white p-10 rounded-[3rem] shadow-xl text-center border border-slate-100 max-w-md">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">Oops! PDF Missing</h2>
                    <p className="text-slate-500 mb-8">It seems the link you followed doesn't point to a document.</p>
                    <Link to="/" className="inline-flex items-center gap-2 bg-[#0084ff] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-blue-100 hover:scale-105 transition-transform">
                        <RiArrowLeftLine /> Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-[#1a2128] flex flex-col font-sans overflow-hidden">
            {/* Minimal Premium Header */}
            <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between z-10 sticky top-0">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="text-white hover:text-[#0084ff] transition-colors p-2"
                        title="Go Back"
                    >
                        <RiArrowLeftLine size={24} />
                    </button>
                    <div className="hidden sm:block">
                        <h1 className="text-white text-sm font-black uppercase tracking-widest truncate max-w-xs md:max-w-lg">
                            {title}
                        </h1>
                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-tight">Official HKCA Publication</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <a 
                        href={pdfUrl} 
                        download
                        className="flex items-center gap-2 bg-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-white/20 transition-all border border-white/10"
                    >
                        <RiDownloadLine className="text-[#0084ff]" size={16} /> 
                        <span className="hidden xs:inline">Download</span>
                    </a>
                    <a 
                        href={pdfUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 bg-[#0084ff] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
                    >
                        <RiExternalLinkLine size={16} />
                        <span className="hidden xs:inline">Open in Browser</span>
                    </a>
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 relative overflow-hidden bg-[#131b1e]">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full flex items-center justify-center"
                >
                    <div className="w-full h-full bg-white relative group border-x border-white/5">
                        {/* Custom Loading State */}
                        {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-50">
                                <RiLoader4Line className="text-[#0084ff] animate-spin mb-4" size={48} />
                                <p className="text-white/40 text-xs font-bold uppercase tracking-widest text-center px-4">
                                    Initialising Secure Document Viewer...<br/>
                                    <span className="text-[10px] lowercase normal-case opacity-50 mt-2 block">If it takes too long, use the "Open in Browser" button above.</span>
                                </p>
                            </div>
                        )}
                        
                        <iframe 
                            src={pdfUrl} 
                            className="w-full h-full border-none relative z-10 bg-white"
                            title={title}
                            onLoad={() => setIsLoading(false)}
                            onError={() => setIsLoading(false)}
                        />
                    </div>
                </motion.div>
            </main>

        </div>
    );
};

export default PDFViewerPage;
