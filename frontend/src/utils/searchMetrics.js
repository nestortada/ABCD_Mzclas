const STORAGE_KEY = 'sedo_busquedas_v1';
const TTL = 30 * 24 * 60 * 60 * 1000; // 30 days

const loadMetrics = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const now = Date.now();
    const cleaned = {};
    Object.entries(data).forEach(([id, info]) => {
      if (now - (info.timestamp || 0) < TTL) {
        cleaned[id] = info;
      }
    });
    if (Object.keys(cleaned).length !== Object.keys(data).length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return {};
  }
};

export const incrementSearchCount = (id) => {
  const metrics = loadMetrics();
  const entry = metrics[id] || { count: 0, timestamp: 0 };
  metrics[id] = { count: entry.count + 1, timestamp: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
};

export const getTopSearches = (limit = 8) => {
  const metrics = loadMetrics();
  return Object.entries(metrics)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit)
    .map(([id]) => id);
};
