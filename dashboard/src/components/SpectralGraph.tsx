"use client";

import React from 'react';

export default function SpectralGraph() {
  // SVG Area Chart - Hardcoded path for visual excellence
  return (
    <div className="w-full h-32 relative group cursor-pointer mt-4">
      <div className="absolute inset-0 flex items-end">
        <svg viewBox="0 0 400 100" className="w-full h-full preserve-3d">
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="spectral-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0, 242, 255, 0.4)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          
          {/* Area Path */}
          <path 
            d="M0,80 C50,70 100,90 150,60 C200,30 250,50 300,40 C350,30 400,10 400,10 L400,100 L0,100 Z" 
            fill="url(#spectral-grad)" 
            className="transition-all duration-700 ease-out group-hover:opacity-80"
          />
          
          {/* Line Path */}
          <path 
            d="M0,80 C50,70 100,90 150,60 C200,30 250,50 300,40 C350,30 400,10 400,10" 
            fill="none" 
            stroke="#00f2ff" 
            strokeWidth="2"
            strokeLinecap="round"
            className="drop-shadow-[0_0_8px_rgba(0,242,255,0.6)]"
          />

          {/* Glowing Points */}
          <circle cx="150" cy="60" r="3" fill="#00f2ff" className="animate-pulse" />
          <circle cx="300" cy="40" r="3" fill="#bc13fe" />
          <circle cx="400" cy="10" r="3" fill="#00f2ff" opacity="0.6" />
        </svg>
      </div>
      
      {/* Dynamic Data Point Hover (Visual Only) */}
      <div className="absolute top-0 right-0 p-2 bg-black/40 backdrop-blur-md border border-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
         <span className="text-[10px] font-black font-mono text-blue-400">PEAK INFERENCE: +244%</span>
      </div>
    </div>
  );
}
