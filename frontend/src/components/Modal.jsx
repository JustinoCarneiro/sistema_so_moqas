import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, theme }) => {
  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl border transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b transition-colors ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50/50 border-gray-100'
            }`}>
              <h3 
                className={`text-xl font-black ${isDark ? 'text-slate-100' : 'text-slate-900'}`}
                style={!isDark ? { color: '#000000', fontWeight: '900' } : {}}
              >
                {title}
              </h3>
              <button
                onClick={onClose}
                aria-label="close-modal"
                className={`p-2 rounded-full transition-all ${
                  isDark ? 'hover:bg-slate-800 text-slate-500 hover:text-slate-100' : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'
                }`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
