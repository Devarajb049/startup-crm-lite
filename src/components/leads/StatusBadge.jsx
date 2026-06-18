import React from 'react';
import { STATUS_COLORS } from '../../constants';

/**
 * @typedef {Object} StatusBadgeProps
 * @property {string} status - Pipeline stage status string (New, Contacted, Meeting Scheduled, etc.)
 */

/**
 * StatusBadge Component
 * Displays a styled color-coded badge based on the lead's status.
 * 
 * @param {StatusBadgeProps} props
 */
const StatusBadge = ({ status }) => {
  const activeStyle = STATUS_COLORS[status] || STATUS_COLORS['New'];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border shadow-xs select-none ${activeStyle}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
