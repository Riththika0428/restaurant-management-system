import api from './api.js';

// Backend contract: GET /foods returns { data: Food[], meta: { page, totalPages, total } }
export const getFoods = async ({ search = '', category = 'All', page = 1, limit = 8 } = {}) => {
  const params = { page, limit };
  if (search.trim()) params.search = search.trim();
  if (category !== 'All') params.category = category;

  const { data } = await api.get('/foods', { params });
  return data;
};

export const getFeaturedFoods = async () => {
  const { data } = await api.get('/foods', { params: { featured: true, limit: 4 } });
  return data.data;
};

export const getFoodById = async (id) => {
  const { data } = await api.get(`/foods/${id}`);
  return data.data;
};