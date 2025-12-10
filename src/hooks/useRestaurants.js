import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  }
  return [];
};

export const useRestaurants = (listId = null) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      let query = supabase.from('restaurants').select('*');
      
      if (listId) {
        // Fetch restaurants for a specific list
        query = query.eq('list_id', listId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      const normalized = (data || []).map((item) => ({
        ...item,
        tags: normalizeTags(item.tags),
      }));
      setRestaurants(normalized);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [listId]);

  const createRestaurant = async (restaurantData) => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .insert([restaurantData])
        .select()
        .single();

      if (error) throw error;
      const normalized = { ...data, tags: normalizeTags(data.tags) };
      setRestaurants([normalized, ...restaurants]);
      return { data, error: null };
    } catch (err) {
      console.error('Error creating restaurant:', err);
      return { data: null, error: err.message };
    }
  };

  const updateRestaurant = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      const normalized = { ...data, tags: normalizeTags(data.tags) };
      setRestaurants(restaurants.map(r => r.id === id ? normalized : r));
      return { data, error: null };
    } catch (err) {
      console.error('Error updating restaurant:', err);
      return { data: null, error: err.message };
    }
  };

  const deleteRestaurant = async (id) => {
    try {
      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRestaurants(restaurants.filter(r => r.id !== id));
      return { error: null };
    } catch (err) {
      console.error('Error deleting restaurant:', err);
      return { error: err.message };
    }
  };

  return {
    restaurants,
    loading,
    error,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    refetch: fetchRestaurants,
  };
};
