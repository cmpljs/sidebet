const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

export const getToken = () => localStorage.getItem('sidebet_jwt');

export const apiRequest = async (endpoint, { method = 'GET', body, token, headers = {}, ...rest } = {}) => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  };
  if (body) config.body = JSON.stringify(body);
  if (token) config.headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'API Error');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
};

export default {
  get: (endpoint, opts = {}) => apiRequest(endpoint, { ...opts, method: 'GET' }),
  post: (endpoint, body, opts = {}) => apiRequest(endpoint, { ...opts, method: 'POST', body }),
  put: (endpoint, body, opts = {}) => apiRequest(endpoint, { ...opts, method: 'PUT', body }),
  delete: (endpoint, opts = {}) => apiRequest(endpoint, { ...opts, method: 'DELETE' }),
}; 