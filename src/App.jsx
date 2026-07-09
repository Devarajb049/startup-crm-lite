import React, { useRef, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { AppRoutes } from './routes';

/**
 * SwipeableToast Component
 * Wraps react-hot-toast notifications in a draggable/swipeable container.
 * Dismisses notifications when dragged/swiped to the right beyond the threshold.
 */
const SwipeableToast = ({ toast: t }) => {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  const handleStart = (clientX) => {
    startX.current = clientX;
    setIsDragging(true);
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;
    const deltaX = clientX - startX.current;
    // Allow dragging to the right
    if (deltaX > 0) {
      setDragOffset(deltaX);
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 100) {
      // Dismiss toast on swipe right beyond threshold
      toast.dismiss(t.id);
    } else {
      setDragOffset(0);
    }
  };

  const onMouseDown = (e) => handleStart(e.clientX);
  const onMouseMove = (e) => handleMove(e.clientX);
  const onMouseUp = () => handleEnd();
  const onMouseLeave = () => handleEnd();

  const onTouchStart = (e) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e) => handleMove(e.touches[0].clientX);
  const onTouchEnd = () => handleEnd();

  const dragStyle = {
    transform: `translateX(${dragOffset}px)`,
    opacity: 1 - Math.min(dragOffset / 180, 1),
    transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    cursor: isDragging ? 'grabbing' : 'grab',
    userSelect: 'none',
  };

  return (
    <div
      style={dragStyle}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="touch-none"
    >
      <ToastBar toast={t} />
    </div>
  );
};

// Redirect direct path entry without a hash to its corresponding HashRouter route path
const pathname = window.location.pathname;
if (pathname !== '/' && !pathname.endsWith('/index.html') && !window.location.hash) {
  const targetHash = '#' + pathname + window.location.search;
  window.location.replace(window.location.origin + '/' + targetHash);
}

/**
 * App Component
 * The central root assembly for AuraCRM.
 */
const App = () => {
  return (
    <HashRouter>
      
      {/* Toast notifications popup layer supporting swipe-to-dismiss */}
      <Toaster position="top-right">
        {(t) => (
          <SwipeableToast toast={t} />
        )}
      </Toaster>
      
      {/* AppRoutes renders the lazy loaded content pages based on routes */}
      <AppRoutes />
      
    </HashRouter>
  );
};

export default App;