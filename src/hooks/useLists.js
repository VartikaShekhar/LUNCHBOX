import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useLists = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const listRows = data || [];
      const listIds = listRows.map((l) => l.id).filter(Boolean);
      let counts = {};

      if (listIds.length) {
        const { data: restaurantRows, error: restaurantError } = await supabase
          .from('restaurants')
          .select('id, list_id')
          .in('list_id', listIds);

        if (!restaurantError && restaurantRows) {
          counts = restaurantRows.reduce((acc, row) => {
            acc[row.list_id] = (acc[row.list_id] || 0) + 1;
            return acc;
          }, {});
        }
      }

      const hydratedLists = listRows.map((list) => ({
        ...list,
        restaurant_count: counts[list.id] || 0,
      }));

      setLists(hydratedLists);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching lists:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const createList = async (listData) => {
    try {
      const { data, error } = await supabase
        .from('lists')
        .insert([listData])
        .select()
        .single();

      if (error) throw error;
      setLists([{ ...data, restaurant_count: 0 }, ...lists]);
      return { data, error: null };
    } catch (err) {
      console.error('Error creating list:', err);
      return { data: null, error: err.message };
    }
  };

  const updateList = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('lists')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setLists(lists.map(list => list.id === id ? data : list));
      return { data, error: null };
    } catch (err) {
      console.error('Error updating list:', err);
      return { data: null, error: err.message };
    }
  };

  const deleteList = async (id) => {
    try {
      const { error } = await supabase
        .from('lists')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setLists(lists.filter(list => list.id !== id));
      return { error: null };
    } catch (err) {
      console.error('Error deleting list:', err);
      return { error: err.message };
    }
  };

  return {
    lists,
    loading,
    error,
    createList,
    updateList,
    deleteList,
    refetch: fetchLists,
  };
};
