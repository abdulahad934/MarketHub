import { getToken } from '../utils/brandUtils';

const BASE = 'http://127.0.0.1:8080/api/products/brands';

const headers = () => ({
  Authorization: `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
});

const ok = async (res) => { if (!res.ok) throw new Error(await res.text()); return res; };

export const brandService = {
  async getAll({ page=1, pageSize=10, sortBy='id', sortDir='desc', search='' } = {}) {
    const p = new URLSearchParams({
      page, page_size: pageSize,
      ordering: sortDir === 'asc' ? sortBy : `-${sortBy}`,
      ...(search && { search }),
    });
    const data = await fetch(`${BASE}/?${p}`, { headers: headers() }).then(ok).then(r => r.json());
    if (Array.isArray(data)) return { results: data, count: data.length };
    return { results: data.results ?? [], count: data.count ?? 0 };
  },

  async delete(id) {
    await fetch(`${BASE}/${id}/`, { method: 'DELETE', headers: headers() }).then(ok);
  },

  async bulkDelete(ids = []) {
    await Promise.all(ids.map(id => brandService.delete(id)));
  },

  async create(payload) {
    return fetch(`${BASE}/`, { method: 'POST', headers: headers(), body: JSON.stringify(payload) })
      .then(ok).then(r => r.json());
  },

  async bulkCreate(list = []) {
    await Promise.all(list.map(b => brandService.create(b)));
  },
};