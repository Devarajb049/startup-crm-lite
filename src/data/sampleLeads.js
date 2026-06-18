/**
 * @typedef {Object} Lead
 * @property {string} id - Lead identifier
 * @property {string} name - Contact person's name
 * @property {string} company - Organization name
 * @property {string} email - Contact email address
 * @property {string} phone - Contact phone number
 * @property {number} value - Financial deal estimate value in USD
 * @property {'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost'} status - Pipeline stage status
 * @property {'Website' | 'Referral' | 'LinkedIn' | 'Cold Call' | 'Email Campaign' | 'Other'} source - Acquisition source channel
 * @property {string} createdAt - Calendar ISO timestamp when lead was created
 */

/**
 * Initial set of six sample leads (Indian context) used as defaults
 * if the browser's local storage is uninitialized.
 * 
 * @type {Lead[]}
 */
export const sampleLeads = [
  {
    id: 'lead-1',
    name: 'Rajesh Kumar',
    company: 'Tata Consultancy Services',
    email: 'rajesh.kumar@tcs.com',
    phone: '+91 98765 43210',
    value: 45000,
    status: 'New',
    source: 'Website',
    createdAt: '2026-06-10T12:00:00.000Z',
  },
  {
    id: 'lead-2',
    name: 'Priya Sharma',
    company: 'Reliance Industries',
    email: 'priya.sharma@ril.com',
    phone: '+91 98765 43211',
    value: 85000,
    status: 'Won',
    source: 'Referral',
    createdAt: '2026-06-01T10:30:00.000Z',
  },
  {
    id: 'lead-3',
    name: 'Amit Patel',
    company: 'Infosys',
    email: 'amit.patel@infosys.com',
    phone: '+91 98765 43212',
    value: 12000,
    status: 'Contacted',
    source: 'LinkedIn',
    createdAt: '2026-06-14T09:15:00.000Z',
  },
  {
    id: 'lead-4',
    name: 'Sunita Rao',
    company: 'Wipro Technologies',
    email: 'sunita.rao@wipro.com',
    phone: '+91 98765 43213',
    value: 27500,
    status: 'Meeting Scheduled',
    source: 'Cold Call',
    createdAt: '2026-06-12T14:45:00.000Z',
  },
  {
    id: 'lead-5',
    name: 'Vikram Malhotra',
    company: 'HDFC Bank',
    email: 'vikram.malhotra@hdfcbank.com',
    phone: '+91 98765 43214',
    value: 64000,
    status: 'Lost',
    source: 'Email Campaign',
    createdAt: '2026-05-25T11:20:00.000Z',
  },
  {
    id: 'lead-6',
    name: 'Neha Gupta',
    company: 'Zomato',
    email: 'neha.gupta@zomato.com',
    phone: '+91 98765 43215',
    value: 18500,
    status: 'New',
    source: 'Other',
    createdAt: '2026-06-16T16:00:00.000Z',
  }
];
