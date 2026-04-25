import api from './api';

export interface BusinessAnalyticsMetricsSnapshot {
  totalOrders: number;
  completedOrders: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
}

export interface BusinessAnalyticsUpdate {
  _id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  metricsSnapshot: BusinessAnalyticsMetricsSnapshot;
  author: {
    id: string;
    name: string;
    role: string;
  };
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaveBusinessAnalyticsUpdatePayload {
  title: string;
  summary: string;
  content: string;
  tags: string[];
  isPublished?: boolean;
}

const businessAnalyticsUpdateService = {
  async listPublished(): Promise<BusinessAnalyticsUpdate[]> {
    const response = await api.get('/business-analytics-updates');
    return response.data.data;
  },

  async getById(id: string): Promise<BusinessAnalyticsUpdate> {
    const response = await api.get(`/business-analytics-updates/${id}`);
    return response.data.data;
  },

  async create(payload: SaveBusinessAnalyticsUpdatePayload): Promise<BusinessAnalyticsUpdate> {
    const response = await api.post('/business-analytics-updates', payload);
    return response.data.data;
  },

  async update(id: string, payload: SaveBusinessAnalyticsUpdatePayload): Promise<BusinessAnalyticsUpdate> {
    const response = await api.put(`/business-analytics-updates/${id}`, payload);
    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/business-analytics-updates/${id}`);
  }
};

export default businessAnalyticsUpdateService;
