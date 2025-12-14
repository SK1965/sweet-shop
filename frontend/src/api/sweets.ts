import api from '../lib/axios';

export interface Sweet {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  // description & imageUrl removed per backend/user
}

export type SweetInput = Omit<Sweet, '_id'>;

export interface SearchParams {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const getSweets = async () => {
  const response = await api.get('/sweets');
  return response.data;
};

export const searchSweets = async (params: SearchParams) => {
  const response = await api.get('/sweets/search', { params });
  return response.data;
};

export const createSweet = async (data: SweetInput) => {
  const response = await api.post('/sweets', data);
  return response.data;
};

export const deleteSweet = async (id: string) => {
  const response = await api.delete(`/sweets/${id}`);
  return response.data;
};

export const updateSweet = async (id: string, data: Partial<SweetInput>) => {
  const response = await api.put(`/sweets/${id}`, data);
  return response.data;
};

export const purchaseSweet = async (id: string, quantity: number) => {
    const response = await api.post(`/sweets/${id}/purchase`, { quantity });
    return response.data;
};
