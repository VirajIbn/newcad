import { create } from 'zustand';
import { assetAPI } from '../services/api';
import { toast } from 'react-toastify';

export const useAssetStore = create((set, get) => ({
  assets: [],
  assetTypes: [],
  stats: {},
  loading: false,
  error: null,
  filters: {
    search: '',
    type: '',
    status: '',
    location: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  setPagination: (pagination) => set({ pagination: { ...get().pagination, ...pagination } }),

  // Fetch assets
  fetchAssets: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      const { filters, pagination } = get();
      const response = await assetAPI.getAll({ ...filters, ...pagination, ...params });
      
      set({
        assets: response.data.assets,
        pagination: {
          ...get().pagination,
          total: response.data.total,
        },
      });
    } catch (error) {
      set({ error: error.message });
      toast.error('Failed to fetch assets');
    } finally {
      set({ loading: false });
    }
  },

  // Fetch asset types
  fetchAssetTypes: async () => {
    try {
      const response = await assetAPI.getTypes();
      set({ assetTypes: response.data });
    } catch (error) {
      toast.error('Failed to fetch asset types');
    }
  },

  // Fetch stats
  fetchStats: async () => {
    try {
      const response = await assetAPI.getStats();
      set({ stats: response.data });
    } catch (error) {
      toast.error('Failed to fetch asset statistics');
    }
  },

  // Create asset
  createAsset: async (assetData) => {
    try {
      set({ loading: true });
      const response = await assetAPI.create(assetData);
      set(state => ({
        assets: [response.data, ...state.assets],
      }));
      toast.success('Asset created successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to create asset');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Update asset
  updateAsset: async (id, assetData) => {
    try {
      set({ loading: true });
      const response = await assetAPI.update(id, assetData);
      set(state => ({
        assets: state.assets.map(asset => 
          asset.id === id ? response.data : asset
        ),
      }));
      toast.success('Asset updated successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to update asset');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Delete asset
  deleteAsset: async (id) => {
    try {
      set({ loading: true });
      await assetAPI.delete(id);
      set(state => ({
        assets: state.assets.filter(asset => asset.id !== id),
      }));
      toast.success('Asset deleted successfully');
    } catch (error) {
      toast.error('Failed to delete asset');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Get asset by ID
  getAssetById: async (id) => {
    try {
      const response = await assetAPI.getById(id);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch asset details');
      throw error;
    }
  },

  // Clear store
  clearStore: () => {
    set({
      assets: [],
      assetTypes: [],
      stats: {},
      loading: false,
      error: null,
      filters: {
        search: '',
        type: '',
        status: '',
        location: '',
      },
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
      },
    });
  },
})); 