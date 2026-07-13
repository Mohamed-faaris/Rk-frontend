import api from './api';

export interface Review {
  _id: string;
  user: string;
  name: string;
  email: string;
  rating: number;
  title: string;
  comment: string;
  service: 'branding' | 'web-development' | '3d-animation' | 'uiux-design' | 'general';
  status: 'pending' | 'approved' | 'rejected';
  helpful: number;
  createdAt: string;
}

export interface CreateReviewRequest {
  rating: number;
  title: string;
  comment: string;
  service?: string;
}

export interface ReviewsResponse {
  success: boolean;
  count: number;
  total: number;
  avgRating: number;
  totalReviews: number;
  data: Review[];
}

export const reviewService = {
  getAll: async (params?: { service?: string; limit?: number; page?: number }): Promise<ReviewsResponse> => {
    const query = new URLSearchParams();
    if (params?.service && params.service !== 'all') query.append('service', params.service);
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.page) query.append('page', String(params.page));
    const response = await api.get(`/reviews?${query}`);
    return response.data;
  },

  getMyReview: async (): Promise<{ success: boolean; data: Review | null }> => {
    const response = await api.get('/reviews/my-review');
    return response.data;
  },

  create: async (data: CreateReviewRequest): Promise<{ success: boolean; message: string; data: Review }> => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateReviewRequest>): Promise<{ success: boolean; data: Review }> => {
    const response = await api.put(`/reviews/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};
