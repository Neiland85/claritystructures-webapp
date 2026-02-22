"use client";

export default function AnimatedLogo() {
  return (
    <div className="flex flex-col items-center gap-4 select-none group">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          {/* Hexagon Outline */}
          <path
            d="M50 10 L84.6 30 L84.6 70 L50 90 L15.4 70 L15.4 30 Z"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            strokeOpacity="0.2"
          />

          {/* Internal Network */}
          <g className="logo-anim">
            {/* Center to Points */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="10"
              stroke="white"
              strokeWidth="1"
            />
            <line
              x1="50"
              y1="50"
              x2="84.6"
              y2="30"
              stroke="white"
              strokeWidth="1"
            />
            <line
              x1="50"
              y1="50"
              x2="84.6"
              y2="70"
              stroke="white"
              strokeWidth="1"
            />
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="90"
              stroke="white"
              strokeWidth="1"
            />
            <line
              x1="50"
              y1="50"
              x2="15.4"
              y2="70"
              stroke="white"
              strokeWidth="1"
            />
            <line
              x1="50"
              y1="50"
              x2="15.4"
              y2="30"
              stroke="white"
              strokeWidth="1"
            />
            {/* Dots */}
            <circle cx="50" cy="50" r="2.5" fill="white" /> {/* Center */}
            <circle cx="50" cy="10" r="4" fill="white" /> {/* Top */}
            {/* Nodes on Hexagon */}
            <circle cx="84.6" cy="30" r="2" fill="white" />
            <circle cx="84.6" cy="70" r="2" fill="white" />
            <circle cx="50" cy="90" r="2" fill="white" />
            <circle cx="15.4" cy="70" r="2" fill="white" />
            <circle cx="15.4" cy="30" r="2" fill="white" />
            {/* Intermediate nodes */}
            <circle cx="67.3" cy="40" r="1.5" fill="white" />
            <circle cx="67.3" cy="60" r="1.5" fill="white" />
            <circle cx="50" cy="70" r="1.5" fill="white" />
            <circle cx="32.7" cy="60" r="1.5" fill="white" />
            <circle cx="32.7" cy="40" r="1.5" fill="white" />
            <circle cx="50" cy="30" r="1.5" fill="white" />
          </g>
        </svg>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-[0.2em] text-white m-0 leading-none">
          CLARITY
        </h2>
        <p className="text-[10px] tracking-[0.4em] text-white/60 mt-2 font-light">
          STRUCTURES SLU
        </p>
        <div className="w-1 h-1 bg-white/40 rounded-full mx-auto mt-4"></div>
      </div>
    </div>
  );
}
