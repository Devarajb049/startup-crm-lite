import React from 'react';
import { useLeads } from '../../context/LeadContext';
import { CheckCircle, Info, Calendar, AlertCircle, Trash2, CheckSquare, BellOff, X } from 'lucide-react';

/**
 * NotificationDropdown Component
 * Renders a glassmorphic floating panel with recent dynamic CRM notifications.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Dropdown open state
 * @param {Function} props.onClose - Dropdown close callback
 */
const NotificationDropdown = ({ isOpen, onClose }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    deleteNotification
  } = useLeads();

  if (!isOpen) return null;

  // Resolve visual icon & styling details based on notification type
  const getNotificationConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-green-500 bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30'
        };
      case 'warning':
        return {
          icon: Calendar,
          color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30'
        };
      case 'danger':
        return {
          icon: AlertCircle,
          color: 'text-red-500 bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30'
        };
      case 'info':
      default:
        return {
          icon: Info,
          color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30'
        };
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Backdrop overlay to close dropdown on clicking outside */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Dropdown Panel Container */}
      <div className="absolute right-0 mt-3 w-80 sm:w-96 max-h-[480px] z-50 flex flex-col bg-floating/85 backdrop-blur-2xl border border-border/50 dark:border-border/10 rounded-2xl shadow-2xl transition-all duration-200 animate-fade-in origin-top-right">

        {/* Dropdown Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/40 dark:border-border/10">
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Recent Notifications
            </h4>
            {unreadCount > 0 && (
              <span className="text-[9px] bg-primary text-white font-extrabold px-1.5 py-0.5 rounded-full shrink-0 select-none">
                {unreadCount} new
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 focus:outline-hidden md:hidden"
            aria-label="Close notifications"
          >
            <X size={15} />
          </button>
        </div>

        {/* Action Toolbar */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2 bg-bg/25 dark:bg-surface/25 border-b border-border/30 dark:border-border/10 text-[10px]">
            <button
              type="button"
              onClick={markAllNotificationsAsRead}
              className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white font-semibold cursor-pointer transition-colors focus:outline-hidden"
            >
              <CheckSquare size={12} />
              <span>Mark all as read</span>
            </button>
            <button
              type="button"
              onClick={clearNotifications}
              className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-danger dark:hover:text-red-400 font-semibold cursor-pointer transition-colors focus:outline-hidden"
            >
              <Trash2 size={12} />
              <span>Clear all</span>
            </button>
          </div>
        )}

        {/* Notifications Scroll Area */}
        <div className="flex-1 overflow-y-auto max-h-[350px] divide-y divide-border/40 dark:divide-border/10">
          {notifications.length > 0 ? (
            notifications.map((notif) => {
              const config = getNotificationConfig(notif.type);
              const Icon = config.icon;

              return (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`flex items-start gap-3 p-4 hover:bg-hover/70 dark:hover:bg-hover/40 cursor-pointer transition-all duration-150 relative ${!notif.read ? 'bg-active-nav/20 dark:bg-active-nav/5' : ''
                    }`}
                >
                  {/* Category Indicator Icon */}
                  <div className={`p-2 rounded-xl border shrink-0 ${config.color}`}>
                    <Icon size={14} />
                  </div>

                  {/* Message Details */}
                  <div className="flex-1 min-w-0 pr-1">
                    <p className={`text-xs font-bold text-slate-900 dark:text-white ${!notif.read ? 'font-extrabold' : 'font-semibold'}`}>
                      {notif.title}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed break-words">
                      {notif.message}
                    </p>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium block mt-1.5">
                      {notif.time}
                    </span>
                  </div>

                  {/* Action controls: Dismiss & Unread Dot */}
                  <div className="flex flex-col items-center justify-between gap-2.5 self-stretch shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-hover dark:hover:bg-hover/80 transition-colors focus:outline-hidden cursor-pointer"
                      title="Dismiss alert"
                      aria-label="Dismiss alert"
                    >
                      <X size={11} />
                    </button>

                    {!notif.read ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary border border-white dark:border-card shadow-xs shrink-0" />
                    ) : (
                      <div className="w-1.5 h-1.5 shrink-0" />
                    )}
                  </div>

                </div>
              );
            })
          ) : (
            /* Empty State Layout */
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center select-none">
              <div className="p-3.5 bg-bg dark:bg-surface text-slate-400 dark:text-slate-500 rounded-full border border-border dark:border-border/30 mb-3.5">
                <BellOff size={22} />
              </div>
              <h5 className="text-xs font-bold text-slate-805 dark:text-slate-350">
                All caught up!
              </h5>
              <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                You have no new alerts. New pipeline changes will appear here.
              </p>
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default NotificationDropdown;
