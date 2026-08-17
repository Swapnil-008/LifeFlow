import api from './api';

const habitService = {
  list: () => api.get('/habits').then((res) => res.data),
  get: (id) => api.get(`/habits/${id}`).then((res) => res.data),
  create: (payload) => api.post('/habits', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/habits/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/habits/${id}`).then((res) => res.data),
  // dateKey is required — always the frontend's own local "today" (or the
  // day being toggled), e.g. from utils/mood.js#toDateKey.
  toggleComplete: (id, dateKey) => api.patch(`/habits/${id}/complete`, { date: dateKey }).then((res) => res.data),
};

export default habitService;
