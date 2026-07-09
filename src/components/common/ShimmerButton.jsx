import React from 'react';

/**
 * ShimmerButton Component
 * Renders a premium, animated button with a revolving shimmer border effect.
 * Supports configurable padding parameters (px, py).
 */
const ShimmerButton = ({
  children,
  className = '',
  shimmerColor = 'rgba(255, 255, 255, 0.7)',
  shimmerDuration = '3s',
  borderRadius = '12px',
  px = 'px-5',
  py = 'py-2.5',
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`relative overflow-hidden p-[1px] group active:scale-95 transition-all duration-300 hover:shadow-lg hover:shadow-primary/15 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 ${className}`}
      style={{
        borderRadius,
        '--shimmer-color': shimmerColor,
        '--shimmer-duration': shimmerDuration,
      }}
      {...props}
    >
      {/* Background rotating shimmer sweep */}
      <span
        className="absolute inset-[-150%] animate-[spin_var(--shimmer-duration)_linear_infinite] bg-[conic-gradient(from_0deg,transparent_25%,var(--shimmer-color)_50%,transparent_75%)] opacity-35 group-hover:opacity-65 transition-opacity duration-300 pointer-events-none"
        style={{ transformOrigin: 'center center' }}
      />

      {/* Inner solid content surface */}
      <span
        className={`relative z-10 flex items-center justify-center gap-1.5 ${px} ${py} text-white bg-primary hover:bg-blue-600 transition-colors w-full h-full font-bold text-xs uppercase tracking-wider`}
        style={{ borderRadius: `calc(${borderRadius} - 1px)` }}
      >
        {children}
      </span>
    </button>
  );
};

export default ShimmerButton;
