const API_URL = 'http://127.0.0.1:8080/api/users/refresh-token/';

// Store the original fetch function
const originalFetch = window.fetch;

// Token refresh utility
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      // Refresh token expired, clear tokens and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/admin-login';
      return null;
    }

    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      return data.access;
    }
    
    return null;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
};

// Intercept fetch to handle token expiration
window.fetch = async (url, options = {}) => {
  const accessToken = localStorage.getItem('accessToken');
  
  // Add authorization header if token exists
  if (accessToken) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
    };
  }

  const response = await originalFetch(url, options);

  // If unauthorized (token expired), try to refresh
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    
    if (newToken) {
      // Retry the request with new token
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${newToken}`,
      };
      return originalFetch(url, options);
    }
  }

  return response;
};

// Helper function to get auth header
export const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
