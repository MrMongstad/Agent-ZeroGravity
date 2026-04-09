import React from 'react';

export default function NexusCore() {
  return (
    <div className="relative flex items-center justify-center w-full h-full py-12">
      {/* Outer Rotating Ring */}
      <div className="absolute w-40 h-40 border-2 border-dashed border-blue-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
      
      {/* Inner Glowing Ring */}
      <div className="absolute w-32 h-32 border-[1px] border-blue-400/40 rounded-full animate-[spin_6s_linear_infinite_reverse] shadow-[0_0_20px_rgba(0,242,255,0.1)]" />
      
      {/* Central Core */}
      <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.3)]">
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse shadow-[0_0_15px_#00f2ff]" />
        </div>
      </div>

      {/* Atmospheric Particles (CSS Only) */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-500 rounded-full animate-ping" />
         <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-purple-500 rounded-full animate-ping [animation-delay:1s]" />
      </div>
    </div>
  );
}
