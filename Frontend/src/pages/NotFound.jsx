import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiGhostLine, RiArrowRightLine } from 'react-icons/ri';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-slate-50 font-sans">
      <div className="max-w-xl w-full text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          <div className="relative inline-block mb-8">
            <h1 className="text-[120px] md:text-[180px] font-black text-slate-200 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <RiGhostLine size={80} className="text-blue-500 animate-bounce" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">
            PADDLE LOST!
          </h2>
          <p className="text-slate-500 text-lg mb-10 font-medium italic">
            "Even the best athletes take a wrong turn sometimes. <br className="hidden md:block"/>
            The page you're looking for has drifted off course."
          </p>

          <Link 
            to="/" 
            className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all hover:-translate-y-1 active:scale-95"
          >
            Back to Shore (Home)
            <RiArrowRightLine size={20} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
