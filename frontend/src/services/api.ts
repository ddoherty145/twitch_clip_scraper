import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for long-running operations
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Health check
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Get available presets
export const getPresets = async () => {
  const response = await api.get('/presets');
  return response.data;
};

// Get specific preset configuration
export const getPresetConfig = async (presetName: string) => {
  const response = await api.get(`/presets/${presetName}`);
  return response.data;
};

// Start top clips scraping
export const scrapeTopClips = async (config: {
  days_back: number;
  limit: number;
  english_only: boolean;
}) => {
  const response = await api.post('/scrape/top-clips', config);
  return response.data;
};

// Start channel highlights scraping
export const scrapeChannelHighlights = async (config: {
  channels: string[];
  days_back: number;
  clips_per_channel: number;
}) => {
  const response = await api.post('/scrape/channel-highlights', config);
  return response.data;
};

// Get job status
export const getJobStatus = async (jobId: number) => {
  const response = await api.get(`/jobs/${jobId}`);
  return response.data;
};

// Get all jobs
export const getJobs = async () => {
  const response = await api.get('/jobs');
  return response.data;
};

// Download job result
export const downloadResult = async (jobId: number) => {
  const response = await api.get(`/jobs/${jobId}/download`, {
    responseType: 'blob',
  });
  return response.data;
};

// Delete job
export const deleteJob = async (jobId: number) => {
  const response = await api.delete(`/jobs/${jobId}`);
  return response.data;
};

export default api;
