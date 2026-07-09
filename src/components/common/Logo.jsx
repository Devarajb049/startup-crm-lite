import React from 'react';

/**
 * Animated Transitioning Logo Component
 * Automatically transitions between A -> U -> R -> A.
 */
const Logo = ({ className = "w-8 h-8" }) => {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes logo-write {
          0% {
            stroke-dashoffset: 100;
          }
          45% {
            stroke-dashoffset: 0;
          }
          70% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -100;
          }
        }
        
        .logo-char-a {
          animation: logo-write 2.8s infinite ease-in-out;
          stroke: currentColor;
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
        }
      `}</style>

      {/* Character A Path with writing dash properties */}
      <path
        className="logo-char-a"
        d="M 7 25 L 16 7 L 25 25 M 11.5 17 L 20.5 17"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Logo;
