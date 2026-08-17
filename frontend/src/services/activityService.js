import api from './api';

const activityService = {
  list: (params = {}) => api.get('/activity', { params }).then((res) => res.data),
  heatmap: (days = 365) => api.get('/activity/heatmap', { params: { days } }).then((res) => res.data),
};

export default activityService;
