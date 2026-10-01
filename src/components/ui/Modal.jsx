import React from 'react';
import { CircleX } from 'lucide-react'; // Agar aap Lucide icons use kar rahe hain

function Modal({ isOpen, onClose, title, children }) {
  // Agar modal open nahi hai, toh kuch bhi render mat karo
  if (!isOpen) return null;

  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Modal Box */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <CircleX className="w-6 h-6" />
          </button>
        </div>

        {/* Body (Yahan aap apna content ya form pass karenge) */}
        <div className="px-6 py-4">
          {children}
        </div>
        
      </div>
    </div>
  );
}

export default Modal;