import { useState, useEffect } from 'react';

const STORAGE_KEY = 'sedo_favoritos_v1';

export const loadFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveFavorites = (favorites) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter(f => f !== id) : [...prev, id];
      saveFavorites(updated);
      return updated;
    });
  };

  return { favorites, toggleFavorite };
};

export const isFavorite = (id) => {
  const favorites = loadFavorites();
  return favorites.includes(id);
};
