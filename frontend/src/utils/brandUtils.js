export const BRAND_COLORS = [
  '#f59e0b','#10b981','#3b82f6','#8b5cf6',
  '#ec4899','#14b8a6','#f97316','#6366f1'
];

export const getInitials = (name = '') => name.slice(0, 2).toUpperCase();

export const getColor = (index) => BRAND_COLORS[index % BRAND_COLORS.length];

export const formatDate = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
    : 'N/A';

export const readLog  = (key) => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };
export const saveLog  = (key, data) => localStorage.setItem(key, JSON.stringify(data));
export const isAdmin  = () => (localStorage.getItem('userRole') || 'admin') === 'admin';
export const getToken = () => localStorage.getItem('accessToken');
