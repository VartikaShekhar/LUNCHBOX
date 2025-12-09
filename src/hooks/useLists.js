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
      setLists(data || []);
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
      setLists([data, ...lists]);
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

