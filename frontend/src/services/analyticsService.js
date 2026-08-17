import api from './api';

const analyticsService = {
  overview: (period = 'month') => api.get('/analytics/overview', { params: { period } }).then((res) => res.data),
};

export default analyticsService;
