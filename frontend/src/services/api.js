import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gestao-padaria.onrender.com',
});

api.interceptors.request.use(config => {
  const auth = localStorage.getItem('padariaAuth');
  if (auth) {
    config.headers['Authorization'] = 'Basic ' + auth;
  }
  return config;
});

export default api; 
