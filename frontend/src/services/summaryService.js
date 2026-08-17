import api from './api';

const summaryService = {
  getByDate: (date) => api.get(`/summaries/${date}`).then((res) => res.data),
  list: (limit = 30) => api.get('/summaries', { params: { limit } }).then((res) => res.data),
  create: (payload) => api.post('/summaries', payload).then((res) => res.data),
  update: (date, payload) => api.put(`/summaries/${date}`, payload).then((res) => res.data),
};

export default summaryService;
