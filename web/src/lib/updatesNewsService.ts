import api from './api';

export interface UpdatesNewsItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    role: string;
  };
}

export interface SaveUpdatesNewsPayload {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  isPublished?: boolean;
}

export const normalizeGoogleDriveEmbedUrl = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return trimmed;
  }

  if (trimmed.includes('drive.google.com/file/d/') && trimmed.includes('/preview')) {
    return trimmed;
  }

  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (fileMatch?.[1]) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  }

  const openMatch = trimmed.match(/[?&]id=([^&]+)/i);
  if (openMatch?.[1] && trimmed.includes('drive.google.com')) {
    return `https://drive.google.com/file/d/${openMatch[1]}/preview`;
  }

  return trimmed;
};

const updatesNewsService = {
  async listPublished(): Promise<UpdatesNewsItem[]> {
    const response = await api.get('/updates-news');
    return response.data.data;
  },

  async listAll(): Promise<UpdatesNewsItem[]> {
    const response = await api.get('/updates-news/admin/all');
    return response.data.data;
  },

  async getById(id: string): Promise<UpdatesNewsItem> {
    const response = await api.get(`/updates-news/${id}`);
    return response.data.data;
  },

  async create(payload: SaveUpdatesNewsPayload): Promise<UpdatesNewsItem> {
    const response = await api.post('/updates-news', {
      ...payload,
      imageUrl: normalizeGoogleDriveEmbedUrl(payload.imageUrl)
    });
    return response.data.data;
  },

  async update(id: string, payload: SaveUpdatesNewsPayload): Promise<UpdatesNewsItem> {
    const response = await api.put(`/updates-news/${id}`, {
      ...payload,
      imageUrl: normalizeGoogleDriveEmbedUrl(payload.imageUrl)
    });
    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/updates-news/${id}`);
  }
};

export default updatesNewsService;