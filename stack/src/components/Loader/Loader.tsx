import React from 'react';

export default function Loader({ text = "Questions" }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="relative">
        {/* Stack of cards animation */}
        <div className="relative w-48 h-56">
          {/* Card 3 - back */}
          <div className="absolute inset-0 bg-orange-100 rounded-lg shadow-sm animate-[float_2s_ease-in-out_infinite_0.4s]" 
               style={{transform: 'translateY(16px) scale(0.94)'}} />
          
          {/* Card 2 - middle */}
          <div className="absolute inset-0 bg-orange-200 rounded-lg shadow-md animate-[float_2s_ease-in-out_infinite_0.2s]" 
               style={{transform: 'translateY(8px) scale(0.97)'}} />
          
          {/* Card 1 - front */}
          <div className="absolute inset-0 bg-orange-400 rounded-lg shadow-lg animate-[float_2s_ease-in-out_infinite] flex flex-col items-center justify-center p-6">
            {/* Question mark icon */}
            <div className="text-white text-6xl font-bold mb-2 animate-pulse">?</div>
            <div className="w-12 h-1 bg-white rounded-full mb-3"></div>
            <div className="w-8 h-1 bg-white/70 rounded-full"></div>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading {text}</h2>
          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.02);
          }
        }
      `}</style>
    </div>
  );
}